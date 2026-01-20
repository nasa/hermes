import * as vscode from 'vscode';

import { Dictionary } from '@gov.nasa.jpl.hermes/types';
import * as Seq from '@gov.nasa.jpl.hermes/sequence';

import { DictionaryLanguageItem } from '../dictionary';
import { RangeAssociator } from './associator';
import { mergeWorkspaceEdits } from './util';

class ParseCache<Expr extends Seq.Expression> {
    documentVersion: number;
    dictionaryVersion: number;

    expressions: Expr[];
    nextExpr: Seq.NextTokenExpression;
    tokens: RangeAssociator;
    builder: vscode.SemanticTokensBuilder;
    links: vscode.DocumentLink[];

    constructor() {
        this.documentVersion = -1;
        this.dictionaryVersion = -1;
        this.expressions = [];
        this.tokens = new RangeAssociator();
        this.builder = new vscode.SemanticTokensBuilder();
        this.nextExpr = new Seq.NextTokenExpression();
        this.links = [];
    }

    private add(tokOrExpr: Seq.Expression | Seq.TerminalToken, diagnostics: vscode.Diagnostic[]) {
        if (tokOrExpr instanceof Seq.TerminalToken) {
            const tok = tokOrExpr;

            if (tok.isOptional && tok.token.text === '') {
                this.tokens.add(tok);
                return;
            }

            // If this is terminal expression/literal token, track its character span
            if (!Seq.isInvalidRange(tok.token.range)) {
                this.tokens.add(tok);

                const semantic = tok.semanticType;
                if (semantic !== undefined) {
                    let nTokenModifiers = 0;
                    if (tok.semanticModifiers) {
                        for (const tokenModifier of tok.semanticModifiers) {
                            nTokenModifiers |= (1 << tokenModifier) >>> 0;
                        }
                    }

                    const r = tok.token.range;
                    this.builder.push(
                        r.start.line,
                        r.start.character,
                        r.end.character - r.start.character,
                        semantic,
                        nTokenModifiers
                    );
                }
            }

            if (tok.link) {
                const link = tok.link?.();
                if (link) {
                    this.links.push(link);
                }
            }
        } else {
            if (tokOrExpr.traverse) {
                for (const subToken of tokOrExpr.traverse()) {
                    this.add(subToken, diagnostics);
                }
            }
        }

        const diags = tokOrExpr.validate?.();
        if (diags) {
            diagnostics.push(...diags);
        }
    }

    update(
        documentVersion: number,
        dictionaryVersion: number,
        expressions: Expr[]
    ): vscode.Diagnostic[] {
        this.documentVersion = documentVersion;
        this.dictionaryVersion = dictionaryVersion;
        this.expressions = expressions;

        this.tokens.clear();
        this.builder = new vscode.SemanticTokensBuilder();
        this.links = [];

        const diagnostics: vscode.Diagnostic[] = [];
        for (const subExpr of this.expressions) {
            this.add(subExpr, diagnostics);
        }

        this.add(this.nextExpr, diagnostics);

        return diagnostics;
    }
}

export interface LanguageOptions {
    /**
     * Characters that trigger the {@link vscode.CompletionItemProvider}
     * This should usually be deliminators between command arguments as well as
     * 'in-between' characters inside keywords or mnemonics.
     * Default: `[" ", ","]`
     */
    completionTriggers: string[];

    /**
     * Characters that trigger the {@link vscode.SignatureHelpProvider}
     * These should be the deliminators between command arguments.
     * Default: `[" ", ","]`
     */
    signatureTriggers: string[];
}

export abstract class SequenceLanguage<Expr extends Seq.Expression> implements
    vscode.CompletionItemProvider,
    vscode.DocumentHighlightProvider,
    vscode.HoverProvider,
    vscode.SignatureHelpProvider,
    vscode.DocumentSemanticTokensProvider,
    vscode.DocumentLinkProvider<Seq.DocumentLink>,
    vscode.DefinitionProvider,
    vscode.CodeLensProvider,
    vscode.CodeActionProvider,
    vscode.Disposable {

    protected cache: Map<string, ParseCache<Expr>>;
    protected dictionaryVersion: number = 0;
    protected asyncReparse = new vscode.EventEmitter<void>();
    protected parseEvent = new vscode.EventEmitter<{
        document: vscode.TextDocument;
        parsed: ParseCache<Expr>
    }>;
    protected diagnostics: vscode.DiagnosticCollection;

    protected subscriptions: vscode.Disposable[];

    onDidChangeSemanticTokens = this.asyncReparse.event;
    onDidChangeCodeLenses = this.asyncReparse.event;

    onDidParseDocument = this.parseEvent.event;

    constructor(
        readonly languageId: string,
        readonly dictionaryProvider: DictionaryLanguageItem,

        options?: Partial<LanguageOptions>
    ) {
        this.cache = new Map();
        this.diagnostics = vscode.languages.createDiagnosticCollection(languageId);

        const fullOptions: LanguageOptions = {
            completionTriggers: [' ', ','],
            signatureTriggers: [' ', ','],
            ...options,
        };

        this.subscriptions = [
            this.dictionaryProvider.onDictionaryChanged(() => {
                this.dictionaryVersion++;
                this.asyncReparse.fire();
            }),
            vscode.workspace.onDidCloseTextDocument(doc => this.diagnostics.delete(doc.uri)),
            vscode.workspace.onDidCloseTextDocument(doc => {
                if (this.diagnostics.has(doc.uri)) {
                    this.diagnostics.delete(doc.uri);
                    this.cache.delete(doc.uri.toString());
                }
            }),
            vscode.commands.registerCommand(`hermes.language.${languageId}.parse`, (doc: vscode.TextDocument) => {
                this.get(doc, undefined, true)
                    .then(() => {
                        this.refresh(doc.uri);
                    });
            }),

            vscode.languages.registerHoverProvider(this.languageId, this),
            vscode.languages.registerDocumentHighlightProvider(this.languageId, this),
            vscode.languages.registerCompletionItemProvider(this.languageId, this, ...fullOptions.completionTriggers),
            vscode.languages.registerSignatureHelpProvider(this.languageId, this, ...fullOptions.signatureTriggers),
            vscode.languages.registerDocumentLinkProvider(this.languageId, this),
            vscode.languages.registerDefinitionProvider(this.languageId, this),
            vscode.languages.registerCodeLensProvider(this.languageId, this),
            vscode.languages.registerCodeActionsProvider(this.languageId, this),
            vscode.languages.registerDocumentSemanticTokensProvider(
                this.languageId,
                this,
                new vscode.SemanticTokensLegend([
                    'namespace',
                    'class',
                    'enum',
                    'interface',
                    'struct',
                    'typeParameter',
                    'type',
                    'parameter',
                    'variable',
                    'property',
                    'enumMember',
                    'decorator',
                    'event',
                    'function',
                    'method',
                    'macro',
                    'label',
                    'comment',
                    'string',
                    'keyword',
                    'number',
                    'regexp',
                    'operator',
                ])
            ),
        ];
    }

    get dictionary(): Dictionary | undefined {
        return this.dictionaryProvider.active;
    }

    /**
     * Parse a text document into a set of expressions. The provided token and expression
     * behaviors will be integrated into VSCode language features
     * @param document Document to parse
     * @param token Optional cancellation token to stop parsing asynchronous parsing implementation
     * @returns A set of annotated expressions that contain tokens across the document
     */
    protected abstract parse(
        document: vscode.TextDocument,
        nextTokens: Seq.NextTokenExpression,
        token?: vscode.CancellationToken
    ): vscode.ProviderResult<Expr[]>;

    /**
     * Parse a text document to get the parsing cache.
     * If the document has already been parsed and the latest parsing is up to date
     * with the requested document version, return the previously generated parsing cache.
     * @param document Document to parse
     * @param force Override the parsing cache to force a reparse of the document regardless of version
     * @returns Promise to the latest parsing cache of this document
     */
    protected async get(
        document: vscode.TextDocument,
        token?: vscode.CancellationToken,
        force: boolean = false
    ): Promise<ParseCache<Expr>> {
        const uriStr = document.uri.toString();
        if (!force) {
            // Check if we have an up-to-date cache
            const cache = this.cache.get(uriStr);
            if (cache) {
                if (cache.documentVersion >= document.version &&
                    cache.dictionaryVersion >= this.dictionaryVersion
                ) {
                    return cache;
                }
            }
        }

        const cache = this.cache.get(uriStr) ?? new ParseCache();
        cache.nextExpr.clear();
        const diagnostics = cache.update(
            document.version,
            this.dictionaryVersion,
            (await this.parse(document, cache.nextExpr, token)) ?? []
        );

        // Refresh the diagnostics
        this.diagnostics.set(document.uri, diagnostics);

        // Update the cache
        this.cache.set(document.uri.toString(), cache);

        this.parseEvent.fire({ document, parsed: cache });
        return cache;
    }

    async provideDocumentExpressions(
        document: vscode.TextDocument,
        token?: vscode.CancellationToken,
    ): Promise<Expr[]> {
        return (await this.get(document, token)).expressions;
    }

    /**
     * Refresh a document's cache & diagnostics without triggering a reparse
     * @param uri URI to update cache for
     */
    refresh(uri: vscode.Uri) {
        const cache = this.cache.get(uri.toString());
        if (cache) {
            const diagnostics = cache.update(
                cache.documentVersion,
                cache.dictionaryVersion,
                cache.expressions
            );

            this.diagnostics.set(uri, diagnostics);
        }
    }

    /**
     * Refresh all cache and diagnostics
     */
    refreshAll() {
        for (const [uriStr, cache] of this.cache.entries()) {
            const diagnostics = cache.update(
                cache.documentVersion,
                cache.dictionaryVersion,
                cache.expressions
            );

            this.diagnostics.set(vscode.Uri.parse(uriStr), diagnostics);
        }
    }

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ) {
        const parsed = await this.get(document, token);
        const annotated = parsed.tokens.get(position);

        if (!annotated) {
            return null;
        }

        return {
            contents: annotated.documentation?.() ?? [],
            range: annotated.token.range
        };
    }

    async provideDocumentHighlights(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ) {
        const parsed = await this.get(document, token);
        const annotated = parsed.tokens.get(position);

        if (!annotated) {
            return null;
        }

        return [{ range: annotated.token.range }];
    }

    /**
     * Normally we can compute the completion item either from the current token
     * or from the statement next expected token. We can't do much with an empty line
     * you can implement this function to provide the set of completion items to show
     * on an empty line.
     * @returns Completion items to provide on trigger on empty line
     */
    provideEmptyLineCompletionItems(): vscode.CompletionItem[] | null | undefined {
        return null;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ) {
        const parsed = await this.get(document, token);
        const nextToken = parsed.tokens.getClose(position, 'after');
        if (nextToken) {
            return nextToken.completionItems?.();
        } else if (!parsed.tokens.getClose(position, 'before')) {
            // Do not provide completions if we are in a comment
            // The inverse of this is if the line is empty
            if (document.lineAt(position.line).isEmptyOrWhitespace) {
                return this.provideEmptyLineCompletionItems();
            }
        }

        // There are no more tokens expected
    }

    async provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ) {
        const nextToken = (await this.get(
            document, token
        )).tokens.getClose(position, 'after');

        if (!nextToken) {
            return;
        }

        const signatureInfo = nextToken.parent?.signature?.();
        if (!signatureInfo) {
            return;
        }

        const signature = new vscode.SignatureHelp();
        signature.signatures = [signatureInfo];
        signature.activeParameter = nextToken.index;

        return signature;
    }

    async provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.SemanticTokens> {
        const parsed = await this.get(document, token);
        return parsed.builder.build();
    }

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ) {
        const parsed = await this.get(document, token);
        const currentToken = parsed.tokens.get(position);
        return await currentToken?.definition?.();
    }

    async provideDocumentLinks(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ) {
        const parsed = await this.get(document, token);
        return parsed.links;
    }

    async provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens[]> {
        const parsed = await this.get(document, token);

        const out: vscode.CodeLens[] = [];
        for (const expr of parsed.expressions) {
            const range = Seq.range(expr);
            if (!range) {
                continue;
            }

            try {
                const exprCommands = expr.codelens?.(document.uri);
                if (exprCommands) {
                    for (const cmd of exprCommands) {
                        out.push(new vscode.CodeLens(range, cmd));
                    }
                }
            } catch (e) {
                console.error("failed to run codelens", e);
            }
        }

        return out;
    }

    async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ) {
        const parsed = await this.get(document, token);

        const out = new Map<string, vscode.CodeAction>();
        for (const tok of parsed.tokens.all(range)) {
            const actions = tok?.codeActions?.(document, context);
            if (actions) {
                for (const action of actions) {
                    const existingAction = out.get(action.title);
                    if (!existingAction) {
                        // New action
                        out.set(action.title, action);
                    } else {
                        // Merge together like actions
                        existingAction.edit = mergeWorkspaceEdits(
                            existingAction.edit,
                            action.edit
                        );
                    }
                }
            }
        }

        return Array.from(out.values());
    }

    resolveDocumentLink(
        link: Seq.DocumentLink,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<Seq.DocumentLink> {
        return link.resolve?.(token);
    }

    dispose() {
        for (const disposable of this.subscriptions) {
            disposable.dispose();
        }
    }
}

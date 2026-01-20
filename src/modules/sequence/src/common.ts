import * as vscode from 'vscode';

export interface Token {
    text: string;
    range: vscode.Range;
}


export enum SemanticTokenType {
    namespace, // For identifiers that declare or reference a namespace, module, or package.
    class, // For identifiers that declare or reference a class type.
    enum, // For identifiers that declare or reference an enumeration type.
    interface, // For identifiers that declare or reference an interface type.
    struct, // For identifiers that declare or reference a struct type.
    typeParameter, // For identifiers that declare or reference a type parameter.
    type, // For identifiers that declare or reference a type that is not covered above.
    parameter, // For identifiers that declare or reference a function or method parameters.
    variable, // For identifiers that declare or reference a local or global variable.
    property, // For identifiers that declare or reference a member property, member field, or member variable.
    enumMember, // For identifiers that declare or reference an enumeration property, constant, or member.
    decorator, // For identifiers that declare or reference decorators and annotations.
    event, // For identifiers that declare an event property.
    function, // For identifiers that declare a function.
    method, // For identifiers that declare a member function or method.
    macro, // For identifiers that declare a macro.
    label, // For identifiers that declare a label.
    comment, // For tokens that represent a comment.
    string, // For tokens that represent a string literal.
    keyword, // For tokens that represent a language keyword.
    number, // For tokens that represent a number literal.
    regexp, // For tokens that represent a regular expression literal.
    operator, // For tokens that represent an operator.
}

export enum SemanticTokenModifier {
    declaration, // For declarations of symbols.
    definition, // For definitions of symbols, for example, in header files.
    readonly, // For readonly variables and member fields (constants).
    static, // For class members (static members).
    deprecated, // For symbols that should no longer be used.
    abstract, // For types and member functions that are abstract.
    async, // For functions that are marked async.
    modification, // For variable references where the variable is assigned to.
    documentation, // For occurrences of symbols in documentation.
    defaultLibrary, // For symbols that are part of the standard library.
}

export interface DocumentLink extends vscode.DocumentLink {
    /**
     * Callback to resolve the {@link vscode.DocumentLink.target} during {@link vscode.DocumentLinkProvider.resolveDocumentLink}
     * This should fill in the {@link vscode.DocumentLink.target target} member if a match is found
     * @param token Token to cancel the resolution
     */
    resolve?(token?: vscode.CancellationToken): vscode.ProviderResult<this>;
}

/**
 * An expression is a grouping of other expressions or a wrapper around a terminal token.
 */
export interface Expression<S = unknown, V = unknown> {
    /**
     * The parent expression that provides the signature information
     */
    parent?: Expression;

    /**
     * Index in the parent signature where this lives
     */
    index: number;

    /**
     * Custom object that describes what kind of data this expression should hold.
     * This is expression specific and is passed by the parent expression during parsing.
     */
    schema: S;

    /**
     * Merge child token parsing results into a parsed expression
     */
    parse(): V;

    /**
     * (optional) Markdown used for annotating a token on hover
     * or during command signature display.
     */
    documentation?(): vscode.MarkdownString[];

    /**
     * Iterate through every token or sub-expression in this expression.
     * This should be traversed in left-to-right order.
     */
    traverse(): Generator<Expression<unknown> | TerminalToken<unknown>>;

    /**
     * The expected signature of this finalized expression.
     * Use only if this is a non-terminal expression.
     */
    signature?(): vscode.SignatureInformation | null | undefined;

    /**
     * Validate the expression as a whole.
     * This is called alongside validation to each {@link TerminalToken}.
     */
    validate?(): vscode.Diagnostic[] | null | undefined;

    /**
     * Attach a codelens action to this expression
     */
    codelens?(uri: vscode.Uri): vscode.Command[];
}

/**
 * A terminal token is the base compiler wrapper around a lexical token
 * It can have no children and provides language features at the character range level.
 * 
 * A TerminalToken is always a child to some expression. The expression will place the
 * token in some rule and hold information about where in the parent signature it lives.
 */
export abstract class TerminalToken<S = unknown, V = unknown> {
    parent: Expression;

    /**
     * If this is optional, don't perform validation if the token is empty
     */
    isOptional?: boolean;

    /**
     * Highlight this token with VSCode semantic coloring.
     */
    semanticType?: SemanticTokenType;

    /**
     * Apply a modifier to the semantic token type.
     * If the {@link TerminalToken.semanticType} is not provided, this will be ignored.
     */
    semanticModifiers?: SemanticTokenModifier[];

    /**
     * @param token Base lexical token that holds the text and range
     * @param parent Parent expression holding the schema to validate against
     */
    constructor(
        parent: Expression,
        readonly schema: S,
        readonly index: number,
        readonly token: Token
    ) {
        this.parent = parent;
    }

    /**
     * Parse the 'text' in this token into a value
     */
    abstract parse(): V;

    /**
     * (optional) Markdown used for annotating a token on hover
     * or during command signature display.
     */
    documentation?(): vscode.MarkdownString[];

    /**
     * This token is a clickable link to another file or resource.
     * It is recommended to use this for file cross-references such as sequence run
     * commands or uplink/downlink commands.
     */
    link?(): DocumentLink | null | undefined;

    /**
     * Provide a link/resource to the definition behind a token
     * This should be used for command mnemonics or enum members that
     * can link to FSW source code.
     */
    definition?(): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]>;

    /**
     * Get the completion items for the this token
     */
    completionItems?(): vscode.CompletionItem[] | null | undefined;

    /**
     * Validate the expression or token as a whole.
     * This is called alongside validation to each token.
     */
    validate?(): vscode.Diagnostic[] | null | undefined;

    /**
     * Provide the code actions on this token
     * @param document The current text document, useful for generate workspace edits
     * @param context CodeActionContext from the VSCode provider
     */
    codeActions?(
        document: vscode.TextDocument,
        context: vscode.CodeActionContext,
    ): vscode.CodeAction[] | null | undefined;
}

export interface TerminalTokenConstructor<
    Schema,
    Value,
    E extends Expression,
    Terminal extends TerminalToken<any, Value>
> {
    new(parent: E, schema: Schema, index: number, token: Token): Terminal;
}

%{
package parser

import "github.com/nasa/hermes/cmd/protocolc/ast"
%}

%union{
  Pos ast.Pos

  Nodes ast.Nodes

  Node  ast.Node
  Decl  ast.Decl
  Expr  ast.Expr
  Type  ast.Type

  SymbolDeclName *ast.SymbolDeclName
  ExternDeclName *ast.ExternDeclName

  Bool      bool
  LitExpr   *ast.LitExpr
  LitExprs  []*ast.LitExpr
  Ident     *ast.Ident
  TypeSize  *ast.TypeSize
  Args      []ast.Expr
  ParamArgs []*ast.Ident

  TypeCase *ast.TypeCase
  MatchType []*ast.TypeCase

  ByteOrder     ast.ByteOrderKind
  Field         *ast.Field
  Fields        []*ast.Field
  EnumMember    *ast.EnumMember
  EnumMembers   []*ast.EnumMember
  BitmaskMember *ast.BitmaskMember
  BitmaskMembers []*ast.BitmaskMember
}

%token<Pos> LexError
%token<Pos> PAREN_OPEN // '('
%token<Pos> PAREN_CLOSE // ')'
%token<Pos> BRACKET_OPEN // '['
%token<Pos> BRACKET_CLOSE // ']'
%token<Pos> CURLY_OPEN // '{'
%token<Pos> CURLY_CLOSE // '}'
%token<Pos> SEMI // ';'
%token<Pos> COLON // ':'
%token<Pos> DOT // '.'
%token<Pos> STAR // '*'
%token<Pos> COMMA // ','
%token<Pos> EQUAL // '='
%token<Pos> QUESTION // '?'
%token<Pos> PIPE // '|'
%token<Pos> DIRECT // '>'
%token<Pos> DOLLAR // '$'
%token<Pos> ARROW  // '->'

// Keywords
%token<Pos> STRUCT
%token<Pos> STRING
%token<Pos> ENUM
%token<Pos> BITMASK
%token<Pos> TYPE
%token<Pos> EXTERN
%token<Pos> MARSHAL
%token<Pos> UNMARSHAL
%token<Pos> IMPORT

%token <LitExpr> Literal
%token <Ident> Ident

%type <Nodes> program
%type <Nodes> nodes
%type <Decl> decl
%type <Expr> expr

%type <Bool> marshalOrUnmarshal
%type <Args> args
%type <Args> argsExpr
%type <ParamArgs> paramExpr
%type <ParamArgs> paramArgs
%type <LitExprs> litList
%type <SymbolDeclName> symbolDeclName
%type <ExternDeclName> externDeclName

%type <ByteOrder> byteOrder
%type <Field> structMember
%type <Fields> structMembers

%type <TypeSize> typeSize
%type <Type> typeName
%type <Type> typeRef

%type <TypeCase> typeCase
%type <MatchType> matchType

%type <EnumMember> enumMember
%type <EnumMembers> enumMembers
%type <BitmaskMember> bitmaskMember
%type <BitmaskMembers> bitmaskMembers

%start program

%%

program:
    // Empty files
    {
        $$ = ast.Nodes{}
        yylex.(*lex).SetResult($$)
    }

    | nodes
    {
        $$ = $1
        yylex.(*lex).SetResult($$)
    }

nodes:
    decl            { $$ = ast.Nodes{ $1 } }
    | nodes decl    { $$ = append($1, $2) }

expr:
    Ident     { $$ = $1 }
    | Literal { $$ = $1 }

argsExpr:
    expr { $$ = []ast.Expr{$1} }
    | argsExpr COMMA expr { $$ = append($1, $3) }

args:
    { $$ = []ast.Expr{} }
    | argsExpr { $$ = $1 }

typeSize:
    BRACKET_OPEN typeName BRACKET_CLOSE
    { $$ = &ast.TypeSize{ Kind: ast.DYNAMIC, Dynamic: $2, Open: $1, Close: $3 } }

    | BRACKET_OPEN Literal BRACKET_CLOSE
    { $$ = &ast.TypeSize{ Kind: ast.STATIC, Static: $2, Open: $1, Close: $3 } }

    | BRACKET_OPEN STAR BRACKET_CLOSE
    { $$ = &ast.TypeSize{ Kind: ast.FILL, Open: $1, Close: $3 } }

typeName:
    typeSize STRING      { $$ = &ast.StringType{ Size: $1, Token: $2 } }
    | typeSize typeName  { $$ = &ast.ArrayType{ Size: $1, Elt: $2, } }
    | Ident              { $$ = &ast.RefType{ Name: $1 } }
    | Ident PAREN_OPEN args PAREN_CLOSE
    { $$ = &ast.RefType{ Name: $1, Args: ast.Group[[]ast.Expr]{ Open: $2, Members: $3, Close: $4 } } }

typeRef:
    typeName
    { $$ = $1 }

    | CURLY_OPEN matchType CURLY_CLOSE
    { $$ = &ast.MatchType{ Cases: ast.Group[[]*ast.TypeCase]{ Open: $1, Members: $2, Close: $3 } } }

    | typeName ARROW CURLY_OPEN matchType CURLY_CLOSE
    { $$ = &ast.MatchType{ Reader: $1, Cases: ast.Group[[]*ast.TypeCase]{ Open: $3, Members: $4, Close: $5 } } }

    | typeName ARROW Ident PAREN_OPEN args PAREN_CLOSE
    { $$ = &ast.TransformType{ Initial: $1, Name: $3, Args: ast.Group[[]ast.Expr]{ Open: $4, Members: $5, Close: $6 } } }

typeCase:
    Literal COLON typeRef
    { $$ = &ast.TypeCase{ Cond: $1, Type: $3 } }

    // Default case
    | typeRef
    { $$ = &ast.TypeCase{ Type: $1 } }

matchType:
    typeCase
    { $$ = []*ast.TypeCase{$1} }

    | matchType typeCase
    { $$ = append($1, $2) }

marshalOrUnmarshal:
    MARSHAL { $$ = true }
    | UNMARSHAL { $$ = false }

structMember:
    Ident COLON typeRef
    { $$ = &ast.Field{ Name: $1, Type: $3 } }

    | Ident COLON typeRef EQUAL Literal
    { $$ = &ast.Field{ Name: $1, Type: $3, Initializer: $5 } }

    | Ident COLON Literal QUESTION typeRef
    { $$ = &ast.Field{ Name: $1, Type: $5, Condition: $3 } }

    | BITMASK CURLY_OPEN bitmaskMembers CURLY_CLOSE
    { $$ = &ast.Field{ Type: &ast.BitmaskType{ Members: ast.Group[[]*ast.BitmaskMember]{ Open: $1, Members: $3, Close: $4 } } } }

    | BRACKET_OPEN Literal BRACKET_CLOSE
    { $$ = &ast.Field{ Type: &ast.PadType{ Size: $2 } } }

    | marshalOrUnmarshal PAREN_OPEN Ident COLON Literal PAREN_CLOSE
    { $$ = &ast.Field{ Arg: &ast.Param{ IsMarshal: $1, Name: $3, Type: $5 } } }

    | marshalOrUnmarshal Literal
    { $$ = &ast.Field{ Literal: &ast.FieldLiteral{ IsMarshal: $1, Code: $2 } } }

structMembers:
    structMember
    { $$ = []*ast.Field{$1} }

    | structMembers structMember
    { $$ = append($1, $2) }

byteOrder:
    STAR           { $$ = ast.BIG }
    | DOT          { $$ = ast.LITTLE }

bitmaskMember:
    Ident COLON Literal
    { $$ = &ast.BitmaskMember{ Name: $1, Value: $3 } }

    // Transform scalar type into this type
    // Only scalars are supported (primitives + enums)
    | Ident COLON Literal ARROW typeName
    { $$ = &ast.BitmaskMember{ Name: $1, Value: $3, Type: $5 } }

    // Bitmask members with initializers for marshaling
    | Ident COLON Literal EQUAL Literal
    { $$ = &ast.BitmaskMember{ Name: $1, Value: $3, Initializer: $5 } }

    | Ident COLON Literal ARROW typeName EQUAL Literal
    { $$ = &ast.BitmaskMember{ Name: $1, Value: $3, Type: $5, Initializer: $7 } }

    // Reserved bits
    // These will always encode as `0`.
    // Decoding will ignore them
    | COLON Literal
    { $$ = &ast.BitmaskMember{ Value: $2 } }

bitmaskMembers:
    bitmaskMember { $$ = []*ast.BitmaskMember{$1} }
    | bitmaskMembers bitmaskMember { $$ = append($1, $2) }

enumMember:
    Ident EQUAL Literal { $$ = &ast.EnumMember{ Name: $1, Value: $3 } }

enumMembers:
    enumMember { $$ = []*ast.EnumMember{$1} }
    | enumMembers enumMember { $$ = append($1, $2) }

paramExpr:
    Ident { $$ = []*ast.Ident{$1} }
    | paramExpr COMMA Ident { $$ = append($1, $3) }

paramArgs:
    { $$ = []*ast.Ident{} }
    | paramExpr { $$ = $1 }

symbolDeclName:
    Ident
    { $$ = &ast.SymbolDeclName{ Name: $1 } }
    | Ident PAREN_OPEN paramArgs PAREN_CLOSE
    { $$ = &ast.SymbolDeclName{ Name: $1, Args: ast.Group[[]*ast.Ident]{ Open: $2, Members: $3, Close: $4 } } }

litList:
    Literal
    { $$ = []*ast.LitExpr{$1} }

    | litList COMMA Literal
    { $$ = append($1, $3) }

externDeclName:
    Ident
    { $$ = &ast.ExternDeclName{ Name: $1 } }
    | Ident PAREN_OPEN litList PAREN_CLOSE
    { $$ = &ast.ExternDeclName{ Name: $1, Args: ast.Group[[]*ast.LitExpr]{ Open: $2, Members: $3, Close: $4 } } }

decl:
    STRUCT symbolDeclName byteOrder CURLY_OPEN structMembers CURLY_CLOSE
    { $$ = &ast.StructTypeDecl{ Name: $2, ByteOrder: $3, Fields: ast.Group[[]*ast.Field]{ Open: $4, Members: $5,  Close: $6 } } }

    | ENUM symbolDeclName typeName CURLY_OPEN enumMembers CURLY_CLOSE
    { $$ = &ast.EnumTypeDecl{ Name: $2, EncodeType: $3, Members: ast.Group[[]*ast.EnumMember]{ Open: $4, Members: $5, Close: $6 } } }

    | TYPE symbolDeclName EQUAL typeName
    { $$ = &ast.AliasTypeDecl{ Name: $2, Type: $4 } }

    | EXTERN externDeclName COLON Literal
    { $$ = &ast.ExternTypeDecl{ Name: $2, Type: $4 } }

    | IMPORT Literal
    { $$ = &ast.ExternImport { Pkg: $2 } }

%%

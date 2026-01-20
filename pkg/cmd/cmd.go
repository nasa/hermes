package cmd

import (
	"fmt"
	"regexp"

	"github.com/nasa/hermes/pkg/host"
	"github.com/nasa/hermes/pkg/pb"
)

type ArgumentOptions struct {
	// Dynamically sized arrays read until the end of the tokens
	OmitLengthPrefix bool
}

type cmdOption struct {
	fieldOptions func(*pb.Field) ArgumentOptions
}

type CommandOption func(*cmdOption)

func omitLengthPrefix(f *pb.Field) ArgumentOptions {
	omitPrefix, _ := regexp.Match("\"omitLengthPrefix\"[\\s]*:[\\s]*true", []byte(f.Metadata))
	return ArgumentOptions{
		OmitLengthPrefix: omitPrefix,
	}
}

// Normally, including `omitLengthPrefix: true` in field metadata
// will tell the parser to keep parsing dynamically sized arrays until EOF
// This option will disable this behavior
func WithoutOmitLengthPrefix() CommandOption {
	return func(co *cmdOption) {
		co.fieldOptions = nil
	}
}

func ParseCommand(
	def *pb.CommandDef,
	args []string,
	opts ...CommandOption,
) ([]*pb.Value, error) {
	cmdOpts := cmdOption{fieldOptions: omitLengthPrefix}

	for _, o := range opts {
		o(&cmdOpts)
	}

	argsBuf := arguments{in: args}

	newArgs := []*pb.Value{}
	for i, argDef := range def.Arguments {
		argOpt := ArgumentOptions{}
		if cmdOpts.fieldOptions != nil {
			argOpt = cmdOpts.fieldOptions(argDef)
		}

		arg, err := argGet(&argsBuf, argDef.GetType(), &cmdOpts, argOpt)
		if err != nil {
			return nil, fmt.Errorf(
				"invalid argument argIndex=%d argName=%s argType=%T: %w",
				i, argDef.GetName(), argDef.GetType().GetValue(), err,
			)
		}

		newArgs = append(newArgs, arg)
	}

	if len(argsBuf.in) > 0 {
		return nil, fmt.Errorf("too many arguments, got %d expected %d", len(newArgs)+len(argsBuf.in), len(newArgs))
	}

	return newArgs, nil
}

type BasicCommandParser struct{}

// ParseCommand implements host.RawCmdFsw.
func (f *BasicCommandParser) ParseCommand(
	dict *host.DictionaryNamespace,
	cmd *pb.RawCommandValue,
	opts ...CommandOption,
) (*pb.CommandValue, error) {
	tokens := Lex(cmd.GetCommand())

	mnemonic := tokens[0]
	args := tokens[1:]

	// Look up the command
	def := dict.Commands.Get1(mnemonic)
	if def == nil {
		return nil, fmt.Errorf("no command with mnemonic: %s", mnemonic)
	}

	parsedArgs, err := ParseCommand(def, args, opts...)
	if err != nil {
		return nil, err
	}

	return &pb.CommandValue{
		Def:      def,
		Args:     parsedArgs,
		Metadata: cmd.Metadata,
		Options:  cmd.Options,
	}, nil
}

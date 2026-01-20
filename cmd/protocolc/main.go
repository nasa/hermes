package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/nasa/hermes/cmd/protocolc/builtin"
	"github.com/nasa/hermes/cmd/protocolc/compiler"
	"github.com/nasa/hermes/cmd/protocolc/parser"
)

var pkg = "main"
var output = ""

func init() {
	flag.StringVar(&pkg, "package", pkg, "Package to generate code for")
	flag.StringVar(&pkg, "p", pkg, "Package to generate code for")
	flag.StringVar(&output, "output", output, "Output file to place Go generated code")
	flag.StringVar(&output, "o", output, "Output file to place Go generated code")
}

func run(args []string) error {
	opts := []compiler.Option{
		// Add any special options here
		compiler.WithTransformType("drop", builtin.Drop),
		compiler.WithTypeConstructorF("Telemetry", builtin.Telemetry),
		compiler.WithTypeConstructorF("Event", builtin.Event),
		compiler.WithTypeConstructorF("Command", builtin.Command),
		compiler.WithTransformType("EventArgs", builtin.EventArgs),
		compiler.WithTransformType("Method", builtin.Method),
		compiler.WithTransformType("MethodWithErr", builtin.MethodWithErr),
	}

	// Parse all the input files
	for _, fnArg := range args {
		s1 := strings.Split(fnArg, ":")

		filename := s1[0]
		fileArgs := s1[1:]

		// Load the dictionary from disk
		contentsRaw, err := os.ReadFile(filename)
		if err != nil {
			return fmt.Errorf("failed to read stream file %s: %w", filename, err)
		}

		content := string(contentsRaw)

		// Replace any arguments with their values from the commandline
		for i, arg := range fileArgs {
			argFmt := fmt.Sprintf("$%d", i+1)
			content = strings.ReplaceAll(content, argFmt, arg)
		}

		doc, err := parser.Parse(filename, []byte(contentsRaw))
		if err != nil {
			return err
		}

		opts = append(opts, compiler.WithDocument(doc))
	}

	c, err := compiler.NewCompiler(opts...)
	if err != nil {
		return err
	}

	if !c.Compile() {
		os.Stderr.Write([]byte(strings.Join(append(c.Messages(), ""), "\n")))
		return fmt.Errorf("failed to compile document")
	}

	msg := c.Messages()
	if len(msg) > 0 {
		msg = append(msg, "")
		os.Stderr.Write([]byte(strings.Join(msg, "\n")))
	}

	doc, err := c.Codegen(pkg)
	if err != nil {
		os.Stderr.Write([]byte(strings.Join(append(c.Messages(), ""), "\n")))
		return fmt.Errorf("failed to generate document")
	}

	return os.WriteFile(output, []byte(doc), 0600)
}

func main() {
	flag.Parse()

	if flag.NArg() == 0 {
		fmt.Fprintln(
			flag.CommandLine.Output(),
			`protocolc is a compiler that reads '.protocol' files and generates Go code for decoding generic packets.`,
		)

		flag.Usage()
		os.Exit(1)
	}

	if err := run(flag.Args()); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

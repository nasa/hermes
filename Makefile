all: go vscode
go: out/yamcs-recorder

.PHONY: release go vscode all clean

out:
	mkdir -p out

FORCE: ;

clean: FORCE
	rm -rf out

release: out/yamcs-recorder

out/yamcs-recorder: out FORCE
	go build ${GO_FLAGS} -o out/yamcs-recorder github.com/nasa/hermes/cmd/yamcs-recorder

vscode: FORCE
	yarn build

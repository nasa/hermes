all: go vscode
go: out/protocolc out/backend out/uplink out/sqlrecord

.PHONY: release go vscode all clean

out:
	mkdir -p out

FORCE: ;

clean: FORCE
	rm -rf out

release: vscode out/uplink out/backend out/sqlrecord

protocol: out/protocolc
	./out/protocolc -p fprime -o pkg/fprime/packet.go ./pkg/fprime/fprime.protocol
	./out/protocolc -p spp -o pkg/spp/packet.go ./pkg/spp/spp.protocol

out/protocolc: out FORCE
	go build ${GO_FLAGS} -o out/protocolc github.com/nasa/hermes/cmd/protocolc

out/fprime-decode: out FORCE
	go build ${GO_FLAGS} -o out/fprime-decode github.com/nasa/hermes/cmd/fprime-decode

out/dict: out FORCE
	go build ${GO_FLAGS} -o out/dict github.com/nasa/hermes/cmd/dict

out/uplink: out FORCE
	go build ${GO_FLAGS} -o out/uplink github.com/nasa/hermes/cmd/uplink

out/backend: out FORCE
	go build ${GO_FLAGS} -o out/backend github.com/nasa/hermes/cmd/backend

out/sqlrecord: out FORCE
	go build ${GO_FLAGS} -o out/sqlrecord github.com/nasa/hermes/cmd/sqlrecord

out/downlink-pb-to-json: out FORCE
	go build ${GO_FLAGS} -o out/downlink-pb-to-json github.com/nasa/hermes/cmd/downlink-pb-to-json

vscode: out FORCE
	yarn build

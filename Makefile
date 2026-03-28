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

out/hermes-fprime-dictionary: out FORCE
	cargo build --release --bin hermes-fprime-dictionary
	cp target/release/hermes-fprime-dictionary out/

vscode: out FORCE
	yarn build

# Integration testing targets
.PHONY: test-integration test-integration-setup test-integration-teardown test-integration-run build-fprime-cache

# Build F Prime cache image (for nightly builds)
build-fprime-cache:
	docker build -f Dockerfile.fprime -t fprime-ref:local .

# Build and start the Docker container for testing
test-integration-setup:
	docker compose -f test/docker-compose.yml build
	docker compose -f test/docker-compose.yml up -d
	@echo "Waiting for services to be ready..."
	@sleep 10

# Run integration tests
test-integration-run:
	go test -v ./test/... -timeout 5m

# Run integration tests
test-integration-logs:
	docker compose -f test/docker-compose.yml logs

# Stop and remove Docker containers
test-integration-teardown:
	docker compose -f test/docker-compose.yml down -v

# Run full integration test suite (setup + test + teardown)
test-integration: test-integration-setup
	@echo "Running integration tests..."
	@$(MAKE) test-integration-run || ($(MAKE) test-integration-logs && $(MAKE) test-integration-teardown && exit 1)
	@$(MAKE) test-integration-teardown
	@echo "Integration tests completed successfully"

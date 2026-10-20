all: go vscode
go: out/backend out/yamcs-recorder

.PHONY: release go vscode all clean

out:
	mkdir -p out

FORCE: ;

clean: FORCE
	rm -rf out

release: vscode out/backend out/yamcs-recorder

out/backend: out FORCE
	go build ${GO_FLAGS} -o out/backend github.com/nasa/hermes/cmd/backend

out/yamcs-recorder: out FORCE
	go build ${GO_FLAGS} -o out/yamcs-recorder github.com/nasa/hermes/cmd/yamcs-recorder

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

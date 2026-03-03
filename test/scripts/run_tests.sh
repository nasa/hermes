#!/bin/bash
# Integration test runner script for Hermes backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="test/docker-compose.yml"
BACKEND_ADDRESS="${HERMES_BACKEND_ADDRESS:-localhost:50051}"
MAX_RETRIES=30
RETRY_DELAY=2

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to cleanup on exit
cleanup() {
    if [ "$SKIP_CLEANUP" != "true" ]; then
        print_info "Cleaning up Docker containers..."
        docker compose -f "$COMPOSE_FILE" down -v
    else
        print_warning "Skipping cleanup (SKIP_CLEANUP=true)"
    fi
}

# Register cleanup function
trap cleanup EXIT

# Function to wait for backend to be ready
wait_for_backend() {
    print_info "Waiting for backend to be ready at $BACKEND_ADDRESS..."
    
    local retries=0
    while [ $retries -lt $MAX_RETRIES ]; do
        if docker compose -f "$COMPOSE_FILE" ps hermes-backend | grep -q "Up"; then
            print_info "Backend container is running"
            
            # Additional check: try to connect to the gRPC port
            if nc -z localhost 50051 2>/dev/null; then
                print_info "Backend is accepting connections on port 50051"
                return 0
            fi
        fi
        
        retries=$((retries + 1))
        echo -n "."
        sleep $RETRY_DELAY
    done
    
    echo ""
    print_error "Backend failed to start after $((MAX_RETRIES * RETRY_DELAY)) seconds"
    print_error "Container logs:"
    docker compose -f "$COMPOSE_FILE" logs hermes-backend
    return 1
}

# Parse command line arguments
REBUILD=false
VERBOSE=false
TEST_PATTERN=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --rebuild)
            REBUILD=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --skip-cleanup)
            SKIP_CLEANUP=true
            shift
            ;;
        --test)
            TEST_PATTERN="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --rebuild         Rebuild Docker images before testing"
            echo "  --verbose, -v     Enable verbose output"
            echo "  --skip-cleanup    Don't clean up containers after tests"
            echo "  --test PATTERN    Run only tests matching PATTERN"
            echo "  --help, -h        Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  HERMES_BACKEND_ADDRESS  Backend address (default: localhost:50051)"
            echo "  SKIP_CLEANUP            Set to 'true' to skip cleanup"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_info "Starting Hermes integration tests"
print_info "Backend address: $BACKEND_ADDRESS"

# Build and start containers
if [ "$REBUILD" = true ]; then
    print_info "Rebuilding Docker images..."
    docker compose -f "$COMPOSE_FILE" build --no-cache
else
    print_info "Building Docker images..."
    docker compose -f "$COMPOSE_FILE" build
fi

print_info "Converting dictionaries to Hermes format"


print_info "Starting Docker containers..."
docker compose -f "$COMPOSE_FILE" up -d

# Wait for backend to be ready
if ! wait_for_backend; then
    print_error "Backend failed to start. Exiting."
    exit 1
fi

# Give it a bit more time to fully initialize
sleep 3

print_info "Backend is ready. Running tests..."

# Build test command
TEST_CMD="go test -v ./test/..."

if [ "$VERBOSE" = true ]; then
    TEST_CMD="$TEST_CMD -v"
fi

if [ -n "$TEST_PATTERN" ]; then
    TEST_CMD="$TEST_CMD -run $TEST_PATTERN"
fi

TEST_CMD="$TEST_CMD -timeout 5m"

# Run tests
print_info "Executing: $TEST_CMD"
if eval $TEST_CMD; then
    print_info "All tests passed!"
    exit 0
else
    print_error "Tests failed!"
    print_error "Container logs:"
    docker compose -f "$COMPOSE_FILE" logs hermes-backend
    exit 1
fi

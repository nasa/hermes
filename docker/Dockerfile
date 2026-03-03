#######################
# Docker.backend
# 
# Author: Andrei Tumbar
# Brief: Build the Hermes code
#
#######################

############################################################
# Backend build stage
############################################################
FROM golang:1.25-alpine AS builder-backend

# Install build dependencies
RUN apk add --no-cache git make

WORKDIR /build

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the backend binary
RUN CGO_ENABLED=0 GOOS=linux go build -o backend ./cmd/backend

############################################################
# Frontend build stage
############################################################
FROM node:20-alpine AS builder-frontend

# Install build dependencies
RUN apk add --no-cache git python3 make g++

WORKDIR /build

# Copy package files for dependency installation
COPY package.json yarn.lock ./
COPY src/internal/package.json ./src/internal/
COPY src/modules/api/package.json ./src/modules/api/
COPY src/modules/rjsf/package.json ./src/modules/rjsf/
COPY src/modules/rpc/package.json ./src/modules/rpc/
COPY src/modules/sequence/package.json ./src/modules/sequence/
COPY src/modules/types/package.json ./src/modules/types/
COPY src/modules/util/package.json ./src/modules/util/
COPY src/modules/vscode/package.json ./src/modules/vscode/
COPY src/extensions/core/package.json ./src/extensions/core/
COPY src/extensions/fprime/package.json ./src/extensions/fprime/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend
RUN yarn build

############################################################
# Runtime stage
############################################################
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Copy backend binary from builder
COPY --from=builder-backend /build/backend /app/backend

# Copy frontend from builder
COPY --from=builder-frontend /build/out /app

# Create directories for config and data
RUN mkdir -p /app/config /app/data && \
    chown -R node:node /app

EXPOSE 50051

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ["/app/backend", "--help"] || exit 1

ENTRYPOINT ["/app/backend"]
CMD ["--bind", "0.0.0.0:50051", "--root", "/app/data", "--verbose"]

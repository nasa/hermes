package client

import (
	"context"

	"google.golang.org/grpc/credentials"
)

var (
	_ credentials.PerRPCCredentials = (*basicAuthCreds)(nil)
)

type authType string

const (
	authTypeUserPass authType = "Basic "
	authTypeToken    authType = "Bearer "
)

type basicAuthCreds struct {
	authorization string
}

// RequireTransportSecurity implements credentials.PerRPCCredentials.
func (b *basicAuthCreds) RequireTransportSecurity() bool {
	return true
}

func (b *basicAuthCreds) GetRequestMetadata(
	ctx context.Context, uri ...string,
) (map[string]string, error) {
	return map[string]string{
		"authorization": b.authorization,
	}, nil
}

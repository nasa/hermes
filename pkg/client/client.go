package client

import (
	"encoding/base64"
	"fmt"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/insecure"
)

const (
	envHost        = "HERMES_HOST"
	envAuthMethod  = "HERMES_AUTH_METHOD"
	envUserPass    = "HERMES_USERPASS"
	envUserPassB64 = "HERMES_USERPASS_B64"
	envToken       = "HERMES_TOKEN"
)

var EnvironmentHelp = `
Environment variables:
- HERMES_HOST: Connect to a remote Hermes host
- HERMES_AUTH_METHOD: 'none', 'userpass' or 'token
- HERMES_USERPASS: Username/Password for the 'userpass' authentication method in the form '<username>:<password>' 
- HERMES_USERPASS_B64: Base64 version of HERMES_USERPASS
- HERMES_TOKEN: Authentication Token used for the 'token' authentication method
`

func transportCredentials() ([]grpc.DialOption, error) {
	switch os.Getenv(envAuthMethod) {
	case "", "none":
		return []grpc.DialOption{
			grpc.WithTransportCredentials(insecure.NewCredentials()),
		}, nil
	case "userpass":
		var creds string
		if os.Getenv(envUserPass) == "" {
			if os.Getenv(envUserPassB64) == "" {
				return nil, fmt.Errorf("authentication type 'userpass' must have HERMES_USERPASS or HERMES_USERPASS_B64 set")
			}

			creds = os.Getenv(envUserPassB64)
		} else {
			creds = base64.StdEncoding.EncodeToString([]byte(os.Getenv(envUserPass)))
		}

		return []grpc.DialOption{
			grpc.WithTransportCredentials(credentials.NewTLS(nil)),
			grpc.WithPerRPCCredentials(&basicAuthCreds{
				authorization: string(authTypeUserPass) + creds,
			}),
		}, nil
	case "token":
		if os.Getenv(envToken) == "" {
			return nil, fmt.Errorf("authentication type 'token' must have HERMES_TOKEN")
		}

		return []grpc.DialOption{
			grpc.WithTransportCredentials(credentials.NewTLS(nil)),
			grpc.WithPerRPCCredentials(&basicAuthCreds{
				authorization: string(authTypeToken) + os.Getenv(envToken),
			}),
		}, nil
	default:
		return nil, fmt.Errorf("invalid authentication method '%s'", os.Getenv(envAuthMethod))
	}
}

func NewClient() (*grpc.ClientConn, error) {
	tCreds, err := transportCredentials()
	if err != nil {
		return nil, fmt.Errorf("failed to create transport credentials: %w", err)
	}

	host := os.Getenv(envHost)
	if host == "" {
		host = "localhost:6880"
	}

	conn, err := grpc.NewClient(host, tCreds...)
	if err != nil {
		return nil, fmt.Errorf("failed to dial: %w", err)
	}

	return conn, nil
}

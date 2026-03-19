package cmd

import (
	"github.com/killbasa/hive/client"
)

func Client() *client.APIClient {
	clientCfg := &client.Configuration{
		UserAgent: "hive-cli/" + RootCmd.Version,
		Debug:     false,
		Servers: client.ServerConfigurations{
			{
				URL: cfg.Server.Endpoint,
			},
		},
		DefaultHeader: map[string]string{
			// TODO - use api key
			"x-api-key": cfg.Authentication.ApiKey,
		},
	}

	return client.NewAPIClient(clientCfg)

}

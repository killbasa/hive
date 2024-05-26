package cmd

import (
	"github.com/killbasa/hive/client"
)

func Client() *client.APIClient {
	cfg := &client.Configuration{
		UserAgent: "hive-cli/0.0.1",
		Debug:     false,
		Servers: client.ServerConfigurations{
			{
				URL: cfg.Server.URL,
			},
		},
	}

	return client.NewAPIClient(cfg)

}

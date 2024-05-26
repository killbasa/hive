package cmd

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var pingCmd = &cobra.Command{
	Use:   "ping",
	Short: "Ping the Hive server",
	Run: func(cmd *cobra.Command, args []string) {
		data, _, err := Client().CoreAPI.HeartbeatGet(context.Background()).Execute()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		}

		fmt.Println(data.Message)
	},
}

func init() {
	rootCmd.AddCommand(pingCmd)
}

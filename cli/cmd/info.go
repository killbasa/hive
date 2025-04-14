package cmd

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var channelInfoCmd = &cobra.Command{
	Use:   "info",
	Short: "Get info about a channel",
	Args:  cobra.ExactArgs(1),
	Run: func(c *cobra.Command, args []string) {
		ch_id := args[0]

		req := Client().ChannelsAPI.ChannelsChannelIdGet(context.Background(), ch_id)

		data, _, err := req.Execute()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		}

		fmt.Println(data.Name)
	},
}

func init() {
	ChannelsCmd.AddCommand(channelInfoCmd)
}

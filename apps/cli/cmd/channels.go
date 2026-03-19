package cmd

import (
	"github.com/spf13/cobra"
)

var ChannelsCmd = &cobra.Command{
	Use:     "channels",
	Short:   "Commands relating to channels",
	Aliases: []string{},
}

func init() {
	RootCmd.AddCommand(ChannelsCmd)
}

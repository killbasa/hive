package cmd

import (
	"github.com/spf13/cobra"
)

var (
	rootCmd = &cobra.Command{
		Use:     "hive",
		Version: "0.0.1",
		Short:   "A CLI for interacting with Hive",
	}
)

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.SetVersionTemplate("{{.Version}}\n")
}

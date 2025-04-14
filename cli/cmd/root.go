package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	RootCmd = &cobra.Command{
		Use:     "hive",
		Version: "0.0.1",
		Short:   "A CLI for interacting with Hive",
	}
)

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	RootCmd.SetVersionTemplate("{{.Version}}\n")
}

package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type ServerConfig struct {
	URL string `mapstructure:"url"`
}

type Config struct {
	Server ServerConfig `mapstructure:"server"`
}

var (
	cfg     Config
	cfgFile string
)

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file path")
}

func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		viper.SetConfigName("hive")
		viper.SetConfigType("toml")

		viper.AddConfigPath("./")
		viper.AddConfigPath("$HOME/.config/hive/")
	}

	if err := viper.ReadInConfig(); err != nil {
		fmt.Printf("couldn't load config: %s", err)
		os.Exit(1)
	}

	if err := viper.Unmarshal(&cfg); err != nil {
		fmt.Printf("couldn't loadd config: %s", err)
		os.Exit(1)
	}
}

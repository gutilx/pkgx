package viperx

import (
	"github.com/madlabx/pkgx/viperx"
	"github.com/spf13/viper"
	"log"
	"testing"
)

func TestTomls(t *testing.T) {
	viper.SetConfigFile("")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Can't read config:%v", err)
	}

	log.Printf("sys.logdir:%v", viperx.GetString("sys.logdir", "./"))
}

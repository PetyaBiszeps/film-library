package main

import (
	"log"
	"net/http"

	"film-library/server/internal/config"
	apihttp "film-library/server/internal/http"
	"film-library/server/internal/movies"
)

func main() {
	cfg := config.Load()
	movieClient := movies.NewTMDBClient(movies.ClientConfig{
		APIBaseURL:   cfg.TMDBAPIBaseURL,
		ImageBaseURL: cfg.TMDBImageBaseURL,
		BearerToken:  cfg.TMDBBearerToken,
	})

	addr := ":" + cfg.Port
	log.Printf("api listening on %s", addr)

	server := &http.Server{
		Addr:    addr,
		Handler: apihttp.CORS(apihttp.NewRouter(movieClient)),
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}

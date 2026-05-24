package main

import (
	"log"
	"net/http"
	"os"

	apihttp "film-library/server/internal/http"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	addr := ":" + port
	log.Printf("api listening on %s", addr)

	server := &http.Server{
		Addr:    addr,
		Handler: apihttp.CORS(apihttp.NewRouter()),
	}

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}

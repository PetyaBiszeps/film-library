package config

import "os"

const (
	defaultPort             = "8080"
	defaultTMDBAPIBaseURL   = "https://api.themoviedb.org/3"
	defaultTMDBImageBaseURL = "https://image.tmdb.org/t/p"
)

type Config struct {
	Port             string
	TMDBAPIBaseURL   string
	TMDBImageBaseURL string
	TMDBBearerToken  string
}

func Load() Config {
	return Config{
		Port:             envOrDefault("PORT", defaultPort),
		TMDBAPIBaseURL:   envOrDefault("TMDB_API_BASE_URL", defaultTMDBAPIBaseURL),
		TMDBImageBaseURL: envOrDefault("TMDB_IMAGE_BASE_URL", defaultTMDBImageBaseURL),
		TMDBBearerToken:  os.Getenv("TMDB_BEARER_TOKEN"),
	}
}

func envOrDefault(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

package http

import (
	"context"
	"encoding/json"
	"errors"
	nethttp "net/http"

	"film-library/server/internal/movies"
)

type MovieService interface {
	PopularMovies(ctx context.Context) (movies.MovieListResponse, error)
}

type errorResponse struct {
	Error string `json:"error"`
}

func Health(w nethttp.ResponseWriter, r *nethttp.Request) {
	w.WriteHeader(nethttp.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func PopularMovies(movieService MovieService) nethttp.HandlerFunc {
	return func(w nethttp.ResponseWriter, r *nethttp.Request) {
		response, err := movieService.PopularMovies(r.Context())
		if errors.Is(err, movies.ErrTMDBNotConfigured) {
			writeJSON(w, nethttp.StatusInternalServerError, errorResponse{Error: "TMDB is not configured"})
			return
		}

		if err != nil {
			writeJSON(w, nethttp.StatusBadGateway, errorResponse{Error: "Failed to fetch popular movies"})
			return
		}

		writeJSON(w, nethttp.StatusOK, response)
	}
}

func writeJSON(w nethttp.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		return
	}
}

package http

import (
	"context"
	"encoding/json"
	"errors"
	nethttp "net/http"
	"strconv"
	"strings"

	"film-library/server/internal/movies"
)

type MovieService interface {
	PopularMovies(ctx context.Context) (movies.MovieListResponse, error)
	SearchMovies(ctx context.Context, query string, page int) (movies.MovieListResponse, error)
	DiscoverMovies(ctx context.Context, sortBy string, page int) (movies.MovieListResponse, error)
	FetchFeed(ctx context.Context, feedType string, page int) (movies.MovieListResponse, error)
	GetMovieDetails(ctx context.Context, id int) (movies.MovieDetails, error)
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

func SearchMovies(movieService MovieService) nethttp.HandlerFunc {
	return func(w nethttp.ResponseWriter, r *nethttp.Request) {
		query := strings.TrimSpace(r.URL.Query().Get("query"))
		if query == "" {
			writeJSON(w, nethttp.StatusBadRequest, errorResponse{Error: "Query is required"})
			return
		}

		page := 1
		if value := r.URL.Query().Get("page"); value != "" {
			parsedPage, err := strconv.Atoi(value)
			if err == nil && parsedPage > 0 {
				page = parsedPage
			}
		}

		response, err := movieService.SearchMovies(r.Context(), query, page)
		if errors.Is(err, movies.ErrTMDBNotConfigured) {
			writeJSON(w, nethttp.StatusInternalServerError, errorResponse{Error: "TMDB is not configured"})
			return
		}

		if err != nil {
			writeJSON(w, nethttp.StatusBadGateway, errorResponse{Error: "Failed to search movies"})
			return
		}

		writeJSON(w, nethttp.StatusOK, response)
	}
}

func DiscoverMovies(movieService MovieService) nethttp.HandlerFunc {
	return func(w nethttp.ResponseWriter, r *nethttp.Request) {
		sortBy := strings.TrimSpace(r.URL.Query().Get("sortBy"))
		page := 1
		if value := r.URL.Query().Get("page"); value != "" {
			parsedPage, err := strconv.Atoi(value)
			if err == nil && parsedPage > 0 {
				page = parsedPage
			}
		}

		response, err := movieService.DiscoverMovies(r.Context(), sortBy, page)
		if errors.Is(err, movies.ErrUnsupportedSortOption) {
			writeJSON(w, nethttp.StatusBadRequest, errorResponse{Error: "Unsupported sort option"})
			return
		}

		if errors.Is(err, movies.ErrTMDBNotConfigured) {
			writeJSON(w, nethttp.StatusInternalServerError, errorResponse{Error: "TMDB is not configured"})
			return
		}

		if err != nil {
			writeJSON(w, nethttp.StatusBadGateway, errorResponse{Error: "Failed to discover movies"})
			return
		}

		writeJSON(w, nethttp.StatusOK, response)
	}
}

func MovieFeed(movieService MovieService) nethttp.HandlerFunc {
	return func(w nethttp.ResponseWriter, r *nethttp.Request) {
		feedType := strings.TrimSpace(r.URL.Query().Get("type"))
		page := 1
		if value := r.URL.Query().Get("page"); value != "" {
			parsedPage, err := strconv.Atoi(value)
			if err == nil && parsedPage > 0 {
				page = parsedPage
			}
		}

		response, err := movieService.FetchFeed(r.Context(), feedType, page)
		if errors.Is(err, movies.ErrUnsupportedFeedType) {
			writeJSON(w, nethttp.StatusBadRequest, errorResponse{Error: "Unsupported feed type"})
			return
		}

		if errors.Is(err, movies.ErrFeedNotImplemented) {
			switch feedType {
			case "recently-added":
				writeJSON(w, nethttp.StatusNotImplemented, errorResponse{Error: "Recently added feed is not implemented"})
			case "friends-watched":
				writeJSON(w, nethttp.StatusNotImplemented, errorResponse{Error: "Friends watched feed is not implemented"})
			default:
				writeJSON(w, nethttp.StatusNotImplemented, errorResponse{Error: "Movie feed is not implemented"})
			}
			return
		}

		if errors.Is(err, movies.ErrTMDBNotConfigured) {
			writeJSON(w, nethttp.StatusInternalServerError, errorResponse{Error: "TMDB is not configured"})
			return
		}

		if err != nil {
			writeJSON(w, nethttp.StatusBadGateway, errorResponse{Error: "Failed to fetch movie feed"})
			return
		}

		writeJSON(w, nethttp.StatusOK, response)
	}
}

func MovieDetails(movieService MovieService) nethttp.HandlerFunc {
	return func(w nethttp.ResponseWriter, r *nethttp.Request) {
		id, ok := movieIDFromRequest(r)
		if !ok {
			writeJSON(w, nethttp.StatusBadRequest, errorResponse{Error: "Invalid movie id"})
			return
		}

		response, err := movieService.GetMovieDetails(r.Context(), id)
		if errors.Is(err, movies.ErrTMDBNotConfigured) {
			writeJSON(w, nethttp.StatusInternalServerError, errorResponse{Error: "TMDB is not configured"})
			return
		}

		if errors.Is(err, movies.ErrMovieNotFound) {
			writeJSON(w, nethttp.StatusNotFound, errorResponse{Error: "Movie not found"})
			return
		}

		if err != nil {
			writeJSON(w, nethttp.StatusBadGateway, errorResponse{Error: "Failed to fetch movie details"})
			return
		}

		writeJSON(w, nethttp.StatusOK, response)
	}
}

func movieIDFromRequest(r *nethttp.Request) (int, bool) {
	idValue := r.PathValue("id")
	if idValue == "" && strings.HasPrefix(r.URL.Path, "/movies/") {
		idValue = strings.TrimPrefix(r.URL.Path, "/movies/")
	}

	id, err := strconv.Atoi(idValue)
	if err != nil || id <= 0 {
		return 0, false
	}

	return id, true
}

func writeJSON(w nethttp.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		return
	}
}

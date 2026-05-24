package http

import (
	"context"
	"errors"
	nethttp "net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"film-library/server/internal/movies"
)

type failingMovieService struct {
	err error
}

func (s failingMovieService) PopularMovies(ctx context.Context) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.err
}

func TestPopularMoviesReturnsConfigurationError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/popular", nil)
	response := httptest.NewRecorder()

	PopularMovies(failingMovieService{err: movies.ErrTMDBNotConfigured})(response, request)

	if response.Code != nethttp.StatusInternalServerError {
		t.Fatalf("expected status 500, got %d", response.Code)
	}

	if contentType := response.Header().Get("Content-Type"); contentType != "application/json" {
		t.Fatalf("expected application/json content type, got %s", contentType)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"TMDB is not configured"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestPopularMoviesReturnsBadGatewayError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/popular", nil)
	response := httptest.NewRecorder()

	PopularMovies(failingMovieService{err: errors.New("tmdb failed")})(response, request)

	if response.Code != nethttp.StatusBadGateway {
		t.Fatalf("expected status 502, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Failed to fetch popular movies"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

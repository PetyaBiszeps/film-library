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
	popularErr error
	searchErr  error
}

func (s failingMovieService) PopularMovies(ctx context.Context) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.popularErr
}

func (s failingMovieService) SearchMovies(ctx context.Context, query string, page int) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.searchErr
}

type searchMovieService struct {
	query string
	page  int
}

func (s *searchMovieService) PopularMovies(ctx context.Context) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, nil
}

func (s *searchMovieService) SearchMovies(ctx context.Context, query string, page int) (movies.MovieListResponse, error) {
	s.query = query
	s.page = page

	return movies.MovieListResponse{
		Page: page,
		Results: []movies.MovieSummary{
			{ID: 1, TMDBID: 1, Title: "Avatar", Year: "2009", PosterURL: "https://image.tmdb.org/t/p/w342/avatar.jpg", Rating: 7.6},
		},
		TotalPages:   1,
		TotalResults: 1,
	}, nil
}

func TestPopularMoviesReturnsConfigurationError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/popular", nil)
	response := httptest.NewRecorder()

	PopularMovies(failingMovieService{popularErr: movies.ErrTMDBNotConfigured})(response, request)

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

	PopularMovies(failingMovieService{popularErr: errors.New("tmdb failed")})(response, request)

	if response.Code != nethttp.StatusBadGateway {
		t.Fatalf("expected status 502, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Failed to fetch popular movies"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestSearchMoviesReturnsBadRequestForEmptyQuery(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/search?query=+", nil)
	response := httptest.NewRecorder()

	SearchMovies(failingMovieService{})(response, request)

	if response.Code != nethttp.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Query is required"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestSearchMoviesDefaultsInvalidPageToOne(t *testing.T) {
	service := &searchMovieService{}
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/search?query=avatar&page=bad", nil)
	response := httptest.NewRecorder()

	SearchMovies(service)(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	if service.query != "avatar" {
		t.Fatalf("expected avatar query, got %s", service.query)
	}

	if service.page != 1 {
		t.Fatalf("expected page 1, got %d", service.page)
	}
}

func TestSearchMoviesReturnsMappedJSONResponse(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/search?query=avatar&page=2", nil)
	response := httptest.NewRecorder()

	SearchMovies(&searchMovieService{})(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	expected := `{"page":2,"results":[{"id":1,"tmdbId":1,"title":"Avatar","year":"2009","posterUrl":"https://image.tmdb.org/t/p/w342/avatar.jpg","rating":7.6}],"totalPages":1,"totalResults":1}`
	if strings.TrimSpace(response.Body.String()) != expected {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestSearchMoviesReturnsConfigurationError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/search?query=avatar", nil)
	response := httptest.NewRecorder()

	SearchMovies(failingMovieService{searchErr: movies.ErrTMDBNotConfigured})(response, request)

	if response.Code != nethttp.StatusInternalServerError {
		t.Fatalf("expected status 500, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"TMDB is not configured"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestSearchMoviesReturnsBadGatewayError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/search?query=avatar", nil)
	response := httptest.NewRecorder()

	SearchMovies(failingMovieService{searchErr: errors.New("tmdb failed")})(response, request)

	if response.Code != nethttp.StatusBadGateway {
		t.Fatalf("expected status 502, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Failed to search movies"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

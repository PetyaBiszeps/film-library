package movies

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestClientPopularMoviesRequiresBearerToken(t *testing.T) {
	client := NewTMDBClient(ClientConfig{APIBaseURL: "https://example.com"})

	_, err := client.PopularMovies(context.Background())
	if !errors.Is(err, ErrTMDBNotConfigured) {
		t.Fatalf("expected ErrTMDBNotConfigured, got %v", err)
	}
}

func TestClientPopularMoviesMapsTMDBResponse(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/movie/popular" {
			t.Fatalf("expected /movie/popular path, got %s", r.URL.Path)
		}

		if r.Header.Get("Authorization") != "Bearer test-token" {
			t.Fatalf("unexpected authorization header")
		}

		if r.Header.Get("Accept") != "application/json" {
			t.Fatalf("unexpected accept header")
		}

		response := TMDBMovieListResponse{
			Page: 2,
			Results: []TMDBMovieSummary{
				{ID: 11, Title: "The Test Movie", ReleaseDate: "2024-01-02", PosterPath: "/poster.jpg", VoteAverage: 8.3},
			},
			TotalPages:   3,
			TotalResults: 21,
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			t.Fatalf("encode response: %v", err)
		}
	}))
	t.Cleanup(server.Close)

	client := NewTMDBClient(ClientConfig{
		APIBaseURL:   server.URL,
		ImageBaseURL: "https://image.tmdb.org/t/p",
		BearerToken:  "test-token",
	})

	response, err := client.PopularMovies(context.Background())
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if response.Page != 2 || response.TotalPages != 3 || response.TotalResults != 21 {
		t.Fatalf("unexpected pagination: %+v", response)
	}

	if len(response.Results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(response.Results))
	}

	movie := response.Results[0]
	if movie.ID != 11 || movie.TMDBID != 11 || movie.Title != "The Test Movie" || movie.Year != "2024" || movie.PosterURL != "https://image.tmdb.org/t/p/w342/poster.jpg" || movie.Rating != 8.3 {
		t.Fatalf("unexpected movie mapping: %+v", movie)
	}
}

func TestClientPopularMoviesReturnsErrorOnNon2xx(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
	}))
	t.Cleanup(server.Close)

	client := NewTMDBClient(ClientConfig{
		APIBaseURL:  server.URL,
		BearerToken: "test-token",
	})

	_, err := client.PopularMovies(context.Background())
	if err == nil {
		t.Fatal("expected error")
	}
}

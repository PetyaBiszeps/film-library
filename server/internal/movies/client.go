package movies

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"
)

const defaultPosterSize = "w342"

var ErrTMDBNotConfigured = errors.New("tmdb is not configured")

type Client struct {
	apiBaseURL   string
	imageBaseURL string
	bearerToken  string
	httpClient   *http.Client
}

type ClientConfig struct {
	APIBaseURL   string
	ImageBaseURL string
	BearerToken  string
	HTTPClient   *http.Client
}

func NewTMDBClient(config ClientConfig) *Client {
	httpClient := config.HTTPClient
	if httpClient == nil {
		httpClient = &http.Client{Timeout: 10 * time.Second}
	}

	return &Client{
		apiBaseURL:   config.APIBaseURL,
		imageBaseURL: config.ImageBaseURL,
		bearerToken:  config.BearerToken,
		httpClient:   httpClient,
	}
}

func (c *Client) PopularMovies(ctx context.Context) (MovieListResponse, error) {
	if strings.TrimSpace(c.bearerToken) == "" {
		return MovieListResponse{}, ErrTMDBNotConfigured
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(c.apiBaseURL, "/")+"/movie/popular", nil)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("create tmdb request: %w", err)
	}

	request.Header.Set("Authorization", "Bearer "+c.bearerToken)
	request.Header.Set("Accept", "application/json")

	response, err := c.httpClient.Do(request)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("fetch popular movies: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return MovieListResponse{}, fmt.Errorf("tmdb returned status %d", response.StatusCode)
	}

	var tmdbResponse TMDBMovieListResponse
	if err := json.NewDecoder(response.Body).Decode(&tmdbResponse); err != nil {
		return MovieListResponse{}, fmt.Errorf("decode tmdb popular movies: %w", err)
	}

	return MapTMDBMovieListResponse(tmdbResponse, c.imageBaseURL, defaultPosterSize, nil), nil
}

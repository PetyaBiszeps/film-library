package movies

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const defaultPosterSize = "w342"

var ErrTMDBNotConfigured = errors.New("tmdb is not configured")
var ErrUnsupportedSortOption = errors.New("unsupported sort option")

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

func (c *Client) SearchMovies(ctx context.Context, query string, page int) (MovieListResponse, error) {
	if strings.TrimSpace(c.bearerToken) == "" {
		return MovieListResponse{}, ErrTMDBNotConfigured
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(c.apiBaseURL, "/")+"/search/movie", nil)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("create tmdb search request: %w", err)
	}

	params := request.URL.Query()
	params.Set("query", query)
	params.Set("page", strconv.Itoa(page))
	params.Set("include_adult", "false")
	request.URL.RawQuery = params.Encode()

	request.Header.Set("Authorization", "Bearer "+c.bearerToken)
	request.Header.Set("Accept", "application/json")

	response, err := c.httpClient.Do(request)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("search movies: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return MovieListResponse{}, fmt.Errorf("tmdb returned status %d", response.StatusCode)
	}

	var tmdbResponse TMDBMovieListResponse
	if err := json.NewDecoder(response.Body).Decode(&tmdbResponse); err != nil {
		return MovieListResponse{}, fmt.Errorf("decode tmdb search movies: %w", err)
	}

	return MapTMDBMovieListResponse(tmdbResponse, c.imageBaseURL, defaultPosterSize, nil), nil
}

func (c *Client) DiscoverMovies(ctx context.Context, sortBy string, page int) (MovieListResponse, error) {
	tmdbSortBy, needsVoteCount, ok := tmdbDiscoverSortBy(sortBy)
	if !ok {
		return MovieListResponse{}, ErrUnsupportedSortOption
	}

	if strings.TrimSpace(c.bearerToken) == "" {
		return MovieListResponse{}, ErrTMDBNotConfigured
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(c.apiBaseURL, "/")+"/discover/movie", nil)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("create tmdb discover request: %w", err)
	}

	params := request.URL.Query()
	params.Set("sort_by", tmdbSortBy)
	params.Set("page", strconv.Itoa(page))
	params.Set("include_adult", "false")
	if needsVoteCount {
		params.Set("vote_count.gte", "100")
	}
	request.URL.RawQuery = params.Encode()

	request.Header.Set("Authorization", "Bearer "+c.bearerToken)
	request.Header.Set("Accept", "application/json")

	response, err := c.httpClient.Do(request)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("discover movies: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return MovieListResponse{}, fmt.Errorf("tmdb returned status %d", response.StatusCode)
	}

	var tmdbResponse TMDBMovieListResponse
	if err := json.NewDecoder(response.Body).Decode(&tmdbResponse); err != nil {
		return MovieListResponse{}, fmt.Errorf("decode tmdb discover movies: %w", err)
	}

	return MapTMDBMovieListResponse(tmdbResponse, c.imageBaseURL, defaultPosterSize, nil), nil
}

func tmdbDiscoverSortBy(sortBy string) (string, bool, bool) {
	switch strings.TrimSpace(sortBy) {
	case "", "recommended", "popular":
		return "popularity.desc", false, true
	case "newest":
		return "primary_release_date.desc", false, true
	case "rating":
		return "vote_average.desc", true, true
	case "title-az":
		return "title.asc", false, true
	default:
		return "", false, false
	}
}

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
const defaultBackdropSize = "w780"

var ErrTMDBNotConfigured = errors.New("tmdb is not configured")
var ErrMovieNotFound = errors.New("movie not found")
var ErrUnsupportedSortOption = errors.New("unsupported sort option")
var ErrUnsupportedFeedType = errors.New("unsupported feed type")
var ErrFeedNotImplemented = errors.New("feed is not implemented")

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

func (c *Client) FetchFeed(ctx context.Context, feedType string, page int) (MovieListResponse, error) {
	feed, ok := tmdbFeed(feedType)
	if !ok {
		return MovieListResponse{}, ErrUnsupportedFeedType
	}

	if !feed.implemented {
		return MovieListResponse{}, ErrFeedNotImplemented
	}

	if strings.TrimSpace(c.bearerToken) == "" {
		return MovieListResponse{}, ErrTMDBNotConfigured
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(c.apiBaseURL, "/")+feed.path, nil)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("create tmdb feed request: %w", err)
	}

	params := request.URL.Query()
	params.Set("page", strconv.Itoa(page))
	if feed.includeAdult {
		params.Set("include_adult", "false")
	}
	if feed.sortBy != "" {
		params.Set("sort_by", feed.sortBy)
	}
	if feed.voteCountGTE != "" {
		params.Set("vote_count.gte", feed.voteCountGTE)
	}
	request.URL.RawQuery = params.Encode()

	request.Header.Set("Authorization", "Bearer "+c.bearerToken)
	request.Header.Set("Accept", "application/json")

	response, err := c.httpClient.Do(request)
	if err != nil {
		return MovieListResponse{}, fmt.Errorf("fetch movie feed: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return MovieListResponse{}, fmt.Errorf("tmdb returned status %d", response.StatusCode)
	}

	var tmdbResponse TMDBMovieListResponse
	if err := json.NewDecoder(response.Body).Decode(&tmdbResponse); err != nil {
		return MovieListResponse{}, fmt.Errorf("decode tmdb movie feed: %w", err)
	}

	return MapTMDBMovieListResponse(tmdbResponse, c.imageBaseURL, defaultPosterSize, nil), nil
}

func (c *Client) GetMovieDetails(ctx context.Context, id int) (MovieDetails, error) {
	if strings.TrimSpace(c.bearerToken) == "" {
		return MovieDetails{}, ErrTMDBNotConfigured
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(c.apiBaseURL, "/")+"/movie/"+strconv.Itoa(id), nil)
	if err != nil {
		return MovieDetails{}, fmt.Errorf("create tmdb movie details request: %w", err)
	}

	request.Header.Set("Authorization", "Bearer "+c.bearerToken)
	request.Header.Set("Accept", "application/json")

	response, err := c.httpClient.Do(request)
	if err != nil {
		return MovieDetails{}, fmt.Errorf("fetch movie details: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode == http.StatusNotFound {
		return MovieDetails{}, ErrMovieNotFound
	}

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return MovieDetails{}, fmt.Errorf("tmdb returned status %d", response.StatusCode)
	}

	var tmdbResponse TMDBMovieDetails
	if err := json.NewDecoder(response.Body).Decode(&tmdbResponse); err != nil {
		return MovieDetails{}, fmt.Errorf("decode tmdb movie details: %w", err)
	}

	return MapTMDBMovieDetails(tmdbResponse, c.imageBaseURL), nil
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

type feedConfig struct {
	path         string
	sortBy       string
	voteCountGTE string
	includeAdult bool
	implemented  bool
}

func tmdbFeed(feedType string) (feedConfig, bool) {
	switch strings.TrimSpace(feedType) {
	case "", "recommended":
		return feedConfig{path: "/discover/movie", sortBy: "popularity.desc", includeAdult: true, implemented: true}, true
	case "trending":
		return feedConfig{path: "/trending/movie/week", implemented: true}, true
	case "new":
		return feedConfig{path: "/discover/movie", sortBy: "primary_release_date.desc", voteCountGTE: "10", includeAdult: true, implemented: true}, true
	case "recently-added", "friends-watched":
		return feedConfig{}, true
	default:
		return feedConfig{}, false
	}
}

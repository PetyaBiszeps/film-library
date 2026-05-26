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
	popularErr  error
	searchErr   error
	discoverErr error
	feedErr     error
	detailsErr  error
}

func (s failingMovieService) PopularMovies(ctx context.Context) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.popularErr
}

func (s failingMovieService) SearchMovies(ctx context.Context, query string, page int) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.searchErr
}

func (s failingMovieService) DiscoverMovies(ctx context.Context, sortBy string, page int) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.discoverErr
}

func (s failingMovieService) FetchFeed(ctx context.Context, feedType string, page int) (movies.MovieListResponse, error) {
	return movies.MovieListResponse{}, s.feedErr
}

func (s failingMovieService) GetMovieDetails(ctx context.Context, id int) (movies.MovieDetails, error) {
	return movies.MovieDetails{}, s.detailsErr
}

type searchMovieService struct {
	query     string
	sortBy    string
	feed      string
	page      int
	detailsID int
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

func (s *searchMovieService) DiscoverMovies(ctx context.Context, sortBy string, page int) (movies.MovieListResponse, error) {
	s.sortBy = sortBy
	s.page = page

	return movies.MovieListResponse{
		Page: page,
		Results: []movies.MovieSummary{
			{ID: 2, TMDBID: 2, Title: "Discover Movie", Year: "2023", PosterURL: "https://image.tmdb.org/t/p/w342/discover.jpg", Rating: 8.1},
		},
		TotalPages:   2,
		TotalResults: 20,
	}, nil
}

func (s *searchMovieService) FetchFeed(ctx context.Context, feedType string, page int) (movies.MovieListResponse, error) {
	s.feed = feedType
	s.page = page

	return movies.MovieListResponse{
		Page: page,
		Results: []movies.MovieSummary{
			{ID: 3, TMDBID: 3, Title: "Feed Movie", Year: "2024", PosterURL: "https://image.tmdb.org/t/p/w342/feed.jpg", Rating: 7.9},
		},
		TotalPages:   3,
		TotalResults: 30,
	}, nil
}

func (s *searchMovieService) GetMovieDetails(ctx context.Context, id int) (movies.MovieDetails, error) {
	s.detailsID = id

	return movies.MovieDetails{
		ID:          id,
		TMDBID:      id,
		Title:       "Fight Club",
		Year:        "1999",
		Genres:      []string{"Drama"},
		Runtime:     139,
		ReleaseDate: "1999-10-15",
		PosterURL:   "https://image.tmdb.org/t/p/w342/fight-club.jpg",
		BackdropURL: "https://image.tmdb.org/t/p/w780/fight-club-backdrop.jpg",
		Rating:      8.4,
		Overview:    "An insomniac office worker meets a soap maker.",
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

func TestDiscoverMoviesReturnsBadRequestForInvalidSort(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/discover?sortBy=unknown", nil)
	response := httptest.NewRecorder()

	DiscoverMovies(failingMovieService{discoverErr: movies.ErrUnsupportedSortOption})(response, request)

	if response.Code != nethttp.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Unsupported sort option"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestDiscoverMoviesDefaultsInvalidPageToOne(t *testing.T) {
	service := &searchMovieService{}
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/discover?sortBy=newest&page=bad", nil)
	response := httptest.NewRecorder()

	DiscoverMovies(service)(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	if service.sortBy != "newest" {
		t.Fatalf("expected newest sort, got %s", service.sortBy)
	}

	if service.page != 1 {
		t.Fatalf("expected page 1, got %d", service.page)
	}
}

func TestDiscoverMoviesReturnsMappedJSONResponse(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/discover?sortBy=title-az&page=2", nil)
	response := httptest.NewRecorder()

	DiscoverMovies(&searchMovieService{})(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	expected := `{"page":2,"results":[{"id":2,"tmdbId":2,"title":"Discover Movie","year":"2023","posterUrl":"https://image.tmdb.org/t/p/w342/discover.jpg","rating":8.1}],"totalPages":2,"totalResults":20}`
	if strings.TrimSpace(response.Body.String()) != expected {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestDiscoverMoviesReturnsConfigurationError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/discover", nil)
	response := httptest.NewRecorder()

	DiscoverMovies(failingMovieService{discoverErr: movies.ErrTMDBNotConfigured})(response, request)

	if response.Code != nethttp.StatusInternalServerError {
		t.Fatalf("expected status 500, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"TMDB is not configured"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestDiscoverMoviesReturnsBadGatewayError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/discover", nil)
	response := httptest.NewRecorder()

	DiscoverMovies(failingMovieService{discoverErr: errors.New("tmdb failed")})(response, request)

	if response.Code != nethttp.StatusBadGateway {
		t.Fatalf("expected status 502, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Failed to discover movies"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieFeedDefaultsInvalidPageToOne(t *testing.T) {
	service := &searchMovieService{}
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed?type=trending&page=bad", nil)
	response := httptest.NewRecorder()

	MovieFeed(service)(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	if service.feed != "trending" {
		t.Fatalf("expected trending feed, got %s", service.feed)
	}

	if service.page != 1 {
		t.Fatalf("expected page 1, got %d", service.page)
	}
}

func TestMovieFeedDefaultsEmptyTypeToRecommended(t *testing.T) {
	service := &searchMovieService{}
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed", nil)
	response := httptest.NewRecorder()

	MovieFeed(service)(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	if service.feed != "" {
		t.Fatalf("expected empty feed type, got %s", service.feed)
	}

	if service.page != 1 {
		t.Fatalf("expected page 1, got %d", service.page)
	}
}

func TestMovieFeedReturnsMappedJSONResponse(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed?type=new&page=2", nil)
	response := httptest.NewRecorder()

	MovieFeed(&searchMovieService{})(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	expected := `{"page":2,"results":[{"id":3,"tmdbId":3,"title":"Feed Movie","year":"2024","posterUrl":"https://image.tmdb.org/t/p/w342/feed.jpg","rating":7.9}],"totalPages":3,"totalResults":30}`
	if strings.TrimSpace(response.Body.String()) != expected {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieFeedReturnsNotImplementedErrors(t *testing.T) {
	tests := []struct {
		name     string
		feedType string
		wantBody string
	}{
		{name: "recently added", feedType: "recently-added", wantBody: `{"error":"Recently added feed is not implemented"}`},
		{name: "friends watched", feedType: "friends-watched", wantBody: `{"error":"Friends watched feed is not implemented"}`},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed?type="+test.feedType, nil)
			response := httptest.NewRecorder()

			MovieFeed(failingMovieService{feedErr: movies.ErrFeedNotImplemented})(response, request)

			if response.Code != nethttp.StatusNotImplemented {
				t.Fatalf("expected status 501, got %d", response.Code)
			}

			if strings.TrimSpace(response.Body.String()) != test.wantBody {
				t.Fatalf("unexpected response body: %s", response.Body.String())
			}
		})
	}
}

func TestMovieFeedReturnsUnsupportedTypeError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed?type=unknown", nil)
	response := httptest.NewRecorder()

	MovieFeed(failingMovieService{feedErr: movies.ErrUnsupportedFeedType})(response, request)

	if response.Code != nethttp.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Unsupported feed type"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieFeedReturnsConfigurationError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed?type=trending", nil)
	response := httptest.NewRecorder()

	MovieFeed(failingMovieService{feedErr: movies.ErrTMDBNotConfigured})(response, request)

	if response.Code != nethttp.StatusInternalServerError {
		t.Fatalf("expected status 500, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"TMDB is not configured"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieFeedReturnsBadGatewayError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/feed?type=trending", nil)
	response := httptest.NewRecorder()

	MovieFeed(failingMovieService{feedErr: errors.New("tmdb failed")})(response, request)

	if response.Code != nethttp.StatusBadGateway {
		t.Fatalf("expected status 502, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Failed to fetch movie feed"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieDetailsReturnsBadRequestForInvalidID(t *testing.T) {
	tests := []struct {
		name string
		path string
	}{
		{name: "missing", path: "/movies/"},
		{name: "not a number", path: "/movies/not-a-number"},
		{name: "zero", path: "/movies/0"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(nethttp.MethodGet, test.path, nil)
			response := httptest.NewRecorder()

			MovieDetails(failingMovieService{})(response, request)

			if response.Code != nethttp.StatusBadRequest {
				t.Fatalf("expected status 400, got %d", response.Code)
			}

			if strings.TrimSpace(response.Body.String()) != `{"error":"Invalid movie id"}` {
				t.Fatalf("unexpected response body: %s", response.Body.String())
			}
		})
	}
}

func TestMovieDetailsReturnsNotFoundError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/999999", nil)
	response := httptest.NewRecorder()

	MovieDetails(failingMovieService{detailsErr: movies.ErrMovieNotFound})(response, request)

	if response.Code != nethttp.StatusNotFound {
		t.Fatalf("expected status 404, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Movie not found"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieDetailsReturnsMappedJSONResponse(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/550", nil)
	response := httptest.NewRecorder()
	service := &searchMovieService{}

	MovieDetails(service)(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	if service.detailsID != 550 {
		t.Fatalf("expected details id 550, got %d", service.detailsID)
	}

	expected := `{"id":550,"tmdbId":550,"title":"Fight Club","year":"1999","genres":["Drama"],"runtime":139,"releaseDate":"1999-10-15","posterUrl":"https://image.tmdb.org/t/p/w342/fight-club.jpg","backdropUrl":"https://image.tmdb.org/t/p/w780/fight-club-backdrop.jpg","rating":8.4,"overview":"An insomniac office worker meets a soap maker."}`
	if strings.TrimSpace(response.Body.String()) != expected {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieDetailsReturnsConfigurationError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/550", nil)
	response := httptest.NewRecorder()

	MovieDetails(failingMovieService{detailsErr: movies.ErrTMDBNotConfigured})(response, request)

	if response.Code != nethttp.StatusInternalServerError {
		t.Fatalf("expected status 500, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"TMDB is not configured"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestMovieDetailsReturnsBadGatewayError(t *testing.T) {
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/550", nil)
	response := httptest.NewRecorder()

	MovieDetails(failingMovieService{detailsErr: errors.New("tmdb failed")})(response, request)

	if response.Code != nethttp.StatusBadGateway {
		t.Fatalf("expected status 502, got %d", response.Code)
	}

	if strings.TrimSpace(response.Body.String()) != `{"error":"Failed to fetch movie details"}` {
		t.Fatalf("unexpected response body: %s", response.Body.String())
	}
}

func TestStaticMovieRoutesAreNotSwallowedByDetailsRoute(t *testing.T) {
	service := &searchMovieService{}
	request := httptest.NewRequest(nethttp.MethodGet, "/movies/search?query=avatar&page=2", nil)
	response := httptest.NewRecorder()

	NewRouter(service).ServeHTTP(response, request)

	if response.Code != nethttp.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	if service.query != "avatar" {
		t.Fatalf("expected search route to handle request, got query %s", service.query)
	}

	if service.detailsID != 0 {
		t.Fatalf("expected details route not to be called, got id %d", service.detailsID)
	}
}

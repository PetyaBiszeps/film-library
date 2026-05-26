package movies

import "strings"

type TMDBMovieListResponse struct {
	Page         int                `json:"page"`
	Results      []TMDBMovieSummary `json:"results"`
	TotalPages   int                `json:"total_pages"`
	TotalResults int                `json:"total_results"`
}

type TMDBMovieSummary struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	ReleaseDate string  `json:"release_date"`
	GenreIDs    []int   `json:"genre_ids"`
	PosterPath  string  `json:"poster_path"`
	VoteAverage float64 `json:"vote_average"`
}

type TMDBMovieDetails struct {
	ID           int         `json:"id"`
	Title        string      `json:"title"`
	ReleaseDate  string      `json:"release_date"`
	Genres       []TMDBGenre `json:"genres"`
	Runtime      int         `json:"runtime"`
	PosterPath   string      `json:"poster_path"`
	BackdropPath string      `json:"backdrop_path"`
	VoteAverage  float64     `json:"vote_average"`
	Overview     string      `json:"overview"`
}

type TMDBGenre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func MapTMDBMovieListResponse(response TMDBMovieListResponse, imageBaseURL string, posterSize string, genres map[int]string) MovieListResponse {
	results := make([]MovieSummary, 0, len(response.Results))
	for _, movie := range response.Results {
		results = append(results, MapTMDBMovieSummary(movie, imageBaseURL, posterSize, genres))
	}

	return MovieListResponse{
		Page:         response.Page,
		Results:      results,
		TotalPages:   response.TotalPages,
		TotalResults: response.TotalResults,
	}
}

func MapTMDBMovieSummary(movie TMDBMovieSummary, imageBaseURL string, posterSize string, genres map[int]string) MovieSummary {
	return MovieSummary{
		ID:        movie.ID,
		TMDBID:    movie.ID,
		Title:     movie.Title,
		Year:      releaseYear(movie.ReleaseDate),
		Genre:     primaryGenre(movie.GenreIDs, genres),
		PosterURL: tmdbImageURL(imageBaseURL, posterSize, movie.PosterPath),
		Rating:    movie.VoteAverage,
	}
}

func MapTMDBMovieDetails(movie TMDBMovieDetails, imageBaseURL string) MovieDetails {
	genres := make([]string, 0, len(movie.Genres))
	for _, genre := range movie.Genres {
		if genre.Name != "" {
			genres = append(genres, genre.Name)
		}
	}

	return MovieDetails{
		ID:          movie.ID,
		TMDBID:      movie.ID,
		Title:       movie.Title,
		Year:        releaseYear(movie.ReleaseDate),
		Genres:      genres,
		Runtime:     movie.Runtime,
		ReleaseDate: movie.ReleaseDate,
		PosterURL:   tmdbImageURL(imageBaseURL, defaultPosterSize, movie.PosterPath),
		BackdropURL: tmdbImageURL(imageBaseURL, defaultBackdropSize, movie.BackdropPath),
		Rating:      movie.VoteAverage,
		Overview:    movie.Overview,
	}
}

func releaseYear(releaseDate string) string {
	if len(releaseDate) < 4 {
		return ""
	}

	return releaseDate[:4]
}

func primaryGenre(genreIDs []int, genres map[int]string) string {
	if len(genreIDs) == 0 || genres == nil {
		return ""
	}

	return genres[genreIDs[0]]
}

func tmdbImageURL(imageBaseURL string, posterSize string, posterPath string) string {
	if imageBaseURL == "" || posterSize == "" || posterPath == "" {
		return ""
	}

	return strings.TrimRight(imageBaseURL, "/") + "/" + strings.Trim(posterSize, "/") + "/" + strings.TrimLeft(posterPath, "/")
}

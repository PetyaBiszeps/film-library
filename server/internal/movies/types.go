package movies

type MovieSummary struct {
	ID        int     `json:"id"`
	TMDBID    int     `json:"tmdbId"`
	Title     string  `json:"title"`
	Year      string  `json:"year,omitempty"`
	Genre     string  `json:"genre,omitempty"`
	PosterURL string  `json:"posterUrl"`
	Rating    float64 `json:"rating,omitempty"`
}

type MovieListResponse struct {
	Page         int            `json:"page"`
	Results      []MovieSummary `json:"results"`
	TotalPages   int            `json:"totalPages"`
	TotalResults int            `json:"totalResults"`
}

type MovieDetails struct {
	ID          int      `json:"id"`
	TMDBID      int      `json:"tmdbId"`
	Title       string   `json:"title"`
	Year        string   `json:"year,omitempty"`
	Genres      []string `json:"genres,omitempty"`
	Runtime     int      `json:"runtime,omitempty"`
	ReleaseDate string   `json:"releaseDate,omitempty"`
	PosterURL   string   `json:"posterUrl,omitempty"`
	BackdropURL string   `json:"backdropUrl,omitempty"`
	Rating      float64  `json:"rating,omitempty"`
	Overview    string   `json:"overview,omitempty"`
}

package http

import (
	"encoding/json"
	nethttp "net/http"

	"film-library/server/internal/movies"
)

func Health(w nethttp.ResponseWriter, r *nethttp.Request) {
	w.WriteHeader(nethttp.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func PopularMovies(w nethttp.ResponseWriter, r *nethttp.Request) {
	response := movies.MovieListResponse{
		Page: 1,
		Results: []movies.MovieSummary{
			{ID: 1, TMDBID: 1, Title: "The Silent Orbit", Year: "2023", Genre: "Sci-Fi", Rating: 7.8},
			{ID: 2, TMDBID: 2, Title: "North of Summer", Year: "2021", Genre: "Drama", Rating: 7.2},
			{ID: 3, TMDBID: 3, Title: "Marble City", Year: "2019", Genre: "Thriller", Rating: 7.5},
			{ID: 4, TMDBID: 4, Title: "Echoes Harbor", Year: "2024", Genre: "Mystery", Rating: 8.1},
		},
		TotalPages:   1,
		TotalResults: 4,
	}

	writeJSON(w, nethttp.StatusOK, response)
}

func writeJSON(w nethttp.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		return
	}
}

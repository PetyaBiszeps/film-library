package http

import nethttp "net/http"

func NewRouter(movieService MovieService) nethttp.Handler {
	mux := nethttp.NewServeMux()
	mux.HandleFunc("GET /health", Health)
	mux.HandleFunc("GET /movies/popular", PopularMovies(movieService))
	mux.HandleFunc("GET /movies/search", SearchMovies(movieService))

	return mux
}

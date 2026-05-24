package http

import nethttp "net/http"

func NewRouter() nethttp.Handler {
	mux := nethttp.NewServeMux()
	mux.HandleFunc("GET /health", Health)
	mux.HandleFunc("GET /movies/popular", PopularMovies)

	return mux
}

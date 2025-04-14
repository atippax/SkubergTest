import baseApi, { apiKey, baseUrl } from "./baseApi";
import { Movie, MovieDetail, MovieResponse } from "./interface";
function addDefaultPath(path: string | null) {
  return `https://image.tmdb.org/t/p/w300${path}`;
}
function addPathImgToMovieList(
  items: MovieResponse<Movie>
): MovieResponse<Movie> {
  return {
    ...items,
    results: items.results.map((x) => ({
      ...x,
      backdrop_path: addDefaultPath(x.backdrop_path),
      poster_path: addDefaultPath(x.poster_path),
    })),
  };
}
export default function movieApi() {
  const genresMovieEndpoint = "genre/movie/list";
  const playingList = "movie/now_playing";
  const popularList = "movie/popular";
  const topRatedList = "movie/top_rated";
  const upcomingList = "movie/upcoming";
  return {
    searchMovie: async (search: string) => {
      const response = await baseApi<MovieResponse<Movie>>(
        `${baseUrl}search/movie?api_key=${apiKey}&query=${search}`
      );
      return addPathImgToMovieList(response);
    },
    getVideos: async (id: number) => {
      const response = await baseApi<{
        id: number;
        results: { key: string }[];
      }>(`${baseUrl}movie/${id}/videos?api_key=${apiKey}`);
      return response;
    },
    getGenres: async () => {
      const response = await baseApi(
        `${baseUrl}${genresMovieEndpoint}?api_key=${apiKey}`
      );
      return response;
    },
    getPlayingList: async () => {
      const response = await baseApi<MovieResponse<Movie>>(
        `${baseUrl}${playingList}?api_key=${apiKey}`
      );
      return addPathImgToMovieList(response);
    },
    getPopularList: async () => {
      const response = await baseApi<MovieResponse<Movie>>(
        `${baseUrl}${popularList}?api_key=${apiKey}`
      );
      return addPathImgToMovieList(response);
    },
    getTopRatedList: async () => {
      const response = await baseApi<MovieResponse<Movie>>(
        `${baseUrl}${topRatedList}?api_key=${apiKey}`
      );
      return addPathImgToMovieList(response);
    },
    getUpcomingList: async () => {
      const response = await baseApi<MovieResponse<Movie>>(
        `${baseUrl}${upcomingList}?api_key=${apiKey}`
      );
      return addPathImgToMovieList(response);
    },
    getMovieDetails: async (id: number) => {
      const response = await baseApi<MovieDetail>(
        `${baseUrl}movie/${id}?api_key=${apiKey}`
      );
      return {
        ...response,
        backdrop_path: addDefaultPath(response.backdrop_path),
        poster_path: addDefaultPath(response.poster_path),
      };
    },
  };
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieApi from "../apis/movieApi";
import { Movie, MoviePos, MovieResponse } from "../apis/interface";
import { useLocalStorage } from "../hooks/useStorage";
import Cart, { CartItem } from "../components/cart";
import { LocalStorageKey } from "../constants/keyStorage";
import MovieList from "../components/movieList";
import { toast } from "sonner";

export default function Home() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");
  const [movies, setMovies] = useState<MoviePos[]>([]);
  const movieApi = MovieApi();
  const [stateMovie, _, refresh] = useLocalStorage<CartItem[]>(
    LocalStorageKey.movieDetail,
    []
  );
  const mapWithLocal = (movies: MovieResponse<Movie>) =>
    movies.results.map<MoviePos>((x) => {
      const itemExist = stateMovie.find((g) => g.id === x.id);
      return {
        ...x,
        title: itemExist ? itemExist.title : x.title,
        price: itemExist?.price || 20,
      };
    });
  async function fetchSearch() {
    const data = await movieApi.searchMovie(searchQuery || "");
    console.log(data.results);
    setMovies(mapWithLocal(data));
  }
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  function onFinishAddToCart() {
    toast.success(
      `เพิ่ม ${cartItem?.title} ราคา ${cartItem?.price} ลงตะกร้าสำเร็จ`
    );
    setCartItem(null);
  }
  useEffect(() => {
    fetchSearch();
  }, [searchQuery, stateMovie]);
  return (
    <>
      <div className="p-4">
        {movies.length > 0 ? (
          <>
            <MovieList
              data={movies}
              setCartItem={setCartItem}
              onEdited={() => refresh()}
            />
            <div className="fixed bottom-0 right-0 m-4 z-50">
              <Cart newItem={cartItem} onSuccess={onFinishAddToCart} />
            </div>
          </>
        ) : (
          <>ไม่พบข้อมูล</>
        )}
      </div>
    </>
  );
}

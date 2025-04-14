import { useEffect, useState } from "react";
import MovieApi from "../apis/movieApi";
import {
  Movie,
  MovieDetailPos,
  MoviePos,
  MovieResponse,
} from "../apis/interface";
import Cart, { CartItem } from "../components/cart";
import { toast } from "sonner";
import { useLocalStorage } from "../hooks/useStorage";
import { LocalStorageKey } from "../constants/keyStorage";
import MovieList from "../components/movieList";
import Button from "../components/button";

export default function Home() {
  const movieApi = MovieApi();
  const [popularsList, setPopularsList] = useState<MoviePos[]>([]);
  const [topRatedList, setTopRatedList] = useState<MoviePos[]>([]);
  const [upcomingList, setUpcomingList] = useState<MoviePos[]>([]);
  const [stateMovie, _, refresh] = useLocalStorage<CartItem[]>(
    LocalStorageKey.movieDetail,
    []
  );
  const [detailMovie, setDetailMovie] = useState<{
    detail: MovieDetailPos | null;
    videoLink: null | string;
  }>({
    detail: null,
    videoLink: null,
  });

  const mapWithLocal = (movies: MovieResponse<Movie>) =>
    movies.results.map<MoviePos>((x) => {
      const itemExist = stateMovie.find((g) => g.id === x.id);
      return {
        ...x,
        title: itemExist ? itemExist.title : x.title,
        price: itemExist?.price || 20,
      };
    });

  useEffect(() => {
    console.log("ss", stateMovie);
    async function fetchAllMovies() {
      const [popularMovies, topRatedMovies, upcomingMovies] = await Promise.all(
        [
          movieApi.getPopularList(),
          movieApi.getTopRatedList(),
          movieApi.getUpcomingList(),
        ]
      );

      setPopularsList(mapWithLocal(popularMovies));
      setTopRatedList(mapWithLocal(topRatedMovies));
      setUpcomingList(mapWithLocal(upcomingMovies));

      const allData = [
        ...mapWithLocal(popularMovies),
        ...mapWithLocal(topRatedMovies),
        ...mapWithLocal(upcomingMovies),
      ];
      const randomIndex = Math.floor(Math.random() * allData.length);
      const id = allData[randomIndex].id;

      const video = await movieApi.getVideos(id);
      const details = await movieApi.getMovieDetails(id);
      const existItem = stateMovie.find((x) => x.id == details.id);
      setDetailMovie({
        detail: {
          ...details,
          title: existItem?.title || details.title,
          price: existItem?.price || 50,
        },
        videoLink:
          video.results.length > 0
            ? `https://www.youtube.com/embed/${video.results[0].key}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1`
            : null,
      });
    }

    fetchAllMovies();
  }, [stateMovie]);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  function onFinishAddToCart() {
    toast.success(
      `เพิ่ม ${cartItem?.title} ราคา ${cartItem?.price} ลงตะกร้าสำเร็จ`
    );
    setCartItem(null);
  }

  return (
    <>
      <div className=" aspect-video w-full mx-auto relative ">
        {detailMovie.videoLink && (
          <>
            <iframe
              className="w-full h-full"
              src={detailMovie.videoLink}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-sm p-18 z-10">
              <div className="flex  justify-between items-center gap-8">
                <div className="font-semibold  text-7xl border-b w-fit">
                  <div>
                    {detailMovie.detail?.title ||
                      detailMovie.detail?.original_title}
                  </div>
                  <div></div>
                </div>
                <div>
                  <Button
                    color="blue"
                    onClick={() =>
                      setCartItem({
                        id: detailMovie.detail?.id!,
                        image: detailMovie.detail?.poster_path!,
                        price: detailMovie.detail?.price!,
                        title: detailMovie.detail?.title!,
                      })
                    }
                  >
                    เพิ่มลงตระกร้า
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative h-full w-full p-8">
        <div className="flex gap-8 flex-wrap h-[125px]">
          <div className="text-white font-bold text-2xl">Popular Movie</div>
          <div>
            <MovieList
              onEdited={() => refresh()}
              data={popularsList.slice(0, 8)}
              setCartItem={setCartItem}
            />
          </div>
          <div className="text-white font-bold text-2xl">Top Rate Movie</div>
          <div>
            <MovieList
              onEdited={() => refresh()}
              data={topRatedList.slice(0, 8)}
              setCartItem={setCartItem}
            />
          </div>
          <div className="text-white font-bold text-2xl">Upcoming Movie</div>
          <div>
            <MovieList
              onEdited={() => refresh()}
              data={upcomingList.slice(0, 8)}
              setCartItem={setCartItem}
            />
          </div>
        </div>

        <div className="fixed bottom-0 right-0 m-4 z-50">
          <Cart newItem={cartItem} onSuccess={onFinishAddToCart} />
        </div>
      </div>
    </>
  );
}

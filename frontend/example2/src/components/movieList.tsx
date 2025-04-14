import { toast } from "sonner";
import { MoviePos } from "../apis/interface";
import Button from "./button";
import React, { useState } from "react";
import { CartItem } from "./cart";
import EditMovieDetail from "./editDetail";

export default function MovieList({
  data,
  setCartItem,
  onEdited,
}: {
  data: MoviePos[];
  onEdited: () => void;
  setCartItem: React.Dispatch<React.SetStateAction<CartItem | null>>;
}) {
  const [selectIdMovie, setSelectIdMovie] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  function closeDialogEdit() {
    setOpenEditDialog(false);
    setSelectIdMovie(null);
  }
  function onEditSuccess() {
    setOpenEditDialog(false);
    setSelectIdMovie(null);
    onEdited();
    toast.success(`แก้ไขสำเร็จ`);
  }

  return (
    <>
      <div className="flex gap-2 rounded-4xl  flex-wrap ">
        {data.map((movie) => (
          <div key={movie.id} className="w-[350px] bg-white rounded-xl">
            <div className=" overflow-hidden rounded-xl">
              <div className="relative h-[200px] w-full">
                <img
                  className="w-full h-full object-cover"
                  src={movie.backdrop_path!}
                  alt={movie.backdrop_path!}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-1 z-10">
                  <div className="font-semibold flex justify-between">
                    <div>{movie.title || movie.original_title}</div>
                    <div>ราคา : {movie.price}</div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 right-0 z-10">
                  <div className="flex justify-end gap-2 mt-2 px-2 pb-2">
                    <div className="flex flex-col">
                      <Button
                        color="blue"
                        onClick={() => {
                          setCartItem({
                            id: movie.id,
                            image: movie.poster_path!,
                            price: movie.price,
                            title: movie.title,
                          });
                        }}
                      >
                        เพิ่ม
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectIdMovie(movie.id);
                          setOpenEditDialog(true);
                        }}
                      >
                        แก้ไข
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditMovieDetail
        onSuccess={onEditSuccess}
        id={selectIdMovie}
        isOpen={openEditDialog}
        onClose={closeDialogEdit}
      ></EditMovieDetail>
    </>
  );
}

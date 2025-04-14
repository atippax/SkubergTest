import { useEffect, useState } from "react";
import MovieApi from "../apis/movieApi";
import { Modal } from "./dialog";
import { useLocalStorage } from "../hooks/useStorage";
import { CartItem } from "./cart";
import Input from "./input";
import Button from "./button";
import { LocalStorageKey } from "../constants/keyStorage";

export default function EditMovieDetail({
  id,
  isOpen,
  onClose,
  onSuccess,
}: {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const movieApi = MovieApi();
  const [details, setDetails] = useLocalStorage<CartItem[]>(
    LocalStorageKey.movieDetail,
    []
  );
  const [editData, setEditData] = useState<CartItem | null>(null);
  function saveDetail() {
    if (!details) return;
    const index = details.findIndex((x) => x.id == editData?.id);
    details[index].title = editData!.title;
    details[index].price = editData!.price;
    setDetails(details);
    onSuccess();
  }
  async function fetchDetail() {
    if (id != null) {
      const data = await movieApi.getMovieDetails(id!);
      const itemExist = details.find((x) => x.id == data.id);

      if (itemExist == undefined) {
        const newEditData = {
          id: data.id,
          image: data.poster_path,
          price: 20,
          title: data.title,
        };
        setEditData(newEditData);
        setDetails([...details, newEditData]);
      } else {
        setEditData({
          ...itemExist,
        });
      }
    }
  }
  useEffect(() => {
    fetchDetail();
  }, [isOpen]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        actions={
          <>
            <Button onClick={onClose}>ปิด</Button>
            <Button color="green" onClick={saveDetail}>
              บันทึก
            </Button>
          </>
        }
        content={
          <>
            <div className="flex gap-4">
              <img src={editData?.image} className="h-[200px]" alt="" />
              <div>
                ชื่อภาพยนต์
                <Input
                  type="text"
                  value={editData?.title ?? ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev!,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Title"
                />
                <br />
                ราคาภาพยนต์
                <Input
                  type="text"
                  value={editData?.price ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setEditData((prev) => ({
                      ...prev!,
                      price: isNaN(value) ? 0 : value,
                    }));
                  }}
                  placeholder="Price"
                />
              </div>
            </div>
          </>
        }
        header={
          <h2 className="text-xl font-semibold">แก้ไขรายละเอียดภาพยนต์</h2>
        }
      ></Modal>
    </>
  );
}

import { useEffect, useState } from "react";
import { Modal } from "./dialog";
import { useLocalStorage } from "../hooks/useStorage";
import calculate from "../utils/calculate";
import { LocalStorageKey } from "../constants/keyStorage";
import Button from "./button";
import { toast } from "sonner";
export interface CartItem {
  id: number;
  price: number;
  title: string;
  image: string;
}
interface GroupMovie extends CartItem {
  qty: number;
}
export default function Cart({
  newItem,
  onSuccess,
}: {
  newItem: CartItem | null;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const [cartItem, setCartItem] = useLocalStorage<CartItem[]>(
    LocalStorageKey.cart,
    []
  );
  const [price, setPrice] = useState<{ discount: number; total: number }>({
    discount: 0,
    total: 0,
  });
  function calPrice() {
    const { discount, total } = calculate(cartItem.map((x) => x.price));
    setPrice({
      discount,
      total,
    });
  }
  useEffect(() => {
    if (newItem == null) return;
    setCartItem((prev) => [...prev, newItem]);
    onSuccess();
  }, [newItem]);

  useEffect(() => {
    calPrice();
  }, [cartItem]);

  const [timeoutText, setTimeoutText] = useState("");
  const [interval, setIntervalFn] = useState<number | null>(null);
  function clear() {
    setIntervalFn(null);
    clearInterval(interval!);
    setCartItem([]);
    setOpenPayment(false);
    calPrice();
    toast.success("จ่ายเงินสำเร็จ");
  }
  function makePayment() {
    setOpen(false);
    setOpenPayment(true);
    let time = 60;
    setTimeoutText(time.toString());

    setIntervalFn(
      setInterval(() => {
        if (time <= 0) {
          console.log("tt");
          clear();

          return;
        }
        time--;
        setTimeoutText(time.toString());
        console.log("tt");
      }, 1000)
    );
  }
  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        ตะกร้า {cartItem.length}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        header={<h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>}
        content={
          <div className="w-[400px] flex flex-col gap-2 border-b border-t ">
            <h1 className="text-2xl font-bold">รายการภาพยนต์ที่เลือก</h1>
            <div className="relative h-[500px] m-[12px]">
              <div className=" flex flex-col gap-4 absolute overflow-auto top-[0] left-[0] right-[0] bottom-[0]">
                {cartItem
                  .reduce((acc, item) => {
                    const key = item.id;
                    const index = acc.findIndex(
                      (x) => x.id == key && x.price == item.price
                    );
                    if (index > -1) {
                      acc[index].qty += 1;
                    } else {
                      acc.push({
                        ...item,
                        qty: 1,
                      });
                    }
                    return acc;
                  }, [] as GroupMovie[])
                  .map((movie) => (
                    <div key={movie.id + movie.qty}>
                      <div className="flex gap-2">
                        <div>
                          <img
                            src={movie.image}
                            className="h-[150px] aspect-auto "
                            alt={movie.image}
                          />
                        </div>
                        <div>
                          <p>เรื่อง : {movie.title}</p>
                          <p>ราคา : {movie.price}</p>
                          <p>จำนวน : {movie.qty}</p>
                        </div>
                      </div>
                      <div className="border-b-blue-950 w-full"></div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex flex-col items-end">
                <div className="flex gap-4">
                  <div>สรุปราคาทั้งหมด :</div>
                  <div>{price.total.toFixed(2)}</div>
                </div>
                <div className="flex gap-4">
                  <div>ส่วนลด :</div>
                  <div>{(price.total - price.discount).toFixed(2)}</div>
                </div>
                <div className="flex gap-4">
                  <div>ยอดชำระ :</div>
                  <div>{price.discount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        }
        actions={
          <>
            <button
              onClick={() => {
                setCartItem([]);
                setOpen(false);
                calPrice();
              }}
            >
              ล้างตะกร้า
            </button>

            <button
              className="px-3 py-1 bg-blue-600 text-white rounded-md"
              onClick={() => {
                makePayment();
              }}
            >
              ชำระเงิน
            </button>
          </>
        }
      />
      <Modal
        isOpen={openPayment}
        onClose={() => setOpenPayment(false)}
        header={
          <>
            <h1>ชำระเงิน</h1>
          </>
        }
        content={
          <>
            <div>
              กรุณาโอนเงินมาที่ xxx-xxx-xxx-xxxx ภายใน {timeoutText} วินาที
            </div>
          </>
        }
        actions={
          <>
            <Button
              onClick={() => {
                clear();
              }}
            >
              ปิด
            </Button>
          </>
        }
      ></Modal>
    </div>
  );
}

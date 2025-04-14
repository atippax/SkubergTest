import { ReactNode, useState, useCallback } from "react";
import Input from "../components/input";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const targetPath = `/search?search=${encodeURIComponent(search)}`;

        if (location.pathname === "/search") {
          navigate(targetPath, { replace: true });
        } else {
          navigate(targetPath);
        }
      }
    },
    [search, location.pathname, navigate]
  );

  const handleLogoClick = useCallback(() => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="relative">
      <div className="fixed top-0 right-0 left-0 z-50 flex justify-between items-center bg-gray-800 p-8">
        <h1
          onClick={handleLogoClick}
          className="text-4xl text-white font-bold cursor-pointer hover:text-gray-300 transition-colors"
        >
          The TMDB SHOP
        </h1>
        <div className="w-[50%]">
          <Input
            placeholder="ค้นหาภาพยนต์"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyPress}
          />
        </div>
      </div>
      <div className={location.pathname === "/" ? "" : "pt-[96px]"}></div>
      {children}
    </div>
  );
}

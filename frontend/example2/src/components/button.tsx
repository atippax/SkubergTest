import React from "react";

type ButtonColor = "yellow" | "blue" | "red" | "green" | "gray";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
}

const colorClasses: Record<ButtonColor, string> = {
  yellow:
    "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-900",
  blue: "text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 dark:focus:ring-blue-800",
  red: "text-white bg-red-500 hover:bg-red-600 focus:ring-red-300 dark:focus:ring-red-800",
  green:
    "text-white bg-green-500 hover:bg-green-600 focus:ring-green-300 dark:focus:ring-green-800",
  gray: "text-white bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 dark:focus:ring-gray-800",
};

export default function Button({
  className = "",
  color = "yellow",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:ring-4 ${colorClasses[color]} ${className}`}
      {...props}
    />
  );
}

// button.tsx
import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function Button({
  children,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`flex items-center justify-center rounded px-4 py-2 transition-colors ${
        disabled || loading ? "opacity-75 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

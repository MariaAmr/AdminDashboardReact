import { LoaderCircle, Lock, Mail, UserRound } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../auth/auth";
import { Toaster, toast } from "react-hot-toast";
const Button = ({
  children,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`flex items-center justify-center h-10 rounded-lg transition-colors ${className} ${
      disabled ? "opacity-75 cursor-not-allowed" : ""
    }`}
  >
    {loading ? (
      <>
        <LoaderCircle className="animate-spin mr-2" size={18} />
        {children}
      </>
    ) : (
      children
    )}
  </button>
);

const Input = ({
  type,
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
}: {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export function RegisterPage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setAuthError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    // Validation
    const validationErrors = {
      username: !user.username ? "Username is required" : "",
      email: !user.email ? "Email is required" : "",
      password: !user.password
        ? "Password is required"
        : user.password.length < 6
        ? "Password must be at least 6 characters"
        : "",
      confirmPassword:
        user.password !== user.confirmPassword ? "Passwords do not match" : "",
    };

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await register({
        username: user.username,
        email: user.email,
        password: user.password,
      });

      toast.success("Registration successful! Please login");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-300 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <Toaster position="top-center" />

        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">
          Create an account
        </h2>

        {authError && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Username"
            name="username"
            placeholder="Enter your username"
            value={user.username}
            onChange={handleChange}
            error={errors.username}
            icon={<UserRound size={20} />}
          />

          <Input
            type="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={20} />}
          />

          <Input
            type="password"
            label="Password"
            name="password"
            placeholder="Create a password (min 6 characters)"
            value={user.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock size={20} />}
          />

          <Input
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={user.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<Lock size={20} />}
          />

          <Button
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
            disabled={isLoading}
            loading={isLoading}
            type="submit"
          >
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
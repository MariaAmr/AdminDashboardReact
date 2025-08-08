import { Mail } from "lucide-react";
import { useState } from "react";
import Button from "../button/button";
import { usersDB } from "../auth/auth";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Simulate API 
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userExists = usersDB.some((user) => user.email === email);

      if (!userExists) {
        throw new Error("No account found with this email address");
      }

    
      setSuccess(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset link";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-300 p-4 sm:p-12">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 sm:p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div className="space-y-4 rounded-lg bg-green-50 p-4 text-center">
            <p className="text-green-700">Password reset link sent to:</p>
            <p className="font-medium text-green-800">{email}</p>
            <p className="text-sm text-green-600">
              Check your inbox and follow the instructions
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full justify-center bg-neutral-800 hover:bg-neutral-700 text-white"
              >
                {loading ? "Sending..." : "Reset Password"}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm pt-4">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default ForgotPasswordPage;

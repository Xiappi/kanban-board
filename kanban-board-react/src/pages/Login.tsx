import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "../auth/firebase";
import Icon from "@mdi/react";
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid place-items-center min-h-screen bg-gray-100">
      <div className="w-100 max-w-md bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <h2 className="mb-2">
          {authMode === "login" ? "Log in" : "Create account"}
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          {authMode === "login"
            ? "Use your email and password to sign in."
            : "Sign up with an email and password."}
        </p>

        <form onSubmit={handleEmailAuth} className="mt-6">
          <label className="text-md text-gray-600 block mb-2">
            Email
            <input
              className="w-full rounded-lg text-md py-[4px] px-[10px] mt-1 border border-gray-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="text-md text-gray-600 block mb-2">
            Password
            <div className="relative">
              <input
                className="w-full rounded-lg text-md py-[4px] px-[10px] mt-1 border border-gray-300"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-[8px] top-[9px]"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                <span className="relative w-5 h-5 inline-block">
                  <Icon
                    path={mdiEyeOutline}
                    size={1}
                    aria-hidden
                    className={`absolute inset-0 transition-all duration-150 ease-in-out transform ${
                      showPw
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75 pointer-events-none"
                    }`}
                  />
                  <Icon
                    path={mdiEyeOffOutline}
                    size={1}
                    aria-hidden
                    className={`absolute inset-0 transition-all duration-150 ease-in-out transform ${
                      showPw
                        ? "opacity-0 scale-75 pointer-events-none"
                        : "opacity-100 scale-100"
                    }`}
                  />
                </span>
              </button>
            </div>
          </label>

          {error && (
            <div className="p-2 my-3 rounded-lg bg-red-100 border border-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 cursor-pointer"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : authMode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        <div className="text-center my-[12px]">- or -</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full border border-[#d1d5db] rounded-lg bg-gray-50 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer"
          disabled={loading}
        >
          Continue with Google
        </button>

        <p style={{ marginTop: 16, textAlign: "center" }}>
          {authMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setAuthMode((m) => (m === "login" ? "signup" : "login"))
            }
            className="cursor-pointer text-blue-500 hover:text-blue-700 font-semibold"
          >
            {authMode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

const DAILY_PASSWORD = "DigitalDost@Nitin@22!1234";

export default function DailyAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDailyAuth();
  }, []);

  const checkDailyAuth = () => {
    const today = new Date().toDateString();
    const lastAuthDate = localStorage.getItem("lastAuthDate");
    
    if (lastAuthDate === today) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === DAILY_PASSWORD) {
      const today = new Date().toDateString();
      localStorage.setItem("lastAuthDate", today);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-slate-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl sm:text-3xl">🔐</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              Daily Authentication
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Enter password to access Call Manager Pro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Enter daily password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold text-base shadow-lg"
            >
              Access System
            </button>
          </form>

          <div className="text-center mt-4 sm:mt-6 text-xs text-slate-500">
            Authentication required once per day
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
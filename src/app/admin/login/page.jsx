"use client";
import React from "react";

function MainComponent() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [initialCheck, setInitialCheck] = React.useState(false);

  React.useEffect(() => {
    const verifyExistingToken = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setInitialCheck(true);
          return;
        }

        console.log("Verifying token:", token);
        const response = await fetch("/api/admin-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "verify",
            token: token,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Token verification response:", data);

        if (data.success) {
          // Redirect based on whether this is first login
          if (!data.user?.last_login) {
            window.location.href = "/admin/change-password";
          } else {
            window.location.href = "/admin";
          }
        } else {
          console.log("Token verification failed:", data.error);
          localStorage.removeItem("adminToken");
        }
      } catch (err) {
        console.error("Token verification error:", err);
        localStorage.removeItem("adminToken");
      } finally {
        setInitialCheck(true);
      }
    };

    verifyExistingToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with username:", username);
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);

        // Redirect based on whether this is first login
        if (!data.user?.last_login) {
          window.location.href = "/admin/change-password";
        } else {
          window.location.href = "/admin";
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until initial token check is complete
  if (!initialCheck) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center items-center">
        <i className="fas fa-spinner fa-spin text-[#1D4ED8] text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a href="/" className="flex items-center justify-center">
          <i className="fas fa-cog text-[#1D4ED8] text-4xl mr-2"></i>
          <span className="font-bold text-2xl">iTechSmart</span>
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1941B1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8]"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
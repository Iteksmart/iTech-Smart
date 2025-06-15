"use client";
import React from "react";

function MainComponent() {
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const verifyEmail = async (token) => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Email verification failed");
        }

        setStatus("success");
      } catch (err) {
        setError("Failed to verify email. The link may be expired or invalid.");
        setStatus("error");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);

    if (tokenFromUrl) {
      verifyEmail(tokenFromUrl);
    } else {
      setError("No verification token found");
      setStatus("error");
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          {status === "verifying" && (
            <>
              <i className="fas fa-spinner fa-spin text-[#1D4ED8] text-4xl mb-4"></i>
              <h1 className="text-3xl font-bold text-gray-800">
                Verifying Email
              </h1>
              <p className="mt-2 text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
              <h1 className="text-3xl font-bold text-gray-800">
                Email Verified!
              </h1>
              <p className="mt-2 text-gray-600">
                Your email has been successfully verified.
              </p>
              <div className="mt-8">
                <a
                  href="/account/signin"
                  className="bg-[#1D4ED8] text-white px-6 py-3 rounded-lg hover:bg-[#1941A5]"
                >
                  Sign In
                </a>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
              <h1 className="text-3xl font-bold text-gray-800">
                Verification Failed
              </h1>
              <p className="mt-2 text-red-500">{error}</p>
              <div className="mt-8">
                <a
                  href="/account/signup"
                  className="text-[#1D4ED8] hover:text-[#1941A5]"
                >
                  Return to Sign Up
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
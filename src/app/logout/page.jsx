"use client";
import React from "react";

function MainComponent() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <i className="fas fa-sign-out-alt text-[#1D4ED8] text-4xl mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-800">Sign Out</h1>
          <p className="mt-2 text-gray-600">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-[#1D4ED8] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#1941A5] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2"
          >
            Sign Out
          </button>

          <a
            href="/"
            className="block w-full rounded-lg border border-[#1D4ED8] px-4 py-3 text-base font-medium text-[#1D4ED8] text-center transition-colors hover:bg-blue-50"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
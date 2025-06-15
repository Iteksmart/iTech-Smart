"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <nav className="flex items-center justify-between p-4 bg-white">
        <a href="/" className="flex items-center">
          <i className="fas fa-cog text-[#1D4ED8] text-2xl mr-2"></i>
          <span className="font-bold text-xl">iTechSmart</span>
        </a>
        <div className="hidden md:flex items-center space-x-6">
          <a href="/features" className="text-gray-600 hover:text-[#1D4ED8]">
            Features
          </a>
          <a href="/use-cases" className="text-gray-600 hover:text-[#1D4ED8]">
            Use Cases
          </a>
          <a href="/pricing" className="text-gray-600 hover:text-[#1D4ED8]">
            Pricing
          </a>
          <a href="/about" className="text-gray-600 hover:text-[#1D4ED8]">
            About
          </a>
          <a href="/contact" className="text-gray-600 hover:text-[#1D4ED8]">
            Contact
          </a>
          {!loading && (
            <>
              {user ? (
                <>
                  <a href="/dashboard" className="text-[#1D4ED8]">
                    Dashboard
                  </a>
                  <a
                    href="/account/logout"
                    className="bg-[#1D4ED8] text-white px-4 py-2 rounded"
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a href="/account/signin" className="text-[#1D4ED8]">
                    Login
                  </a>
                  <a
                    href="/account/signup"
                    className="bg-[#1D4ED8] text-white px-4 py-2 rounded"
                  >
                    Start Free
                  </a>
                </>
              )}
            </>
          )}
        </div>
        <button className="md:hidden text-gray-600">
          <i className="fas fa-bars"></i>
        </button>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Knowledge Base</h1>
            <p className="text-gray-600">Find solutions to common IT issues</p>
          </div>
          {user && (
            <a
              href="/dashboard"
              className="flex items-center text-[#1D4ED8] hover:text-[#1941A5]"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </a>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedCategory === category.id
                        ? "bg-blue-50 text-[#1D4ED8]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-2xl text-[#1D4ED8]"></i>
                <p className="mt-2 text-gray-600">Loading articles...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {article.title}
                      </h3>
                      <span className="bg-blue-100 text-[#1D4ED8] text-xs px-2 py-1 rounded">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        <i className="far fa-clock mr-1"></i>
                        {article.readTime} min read
                      </span>
                      <button className="text-[#1D4ED8] hover:text-[#1941A5]">
                        Read More
                        <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
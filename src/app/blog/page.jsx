"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [blogPosts, setBlogPosts] = React.useState([
    {
      id: 1,
      title: "Understanding the OSI Model in Network Troubleshooting",
      excerpt:
        "A comprehensive guide to using the OSI model for effective network problem solving...",
      category: "Networking",
      author: "Sarah Chen",
      date: "2025-01-15",
      readTime: "8 min read",
      image: "/images/blog/networking.jpg",
    },
    {
      id: 2,
      title: "Best Practices for IT Security in 2025",
      excerpt:
        "Essential security measures every IT professional should implement...",
      category: "Security",
      author: "Marcus Rodriguez",
      date: "2025-01-12",
      readTime: "6 min read",
      image: "/images/blog/security.jpg",
    },
    {
      id: 3,
      title: "Automating System Administration Tasks",
      excerpt:
        "Learn how to streamline your workflow with PowerShell and Bash scripting...",
      category: "Automation",
      author: "David Kim",
      date: "2025-01-10",
      readTime: "10 min read",
      image: "/images/blog/automation.jpg",
    },
    {
      id: 4,
      title: "Cloud Migration Strategies for Enterprise",
      excerpt:
        "A step-by-step guide to moving your infrastructure to the cloud...",
      category: "Cloud",
      author: "Emily Watson",
      date: "2025-01-08",
      readTime: "12 min read",
      image: "/images/blog/cloud.jpg",
    },
  ]);

  const categories = [
    "all",
    "Networking",
    "Security",
    "Automation",
    "Cloud",
    "Best Practices",
    "Troubleshooting",
  ];

  React.useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center">
              <i className="fas fa-cog text-[#1D4ED8] text-2xl mr-2"></i>
              <span className="font-bold text-xl">iTechSmart</span>
            </a>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/features"
                className="text-gray-600 hover:text-[#1D4ED8]"
              >
                Features
              </a>
              <a
                href="/use-cases"
                className="text-gray-600 hover:text-[#1D4ED8]"
              >
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
                      <a
                        href="/account/signin"
                        className="cta-button bg-[#2563eb] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1d4ed8] transform transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
            IT Insights & Resources
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600">
            Stay up to date with the latest IT trends, best practices, and
            technical insights
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-3/4">
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-500 hover:scale-105"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#1D4ED8] bg-blue-50 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {post.author}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`cta-button block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-[#2563eb] text-white font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4">Newsletter</h2>
              <p className="text-gray-600 mb-4">
                Subscribe to our newsletter for the latest IT insights and
                updates.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 mb-4"
              />
              <button className="cta-button primary-button w-full">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
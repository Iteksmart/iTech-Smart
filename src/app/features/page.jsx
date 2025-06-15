"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activeDemo, setActiveDemo] = React.useState("troubleshooting");
  const [demoInput, setDemoInput] = React.useState("");
  const [demoOutput, setDemoOutput] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDemoChange = (demoType) => {
    setActiveDemo(demoType);
    setDemoInput("");
    setDemoOutput("");
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoOutput(`Demo output for ${activeDemo}: ${demoInput}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <nav className="flex items-center justify-between p-4 bg-white relative">
        <a href="/" className="flex items-center">
          <i className="fas fa-cog text-[#1D4ED8] text-2xl mr-2"></i>
          <span className="font-bold text-xl">iTechSmart</span>
        </a>
        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none space-y-4 md:space-y-0 md:items-center md:space-x-6 z-50`}
        >
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
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/account/logout";
                    }}
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/sign-in"
                    className="text-[#1D4ED8]"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/sign-in";
                    }}
                  >
                    Login
                  </a>
                  <a
                    href="/account/signup"
                    className="bg-[#1D4ED8] text-white px-4 py-2 rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/account/signup";
                    }}
                  >
                    Start Free
                  </a>
                </>
              )}
            </>
          )}
        </div>
        <button onClick={toggleMobileMenu} className="md:hidden text-gray-600">
          <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Features</h1>
        <p className="text-gray-600">
          Discover what AI IT Assistant can do for you
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            AI-Powered IT Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-network-wired text-[#1D4ED8] text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                OSI Model Troubleshooting
              </h3>
              <p className="text-gray-600 mb-4">
                Systematic network diagnostics using the 7-layer OSI model
                approach
              </p>
              <button
                onClick={() => setActiveDemo("troubleshooting")}
                className="text-[#1D4ED8] hover:text-[#1941A5]"
              >
                Try Demo <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-terminal text-[#1D4ED8] text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Script Generation</h3>
              <p className="text-gray-600 mb-4">
                Instant PowerShell and Bash scripts for common IT tasks
              </p>
              <button
                onClick={() => setActiveDemo("scripts")}
                className="text-[#1D4ED8] hover:text-[#1941A5]"
              >
                Try Demo <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-tasks text-[#1D4ED8] text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600 mb-4">
                Track and organize IT tasks with smart checklists
              </p>
              <button
                onClick={() => setActiveDemo("tasks")}
                className="text-[#1D4ED8] hover:text-[#1941A5]"
              >
                Try Demo <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-robot text-[#1D4ED8] text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Chat Assistant</h3>
              <p className="text-gray-600 mb-4">
                24/7 IT support powered by advanced AI
              </p>
              <button
                onClick={() => setActiveDemo("chat")}
                className="text-[#1D4ED8] hover:text-[#1941A5]"
              >
                Try Demo <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Interactive Demo</h2>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDemoChange("troubleshooting")}
                  className={`px-4 py-2 rounded text-sm md:text-base ${
                    activeDemo === "troubleshooting"
                      ? "bg-blue-100 text-[#1D4ED8]"
                      : "text-gray-600"
                  }`}
                >
                  Troubleshooting
                </button>
                <button
                  onClick={() => handleDemoChange("scripts")}
                  className={`px-4 py-2 rounded text-sm md:text-base ${
                    activeDemo === "scripts"
                      ? "bg-blue-100 text-[#1D4ED8]"
                      : "text-gray-600"
                  }`}
                >
                  Scripts
                </button>
                <button
                  onClick={() => handleDemoChange("tasks")}
                  className={`px-4 py-2 rounded text-sm md:text-base ${
                    activeDemo === "tasks"
                      ? "bg-blue-100 text-[#1D4ED8]"
                      : "text-gray-600"
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => handleDemoChange("chat")}
                  className={`px-4 py-2 rounded text-sm md:text-base ${
                    activeDemo === "chat"
                      ? "bg-blue-100 text-[#1D4ED8]"
                      : "text-gray-600"
                  }`}
                >
                  Chat
                </button>
              </div>

              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder={
                    activeDemo === "troubleshooting"
                      ? "Describe your network issue..."
                      : activeDemo === "scripts"
                      ? "What script do you need?"
                      : activeDemo === "tasks"
                      ? "Enter a task to manage..."
                      : "Ask your IT question..."
                  }
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#1D4ED8] text-white px-6 py-3 rounded-lg disabled:opacity-50 text-sm md:text-base"
                >
                  {loading ? "Processing..." : "Try It Out"}
                </button>
              </form>

              {demoOutput && (
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-sm md:text-base">
                    {demoOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">IT Support Teams</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Faster ticket resolution</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Automated troubleshooting</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Knowledge base integration</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                System Administrators
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Script automation</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>System monitoring</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Task management</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">IT Managers</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Team productivity tracking</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Resource optimization</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  <span>Performance analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Your IT Support?
          </h2>
          <p className="text-gray-600 mb-8">
            Experience the power of AI-assisted IT management today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/pricing"
              className="bg-[#1D4ED8] text-white px-6 py-3 rounded-lg"
            >
              Subscribe
            </a>
            <a
              href="/knowledge-base"
              className="border border-[#1D4ED8] text-[#1D4ED8] px-6 py-3 rounded-lg"
            >
              Browse Knowledge Base
            </a>
          </div>
        </section>
      </div>

      <div className="text-center mt-12 scroll-reveal">
        <a href="/account/signup" className="cta-primary mx-2">
          Try It Free
        </a>
        <a href="/contact" className="cta-secondary mx-2">
          Schedule Demo
        </a>
      </div>
    </div>
  );
}

export default MainComponent;
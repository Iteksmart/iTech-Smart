"use client";
import React from "react";

function MainComponent() {
  const [activeSection, setActiveSection] = React.useState("introduction");
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const sections = {
    introduction: {
      title: "Introduction",
      content: `The iTechSmart API allows you to programmatically access our IT automation and troubleshooting capabilities. This RESTful API supports JSON requests and responses, using standard HTTP methods and authentication.`,
    },
    authentication: {
      title: "Authentication",
      content: `All API requests must include your API key in the Authorization header:
      
Authorization: Bearer YOUR_API_KEY

You can obtain an API key from your dashboard settings page.`,
    },
    rateLimit: {
      title: "Rate Limits",
      content: `Free tier: 1000 requests/day
Premium tier: 10000 requests/day
Enterprise tier: Custom limits

Rate limit headers are included in all responses:
X-RateLimit-Limit: Your total limit
X-RateLimit-Remaining: Remaining requests
X-RateLimit-Reset: Time until limit resets`,
    },
    endpoints: {
      title: "API Endpoints",
      content: {
        troubleshooting: {
          method: "POST",
          path: "/api/v1/troubleshoot",
          description: "Analyze and provide solutions for IT issues",
          example: {
            request: `{
  "issue": "Cannot connect to network",
  "deviceType": "windows",
  "symptoms": ["No internet access", "WiFi connected"]
}`,
            response: `{
  "analysis": {
    "layer": "Network",
    "possibleCauses": ["DNS issues", "IP configuration"],
    "suggestedCommands": [
      "ipconfig /flushdns",
      "ipconfig /renew"
    ]
  }
}`,
          },
        },
        scripts: {
          method: "GET",
          path: "/api/v1/scripts",
          description: "Retrieve automation scripts",
          example: {
            request: `{
  "category": "network",
  "platform": "windows"
}`,
            response: `{
  "scripts": [
    {
      "id": "net001",
      "name": "Network Reset",
      "content": "..."
    }
  ]
}`,
          },
        },
      },
    },
  };

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

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-600"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Documentation</h2>
              <nav className="space-y-2">
                {Object.keys(sections).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`cta-button block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === key
                        ? "bg-[#2563eb] text-white font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {sections[key].title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
                {sections[activeSection].title}
              </h1>

              {activeSection === "endpoints" ? (
                Object.entries(sections.endpoints.content).map(
                  ([key, endpoint]) => (
                    <div
                      key={key}
                      className="mb-8 pb-8 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-blue-100 text-[#1D4ED8] px-3 py-1 rounded-full text-sm font-medium">
                          {endpoint.method}
                        </span>
                        <code className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                          {endpoint.path}
                        </code>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {endpoint.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Request</h3>
                          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <code className="text-green-400 font-mono text-sm">
                              {endpoint.example.request}
                            </code>
                          </pre>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Response</h3>
                          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <code className="text-green-400 font-mono text-sm">
                              {endpoint.example.response}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-600">
                    {sections[activeSection].content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex flex-col space-y-4">
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
                        className="bg-[#1D4ED8] text-white px-4 py-2 rounded text-center"
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
                        className="bg-[#1D4ED8] text-white px-4 py-2 rounded text-center"
                      >
                        Start Free
                      </a>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
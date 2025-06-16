"use client";
import React from "react";



function MainComponent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: user, loading: userLoading } = useUser();
  const { signOut } = useAuth();
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setIsLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/account/signin",
      redirect: true,
    });
  };

  const handleUpgradeSubscription = async (plan) => {
    setUpgradeLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subscription-handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-checkout",
          plan: plan,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError("Failed to process upgrade. Please try again.");
      console.error("Upgrade error:", err);
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center">
              <i className="fas fa-cog text-[#1D4ED8] text-2xl mr-2"></i>
              <span className="font-bold text-xl">iTechSmart</span>
            </a>

            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {user?.subscription_type || "Free Tier"}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 truncate max-w-[200px]">
                  {user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>

            {/* User Info - Mobile */}
            <div className="md:hidden flex items-center space-x-3">
              <span className="text-sm text-gray-700 truncate max-w-[120px]">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-gray-900"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Tabs */}
      <div className="sm:hidden bg-white border-b overflow-x-auto">
        <div className="flex whitespace-nowrap p-2 min-w-full">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 flex-shrink-0 ${
              activeTab === "dashboard"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <i className="fas fa-home mr-2"></i>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 ${
              activeTab === "chat"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <i className="fas fa-comments mr-2"></i>
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 ${
              activeTab === "tickets"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <i className="fas fa-ticket-alt mr-2"></i>
            Tickets
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mr-2 ${
              activeTab === "knowledge"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <i className="fas fa-book mr-2"></i>
            Knowledge
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "settings"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <i className="fas fa-cog mr-2"></i>
            Settings
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden sm:block w-64 bg-white shadow-lg">
          <nav className="p-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                activeTab === "dashboard"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-home mr-3 text-gray-500"></i>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                activeTab === "chat"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-comments mr-3 text-gray-500"></i>
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                activeTab === "tickets"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-ticket-alt mr-3 text-gray-500"></i>
              Tickets
            </button>
            <button
              onClick={() => setActiveTab("knowledge")}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                activeTab === "knowledge"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-book mr-3 text-gray-500"></i>
              Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                activeTab === "settings"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-cog mr-3 text-gray-500"></i>
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Subscription Banner */}
              {(!user?.subscription_type ||
                user?.subscription_type === "free") && (
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-4 sm:p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold">
                        Upgrade to Pro
                      </h2>
                      <p className="mt-2 text-sm sm:text-base">
                        Get unlimited AI chat, priority support, and advanced
                        features
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpgradeSubscription("pro")}
                      disabled={upgradeLoading}
                      className="w-full sm:w-auto px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {upgradeLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "Upgrade Now"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Quick Stats Card */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Open Tickets</span>
                      <span className="text-gray-900 font-medium">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Knowledge Articles</span>
                      <span className="text-gray-900 font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Team Members</span>
                      <span className="text-gray-900 font-medium">3</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <i className="fas fa-ticket-alt text-blue-500 mr-3"></i>
                      <span className="text-gray-600 text-sm sm:text-base">
                        New ticket created
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-book text-green-500 mr-3"></i>
                      <span className="text-gray-600 text-sm sm:text-base">
                        Knowledge base updated
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-user-plus text-purple-500 mr-3"></i>
                      <span className="text-gray-600 text-sm sm:text-base">
                        New team member added
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Status Card */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 text-sm sm:text-base">
                        All Systems Operational
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 text-sm sm:text-base">
                        API Status: Good
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 text-sm sm:text-base">
                        Database: Healthy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="bg-white rounded-lg shadow h-[calc(100vh-16rem)]">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  AI Assistant
                </h2>
              </div>
              <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[85%] sm:max-w-[70%] ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {streamingMessage && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[85%] sm:max-w-[70%] text-gray-900">
                        {streamingMessage}
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleChatSubmit} className="mt-auto">
                  <div className="flex space-x-2 sm:space-x-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-paper-plane"></i>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Tickets</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Server Down</h3>
                        <p className="text-gray-600 mt-1">
                          Production server is not responding
                        </p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        High
                      </span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Backup Failed</h3>
                        <p className="text-gray-600 mt-1">
                          Daily backup job failed to complete
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        Medium
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "knowledge" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Knowledge Base
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium">Common Issues</h3>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-blue-600 hover:text-blue-800">
                        <i className="fas fa-file-alt mr-2"></i>
                        <a href="#">Server Troubleshooting Guide</a>
                      </li>
                      <li className="flex items-center text-blue-600 hover:text-blue-800">
                        <i className="fas fa-file-alt mr-2"></i>
                        <a href="#">Network Configuration</a>
                      </li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium">Recent Articles</h3>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center text-blue-600 hover:text-blue-800">
                        <i className="fas fa-file-alt mr-2"></i>
                        <a href="#">Security Best Practices</a>
                      </li>
                      <li className="flex items-center text-blue-600 hover:text-blue-800">
                        <i className="fas fa-file-alt mr-2"></i>
                        <a href="#">Backup Procedures</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Settings</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Subscription Plans */}
                  <div>
                    <h3 className="text-lg font-medium">Subscription Plans</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Free Tier */}
                      <div
                        className={`border rounded-lg p-4 sm:p-6 ${
                          user?.subscription_type === "free"
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                      >
                        <h4 className="text-lg sm:text-xl font-medium">Free</h4>
                        <p className="mt-2 text-gray-600 text-sm sm:text-base">
                          Basic features for small teams
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>5 AI chats per day</span>
                          </li>
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>Basic support</span>
                          </li>
                        </ul>
                        <button
                          disabled={user?.subscription_type === "free"}
                          className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base"
                        >
                          Current Plan
                        </button>
                      </div>

                      {/* Pro Tier */}
                      <div
                        className={`border rounded-lg p-4 sm:p-6 ${
                          user?.subscription_type === "pro"
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                      >
                        <h4 className="text-lg sm:text-xl font-medium">Pro</h4>
                        <p className="mt-2 text-gray-600 text-sm sm:text-base">
                          Advanced features for growing teams
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>Unlimited AI chats</span>
                          </li>
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>Priority support</span>
                          </li>
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>Advanced analytics</span>
                          </li>
                        </ul>
                        <button
                          onClick={() => handleUpgradeSubscription("pro")}
                          disabled={
                            user?.subscription_type === "pro" || upgradeLoading
                          }
                          className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base"
                        >
                          {user?.subscription_type === "pro"
                            ? "Current Plan"
                            : "Upgrade to Pro"}
                        </button>
                      </div>

                      {/* Enterprise Tier */}
                      <div
                        className={`border rounded-lg p-4 sm:p-6 ${
                          user?.subscription_type === "enterprise"
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                      >
                        <h4 className="text-lg sm:text-xl font-medium">
                          Enterprise
                        </h4>
                        <p className="mt-2 text-gray-600 text-sm sm:text-base">
                          Custom solutions for large teams
                        </p>
                        <ul className="mt-4 space-y-2">
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>All Pro features</span>
                          </li>
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>Dedicated support</span>
                          </li>
                          <li className="flex items-center text-sm sm:text-base">
                            <i className="fas fa-check text-green-500 mr-2"></i>
                            <span>Custom integrations</span>
                          </li>
                        </ul>
                        <button
                          onClick={() =>
                            handleUpgradeSubscription("enterprise")
                          }
                          disabled={
                            user?.subscription_type === "enterprise" ||
                            upgradeLoading
                          }
                          className="mt-6 w-full px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 text-sm sm:text-base"
                        >
                          {user?.subscription_type === "enterprise"
                            ? "Current Plan"
                            : "Contact Sales"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Settings */}
                  <div>
                    <h3 className="text-lg font-medium">Profile Settings</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || ""}
                          readOnly
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subscription
                        </label>
                        <input
                          type="text"
                          value={user?.subscription_type || "Free Tier"}
                          readOnly
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}
    </div>
  );
}

export default MainComponent;

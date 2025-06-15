"use client";
import React from "react";

function MainComponent() {
  const [activeTab, setActiveTab] = React.useState("knowledge");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [content, setContent] = React.useState({
    knowledgeBase: [],
    scripts: [],
    onboarding: [],
  });
  const [editingItem, setEditingItem] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const verifyAdminAndFetchContent = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          window.location.replace("/admin/login");
          return;
        }

        const authResponse = await fetch("/api/admin-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify", token }),
        });

        if (!authResponse.ok) {
          throw new Error("Admin verification failed");
        }

        const contentResponse = await fetch("/api/content-management", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!contentResponse.ok) {
          throw new Error("Failed to fetch content");
        }

        const data = await contentResponse.json();
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAndFetchContent();
  }, []);

  const handleContentAction = async (action, type, item) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch("/api/content-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, type, item }),
      });

      if (!response.ok) {
        throw new Error("Action failed");
      }

      const updatedContent = await response.json();
      setContent(updatedContent);
      setEditingItem(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-[#1D4ED8] text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Content Management
          </h1>
          <a href="/admin" className="text-[#1D4ED8] hover:text-[#1941A5]">
            <i className="fas fa-arrow-left mr-2"></i>Back to Dashboard
          </a>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <button
                onClick={() => setActiveTab("knowledge")}
                className={`px-4 py-2 rounded ${
                  activeTab === "knowledge"
                    ? "bg-blue-100 text-[#1D4ED8]"
                    : "text-gray-600"
                }`}
              >
                Knowledge Base
              </button>
              <button
                onClick={() => setActiveTab("scripts")}
                className={`px-4 py-2 rounded ${
                  activeTab === "scripts"
                    ? "bg-blue-100 text-[#1D4ED8]"
                    : "text-gray-600"
                }`}
              >
                Scripts
              </button>
              <button
                onClick={() => setActiveTab("onboarding")}
                className={`px-4 py-2 rounded ${
                  activeTab === "onboarding"
                    ? "bg-blue-100 text-[#1D4ED8]"
                    : "text-gray-600"
                }`}
              >
                Onboarding
              </button>
            </div>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Title</th>
                  <th className="text-left py-4 px-4">Last Updated</th>
                  <th className="text-left py-4 px-4">Usage</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-right py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {content[
                  activeTab === "knowledge"
                    ? "knowledgeBase"
                    : activeTab === "scripts"
                    ? "scripts"
                    : "onboarding"
                ]
                  .filter((item) =>
                    item.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-4">{item.title}</td>
                      <td className="py-4 px-4">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">{item.usage || 0} views</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "published"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-[#1D4ED8] hover:text-[#1941A5] mr-4"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction("delete", activeTab, item)
                          }
                          className="text-red-500 hover:text-red-600"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                setEditingItem({ title: "", content: "", status: "draft" })
              }
              className="bg-[#1D4ED8] text-white px-6 py-2 rounded-lg hover:bg-[#1941A5]"
            >
              <i className="fas fa-plus mr-2"></i>Add New
            </button>
          </div>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem.id ? "Edit Content" : "Add New Content"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editingItem.content}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, content: e.target.value })
                  }
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleContentAction(
                    editingItem.id ? "update" : "create",
                    activeTab,
                    editingItem
                  )
                }
                className="bg-[#1D4ED8] text-white px-6 py-2 rounded-lg hover:bg-[#1941A5]"
              >
                {editingItem.id ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
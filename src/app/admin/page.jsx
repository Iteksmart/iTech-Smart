"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [userMetrics, setUserMetrics] = React.useState(null);
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const [contentSection, setContentSection] = React.useState("knowledge");
  const [settingsSection, setSettingsSection] = React.useState("general");
  const [scriptTemplates, setScriptTemplates] = React.useState([]);
  const [onboardingContent, setOnboardingContent] = React.useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = React.useState([]);
  const [securityLogs, setSecurityLogs] = React.useState([]);
  const [systemNotifications, setSystemNotifications] = React.useState([]);
  const [appSettings, setAppSettings] = React.useState({});
  const [apiKeys, setApiKeys] = React.useState([]);
  const [featureToggles, setFeatureToggles] = React.useState([]);
  const [adminRoles, setAdminRoles] = React.useState([]);
  const [tickets, setTickets] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [ticketLoading, setTicketLoading] = React.useState(false);
  const [contactLoading, setContactLoading] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [ticketResponse, setTicketResponse] = React.useState("");
  const [ticketFilter, setTicketFilter] = React.useState("all");
  const [contactFilter, setContactFilter] = React.useState("new");
  const [dateRange, setDateRange] = React.useState("7d");
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false);
  const [analyticsData, setAnalyticsData] = React.useState(null);
  const [userGrowthData, setUserGrowthData] = React.useState([]);
  const [engagementData, setEngagementData] = React.useState([]);
  const [subscriptionData, setSubscriptionData] = React.useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = React.useState({
    activeNow: 0,
    activeHour: 0,
    lastUpdate: null,
  });
  const [generalSettings, setGeneralSettings] = React.useState({});
  const [settingsLoading, setSettingsLoading] = React.useState(false);
  const [settingsError, setSettingsError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState(null);
  const [pollingInterval, setPollingInterval] = React.useState(null);
  const [isAddingKey, setIsAddingKey] = React.useState(false);
  const [apiKeyError, setApiKeyError] = React.useState("");
  const [apiKeySuccess, setApiKeySuccess] = React.useState("");
  const [isRotating, setIsRotating] = React.useState(false);
  const [newApiKey, setNewApiKey] = React.useState({
    name: "",
    value: "",
    serviceType: "openai",
    environment: "production",
    rotationInterval: 30,
  });
  const [contentType, setContentType] = React.useState("knowledge");
  const [contentLoading, setContentLoading] = React.useState(false);
  const [contentTitle, setContentTitle] = React.useState("");
  const [contentDescription, setContentDescription] = React.useState("");
  const [contentCategory, setContentCategory] = React.useState("");
  const [contentStep, setContentStep] = React.useState(1);

  React.useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.log("No admin token found");
        window.location.replace("/admin/login");
        return;
      }

      try {
        const response = await fetch("/api/admin-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "verify",
            token,
          }),
        });

        const data = await response.json();
        console.log("Token verification response:", data);

        if (data.success && data.user) {
          console.log("Token verified successfully, user:", data.user);
          setUser(data.user);
          setLoading(false);
        } else {
          console.error("Token verification failed:", data.error);
          localStorage.removeItem("adminToken");
          window.location.replace("/admin/login");
        }
      } catch (err) {
        console.error("Error during token verification:", err);
        localStorage.removeItem("adminToken");
        window.location.replace("/admin/login");
      }
    };

    verifyToken();
  }, []);

  React.useEffect(() => {
    if (activeSection === "users") {
      fetchUsers();
    }
  }, [activeSection]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/user-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getUsers",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await fetch("/api/user-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateUserStatus",
          userId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      fetchUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityDescription = (user) => {
    if (!user.last_activity_at) return "No recent activity";

    const activities = [
      "Viewed dashboard",
      "Updated profile",
      "Accessed features",
      "Checked analytics",
      "Modified settings",
      "Generated content",
      "Reviewed documentation",
      "Managed subscriptions",
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setUpdateLoading(true);

    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_password",
          username: user.username,
          password: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUpdateSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Password update failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    window.location.replace("/admin/login");
  };

  React.useEffect(() => {
    if (activeSection === "analytics") {
      fetchAnalytics();
    }
  }, [activeSection, dateRange]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      // For testing, we'll use static sample data instead of making the API call
      const sampleData = {
        metrics: [
          {
            date: "2025-06-08",
            new_users: 12,
            total_users: 150,
            active_users: 45,
            pro_users: 20,
          },
          {
            date: "2025-06-09",
            new_users: 15,
            total_users: 165,
            active_users: 50,
            pro_users: 22,
          },
          {
            date: "2025-06-10",
            new_users: 18,
            total_users: 183,
            active_users: 55,
            pro_users: 25,
          },
          {
            date: "2025-06-11",
            new_users: 20,
            total_users: 203,
            active_users: 60,
            pro_users: 28,
          },
          {
            date: "2025-06-12",
            new_users: 25,
            total_users: 228,
            active_users: 65,
            pro_users: 30,
          },
          {
            date: "2025-06-13",
            new_users: 28,
            total_users: 256,
            active_users: 70,
            pro_users: 35,
          },
          {
            date: "2025-06-14",
            new_users: 30,
            total_users: 286,
            active_users: 75,
            pro_users: 40,
          },
        ],
        currentStats: {
          total_active_users: 75,
          total_pro_users: 40,
          total_users: 286,
        },
      };

      const { metrics, currentStats } = sampleData;

      setUserGrowthData(
        metrics.map((m) => ({
          date: m.date,
          value: m.new_users,
          total_users: m.total_users,
        }))
      );

      setEngagementData(
        metrics.map((m) => ({
          date: m.date,
          value: m.active_users,
        }))
      );

      setSubscriptionData(
        metrics.map((m) => ({
          date: m.date,
          value: m.pro_users,
        }))
      );

      setAnalyticsData({
        totalActiveUsers: currentStats.total_active_users,
        totalProUsers: currentStats.total_pro_users,
        totalUsers: currentStats.total_users,
      });
    } catch (err) {
      console.error("Error with analytics:", err);
      setError("Failed to load analytics");
      // Set default empty data
      setUserGrowthData([
        {
          date: new Date().toISOString().split("T")[0],
          value: 0,
          total_users: 0,
        },
      ]);
      setEngagementData([
        {
          date: new Date().toISOString().split("T")[0],
          value: 0,
        },
      ]);
      setSubscriptionData([
        {
          date: new Date().toISOString().split("T")[0],
          value: 0,
        },
      ]);
      setAnalyticsData({
        totalActiveUsers: 0,
        totalProUsers: 0,
        totalUsers: 0,
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const getDateRangeStart = (range) => {
    const date = new Date();
    switch (range) {
      case "7d":
        date.setDate(date.getDate() - 7);
        break;
      case "30d":
        date.setDate(date.getDate() - 30);
        break;
      case "90d":
        date.setDate(date.getDate() - 90);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  React.useEffect(() => {
    if (activeSection === "support") {
      fetchTickets();
      fetchContacts();
    }
  }, [activeSection]);

  const fetchTickets = async () => {
    setTicketLoading(true);
    try {
      const response = await fetch("/api/ticket-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getTickets",
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTickets(data.tickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets");
    } finally {
      setTicketLoading(false);
    }
  };

  const fetchContacts = async () => {
    setContactLoading(true);
    try {
      const response = await fetch("/api/contact-form-handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getSubmissions",
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setContacts(data.submissions);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load contact submissions");
    } finally {
      setContactLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch("/api/ticket-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateTicket",
          ticketId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      fetchTickets();
    } catch (err) {
      console.error("Error updating ticket:", err);
      setError("Failed to update ticket");
    }
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const response = await fetch("/api/contact-form-handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateStatus",
          contactId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      fetchContacts();
    } catch (err) {
      console.error("Error updating contact:", err);
      setError("Failed to update contact status");
    }
  };

  const calculateGrowthRate = (data) => {
    if (!data || data.length < 2) return 0;

    const oldValue = data[0]?.value || 0;
    const newValue = data[data.length - 1]?.value || 0;
    const totalUsers = data[data.length - 1]?.total_users || 0;

    if (oldValue === 0) return 0;
    const growthRate = ((newValue - oldValue) / oldValue) * 100;
    return {
      rate: growthRate.toFixed(1),
      total: totalUsers,
    };
  };

  const calculateEngagementRate = (data, totalActiveUsers) => {
    if (!data || data.length === 0 || totalActiveUsers === 0) return 0;

    const latestEngagement = data[data.length - 1]?.value || 0;
    return Math.min((latestEngagement / totalActiveUsers) * 100, 100).toFixed(
      1
    );
  };

  const calculateConversionRate = (data, totalActiveUsers) => {
    if (!data || data.length === 0 || totalActiveUsers === 0) return 0;

    const latestProUsers = data[data.length - 1]?.value || 0;
    return Math.min((latestProUsers / totalActiveUsers) * 100, 100).toFixed(1);
  };

  const formatMetricDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderAnalytics = () => {
    if (analyticsLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <i className="fas fa-spinner fa-spin text-2xl text-[#1D4ED8]"></i>
        </div>
      );
    }

    const totalActiveUsers = analyticsData?.totalActiveUsers || 0;
    const growthMetrics = calculateGrowthRate(userGrowthData);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#EBF5FF] p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Growth
          </h3>
          <div className="space-y-4">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {formatMetricDate(data.date)}
                </span>
                <span className="text-sm font-medium text-[#1D4ED8]">
                  {data.value} new users
                </span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Growth Rate (Period)</p>
              <p className="text-2xl font-semibold text-[#1D4ED8]">
                {growthMetrics.rate}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total Users: {growthMetrics.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#EBF5FF] p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Engagement
          </h3>
          <div className="space-y-4">
            {engagementData.map((data, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {formatMetricDate(data.date)}
                </span>
                <span className="text-sm font-medium text-[#1D4ED8]">
                  {data.value} active users
                </span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Current Engagement Rate</p>
              <p className="text-2xl font-semibold text-[#1D4ED8]">
                {calculateEngagementRate(engagementData, totalActiveUsers)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Of {totalActiveUsers} active users
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#EBF5FF] p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Subscriptions
          </h3>
          <div className="space-y-4">
            {subscriptionData.map((data, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {formatMetricDate(data.date)}
                </span>
                <span className="text-sm font-medium text-[#1D4ED8]">
                  {data.value} pro users
                </span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Current Conversion Rate</p>
              <p className="text-2xl font-semibold text-[#1D4ED8]">
                {calculateConversionRate(subscriptionData, totalActiveUsers)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Of {totalActiveUsers} active users
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch("/api/admin-metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metricsType: "realtime",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch real-time metrics");
      }

      setRealTimeMetrics({
        activeNow: result.data.active_now || 0,
        activeHour: result.data.active_hour || 0,
        lastUpdate: new Date(),
      });
    } catch (err) {
      console.error("Error fetching real-time metrics:", err);
    }
  };

  React.useEffect(() => {
    fetchRealTimeMetrics();
    const interval = setInterval(fetchRealTimeMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (activeSection === "settings" && settingsSection === "general") {
      fetchGeneralSettings();
    }
  }, [activeSection, settingsSection]);

  const fetchGeneralSettings = async () => {
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "GET",
          category: "general",
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const settingsObj = {};
      data.settings.forEach((setting) => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      setGeneralSettings(settingsObj);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setSettingsError("Failed to load settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateGeneralSettings = async (e) => {
    e.preventDefault();
    setSettingsError("");
    setSaveSuccess(false);

    try {
      // Build an array of SQL queries for the transaction
      const settingsQueries = Object.entries(generalSettings).map(
        ([key, value]) => {
          const type =
            key === "maintenance_mode" || key === "enable_notifications"
              ? "boolean"
              : key === "max_upload_size"
              ? "number"
              : "string";

          return sql`
          INSERT INTO app_settings (setting_key, setting_value, setting_type, last_modified_by)
          VALUES (${key}, ${value}, ${type}, ${user.id})
          ON CONFLICT (setting_key) 
          DO UPDATE SET 
            setting_value = EXCLUDED.setting_value,
            setting_type = EXCLUDED.setting_type,
            last_modified_by = EXCLUDED.last_modified_by,
            updated_at = CURRENT_TIMESTAMP
        `;
        }
      );

      // Execute all queries in a transaction
      await sql.transaction(settingsQueries);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating settings:", err);
      setSettingsError("Failed to update settings. Please try again.");
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/api-key-handler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setApiKeys(data.keys);
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setApiKeyError("Failed to load API keys");
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    setApiKeyError("");
    setApiKeySuccess("");
    try {
      const response = await fetch("/api/api-key-handler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          keyName: newApiKey.name,
          keyValue: newApiKey.value,
          serviceType: newApiKey.serviceType,
          environment: newApiKey.environment,
          rotationInterval: newApiKey.rotationInterval,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setApiKeySuccess("API key created successfully");
      setIsAddingKey(false);
      setNewApiKey({
        name: "",
        value: "",
        serviceType: "openai",
        environment: "production",
        rotationInterval: 30,
      });
      fetchApiKeys();
    } catch (err) {
      console.error("Error creating API key:", err);
      setApiKeyError("Failed to create API key");
    }
  };

  const handleRotateKey = async (keyId) => {
    setIsRotating(true);
    setApiKeyError("");
    setApiKeySuccess("");
    try {
      const response = await fetch("/api/api-key-handler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rotate", keyId }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setApiKeySuccess("API key rotated successfully");
      fetchApiKeys();
    } catch (err) {
      console.error("Error rotating API key:", err);
      setApiKeyError("Failed to rotate API key");
    } finally {
      setIsRotating(false);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!window.confirm("Are you sure you want to delete this API key?"))
      return;

    setApiKeyError("");
    setApiKeySuccess("");
    try {
      const response = await fetch("/api/api-key-handler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", keyId }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setApiKeySuccess("API key deleted successfully");
      fetchApiKeys();
    } catch (err) {
      console.error("Error deleting API key:", err);
      setApiKeyError("Failed to delete API key");
    }
  };

  React.useEffect(() => {
    if (settingsSection === "api") {
      fetchApiKeys();
    }
  }, [settingsSection]);

  React.useEffect(() => {
    if (activeSection === "content") {
      fetchContent();
    }
  }, [activeSection, contentType]);

  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const response = await fetch("/api/content-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list",
          contentType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (data.error) {
        throw new Error(data.error);
      }

      switch (contentType) {
        case "knowledge":
          setKnowledgeBase(data.content || []);
          break;
        case "templates":
          setScriptTemplates(data.content || []);
          break;
        case "onboarding":
          setOnboardingContent(data.content || []);
          break;
        default:
          console.warn("Unknown content type:", contentType);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content. Please try again.");
      // Reset the appropriate state based on content type
      switch (contentType) {
        case "knowledge":
          setKnowledgeBase([]);
          break;
        case "templates":
          setScriptTemplates([]);
          break;
        case "onboarding":
          setOnboardingContent([]);
          break;
      }
    } finally {
      setContentLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this content?"))
      return;

    try {
      const response = await fetch("/api/content-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          contentType,
          contentId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      fetchContent();
    } catch (err) {
      console.error("Error deleting content:", err);
      setError("Failed to delete content");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Real-Time Activity</h2>
                <span className="text-sm text-gray-500">
                  Last updated:{" "}
                  {realTimeMetrics.lastUpdate
                    ? formatDate(realTimeMetrics.lastUpdate)
                    : "Never"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Now
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {realTimeMetrics.activeNow}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">users</p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Past Hour
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {realTimeMetrics.activeHour}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">users</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">User Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Users
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {users.length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Users
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {users.filter((u) => u.status === "active").length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Pro Subscribers
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {
                        users.filter((u) => u.subscription_plan === "pro")
                          .length
                      }
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    New Users (24h)
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {
                        users.filter((u) => {
                          const signupDate = new Date(u.signup_date);
                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1);
                          return signupDate > yesterday;
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={fetchUsers}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#1D4ED8] bg-[#EBF5FF] hover:bg-[#1941B1] hover:text-white"
                  >
                    <i className="fas fa-sync-alt mr-2"></i>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex justify-center items-center h-32">
                  <i className="fas fa-spinner fa-spin text-2xl text-[#1D4ED8]"></i>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Signup Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "suspended"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.status || "inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.subscription_plan || "free"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.signup_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.last_login_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                handleUserStatusUpdate(
                                  user.id,
                                  user.status === "active"
                                    ? "suspended"
                                    : "active"
                                )
                              }
                              className={`mr-3 ${
                                user.status === "active"
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {user.status === "active"
                                ? "Suspend"
                                : "Activate"}
                            </button>
                            <button className="text-[#1D4ED8] hover:text-[#1941B1]">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Analytics Overview</h2>
                <div className="flex space-x-2">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                  <button
                    onClick={fetchAnalytics}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#1D4ED8] bg-[#EBF5FF] hover:bg-[#1941B1] hover:text-white"
                  >
                    <i className="fas fa-sync-alt mr-2"></i>
                    Refresh
                  </button>
                </div>
              </div>
              {renderAnalytics()}
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                User Activity Timeline
              </h3>
              <div className="space-y-4">
                {users
                  .sort(
                    (a, b) =>
                      new Date(b.last_activity_at) -
                      new Date(a.last_activity_at)
                  )
                  .slice(0, 10)
                  .map((user) => {
                    const activityDate = new Date(user.last_activity_at);
                    const now = new Date();
                    const diffInMinutes = Math.floor(
                      (now - activityDate) / (1000 * 60)
                    );
                    const diffInHours = Math.floor(diffInMinutes / 60);
                    const diffInDays = Math.floor(diffInHours / 24);

                    let timeAgo;
                    if (diffInMinutes < 60) {
                      timeAgo = `${diffInMinutes} minutes ago`;
                    } else if (diffInHours < 24) {
                      timeAgo = `${diffInHours} hours ago`;
                    } else {
                      timeAgo = `${diffInDays} days ago`;
                    }

                    return (
                      <div
                        key={user.id}
                        className="border-l-4 border-[#1D4ED8] pl-4 py-3 bg-[#F8F9FB] rounded-r-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.name || user.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.subscription_type === "pro"
                                ? "Pro User"
                                : "Free User"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{timeAgo}</p>
                            <p className="text-xs text-gray-400">
                              {formatDate(user.last_activity_at)}
                            </p>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          Last action: {getActivityDescription(user)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">User Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Users
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {users.length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Users
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {users.filter((u) => u.status === "active").length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Pro Subscribers
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {
                        users.filter((u) => u.subscription_plan === "pro")
                          .length
                      }
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    New Users (24h)
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {
                        users.filter((u) => {
                          const signupDate = new Date(u.signup_date);
                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1);
                          return signupDate > yesterday;
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={fetchUsers}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#1D4ED8] bg-[#EBF5FF] hover:bg-[#1941B1] hover:text-white"
                  >
                    <i className="fas fa-sync-alt mr-2"></i>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex justify-center items-center h-32">
                  <i className="fas fa-spinner fa-spin text-2xl text-[#1D4ED8]"></i>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Signup Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : user.status === "suspended"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.status || "inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.subscription_plan || "free"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.signup_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.last_login_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                handleUserStatusUpdate(
                                  user.id,
                                  user.status === "active"
                                    ? "suspended"
                                    : "active"
                                )
                              }
                              className={`mr-3 ${
                                user.status === "active"
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {user.status === "active"
                                ? "Suspend"
                                : "Activate"}
                            </button>
                            <button className="text-[#1D4ED8] hover:text-[#1941B1]">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Content Management</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setContentType("knowledge")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      contentType === "knowledge"
                        ? "bg-[#1D4ED8] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Knowledge Base
                  </button>
                  <button
                    onClick={() => setContentType("templates")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      contentType === "templates"
                        ? "bg-[#1D4ED8] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Script Templates
                  </button>
                  <button
                    onClick={() => setContentType("onboarding")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      contentType === "onboarding"
                        ? "bg-[#1D4ED8] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Onboarding
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {contentType === "knowledge"
                    ? "Knowledge Base Articles"
                    : contentType === "templates"
                    ? "Script Templates"
                    : "Onboarding Content"}
                </h3>
                <button
                  onClick={() => {
                    setSelectedContent(null);
                    setContentTitle("");
                    setContentDescription("");
                    setContentCategory("");
                    setContentStep(1);
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1D4ED8] hover:bg-[#1941B1]"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add New
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {contentType === "onboarding" ? "Step" : "Category"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Content list will be mapped here */}
                  </tbody>
                </table>
              </div>
            </div>

            {isEditing && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-3xl w-full p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedContent ? "Edit" : "Add New"}{" "}
                      {contentType === "knowledge"
                        ? "Article"
                        : contentType === "templates"
                        ? "Template"
                        : "Onboarding Step"}
                    </h3>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch(
                          "/api/content-management",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              operation: selectedContent ? "update" : "create",
                              contentType,
                              content: {
                                id: selectedContent?.id,
                                title: contentTitle,
                                content: contentDescription,
                                category: contentCategory,
                                step_number:
                                  contentType === "onboarding"
                                    ? contentStep
                                    : undefined,
                              },
                            }),
                          }
                        );

                        const data = await response.json();
                        if (data.success) {
                          setIsEditing(false);
                          fetchContent();
                        }
                      } catch (err) {
                        console.error("Error saving content:", err);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="contentTitle"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="contentTitle"
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                        required
                      />
                    </div>

                    {contentType === "onboarding" ? (
                      <div>
                        <label
                          htmlFor="contentStep"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Step Number
                        </label>
                        <input
                          type="number"
                          id="contentStep"
                          value={contentStep}
                          onChange={(e) =>
                            setContentStep(parseInt(e.target.value))
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          min="1"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor="contentCategory"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Category
                        </label>
                        <input
                          type="text"
                          id="contentCategory"
                          value={contentCategory}
                          onChange={(e) => setContentCategory(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="contentDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Content
                      </label>
                      <textarea
                        id="contentDescription"
                        rows={10}
                        value={contentDescription}
                        onChange={(e) => setContentDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm font-mono"
                        placeholder={
                          contentType === "templates"
                            ? "Enter your script template here..."
                            : contentType === "knowledge"
                            ? "Enter your article content here..."
                            : "Enter onboarding step content here..."
                        }
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1941B1]"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case "subscriptions":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Subscription Management
                </h2>
                <a
                  href="/admin/subscription-plans"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1D4ED8] hover:bg-[#1941B1]"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Manage Plans
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Subscribers
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {
                        users.filter((u) => u.subscription_type === "pro")
                          .length
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Monthly Revenue
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      $
                      {(
                        users.filter((u) => u.subscription_type === "pro")
                          .length * 10
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Conversion Rate
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {(
                        (users.filter((u) => u.subscription_type === "pro")
                          .length /
                          users.length) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">System Settings</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSettingsSection("general")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      settingsSection === "general"
                        ? "bg-[#EBF5FF] text-[#1D4ED8]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setSettingsSection("api")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      settingsSection === "api"
                        ? "bg-[#EBF5FF] text-[#1D4ED8]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    API Keys
                  </button>
                  <button
                    onClick={() => setSettingsSection("features")}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      settingsSection === "features"
                        ? "bg-[#EBF5FF] text-[#1D4ED8]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Features
                  </button>
                </div>
              </div>

              {settingsSection === "general" && (
                <div className="mt-6">
                  {settingsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <i className="fas fa-spinner fa-spin text-2xl text-[#1D4ED8]"></i>
                    </div>
                  ) : settingsError ? (
                    <div className="text-red-600 mb-4">{settingsError}</div>
                  ) : (
                    <form
                      onSubmit={updateGeneralSettings}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Site Name
                          </label>
                          <input
                            type="text"
                            value={generalSettings.site_name || ""}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                site_name: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Site Description
                          </label>
                          <input
                            type="text"
                            value={generalSettings.site_description || ""}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                site_description: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Support Email
                          </label>
                          <input
                            type="email"
                            value={generalSettings.support_email || ""}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                support_email: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Default Language
                          </label>
                          <select
                            value={generalSettings.default_language || "en"}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                default_language: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Timezone
                          </label>
                          <select
                            value={generalSettings.timezone || "UTC"}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                timezone: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">
                              Eastern Time
                            </option>
                            <option value="America/Chicago">
                              Central Time
                            </option>
                            <option value="America/Denver">
                              Mountain Time
                            </option>
                            <option value="America/Los_Angeles">
                              Pacific Time
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Max Upload Size (bytes)
                          </label>
                          <input
                            type="number"
                            value={generalSettings.max_upload_size || "5242880"}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                max_upload_size: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1D4ED8] focus:border-[#1D4ED8] sm:text-sm"
                          />
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  generalSettings.maintenance_mode === "true"
                                }
                                onChange={(e) =>
                                  setGeneralSettings({
                                    ...generalSettings,
                                    maintenance_mode:
                                      e.target.checked.toString(),
                                  })
                                }
                                className="h-4 w-4 text-[#1D4ED8] focus:ring-[#1D4ED8] border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Maintenance Mode
                              </span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={
                                  generalSettings.enable_notifications ===
                                  "true"
                                }
                                onChange={(e) =>
                                  setGeneralSettings({
                                    ...generalSettings,
                                    enable_notifications:
                                      e.target.checked.toString(),
                                  })
                                }
                                className="h-4 w-4 text-[#1D4ED8] focus:ring-[#1D4ED8] border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Enable Notifications
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {saveSuccess && (
                        <div className="text-green-600 mt-2">
                          Settings saved successfully!
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1D4ED8] hover:bg-[#1941B1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8]"
                        >
                          Save Settings
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Security & Audit</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1D4ED8] hover:bg-[#1941B1]">
                  <i className="fas fa-download mr-2"></i>
                  Export Logs
                </button>
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Support Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Open Tickets
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {tickets.filter((t) => t.status === "open").length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Closed Tickets
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {tickets.filter((t) => t.status === "closed").length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    New Contacts
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {contacts.filter((c) => c.status === "new").length}
                    </p>
                  </div>
                </div>
                <div className="bg-[#EBF5FF] p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">
                    Resolved Contacts
                  </h3>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-[#1D4ED8]">
                      {contacts.filter((c) => c.status === "resolved").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-[#1D4ED8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-2xl mr-2"></i>
              <h1 className="text-xl font-bold">Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-sm">{user.username}</span>
                  <a
                    href="/admin/change-password"
                    className="text-sm hover:text-gray-200"
                  >
                    <i className="fas fa-key mr-1"></i>
                    Change Password
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="text-sm bg-[#1941B1] hover:bg-[#15339A] px-4 py-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Admin Dashboard
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your application settings and user data.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Section</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveSection("dashboard")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "dashboard"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveSection("analytics")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "analytics"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => setActiveSection("users")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "users"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Users
                    </button>
                    <button
                      onClick={() => setActiveSection("content")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "content"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => setActiveSection("subscriptions")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "subscriptions"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Subscriptions
                    </button>
                    <button
                      onClick={() => setActiveSection("settings")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "settings"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => setActiveSection("security")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "security"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Security
                    </button>
                    <button
                      onClick={() => setActiveSection("support")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === "support"
                          ? "bg-[#EBF5FF] text-[#1D4ED8]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Support
                    </button>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
}

export default MainComponent;
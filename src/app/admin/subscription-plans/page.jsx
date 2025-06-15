"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [plans, setPlans] = React.useState([]);
  const [editingPlan, setEditingPlan] = React.useState(null);

  React.useEffect(() => {
    const verifyAdminAndFetchPlans = async () => {
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

        const plansResponse = await fetch("/api/subscription-management", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!plansResponse.ok) {
          throw new Error("Failed to fetch subscription plans");
        }

        const data = await plansResponse.json();
        setPlans(data.plans || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAndFetchPlans();
  }, []);

  const handlePlanAction = async (action, plan) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch("/api/subscription-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, plan }),
      });

      if (!response.ok) {
        throw new Error("Action failed");
      }

      const updatedPlans = await response.json();
      setPlans(updatedPlans.plans || []);
      setEditingPlan(null);
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
            Subscription Plans
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Plan Name</th>
                  <th className="text-left py-4 px-4">Price</th>
                  <th className="text-left py-4 px-4">Billing Period</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-right py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-b">
                    <td className="py-4 px-4">{plan.name}</td>
                    <td className="py-4 px-4">
                      ${plan.price}/{plan.billingPeriod}
                    </td>
                    <td className="py-4 px-4">{plan.billingPeriod}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          plan.active
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {plan.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="text-[#1D4ED8] hover:text-[#1941A5] mr-4"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() =>
                          handlePlanAction(
                            plan.active ? "deactivate" : "activate",
                            plan
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <i
                          className={`fas fa-${
                            plan.active ? "toggle-off" : "toggle-on"
                          }`}
                        ></i>
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
                setEditingPlan({
                  name: "",
                  price: "",
                  billingPeriod: "month",
                  features: [],
                  active: true,
                })
              }
              className="bg-[#1D4ED8] text-white px-6 py-2 rounded-lg hover:bg-[#1941A5]"
            >
              <i className="fas fa-plus mr-2"></i>Add New Plan
            </button>
          </div>
        </div>
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingPlan.id ? "Edit Plan" : "Add New Plan"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Period
                </label>
                <select
                  value={editingPlan.billingPeriod}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      billingPeriod: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  value={editingPlan.features.join("\n")}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      features: e.target.value.split("\n"),
                    })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingPlan.active}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, active: e.target.checked })
                  }
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handlePlanAction(
                    editingPlan.id ? "update" : "create",
                    editingPlan
                  )
                }
                className="bg-[#1D4ED8] text-white px-6 py-2 rounded-lg hover:bg-[#1941A5]"
              >
                {editingPlan.id ? "Save Changes" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
"use client";
import React from "react";

function MainComponent() {
  const [orderDetails, setOrderDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("orderId");

        if (!orderId) {
          setError("No order ID found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/subscription-handler?orderId=${orderId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-[#1D4ED8] text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-500 text-3xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Thank You for Subscribing!
            </h1>
            <p className="text-gray-600 text-lg">
              Your subscription has been successfully activated
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <>
              <div className="border-t border-b border-gray-100 py-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">{orderDetails?.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">
                      {orderDetails?.planName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                      ${orderDetails?.amount}/month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <i className="fas fa-laptop-code text-[#1D4ED8] text-2xl mb-3"></i>
                    <h3 className="font-semibold mb-2">
                      Access Your Dashboard
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start exploring all features and tools available in your
                      subscription
                    </p>
                    <a
                      href="/dashboard"
                      className="text-[#1D4ED8] hover:text-[#1941A5] font-medium"
                    >
                      Go to Dashboard{" "}
                      <i className="fas fa-arrow-right ml-1"></i>
                    </a>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <i className="fas fa-book text-[#1D4ED8] text-2xl mb-3"></i>
                    <h3 className="font-semibold mb-2">Read Documentation</h3>
                    <p className="text-gray-600 mb-4">
                      Learn how to make the most of your subscription with our
                      guides
                    </p>
                    <a
                      href="/knowledge-base"
                      className="text-[#1D4ED8] hover:text-[#1941A5] font-medium"
                    >
                      View Guides <i className="fas fa-arrow-right ml-1"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Need help getting started? Our support team is here to help!
                </p>
                <a
                  href="/contact"
                  className="bg-[#1D4ED8] text-white px-8 py-3 rounded-lg hover:bg-[#1941A5] inline-flex items-center"
                >
                  <i className="fas fa-headset mr-2"></i>
                  Contact Support
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
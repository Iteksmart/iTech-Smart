"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [processingPayment, setProcessingPayment] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubscription = async (priceId, planName) => {
    try {
      setProcessingPayment(true);
      setError(null);

      const response = await fetch("/api/subscription-handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
          successUrl: `${window.location.origin}/thank-you`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (err) {
      setError("Failed to process subscription. Please try again.");
      console.error("Subscription error:", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const plans = [
    {
      name: "Free",
      description: "For individual IT professionals",
      price: "0",
      priceId: "price_free", // Stripe price ID for free tier
      features: [
        "Basic AI troubleshooting",
        "Limited command suggestions",
        "5 AI chat queries per day",
      ],
      limitations: ["No ticket note generator", "No team features"],
      buttonText: "Get Started",
      recommended: false,
    },
    {
      name: "Pro",
      description: "For IT professionals and small teams",
      price: "15",
      priceId: "price_pro", // Replace with actual Stripe price ID
      features: [
        "Full AI troubleshooting",
        "Unlimited command suggestions",
        "Unlimited AI chat queries",
        "Ticket note generator",
        "Basic team sharing",
      ],
      limitations: [],
      buttonText: "Subscribe Now",
      recommended: true,
    },
    {
      name: "Team",
      description: "For IT departments and MSPs",
      price: "49",
      priceId: "price_team", // Replace with actual Stripe price ID
      features: [
        "Everything in Pro",
        "5 team members included",
        "Team knowledge sharing",
        "Custom playbook creation",
        "Priority support",
      ],
      limitations: [],
      buttonText: "Contact Sales",
      recommended: false,
    },
  ];

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pricing</h1>
        <p className="text-gray-600">Choose the perfect plan for your needs</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All plans include our core AI IT Assistant features. Choose the plan
            that best fits your team's needs and scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-sm p-8 relative ${
                plan.recommended
                  ? "border-2 border-blue-100 transform scale-105"
                  : ""
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold animate-bounce-slow">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-lg mb-1">{plan.description}</p>
                <p className="text-gray-600 mb-4 text-2xl font-bold">
                  ${plan.price}/month
                </p>
              </div>

              <ul className="text-gray-600 space-y-2 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-center">
                    <i className="fas fa-times text-red-500 mr-2"></i>
                    {limitation}
                  </li>
                ))}
              </ul>

              <a href="/sign-in" target="_self">
                <button
                  onClick={() =>
                    plan.name === "Team"
                      ? (window.location.href = "/contact")
                      : handleSubscription(plan.priceId, plan.name)
                  }
                  disabled={processingPayment}
                  className={`w-full text-center font-semibold px-6 py-3 rounded-lg ${
                    processingPayment ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    plan.name === "Team"
                      ? "pricing-button-enterprise text-[#1D4ED8] hover:bg-blue-50"
                      : "pricing-button text-white"
                  }`}
                >
                  {processingPayment ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </span>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">
                Can I switch plans at any time?
              </h4>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and offer invoice
                payment options for enterprise customers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial on our Pro plan. No credit
                card required to start.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                What happens after my trial ends?
              </h4>
              <p className="text-gray-600">
                After your trial ends, you can choose to subscribe to a paid
                plan or continue with our free plan with limited features.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Plan?</h3>
          <p className="text-gray-600 mb-8">
            Contact our sales team for enterprise pricing and custom solutions.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-[#1D4ED8] hover:text-[#1941A5]"
          >
            <span>Contact Sales</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes buttonShine {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        @keyframes buttonPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .pricing-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(
            90deg,
            #1D4ED8,
            #2563eb,
            #3b82f6,
            #2563eb,
            #1D4ED8
          );
          background-size: 200% auto;
          animation: buttonShine 8s linear infinite;
        }

        .pricing-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
          animation: buttonPop 0.3s ease-in-out;
        }

        .pricing-button:active {
          transform: translateY(1px);
        }

        .pricing-button-enterprise {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 2px solid #1D4ED8;
        }

        .pricing-button-enterprise:hover {
          background-color: rgba(29, 78, 216, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(29, 78, 216, 0.1);
        }

        .pricing-button-enterprise:active {
          transform: translateY(1px);
        }

        .pricing-button-enterprise::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(29, 78, 216, 0.2),
            transparent
          );
          transition: all 0.6s ease;
        }

        .pricing-button-enterprise:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;
"use client";
import React from "react";
import { someHelper } from '../utilities/runtime-helpers';


function MainComponent() {
  const { data: user, loading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [processingPayment, setProcessingPayment] = React.useState(false);
  const [error, setError] = React.useState(null);
  const pricingPlans = [
    {
      name: "Free",
      price: "$0/month",
      features: [
        "Basic AI troubleshooting",
        "Limited command suggestions",
        "5 AI chat queries per day",
        "No ticket note generator",
        "No team features",
      ],
    },
    {
      name: "Pro",
      price: "$15/month",
      features: [
        "Full AI troubleshooting",
        "Unlimited command suggestions",
        "Unlimited AI chat queries",
        "Ticket note generator",
        "Basic team sharing",
      ],
    },
    {
      name: "Team",
      price: "$49/month",
      features: [
        "Everything in Pro",
        "5 team members included",
        "Team knowledge sharing",
        "Custom playbook creation",
        "Priority support",
      ],
    },
  ];

  React.useEffect(() => {
    const preloadLinks = [
      {
        rel: "preload",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        as: "style",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ];

    preloadLinks.forEach((link) => {
      const linkEl = document.createElement("link");
      Object.entries(link).forEach(([key, value]) =>
        linkEl.setAttribute(key, value)
      );
      document.head.appendChild(linkEl);
    });
  }, []);

  const handleSubscription = async (priceId = "price_pro") => {
    if (!user) {
      // Redirect to sign in with callback URL to return to pricing
      window.location.href = "/sign-in?callbackUrl=/pricing";
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);

      const response = await fetch("/api/stripe-subscription-handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError("Failed to process subscription. Please try again.");
      console.error("Subscription error:", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const HeroSection = () => (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
            Resolve IT Issues
            <br />
            <span className="text-[#1D4ED8] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smarter, Faster
            </span>
            <br />
            With iTechSmart
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 mb-8 text-lg md:text-xl leading-relaxed max-w-xl">
            Your intelligent assistant for troubleshooting, scripting, and task
            automation—built for IT pros, helpdesk teams, and sysadmins.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button
              onClick={handleSubscription}
              disabled={processingPayment}
              className="cta-button primary-button animate-pulse-subtle"
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </span>
              ) : (
                "Subscribe Now"
              )}
            </button>
            <a
              href="/contact"
              className="cta-button secondary-button animate-bounce-subtle bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 rounded-lg"
            >
              Book a Demo
            </a>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          <p className="text-gray-500 mt-6 flex items-center justify-center md:justify-start">
            <i className="fas fa-check-circle text-green-500 mr-2"></i>
            No credit card required
          </p>
        </div>

        <div className="md:w-1/2 w-full">
          <div className="bg-[#1E293B] p-6 rounded-xl text-green-400 font-mono text-xs md:text-sm overflow-x-auto shadow-2xl transform transition-all duration-500 hover:scale-105">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2 animate-typing">
              <p>$ Issue: "Can't connect to the internet"</p>
              <p>Analyzing issue using OSI model approach...</p>
              <p>Layer 1 (Physical): Checking hardware connections</p>
              <p>$ Run: Get-NetAdapter | Where-Object Status -eq "Up"</p>
              <p>Network adapter detected: Intel(R) Wi-Fi 6 AX201 160MHz</p>
              <p>Layer 2 (Data Link): Verifying MAC addressing</p>
              <p>$ Run: ipconfig /all</p>
              <p>MAC Address: 00-11-22-33-44-55</p>
              <p>Layer 3 (Network): Checking IP configuration</p>
              <p>Run: Test-NetConnection -ComputerName 8.8.8.8</p>
              <p>TCP test failed. Suggesting DNS flush...</p>
              <p>Run: ipconfig /flushdns</p>
              <p>DNS cache flushed successfully. Connection restored!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PricingSection = () => (
    <div id="pricing" className="container mx-auto px-4 py-8 md:py-16">
      <h2 className="text-2xl md:text-4xl font-bold text-center text-[#1E293B] mb-4">
        Pricing Plans
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
        Choose a plan that fits your needs and start resolving IT issues
        smarter, faster.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 relative ${
              plan.name === "Pro" ? "border-2 border-blue-500" : ""
            }`}
          >
            {plan.name === "Pro" && (
              <div className="popular-badge">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce-slow">
                  Most Popular
                </div>
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-lg mb-1">For IT professionals and small teams</p>
            <p className="text-gray-600 mb-4 text-2xl font-bold">
              {plan.price}
            </p>
            <ul className="text-gray-600 space-y-2 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              target="_self"
              href="/sign-in"
              className={`block pricing-button text-white px-6 py-3 rounded-lg text-center font-semibold ${
                plan.name === "Pro" ? "animate-pulse-subtle" : ""
              }`}
            >
              Subscribe Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <style jsx global>{`
        @keyframes typing {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-typing > * {
          animation: typing 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-typing > *:nth-child(1) { animation-delay: 0.1s; }
        .animate-typing > *:nth-child(2) { animation-delay: 0.2s; }
        .animate-typing > *:nth-child(3) { animation-delay: 0.3s; }
        .animate-typing > *:nth-child(4) { animation-delay: 0.4s; }
        .animate-typing > *:nth-child(5) { animation-delay: 0.5s; }
        .animate-typing > *:nth-child(6) { animation-delay: 0.6s; }
        .animate-typing > *:nth-child(7) { animation-delay: 0.7s; }
        .animate-typing > *:nth-child(8) { animation-delay: 0.8s; }
        .animate-typing > *:nth-child(9) { animation-delay: 0.9s; }
        .animate-typing > *:nth-child(10) { animation-delay: 1s; }
        .animate-typing > *:nth-child(11) { animation-delay: 1.1s; }
        .animate-typing > *:nth-child(12) { animation-delay: 1.2s; }
        .animate-typing > *:nth-child(13) { animation-delay: 1.3s; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .hover-scale {
          transition: transform 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        @keyframes cardHover {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1);
        }

        #features .card-hover:nth-child(1) { animation-delay: 0.1s; }
        #features .card-hover:nth-child(2) { animation-delay: 0.2s; }
        #features .card-hover:nth-child(3) { animation-delay: 0.3s; }
        #features .card-hover:nth-child(4) { animation-delay: 0.4s; }
        #features .card-hover:nth-child(5) { animation-delay: 0.5s; }
        #features .card-hover:nth-child(6) { animation-delay: 0.6s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .pricing-card {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .pricing-card:nth-child(1) { animation-delay: 0.2s; }
        .pricing-card:nth-child(2) { animation-delay: 0.4s; }
        .pricing-card:nth-child(3) { animation-delay: 0.6s; }

        @keyframes buttonPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .cta-button {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .cta-button:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 30px rgba(29, 78, 216, 0.25);
        }

        .cta-button:active {
          transform: translateY(1px);
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: all 0.5s ease;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .primary-button {
          @apply bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300;
        }

        .secondary-button {
          @apply font-bold px-8 py-4 rounded-lg text-lg transform transition-all duration-300;
        }

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

        @keyframes pulse-subtle {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-4px) translateX(-50%); }
          50% { transform: translateY(0) translateX(-50%); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        nav a {
          transition: all 0.3s ease;
          position: relative;
        }

        nav a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: #1D4ED8;
          transition: width 0.3s ease;
        }

        nav a:hover::after {
          width: 100%;
        }
      `}</style>

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
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a target="_self" href="/sign-in" className="text-[#1D4ED8]">
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-600"
        >
          <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </nav>

      <HeroSection />

      <div className="text-center py-16 gradient-bg-section">
        <p className="text-gray-600 mb-12 text-sm md:text-base tracking-wider">
          TRUSTED BY IT PROFESSIONALS FROM
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-4">
          {["ACME TECH", "CLOUDIFY", "DATACORE", "NETPULSE", "SYSMATRIX"].map(
            (company, index) => (
              <span
                key={index}
                className="text-gray-400 text-xl md:text-2xl font-light company-logo"
              >
                {company}
              </span>
            )
          )}
        </div>
      </div>

      <div id="features" className="container mx-auto px-4 py-8 md:py-16">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-[#1E293B] mb-4">
          Key Features
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base">
          Everything you need to streamline IT support, reduce resolution time,
          and eliminate repetitive tasks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: "network-wired",
              title: "AI Troubleshooting via OSI Model",
              description: "Systematically diagnose issues layer-by-layer...",
              image:
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400",
            },
            {
              icon: "terminal",
              title: "Script Suggestion",
              description: "Get instant PowerShell, Bash, and CMD commands...",
              image:
                "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=400",
            },
            {
              icon: "file-alt",
              title: "Ticket Note Generator",
              description:
                "Automatically document your troubleshooting steps...",
              image:
                "https://images.unsplash.com/photo-1506097425191-7ad538b29cef?auto=format&fit=crop&w=400",
            },
            {
              icon: "tasks",
              title: "Task Manager",
              description: "Keep track of resolution steps...",
              image:
                "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=400",
            },
            {
              icon: "book",
              title: "Knowledge Base",
              description: "Access a growing library of common IT issues...",
              image:
                "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=400",
            },
            {
              icon: "robot",
              title: "AI Chat Assistant",
              description: "Chat with an AI that understands IT terminology...",
              image:
                "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=400",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm card-hover"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 micro-interaction">
                <i
                  className={`fas fa-${feature.icon} text-[#1D4ED8] text-xl`}
                ></i>
              </div>
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-bg-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1E293B] mb-4">
            Structured Troubleshooting
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Our AI uses the OSI model to systematically diagnose and resolve
            issues at every layer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-center">
            <div className="bg-[#ffe6ff] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#800080] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">7</span>
              </div>
              <div className="font-semibold text-[#800080]">Application</div>
              <div className="text-sm text-gray-600">
                Software issues, UI problems
              </div>
            </div>
            <div className="bg-[#e6e6ff] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#4B0082] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">6</span>
              </div>
              <div className="font-semibold text-[#4B0082]">Presentation</div>
              <div className="text-sm text-gray-600">
                Data format, encryption
              </div>
            </div>
            <div className="bg-[#e6f2ff] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#0000FF] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">5</span>
              </div>
              <div className="font-semibold text-[#0000FF]">Session</div>
              <div className="text-sm text-gray-600">Connection management</div>
            </div>
            <div className="bg-[#e6ffe6] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#008000] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="font-semibold text-[#008000]">Transport</div>
              <div className="text-sm text-gray-600">TCP/UDP issues, ports</div>
            </div>
            <div className="bg-[#fff9e6] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#D4A017] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="font-semibold text-[#D4A017]">Network</div>
              <div className="text-sm text-gray-600">
                IP addressing, routing
              </div>
            </div>
            <div className="bg-[#fff0e6] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="font-semibold text-[#FF4500]">Data Link</div>
              <div className="text-sm text-gray-600">
                MAC addressing, switches
              </div>
            </div>
            <div className="bg-[#ffe6e6] p-4 rounded-lg">
              <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="font-semibold text-[#FF0000]">Physical</div>
              <div className="text-sm text-gray-600">
                Cables, hardware, signals
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="how-it-works" className="gradient-bg-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1E293B] mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Resolve IT issues in minutes with our intuitive workflow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#1D4ED8] text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Describe Your Issue
              </h3>
              <p className="text-gray-600">
                Type your problem in plain language, like "Can't connect to the
                internet" or "Printer not working"
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#1D4ED8] text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Get Guided Diagnosis
              </h3>
              <p className="text-gray-600">
                AI analyzes your issue and walks you through troubleshooting
                steps using the OSI model approach
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#1D4ED8] text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Run Suggested Commands
              </h3>
              <p className="text-gray-600">
                Execute recommended scripts and commands with explanations of
                what each one does
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#1D4ED8] text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Export & Resolve</h3>
              <p className="text-gray-600">
                Generate ticket notes automatically and save resolution steps
                for future reference
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1E293B] mb-4">
            Real-World Use Cases
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Discover how iTechSmart solves common IT challenges
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-network-wired",
                title: "Network Troubleshooting",
                description:
                  "Automatically diagnose and resolve network connectivity issues using our OSI model-based approach.",
                benefits: [
                  "Systematic problem identification",
                  "Guided resolution steps",
                  "Automated network diagnostics",
                ],
              },
              {
                icon: "fas fa-shield-alt",
                title: "Security Incident Response",
                description:
                  "Quickly identify and respond to security threats with AI-powered analysis and recommended actions.",
                benefits: [
                  "Rapid threat detection",
                  "Automated containment steps",
                  "Incident documentation",
                ],
              },
              {
                icon: "fas fa-cloud",
                title: "Cloud Infrastructure Management",
                description:
                  "Streamline cloud resource management and troubleshooting across multiple platforms.",
                benefits: [
                  "Resource optimization",
                  "Cost monitoring",
                  "Performance analysis",
                ],
              },
              {
                icon: "fas fa-laptop",
                title: "End-User Support",
                description:
                  "Provide faster, more accurate support for common desktop and application issues.",
                benefits: [
                  "Quick issue resolution",
                  "Self-service options",
                  "Knowledge base integration",
                ],
              },
              {
                icon: "fas fa-server",
                title: "Server Management",
                description:
                  "Automate server maintenance tasks and quickly resolve performance issues.",
                benefits: [
                  "Proactive monitoring",
                  "Automated maintenance",
                  "Performance optimization",
                ],
              },
              {
                icon: "fas fa-code-branch",
                title: "DevOps Integration",
                description:
                  "Seamlessly integrate IT support with your DevOps workflow for faster deployment and troubleshooting.",
                benefits: [
                  "CI/CD pipeline support",
                  "Automated testing",
                  "Deployment verification",
                ],
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${useCase.icon} text-[#1D4ED8] text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/use-cases" className="cta-button primary-button">
              Explore More Use Cases
            </a>
          </div>
        </div>
      </div>

      <PricingSection />

      <div id="testimonials" className="gradient-bg-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1E293B] mb-4">
            What IT Pros Are Saying
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Hear from IT professionals who are using AI IT Assistant to
            transform their support workflow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8F9FB] p-6 rounded-lg">
              <div className="mb-4">
                <h4 className="font-semibold text-lg">James Davis</h4>
                <p className="text-[#1D4ED8]">IT Manager, TechCorp</p>
              </div>
              <p className="text-gray-600">
                "This tool has cut our average ticket resolution time by 40%.
                The OSI model approach helps our junior techs learn while they
                solve problems."
              </p>
            </div>

            <div className="bg-[#F8F9FB] p-6 rounded-lg">
              <div className="mb-4">
                <h4 className="font-semibold text-lg">Sarah Miller</h4>
                <p className="text-[#1D4ED8]">Helpdesk Lead, Edutech</p>
              </div>
              <p className="text-gray-600">
                "The ticket note generator alone is worth the subscription. No
                more spending 15 minutes documenting what I did after each
                ticket is resolved."
              </p>
            </div>

            <div className="bg-[#F8F9FB] p-6 rounded-lg">
              <div className="mb-4">
                <h4 className="font-semibold text-lg">Robert Johnson</h4>
                <p className="text-[#1D4ED8]">MSP Owner, NetSolutions</p>
              </div>
              <p className="text-gray-600">
                "We've deployed this to our entire team. The consistent approach
                to troubleshooting has improved our first-call resolution rate
                by 35%."
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#1E293B] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <a
                href="/"
                className="flex items-center mb-6 hover:opacity-80 transition-opacity"
              >
                <i className="fas fa-cog text-2xl mr-2"></i>
                <span className="font-bold text-xl">iTechSmart</span>
              </a>
              <p className="text-gray-400 leading-relaxed">
                Smarter troubleshooting. Faster fixes. Less stress for IT teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/use-cases" className="hover:text-white">
                    Use Cases
                  </a>
                </li>
                <li>
                  <a href="/knowledge-base" className="hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/knowledge-base" className="hover:text-white">
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a href="/api-docs" className="hover:text-white">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/legal" className="hover:text-white">
                    Legal
                  </a>
                </li>
                <li>
                  <a href="/admin/login" className="hover:text-white">
                    Admin Login
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 iTechSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;
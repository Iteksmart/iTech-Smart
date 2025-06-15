"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const caseStudies = [
    {
      company: "TechCorp Solutions",
      size: "Enterprise (1000+ employees)",
      industry: "Technology",
      challenge:
        "Managing 500+ daily IT support tickets with long resolution times",
      solution: "Implemented AI IT Assistant for automated first-level support",
      results: {
        ticketReduction: "40% reduction in ticket volume",
        timeToResolve: "60% faster resolution time",
        savings: "$200,000 annual cost savings",
      },
    },
    {
      company: "HealthCare Plus",
      size: "Mid-size (250 employees)",
      industry: "Healthcare",
      challenge:
        "Complex compliance requirements and security protocol management",
      solution: "Utilized knowledge base and automated script generation",
      results: {
        compliance: "99.9% compliance rate",
        efficiency: "75% faster security updates",
        satisfaction: "92% staff satisfaction",
      },
    },
    {
      company: "RetailMax",
      size: "Small Business (50 employees)",
      industry: "Retail",
      challenge: "Limited IT resources and budget constraints",
      solution: "Leveraged AI assistance for day-to-day IT operations",
      results: {
        cost: "60% reduction in IT costs",
        uptime: "99.5% system uptime",
        productivity: "85% increase in productivity",
      },
    },
  ];

  const features = [
    {
      name: "AI Troubleshooting",
      scenarios: [
        "Network connectivity issues in remote offices",
        "Software deployment across multiple locations",
        "Hardware diagnostics and maintenance",
      ],
      benefits: "Reduces diagnostic time by 70%",
    },
    {
      name: "Script Generation",
      scenarios: [
        "Automated system updates and patches",
        "User account management",
        "Security protocol implementation",
      ],
      benefits: "Saves 10 hours per week per IT staff member",
    },
    {
      name: "Knowledge Base",
      scenarios: [
        "Employee onboarding procedures",
        "Common issue resolution guides",
        "Security best practices documentation",
      ],
      benefits: "90% faster access to critical information",
    },
  ];

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Use Cases</h1>
        <p className="text-gray-600">
          Real-world applications and success stories
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {study.company}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-[#1D4ED8] text-xs px-2 py-1 rounded">
                      {study.size}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {study.industry}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Challenge:</h4>
                    <p className="text-gray-600">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Solution:</h4>
                    <p className="text-gray-600">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Results:</h4>
                    <ul className="space-y-2 mt-2">
                      {Object.values(study.results).map((result, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <i className="fas fa-check-circle text-green-500 mr-2"></i>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Feature Scenarios
          </h2>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Common Scenarios:</h4>
                    <ul className="space-y-2">
                      {feature.scenarios.map((scenario, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <i className="fas fa-angle-right text-[#1D4ED8] mr-2"></i>
                          {scenario}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Benefits:</h4>
                    <div className="bg-green-50 text-green-800 p-4 rounded">
                      <i className="fas fa-chart-line mr-2"></i>
                      {feature.benefits}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your IT Operations?
          </h2>
          <p className="text-gray-600 mb-8">
            Join these successful organizations and experience the power of
            AI-assisted IT management
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/pricing"
              className="bg-[#1D4ED8] text-white px-6 py-3 rounded-lg"
            >
              Subscribe
            </a>
            <a
              href="/features"
              className="border border-[#1D4ED8] text-[#1D4ED8] px-6 py-3 rounded-lg"
            >
              Explore Features
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainComponent;
"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedDepartment, setSelectedDepartment] = React.useState("all");

  const departments = [
    "all",
    "Engineering",
    "Product",
    "Customer Success",
    "Sales",
    "Marketing",
  ];

  const positions = [
    {
      id: 1,
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description:
        "Lead the development of our AI-powered IT support solutions...",
      requirements: [
        "5+ years of experience in ML/AI",
        "Strong Python and TensorFlow skills",
        "Experience with NLP and chatbots",
      ],
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Shape the future of IT automation products...",
      requirements: [
        "3+ years of product management",
        "Experience with B2B SaaS",
        "Technical background in IT",
      ],
    },
    {
      id: 3,
      title: "Technical Support Engineer",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Help customers succeed with our platform...",
      requirements: [
        "2+ years in technical support",
        "Strong troubleshooting skills",
        "Excellent communication",
      ],
    },
    {
      id: 4,
      title: "Enterprise Sales Executive",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time",
      description: "Drive enterprise adoption of our platform...",
      requirements: [
        "5+ years in enterprise sales",
        "Track record of closing deals",
        "IT industry experience",
      ],
    },
  ];

  React.useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPositions = positions.filter(
    (position) =>
      selectedDepartment === "all" || position.department === selectedDepartment
  );

  const benefits = [
    {
      icon: "fas fa-laptop-house",
      title: "Remote-First Culture",
      description: "Work from anywhere in the world",
    },
    {
      icon: "fas fa-heart",
      title: "Health & Wellness",
      description: "Comprehensive health coverage and wellness programs",
    },
    {
      icon: "fas fa-coins",
      title: "Competitive Pay",
      description: "Above-market salary and equity packages",
    },
    {
      icon: "fas fa-umbrella-beach",
      title: "Unlimited PTO",
      description: "Take time off when you need it",
    },
    {
      icon: "fas fa-graduation-cap",
      title: "Learning Budget",
      description: "$2,500 annual budget for professional development",
    },
    {
      icon: "fas fa-users",
      title: "Team Events",
      description: "Regular virtual and in-person team gatherings",
    },
  ];

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

            <button className="md:hidden text-gray-600">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Join Our Mission
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Help us revolutionize IT support through AI-powered automation and
            make a difference in how teams work
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why iTechSmart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-500 hover:scale-105 text-center"
              >
                <i
                  className={`${benefit.icon} text-[#1D4ED8] text-3xl mb-4`}
                ></i>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Open Positions
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => setSelectedDepartment(department)}
                className={`cta-button px-4 py-2 rounded-full ${
                  selectedDepartment === department
                    ? "bg-[#2563eb] text-white font-bold"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {department.charAt(0).toUpperCase() + department.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-500 hover:scale-105"
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-[#1D4ED8] bg-blue-50 px-3 py-1 rounded-full">
                        {position.department}
                      </span>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {position.location}
                      </span>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/careers/apply/${position.id}`}
                    className="cta-button primary-button"
                  >
                    Apply Now
                  </a>
                </div>
                <p className="text-gray-600 mb-4">{position.description}</p>
                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {position.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see the right role?</h2>
          <p className="text-gray-600 mb-8">
            We're always looking for talented people to join our team. Send us
            your resume!
          </p>
          <a
            href="mailto:careers@itechsmart.com"
            className="cta-button primary-button inline-block"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}

export default MainComponent;
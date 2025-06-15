"use client";
import React from "react";

function MainComponent() {
  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former IT Director with 15 years of experience in enterprise systems",
      imageUrl:
        "/integrations/dall-e-3/?prompt=professional+corporate+headshot+of+an+Asian+woman+CEO+in+her+40s+wearing+a+sleek+black+blazer+and+modern+glasses%2C+tech+executive+style%2C+standing+in+front+of+modern+office+setting%2C+confident+pose%2C+high-end+corporate+photography%2C+neutral+background",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      bio: "AI researcher and systems architect with focus on IT automation",
      imageUrl:
        "/integrations/dall-e-3/?prompt=professional+headshot+of+a+Latino+man+CTO+in+his+30s%2C+wearing+smart+casual+attire%2C+tech+executive+style%2C+friendly+and+innovative+looking%2C+neutral+background",
    },
  ];

  const values = [
    {
      icon: "fas fa-robot",
      title: "AI-First Innovation",
      description: "Leveraging cutting-edge AI to transform IT support",
    },
    {
      icon: "fas fa-shield-alt",
      title: "Security Focus",
      description: "Maintaining the highest standards of data protection",
    },
    {
      icon: "fas fa-users",
      title: "User-Centric",
      description: "Building solutions that prioritize user experience",
    },
    {
      icon: "fas fa-lightbulb",
      title: "Continuous Learning",
      description: "Always evolving and improving our technology",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Platform Launch",
      description: "Successfully launched AI IT Assistant platform",
    },
    {
      year: "2024",
      title: "Rapid Growth",
      description: "Reached 10,000+ active users across 500+ companies",
    },
    {
      year: "2024",
      title: "Series A Funding",
      description: "Secured $5M in Series A funding",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanded operations to 15 countries",
    },
  ];

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUser(null); // Set to null to simulate no user logged in
      setLoading(false);
    }, 1000);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Mobile Navigation Menu */}
      <div className="md:hidden">
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity"
          style={{ display: mobileMenuOpen ? "block" : "none" }}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div
          className={`fixed top-0 right-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600"
              >
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
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center">
              <i className="fas fa-cog text-[#1D4ED8] text-2xl mr-2"></i>
              <span className="font-bold text-xl">iTechSmart</span>
            </a>

            {/* Desktop Navigation */}
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
                        href="/account/signin"
                        className="text-[#1D4ED8]"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/account/signin";
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          About Us
        </h1>
        <p className="text-gray-600">Our story, mission, and team</p>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <section className="mb-12 md:mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Our Story & Mission
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
              Founded in 2023, AI IT Assistant emerged from a simple
              observation: IT teams were spending too much time on repetitive
              tasks and manual troubleshooting. Our mission is to revolutionize
              IT support through AI-powered automation, enabling teams to work
              smarter and resolve issues faster.
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              We're building the future of IT support, where artificial
              intelligence and human expertise work together seamlessly to
              deliver exceptional technical support and system management.
            </p>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-4 md:gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4 md:p-6"
              >
                <div className="mb-4 flex justify-center">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/128?text=Loading...";
                    }}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-[#1D4ED8] text-center mb-3 md:mb-4 text-sm md:text-base">
                  {member.role}
                </p>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <i className={`${value.icon} text-[#1D4ED8] text-3xl mb-4`}></i>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Achievements & Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-[#1D4ED8] font-bold text-xl mb-2">
                  {milestone.year}
                </div>
                <h3 className="font-semibold mb-2">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-[#1D4ED8]">
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-[#1D4ED8]">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-[#1D4ED8]">
              <i className="fab fa-github text-2xl"></i>
            </a>
          </div>
        </section>

        <div className="text-center mt-12 scroll-reveal">
          <a href="/contact" className="cta-primary mx-2">
            Get in Touch
          </a>
          <a href="/careers" className="cta-secondary mx-2">
            Join Our Team
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
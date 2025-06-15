"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState("terms");

  React.useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const legalSections = {
    terms: {
      title: "Terms of Service",
      content: (
        <div className="space-y-6">
          <p>Last updated: January 1, 2025</p>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">1. Acceptance of Terms</h3>
            <p>
              By accessing and using iTechSmart's services, you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">2. Service Description</h3>
            <p>
              iTechSmart provides AI-powered IT support and automation tools. We
              reserve the right to modify, suspend, or discontinue any aspect of
              our services at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">3. User Responsibilities</h3>
            <p>
              Users are responsible for maintaining the confidentiality of their
              account credentials and for all activities that occur under their
              account.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">4. Intellectual Property</h3>
            <p>
              All content, features, and functionality of iTechSmart services
              are owned by iTechSmart and are protected by international
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-6">
          <p>Last updated: January 1, 2025</p>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">1. Information Collection</h3>
            <p>
              We collect information that you provide directly to us, including
              but not limited to account information, usage data, and technical
              data about your IT systems.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">2. Use of Information</h3>
            <p>
              We use collected information to provide, maintain, and improve our
              services, communicate with users, and ensure security of our
              platform.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">3. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access or
              disclosure.
            </p>
          </section>
        </div>
      ),
    },
    cookies: {
      title: "Cookie Policy",
      content: (
        <div className="space-y-6">
          <p>Last updated: January 1, 2025</p>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">1. What Are Cookies</h3>
            <p>
              Cookies are small text files stored on your device when you visit
              our website. They help us provide and improve our services.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">
              2. Types of Cookies We Use
            </h3>
            <p>
              We use essential cookies for basic functionality, analytics
              cookies to understand usage patterns, and preference cookies to
              remember your settings.
            </p>
          </section>
        </div>
      ),
    },
    security: {
      title: "Security Policy",
      content: (
        <div className="space-y-6">
          <p>Last updated: January 1, 2025</p>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">1. Data Protection</h3>
            <p>
              We employ industry-standard security measures to protect your
              data, including encryption, secure data storage, and regular
              security audits.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold">2. Access Controls</h3>
            <p>
              We maintain strict access controls and authentication procedures
              to ensure only authorized personnel can access sensitive
              information.
            </p>
          </section>
        </div>
      ),
    },
  };

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

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
            <p className="text-lg md:text-xl leading-relaxed text-gray-600">
              Legal Information
            </p>
          </h1>
          <p className="text-gray-600">
            Important documents about our terms, privacy, and policies
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-500 hover:scale-105">
              <h2 className="text-xl font-semibold mb-4">Documents</h2>
              <div className="space-y-2">
                {Object.entries(legalSections).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`cta-button block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === key
                        ? "bg-[#2563eb] text-white font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-3xl font-bold mb-6">
                {legalSections[activeSection].title}
              </h2>
              {legalSections[activeSection].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
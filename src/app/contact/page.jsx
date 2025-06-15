"use client";
import React from "react";

function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How can I contact support?",
      answer: "You can contact support by filling out the form above.",
    },
    {
      question: "What is the response time?",
      answer: "Our team typically responds within 24 hours.",
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
        <p className="text-gray-600">Get in touch with our team</p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-200 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full rounded-lg border border-gray-200 p-3"
                required
              ></textarea>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && (
              <div className="text-green-500 text-sm">
                Message sent successfully!
              </div>
            )}
            <div className="text-center mt-12 scroll-reveal">
              <button type="submit" className="cta-primary mx-2">
                Send Message
              </button>
              <a href="/knowledge-base" className="cta-secondary mx-2">
                Visit Help Center
              </a>
            </div>
          </form>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm mb-4"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
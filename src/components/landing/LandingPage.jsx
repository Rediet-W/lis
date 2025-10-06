import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample tests for carousel
  const tests = [
    {
      name: "Disorder of Growth",
      results: "Showing 1–6 of 7 results",
      icon: "🧬",
    },
    { name: "Bone", results: "Showing 1 of 1 result", icon: "🦴" },
    { name: "COVID", results: "Showing 1–6 of 41 results", icon: "🦠" },
    { name: "Allergy", results: "Showing 1–12 of 57 results", icon: "🌿" },
  ];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? tests.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === tests.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      {/* Navigation */}
      <nav className="bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <img
                src="/logo.png"
                alt="FineCare Logo"
                className="h-10 w-auto mr-3"
              />
              <span className="text-2xl font-bold text-[#085DB6]">
                World Laboratory Center
              </span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200"
            >
              Staff Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-white px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-[#235F72] mb-6">
            Professional Medical Laboratory Services
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Accurate diagnostic testing with modern technology and expert care.
            Your health is our priority.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#36F1A2] text-[#235F72] px-8 py-3 rounded-lg font-semibold hover:bg-[#2dd191] transition duration-200"
            >
              Patient Login
            </button>
            <button className="border-2 border-[#235F72] text-[#235F72] px-8 py-3 rounded-lg font-semibold hover:bg-[#235F72] hover:text-white transition duration-200">
              View Services
            </button>
          </div>
        </div>
      </section>

      {/* Test List Section */}
      <section className="py-16 bg-gray-50 text-center px-8">
        <h2 className="text-3xl font-bold text-[#235F72] mb-6">Test List</h2>
        <p className="text-lg font-semibold mb-10">
          We offer a comprehensive coverage of more than 80+ medical tests with
          reliable results
        </p>
        <div className="relative flex items-center justify-center">
          <button
            onClick={prevSlide}
            className="absolute left-0 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12">
            {tests.slice(currentIndex, currentIndex + 3).map((test, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#36F1A2] min-w-[200px]"
              >
                <div className="text-4xl mb-4">{test.icon}</div>
                <h3 className="text-xl font-semibold text-[#235F72] mb-2">
                  {test.name}
                </h3>
                <p className="text-gray-600 text-sm">{test.results}</p>
              </div>
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-0 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* Find Test Section */}
      <section className="py-16 bg-white px-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
              Find Test
            </h2>
            <h3 className="text-3xl font-bold text-[#235F72] mb-6">
              With more than 80+ tests covered and reliable results, you can be
              sure that your health is in the best hands.
            </h3>
            <p className="text-gray-600 mb-4">
              With medical professionals in more than 100+ countries and a 98%
              customer satisfaction rate, Doctoralia offers reliable health
              information. With an extensive network of doctors, we are able to
              offer a wide range of high quality medical tests. What’s more, our
              prices are up to 70% cheaper than other online providers.
            </p>
            <p className="text-gray-700 font-medium">
              ✅ Available 900+ Labs with specialists
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/doctor.png"
              alt="Doctor"
              className="rounded-lg max-h-[350px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 px-8">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-[#235F72] mb-6">
              Get in Touch
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600">Name *</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-lg"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-600">Email *</label>
                <input
                  type="email"
                  className="w-full border p-3 rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-600">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full border p-3 rounded-lg"
                  placeholder="+251..."
                />
              </div>
              <div>
                <label className="block text-gray-600">
                  How did you find us?
                </label>
                <select className="w-full border p-3 rounded-lg">
                  <option>Search Engine</option>
                  <option>Friend/Referral</option>
                  <option>Advertisement</option>
                </select>
              </div>
              <button className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition">
                Submit
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="">
            {/* <div className="bg-[#235F72] absolute  w-full h-full rounded-lg"></div> */}
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31517.2783826887!2d38.7426!3d9.0054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b4f6d2c9db%3A0xb7b64b8f8d5d0b92!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1633348850000!5m2!1sen!2set"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="relative z-10 rounded-lg"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#235F72] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 World Laboratory Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

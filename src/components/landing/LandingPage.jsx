import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getClinic } from "../../store/slices/clinicSlice";
const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clinic, loading, error } = useSelector((state) => state.clinic);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // pass ID if your thunk expects it; otherwise remove (1)
    dispatch(getClinic(1));
  }, [dispatch]);

  // Normalize API shape: { success, message, data: {...} } or direct object
  const clinicData = clinic?.data || clinic || {};

  // Use clinic test list or fallback to sample data
  console.log("Clinic Data:", clinicData);
  const tests =
    Array.isArray(clinicData?.test_list) && clinicData.test_list.length > 0
      ? clinicData.test_list.map((test) => ({
          name: test.name,
          results: `Total available: ${Number(test.total || 0)}`,
          icon: "🧬",
          description: test.description,
          slug: test.slug || test.name, // for key
        }))
      : [
          {
            name: "Complete Blood Count",
            results: "Total available: 45",
            icon: "🧬",
            slug: "cbc",
          },
          {
            name: "Biochemistry Panel",
            results: "Total available: 32",
            icon: "🦴",
            slug: "biochem",
          },
          {
            name: "COVID-19 Testing",
            results: "Total available: 28",
            icon: "🦠",
            slug: "covid",
          },
          {
            name: "Allergy Testing",
            results: "Total available: 15",
            icon: "🌿",
            slug: "allergy",
          },
        ];

  const PER_PAGE = 4;

  // Return exactly PER_PAGE items, wrapping around (no empty slots)
  const getVisibleTests = (list, start, count) => {
    if (!list || list.length === 0) return [];
    const n = list.length;
    const c = Math.min(count, n);
    const out = [];
    for (let i = 0; i < c; i++) out.push(list[(start + i) % n]);
    return out;
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      tests.length ? (prev - 1 + tests.length) % tests.length : 0
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (tests.length ? (prev + 1) % tests.length : 0));
  };

  // Auto-slide every 4s
  useEffect(() => {
    if (tests.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tests.length);
    }, 4000);
    return () => clearInterval(id);
  }, [tests.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      {/* Navigation */}
      <nav className="bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {clinicData?.logo_url ? (
                <img
                  src={clinicData.logo_url}
                  alt={`${clinicData.name} Logo`}
                  className="h-10 w-auto mr-3"
                />
              ) : (
                <img
                  src="/logo.png"
                  alt="world laboratory center logo"
                  className="h-10 w-auto mr-3"
                />
              )}
              <span className="text-2xl font-bold text-[#085DB6]">
                {clinicData?.name || "World Laboratory Center"}
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="border-2 border-[#235F72] text-[#235F72] px-6 py-2 rounded-lg hover:bg-[#235F72] hover:text-white transition duration-200"
              >
                Staff Login
              </button>
            </div>
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
            {clinicData?.about_text ||
              "Accurate diagnostic testing with modern technology and expert care. Your health is our priority."}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#36F1A2] text-[#235F72] px-8 py-3 rounded-lg font-semibold hover:bg-[#2dd191] transition duration-200"
            >
              Patient Login
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("tests")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-[#235F72] text-[#235F72] px-8 py-3 rounded-lg font-semibold hover:bg-[#235F72] hover:text-white transition duration-200"
            >
              View Services
            </button>
          </div>
        </div>
      </section>

      {/* Test List Section */}
      <section id="tests" className="py-16 bg-gray-50 text-center px-8">
        <h2 className="text-3xl font-bold text-[#235F72] mb-6">Our Tests</h2>
        <p className="text-lg font-semibold mb-10">
          We offer a comprehensive coverage of {tests.length}+ medical tests
          with reliable results
        </p>
        <div className="relative flex items-center justify-center">
          <button
            onClick={prevSlide}
            className="absolute left-0 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
          >
            <ChevronLeft />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12 w-full max-w-6xl">
            {getVisibleTests(tests, currentIndex, PER_PAGE).map((test, idx) => (
              <div
                key={`${test.slug || test.name}-${idx}`}
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#36F1A2] min-w-[200px] hover:shadow-lg transition duration-200"
              >
                <div className="text-4xl mb-4">{test.icon}</div>
                <h3 className="text-xl font-semibold text-[#235F72] mb-2">
                  {test.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{test.results}</p>
                {test.description && (
                  <p className="text-gray-500 text-xs">{test.description}</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-0 bg-white p-2 rounded-full shadow hover:bg-gray-100 z-10"
          >
            <ChevronRight />
          </button>
        </div>
        {/* Dots (one per test) */}
        <div className="flex justify-center mt-6 space-x-2">
          {tests.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-[#235F72]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Clinic Information Section */}
      <section className="py-16 bg-white px-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">
              About Us
            </h2>
            <h3 className="text-3xl font-bold text-[#235F72] mb-6">
              {clinicData?.name || "World Laboratory Center"}
            </h3>
            <p className="text-gray-600 mb-4">
              {clinicData?.about_text ||
                "With medical professionals and a 98% customer satisfaction rate, we offer reliable health information and a wide range of high quality medical tests."}
            </p>
            {clinicData?.working_hours && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-[#235F72] mb-2">
                  Working Hours
                </h4>
                <p className="text-gray-600">{clinicData.working_hours}</p>
              </div>
            )}
            <div className="space-y-2 text-gray-700">
              {clinicData?.phone && (
                <p>
                  📞 <strong>Phone:</strong> {clinicData.phone}
                </p>
              )}
              {clinicData?.email && (
                <p>
                  ✉️ <strong>Email:</strong> {clinicData.email}
                </p>
              )}
              {clinicData?.address && (
                <p>
                  📍 <strong>Address:</strong> {clinicData.address}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {clinicData?.logo_url ? (
              <img
                src={clinicData.logo_url}
                alt={clinicData.name}
                className="rounded-lg max-h-[350px] object-cover shadow-lg"
              />
            ) : (
              <img
                src="/doctor.png"
                alt="Doctor"
                className="rounded-lg max-h-[350px] object-cover"
              />
            )}
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
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-600">Email *</label>
                <input
                  type="email"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-600">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  placeholder="+251..."
                />
              </div>
              <div>
                <label className="block text-gray-600">
                  How did you find us?
                </label>
                <select className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent">
                  <option>Search Engine</option>
                  <option>Friend/Referral</option>
                  <option>Advertisement</option>
                  <option>Social Media</option>
                </select>
              </div>
              <button className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 w-full">
                Submit
              </button>
            </form>
          </div>

          {/* Map & Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#235F72] mb-4">
                Visit Us
              </h3>
              {clinicData?.address ? (
                <p className="text-gray-600 mb-4">{clinicData.address}</p>
              ) : (
                <p className="text-gray-600 mb-4">Addis Ababa, Ethiopia</p>
              )}
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31517.2783826887!2d38.7426!3d9.0054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b4f6d2c9db%3A0xb7b64b8f8d5d0b92!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1633348850000!5m2!1sen!2set"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#235F72] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {clinicData?.name || "World Laboratory Center"}
              </h3>
              <p className="text-blue-100">
                Professional medical laboratory services with accurate
                diagnostic testing and modern technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-white"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("tests")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="hover:text-white"
                  >
                    Our Tests
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/admin/settings")}
                    className="hover:text-white"
                  >
                    Admin
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="text-blue-100 space-y-2">
                {clinicData?.phone && <p>📞 {clinicData.phone}</p>}
                {clinicData?.email && <p>✉️ {clinicData.email}</p>}
                {clinicData?.address && <p>📍 {clinicData.address}</p>}
              </div>
            </div>
          </div>
          <div className="border-t border-blue-400 mt-8 pt-6 text-center text-blue-100">
            <p>
              &copy; 2025 {clinicData?.name || "World Laboratory Center"}. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

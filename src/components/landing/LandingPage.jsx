import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getClinic } from "../../store/slices/clinicSlice";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clinic, loading, error } = useSelector((state) => state.clinic);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getClinic(1));
  }, [dispatch]);

  const clinicData = clinic?.data || clinic || {};

  const tests =
    Array.isArray(clinicData?.test_list) && clinicData.test_list.length > 0
      ? clinicData.test_list.map((test) => ({
          name: test.name,
          results: `Total available: ${Number(test.total || 0)}`,
          icon: "🧬",
          description: test.description,
          slug: test.slug || test.name,
        }))
      : [
          {
            name: "Complete Blood Count",
            results: "Results in 24-48 hours",
            icon: "🧬",
            description:
              "Comprehensive blood analysis including RBC, WBC, and platelets",
            slug: "cbc",
          },
          {
            name: "Biochemistry Panel",
            results: "Results in 24 hours",
            icon: "🦴",
            description:
              "Liver, kidney function and electrolyte balance testing",
            slug: "biochem",
          },
          {
            name: "COVID-19 Testing",
            results: "Rapid results available",
            icon: "🦠",
            description: "PCR and antigen testing with quick turnaround",
            slug: "covid",
          },
          {
            name: "Allergy Testing",
            results: "Comprehensive panel",
            icon: "🌿",
            description: "Identify allergens and sensitivities",
            slug: "allergy",
          },
          {
            name: "Hormone Panel",
            results: "Specialized testing",
            icon: "⚖️",
            description: "Thyroid, reproductive and metabolic hormone analysis",
            slug: "hormone",
          },
          {
            name: "Genetic Testing",
            results: "Advanced screening",
            icon: "🧬",
            description: "DNA analysis for hereditary conditions",
            slug: "genetic",
          },
        ];

  const PER_PAGE = 4;

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

  useEffect(() => {
    if (tests.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tests.length);
    }, 4000);
    return () => clearInterval(id);
  }, [tests.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {clinicData?.logo_url ? (
                <img
                  src={clinicData.logo_url}
                  alt={`${clinicData.name} Logo`}
                  className="h-10 w-auto"
                />
              ) : (
                <img
                  src="/logo.png"
                  alt="World Basic Laboratory  logo"
                  className="h-10 w-auto mr-3"
                />
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-[#235F72] to-[#36F1A2] bg-clip-text text-transparent">
                {clinicData?.name || "World Basic Laboratory"}
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-[#235F72] to-[#36F1A2] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#235F72] to-[#36F1A2] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Advanced Diagnostic
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
              Laboratory Services
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed">
            {clinicData?.about_text ||
              "Precision medicine through cutting-edge technology and expert clinical analysis. Your health journey starts with accurate diagnostics."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-[#235F72] px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <span>Patient Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("tests")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#235F72] transition-all duration-300"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-[#235F72] mb-2">99%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-[#235F72] mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-[#235F72] mb-2">
                {tests.length}+
              </div>
              <div className="text-gray-600">Medical Tests</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-[#235F72] mb-2">98%</div>
              <div className="text-gray-600">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Test List Section */}
      <section id="tests" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#235F72] mb-4">
              Our Diagnostic Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive laboratory testing with rapid results and clinical
              excellence
            </p>
          </div>

          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl z-10 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-[#235F72]" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-12">
              {getVisibleTests(tests, currentIndex, PER_PAGE).map(
                (test, idx) => (
                  <div
                    key={`${test.slug || test.name}-${idx}`}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#36F1A2] group cursor-pointer"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {test.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#235F72] mb-3 group-hover:text-[#36F1A2] transition-colors duration-300">
                      {test.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mb-3">
                      {test.results}
                    </p>
                    {test.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {test.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl z-10 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-[#235F72]" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-12 space-x-3">
            {tests.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#235F72] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Information Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-sm font-semibold text-[#36F1A2] uppercase tracking-wide">
                  About Our Laboratory
                </span>
                <h2 className="text-4xl font-bold text-[#235F72] mt-2 mb-6">
                  {clinicData?.name || "World Basic Laboratory"}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {clinicData?.about_text ||
                    "As a leading diagnostic center, we combine medical expertise with state-of-the-art technology to deliver precise results. Our certified professionals and advanced equipment ensure the highest standards in laboratory medicine."}
                </p>
              </div>

              {clinicData?.working_hours && (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-5 h-5 text-[#36F1A2]" />
                    <h4 className="font-bold text-[#235F72] text-lg">
                      Operating Hours
                    </h4>
                  </div>
                  <p className="text-gray-700">{clinicData.working_hours}</p>
                </div>
              )}

              <div className="space-y-4">
                {clinicData?.phone && (
                  <div className="flex items-center space-x-4 text-gray-700">
                    <Phone className="w-5 h-5 text-[#36F1A2]" />
                    <span className="font-medium">{clinicData.phone}</span>
                  </div>
                )}
                {clinicData?.email && (
                  <div className="flex items-center space-x-4 text-gray-700">
                    <Mail className="w-5 h-5 text-[#36F1A2]" />
                    <span className="font-medium">{clinicData.email}</span>
                  </div>
                )}
                {clinicData?.address && (
                  <div className="flex items-center space-x-4 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#36F1A2]" />
                    <span className="font-medium">{clinicData.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#235F72] to-[#36F1A2] rounded-2xl p-1">
                {clinicData?.logo_url ? (
                  <img
                    src={clinicData.logo_url}
                    alt={clinicData.name}
                    className="rounded-2xl w-full h-96 object-cover"
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏥</div>
                      <h3 className="text-2xl font-bold text-[#235F72]">
                        Advanced Diagnostic Laboratory
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-[#235F72] mb-6">
                Schedule a Consultation
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent transition-all duration-300"
                    placeholder="+251..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    How did you hear about us?
                  </label>
                  <select className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent transition-all duration-300">
                    <option>Search Engine</option>
                    <option>Friend or Family Referral</option>
                    <option>Healthcare Provider</option>
                    <option>Social Media</option>
                    <option>Advertisement</option>
                    <option>Other</option>
                  </select>
                </div>
                <button className="w-full bg-gradient-to-r from-[#235F72] to-[#36F1A2] text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Request Appointment
                </button>
              </form>
            </div>

            {/* Map & Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-[#235F72] mb-6">
                  Visit Our Facility
                </h3>
                {clinicData?.address ? (
                  <p className="text-gray-600 mb-6 text-lg">
                    {clinicData.address}
                  </p>
                ) : (
                  <p className="text-gray-600 mb-6 text-lg">
                    Addis Ababa, Ethiopia
                  </p>
                )}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31517.2783826887!2d38.7426!3d9.0054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b4f6d2c9db%3A0xb7b64b8f8d5d0b92!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1633348850000!5m2!1sen!2set"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#235F72] to-[#36F1A2] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Emergency Services</h3>
                <p className="mb-4 opacity-90">
                  Need urgent laboratory testing? We offer priority processing
                  for emergency cases.
                </p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold text-lg">
                    24/7 Emergency Line
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#235F72] to-[#36F1A2] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">
                {clinicData?.name || "World Basic Laboratory"}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                Delivering precision diagnostics through innovation and clinical
                excellence for better patient outcomes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-blue-100">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="hover:text-white transition-colors duration-300"
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
                    className="hover:text-white transition-colors duration-300"
                  >
                    Our Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="hover:text-white transition-colors duration-300"
                  >
                    Patient Portal
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-blue-100">
                {clinicData?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4" />
                    <span>{clinicData.phone}</span>
                  </div>
                )}
                {clinicData?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4" />
                    <span>{clinicData.email}</span>
                  </div>
                )}
                {clinicData?.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4" />
                    <span>{clinicData.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Certifications</h3>
              <div className="text-blue-100 space-y-2">
                <p>ISO 15189 Certified</p>
                <p>CLIA Certified Laboratory</p>
                <p>CAP Accredited</p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-100">
            <p>
              &copy; 2025 {clinicData?.name || "World Basic Laboratory"}. All
              rights reserved.
              <span className="block mt-2 text-sm">
                Precision in every test, care in every result.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

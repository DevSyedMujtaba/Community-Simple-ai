import { HiCheckCircle } from "react-icons/hi";
import img1 from '../../public/img1.jpg';
import logo2 from '../../public/logo2.png';
import dottedCircle from '../../public/dotted-circle.png';
import type { JSX } from 'react';
import { useState } from 'react';
import img2 from '../../public/img2.jpeg';
import img3 from '../../public/img3.jpg';
import img4 from '../../public/img4.jpg';
import img5 from '../../public/img5.jpg';

// import heroImg from "../assets/hero-hoa-couple.png"; // Commented out due to missing file

/**
 * Landing page component that provides access to three different dashboards
 * Features a clean, modern design consistent with the brand identity
 * Fully mobile responsive with optimized layout for all screen sizes
 */
const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll function for anchor links
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faff] flex flex-col">
      {/* Top blue compliance bar */}

      {/* Custom Navbar */}
      <nav className="w-full bg-white shadow-sm flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 ">
          <img
            src={logo2}
            alt="Community.Simple Logo"
            className="h-10 sm:h-12 md:h-14 w-auto"
            style={{ maxWidth: '160px' }}
          />
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 mx-auto">
          <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-[#254F70] font-medium transition">Home</button>
          <button onClick={() => scrollToSection('why-us')} className="text-gray-700 hover:text-[#254F70] font-medium transition">Why Us</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-[#254F70] font-medium transition">How It Works</button>
          <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-[#254F70] font-medium transition">Features</button>
          <button onClick={() => scrollToSection('who-we-serve')} className="text-gray-700 hover:text-[#254F70] font-medium transition">Who We Serve</button>
          <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-[#254F70] font-medium transition">Testimonials</button>
        </div>
        {/* Desktop CTA Button */}
        <button onClick={() => scrollToSection('get-started')} className="ml-auto md:ml-0 bg-[#254F70] hover:bg-[#1e3a56] text-white font-semibold px-5 py-2 rounded-md shadow transition text-sm hidden md:inline-block">
          Get Started Now
        </button>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden ml-auto flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#254F70]"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#254F70" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full shadow-lg flex flex-col p-6 relative" onClick={e => e.stopPropagation()}>
              {/* Close button */}
              <button
                className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#254F70]"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M6 18L18 6" stroke="#254F70" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <nav className="flex flex-col gap-6 mt-10">
                <button onClick={() => { scrollToSection('home'); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-[#254F70] font-medium transition text-left">Home</button>
                <button onClick={() => { scrollToSection('why-us'); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-[#254F70] font-medium transition text-left">Why Us</button>
                <button onClick={() => { scrollToSection('how-it-works'); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-[#254F70] font-medium transition text-left">How It Works</button>
                <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-[#254F70] font-medium transition text-left">Features</button>
                <button onClick={() => { scrollToSection('who-we-serve'); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-[#254F70] font-medium transition text-left">Who We Serve</button>
                <button onClick={() => { scrollToSection('testimonials'); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-[#254F70] font-medium transition text-left">Testimonials</button>
                <button onClick={() => { scrollToSection('get-started'); setMobileMenuOpen(false); }} className="bg-[#254F70] hover:bg-[#1e3a56] text-white font-semibold px-5 py-2 rounded-md shadow transition text-sm mt-4 text-center">
                  Get Started Now
                </button>
              </nav>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <main id="home" className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Text */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left">
            <span className="uppercase text-xs font-semibold text-[#254F70] mb-2 tracking-wide">
              AI-POWERED HOA COMPLIANCE ASSISTANT
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Stay HOA Compliant
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-md">
              Community Simple helps HOA boards, managers, and homeowners understand and follow complex HOA rules—without expensive legal fees.
            </p>
            <a href="/signup" className="bg-[#254F70] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md text-base shadow-md transition w-full sm:w-auto text-center">
              JOIN THE WAITLIST
            </a>
          </div>
          {/* Right: Image (commented out) */}

          <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0 z-0">
            <div style={{ backgroundColor: '#fdfefa' }} className="w-full max-w-md rounded-2xl shadow-lg flex justify-center items-center">
              <img
                src={img2}
                alt="Happy couple in front of house"
                className="w-full rounded-2xl object-contain"
                style={{ maxHeight: 400 }}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Problems Section */}
      <section id="why-us" className="w-full flex flex-col md:flex-row items-center justify-center px-4 py-20 bg-white gap-12 md:gap-20 mt-8 md:mt-16">
        {/* Left: Image with overlapping SVGs */}
        <div className="relative w-full max-w-md md:max-w-none md:w-auto flex justify-center">
          <div className="relative w-full max-w-[520px] aspect-[2/1]">
            {/* Rectangle: Top-left (under image) */}
            <svg
              className="absolute top-0 sm:top-0 md:top-0 right-[-12px] sm:right-[-16px] md:right-[-16px] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[328px] md:h-[328px] z-0"
              viewBox="0 0 328 328"
            >
              <rect width="328" height="328" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>

            {/* Rectangle: Bottom-left (under image) */}
            <svg
              className="absolute bottom-0 sm:bottom-0 md:bottom-0 left-[-12px] sm:left-[-16px] md:left-[-16px] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[328px] md:h-[328px] z-0"
              viewBox="0 0 328 328"
            >
              <rect width="328" height="328" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>

            {/* Dotted Circle: Top-left, mostly under image */}
            {/* <img
              src={dottedCircle}
              alt="Dotted circle decoration"
              className="absolute top-[-18px] sm:top-[-28px] md:top-[-46px] left-[-18px] sm:left-[-28px] md:left-[-40px] w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] md:w-[113px] md:h-[113px] z-0 select-none pointer-events-none"
            /> */}

            {/* Image (on top of all shapes) */}
            <div className="relative w-full h-full">
              <img
                src={img3}
                alt="Happy couple in front of house"
                className="w-full h-full object-cover rounded-md shadow-lg border border-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left max-w-xl">
          <span className="uppercase text-sm font-semibold text-[#254F70] mb-3 tracking-wide">
            Problems
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-gray-900 mb-4 leading-tight">
            Why HOA Compliance<br />Is Broken
          </h2>
          <p className="text-base sm:text-sm text-gray-700 mb-4 max-w-md">
            Managing HOA compliance shouldn't be this hard. But today's system is expensive, confusing, and stressful.
          </p>
          <ul className="mb-5 space-y-4">
            {[
              "Rules are complex and inconsistent",
              "Legal advice costs thousands",
              "Violations cause disputes, fines, and lawsuits",
              "Homeowners often feel powerless",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-800 text-sm">
                <HiCheckCircle className="text-[#254F70] mt-0.5 flex-shrink-0" size={20} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <a
            href="/signup"
            className="bg-[#254F70] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md text-base shadow-md transition w-full sm:w-auto text-center"
          >
            READ MORE ABOUT US
          </a>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="how-it-works" className="w-full bg-[#f3f8fe] py-16 flex flex-col items-center justify-center">
        <span className="uppercase text-xs font-semibold text-[#254F70] mb-3 tracking-wide text-center block">Solutions</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">How Community Simple Makes HOA Compliance Easy</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-10 text-center max-w-2xl mx-auto">
          Community Simple is your on-demand HOA legal assistant. No jargon. No billable hours. Just clear answers and practical tools.
        </p>
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {/* Card 1 */}
          <div className="bg-white rounded-md shadow-md flex flex-col items-center p-8 text-center">
            <div className="bg-[#e6eef3] rounded-full p-3 mb-4 flex items-center justify-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#254F70" strokeWidth="2" /><path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" stroke="#254F70" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="font-semibold text-lg mb-1 text-gray-900">Ask any HOA-related question</div>
            <div className="text-gray-500 text-sm">Get fast, reliable guidance</div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-md shadow-md flex flex-col items-center p-8 text-center">
            <div className="bg-[#e6eef3] rounded-full p-3 mb-4 flex items-center justify-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#254F70" strokeWidth="2" /><path d="M12 8v4l2 2" stroke="#254F70" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="font-semibold text-lg mb-1 text-gray-900">Draft letters and resolve disputes</div>
            <div className="text-gray-500 text-sm">AI-assisted legal templates</div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-md shadow-md flex flex-col items-center p-8 text-center">
            <div className="bg-[#e6eef3] rounded-full p-3 mb-4 flex items-center justify-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#254F70" strokeWidth="2" /><path d="M12 8v4" stroke="#254F70" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16" r="1" fill="#254F70" /></svg>
            </div>
            <div className="font-semibold text-lg mb-1 text-gray-900">Stay ahead of violations</div>
            <div className="text-gray-500 text-sm">Get proactive alerts and tips</div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-md shadow-md flex flex-col items-center p-8 text-center">
            <div className="bg-[#e6eef3] rounded-full p-3 mb-4 flex items-center justify-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="2" stroke="#254F70" strokeWidth="2" /><rect x="8" y="18" width="8" height="2" rx="1" stroke="#254F70" strokeWidth="2" /></svg>
            </div>
            <div className="font-semibold text-lg mb-1 text-gray-900">Accessible anytime</div>
            <div className="text-gray-500 text-sm">Desktop and mobile optimized</div>
          </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center px-4 py-16 bg-white gap-8 md:gap-16">
        {/* Left: Text and Features */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left max-w-xl">
          <span className="uppercase text-xs font-semibold text-[#254F70] mb-2 tracking-wide">Powerful Features</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Powerful Features to<br />HOA Compliance
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-6 max-w-md">
            Whether you're on the HOA board, managing properties, or a concerned resident — Community Simple puts legal clarity in your pocket.
          </p>
          <div className="flex flex-col gap-4 w-full">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#e6eef3] rounded-full p-2 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="#254F70" strokeWidth="2" />
                  <path d="M12 8v4l2 2" stroke="#254F70" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-base text-gray-900">AI Legal Assistant</div>
                <div className="text-gray-500 text-sm">Instant answers to complex HOA questions</div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#e6eef3] rounded-full p-2 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="#254F70" strokeWidth="2" />
                  <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" stroke="#254F70" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-base text-gray-900">Smart Templates</div>
                <div className="text-gray-500 text-sm">Auto-drafted letters, notices, and requests</div>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#e6eef3] rounded-full p-2 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10" stroke="#254F70" strokeWidth="2" />
                  <path d="M8 10h8M8 14h5" stroke="#254F70" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-base text-gray-900">Document Review</div>
                <div className="text-gray-500 text-sm">Scan HOA rules and documents for risks and clarity</div>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="flex items-start gap-4">
              <div className="bg-[#e6eef3] rounded-full p-2 flex items-center justify-center">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10" stroke="#254F70" strokeWidth="2" />
                  <path d="M8 10h8M8 14h5" stroke="#254F70" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="18" r="2" stroke="#254F70" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-base text-gray-900">Trained on Real Law</div>
                <div className="text-gray-500 text-sm">Built on actual state HOA laws and legal best practices</div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Image with overlapping SVGs */}
        <div className="relative w-full max-w-md md:max-w-none md:w-auto flex justify-center">
          <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[444px] md:h-[444px]">
            {/* Rectangle: Top-left (under image) */}
            <svg
              className="absolute top-[-32px] sm:top-[-40px] md:top-[-74px] right-[-12px] sm:right-[-16px] md:right-[-16px] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[328px] md:h-[328px] z-0"
              viewBox="0 0 328 328"
            >
              <rect width="328" height="328" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>

            {/* Rectangle: Bottom-left (under image) */}
            <svg
              className="absolute bottom-[18px] sm:bottom-[30px] md:bottom-[40px] left-[-12px] sm:left-[-16px] md:left-[-16px] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[328px] md:h-[328px] z-0"
              viewBox="0 0 328 328"
            >
              <rect width="328" height="328" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>

            {/* Dotted Circle: Top-left, mostly under image */}
            {/* <img
              src={dottedCircle}
              alt="Dotted circle decoration"
              className="absolute top-[-18px] sm:top-[-28px] md:top-[-46px] left-[-18px] sm:left-[-28px] md:left-[-40px] w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] md:w-[113px] md:h-[113px] z-0 select-none pointer-events-none"
            /> */}

            {/* Image (on top of all shapes) */}
            <div className="relative w-full h-full">
              <img
                src={img4}
                alt="Happy couple in front of house"
                className="w-full h-full object-cover rounded-md shadow-lg border border-gray-100"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Created by a Lawyer Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center px-4 py-20 bg-white gap-12 md:gap-20">
        {/* Left: Image with overlapping SVGs */}
        <div className="relative w-full max-w-md md:max-w-none md:w-auto flex justify-center">
          <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[444px] md:h-[444px]">
            {/* Rectangle: Top-left (under image) */}
            <svg
              className="absolute top-[-32px] sm:top-[-40px] md:top-[-74px] right-[-12px] sm:right-[-16px] md:right-[-16px] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[328px] md:h-[328px] z-0"
              viewBox="0 0 328 328"
            >
              <rect width="328" height="328" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>

            {/* Rectangle: Bottom-left (under image) */}
            <svg
              className="absolute bottom-[18px] sm:bottom-[30px] md:bottom-[40px] left-[-12px] sm:left-[-16px] md:left-[-16px] w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] md:w-[328px] md:h-[328px] z-0"
              viewBox="0 0 328 328"
            >
              <rect width="328" height="328" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>

            {/* Dotted Circle: Top-left, mostly under image */}
            {/* <img
              src={dottedCircle}
              alt="Dotted circle decoration"
              className="absolute top-[-18px] sm:top-[-28px] md:top-[-46px] left-[-18px] sm:left-[-28px] md:left-[-40px] w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] md:w-[113px] md:h-[113px] z-0 select-none pointer-events-none"
            /> */}

            {/* Image (on top of all shapes) */}
            <div className="relative w-full h-full">
              <img
                src={img5}
                alt="Happy couple in front of house"
                className="w-full h-full object-cover rounded-md shadow-lg border border-gray-100"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
          </div>
        </div>
        {/* Right: Text and CTA */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left max-w-xl">
          <span className="uppercase text-xs font-semibold text-[#254F70] mb-2 tracking-wide">HOA Legal Software Created by Lawyers</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Created by a Lawyer.<br />Designed for Your Community.
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-6 max-w-md">
            Community Simple was founded by an experienced attorney who saw firsthand how difficult and expensive HOA compliance can be. Our mission: to make legal clarity simple, affordable, and accessible for every community.
          </p>
          <a
            href="/signup"
            className="bg-[#254F70] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md text-sm shadow-md transition w-full sm:w-auto text-center"
          >
            JOIN THE Community Simple WAITLIST FOR EARLY ACCESS
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-white py-20 flex flex-col items-center justify-center">
        <span className="uppercase text-xs font-semibold text-[#254F70] mb-3 tracking-wide text-center block">Features</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Powerful Features for HOA Management</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-12 text-center max-w-2xl mx-auto">
          Everything you need to manage HOA compliance efficiently and effectively.
        </p>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Feature 1: AI Document Analysis */}
          <div className="bg-[#f3f8fe] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="bg-[#254F70] rounded-full p-4 mb-6 flex items-center justify-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2" />
                <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2" />
                <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" />
                <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" />
                <polyline points="10,9 9,9 8,9" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">AI Document Analysis</h3>
            <p className="text-gray-600 text-sm">Upload your HOA documents and get instant AI-powered analysis and insights.</p>
          </div>

          {/* Feature 2: Compliance Tracking */}
          <div className="bg-[#f3f8fe] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="bg-[#254F70] rounded-full p-4 mb-6 flex items-center justify-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" />
                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" stroke="white" strokeWidth="2" />
                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" stroke="white" strokeWidth="2" />
                <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z" stroke="white" strokeWidth="2" />
                <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Compliance Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor violations, track resolutions, and maintain compliance records.</p>
          </div>

          {/* Feature 3: Communication Tools */}
          <div className="bg-[#f3f8fe] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="bg-[#254F70] rounded-full p-4 mb-6 flex items-center justify-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Communication Tools</h3>
            <p className="text-gray-600 text-sm">Built-in messaging and notification system for seamless communication.</p>
          </div>
        </div>
      </section>

      {/* Who Community Simple Helps Section */}
      <section id="who-we-serve" className="w-full bg-[#f3f8fe] py-20 flex flex-col items-center justify-center">
        <span className="uppercase text-xs font-semibold text-[#254F70] mb-3 tracking-wide text-center block">Who Us Helps</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Who Community Simple Helps</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-12 text-center max-w-2xl mx-auto">
          Community Simple is your on-demand HOA legal assistant. No jargon. No billable hours. Just clear answers and practical tools.
        </p>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Card 1: HOA Board Members */}
          <div className="bg-white rounded-2xl shadow-md flex flex-col items-start p-8">
            <div className="bg-[#e6eef3] rounded-full p-4 mb-4 flex items-center justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#254F70" strokeWidth="2" /><rect x="7" y="3" width="10" height="4" rx="1" stroke="#254F70" strokeWidth="2" /></svg>
            </div>
            <div className="font-bold text-lg mb-1 text-gray-900">For HOA Board Members</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Make clear, defensible decisions</li>
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Reduce legal liability</li>
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Improve community trust</li>
            </ul>
          </div>
          {/* Card 2: Property Managers */}
          <div className="bg-white rounded-2xl shadow-md flex flex-col items-start p-8">
            <div className="bg-[#e6eef3] rounded-full p-4 mb-4 flex items-center justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" stroke="#254F70" strokeWidth="2" /><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#254F70" strokeWidth="2" /></svg>
            </div>
            <div className="font-bold text-lg mb-1 text-gray-900">For Property Managers</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Resolve disputes faster</li>
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Lower legal and operating costs</li>
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Maintain HOA compliance easily</li>
            </ul>
          </div>
          {/* Card 3: Homeowners */}
          <div className="bg-white rounded-2xl shadow-md flex flex-col items-start p-8">
            <div className="bg-[#e6eef3] rounded-full p-4 mb-4 flex items-center justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="10" r="4" stroke="#254F70" strokeWidth="2" /><path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#254F70" strokeWidth="2" /></svg>
            </div>
            <div className="font-bold text-lg mb-1 text-gray-900">For Homeowners</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Understand your rights</li>
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Proactively avoid costly violations</li>
              <li className="flex items-center gap-2 text-gray-800 text-sm"><HiCheckCircle className="text-[#254F70]" size={18} /> Communicate with boards more effectively</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Happy Customers/Testimonial Section */}
      <section id="testimonials" className="w-full py-20 flex flex-col items-center justify-center bg-white">
        <span className="uppercase text-xs font-semibold text-[#254F70] mb-3 tracking-wide text-center block">Happy Customers</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">How Community Simple will help<br />our customers</h2>
        <p className="text-gray-600 text-sm sm:text-base mb-12 text-center max-w-2xl mx-auto">
          Community Simple is your on-demand HOA legal assistant. No jargon. No billable hours. Just clear answers and practical tools.
        </p>
        <div className="relative w-full max-w-6xl flex items-center justify-center">
          {/* Left Arrow */}
          <button className="absolute left-[-32px] top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 flex items-center justify-center hover:bg-blue-50 transition hidden md:flex">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#254F70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Renee W" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-lg text-gray-900">Renee W</div>
                  <div className="text-gray-500 text-sm">Happy Patient</div>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod to the a tempor incididunt to he a to the tempor ut labore et dolore magna aliqua.</div>
              <div className="bg-gray-100 rounded-md px-4 py-2 flex items-center gap-2 w-full">
                <span className="text-xs text-gray-600">Rated (4.9 of 5)</span>
                <div className="flex gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" fill="#254F70" viewBox="0 0 20 20"><polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" /></svg>
                  ))}
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="Renee W" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-lg text-gray-900">Renee W</div>
                  <div className="text-gray-500 text-sm">Happy Patient</div>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod to the a tempor incididunt to he a to the tempor incididunt to he a to the tempor.</div>
              <div className="bg-gray-100 rounded-md px-4 py-2 flex items-center gap-2 w-full">
                <span className="text-xs text-gray-600">Rated (4.9 of 5)</span>
                <div className="flex gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" fill="#254F70" viewBox="0 0 20 20"><polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" /></svg>
                  ))}
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Renee W" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-lg text-gray-900">Renee W</div>
                  <div className="text-gray-500 text-sm">Happy Patient</div>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod to the a tempor incididunt to he a to the tempor ut labore et dolore magna aliqua.</div>
              <div className="bg-gray-100 rounded-md px-4 py-2 flex items-center gap-2 w-full">
                <span className="text-xs text-gray-600">Rated (4.9 of 5)</span>
                <div className="flex gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" fill="#254F70" viewBox="0 0 20 20"><polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" /></svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Right Arrow */}
          <button className="absolute right-[-32px] top-1/2 -translate-y-1/2 bg-[#254F70] text-white rounded-full shadow p-2 flex items-center justify-center hover:bg-blue-700 transition hidden md:flex">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <button className="mt-12 bg-[#254F70] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md text-base shadow-md transition">JOIN THE WAITLIST</button>
      </section>

      {/* Early Access CTA Section */}
      <section id="get-started" className="w-full flex flex-col md:flex-row items-stretch justify-center min-h-[340px]">
        {/* Left: Blue CTA */}
        <div className="flex-1 bg-[#254F70] flex flex-col justify-center px-8 py-12 md:py-0 md:px-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Get Early Access to<br />Community Simple</h2>
          <p className="text-white text-base sm:text-lg mb-8 max-w-md">Community Simple is launching soon. Be among the first to simplify HOA compliance with AI. Join our early access list today.</p>
          <button className="bg-white text-[#254F70] font-semibold px-8 py-3 rounded-md text-base shadow-md transition w-fit hover:bg-blue-50">JOIN THE WAITLIST</button>
        </div>
        {/* Right: Image */}
        <div className="flex-1 min-h-[340px] flex items-center justify-center overflow-hidden">
          <img
            src={img1}
            alt="Happy couple in front of house"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '340px', maxHeight: '500px' }}
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-white pt-16 pb-6 px-4 md:px-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={logo2} alt="Community Simple Logo" className="h-10 w-auto" />

            </div>
            <p className="text-gray-600 text-sm mb-6 max-w-xs">Community Simple helps HOA boards, managers, and homeowners understand and follow complex HOA rules—without expensive legal fees.</p>
            <div className="font-semibold text-base mb-2">Follow us</div>
            <div className="flex gap-3">
              <a href="#" className="border border-blue-400 rounded-full p-2 text-blue-500 hover:bg-blue-50 transition"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H6v4h4v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" stroke="#254F70" strokeWidth="2" /></svg></a>
              <a href="#" className="border border-blue-400 rounded-full p-2 text-blue-500 hover:bg-blue-50 transition"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03A12.94 12.94 0 0 1 3.1.67a4.52 4.52 0 0 0-.61 2.28c0 1.57.8 2.96 2.02 3.77A4.48 4.48 0 0 1 2 6.13v.06c0 2.2 1.56 4.03 3.64 4.45a4.52 4.52 0 0 1-2.04.08c.57 1.77 2.23 3.06 4.2 3.1A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71A4.52 4.52 0 0 0 23 3z" stroke="#254F70" strokeWidth="2" /></svg></a>
              <a href="#" className="border border-blue-400 rounded-full p-2 text-blue-500 hover:bg-blue-50 transition"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#254F70" strokeWidth="2" /><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="#254F70" strokeWidth="2" /></svg></a>
              <a href="#" className="border border-blue-400 rounded-full p-2 text-blue-500 hover:bg-blue-50 transition"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" stroke="#254F70" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="#254F70" strokeWidth="2" /></svg></a>
            </div>
          </div>
          {/* Useful Links */}
          <div>
            <div className="font-semibold text-base mb-3">Useful Links</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
              <li><a href="/login" className="hover:text-blue-600">Homeowner Dashboard</a></li>
              <li><a href="/login" className="hover:text-blue-600">Board Dashboard</a></li>
              <li><a href="/login" className="hover:text-blue-600">Admin Dashboard</a></li>
              <li><a href="/test-flow" className="hover:text-blue-600">Test Onboarding Flow</a></li>
              <li>
                <button className="mt-2 px-3 py-1 bg-gray-200 text-[#254F70] rounded text-xs font-semibold cursor-not-allowed opacity-80 w-full text-left" disabled>
                  HOA - Property Lawyer Market Place
                  <span className="ml-2 text-[10px] text-gray-500 font-normal">Beta - In Development - Coming soon</span>
                </button>
              </li>
            </ul>
          </div>
          {/* Help Center */}
          <div>
            <div className="font-semibold text-base mb-3">Help center</div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="/terms-and-conditions" className="hover:text-blue-600">Terms & Conditions</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</a></li>
            </ul>
          </div>
          {/* Subscribe Now */}
          <div>
            <div className="font-semibold text-base mb-3">Subscribe now</div>
            <div className="text-gray-700 text-sm mb-3">Sign up for our newsletter - enter your email below</div>
            <form className="flex items-center bg-blue-50 rounded-md overflow-hidden">
              <input type="email" placeholder="Enter Your Email" className="bg-blue-50 px-4 py-2 outline-none text-gray-700 w-full" />
              <button type="submit" className="bg-[#254F70] hover:bg-blue-600 text-white px-3 py-2 flex items-center justify-center">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </form>
          </div>
        </div>
        <hr className="my-8 border-gray-200" />
        <div className="text-center text-gray-500 text-sm">
          Copyright © <span className="text-[#254F70] font-semibold">Neighbor Simple 2025</span>. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Index;
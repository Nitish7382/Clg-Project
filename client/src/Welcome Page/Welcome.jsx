// src/Welcome Page/Welcome.jsx
import React, { useRef, useEffect, Suspense } from "react";
import Navbar from "./Navbar";
import HeroContent from "./welcomecontent";

const StarsCanvas = React.lazy(() => import("./Bgwelcome"));

const Welcome = () => {
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);

  // Function to scroll to services section
  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to scroll to about section
  const handleScrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Add 'welcome-page' class when this component is mounted
    document.body.classList.add("welcome-page");
    return () => {
      document.body.classList.remove("welcome-page");
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Lazy Load Background */}
      <Suspense fallback={<div>Loading background...</div>}>
        <StarsCanvas />
      </Suspense>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar
          onScrollToServices={handleScrollToServices}
          onScrollToAbout={handleScrollToAbout}
        />
      </header>

      {/* Hero Content */}
      <main className="relative z-40 pt-[70px]">
        <HeroContent />
      </main>

      {/* Services Section */}
      <section
        ref={servicesRef}
        className="relative z-30 min-h-screen pt-[100px] px-4 md:px-20 text-white"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Our <span className="text-green-400">Services</span>
          </h1>

          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Empowering organizations with dynamic learning solutions, tailored
            assessments, and insightful analytics to boost employee success and
            growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Cards */}
            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-md hover:shadow-green-400/30 transition duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold mb-2">Course Management</h2>
              <p className="text-sm text-gray-300">
                Create, edit, and manage a wide range of learning courses
                tailored to meet specific employee needs.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-md hover:shadow-green-400/30 transition duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold mb-2">Assessments</h2>
              <p className="text-sm text-gray-300">
                Build, assign, and evaluate quizzes and exams to monitor
                learning progress and performance.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-md hover:shadow-green-400/30 transition duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold mb-2">Analytics</h2>
              <p className="text-sm text-gray-300">
                Track course completion rates, assessment results, and employee
                engagement with intuitive dashboards.
              </p>
            </div>

            {/* New Services */}
            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-md hover:shadow-green-400/30 transition duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-2xl font-semibold mb-2">
                Employee Collaboration
              </h2>
              <p className="text-sm text-gray-300">
                Foster a collaborative learning environment where employees can
                share insights and experiences.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-md hover:shadow-green-400/30 transition duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🔔</div>
              <h2 className="text-2xl font-semibold mb-2">Notifications</h2>
              <p className="text-sm text-gray-300">
                Keep employees informed with real-time notifications for new
                courses, deadlines, and achievements.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 shadow-md hover:shadow-green-400/30 transition duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-2xl font-semibold mb-2">
                Achievements & Badges
              </h2>
              <p className="text-sm text-gray-300">
                Motivate employees by awarding badges and certificates for
                course completions and high performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="relative z-30 min-h-screen pt-[100px] px-6 md:px-20 text-white "
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-green-400">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            At{" "}
            <span className="text-green-400 font-semibold">Learning Hub</span>,
            we're committed to empowering employee growth through intuitive,
            innovative, and accessible learning experiences. Our platform
            bridges the gap between skill-building and career advancement with
            curated courses, interactive assessments, and insightful analytics.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="p-6 bg-white/10 rounded-2xl shadow-lg border border-white/20 hover:shadow-green-400/30 transition duration-300">
              <h2 className="text-2xl font-semibold mb-2 text-green-400">
                Our Mission
              </h2>
              <p className="text-sm text-gray-300">
                To create a seamless, engaging, and effective learning
                environment for employees worldwide.
              </p>
            </div>

            {/* Vision */}
            <div className="p-6 bg-white/10 rounded-2xl shadow-lg border border-white/20 hover:shadow-green-400/30 transition duration-300">
              <h2 className="text-2xl font-semibold mb-2 text-green-400">
                Our Vision
              </h2>
              <p className="text-sm text-gray-300">
                To become the leading platform for corporate learning and
                professional development.
              </p>
            </div>

            {/* Values */}
            <div className="p-6 bg-white/10 rounded-2xl shadow-lg border border-white/20 hover:shadow-green-400/30 transition duration-300">
              <h2 className="text-2xl font-semibold mb-2 text-green-400">
                Our Values
              </h2>
              <p className="text-sm text-gray-300">
                Innovation, Accessibility, Integrity, and Excellence in
                Learning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;

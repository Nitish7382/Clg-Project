import React, { Suspense, useEffect } from 'react'; 
import Navbar from './Navwelcome';
import HeroContent from './welcomecontent';

const StarsCanvas = React.lazy(() => import('./Bgwelcome'));

const Welcome = () => {
  useEffect(() => {
    // Add 'welcome-page' class when this component is mounted
    document.body.classList.add('welcome-page');

    // Remove the class when the component is unmounted
    return () => {
      document.body.classList.remove('welcome-page');
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Lazy Load Background */}
      <Suspense fallback={<div>Loading background...</div>}>
        <StarsCanvas/>
      </Suspense>
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>

      {/* Hero Content */}
      <main className="relative z-40 pt-[70px]">
        <HeroContent />
      </main>
    </div>
  );
}

export default Welcome;

import React, { useState } from 'react';
import { loginUser } from './Api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import StarsCanvas from './Welcome Page/Bgwelcome'; // Import the star background
import { motion } from 'framer-motion'; // Import Framer Motion
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from './utils/motion'; // Import motion variants
import Navbar from './Welcome Page/Navwelcome';

function SignIn() {
  const [email, setEmail] = useState('');  // Changed from username to email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);  // Pass email instead of username

      // Extract role from response
      const role = response.role || localStorage.getItem('role'); // Fallback to localStorage
      toast.success('Login successful!');

      // Navigate based on role
      setTimeout(() => {
        if (role === 'Admin') {
          navigate('/admin');
        } else if (role === 'Manager') {
          navigate('/manager');
        } else if (role === 'Employee') {
          navigate('/employee');
        } else {
          navigate('/'); // Default fallback
        }
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Invalid email or password', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      <Navbar />
      {/* Add the Star Background */}
      <div className="absolute inset-0 -z-10">
        <StarsCanvas />
      </div>

      {/* Content Layer */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
        initial="hidden"
        animate="visible"
        variants={slideInFromTop} // Apply slide-in animation
      >
        <motion.div
          className="bg-transparent border-2 border-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-[400px] mx-4"
          initial="hidden"
          animate="visible"
          variants={slideInFromLeft(0.2)} // Slide in from the left
        >
          <motion.h2
            className="text-center text-4xl font-medium text-green-600 mb-4"
            variants={slideInFromTop} // Slide in heading from the top
            initial="hidden"
            animate="visible"
          >
            Sign In
          </motion.h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <motion.input
              type="email"  // Change input type to email
              placeholder="Email"
              value={email}  // Bind email state
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
              variants={slideInFromLeft(0.4)} // Slide in input
              initial="hidden"
              animate="visible"
            />
            <motion.input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
              variants={slideInFromLeft(0.6)} // Slide in input with a delay
              initial="hidden"
              animate="visible"
            />
            <motion.button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-200"
              variants={slideInFromRight(0.8)} // Slide in button from the right
              initial="hidden"
              animate="visible"
            >
              Sign In
            </motion.button>
          </form>
          <motion.div
            className="mt-4 text-center"
            variants={slideInFromRight(1)} // Slide in footer from the right
            initial="hidden"
            animate="visible"
          >
            <p className="text-white text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400">
                Sign Up Now!
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignIn;

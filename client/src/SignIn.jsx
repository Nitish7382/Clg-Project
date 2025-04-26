import React, { useState } from 'react';
import { loginUser } from './Api';
import { useNavigate, Link } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarsCanvas from './Welcome Page/Bgwelcome';
import Navbar from './Welcome Page/Navbar';
import { Eye, EyeOff } from 'lucide-react'; // Optional: You can install lucide-react for icons

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      const role = response.role || localStorage.getItem('role');
      toast.success('Login successful!');

      setTimeout(() => {
        if (role === 'Admin') navigate('/admin');
        else if (role === 'Manager') navigate('/manager');
        else if (role === 'Employee') navigate('/employee');
        else navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Invalid email or password', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        transition: Bounce,
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <StarsCanvas />
      </div>

      <div className="bg-transparent border-2 border-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-[400px] mx-4">
        <h2 className="text-center text-4xl font-medium text-green-600 mb-4">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none pr-12"
            />
            <button
              type="button"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-white text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400">
              Sign Up Now!
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignIn;

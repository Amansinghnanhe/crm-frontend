import React, { useState } from 'react';
import axios from 'axios';

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User
} from 'lucide-react';

import LeadDashboard from './pages/LeadDashboard';

function App() {

  const [isLoginTab, setIsLoginTab] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [token, setToken] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {

    e.preventDefault();

    const url = isLoginTab
      ? 'http://localhost:8080/api/v1/auth/login'
      : 'http://localhost:8080/api/v1/auth/register';

    const body = isLoginTab
      ? { email, password }
      : { name, email, password, role: 'USER' };

    try {

      const res = await axios.post(url, body);

      if (isLoginTab) {

        setToken(res.data.token);

      } else {

        setMessage('Registration successful! Please Login.');
        setIsLoginTab(true);

      }

    } catch (err: any) {

      setMessage(
        err.response?.data?.message ||
        'Something went wrong!'
      );

    }
  };

  return (

    <div className="min-h-screen w-full relative overflow-hidden bg-black">

      {/* BACKGROUND IMAGE */}
      <img
        src="/1703602486048.jpg"
        alt="background"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          transition-all
          duration-500
        "
        style={{
          objectPosition: '86% 6%',
          transform: 'scale(0.80)',
        }}
      />

      {/* OVERLAY */}
      <div className="
        absolute
        inset-0
        bg-black/10
        backdrop-blur-[1px]
      "></div>

      {/* MAIN CONTENT */}
      <div className="
        relative
        z-10
        min-h-screen
        flex
        items-center
        justify-start
        px-4
        md:px-20
        lg:px-32
      ">

        {token ? (

          <div className="
            w-full
            max-w-md
            bg-slate-900/35
            backdrop-blur-2xl
            border
            border-white/10
            rounded-3xl
            p-6
            md:p-8
            shadow-2xl
          ">

            <LeadDashboard
              token={token}
              onLogout={() => setToken('')}
            />

          </div>

        ) : (

          <div className="
            w-full
            max-w-md
            bg-slate-900/35
            backdrop-blur-2xl
            border
            border-white/10
            rounded-3xl
            p-6
            md:p-8
            shadow-2xl
          ">

            {/* LOGIN / REGISTER TABS */}
            <div className="
              flex
              mb-8
              bg-black/25
              p-1.5
              rounded-2xl
            ">

              <button
                className={`
                  flex-1
                  py-3
                  rounded-xl
                  font-bold
                  transition-all
                  duration-300

                  ${
                    isLoginTab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300'
                  }
                `}
                onClick={() => setIsLoginTab(true)}
              >
                Login
              </button>

              <button
                className={`
                  flex-1
                  py-3
                  rounded-xl
                  font-bold
                  transition-all
                  duration-300

                  ${
                    !isLoginTab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300'
                  }
                `}
                onClick={() => setIsLoginTab(false)}
              >
                Register
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleAuth}
              className="space-y-4"
            >

              {/* NAME */}
              {!isLoginTab && (

                <div className="relative">

                  <User
                    className="
                      absolute
                      left-3
                      top-3.5
                      text-slate-300
                    "
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    className="
                      w-full
                      pl-10
                      p-3
                      bg-black/35
                      border
                      border-white/10
                      rounded-xl
                      text-white
                      outline-none
                      focus:border-blue-500
                    "
                  />

                </div>

              )}

              {/* EMAIL */}
              <div className="relative">

                <Mail
                  className="
                    absolute
                    left-3
                    top-3.5
                    text-slate-300
                  "
                  size={20}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="
                    w-full
                    pl-10
                    p-3
                    bg-black/35
                    border
                    border-white/10
                    rounded-xl
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                />

              </div>

              {/* PASSWORD */}
              <div className="relative">

                <Lock
                  className="
                    absolute
                    left-3
                    top-3.5
                    text-slate-300
                  "
                  size={20}
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="
                    w-full
                    pl-10
                    pr-10
                    p-3
                    bg-black/35
                    border
                    border-white/10
                    rounded-xl
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-3
                    top-3.5
                    text-slate-300
                  "
                >

                  {showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                  }

                </button>

              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-500
                  py-3
                  rounded-xl
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  shadow-lg
                "
              >
                Submit
              </button>

            </form>

            {/* MESSAGE */}
            {message && (

              <p className="
                mt-4
                text-center
                text-sm
                text-blue-300
              ">
                {message}
              </p>

            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default App;
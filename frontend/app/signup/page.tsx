'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';

export default function SignupPage() {
   const { signup, googleLogin } = useAuth();
   const [isVisible, setIsVisible] = useState(false);

   // Form state
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const googleAuth = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
         setError('');
         setLoading(true);
         try {
            await googleLogin(tokenResponse.access_token);
            window.location.href = '/'; // redirect on success
         } catch (err: any) {
            setError(err.message || 'Google authentication failed');
         } finally {
            setLoading(false);
         }
      },
      onError: () => {
         setError('Google login was cancelled or failed.');
      }
   });

   const toggleVisibility = () => {
      setIsVisible((prevState) => !prevState);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
         await signup({ name, email, password });
         window.location.href = '/'; // redirect on success
      } catch (err: any) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <main className="md:min-h-screen flex items-center justify-center py-24 px-4 md:px-8 bg-black">
         {/* Background ambient glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5236FF]/10 rounded-full blur-[120px] pointer-events-none" />

         <div className="w-full max-w-5xl bg-[#0A0A0A] shadow-[0_0_40px_rgba(82,54,255,0.05)] rounded-2xl overflow-hidden border border-white/10 relative z-10">
            <div className="grid items-center w-full md:grid-cols-2">
               
               {/* Left Side: Graphic / Branding */}
               <div className="md:aspect-[8/10] relative bg-[#0A0A0A] overflow-hidden w-full h-full hidden md:block">
                  <Image
                     src="/auth-image.png"
                     alt="DockShark Professionals"
                     fill
                     className="object-cover opacity-60 mix-blend-luminosity"
                     priority
                  />
                  {/* Sleek Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex items-end justify-center p-12 pb-16">
                     <div className="text-center relative z-10 w-full">
                        <div className="flex justify-center items-center mb-6">
                           <span className="text-4xl tracking-tight">
                              <span className="font-extrabold text-white">Dock</span>
                              <span className="font-light text-white">Shark</span>
                           </span>
                        </div>
                        <h2 className="text-white text-3xl font-medium mb-4">Start Securing Documents</h2>
                        <p className="text-gray-400 text-base font-light leading-relaxed max-w-sm mx-auto">
                           Join leading enterprises utilizing zero-knowledge proofs and client-side hashing for immutable document verification.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Right Side: Signup Form */}
               <div className="py-12 px-6 lg:px-12 w-full max-w-md mx-auto">
                  <h1 className="text-white text-3xl font-medium mb-8">
                     Create an Account
                  </h1>

                  {error && (
                     <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                        {error}
                     </div>
                  )}

                  <form className="space-y-5" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="name" className="mb-2 text-gray-300 font-medium text-sm inline-block">
                           Full Name
                        </label>
                        <input 
                           type="text" 
                           id="name" 
                           name="name" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="John Doe" 
                           required
                           className="px-4 py-3 text-sm text-white rounded-xl bg-[#111111] border border-white/10 w-full focus:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#5236FF]/50 focus:border-[#5236FF] transition-all placeholder:text-gray-600" 
                        />
                     </div>

                     <div>
                        <label htmlFor="email" className="mb-2 text-gray-300 font-medium text-sm inline-block">
                           Email Address
                        </label>
                        <input 
                           type="email" 
                           id="email" 
                           name="email" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="john@example.com" 
                           required
                           className="px-4 py-3 text-sm text-white rounded-xl bg-[#111111] border border-white/10 w-full focus:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#5236FF]/50 focus:border-[#5236FF] transition-all placeholder:text-gray-600" 
                        />
                     </div>
                     
                     <div className="relative">
                        <label htmlFor="password" className="mb-2 text-gray-300 font-medium text-sm inline-block">
                           Password
                        </label>
                        <button
                           type="button"
                           onClick={toggleVisibility}
                           className="absolute top-[38px] right-3 p-1 flex cursor-pointer focus:outline-none group"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-gray-500 group-hover:fill-gray-300 transition-colors" viewBox="0 0 128 128">
                              <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                              {!isVisible && (
                                 <path d="M15 15l98 98" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="stroke-gray-500 group-hover:stroke-gray-300 transition-colors" />
                              )}
                           </svg>
                        </button>
                        <input
                           type={isVisible ? "text" : "password"}
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="••••••••"
                           required
                           className="px-4 py-3 text-sm text-white rounded-xl bg-[#111111] border border-white/10 w-full focus:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#5236FF]/50 focus:border-[#5236FF] transition-all placeholder:text-gray-600" 
                        />
                     </div>

                     <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 px-4 text-sm rounded-xl font-semibold text-black bg-white hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] mt-4 disabled:opacity-70"
                     >
                        {loading ? 'Creating Account...' : 'Create Account'}
                     </button>
                  </form>

                  <div className="my-8 flex items-center gap-4">
                     <hr className="w-full border-white/10" />
                     <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">or</p>
                     <hr className="w-full border-white/10" />
                  </div>

                  <button 
                     onClick={() => googleAuth()} 
                     disabled={loading}
                     className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm rounded-xl font-medium text-white border border-white/10 bg-[#111111] hover:bg-white/5 transition-all disabled:opacity-70"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512">
                        <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"/>
                        <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"/>
                        <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"/>
                        <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"/>
                        <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"/>
                        <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"/>
                     </svg>
                     Sign up with Google
                  </button>

                  <div className="mt-8 text-gray-500 text-sm text-center font-light">
                     Already have an account? 
                     <Link href="/login" className="text-white hover:text-gray-300 ml-2 font-medium transition-colors border-b border-transparent hover:border-white">
                        Sign in
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}

'use client';

import { LoginDto } from '@/ds/login.dto';
import {login, savedLoggedInUser, setLoggedInUserRole, storeToken} from '@/service/AuthService';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Load remembered credentials
    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const loginDto: LoginDto = { username, password };

        login(loginDto)
            .then((res) => {
                const token = `Basic ${window.btoa(`${username}:${password}`)}`;
                storeToken(token);
                savedLoggedInUser(username);
                setLoggedInUserRole(res.data);
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedUsername');
                    localStorage.removeItem('rememberedPassword');
                }

                // Trigger authChange event
                const event = new CustomEvent('authChange', { detail: { isLoggedIn: true } });
                window.dispatchEvent(event);

                router.push('/posts');
                router.refresh();
            })
            .catch((error) => console.error('Login failed:', error));
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                {/* Left side */}
                <div className="flex flex-col justify-center p-8 md:p-14">
                    <span className="mb-3 text-4xl font-bold">Welcome back</span>
                    <span className="font-light text-gray-400 mb-8">
                        Welcome back! Please enter your details
                    </span>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                required
                            />
                        </div>
                        {/* Password Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                required
                            />
                        </div>
                        {/* Forgot Password */}
                        <div className="flex justify-between w-full py-4 text-sm">
                                <Link href="/forgotpassword" className="text-sm text-blue-500 hover:underline">
                                    Forgot Password?
                                </Link>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Sign in
                        </button>
                    </form>
                    <div className="text-center text-gray-400">
                        Don’t have an account?{' '}
                        <a href="/register" className="font-bold text-black">
                            Sign up for free
                        </a>
                    </div>
                </div>
                {/* Right side */}
                <div className="relative">
                    <img
                        src="/image.jpg"
                        alt="Decorative"
                        className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                    />
                    {/* Text on Image */}
                    <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
                        <span className="text-white text-xl">
                            We’ve been using Untitled to kick-start every new project and can’t
                            imagine working without it.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
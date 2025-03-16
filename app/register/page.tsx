'use client';

import { useRouter } from 'next/navigation';
import { register } from '@/service/AuthService';
import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<string>('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [errorStudentNumber, setErrorStudentNumber] = useState('');
    const [errorUserName,setErrorUserName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const registerDto = {
            name,
            username,
            password,
            studentNumber,
            year,
            semester,
            profileImage: userProfile
        };

        register(registerDto)
            .then(() => {
                router.push('/login');
                router.refresh();
            })
            .catch((error) => {
                let msg = error.response.data;
                let errorMessage = msg.match(/"([^"]+)"/)?.[1];
               if(errorMessage ===  'Student number is already taken!'){
                   setErrorStudentNumber(errorMessage);
                   setErrorUserName('');
               }
               else{
                   setErrorUserName(errorMessage)
                   setErrorStudentNumber('');
               }
            });
    };

    const inputClass = "w-full p-2 border rounded-md placeholder:font-light placeholder:text-gray-500";
    const errorClass = "border-red-500";



    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                {/* Left side */}
                <div className="flex flex-col justify-center p-8 md:p-14">
                    <span className="mb-3 text-4xl font-bold">Create an account</span>
                    <span className="font-light text-gray-400 mb-8">
                        Please fill in the details to create your account
                    </span>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className={`${inputClass}  'border-gray-300'}`}
                                required
                            />
                        </div>
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
                                placeholder="Choose a username"
                                className={`${inputClass} ${errorUserName ? errorClass : 'border-gray-300'}`}
                                required
                            />
                            {
                                errorUserName && <span className="text-red-500 text-xs">{errorUserName}</span>
                            }
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
                                placeholder="Create a password"
                                className={`${inputClass} 'border-gray-300'}`}
                                required
                            />
                        </div>
                        {/* Student Number Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="studentNumber">
                                Student Number
                            </label>
                            <input
                                type="text"
                                id="studentNumber"
                                value={studentNumber}
                                onChange={(e) => {
                                    // Convert to uppercase and remove invalid characters
                                    const value = e.target.value.toUpperCase().replace(/[^0-9TNT-]/g, '');

                                    // Auto-format TNT- prefix
                                    let formattedValue = value;
                                    if (!value.startsWith('TNT-')) {
                                        formattedValue = 'TNT-' + value.replace(/^TNT-/, '');
                                    }

                                    // Limit to 4 digits after TNT-
                                    const parts = formattedValue.split('-');
                                    if (parts.length > 1) {
                                        const numbers = parts[1].replace(/\D/g, '').substring(0, 4);
                                        formattedValue = `TNT-${numbers}`;
                                    }

                                    setStudentNumber(formattedValue);

                                    // Validate format
                                    const isValid = /^TNT-\d{4}$/.test(formattedValue);
                                    if (!isValid) {
                                        setErrorStudentNumber('Student number must be in the format TNT- followed by 4 digits (e.g., TNT-0001)');
                                    } else {
                                        setErrorStudentNumber('');
                                    }
                                }}
                                placeholder="TNT-0000"
                                className={`${inputClass} ${errorStudentNumber ? errorClass : 'border-gray-300'}`}
                                required
                                maxLength={8} // TNT- + 4 digits
                            />
                            {
                                errorStudentNumber && <span className="text-red-500 text-xs">{errorStudentNumber}</span>
                            }
                        </div>
                        {/* Profile Image Selection */}
                        <div className="space-y-4">
                            <div className="text-center">
                                <label className="text-lg font-semibold text-gray-700 mb-4 inline-block">
                                    🎭 Choose Your Avatar
                                </label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Select an avatar that represents you in our community
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-6 px-4">
                                {['duke1.jpg', 'duke2.jpg', 'duke3.jpg'].map((image) => (
                                    <div
                                        key={image}
                                        className={`relative group cursor-pointer transition-all duration-300 ${
                                            userProfile === image
                                                ? 'scale-110 ring-4 ring-[#52681D] ring-offset-2'
                                                : 'hover:scale-105 hover:ring-2 hover:ring-gray-200'
                                        } rounded-full p-1`}
                                        onClick={() => setUserProfile(image)}
                                    >
                                        <div
                                            className="aspect-square overflow-hidden rounded-full border-4 border-white shadow-lg">
                                            <Image
                                                src={`/${image}`}
                                                alt={`Avatar ${image}`}
                                                width={120}
                                                height={120}
                                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Selection Checkmark */}
                                        {userProfile === image && (
                                            <div
                                                className="absolute top-0 right-0 bg-[#52681D] rounded-full p-1 transform -translate-y-1/4 shadow-md">
                                                <svg
                                                    className="w-5 h-5 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Hover Effect */}
                                        <div
                                            className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Year Field */}
                        <div>
                            <label className="mb-2 text-md block" htmlFor="year">
                                Year
                            </label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className={`${inputClass} 'border-gray-300'}`}
                                required
                            >
                                <option value="" disabled>
                                    Select Year
                                </option>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                                <option value="5">Year 5</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 text-md block" htmlFor="semester">
                                Semester
                            </label>
                            <select
                                id="semester"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className={`${inputClass}  'border-gray-300'}`}
                                required
                            >
                                <option value="" disabled>
                                    Select Semester
                                </option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
                        >
                            Register
                        </button>
                    </form>
                    <div className="text-center text-gray-400">
                        Already have an account?{' '}
                        <a href="/login" className="font-bold text-black">
                            Log in
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
                    <div
                        className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
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
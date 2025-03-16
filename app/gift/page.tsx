'use client';

import React, { useEffect, useState } from "react";
import { getLoggedInUser, isUserLoggedIn } from "@/service/AuthService";
import { redirect } from "next/navigation";
import { UserDto } from "@/ds/userprofile.dto";
import { getAllUserProfiles } from "@/service/StudentPortalService";
import Image from "next/image";
import { GiCottonFlower, GiRose } from "react-icons/gi";
import {FaCheck, FaSpinner} from "react-icons/fa";
import { giveRoseGift } from "@/service/RoseGiftService";
import { AnimatePresence, motion } from "framer-motion";

export default function Gift() {
    const [allUsers, setAllUsers] = useState<UserDto[]>([]);
    const [filteredStudent, setFilteredStudent] = useState<UserDto[]>([]);
    const [flowerCount, setFlowerCount] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [zeroQuantityNotice, setZeroQuantityNotice] = useState(false);

    const currentUsername = getLoggedInUser();

    function getAllUsers() {
        getAllUserProfiles()
            .then((res) => {
                setAllUsers(res.data);
                // Exclude the current logged-in user from the gift list
                const others = res.data.filter(
                    (user: UserDto) =>
                        user.username.toLowerCase() !== currentUsername.toLowerCase()
                );
                setFilteredStudent(others);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        if (!isUserLoggedIn()) {
            redirect("/login");
        }
        getAllUsers();
    }, []);

    const searchNameFilterHandler = (name: string) => {
        // Filter the already filtered list (without the current user)
        const filtered = allUsers
            .filter(
                (user: UserDto) =>
                    user.username.toLowerCase() !== currentUsername.toLowerCase()
            )
            .filter((user: UserDto) =>
                user.username.toLowerCase().includes(name.toLowerCase())
            );
        setFilteredStudent(filtered);
    };

    const increaseFlowerCount = (username: string) => {
        setLoading((prev) => ({ ...prev, [username]: true }));
        setTimeout(() => {
            setFlowerCount((prev) => ({
                ...prev,
                [username]: (prev[username] || 0) + 1,
            }));
            setLoading((prev) => ({ ...prev, [username]: false }));
        }, 1000);
    };

    const resetFlowerCount = (username: string) => {
        setFlowerCount((prev) => ({ ...prev, [username]: 0 }));
    };

    const sendRoseGiftForUser = async (targetUsername: string) => {
        const sender = currentUsername;
        const giftCount = flowerCount[targetUsername] || 0;
        return giveRoseGift(sender, targetUsername, giftCount)
            .then((res) => {
                getAllUsers();
                return res;
            })
            .catch((err) => console.log(err));
    };

    const handleConfirmSend = () => {
        if (!selectedUser) return;
        sendRoseGiftForUser(selectedUser).then(() => {
            // Reset the gift counter for the selected user after success.
            setFlowerCount((prev) => ({ ...prev, [selectedUser]: 0 }));
            setIsSuccess(true);
            setTimeout(() => {
                setShowConfirmation(false);
                setIsSuccess(false);
                setSelectedUser(null);
            }, 2000);
        });
    };

    // Find the current user's profile to show how many roses they have.
    const currentUserProfile = allUsers.find(
        (user) =>
            user.username.toLowerCase() === currentUsername.toLowerCase()
    );

    return (
        <div className="min-h-screen py-8" style={{backgroundColor: '#f6f8f6'}}>
            {/* Floating Rose Petals Background - Add pointer-events-none */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-200"
                        initial={{y: -100, x: Math.random() * 100}}
                        animate={{
                            y: [0, 1000],
                            x: Math.random() * 100,
                            rotate: Math.random() * 360,
                        }}
                        transition={{
                            duration: 5 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            fontSize: `${10 + Math.random() * 20}px`,
                        }}
                    >
                        ✿
                    </motion.div>
                ))}
            </div>

            {/* Header Section */}
            <header className="relative mb-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="bg-gradient-to-r from-rose-300 to-pink-400 p-8 rounded-3xl shadow-2xl"
                    >
                        <h1 className="text-4xl font-bold text-white mb-4 text-center">
                            🌹 Spread Love with Roses
                        </h1>

                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                onChange={(e) => searchNameFilterHandler(e.target.value)}
                                placeholder="Search friends..."
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <svg
                                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>

                        {currentUserProfile && (
                            <motion.div
                                className="mt-6 bg-rose-100/30 backdrop-blur-sm p-4 rounded-2xl text-center mx-auto max-w-xs"
                                initial={{scale: 0.9}}
                                animate={{scale: 1}}
                            >
                                <p className="text-lg font-semibold text-rose-800">
                                    Your Rose Bank:{" "}
                                    <span className="text-2xl text-rose-600">
                                    {currentUserProfile.roseCount}
                                </span>
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </header>

            {/* User Grid - Updated Colors */}
            <div className="container mx-auto px-4">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                >
                    <AnimatePresence>
                        {filteredStudent.map((user: UserDto) => (
                            <motion.div
                                key={user.username}
                                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="relative">
                                            <Image
                                                src={`/${user.profileImage}`}
                                                alt={user.username}
                                                width={64}
                                                height={64}
                                                className="rounded-full border-4 border-rose-50"
                                                unoptimized
                                            />
                                            <div className="absolute -bottom-2 -right-2 bg-rose-500 p-1.5 rounded-full">
                                                <GiRose className="text-white text-sm"/>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 capitalize">
                                                {user.username}
                                            </h3>
                                            <p className="flex items-center text-rose-700">
                                            <span className="font-semibold">
                                                {user.roseCount}
                                            </span>
                                                <GiRose className="ml-1"/>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => increaseFlowerCount(user.username)}
                                                disabled={loading[user.username]}
                                                className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 hover:from-rose-400 hover:to-pink-500 text-white shadow-lg transition-all"
                                            >
                                                {loading[user.username] ? (
                                                    <FaSpinner className="animate-spin"/>
                                                ) : (
                                                    <GiCottonFlower className="text-xl"/>
                                                )}
                                            </button>
                                            <div className="text-2xl font-bold text-gray-700">
                                                {flowerCount[user.username] || 0}
                                            </div>
                                            <button
                                                onClick={() => resetFlowerCount(user.username)}
                                                className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                                            >
                                                ↺
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if ((flowerCount[user.username] || 0) === 0) {
                                                    setZeroQuantityNotice(true);
                                                    setTimeout(() => setZeroQuantityNotice(false), 2000);
                                                    return;
                                                }
                                                setSelectedUser(user.username);
                                                setShowConfirmation(true);
                                            }}
                                            className="px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
            {/* Confirmation Modal */}
            {/* Confirmation Modal - Updated Colors */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            {isSuccess ? (
                                <div className="text-center space-y-4">
                                    <div className="inline-flex bg-rose-100 p-4 rounded-full">
                                        <FaCheck className="text-4xl text-rose-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Gift Sent!</h2>
                                    <p className="text-gray-600">
                                        Your roses are on their way 🌹
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                                        Confirm Gift
                                    </h2>
                                    <div className="text-center">
                                        <p className="text-lg text-gray-600">
                                            Send{' '}
                                            <span className="text-2xl font-bold text-rose-600">
                                                {flowerCount[selectedUser!] || 0}
                                            </span>{' '}
                                            roses to{' '}
                                            <span className="font-semibold text-green-700">
                                                {selectedUser}
                                            </span>?
                                        </p>
                                    </div>
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={() => {
                                                setShowConfirmation(false);
                                                setSelectedUser(null);
                                            }}
                                            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmSend}
                                            className="px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full font-semibold hover:shadow-md transition-shadow"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zero Quantity Notice */}
            <AnimatePresence>
                {zeroQuantityNotice && (
                    <motion.div
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-rose-100 text-rose-700 px-6 py-3 rounded-full shadow-lg"
                    >
                        <GiRose className="text-rose-500" />
                        <span>Please add at least 1 rose to send!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from "react";
import { getLoggedInUser, isUserLoggedIn } from "@/service/AuthService";
import { redirect } from "next/navigation";
import Image from "next/image";
import { GiCottonFlower, GiPlantWatering, GiGreenhouse } from "react-icons/gi";
import { FaCheck, FaSpinner, FaPlus, FaLeaf } from "react-icons/fa";
import { createIdea, deleteIdea, updateIdea, giveRosesToIdea, getAllIdeas } from "@/service/IdeaService";
import { Idea } from "@/ds/idea.dto";
import { AnimatePresence, motion } from "framer-motion";

export default function IdeasComponent() {
    // Ideas and form state
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [newIdea, setNewIdea] = useState({ title: "", description: "", sdgs: [] as number[] });
    const [editingIdeaId, setEditingIdeaId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState({ title: "", description: "", sdgs: [] as number[] });
    const [roseCount, setRoseCount] = useState<{ [key: number]: number }>({});
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
    const [selectedIdeaForGift, setSelectedIdeaForGift] = useState<number | null>(null);
    const [giftSuccess, setGiftSuccess] = useState(false);

    // Modal state for creating and editing
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showGiftConfirmation, setShowGiftConfirmation] = useState(false);

    const currentUsername = getLoggedInUser();

    useEffect(() => {
        if (!isUserLoggedIn()) {
            redirect("/login");
        }
        fetchIdeas();
    }, []);

    const fetchIdeas = () => {
        getAllIdeas()
            .then((res) => setIdeas(res.data))
            .catch((err) => console.error(err));
    };

    // Create a new idea
    const handleCreateIdea = () => {
        if (!newIdea.title.trim() || !newIdea.description.trim()) return;
        const ideaToCreate = {
            username: currentUsername,
            title: newIdea.title,
            description: newIdea.description,
            createdAt: new Date().toISOString(),
            sdgs: newIdea.sdgs,
        };
        createIdea(ideaToCreate)
            .then(() => {
                setNewIdea({ title: "", description: "", sdgs: [] });
                fetchIdeas();
                setShowCreateForm(false);
            })
            .catch((err) => console.error(err));
    };

    // Edit an existing idea
    const handleEditIdea = () => {
        if (editingIdeaId === null) return;
        const updatedData = {
            username: currentUsername,
            title: editingContent.title,
            description: editingContent.description,
            sdgs: editingContent.sdgs,
        };
        updateIdea(editingIdeaId, updatedData)
            .then(() => {
                setEditingIdeaId(null);
                setEditingContent({ title: "", description: "", sdgs: [] });
                fetchIdeas();
                setShowEditForm(false);
            })
            .catch((err) => console.error(err));
    };

    const handleDeleteIdea = (ideaId: number) => {
        deleteIdea(ideaId, currentUsername)
            .then(() => fetchIdeas())
            .catch((err) => console.error(err));
    };

    const increaseRoseCount = (ideaId: number) => {
        setLoading((prev) => ({ ...prev, [ideaId]: true }));
        setTimeout(() => {
            setRoseCount((prev) => ({ ...prev, [ideaId]: (prev[ideaId] || 0) + 1 }));
            setLoading((prev) => ({ ...prev, [ideaId]: false }));
        }, 500);
    };

    const resetRoseCount = (ideaId: number) => {
        setRoseCount((prev) => ({ ...prev, [ideaId]: 0 }));
    };

    // For sending support (gifting roses)
    const handleGiveRoses = (ideaId: number, ideaOwner?: string) => {
        if (ideaOwner?.toLowerCase() === currentUsername.toLowerCase()) return;
        if ((roseCount[ideaId] || 0) === 0) return;
        setSelectedIdeaForGift(ideaId);
        setShowGiftConfirmation(true);
    };

    const confirmGiveRoses = () => {
        if (selectedIdeaForGift === null) return;
        const roses = roseCount[selectedIdeaForGift] || 0;
        giveRosesToIdea(selectedIdeaForGift, currentUsername, roses)
            .then((res) => {
                // Check for insufficient balance message from the API response
                if (typeof res.data === "string" && res.data.includes("Insufficient rose balance")) {
                    alert("Insufficient rose balance");
                    setShowGiftConfirmation(false);
                    setSelectedIdeaForGift(null);
                    return;
                }
                setRoseCount((prev) => ({ ...prev, [selectedIdeaForGift]: 0 }));
                setGiftSuccess(true);
                setTimeout(() => {
                    setShowGiftConfirmation(false);
                    setGiftSuccess(false);
                    setSelectedIdeaForGift(null);
                    fetchIdeas();
                }, 2000);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="min-h-screen bg-[#f6f8f6]">
            <div className="relative pt-20 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-8"
                    >
                        <GiGreenhouse className="text-6xl text-emerald-600 mb-4 mx-auto animate-pulse" />
                        <h1 className="text-5xl font-bold mb-4 text-emerald-800 font-serif">
                            Community Garden
                        </h1>
                        <p className="text-xl text-emerald-600 mb-8 max-w-2xl mx-auto">
                            Cultivate ideas, grow innovation, and nurture community wisdom
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Floating Add Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCreateForm(true)}
                className="fixed bottom-8 right-8 z-40 p-5 bg-emerald-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
                style={{ boxShadow: "0 4px 24px rgba(16, 185, 129, 0.3)" }}
            >
                <FaPlus className="text-2xl" />
            </motion.button>

            {/* Create Idea Modal */}
            <AnimatePresence>
                {showCreateForm && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-8 rounded-2xl w-full max-w-md relative border-2 border-emerald-50 shadow-lg"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                        >
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800 transition-colors"
                            >
                                <FaLeaf className="text-xl" />
                            </button>
                            <h2 className="text-3xl font-bold mb-6 text-center text-emerald-800 flex items-center justify-center gap-2">
                                <GiPlantWatering className="text-emerald-600" />
                                Plant New Seed
                            </h2>
                            <div className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Idea title..."
                                        value={newIdea.title}
                                        onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                                        className="w-full p-3 border-2 border-emerald-100 rounded-lg focus:border-emerald-400 focus:ring-0 transition-all placeholder-emerald-300"
                                    />
                                </div>
                                <div className="relative">
                  <textarea
                      placeholder="Describe your idea..."
                      value={newIdea.description}
                      onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                      className="w-full p-3 border-2 border-emerald-100 rounded-lg focus:border-emerald-400 focus:ring-0 transition-all h-32 placeholder-emerald-300"
                  />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-emerald-700">Related SDGs</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({ length: 17 }, (_, i) => i + 1).map((sdg) => (
                                            <motion.button
                                                key={sdg}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => {
                                                    const updated = newIdea.sdgs.includes(sdg)
                                                        ? newIdea.sdgs.filter((n) => n !== sdg)
                                                        : [...newIdea.sdgs, sdg];
                                                    setNewIdea({ ...newIdea, sdgs: updated });
                                                }}
                                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                                    newIdea.sdgs.includes(sdg)
                                                        ? "bg-emerald-500 text-white shadow-inner"
                                                        : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                }`}
                                            >
                                                {sdg}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreateIdea}
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <FaLeaf className="text-lg" />
                                    Plant Idea Seed
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit (Prune) Idea Modal */}
            <AnimatePresence>
                {showEditForm && editingIdeaId !== null && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-8 rounded-2xl w-full max-w-md relative border-2 border-emerald-50 shadow-lg"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                        >
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800 transition-colors"
                            >
                                <FaLeaf className="text-xl" />
                            </button>
                            <h2 className="text-3xl font-bold mb-6 text-center text-emerald-800 flex items-center justify-center gap-2">
                                <GiPlantWatering className="text-emerald-600" />
                                Prune Idea
                            </h2>
                            <div className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Idea title..."
                                        value={editingContent.title}
                                        onChange={(e) =>
                                            setEditingContent({ ...editingContent, title: e.target.value })
                                        }
                                        className="w-full p-3 border-2 border-emerald-100 rounded-lg focus:border-emerald-400 focus:ring-0 transition-all placeholder-emerald-300"
                                    />
                                </div>
                                <div className="relative">
                  <textarea
                      placeholder="Describe your idea..."
                      value={editingContent.description}
                      onChange={(e) =>
                          setEditingContent({ ...editingContent, description: e.target.value })
                      }
                      className="w-full p-3 border-2 border-emerald-100 rounded-lg focus:border-emerald-400 focus:ring-0 transition-all h-32 placeholder-emerald-300"
                  />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-emerald-700">Related SDGs</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({ length: 17 }, (_, i) => i + 1).map((sdg) => (
                                            <motion.button
                                                key={sdg}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => {
                                                    const updated = editingContent.sdgs.includes(sdg)
                                                        ? editingContent.sdgs.filter((n) => n !== sdg)
                                                        : [...editingContent.sdgs, sdg];
                                                    setEditingContent({ ...editingContent, sdgs: updated });
                                                }}
                                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                                    editingContent.sdgs.includes(sdg)
                                                        ? "bg-emerald-500 text-white shadow-inner"
                                                        : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                                }`}
                                            >
                                                {sdg}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleEditIdea}
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <FaLeaf className="text-lg" />
                                    Save Changes
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ideas Grid */}
            <div className="container mx-auto px-4 py-12">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                >
                    <AnimatePresence>
                        {ideas.map((idea) => (
                            <motion.div
                                key={idea.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                whileHover={{ y: -5 }}
                                className="bg-white/95 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-emerald-50 relative group"
                            >
                                {/* Growth Progress */}
                                <div className="absolute top-0 left-0 h-1 bg-emerald-100 w-full rounded-t">
                                    <motion.div
                                        className="h-full bg-emerald-400 rounded-t"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((idea.roseCount || 0) * 10, 100)}%` }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </div>

                                {/* Profile Header */}
                                <div className="flex items-center mb-6 pb-4 border-b border-emerald-50">
                                    <div className="relative h-14 w-14">
                                        <Image
                                            src={`/${idea.profileImage || "default.png"}`}
                                            alt="Profile"
                                            fill
                                            className="rounded-2xl object-cover border-2 border-emerald-100"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/default.png";
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-bold text-emerald-800">
                                            {idea.ideaOwner ?? "Anonymous Gardener"}
                                        </h3>
                                        <p className="text-xs text-emerald-500">
                                            Planted {new Date(idea.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Idea Content */}
                                {editingIdeaId === idea.id ? null : (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold text-emerald-800">{idea.title}</h2>
                                        <p className="text-emerald-700 leading-relaxed">{idea.description}</p>
                                    </div>
                                )}

                                {/* Interactive Elements */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            whileTap={{scale: 0.95}}
                                            onClick={() => increaseRoseCount(idea.id!)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                                            disabled={loading[idea.id!]}
                                        >
                                            {loading[idea.id!] ? <FaSpinner className="animate-spin"/> :
                                                <GiPlantWatering className="text-lg"/>}
                                            <span className="font-medium">{roseCount[idea.id!] || 0}</span>
                                        </motion.button>
                                        {/* Reset Rose Count Button */}
                                        {roseCount[idea.id!] > 0 && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => resetRoseCount(idea.id!)}
                                                className="p-1.5 text-emerald-400 hover:text-emerald-600 transition-colors"
                                                title="Reset nutrients"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </motion.button> )}
                                        <div className="flex gap-1">
                                            {idea.sdgs?.map((sdg) => (
                                                <span
                                                    key={sdg}
                                                    className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-600"
                                                >
                          SDG {sdg}
                        </span>
                                            ))}
                                        </div>
                                    </div>


                                    <div className="text-emerald-600 text-sm flex items-center gap-1">
                                        <FaLeaf/>
                                        <span>{idea.roseCount || 0}</span>
                                    </div>
                                </div>

                                {/* Actions for Owner */}
                                {idea.ideaOwner?.toLowerCase() === currentUsername.toLowerCase() && (
                                    <div className="mt-4 flex gap-2 border-t border-emerald-50 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                                            onClick={() => {
                                                setEditingIdeaId(idea.id!);
                                                setEditingContent({
                                                    title: idea.title,
                                                    description: idea.description,
                                                    sdgs: idea.sdgs || [],
                                                });
                                                setShowEditForm(true);
                                            }}
                                        >
                                            Prune
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            onClick={() => handleDeleteIdea(idea.id!)}
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                )}

                                {/* Support Idea (for non-owners) */}
                                {idea.ideaOwner?.toLowerCase() !== currentUsername.toLowerCase() && (
                                    <div className="mt-4">
                                        <motion.button
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            onClick={() => handleGiveRoses(idea.id!, idea.ideaOwner)}
                                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                        >
                                            <GiPlantWatering className="text-lg"/>
                                            Nurture Idea
                                        </motion.button>
                                    </div>
                                )}

                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Gift Confirmation Modal */}
            <AnimatePresence>
                {showGiftConfirmation && selectedIdeaForGift !== null && (
                    <motion.div
                        className="fixed inset-0 bg-emerald-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg border border-emerald-100 relative"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="p-2 bg-emerald-100 rounded-full">
                                    <GiPlantWatering className="text-2xl text-emerald-600" />
                                </div>
                            </div>
                            <AnimatePresence mode="wait">
                                {giftSuccess ? (
                                    <motion.div
                                        className="text-center space-y-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="animate-bounce-in">
                                            <FaCheck className="text-4xl text-emerald-600 mb-4 mx-auto" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-emerald-800">Support Planted!</h2>
                                        <p className="text-emerald-600">Your nutrients are helping this idea grow 🌱</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="text-center space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h2 className="text-xl font-semibold text-emerald-800 flex items-center justify-center gap-2">
                                            <GiPlantWatering />
                                            Nurture Idea
                                        </h2>
                                        <p className="text-emerald-700">
                                            Send{" "}
                                            <span className="font-bold text-emerald-600">{roseCount[selectedIdeaForGift] || 0}</span>{" "}
                                            <span className="inline-block animate-pulse">🌱</span> to help this idea grow?
                                        </p>
                                        <div className="flex justify-center gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setShowGiftConfirmation(false);
                                                    setSelectedIdeaForGift(null);
                                                }}
                                                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={confirmGiveRoses}
                                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                                            >
                                                <FaLeaf className="text-sm" />
                                                Confirm Support
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

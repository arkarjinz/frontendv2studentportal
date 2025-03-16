'use client'
import React, { useState, useEffect } from 'react';
import { LostAndFoundDto } from '@/ds/lost.and.found.dto';
import { getAllLostAndFound, getStudentIdByStudent } from '@/service/StudentPortalService';
import { createLostAndFound, toggleLostAndFoundStatus } from "@/service/LostAndFoundService";
import { getLoggedInUser, getLoggedInUerRole } from "@/service/AuthService";

export default function LostAndFoundPage() {
    const [lostAndFound, setLostAndFound] = useState<LostAndFoundDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        isFound: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch lost and found items
    const fetchLostAndFound = async () => {
        try {
            const res = await getAllLostAndFound();
            setLostAndFound(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLostAndFound();
        const role = getLoggedInUerRole();
        setIsAdmin(role?.trim() === "ROLE_ADMIN");
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setNewItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            console.error("No file selected");
            return;
        }
        try {
            const studentName = getLoggedInUser();
            const response = await getStudentIdByStudent(studentName);
            const studentId = response.data.id;

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append("title", newItem.title);
            formData.append("description", newItem.description);
            formData.append("isFound", String(newItem.isFound));
            formData.append("image", selectedFile);

            // Create new lost and found item
            await createLostAndFound(formData, studentId);
            // Re-fetch items so the new item shows immediately
            fetchLostAndFound();
            // Close modal
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Admin function: toggle the isFound status
    const handleToggleStatus = async (itemId: number, currentStatus: boolean) => {
        try {
            // Optimistic UI update: update status locally
            setLostAndFound(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, isFound: !currentStatus } : item
                )
            );
            await toggleLostAndFoundStatus(itemId, !currentStatus);
        } catch (err) {
            console.error(err);
            // Optionally re-fetch items if an error occurs
            fetchLostAndFound();
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Lost &amp; Found Hub
            </span>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" />
                    </h1>
                    <p className="text-gray-600 text-lg mt-3">
                        Reuniting belongings with their owners through community power
                    </p>
                </div>

                {/* Floating Action Button for Reporting New Items */}
                <div className="fixed bottom-8 right-8 z-30">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 transform group-hover:rotate-90 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lostAndFound && lostAndFound.length > 0 ? (
                        lostAndFound.map(item => (
                            <div
                                key={item.id}
                                className="relative group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-transparent hover:border-teal-400"
                            >
                                {/* Image Section */}
                                <div className="h-64 w-full relative overflow-hidden">
                                    {item.imageBase64 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${item.imageBase64}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                            <svg
                                                className="h-20 w-20 text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                        <h2 className="text-xl font-bold text-white drop-shadow-md">
                                            {item.title}
                                        </h2>
                                    </div>
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                                            item.isFound
                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white'
                                                : 'bg-gradient-to-br from-rose-400 to-pink-600 text-white'
                                        }`}
                                    >
                    {item.isFound ? 'Found 🎉' : 'Missing 🔍'}
                  </span>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 bg-white">
                                    <p className="text-gray-700 mb-4 leading-relaxed">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center text-gray-600 text-sm">
                    <span className="flex items-center">
                      <svg
                          className="w-5 h-5 mr-2 text-teal-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-teal-700">
                        {item.studentName}
                      </span>
                    </span>
                                    </div>

                                    {/* Admin Toggle Button */}
                                    {isAdmin && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(item.id!, item.isFound)
                                                }
                                                className={`w-full py-2 rounded ${
                                                    item.isFound
                                                        ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white'
                                                        : 'bg-gradient-to-br from-rose-400 to-pink-600 text-white'
                                                }`}
                                            >
                                                {item.isFound ? 'Mark as Missing' : 'Mark as Found'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="max-w-md mx-auto">
                                <div className="mb-6 inline-block p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full">
                                    <svg
                                        className="h-20 w-20 text-teal-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                    No Items Found
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to report a lost or found item
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal for Creating New Lost & Found Report */}
                {isModalOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 border-t-4 border-teal-500">
                                {/* Modal Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <svg
                                            className="w-8 h-8 text-teal-600 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                            />
                                        </svg>
                                        New Report
                                    </h2>
                                </div>

                                {/* Modal Form */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newItem.title}
                                            onChange={handleInputChange}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={newItem.description}
                                            onChange={handleInputChange}
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Item Image
                                        </label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl hover:border-teal-400 transition-colors group">
                                            <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                                                <div className="text-center">
                                                    <svg
                                                        className="w-12 h-12 mx-auto text-gray-400 group-hover:text-teal-500 transition-colors"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-500 group-hover:text-teal-600">
                                                        {selectedFile ? selectedFile.name : 'Click to upload photo'}
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    onChange={handleFileChange}
                                                    className="opacity-0"
                                                    required
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    name="isFound"
                                                    checked={newItem.isFound}
                                                    onChange={handleInputChange}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
                                                        newItem.isFound ? 'bg-teal-500' : 'bg-gray-300'
                                                    }`}
                                                />
                                                <div
                                                    className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                                                        newItem.isFound ? 'translate-x-6' : ''
                                                    }`}
                                                />
                                            </div>
                                            <span className="ml-3 text-gray-700 font-medium">
                        Mark as found
                      </span>
                                        </label>
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2 text-white"
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
                                            Submit Report
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

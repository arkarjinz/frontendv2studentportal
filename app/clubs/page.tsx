'use client';
import React, { useEffect, useState } from "react";
import { ClubInfo } from "@/ds/clubinfo.dto";
import { StudentDto } from "@/ds/student.dto";
import {
    getClubInfo,
    getClubMembers,
    joinClub,
    quitClub,
    updateClub,
    deleteClub,
    createClub,
} from "@/service/ClubsService";
import { getLoggedInUerRole, getLoggedInUser, getLoggedInUserTnt } from "@/service/AuthService";

export default function Clubs() {
    const [clubs, setClubs] = useState<ClubInfo[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [createMode, setCreateMode] = useState(false);
    const [selectedClub, setSelectedClub] = useState<ClubInfo | null>(null);

    // Admin update states
    const [updateDescription, setUpdateDescription] = useState("");
    const [updateClubImage, setUpdateClubImage] = useState("");

    // Admin create states
    const [createClubName, setCreateClubName] = useState("");
    const [createDescription, setCreateDescription] = useState("");
    const [createClubImage, setCreateClubImage] = useState("");

    const [members, setMembers] = useState<StudentDto[]>([]);
    const [showMembers, setShowMembers] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [banMessage, setBanMessage] = useState("");

    // Determine logged-in user's role on mount
    useEffect(() => {
        const role = getLoggedInUerRole();
        setIsAdmin(role?.trim() === "ROLE_ADMIN");
    }, []);

    // Fetch clubs on mount
    useEffect(() => {
        fetchAllClubs();
    }, []);

    const fetchAllClubs = () => {
        getClubInfo()
            .then((res) => setClubs(res.data))
            .catch((err) => console.error(err));
    };

    // Open join modal and check membership status
    const openJoinModal = (club: ClubInfo) => {
        setSelectedClub(club);
        setModalIsOpen(true);
        setUpdateMode(false);
        setCreateMode(false);
        setBanMessage("");
        const username = getLoggedInUser();
        getClubMembers(club.clubName)
            .then((res) => {
                const clubMembers: StudentDto[] = res.data;
                const alreadyJoined = clubMembers.some((m) => m.username === username);
                setHasJoined(alreadyJoined);
            })
            .catch((err) => console.error(err));
    };

    // Open update modal (admin)
    const openUpdateModal = (club: ClubInfo) => {
        setSelectedClub(club);
        setUpdateDescription(club.description);
        setUpdateClubImage(club.clubImage);
        setModalIsOpen(true);
        setUpdateMode(true);
        setCreateMode(false);
    };

    // Open create modal (admin)
    const openCreateModal = () => {
        setSelectedClub(null);
        setCreateClubName("");
        setCreateDescription("");
        setCreateClubImage("");
        setModalIsOpen(true);
        setCreateMode(true);
        setUpdateMode(false);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedClub(null);
        setUpdateDescription("");
        setUpdateClubImage("");
        setCreateClubName("");
        setCreateDescription("");
        setCreateClubImage("");
        setShowMembers(false);
        setMembers([]);
        setHasJoined(false);
        setCreateMode(false);
        setUpdateMode(false);
        setBanMessage("");
    };

    // Join handler: display ban message if returned by backend
    const handleJoin = () => {
        if (selectedClub) {
            const username = getLoggedInUser();
            const studentTnt = getLoggedInUserTnt();
            joinClub(selectedClub.clubName, username, studentTnt)
                .then((res) => {
                    const message = res.data;
                    if (message.startsWith("You are banned")) {
                        alert(message);
                        setBanMessage(message);
                        setHasJoined(false);
                    } else if (message === "already joined") {
                        alert("You have already joined this club.");
                        setHasJoined(true);
                    } else {
                        alert("Joined successfully");
                        setHasJoined(true);
                        setBanMessage("");
                        fetchAllClubs();
                    }
                })
                .catch((err) => console.error(err));
        }
    };

    // Quit handler
    const handleQuit = () => {
        if (selectedClub) {
            const username = getLoggedInUser();
            quitClub(selectedClub.clubName, username)
                .then((res) => {
                    if (res.data === "not a member") {
                        alert("You are not a member of this club.");
                    } else {
                        alert("Quit club successfully");
                    }
                    setHasJoined(false);
                    fetchAllClubs();
                })
                .catch((err) => console.error(err));
        }
    };

    const handleUpdate = () => {
        if (selectedClub) {
            updateClub(selectedClub.clubName, updateDescription, updateClubImage)
                .then(() => {
                    alert("Club updated successfully");
                    closeModal();
                    fetchAllClubs();
                })
                .catch((err) => console.error(err));
        }
    };

    // Delete handler
    const handleDelete = (club: ClubInfo) => {
        if (confirm(`Are you sure you want to delete ${club.clubName}?`)) {
            deleteClub(club.clubName)
                .then(() => {
                    alert("Club deleted successfully");
                    fetchAllClubs();
                })
                .catch((err) => console.error(err));
        }
    };

    const handleCreate = () => {
        createClub(createClubName, createDescription, createClubImage)
            .then(() => {
                alert("Club created successfully");
                closeModal();
                fetchAllClubs();
            })
            .catch((err) => console.error(err));
    };

    const fetchMembers = () => {
        if (selectedClub) {
            getClubMembers(selectedClub.clubName)
                .then((res) => {
                    setMembers(res.data);
                    setShowMembers(true);
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                                University Clubs
                            </span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Discover and join student organizations
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={openCreateModal}
                            className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
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
                            Create Club
                        </button>
                    )}
                </div>

                {/* Clubs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <div
                            key={club.clubName}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border-l-4 border-transparent hover:border-teal-400"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={club.clubImage || "/defaultClub.png"}
                                    alt={club.clubName}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60">
                                    <h2 className="text-xl font-bold text-white">
                                        {club.clubName}
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    {club.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-teal-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM2 13a8 8 0 1116 0v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-medium">
                                            {club.studentCount}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openJoinModal(club)}
                                            className={`px-4 py-2 rounded-full transition-all ${
                                                hasJoined
                                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                    : "bg-teal-500 text-white hover:bg-teal-600"
                                            }`}
                                        >
                                            {hasJoined ? "Joined" : "Join"}
                                        </button>
                                        {isAdmin && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openUpdateModal(club)}
                                                    className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(club)}
                                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for Join/Update/Create */}
                {modalIsOpen && (
                    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 border-t-4 border-teal-500">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {createMode
                                            ? "Create New Club"
                                            : updateMode
                                                ? "Update Club"
                                                : selectedClub?.clubName}
                                    </h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {/* Display ban message if one exists */}
                                {banMessage && (
                                    <p className="mb-4 text-red-600 font-semibold">{banMessage}</p>
                                )}
                                {(createMode || updateMode) ? (
                                    <form className="space-y-4">
                                        {createMode && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Club Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={createClubName}
                                                    onChange={(e) => setCreateClubName(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {createMode ? "Description" : "New Description"}
                                            </label>
                                            <textarea
                                                value={createMode ? createDescription : updateDescription}
                                                onChange={(e) =>
                                                    createMode
                                                        ? setCreateDescription(e.target.value)
                                                        : setUpdateDescription(e.target.value)
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {createMode ? "Image URL" : "New Image URL"}
                                            </label>
                                            <input
                                                type="text"
                                                value={createMode ? createClubImage : updateClubImage}
                                                onChange={(e) =>
                                                    createMode
                                                        ? setCreateClubImage(e.target.value)
                                                        : setUpdateClubImage(e.target.value)
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 mt-6">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={createMode ? handleCreate : handleUpdate}
                                                className="px-6 py-2 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                                            >
                                                {createMode ? "Create Club" : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <p className="text-gray-600">{selectedClub?.description}</p>
                                            <div className="flex items-center text-teal-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM2 13a8 8 0 1116 0v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>{selectedClub?.studentCount} members</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={hasJoined ? handleQuit : handleJoin}
                                                className={`px-6 py-2 rounded-full transition-colors ${
                                                    hasJoined
                                                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                        : "bg-teal-500 text-white hover:bg-teal-600"
                                                }`}
                                            >
                                                {hasJoined ? "Quit Club" : "Join Club"}
                                            </button>
                                            <button
                                                onClick={fetchMembers}
                                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                            >
                                                View Members
                                            </button>
                                        </div>
                                        {showMembers && (
                                            <div className="pt-4 border-t border-gray-100">
                                                <h3 className="text-lg font-semibold mb-3">
                                                    Club Members
                                                </h3>
                                                <div className="space-y-3">
                                                    {members.map((member) => (
                                                        <div
                                                            key={member.id}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <img
                                                                src={member.profileImage || "/default.png"}
                                                                alt={member.username}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <p className="font-medium">{member.username}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {member.studentNumber}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

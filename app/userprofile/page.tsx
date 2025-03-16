'use client'

import { useEffect, useState } from "react";
import { UserDto } from "@/ds/userprofile.dto";
import { getAllUserProfiles } from "@/service/StudentPortalService";
import { getLoggedInUser } from "@/service/AuthService";

// Define a Note type so that each note has an id and text
type Note = {
    id: number;
    text: string;
};

export default function UserProfile() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState("");
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editingNoteText, setEditingNoteText] = useState("");

    const [goals, setGoals] = useState<{ id: number; text: string; completed: boolean }[]>([]);
    const [newGoal, setNewGoal] = useState("");
    const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
    const [editingGoalText, setEditingGoalText] = useState("");
    const [showTip, setShowTip] = useState<string | null>(null);

    // Coding book recommendations
    const codingBooks = [
        { title: "Clean Code: A Handbook of Agile Software Craftsmanship", cover: "📘" },
        { title: "Design Patterns: Elements of Reusable Object-Oriented Software", cover: "📚" },
        { title: "The Pragmatic Programmer: Your Journey To Mastery", cover: "📖" },
        { title: "Introduction to Algorithms (The MIT Press)", cover: "📕" },
        { title: "Structure and Interpretation of Computer Programs", cover: "📗" },
        { title: "You Don't Know JS Yet: Get Started", cover: "📓" },
    ];

    // Load saved notes and goals, and update the clock every second
    useEffect(() => {
        const savedNotes = localStorage.getItem("userNotes");
        if (savedNotes) setNotes(JSON.parse(savedNotes));

        const savedGoals = localStorage.getItem("userGoals");
        if (savedGoals) setGoals(JSON.parse(savedGoals));

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch the logged-in user's profile
    useEffect(() => {
        const loggedInUsername = getLoggedInUser();
        if (!loggedInUsername) return;

        getAllUserProfiles()
            .then(res => {
                const loggedInUserProfile = res.data.find(
                    (profile: UserDto) => profile.username === loggedInUsername
                ) || null;
                setUser(loggedInUserProfile);
            })
            .catch(e => console.error(e));
    }, []);

    // Notes handlers
    const handleSaveNote = () => {
        if (newNote.trim()) {
            const note: Note = { id: Date.now(), text: newNote.trim() };
            const updatedNotes = [...notes, note];
            setNotes(updatedNotes);
            localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
            setNewNote("");
        }
    };

    const handleDeleteNote = (noteId: number) => {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
        if (editingNoteId === noteId) {
            setEditingNoteId(null);
            setEditingNoteText("");
        }
    };

    const handleEditNote = (note: Note) => {
        setEditingNoteId(note.id);
        setEditingNoteText(note.text);
    };

    const handleSaveEditedNote = (noteId: number) => {
        const updatedNotes = notes.map(note =>
            note.id === noteId ? { ...note, text: editingNoteText } : note
        );
        setNotes(updatedNotes);
        localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
        setEditingNoteId(null);
        setEditingNoteText("");
    };

    const handleCancelEditNote = () => {
        setEditingNoteId(null);
        setEditingNoteText("");
    };

    // Goals handlers
    const handleAddGoal = () => {
        if (newGoal.trim()) {
            const updatedGoals = [...goals, {
                id: Date.now(),
                text: newGoal.trim(),
                completed: false
            }];
            setGoals(updatedGoals);
            localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
            setNewGoal("");
        }
    };

    const handleDeleteGoal = (id: number) => {
        const updatedGoals = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoals);
        localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
        if (editingGoalId === id) {
            setEditingGoalId(null);
            setEditingGoalText("");
        }
    };

    const handleToggleGoal = (id: number) => {
        const updatedGoals = goals.map(goal => {
            if (goal.id === id) {
                if (!goal.completed) {
                    const tips = [
                        "Great job! Keep up the good work!",
                        "Completed! Time to celebrate! 🎉",
                        "Achievement unlocked! 💪",
                        "Another one checked off! ✅"
                    ];
                    setShowTip(tips[Math.floor(Math.random() * tips.length)]);
                }
                return { ...goal, completed: !goal.completed };
            }
            return goal;
        });
        setGoals(updatedGoals);
        localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
    };

    const handleEditGoal = (goal: { id: number; text: string; completed: boolean }) => {
        setEditingGoalId(goal.id);
        setEditingGoalText(goal.text);
    };

    const handleSaveEditedGoal = (id: number) => {
        const updatedGoals = goals.map(goal =>
            goal.id === id ? { ...goal, text: editingGoalText } : goal
        );
        setGoals(updatedGoals);
        localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
        setEditingGoalId(null);
        setEditingGoalText("");
    };

    const handleCancelEditGoal = () => {
        setEditingGoalId(null);
        setEditingGoalText("");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center font-inter bg-[#f6f8f6]">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen font-inter bg-[#f6f8f6] grid grid-rows-[auto_1fr] p-4 gap-4">
            {/* Time Header */}
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center border border-gray-100">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl text-emerald-600">⏰</span>
                    <div>
                        <p className="text-xl font-medium text-gray-800">
                            {currentTime.toLocaleTimeString()}
                        </p>
                        <p className="text-gray-500 text-sm">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 h-full">
                {/* Left Sidebar - Profile */}
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4 border border-gray-100">
                    <div className="text-center">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-emerald-100 mx-auto mb-4"
                            src={user.avatarUrl || user.profileImage}
                            alt={user.username}
                        />
                        <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
                        <p className="text-gray-600 mt-1 text-sm">{user.email}</p>
                        <div className="mt-4 bg-emerald-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-emerald-600">STUDENT NUMBER</p>
                            <p className="font-medium text-gray-800">{String(user.studentNumber).padStart(6, '0')}</p>
                        </div>
                    </div>
                </div>

                {/* Center Content - Books & Notes */}
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-6 overflow-y-auto border border-gray-100">
                    {/* Coding Books Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <span className="mr-3 text-emerald-600">📚</span>
                            Recommended Technical Books
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {codingBooks.map((book, index) => (
                                <div
                                    key={index}
                                    className="group bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors"
                                >
                                    <div className="text-5xl mb-4 text-emerald-600 transition-transform group-hover:scale-105">
                                        {book.cover}
                                    </div>
                                    <h4 className="font-medium text-gray-800 leading-snug text-sm">
                                        {book.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-8">
                        <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                            <span className="mr-2 text-emerald-600">📝</span>
                            Study Notes
                        </h4>
                        <div className="mb-4">
              <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Write your note here..."
                  rows={3}
              />
                            <button
                                onClick={handleSaveNote}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                            >
                                Save Note
                            </button>
                        </div>
                        <div className="space-y-3">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className="p-3 bg-[#f6f8f6] rounded-lg border border-[#f6f8f6] text-sm text-gray-700 flex items-center justify-between"
                                >
                                    {editingNoteId === note.id ? (
                                        <div className="flex-1 mr-2">
                                            <input
                                                type="text"
                                                value={editingNoteText}
                                                onChange={(e) => setEditingNoteText(e.target.value)}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    ) : (
                                        <span className="flex-1">{note.text}</span>
                                    )}
                                    <div className="flex space-x-2">
                                        {editingNoteId === note.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEditedNote(note.id)}
                                                    className="text-sm text-emerald-600 hover:text-emerald-800"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEditNote}
                                                    className="text-sm text-gray-600 hover:text-gray-800"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditNote(note)}
                                                    className="text-sm text-emerald-600 hover:text-emerald-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Goals */}
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-6 border border-gray-100">
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                            <span className="mr-2 text-emerald-600">🎯</span>
                            Learning Goals
                        </h4>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Add new goal..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                            />
                            <button
                                onClick={handleAddGoal}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                            >
                                Add Goal
                            </button>
                        </div>
                        <div className="space-y-3">
                            {goals.map(goal => (
                                <div
                                    key={goal.id}
                                    className="flex items-center space-x-2 p-3 bg-[#f6f8f6] rounded-lg border border-[#f6f8f6]"
                                >
                                    <input
                                        type="checkbox"
                                        checked={goal.completed}
                                        onChange={() => handleToggleGoal(goal.id)}
                                        className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-300"
                                    />
                                    {editingGoalId === goal.id ? (
                                        <div className="flex-1 mr-2">
                                            <input
                                                type="text"
                                                value={editingGoalText}
                                                onChange={(e) => setEditingGoalText(e.target.value)}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    ) : (
                                        <span className={`flex-1 text-sm ${goal.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {goal.text}
                    </span>
                                    )}
                                    <div className="flex space-x-2">
                                        {editingGoalId === goal.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveEditedGoal(goal.id)}
                                                    className="text-sm text-emerald-600 hover:text-emerald-800"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEditGoal}
                                                    className="text-sm text-gray-600 hover:text-gray-800"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditGoal(goal)}
                                                    className="text-sm text-emerald-600 hover:text-emerald-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showTip && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
              <span className="text-sm text-amber-700 flex items-center">
                <span className="mr-2">💡</span>
                  {showTip}
              </span>
                            <button
                                onClick={() => setShowTip(null)}
                                className="text-amber-600 hover:text-amber-700 text-sm"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

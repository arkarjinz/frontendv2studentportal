'use client';
import { useEffect, useState } from "react";
import { getAllStudents, updateStudent, deleteStudent } from "@/service/StudentPortalService";
import { StudentDto } from "@/ds/student.dto";
import Image from "next/image";

export default function StudentListPage() {
    const [students, setStudents] = useState<StudentDto[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<StudentDto | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        getAllStudents()
            .then((res) => setStudents(res.data))
            .catch((err) => console.error(err));
    };

    const handleEditClick = (student: StudentDto) => {
        setSelectedStudent(student);
        setFormData({ ...student });
        setIsEditing(true);
    };

    const handleDeleteClick = (id: number) => {
        if (confirm("Are you sure you want to delete this student?")) {
            deleteStudent(id)
                .then(() => {
                    alert("Student deleted successfully");
                    fetchStudents();
                })
                .catch((err) => console.error(err));
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData && selectedStudent) {
            updateStudent(selectedStudent.id, formData)
                .then(() => {
                    alert("Student updated successfully");
                    setIsEditing(false);
                    setSelectedStudent(null);
                    fetchStudents();
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Student Directory</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#f0f4f3]">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Number</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Semester</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Roses</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-[#fafcfb] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="relative w-12 h-12">
                                    {student.profileImage ? (
                                        <Image
                                            src={`/${student.profileImage}`}
                                            alt={student.name || "Student avatar"}
                                            fill
                                            sizes="48px"
                                            className="rounded-full object-cover border-2 border-white shadow-md"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-[#e0ece9] flex items-center justify-center">
                        <span className="text-[#2a6155] font-medium text-lg">
                          {student.name?.charAt(0) || student.username.charAt(0)}
                        </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                {student.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                @{student.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                {student.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.studentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                {student.semester}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-medium">
                                <div className="flex items-center justify-center space-x-1.5">
                                    <svg
                                        className="w-5 h-5 text-[#d74b64]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 015.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[#2a6155] font-medium">{student.roseCount}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                    onClick={() => handleEditClick(student)}
                                    className="px-3 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(student.id)}
                                    className="px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {students.length === 0 && (
                    <div className="text-center py-8 bg-gray-50">
                        <p className="text-gray-500">No student records found</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && formData && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
                        <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username || ""}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year || ""}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Student Number</label>
                                <input
                                    type="text"
                                    name="studentNumber"
                                    value={formData.studentNumber || ""}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Semester</label>
                                <input
                                    type="text"
                                    name="semester"
                                    value={formData.semester || ""}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                                <input
                                    type="text"
                                    name="profileImage"
                                    value={formData.profileImage || ""}
                                    onChange={handleFormChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

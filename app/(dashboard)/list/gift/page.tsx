'use client'
import { useEffect, useState } from "react";
import { StudentDto } from "@/ds/student.dto";
import { getAllStudents } from "@/service/StudentPortalService";
import { ClipLoader } from "react-spinners";
import { RoseUpdate } from "@/ds/rose.update";
import { updateRouseCount } from "@/service/RoseGiftService";
import { motion } from "framer-motion";
import Image from "next/image";

interface StudentWithLoading extends StudentDto {
  loading: boolean;
}

export default function GiftListPage() {
  const [studentData, setStudentData] = useState<StudentWithLoading[]>([]);

  useEffect(() => {
    getAllStudents()
        .then(res =>
            setStudentData(
                res.data.map((student: StudentDto) => ({ ...student, loading: false }))
            )
        )
        .catch(err => console.log(err));
  }, []);

  const updateRouseCountHandler = async (roseUpdate: RoseUpdate) => {
    const response = await updateRouseCount(roseUpdate);
    console.log(response);
  };

  const handleRoseCountChange = (id: number, newCount: number) => {
    setStudentData(prevData =>
        prevData.map(student =>
            student.id === id ? { ...student, loading: true } : student
        )
    );

    const student = studentData.find(student => student.id === id);
    if (student) {
      const roseUpdate: RoseUpdate = { username: student.username, roses: newCount };
      updateRouseCountHandler(roseUpdate).then(() => {
        setStudentData(prevData =>
            prevData.map(student =>
                student.id === id ? { ...student, roseCount: newCount, loading: false } : student
            )
        );
      });
    }
  };

  return (
      <div className="min-h-screen p-8 bg-[#f6f8f6]">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">
              Rose Garden
            </span>
            </h1>
            <p className="text-gray-600 text-lg">Spread love through virtual roses 🌹</p>
          </motion.div>

          {/* Student List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-rose-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-rose-800 font-semibold">Profile</th>
                  <th className="px-6 py-4 text-left text-rose-800 font-semibold">Student</th>
                  <th className="px-6 py-4 text-left text-rose-800 font-semibold">Roses Given</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {studentData.map(student => (
                    <motion.tr
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-rose-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <Image
                                src={`/${student.profileImage}`}
                                alt={student.username}
                                width={48}
                                height={48}
                                className="rounded-full object-cover shadow-sm border-2 border-rose-100"
                                unoptimized
                            />
                            <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full px-2 py-1 text-xs border-2 border-white">
                              #{student.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">{student.username}</div>
                        <div className="text-sm text-gray-500">{student.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {student.loading ? (
                              <ClipLoader size={20} color="#e11d48" />
                          ) : (
                              <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handleRoseCountChange(
                                            student.id,
                                            Math.max(0, student.roseCount - 1)
                                        )
                                    }
                                    className="p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                                >
                                  -
                                </button>
                                <motion.div
                                    key={student.roseCount}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="w-12 text-center font-semibold text-rose-600"
                                >
                                  {student.roseCount}
                                </motion.div>
                                <button
                                    onClick={() => handleRoseCountChange(student.id, student.roseCount + 1)}
                                    className="p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {studentData.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <div className="mb-6 inline-block p-6 bg-rose-50 rounded-full">
                    <svg
                        className="w-16 h-16 text-rose-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">No students found in the garden</p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/service/StudentPortalService';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await forgotPassword(fullName, newPassword);
            setMessage(res.data);
            router.push('/login');
        } catch (err: any) {
            console.error('Error updating password:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to update password.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password(Doesn't Work WIP)</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && <p className="text-green-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-black text-white rounded hover:bg-gray-800">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client'
import {useRouter} from "next/navigation";
import {getLoggedInUerRole} from "@/service/AuthService";
import {useCallback, useEffect} from "react";

const AdminPage = () => {
    const router = useRouter();
    const loggedInUserRole = getLoggedInUerRole();

    const checkLoginStatus = useCallback(() => {
        if (loggedInUserRole.trim() !== 'ROLE_ADMIN') {
            router.replace('/');
            router.refresh();
        }
    }, [router, loggedInUserRole]);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto text-center">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome back, Administrator 👋
                    </h1>
                    <p className="text-gray-600">
                        Manage student accounts, monitor rose distributions, and oversee campus connections.
                    </p>
                </div>
            </div>
        </div>

    );
};

export default AdminPage;
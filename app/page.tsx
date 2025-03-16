'use client';
import MeetUs from "@/components/MeetUs";
import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import GetApp from "@/components/GetApp";
import {useEffect, useCallback} from "react";
import {isUserLoggedIn} from "@/service/AuthService";
import {useRouter} from "next/navigation";
import Footer from "@/components/Footer";



export default function Home() {
    const router = useRouter();

    const checkLoginStatus = useCallback(() => {
        if (!isUserLoggedIn()) {
            router.replace('/');
        }
    }, [router]);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    return (
        <>
            <Hero/>
            <Feature/>
            <MeetUs/>
            <Footer/>
        </>
    );
}
'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/constants";
import { useRouter, usePathname } from "next/navigation";
import {
    isUserLoggedIn,
    getLoggedInUser,
    logout,
    setLoggedInUserRole,
} from "@/service/AuthService";
import Button from "@/components/Button";
import { getProfileImageByStudentUserName } from "@/service/StudentPortalService";

const Navbar = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [profileImage, setProfileImage] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const updateLoginStatus = (event?: CustomEvent) => {
            if (event?.detail?.isLoggedIn !== undefined) {
                setIsLogin(event.detail.isLoggedIn);
                setLoggedInUser(getLoggedInUser() as unknown as null);
                console.log("Logged in user:", getLoggedInUser());
                getProfileImageByStudentUserName(getLoggedInUser())
                    .then((res) => setProfileImage(res.data))
                    .catch((err) => console.log(err));
            } else {
                setIsLogin(isUserLoggedIn());
                setLoggedInUser(getLoggedInUser() as unknown as null);
                console.log("Logged in user:", getLoggedInUser());
                getProfileImageByStudentUserName(getLoggedInUser())
                    .then((res) => setProfileImage(res.data))
                    .catch((err) => console.log(err));
            }
        };

        updateLoginStatus();
        window.addEventListener("authChange", updateLoginStatus as EventListener);

        return () => {
            window.removeEventListener("authChange", updateLoginStatus as EventListener);
        };
    }, []);

    const logoutHandler = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            logout();
            setIsLoggingOut(false);
            setLoggedInUserRole("");
            router.push("/");
        }, 1000);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <nav
                className={`flexBetween max-container padding-container relative z-30 py-4 ${
                    isLoggingOut ? "fade-out" : ""
                }`}
            >
                <Link href="/">
                    <Image src="/UnityVerse.svg" alt="logo" width={90} height={35} />
                </Link>

                <ul className="hidden h-full gap-8 lg:flex">
                    {isLogin &&
                        NAV_LINKS.map((link) => (
                            <Link
                                href={link.href}
                                key={link.key}
                                className="regular-16 text-green-800 flexCenter cursor-pointer pb-1 transition-all hover:font-bold"
                            >
                                {link.label}
                            </Link>
                        ))}
                </ul>

                <div className="lg:flexCenter hidden">
                    {!isLogin && pathname !== "/login" && pathname !== "/register" && (
                        <>
                            <Link href="/login">
                                <Button
                                    type="button"
                                    title="Login"
                                    icon="/user.svg"
                                    variant="btn_dark_green"
                                    className="text-xs px-3 py-1"
                                />
                            </Link>
                            <Link href="/register" className="ml-2">
                                <Button
                                    type="button"
                                    title="Register"
                                    icon="/user.svg"
                                    variant="btn_dark_green"
                                    className="text-xs px-3 py-1"
                                />
                            </Link>
                        </>
                    )}

                    {isLogin && (
                        <div className="flex">
                            <Image
                                src={`/${profileImage}`}
                                alt="Unoptimized Image"
                                width={60}
                                height={60}
                                className="rounded-full p-1 m-3"
                                unoptimized // Tells Next.js not to optimize this image
                            />
                            <Link href="/">
                                <Button
                                    onClick={logoutHandler}
                                    type="button"
                                    title="Logout"
                                    icon="/user.svg"
                                    variant="btn_dark_green"
                                    className="px-7 py-3 mt-3 me-2"
                                />
                            </Link>
                        </div>
                    )}

                    {(pathname === "/login" || pathname === "/register") && (
                        <Link href="/">
                            <Button
                                type="button"
                                title="Home"
                                icon="/home.svg"
                                variant="btn_dark_green"
                                className="text-xs px-3 py-1"
                            />
                        </Link>
                    )}
                </div>

                <div className="lg:hidden">
                    <Image
                        src="/menu.svg"
                        alt="menu"
                        width={32}
                        height={32}
                        className="inline-block cursor-pointer"
                        onClick={toggleMenu}
                    />
                </div>

                {isMenuOpen && (
                    <div className="absolute top-16 right-0 w-48 bg-white shadow-lg rounded-lg p-4 z-40">
                        <ul className="flex flex-col gap-4">
                            {/* Render navigation links */}
                            {isLogin &&
                                NAV_LINKS.map((link) => (
                                    <li key={link.key}>
                                        <Link
                                            href={link.href}
                                            className="block regular-16 text-green-800 cursor-pointer transition-all hover:font-bold"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            {/* Render extra buttons only once */}
                            {isLogin && (
                                <li>
                                    <Link href="/">
                                        <Button
                                            type="button"
                                            title="Home"
                                            icon="/home.svg"
                                            variant="btn_dark_green"
                                            className="text-xs px-3 py-1"
                                            onClick={() => setIsMenuOpen(false)}
                                        />
                                    </Link>
                                </li>
                            )}
                            {!isLogin &&
                                pathname !== "/login" &&
                                pathname !== "/register" && (
                                    <>
                                        <li>
                                            <Link href="/login">
                                                <Button
                                                    type="button"
                                                    title="Login"
                                                    icon="/user.svg"
                                                    variant="btn_dark_green"
                                                    className="text-xs px-3 py-1"
                                                    onClick={() => setIsMenuOpen(false)}
                                                />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/register">
                                                <Button
                                                    type="button"
                                                    title="Register"
                                                    icon="/user.svg"
                                                    variant="btn_dark_green"
                                                    className="text-xs px-3 py-1"
                                                    onClick={() => setIsMenuOpen(false)}
                                                />
                                            </Link>
                                        </li>
                                    </>
                                )}
                            {(pathname === "/login" || pathname === "/register") && (
                                <li>
                                    <Link href="/">
                                        <Button
                                            type="button"
                                            title="Home"
                                            icon="/home.svg"
                                            variant="btn_dark_green"
                                            className="text-xs px-3 py-1"
                                            onClick={() => setIsMenuOpen(false)}
                                        />
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;

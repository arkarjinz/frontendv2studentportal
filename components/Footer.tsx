import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "@/constants";
const Footer = () => {
    console.log("FOOTER_LINKS:", FOOTER_LINKS);
    return (

        <footer className="flexCenter mb-24">
            <div className="padding-container max-container flex w-full flex-col gap-14">
                <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
                    <Link href="/" className="mb-10">
                        <Image src="/UnityVerse.svg" alt="logo" width={74} height={29} />
                    </Link>

                    <div className="flex flex-wrap gap-10 sm:justify-between md:flex-1">
                        {FOOTER_LINKS.map((columns, index) => (
                            <FooterColumn title={columns.title} key={index}>
                                <ul className="regular-14 flex flex-col gap-4 text-gray-30">
                                    {columns.links.map((link, subIndex) => (
                                        <Link href="/" key={`${index}-${subIndex}`}>
                                            {link}
                                        </Link>
                                    ))}
                                </ul>
                            </FooterColumn>
                        ))}

                        <div className="flex flex-col gap-5">
                            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                                {FOOTER_CONTACT_INFO.links.map((link, index) => (
                                    <Link href="/" key={index} className="flex gap-4 md:flex-col lg:flex-row">
                                        <p className="whitespace-nowrap">{link.label} :</p>
                                        <p className="medium-14 whitespace-nowrap text-blue-70">{link.value}</p>
                                    </Link>
                                ))}
                            </FooterColumn>

                            <div className="flex flex-col gap-5">
                                <FooterColumn title={SOCIALS.title}>
                                    <ul className="regular-14 flex gap-4 text-gray-30">
                                        {SOCIALS.links.map((link, index) => (
                                            <li key={index}>
                                                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                                    <Image src={link.icon} alt="social logo" width={24} height={24} />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </FooterColumn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

type FooterColumnProps = {
    title: string;
    children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
    return (
        <div className="flex flex-col gap-5">
            <h4 className="bold-18 whitespace-nowrap">{title}</h4>
            {children}
        </div>
    );
};

export default Footer;
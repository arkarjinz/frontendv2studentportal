import Image from "next/image";
import Button from "@/components/Button";
import {motion} from "framer-motion";
import {fadeIn} from "@/variant";
import {TypeAnimation} from "react-type-animation";
const Hero = () => {
    return (
        <section
            className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row "
             >
            {/* Left Section */}
            <motion.div className="relative z-20 flex flex-1 flex-col xl:w-1/2"  variants={fadeIn('down', 0.2)} initial="hidden" whileInView={'show'} viewport={{once: false, amount: 0.1}}>
                <Image
                    src="grad.svg"
                    alt="university"
                    width={50}
                    height={50}
                    className="absolute left-[-5px] top-[-30px] w-10 lg:w-[50px]"
                />
                <h1 className="bold-52 lg:bold-88">
                    <TypeAnimation
                        sequence={[
                            'Welcome To', 2000,
                            'Unity', 2000,
                            'Unity V', 2000,
                            'Unity Ve', 2000,
                            'Unity Ver', 2000,
                            'Unity Vers', 2000,
                            'Unity Verse', 2000,
                        ]}
                        wrapper="span"
                        repeat={Infinity}
                        style={{display: 'inline-block'}}
                        cursor={false}
                    />
                </h1>

                {/*<h1 className="bold-52 lg:bold-88">Welcome to UnityVerse</h1>*/}

                <p className="regular-16 mt-6 text-green-800 xl:max-w-[520px]">
                    <TypeAnimation
                        sequence={[
                            // Fade in first sentence
                            'Your all-in-one platform to connect, collaborate, and thrive within our university community.', 3000,
                            () => document.querySelector('.regular-16')?.classList.add('fade-out'), // Trigger fade-out
                            '', 1000, // Pause for smooth transition

                            // Second sentence with fade-in
                            () => document.querySelector('.regular-16')?.classList.remove('fade-out'),
                            'Stay updated with the notice board, recover lost items, send thoughtful flower gifts,', 3000,
                            () => document.querySelector('.regular-16')?.classList.add('fade-out'),
                            '', 1000, // Pause

                            // Third sentence with fade-in
                            () => document.querySelector('.regular-16')?.classList.remove('fade-out'),
                            'Join exciting clubs, and much more!', 3000,
                            () => document.querySelector('.regular-16')?.classList.add('fade-out'),
                            '', 1000, // Pause
                        ]}
                        wrapper="span"
                        repeat={Infinity}
                        style={{display: 'inline-block', transition: 'opacity 0.5s ease-in-out'}}
                        cursor={false}
                    />
                </p>

                <style jsx>{`
    .fade-out {
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }
`}</style>

                <div className="my-11 flex flex-wrap gap-5">
                    <div className="flex items-center gap-2">
                        {Array(5)
                            .fill(1)
                            .map((_, index) => (
                                <Image
                                    src="/star.svg"
                                    alt="star"
                                    key={index}
                                    width={24}
                                    height={24}
                                />
                            ))}
                    </div>
                    <p className="text-3xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-70 to-blue-950 hover:scale-105 transition-transform duration-200">
                        7k
                        <span className="ml-2 text-lg lg:text-xl font-medium text-blue-70">
            Excellent Reviews
        </span>
                    </p>
                </div>
                <div className="flex flex-col w-full gap-3 sm:flex-row">
                    <Button
                        type="button"
                        title="Download Mobile Version"
                        variant="btn_green"
                    />
                    <Button
                        type="button"
                        title="How we work?"
                        icon="/play.svg"
                        variant="btn_white_text"
                    />
                </div>
            </motion.div>

            {/* Right Section - Image */}
            <motion.div className="relative z-20 flex flex-1 items-center justify-center xl:w-1/2" variants={fadeIn('down', 0.2)} initial="hidden" whileInView={'show'} viewport={{once: false, amount: 0.1}}>
                <Image
                    src="/door.webp"
                    alt="Door Image"
                    width={1200}
                    height={1200}
                    className="w-[90%] h-auto lg:w-[100%] object-cover"
                />
            </motion.div>
        </section>
    );
};

export default Hero;
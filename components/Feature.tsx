import Image from "next/image";
import { FEATURES } from "@/constants";
import { motion } from "framer-motion";
import { fadeIn } from "@/variant";

const Feature = () => {
    return (
        <section className="flex-col flexCenter overflow-hidden py-24  bg-center bg-no-repeat">
            <motion.div className="max-container padding-container relative w-full flex flex-col lg:flex-row items-center"  variants={fadeIn('down', 0.3)} initial="hidden" whileInView={'show'} viewport={{ once: false, amount: 0.1 }}>
                {/* Image Section */}
                <div className="flex flex-1 justify-center">
                    <Image
                        src="/laptop.png"
                        alt="laptop"
                        width={440}
                        height={1000}
                        className="feature-phone"
                        priority
                    />
                </div>
                {/* Text Section */}
                <motion.div className="z-20 flex flex-col w-full lg:w-[60%] lg:pl-10" variants={fadeIn('up', 0.3)} initial="hidden" whileInView={'show'} viewport={{ once: false, amount: 0.1 }}>
                    <div className="relative mb-10 lg:mb-16">
                        <Image
                            src="/grad.svg"
                            alt="icon"
                            width={50}
                            height={50}
                            className="absolute left-[-5px] top-[-20px] w-10 lg:w-[50px]"
                            priority
                        />
                        <h2 className="bold-40 lg:bold-64">Our Features</h2>
                    </div>
                    <ul className="grid gap-10 md:grid-cols-2 lg:gap-20">
                        {FEATURES.map((feature) => (
                            <FeatureItem
                                key={feature.title}
                                title={feature.title}
                                icon={feature.icon}
                                description={feature.description}
                            />
                        ))}
                    </ul>
                </motion.div>
            </motion.div>
        </section>
    );
};

type FeatureItemProps = {
    title: string;
    icon: string;
    description: string;
};

const FeatureItem = ({ title, icon, description }: FeatureItemProps) => {
    return (
        <li className="flex flex-col items-start">
            <div className="rounded-full p-4 bg-green-50">
                <Image src={icon} alt="icon" width={28} height={28} priority />
            </div>
            <h2 className="bold-20 lg:bold-32 mt-5 capitalize">{title}</h2>
            <p className="regular-16 mt-5 text-gray-30 lg:mt-[30px]">{description}</p>
        </li>
    );
};

export default Feature;
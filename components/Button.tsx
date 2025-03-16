import Image from "next/image";

type ButtonProps = {
    type: "button" | "submit" | "reset";
    title: string;
    icon?: string;
    variant: string;
    className?: string; // Add this line
    onClick?: () => void;

}

const Button = ({type, title, icon, variant,className,onClick}:ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flexCenter gap-3 rounded-full border ${variant} ${className}`}
            type={type}>
            {
                icon && <Image src={icon} alt={title} width={24} height={24}/>
            }
            <label className="bold-16 whitespace-nowrap">
                {title}
            </label>
        </button>
    )
}

export default Button
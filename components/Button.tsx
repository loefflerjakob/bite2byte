"use client";
import { useRouter } from "next/navigation";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
};

export default function Button({ children, onClick, href, type = 'button' }: ButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) onClick();
        if (href) router.push(href);
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            className="bg-primary text-white font-bold py-2 px-4 rounded-xl hover:bg-primary-hover cursor-pointer"
        >
            {children}
        </button>
    );
}

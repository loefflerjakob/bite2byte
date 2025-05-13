"use client";
import { useRouter } from "next/navigation";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
};

export default function Button({
    children,
    onClick,
    href,
    type = 'button',
    disabled = false
}: ButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
        if (href) router.push(href);
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={`bg-primary text-white font-bold py-2 px-4 rounded-xl cursor-pointer hover:bg-primary-hover ${
                disabled ? 'opacity-50 cursor-not-allowed hover:bg-primary' : ''
            }`}
        >
            {children}
        </button>
    );
}

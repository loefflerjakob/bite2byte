"use client";
import { useRouter } from "next/navigation";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'filled' | 'outline' | 'ghost' | 'soft' | 'danger';
};

export default function Button({
    children,
    onClick,
    href,
    type = 'button',
    disabled = false,
    variant = 'filled'
}: ButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
        if (href) router.push(href);
    };

    const baseClasses =
        'font-bold py-2 px-4 rounded-xl transition cursor-pointer';
    
    const variantClasses = {
        filled: 'bg-primary text-white hover:bg-primary-hover',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-primary hover:bg-primary/10',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={`
                ${baseClasses}
                ${variantClasses[variant]}
                ${disabled ? disabledClasses : ''}
            `}
        >
            {children}
        </button>
    );
}

import clsx from "clsx";

export interface ButtonProps {
    /** Is this the principal call to action on the page? */
    type: 'confirm' | 'cancel' | 'disabled';
    /** Button contents */
    label: string;
    customStyle?: string;
    /** Optional click handler */
    onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
                           type = 'confirm',
                           label,
                           customStyle,
                           ...props
                       }: ButtonProps) => {
    const baseStyle =
        "border-none text-white py-4 px-8 text-center no-underline text-lg my-5 mx-1 rounded-md";

    const variants: Record<string, string> = {
        confirm: "bg-blue-500 cursor-pointer",
        cancel: "bg-red-500 cursor-pointer",
        disabled: "bg-gray-400 cursor-not-allowed",
    };

    return (
        <button
            type="button"
            className={clsx(baseStyle, variants[type], customStyle)}
            {...props}
        >
            {label}
        </button>
    );
};

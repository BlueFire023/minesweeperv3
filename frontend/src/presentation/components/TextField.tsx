type TextFieldProps = {
    label: string;
    id: string;
};

export function TextField({
                              label,
                              id,
                          }: TextFieldProps) {

    return (
        <div className="flex flex-col items-center">
            <label htmlFor={id} className="flex justify-center text-white">
                {label}:
            </label>
            <input
                id={id}
                type="Text"
                className="w-[200px] py-1 px-1 my-2 text-center inline-block border bg-gray-100 border-gray-300 rounded box-border"
            />
        </div>
    );
}

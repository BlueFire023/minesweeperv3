type InputFieldProps = {
    label: string;
    id: string;
    value: number;
    onChange: (value: number) => void;
    rangeMin?: number;
    rangeMax?: number;
    suffix?: string;
};

export function InputField({
                               label,
                               id,
                               value,
                               onChange,
                               rangeMin,
                               rangeMax,
                               suffix = "",
                           }: InputFieldProps) {

    return (
        <div className="flex flex-col items-center">
            <div>
                <label htmlFor={id} className="flex justify-center text-white">
                    {label}:
                    <input
                        id={id}
                        type="number"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="bg-transparent w-1/12 outline-none ml-2 appearance-none"
                    />
                    {suffix && <span>{suffix}</span>}
                </label>
            </div>

            {rangeMin !== undefined && rangeMax !== undefined && (
                <input
                    id={`${id}Range`}
                    type="range"
                    min={rangeMin}
                    max={rangeMax}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-[200px] py-1 px-1 my-2 text-center inline-block border border-gray-300 rounded box-border"
                />
            )}
        </div>
    );
}

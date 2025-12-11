import {InputField} from "./InputField";
import {Button} from "./Button";
import {TextField} from "./TextField";

export function GameForm() {
    return (
        <div className="flex flex-col items-center w-full sm:w-96 h-full bg-gray-700 shadow-lg rounded-md">
            <h2 className="text-3xl font-bold text-white my-4">New Game</h2>
            <TextField label={"Game Name"} id={"gameName"}/>
            <InputField label="Rows" id="rows" numberValue={10} rangeMin={5} rangeMax={50} />
            <InputField label="Columns" id="columns" numberValue={10} rangeMin={5} rangeMax={50} />
            <InputField label="Mines" id="mines" numberValue={15} rangeMin={10} rangeMax={40} suffix={"%"}/>
            <Button label={"New Game"} type={"confirm"}/>
        </div>
    );
}
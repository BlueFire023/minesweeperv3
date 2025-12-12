import {InputField} from "./InputField";
import {Button} from "./Button";
import {TextField} from "./TextField";
import {useState} from "react";
import {client} from "../../client/Client";
import {useNavigate} from "@tanstack/react-router";

export function GameForm() {
    const [rows, setRows] = useState(10);
    const [columns, setColumns] = useState(10);
    const [minePercentage, setMinePercentage] = useState(15);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    async function createNewGame(width: number, height: number, minePercentage: number) {
        try {
            const gameRoom = await client.create("minesweeper", {width, height, minePercentage, name});
            navigate({ to: `/${gameRoom.roomId}` });
            console.log("Neuer Raum erstellt:", gameRoom.roomId);
        } catch (err) {
            console.error("Fehler beim Erstellen des Spiels:", err);
        }
    }

    return (
        <div className="flex flex-col items-center w-full sm:w-96 h-full bg-gray-700 shadow-lg rounded-md">
            <h2 className="text-3xl font-bold text-white my-4">New Game</h2>
            <TextField label={"Game Name"} id={"gameName"} onChange={setName}/>
            <InputField label="Rows" id="rows" value={rows} rangeMin={5} rangeMax={50} onChange={setRows}/>
            <InputField label="Columns" id="columns" value={columns} rangeMin={5} rangeMax={50} onChange={setColumns}/>
            <InputField label="Mines" id="mines" value={minePercentage} rangeMin={10} rangeMax={40} suffix={"%"}
                        onChange={setMinePercentage}/>
            <Button label={"New Game"} type={"confirm"} onClick={() => createNewGame(rows, columns, minePercentage)}/>
        </div>
    );
}
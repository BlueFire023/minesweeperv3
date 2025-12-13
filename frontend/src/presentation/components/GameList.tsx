import React from "react";
import {useNavigate} from "@tanstack/react-router";
import {useRooms} from "../../provider/RoomProvider";

export const GameList = () => {
    const [expandedGame, setExpandedGame] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const {roomsAvailable} = useRooms();
    const error = false;

    const handleJoin = (roomId: string) => {
        console.log("Join Room", roomId);
        navigate({to: `/${roomId}`});
    };

    return (
        <div className="flex flex-col items-center w-full sm:w-96 bg-gray-700 shadow-lg rounded-md justify-end">
            <h2 className="text-3xl font-bold text-white my-4">Available Games</h2>
            <div className="w-3/4 h-[355px] sm:h-[400px] mb-5 overflow-y-auto">
                <ul>
                    {roomsAvailable.map((room, index) => (
                        <li className="cursor-pointer py-2 px-4 my-1 w-full text-center bg-gray-200 text-black rounded-md"
                            key={index}
                            onClick={() => setExpandedGame(room.roomId === expandedGame ? null : room.roomId)}>
                            {room.metadata.name}
                            {room.roomId === expandedGame && (
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-left">ID: {room.roomId}</p> {/* Replace with actual game description */}
                                        <p className="text-left">Size: {room.metadata.width}x{room.metadata.height}</p> {/* Display the X and Y size */}
                                        <p className="text-left">Mines: {room.metadata.minePercentage}%</p> {/* Display the amount of mines */}
                                    </div>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleJoin(room.roomId)}>Join
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                    {!error && roomsAvailable.length === 0 &&
                        <div className="flex items-center bg-gray-500 justify-center text-white px-4 py-2 rounded">No
                            games available</div>}
                    {error &&
                        <div className="flex items-center bg-red-500 justify-center text-white px-4 py-2 rounded">No
                            connection to the server</div>}
                </ul>
            </div>
        </div>
    );
}

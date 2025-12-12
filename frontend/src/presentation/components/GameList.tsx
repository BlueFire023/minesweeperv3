import { type RoomAvailable } from "colyseus.js";
import React from "react";

interface GameListProps {
    rooms: RoomAvailable[];
    onJoin?: (roomId: string) => void;
}

export const GameList: React.FC<GameListProps> = ({ rooms }) => {
    const [expandedGame, setExpandedGame] = React.useState<string | null>(null);
    const connected = true; // Replace with actual connection status

    const handleJoinGame = (roomId: string) => {}

    return (
        <div className="flex flex-col items-center w-full sm:w-96 bg-gray-700 shadow-lg rounded-md justify-end">
            <h2 className="text-3xl font-bold text-white my-4">Available Games</h2>
            <div className="w-3/4 h-[355px] sm:h-[400px] mb-5 overflow-y-auto">
                <ul>
                    {rooms.map((room, index) => (
                        <li className="cursor-pointer py-2 px-4 my-1 w-full text-center bg-gray-200 text-black rounded-md"
                            key={index}
                            onClick={() => setExpandedGame(room.roomId === expandedGame ? null : room.roomId)}>
                            {room.metadata.name}
                            {room.roomId === expandedGame && (
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-left">ID: {room.roomId}</p> {/* Replace with actual game description */}
                                        <p className="text-left">Size: {room.metadata.width}x{room.metadata.height}</p> {/* Display the X and Y size */}
                                        <p className="text-left">Mines: {room.metadata.mineCount}%</p> {/* Display the amount of mines */}
                                    </div>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleJoinGame(room.roomId)}>Join
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                    {connected && rooms.length === 0 &&
                        <div className="flex items-center no-games">No games available</div>}
                    {!connected &&
                        <div className="flex items-center no-connection">No connection to the server</div>}
                </ul>
            </div>
        </div>
    );
}

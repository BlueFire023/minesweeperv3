import { GameForm } from "../components/GameForm";
import { GameList } from "../components/GameList";
import { useRooms } from "../viewModels/useRooms"

export function MainMenu() {
    const { data: rooms, isLoading, isError, error } = useRooms();

    const handleJoin = (roomId: string) => {
        console.log("Join Room", roomId);
        // Hier später Mutation für JoinRoom hinzufügen
    };

    if (isLoading) return <div>Lade Spiele...</div>;
    if (isError) return <div>Fehler: {error?.message}</div>;

    return (
        <div className="flex flex-col text-white items-center h-screen">
            <h1 className="text-5xl font-bold my-4">Minesweeper</h1>
            <div className="flex flex-col space-y-4 h-fit w-full sm:space-y-0 sm:space-x-4 sm:flex-row mb-10 justify-center items-start px-4">
                <GameForm />
                <GameList rooms={rooms || []} onJoin={handleJoin} />
            </div>
        </div>
    );
}

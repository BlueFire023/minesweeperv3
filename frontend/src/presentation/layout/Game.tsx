import { useEffect, useState, useRef } from "react";
import { useParams } from "@tanstack/react-router";
import { useRooms } from "../../provider/RoomProvider";

export function Game() {
    const [state, setState] = useState<any>(null);
    const { roomId } = useParams({ from: "/$roomId" });
    const { activeRoom, joinRoomOrReconnect} = useRooms();

    // Flag, ob wir diesen Raum selbst in diesem Effect gejoined haben
    const hasJoinedRef = useRef(false);
    useEffect(() => {
        if (hasJoinedRef.current) return;
        hasJoinedRef.current = true;
        joinRoomOrReconnect(roomId);
    }, [roomId]);

    useEffect(() => {
        if (!activeRoom) return;

        // initial setzen
        setState(activeRoom.state);

        // Listener für State-Updates
        const listener = (newState: any) => {
            setState({ ...newState }); // trigger React re-render
        };
        activeRoom.onStateChange(listener);

        // Cleanup beim Unmount oder wenn Room wechselt
        return () => {
            activeRoom.removeAllListeners(); // oder je nach API
        };
    }, [activeRoom]);

    if (!activeRoom) return <div className="text-white">Connecting…</div>;

    return (
        <div className="flex flex-col text-white items-center h-screen">
            Game Room {activeRoom.roomId}
            <pre>{JSON.stringify(activeRoom.state, null, 2)}</pre>
        </div>
    );
}

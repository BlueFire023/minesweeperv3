import { useEffect, useState, useRef } from "react";
import { useParams } from "@tanstack/react-router";
import { useRooms } from "../../provider/RoomProvider";

export function Game() {
    const [state, setState] = useState<any>(null);
    const { roomId } = useParams({ from: "/$roomId" });
    const { activeRoom, joinRoomOrReconnect} = useRooms();

    const hasJoinedRef = useRef(false);
    useEffect(() => {
        if (hasJoinedRef.current) return;
        hasJoinedRef.current = true;
        joinRoomOrReconnect(roomId);
    }, [joinRoomOrReconnect, roomId]);

    useEffect(() => {
        if (!activeRoom) return;

        setState(activeRoom.state);

        const listener = (newState: any) => {
            setState({ ...newState });
        };
        activeRoom.onStateChange(listener);
    }, [activeRoom]);

    if (!activeRoom) return <div className="text-white">Connecting…</div>;

    return (
        <div className="flex flex-col text-white items-center h-screen">
            Game Room {activeRoom.roomId}
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
    );
}

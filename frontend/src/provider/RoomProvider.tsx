import {createContext, useContext, useEffect, useRef, useState} from "react";
import {client} from "../client/Client";
import type {Room, RoomAvailable} from "colyseus.js";

type PayloadType = {
    name: string;
    width: number;
    height: number;
    minePercentage: number;
};

type RoomContextType = {
    lobby: Room | null;
    activeRoom: Room | null;
    roomsAvailable: RoomAvailable[];
    joinRoomOrReconnect: (roomId: string) => Promise<Room>;
    createRoom: (roomName: string, payload: PayloadType) => Promise<Room>;
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({children}: { children: React.ReactNode }) {
    const [lobby, setLobby] = useState<Room | null>(null);
    const [activeRoom, setActiveRoom] = useState<Room | null>(null);
    const [roomsAvailable, setRoomsAvailable] = useState<RoomAvailable[]>([]);

    // const reconnecting = useRef(false);
    // const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    // ---------------------------
    // 1 — Lobby verbinden
    // ---------------------------

    useEffect(() => {
        if (lobby) return;
        let isMounted = true;
        const connectLobby = async () => {
            try {
                const l = await client.joinOrCreate("lobby");
                if (!isMounted) return;
                setLobby(l);
                console.log("[Lobby] connected");

                // initiale Räume
                l.onMessage("rooms", (initialRooms) => {
                    setRoomsAvailable(initialRooms);
                    console.log("[Lobby] initial rooms received", initialRooms);
                });

                // Neue oder geänderte Räume
                l.onMessage("+", ([roomId, room]) => {
                    setRoomsAvailable((prev) => {
                        const idx = prev.findIndex((r) => r.roomId === roomId);
                        if (idx !== -1) {
                            const updated = [...prev];
                            updated[idx] = {...updated[idx], ...room};
                            return updated;
                        }
                        return [...prev, {...room, roomId}];
                    });
                    console.log(`[Lobby] room added/updated: ${roomId}`);
                });

                // Entfernte Räume
                l.onMessage("-", (roomId) => {
                    setRoomsAvailable((prev) => prev.filter((r) => r.roomId !== roomId));
                    console.log(`[Lobby] room removed: ${roomId}`);
                });

                l.onLeave(() => {
                    console.log("[Lobby] left");
                    setLobby(null);
                });
            } catch (err) {
                console.error("[Lobby] connection failed", err);
            }
        };

        connectLobby();

        return () => {
            isMounted = false;
        }
    }, [lobby]);

    // ---------------------------
    // 3 — Join Room
    // ---------------------------
    const joinRoomOrReconnect = async (roomId: string): Promise<Room> => {
        console.log("joinRoomOrReconnect", roomId);

        if (activeRoom && activeRoom.roomId === roomId) {
            console.log("Already in this room, aborting...");
            return activeRoom;
        }

        const reconToken = localStorage.getItem("reconnectionToken");
        console.log("Recon token", reconToken);
        console.log(reconToken && reconToken.startsWith(roomId))
        if (reconToken && reconToken.startsWith(roomId)) {
            try {
                console.log("[Room] trying to reconnect");
                const room = await client.reconnect(reconToken);
                setActiveRoom(room);
                if (room.reconnectionToken) localStorage.setItem("reconnectionToken", room.reconnectionToken);
                console.log(`[Room] reconnected to room ${roomId}`);
                return room;
            } catch (err) {
                console.log("[Room] reconnect failed, will try joinById", roomId, err);
            }
        }

        try {
            console.log("[Room] joining room", roomId);
            const room = await client.joinById(roomId);
            if (activeRoom) await activeRoom.leave();
            setActiveRoom(room);
            if (room.reconnectionToken) localStorage.setItem("reconnectionToken", room.reconnectionToken);
            console.log(`[Room] joined room ${roomId}`);
            return room;
        } catch (err) {
            console.error(`[Room] failed to join room ${roomId}`, err);
            throw err;
        }
    };


    // ---------------------------
    // 4 — Create Room
    // ---------------------------
    const createRoom = async (roomName: string, payload: PayloadType): Promise<Room> => {
        try {
            const room = await client.create(roomName, payload);
            setActiveRoom(room);

            if (room.reconnectionToken) {
                localStorage.setItem("reconnectionToken", room.reconnectionToken);
            }

            console.log(`[Room] created and joined room ${roomName}`);
            return room;
        } catch (err) {
            console.error(`[Room] failed to create room ${roomName}`, err);
            throw err;
        }
    };

    return (
        <RoomContext.Provider
            value={{
                lobby,
                activeRoom,
                roomsAvailable,
                joinRoomOrReconnect,
                createRoom,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}

export function useRooms() {
    const ctx = useContext(RoomContext);
    if (!ctx) throw new Error("useRooms must be inside <RoomProvider>");
    return ctx;
}

import { useEffect, useState } from "react";
import { type RoomAvailable, Room } from "colyseus.js";
import { client } from "../../client/Client";


export function useLobby() {
    const [rooms, setRooms] = useState<RoomAvailable[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [lobbyRoom, setLobbyRoom] = useState<Room | null>(null);

    useEffect(() => {
        let isMounted = true;

        const joinLobby = async () => {
            try {
                const lobby = await client.joinOrCreate("lobby");
                if (!isMounted) return;
                setLobbyRoom(lobby);

                // Initiale Räume
                lobby.onMessage("rooms", (initialRooms) => {
                    setRooms(initialRooms);
                });

                // Neue / geänderte Räume
                lobby.onMessage("+", ([roomId, room]) => {
                    setRooms((prevRooms) => {
                        const idx = prevRooms.findIndex(r => r.roomId === roomId);
                        if (idx !== -1) {
                            const updatedRooms = [...prevRooms];
                            updatedRooms[idx] = { ...updatedRooms[idx], ...room };
                            return updatedRooms;
                        }
                        return [...prevRooms, { ...room, roomId }];
                    });
                });

                // Entfernte Räume
                lobby.onMessage("-", (roomId) => {
                    setRooms((prevRooms) => prevRooms.filter(r => r.roomId !== roomId));
                });

            } catch (err) {
                console.error("Fehler beim Beitreten zur Lobby:", err);
                setError(true);
            }
        };

        joinLobby();

        return () => {
            isMounted = false;
            if (lobbyRoom) {
                lobbyRoom.leave();
            }
        };
    }, []);

    const joinRoom = async (roomId: string) => {
        if (!lobbyRoom) return;
        return await client.joinById(roomId);
    };

    return { rooms, error, joinRoom };
}

interface Room {
    id: string;
    players: any[];
    gameSettings: {
        width: number;
        height: number;
        mineCount: number;
    }
}

export async function fetchRooms(): Promise<Room[]> {
    const res = await fetch("http://localhost:2567/getRooms");
    if (!res.ok) throw new Error("Fehler beim Laden der Räume");
    return res.json();
}
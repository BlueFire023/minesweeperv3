import { useQuery } from "@tanstack/react-query";
import { fetchRooms, type Room } from "../../models/rooms";

// Query Hook
export function useRooms() {
    return useQuery<Room[], Error>({
        queryKey: ["rooms"],
        queryFn: fetchRooms,
    });
}

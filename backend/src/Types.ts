export interface CellData {
    revealed: boolean;      // ob die Zelle aufgedeckt ist
    flagged: boolean;       // ob die Zelle markiert ist
    value: number;          // -1 = Mine, 0-8 = Nachbar-Minen
    revealedBy: string | null; // sessionId des Clients, der die Zelle aufgedeckt hat
    isStartingCell?: boolean; // ob die Zelle die Startzelle ist
}
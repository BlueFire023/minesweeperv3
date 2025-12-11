import { Client } from "colyseus.js";
import { CellData } from "../src/Types";

test("Room test", async () => {
    const client = new Client("ws://localhost:2567");
    console.log("[TEST] Connecting to server…");

    const room = await client.joinOrCreate("minesweeper", {
        width: 5,
        height: 5,
        mineCount: 3,
        seed: 123
    });

    console.log("[TEST] Joined room:");

    // Erstes State-Update
    await new Promise<void>((resolve) => {
        room.onStateChange.once((state) => {
            console.log("[TEST] Initial state received");
            resolve();
        });
    });

    // Aktion auslösen
    console.log("[TEST] Sending reveal(0,0)");
    room.send("reveal", { x: 0, y: 0, playerId: "test-player" });

    // Auf Update warten
    await new Promise<void>((resolve, reject) => {
        room.onStateChange.once((state) => {
            console.log("[TEST] State updated after reveal");

            try {
                const idx = 0 + 0 * state.width;
                const cell: CellData = state.board[idx];

                console.log("[TEST] Cell(0,0):", JSON.stringify(cell));

                expect(cell.revealed).toBe(true);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });

    console.log("[TEST] Leaving room");
    await room.leave();

    console.log("[TEST] Test completed");
});

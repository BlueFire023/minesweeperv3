import { Room, Client } from "colyseus";
import { MinesweeperGame } from "./Minesweeper";

export class MinesweeperRoom extends Room<MinesweeperGame> {

    onCreate(options: any) {
        console.log("Minesweeper Room created", options);

        // initialer Seed oder per Options
        const seed = options.seed ?? Date.now();
        this.state = new MinesweeperGame(options.width, options.height, options.mineCount);
        this.state.generateBoard(seed);

        // Nachrichten vom Client
        this.onMessage("reveal", (client, message: { x: number, y: number }) => {
            this.state.revealCell(message.x, message.y, client.sessionId);
        });

        this.onMessage("flag", (client, message: { x: number, y: number }) => {
            this.state.flagCell(message.x, message.y, client.sessionId);
        });

        this.onMessage("hint", (client, message: { x: number, y: number }) => {
            this.state.useHint(message.x, message.y, client.sessionId);
        });

        this.onMessage("newGame", (client, message: { seed?: number }) => {
            const newSeed = message.seed ?? Date.now();
            this.state.resetGame(newSeed);
            this.broadcast("newGameStarted", { seed: newSeed });
        });
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined the room");
        client.send("boardState", this.state.getStateForClient());
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left the room");
    }

    onDispose() {
        console.log("Minesweeper Room disposed");
    }
}

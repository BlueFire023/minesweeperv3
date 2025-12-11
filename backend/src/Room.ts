import { Room, Client } from "colyseus";
import { GameState } from "./State"

export class MinesweeperRoom extends Room<GameState> {
    private seed: number = 0;

    onCreate(options: any) {
        const width = options.width ?? 10;
        const height = options.height ?? 10;
        const mineCount = options.mineCount ?? 10;

        this.setState(new GameState(width, height, mineCount));

        this.onMessage("reveal", (client: Client, message: { x: number; y: number }) => {
            const { x, y } = message;
        })
    }
}
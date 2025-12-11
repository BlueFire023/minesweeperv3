import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Cell extends Schema {
    @type("boolean") revealed: boolean = false;
    @type("boolean") flagged: boolean = false;
    @type("number") value: number = 0;
    @type("string") revealedBy: string | null = null;
}

export class GameState extends Schema {
    @type("number") width: number = 10;
    @type("number") height: number = 10;
    @type("number") mineCount: number = 10;
    @type("boolean") gameOver: boolean = false;
    @type("number") version: number = 0; // optional, increment on mutations

    @type([Cell])
    public cells: ArraySchema<Cell> = new ArraySchema<Cell>();

    constructor(width = 10, height = 10, mineCount = 10) {
        super();
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;

        for(let i = 0; i < width * height; i++) {
            this.cells.push(new Cell());
        }
    }

    idx(x: number, y: number): number {
        return y * this.width + x;
    }
}
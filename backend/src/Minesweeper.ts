import seedrandom from "seedrandom";
import {CellData} from "./Types";

// @formatter:off
const neighborPositions = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1]
];
// @formatter:on

export enum GameStatus {
    NotReady,
    Ready,
    Running,
    Won,
    Lost
}

export class MinesweeperGame {
    board: CellData[];
    width: number;
    height: number;
    mineCount: number;
    hintsUsed: number = 0;
    startTime: number = 0;
    status: GameStatus = GameStatus.NotReady;

    constructor(width: number, height: number, mineCount: number) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;
        this.board = new Array(width * height).fill(null).map(() => ({
            revealed: false,
            flagged: false,
            value: 0,
            lastInteractedBy: null
        }));
    }

    public generateBoard(seed: number): void {
        const rng = seedrandom(seed.toString());

        if (this.mineCount > this.width * this.height) throw new Error("Too many mines");
        // Place mines
        for (let i = 0; i < this.mineCount; i++) {
            while (true) {
                let x = Math.floor(rng() * this.width);
                let y = Math.floor(rng() * this.height);

                if (this.board[this.idx(x, y)].value === -1) {
                    continue;
                }

                this.board[this.idx(x, y)].value = -1;
                break;
            }
        }

        // Calculate mine counts
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[this.idx(x, y)].value === -1) {
                    for (const [dx, dy] of neighborPositions) {
                        const newX = x + dx;
                        const newY = y + dy;
                        if (newX >= 0 && newY >= 0 && newX < this.width && newY < this.height) {
                            const neighbor = this.board[this.idx(newX, newY)];
                            if (neighbor.value !== -1) neighbor.value++;
                        }
                    }
                }
            }
        }

        //find the cells with the value 0
        let startCellCandidates = []
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[this.idx(x, y)].value === 0) {
                    startCellCandidates.push({x: x, y: y});
                }
            }
        }

        //pick a random cell with the value 0
        if (startCellCandidates.length === 0) {
            console.log('No cells with value 0')
            while (true) {
                let x = Math.floor(rng() * this.width);
                let y = Math.floor(rng() * this.height);

                if (this.board[this.idx(x, y)].value !== -1) {
                    this.board[this.idx(x, y)].isStartingCell = true;
                    break;
                }
            }
        } else {
            let startCell = startCellCandidates[Math.floor(rng() * startCellCandidates.length)];
            this.board[this.idx(startCell.x, startCell.y)].isStartingCell = true;
        }
        this.status = GameStatus.Ready;
    }

    // reveal cell. Flood fill if value is 0
    public revealCell(x: number, y: number, playerId: string): void {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        const cell = this.board[this.idx(x, y)]
        if (cell.flagged) return;

        this.startTimer();

        if (!cell.revealed && cell.value === -1) {
            this.handleMineHit(cell, playerId);
            return;
        }

        let proximityBombs = cell.value;
        if (proximityBombs === 0) {
            this.handleFloodFill(x, y, playerId);
        } else {
            let proximityFlags = 0;
            let validNeighborPositions: { x: number, y: number }[] = [];
            for (const [dx, dy] of neighborPositions) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newY >= 0 && newX < this.width && newY < this.height) {
                    const neighbor = this.board[this.idx(newX, newY)];
                    if (neighbor.flagged) {
                        proximityFlags++;
                    }
                    validNeighborPositions.push({x: newX, y: newY});
                }
            }
            if (proximityFlags === proximityBombs) {
                for (const pos of validNeighborPositions) {
                    const neighbor = this.board[this.idx(pos.x, pos.y)];
                    if (!neighbor.revealed && !neighbor.flagged) {
                        if (neighbor.value === -1) {
                            this.handleMineHit(neighbor, playerId);
                            return;
                        } else if (neighbor.value === 0) {
                            this.handleFloodFill(pos.x, pos.y, playerId);
                        } else {
                            neighbor.revealed = true;
                            neighbor.lastInteractedBy = playerId;
                        }
                    }
                }
            } else {
                this.handleFloodFill(x, y, playerId);
            }
        }
        this.checkWin();
    }

    private handleMineHit(cell: CellData, playerId: string): void {
        cell.revealed = true;
        cell.lastInteractedBy = playerId;
        this.status = GameStatus.Lost;
    }

    private handleFloodFill(x: number, y: number, playerId: string): void {
        const stack: [number, number][] = [[x, y]];
        const visited = new Set<string>();

        while (stack.length > 0) {
            const [cx, cy] = stack.pop()!;
            const key = `${cx},${cy}`;
            if (visited.has(key)) continue;
            visited.add(key);

            if (cx < 0 || cy < 0 || cx >= this.width || cy >= this.height) continue;
            const cell = this.board[this.idx(cx, cy)];
            if (cell.revealed) continue;

            cell.revealed = true;
            cell.lastInteractedBy = playerId;

            if (cell.value === 0) {
                if (cell.isStartingCell) {
                    cell.isStartingCell = false;
                }
                for (const [dx, dy] of neighborPositions) {
                    stack.push([cx + dx, cy + dy]);
                }
            }
        }
    }

    public flagCell(x: number, y: number, playerId: string): void {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        const cell = this.board[this.idx(x, y)];
        if (cell.revealed || cell.isStartingCell) return;

        this.startTimer();

        if (cell.flagged) {
            cell.flagged = false;
            cell.lastInteractedBy = null;
            return;
        } else {
            cell.flagged = true;
            cell.lastInteractedBy = playerId;
            return;
        }
    }

    public useHint(x: number, y: number, playerId: string): void {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
        const cell = this.board[this.idx(x, y)];
        if (cell.flagged || cell.revealed || cell.isStartingCell) return;

        if (cell.value === -1) {
            this.flagCell(x, y, playerId);
        } else {
            this.revealCell(x, y, playerId);
        }
        this.hintsUsed++;
    }

    private idx(x: number, y: number) {
        return y * this.width + x;
    }

    private checkWin(): void {
        const won = this.board.every(cell => cell.value === -1 || cell.revealed);
        if (won) {
            this.status = GameStatus.Won;
        }
    }

    private startTimer(): void {
        if (this.status === GameStatus.Running) return;
        this.startTime = Date.now();
        this.status = GameStatus.Running;
    }

    /*
     *  Debug
     */
    public getBoardString(): string {
        let output = "";
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.board[this.idx(x, y)];
                if (cell.isStartingCell) {
                    output += " S";

                } else if (cell.value === -1) {
                    output += " *";
                } else {
                    output += ` ${cell.value}`;
                }
                if (cell.flagged) {
                    output += "f";
                }
                if (!cell.flagged) {
                    output += cell.revealed ? "r" : " ";
                }
            }
            output += "\n";
        }
        return output;
    }

}
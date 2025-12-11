import { MinesweeperGame } from "../src/Minesweeper";

describe("MinesweeperGame", () => {

    it("generates a board with correct number of mines", () => {
        const game = new MinesweeperGame(10, 10, 10);
        game.generateBoard(12345);

        const mineCount = game.board.filter(cell => cell.value === -1).length;
        expect(mineCount).toBe(10);
    });

    it("calculates neighbor numbers correctly", () => {
        const game = new MinesweeperGame(3, 3, 1);
        game.generateBoard(42);

        // check that cells next to the mine have value > 0
        const mineIndex = game.board.findIndex(cell => cell.value === -1);
        const x = mineIndex % 3;
        const y = Math.floor(mineIndex / 3);

        const neighbors = [
            [x-1, y-1], [x, y-1], [x+1, y-1],
            [x-1, y],             [x+1, y],
            [x-1, y+1], [x, y+1], [x+1, y+1]
        ];

        neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) {
                const cell = game.board[game.idx(nx, ny)];
                if (cell.value !== -1) expect(cell.value).toBeGreaterThan(0);
            }
        });
    });

    it("print board for debugging", () => {
        const game = new MinesweeperGame(10, 10, 50);
        game.generateBoard(12345);
        console.log(game.getBoardString());
    });

});

import { MinesweeperGame } from "../src/Minesweeper";

describe("MinesweeperGame", () => {

    it("generates a board with correct number of mines", () => {
        const game = new MinesweeperGame(10, 10, 10);
        game.generateBoard(12345);

        const mineCount = game.board.filter(cell => cell.value === -1).length;
        expect(mineCount).toBe(10);
        console.log(game.getBoardString());
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
            [x-1, y  ],           [x+1, y  ],
            [x-1, y+1], [x, y+1], [x+1, y+1]
        ];

        neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) {
                const cell = game.board[game.idx(nx, ny)];
                if (cell.value !== -1) expect(cell.value).toBeGreaterThan(0);
            }
        });
        console.log(game.getBoardString());
    });

    it("revealing a cell marks it as revealed and tracks client", () => {
        const game = new MinesweeperGame(10, 10, 2);
        game.generateBoard(4);
        console.log(game.getBoardString());

        game.revealCell(2, 3, "player1");
        const cell = game.board[game.idx(2,3)];
        console.log(game.getBoardString());

        expect(cell.revealed).toBe(true);
        expect(cell.lastInteractedBy).toBe("player1");
    });

    it("flagging a cell toggles its flagged state", () => {
        const game = new MinesweeperGame(5, 5, 0);
        game.generateBoard(2);
        console.log(game.getBoardString());

        game.flagCell(1,1, "player1");
        const cell = game.board[game.idx(1,1)];
        expect(cell.flagged).toBe(true);
        expect(cell.lastInteractedBy).toBe("player1");
        console.log(game.getBoardString());

        game.flagCell(1,1, "player1");
        expect(cell.flagged).toBe(false);
        expect(cell.lastInteractedBy).toBe(null);
        console.log(game.getBoardString());
    });

    it("use a hint", () => {
        const game = new MinesweeperGame(5, 5, 5);
        game.generateBoard(1);
        console.log(game.getBoardString());

        expect(game.hintsUsed).toBe(0);

        game.useHint(2,0,"player1");
        console.log(game.getBoardString());

        let cell = game.board[game.idx(2,0)];
        expect(cell.flagged).toBe(true);
        expect(cell.lastInteractedBy).toBe("player1");
        expect(game.hintsUsed).toBe(1);

        game.useHint(1,0,"player1");
        console.log(game.getBoardString());

        cell = game.board[game.idx(1,0)];
        expect(cell.revealed).toBe(true);
        expect(cell.lastInteractedBy).toBe("player1");
        expect(game.hintsUsed).toBe(2);

    })

    it("reveal neighboring cells when revealing a non zero cell with the correct flag in place", () => {
        const game = new MinesweeperGame(5, 5, 4);
        game.generateBoard(10);
        console.log(game.getBoardString());

        game.flagCell(0,2, "player1");
        console.log(game.getBoardString());

        game.revealCell(1,2, "player1");
        console.log(game.getBoardString());
    })

    it("print board for debugging", () => {
        const game = new MinesweeperGame(5, 5, 5);
        game.generateBoard(1);
        console.log(game.getBoardString());
    });

});

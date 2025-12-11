import express from "express";
import { createServer } from "http";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { MinesweeperRoom } from "./Room"

const app = express();
const httpServer = createServer(app);

const gameServer = new Server({
    transport: new WebSocketTransport({
        server: httpServer
    })
});

// register room
gameServer.define("minesweeper", MinesweeperRoom);

// simple HTTP health & static serve for client (optional)
app.get("/health", (_req, res) => res.send("OK"));

const PORT = Number(process.env.PORT) || 2567;
httpServer.listen(PORT, () => {
    console.log(`Colyseus server listening on ws://localhost:${PORT}`);
});

import express from "express";
import http from "http";
import {Server} from "colyseus";
import {MinesweeperRoom} from "./GameRoom";
import {LobbyRoom} from "colyseus";
import cors from "cors"

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // deine Vite-Frontend-URL
    methods: ["GET", "POST"],
    credentials: true, // falls Cookies/Sessions verwendet werden
}));

app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server();

gameServer.attach({server});

gameServer
    .define("lobby", LobbyRoom);

gameServer
    .define("minesweeper", MinesweeperRoom)
    .enableRealtimeListing();


// Health check
app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

// --- Server starten ---
const PORT = 2567;
server.listen(PORT, () => {
    console.log(`HTTP + Colyseus server running on http://localhost:${PORT}`);
});

import express from "express";
import http from "http";
import {Server} from "colyseus";
import {matchMaker} from "@colyseus/core";
import {MinesweeperRoom} from "./Room";
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

// --- Colyseus-Raum definieren ---
gameServer.define("minesweeper", MinesweeperRoom);

// --- HTTP Endpoints ---

// Health check
app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

// Liste aller Räume

app.get("/getRooms", async (_req, res) => {
    try {
        // Räume vom Typ "minesweeper" abrufen
        const rooms = await matchMaker.query({name: "minesweeper"});
        // Relevante Infos extrahieren
        const roomList = rooms.map(room => {
            return {
                id: room.roomId,
                players: room.clients,
                metadata: room.metadata
            }
        });

        res.json(roomList);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Could not fetch rooms"});
    }
});

// Eigenen Raum erstellen
app.post("/createRoom", async (req, res) => {
    const {width, height, mineCount, seed} = req.body;

    if (!width || !height || !mineCount) {
        return res.status(400).json({error: "width, height and mineCount are required"});
    }

    try {
        const room = await matchMaker.createRoom("minesweeper", {
            width,
            height,
            mineCount,
            seed: seed ?? Date.now(),
        });

        res.json({roomId: room.roomId});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

// --- Server starten ---
const PORT = 2567;
server.listen(PORT, () => {
    console.log(`HTTP + Colyseus server running on http://localhost:${PORT}`);
});

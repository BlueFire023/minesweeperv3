import {createFileRoute} from "@tanstack/react-router";
import {Game} from "../presentation/layout/Game";

export const Route = createFileRoute("/$roomId")({
    component: Game
});
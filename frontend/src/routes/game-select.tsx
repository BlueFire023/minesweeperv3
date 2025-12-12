import {createFileRoute} from '@tanstack/react-router'
import {MainMenu} from "../presentation/layout/MainMenu";

export const Route = createFileRoute('/game-select')({
    component: MainMenu,
});
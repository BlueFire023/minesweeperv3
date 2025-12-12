import { useNavigate } from "@tanstack/react-router";

export function Login() {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate({ to: '/game-select' })
    }

    return (
        <div className="flex flex-col text-white items-center h-screen">
            <button onClick={handleLogin}>login</button>
        </div>
    );
}
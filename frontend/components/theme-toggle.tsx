"use client";

import { Button } from "./ui/button"
import { useTheme } from "next-themes";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? 'Light mode' : 'Dark mode'}
        </Button>
    )
}

export default ThemeToggle

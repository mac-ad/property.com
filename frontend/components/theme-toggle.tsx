"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { useTheme } from "next-themes";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; 

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

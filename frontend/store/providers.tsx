"use client";

import { ThemeProvider } from "next-themes";
import { GlobalProvider } from "./global.context"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <GlobalProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="theme"
            >
                {children}
            </ThemeProvider>
        </GlobalProvider>
    )
}
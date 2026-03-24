"use client";

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";


interface GlobalContextType {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }

    return context;
}

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [email, setEmail] = useState<string>("");

    const value = useMemo(() => (
        { email, setEmail }
    ), [email, setEmail]);

    return (
        <GlobalContext.Provider value={value} >
            {children}
        </GlobalContext.Provider>
    )
}

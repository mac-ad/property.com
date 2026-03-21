"use client";

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";


interface GlobalContextType {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    suburbs: string[];
    propertyTypes: string[];
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

    const [suburbs, setSuburbs] = useState<string[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);


    const fetchSuburbs = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/suburbs`);
            const data = await response.json();
            setSuburbs(data?.data ?? []);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchPropertyTypes = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/property-types`);
            const data = await response.json();
            setPropertyTypes(data?.data ?? []);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchSuburbs();
        fetchPropertyTypes();
    }, [])



    const value = useMemo(() => (
        { email, setEmail, suburbs, propertyTypes }
    ), [email, setEmail, suburbs, propertyTypes]);

    return (
        <GlobalContext.Provider value={value} >
            {children}
        </GlobalContext.Provider>
    )
}

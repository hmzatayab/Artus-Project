import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { saveUser, getUser, removeUser } from "@/utils/storage";

interface User {
    id: string;
    email: string;
    username: string;
    name?: string;
    token?: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserDataContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getUser());

    useEffect(() => {
        if (user) {
            saveUser(user);
        } else {
            removeUser();
        }
    }, [user]);

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { saveUser, getUser, removeUser } from "@/utils/storage";
import { User, UserContextType } from "@/Types/User";

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

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: any; // Replace 'any' with a specific user type if available
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null); // Replace 'any' with a specific user type if available

    const login = async (username: string, password: string) => {
        // Implement login logic here
        // On successful login, set the user state
        setUser({ username }); // Example user object
    };

    const logout = () => {
        // Implement logout logic here
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
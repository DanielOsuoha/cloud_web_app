// src/types/index.ts

export interface Post {
    id: string;
    content: string;
    authorId: string;
    createdAt: Date;
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}
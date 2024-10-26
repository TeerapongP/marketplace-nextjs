import { Session } from "next-auth";

export default interface CustomSession extends Session {
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
        role?: number; // Optional
    };
}
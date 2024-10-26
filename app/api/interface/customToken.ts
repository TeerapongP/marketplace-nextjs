import { JWT } from "next-auth/jwt";

export default interface CustomToken extends JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    role?: number; // Optional if you might not always set it
}
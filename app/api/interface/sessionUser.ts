// Example of a SessionUser interface
export default interface SessionUser {
    id: string; // Add user ID
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: number; // Assuming role is a number; adjust as needed
    customToken?: string; // Include custom token if necessary
}

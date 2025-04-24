import React, { createContext, useState, useEffect} from "react";
import { auth } from '../firebase';

// Create context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Subscribe to Firebae auth changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    const signOut = () => auth.signOut();

    return (
        <AuthContext.Provider value={{ currentUser, signOut }}>
            {/* Render children only after loading is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};



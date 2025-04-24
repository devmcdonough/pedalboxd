import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../firebase";
import SearchItem from "../../shared/search-item/search-item";
import './settings-page.scss';

const SettingsPage = () => {

    const { currentUser } = useContext(AuthContext);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoritesDetails, setFavoritesDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5001/pedalboxd/us-central1/api";

    // Fetch the user's favorite pedal IDs from Firestore
    useEffect(() => {
        if (currentUser) {
            const userDocRef = db.collection("users").doc(currentUser.uid);
            userDocRef.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    setFavoriteIds(data.favoritePedals || []);
                }
                setLoading(false);
            }).catch((err) => {
                setError(err.message);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchFavoriteDetails = async () => {
            try {
                const promises = favoriteIds.map((id) =>
                fetch(`${API_BASE_URL}/pedals/${id}`)
                    .then(res => {
                        if (!res.ok) {;
                            throw new Error(`Error fetching pedal ${id}`)
                        }
                        return res.json();
                    })
            );
            const details = await Promise.all(promises);
            setFavoritesDetails(details);
            } catch (err) {
                console.error("Error fetching favorite details:", err);
                setError(err.message);
            }
        };

        if (favoriteIds.length > 0) {
            fetchFavoriteDetails();
        } else {
            // If there are no favorites, ensure favoriteDetails is empty
            setFavoritesDetails([]);
        }
    }, [favoriteIds, API_BASE_URL]);

    if (loading) {
        return <p>Loading Favorites...</p>
    }

    if (error) {
        return <p className="error">Error: {error}</p>;
    }

    return (
        <div className="settings-page">
            <h1>Settings</h1>
            <section className="settings-section">
                <h3>Account</h3>
                <div className="settings-item">
                    <label>Username: </label>
                    <input type="text" placeholder="Enter username" disabled />
                </div>
                <div className="settings-item">
                    <label>Email: </label>
                    <input type="text" placeholder="Enter email" disabled />
                </div>
            </section>
            <section className="settings-section">
                <h3>Preferences</h3>
                <div className="settings-item">
                    <label>
                        <input type="checkbox" disabled /> Enable Notifications
                    </label>
                </div>
            </section>
            <section className="settings-section">
                <h3>Favorites</h3>
                {favoriteIds.length > 0 ? (
                    <div className="favorites-list">
                        {favoritesDetails.map((pedal) => (
                            <SearchItem
                                key={pedal.id}
                                id={pedal.id}
                                image={pedal.Image_URL}
                                modelName={pedal.Model}
                                brandName={pedal.Brand}
                                pedalType={pedal.Type}
                                averageRating={pedal.Rating}
                            />
                        ))}
                        </div>
                ) : (
                    <p>No favorites added yet</p>
                )}
            </section>
        </div>
    )
}

export default SettingsPage;
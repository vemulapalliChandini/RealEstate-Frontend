import React, { useState, useEffect } from "react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Modal = ({ children, onClose }) => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "20px",
                    width: "80%",
                    height: "80%",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "-30px",
                        right: "10px",
                        background: "black",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                    }}
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

const CurrentLocation = ({ onCoordinatesFetched }) => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Automatically get current location on mount
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                    setShowModal(true);

                    // Pass coordinates to parent if needed
                    if (onCoordinatesFetched) {
                        onCoordinatesFetched(latitude, longitude);
                    }

                    // Automatically close the modal after 5 seconds
                    setTimeout(() => {
                        setShowModal(false);
                    }, 1000); // 5000ms = 5 seconds
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, [onCoordinatesFetched]); // Only run once on mount

    return (
        <div style={{ textAlign: "center", padding: "0px" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {showModal && position && (
                <Modal onClose={() => setShowModal(false)}>
                    <MapContainer
                        center={position}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position}>
                            <Popup>
                                You are here: <br />
                                Latitude: {position[0]}, Longitude: {position[1]}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Modal>
            )}
        </div>
    );
};
export default CurrentLocation;
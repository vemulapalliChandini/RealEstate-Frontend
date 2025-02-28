import React, { useEffect, useState } from "react";
import { Card, Tag, Button, Modal, Row, Col, Spin } from "antd";
import { _get } from "../../../Service/apiClient";
import "./Notification.css";

const Notification = ({ setNotificationCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({
        profilePicture: "",
        senderName: "",
        message: "",
        role: "",
    });

    const roleMapping = {
        0: "Admin",
        1: "Agent",
        2: "Seller",
        3: "Buyer",
        4: "Client",
        5: "CSR",
        6: "Marketing Agent",
    };

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await _get(`/activity/getNotifications`);
                if (response?.data) {
                    const filteredNotifications = response.data.filter(
                        (notification) => notification.receiverId === userId
                    );
                    setNotifications(filteredNotifications);
                    setNotificationCount(filteredNotifications.length);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, setNotificationCount]);

    const handleRemoveNotification = (index) => {
        const updatedNotifications = [...notifications];
        updatedNotifications.splice(index, 1);
        setNotifications(updatedNotifications);
        setNotificationCount(updatedNotifications.length);
    };

    const handleClearAll = () => {
        setNotifications([]);
        setNotificationCount(0);
    };

    const handleModalOpen = (notification) => {
        setModalData({
            profilePicture: notification.profilePicture,
            senderName: notification.senderName,
            message: notification.message,
            role: roleMapping[notification.role] || "Unknown Role",
            details: notification.details,
        });
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="notification-container">
            {loading ? (
                <Spin tip="Loading notifications..." style={{ display: "block", textAlign: "center", padding: "20px" }} />
            ) : notifications.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {notifications.map((notification, index) => (
                            <Col xs={24} sm={12} md={24} lg={24} key={index}>
                                <Card
                                    style={{
                                        background: notification.notifyType === "Property"
                                            ? "rgb(234 223 235)"
                                            : notification.notifyType === "Deal"
                                                ? "#BCDFF5"
                                                : "#C8F7E6",
                                        borderRadius: "10px",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",

                                    }}
                                    bodyStyle={{ padding: "15px" }}
                                    onClick={() => handleModalOpen(notification)}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Tag
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                marginRight: "10px",
                                            }}
                                        >
                                            {roleMapping[notification.role] || "Unknown Role"}
                                        </Tag>

                                        <img
                                            src={notification.profilePicture}
                                            alt={notification.senderName}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                marginRight: "15px",
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <strong>{notification.senderName}</strong>: {notification.message}
                                          
                                        </div>
                                    </div>
                                    <Button
                                        type="text"
                                        onClick={() => handleRemoveNotification(index)}
                                        style={{ position: "absolute", top: "5px", right: "5px", color: "red", fontSize: "18px", fontWeight: "bold" }}
                                    >
                                        ×
                                    </Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Button
                        onClick={handleClearAll}
                        style={{
                            display: "block",
                            margin: "20px auto",
                            borderRadius: "8px",
                            background: "#1890ff",
                            color: "#fff",
                        }}
                    >
                        Clear All
                    </Button>
                </>
            ) : (
                <Card style={{ textAlign: "center", padding: "20px" }}>
                    <span>No notifications</span>
                </Card>
            )}

            <Modal
                title="Notification Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                centered
                style={{
                    top: 300,
                    left:500,
                    zIndex: 2000, // Ensures it appears above other elements
                    position: "absolute",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <img
                        src={modalData.profilePicture}
                        alt={modalData.senderName}
                        style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            marginBottom: "10px",
                            border: "2px solid #f0f0f0",
                        }}
                    />
                    <p>
                        <strong>{modalData.senderName}</strong> ({modalData.role})
                    </p>
                    <p>{modalData.message}</p>
                    <p>{modalData.details}</p>
                    <Button type="primary" onClick={handleModalClose} style={{ marginTop: "10px" }}>
                        Close
                    </Button>
                </div>
            </Modal>

        </div>
    );
};

export default Notification;

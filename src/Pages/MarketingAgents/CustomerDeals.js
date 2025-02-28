
import React from "react";
import { Card, Row, Col, Typography, Button, Progress, Tag } from "antd";
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";

const { Title, Text } = Typography;

const CustomerDeals = () => {
    const properties = [
        {
            name: "Luxury Apartment in Downtown",
            type: "For Sale",
            status: "Available",
            listingDate: "2024-06-01",
            price: 500000,
            location: "Downtown, City Center",
            description: "A spacious 3-bedroom apartment with modern amenities.",
            views: 1250,
            inquiries: 800,
            shareUrl: "https://example.com/properties/luxury-apartment",
            customerReviews: 4.5,
            referralCode: "LUXURY2024",
        },
        {
            name: "Beachfront Villa in Malibu",
            type: "For Rent",
            status: "Available",
            listingDate: "2024-12-15",
            price: 20000,
            location: "Malibu Beach",
            description: "Exclusive villa with panoramic views of the ocean.",
            views: 3000,
            inquiries: 1500,
            shareUrl: "https://example.com/properties/beachfront-villa",
            customerReviews: 4.7,
            referralCode: "VILLA2024",
        },
    ];

    // Function to calculate remaining time
    const getRemainingTime = (listingDate) => {
        const now = new Date();
        const end = new Date(listingDate);
        const diff = end - now;

        if (diff <= 0) {
            return "Listing Expired";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${days}d ${hours}h ${minutes}m`;
    };

    return (
        <div style={{ padding: "20px" }}>
           
            <Row gutter={[16, 16]} justify="start">
                {properties.map((property, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: "15px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                                padding: "15px",
                                height: "380px",
                                backdropFilter: "blur(10px)",
                                backgroundColor: "rgba(173, 216, 230, 0.3)",
                            }}
                        >
                            <Title level={4}>{property.name}</Title>
                            <Text type="secondary">{property.type}</Text>
                            <Tag color={property.status === "Available" ? "green" : "red"}>
                                {property.status}
                            </Tag>

                            <div style={{ marginTop: "10px" }}>
                                <Text strong>Price: ${property.price}</Text>
                                <Text type="secondary" style={{ marginLeft: "10px" }}>
                                    Location: {property.location}
                                </Text>
                            </div>

                            <Text type="secondary" style={{ marginTop: "10px" }}>
                                {property.description}
                            </Text>

                            <div style={{ marginTop: "15px" }}>
                                <Progress
                                    percent={(property.inquiries / property.views) * 100}
                                    status="active"
                                    showInfo={false}
                                    style={{ marginBottom: "15px" }}
                                />
                                <Text type="secondary">Inquiries: {property.inquiries}</Text>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <Text type="secondary" style={{ marginLeft: "10px" }}>
                                    Time Left: {getRemainingTime(property.listingDate)}
                                </Text>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <Button type="primary" block style={{ marginBottom: "10px" }}>
                                    Contact Agent
                                </Button>
                                <Button
                                    type="link"
                                    block
                                    href={property.shareUrl}
                                    target="_blank"
                                >
                                    Share This Property
                                </Button>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <Text strong>Referral Code: {property.referralCode}</Text>
                                <div style={{ marginTop: "10px" }}>
                                    <FaFacebook
                                        size={24}
                                        color="#1877F2"
                                        style={{ marginRight: "10px" }}
                                    />
                                    <FaTwitter
                                        size={24}
                                        color="#1DA1F2"
                                        style={{ marginRight: "10px" }}
                                    />
                                    <FaWhatsapp
                                        size={24}
                                        color="#25D366"
                                        style={{ marginRight: "10px" }}
                                    />
                                    <FaInstagram size={24} color="#E4405F" />
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CustomerDeals;
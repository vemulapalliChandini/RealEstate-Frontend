
import React, { useState, useEffect } from "react";
import { _get } from "../../Service/apiClient";
import { Card, Row, Col, message, Typography, Tag, Pagination } from "antd";

const { Text } = Typography;

const MyArea = () => {
    const [properties, setProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8); // Number of cards per page
    const userId = localStorage.getItem("userId");

    const fetchData = async (Id) => {
        try {
            const response = await _get(`/marketingAgent/myAreaProperties/${Id}`);

            console.log("Full API Response:", response);
            console.log("Response data:", response.data);

            const fieldData = response?.data?.data?.fieldData;
            if (fieldData) {
                setProperties(fieldData);
            } else {
                console.error("Invalid response structure:", response.data);
                message.error("Failed to fetch properties. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            message.error("An error occurred while fetching properties.");
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData(userId);
        } else {
            console.error("User ID not found in localStorage");
            message.warning("User ID is missing. Please log in again.");
        }
    }, [userId]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedProperties = properties.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div style={{ padding: "20px", background: "#f0f2f5" }}>
            <Typography.Title
                level={3}
                style={{ textAlign: "center", marginBottom: "20px" }}
            >
                Properties
            </Typography.Title>
            <Row
                gutter={[16, 16]} // Gutter with equal spacing for both horizontal and vertical
                justify="start" // Align cards to the start of the row
            >
                {paginatedProperties.length > 0 ? (
                    paginatedProperties.map((property) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={property._id}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    position: "relative",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    height: "100%", // Ensures that cards are of equal height
                                }}
                                cover={
                                    <div style={{ position: "relative" }}>
                                        <img
                                            alt="Land"

                                            src={property.landDetails.images[0]}
                                            style={{
                                                height: "180px",
                                                width: "100%", // Adjust the width for proper scaling
                                                borderTopLeftRadius: "10px",
                                                borderTopRightRadius: "10px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        {/* <div
 style={{
 position: "absolute",
 bottom: 0,
 width: "100%",
 color: "white",
 textAlign: "center",
 padding: "5px",
 // background: "rgba(0, 0, 0, 0.5)",
 }}
 >
 <Text strong>{property.landDetails.title}</Text>
 </div> */}
                                    </div>
                                }
                            >
                                <Tag
                                    color="green"
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                        zIndex: 1,
                                    }}
                                >
                                    ₹{property.landDetails.price}
                                </Tag>
                                <div style={{ padding: "5px" }}>
                                    <Text strong>{property.landDetails.title}</Text>
                                    <br></br>
                                    <Text>
                                        <strong>Size:</strong> {property.landDetails.size} sq ft
                                    </Text>
                                    <br />
                                    <Text>
                                        <strong>District:</strong> {property.address.district}
                                    </Text>
                                </div>

                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col span={24}>
                        <Text>No properties found in your area.</Text>
                    </Col>
                )}
            </Row>
            <Row >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "100%",
                        zIndex: 1000,
                    }}
                >
                    <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={properties.length}
                    onChange={handlePageChange}
                />
                </div>

            </Row>
           
        </div>
    );
};

export default MyArea;


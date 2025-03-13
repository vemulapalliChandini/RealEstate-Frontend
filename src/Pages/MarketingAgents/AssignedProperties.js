
import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    message,
    Typography,
    Tag,
    Pagination,
    Checkbox,
    Button,
    Modal,
    DatePicker,
    Spin,
    Input,
    Empty,
} from "antd";

import {
    WhatsAppOutlined,
    FacebookOutlined,
    InstagramOutlined,
    MailOutlined,
    SendOutlined,
    SearchOutlined,
} from "@ant-design/icons";

import moment from "moment";
import { _get } from "../../Service/apiClient";
const { Text } = Typography;

const AssignedProperties = ({ selectedAgentId }) => {
    const [properties, setProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [nameSearchQuery2, setNameSearchQuery2] = useState("");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    
    useEffect(() => {
        const fetchData = async (date) => {
            try {
                const endpoint = date
                    ? `/marketingAgent/assignedProperty/${userId}/${role}?assignedDate=${date}`
                    : `/marketingAgent/assignedProperty/${userId}/${role}`;
    
                const response = await _get(endpoint);
    
                console.log(response.data);
                if (response?.data?.data) {
                    setProperties(response.data.data);
                } else {
                    setProperties([]);
                    message.error("Failed to fetch properties. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
                setProperties([]);
            }
        };
    
        if (userId) {
            fetchData(selectedDate);
        } else {
            message.warning("User ID is missing. Please log in again.");
        }
    }, [userId, selectedDate,role]);  // ✅ fetchData is removed from dependencies
    

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const formatPrice = (price) => {
        if (price == null) {
          return "N/A"; // Return 'N/A' or any other default value for invalid prices
        }
    
        if (price >= 1_00_00_000) {
          return (price / 1_00_00_000).toFixed(1) + "Cr"; // Convert to Crores
        } else if (price >= 1_00_000) {
          return (price / 1_00_000).toFixed(1) + "L"; // Convert to Lakhs
        } else if (price >= 1_000) {
          return (price / 1_000).toFixed(1) + "k"; // Convert to Thousands
        } else {
          return price.toString(); // Display as is for smaller values
        }
      };
    const handleSelectProperty = (propertyId) => {
        setSelectedProperties((prevSelected) =>
            prevSelected.includes(propertyId)
                ? prevSelected.filter((id) => id !== propertyId)
                : [...prevSelected, propertyId]
        );
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
        };

    const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : "";
    const isPropertyIdSearch = /\d/.test(nameSearch2);

    const filterItems = properties.filter((item) => {
        console.log(item.propertyID);
        console.log(nameSearch2);
        console.log(isPropertyIdSearch);
        const nameMatch = nameSearchQuery2 === ""
            ? true
            : isPropertyIdSearch
                ? item.propertyID && item.propertyID.toString().toLowerCase().includes(nameSearch2)
                : item.landTitle && item.landTitle.toLowerCase().includes(nameSearch2);
        const dateMatch = selectedDate
            ? item.assignedDate && item.assignedDate.split("T")[0] === selectedDate
            : true;


        return nameMatch && dateMatch;
    });

    const paginatedProperties = filterItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const shareProperties = async (contactType) => {
        if (selectedProperties.length === 0) {
            message.warning("No properties selected to share.");
            return;
        }

       

       

       

     
        setLoadingMessage("Sending...");

     
    };

    return (
        <div style={{ padding: "20px", position: "relative" }}>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",
                }}
            >
                <Row
                    gutter={16}
      justify="start"
                    style={{ marginBottom: "20px" }}
                >
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <Input
                            placeholder="Property Name / ID"
                            allowClear
                            onChange={(e) => {
                                console.log(e.target.value);
                                setNameSearchQuery2(e.target.value);
                            }}
                            style={{
                                width: "100%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={12}>
                        <div >
                            <DatePicker
                                onChange={handleDateChange}
                                style={{ width: "30%" }}
                                  disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5}>
                        {selectedProperties.length > 0 && (
                            <Button
                                type="primary"
                                style={{
                                    width: "50%",
                                    zIndex: 2,
                                    backgroundColor:"#0D416B",
                                    color:"white",
                                    marginLeft:"30%",
                                }}
                                onClick={showModal}
                            >
                                Share
                            </Button>
                        )}
                        {
                            selectedProperties.length === 0 && (
                                <Button
                                    type="primary"
                                    style={{
                                        width: "50%",
                                        zIndex: 2,
                                        backgroundColor: "lightgray",
                                        color: "gray",
                                        cursor: "not-allowed",
                                        border: "none",
                                        marginLeft:"30%",
                                    }}
                                    onClick={showModal}
                                    disabled // Disables the button functionality
                                >
                                    Share
                                </Button>
                            )
                        }

                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]} justify="start">
                {paginatedProperties.length > 0 ? (
                    paginatedProperties.map((property) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={property.propertyId}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    position: "relative",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    height: "100%",
                                }}
                                cover={
                                    <div style={{ position: "relative" }}>
                                        <img
                                            alt="Property"
                                            src={property.images[0]}
                                            style={{
                                                height: "180px",
                                                width: "100%",
                                                borderTopLeftRadius: "10px",
                                                borderTopRightRadius: "10px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Checkbox
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                            }}
                                            onChange={() =>
                                                handleSelectProperty(property.propertyId)
                                            }
                                            checked={selectedProperties.includes(
                                                property.propertyId
                                            )}
                                        />
                                    </div>
                                }
                            >
                                <Tag
                                    color="black"
                                    style={{
                                        position: "absolute",
                                        top: "1px",
                                        left: "1px",
                                        zIndex: 1,
                                    }}
                                >
                                    <span style={{fontSize:"18px"}}>₹{formatPrice(property.price)}</span>
                                </Tag>

                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <Text strong>{property.landTitle}({property.propertyID})</Text></Col>
                                        <Col span={12}>
                                            <Text
                                                strong
                                                style={{
                                                    marginLeft: "40%",
                                                    display: "block", // Ensures it behaves like a block element
                                                    maxWidth: "15ch", // Limits the width to 8 characters (roughly)
                                                    whiteSpace: "nowrap", // Prevents text from wrapping to the next line
                                                    overflow: "hidden", // Hides the overflow text
                                                    textOverflow: "ellipsis", // Adds ellipsis when the text overflows
                                                }}
                                            >
                                                {property.propertyType}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Text>
                                                <strong>Size:</strong> {property.size} {property.sizeUnit}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text>
                                                <strong style={{ marginLeft: "30%" }}>Price:</strong> {property.price}
                                            </Text>
                                        </Col>
                                    </Row>
                                    {/* <Text>
<strong>Assigned Date:</strong>{" "}
{moment(property.assignedDate).format("DD-MM-YYYY")}
</Text> */}
                                </div>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col span={24} style={{ marginTop: "2%" }}>
                        <Empty description="No Properties Assigned" />
                    </Col>
                )}
            </Row>

            <div style={{ marginTop: "20px", float:"right" }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={properties.length}
                    onChange={handlePageChange}
                />
            </div>

            <Modal
                title="Share"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                bodyStyle={{ height: "100px" }}
                centered
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        height: "70%",
                    }}
                >
                    <WhatsAppOutlined
                        style={{ fontSize: "30px", color: "#25D366" }}
                        onClick={() => shareProperties("whatsapp")}
                    />
                    <FacebookOutlined
                        style={{ fontSize: "30px", color: "#1877F2" }}
                        onClick={() => window.open("https://www.facebook.com", "_blank")}
                    />
                    <InstagramOutlined
                        style={{ fontSize: "30px", color: "#E1306C" }}
                        onClick={() => window.open("https://www.instagram.com", "_blank")}
                    />
                    <SendOutlined
                        style={{ fontSize: "30px", color: "#0088CC" }}
                        onClick={() => window.open("https://t.me", "_blank")}
                    />
                    <MailOutlined
                        style={{ fontSize: "30px", color: "#EA4335" }}
                        onClick={() => shareProperties("email")}
                    />
                </div>

                {isLoading && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Spin tip={loadingMessage} />
                        <Text>Sending.....</Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AssignedProperties;
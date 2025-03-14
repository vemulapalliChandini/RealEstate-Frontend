import React, { useState } from "react";
import { Card, Row, Col, Typography, Space } from "antd";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    PlusCircleOutlined,
 
    CloseOutlined,
} from "@ant-design/icons";
import CommercialForm from "../Agent/Commericial/CommercialForm";
import AddProperty from "../Agent/Agricultural/AddProperty";
import LayoutForm from "../Agent/Layout/LayoutForm";
import ResidentialForm from "../Agent/Residential/ResidentialForm";
// import { FaArrowLeft } from "react-icons/fa";

// Images for the cards

const Users = () => {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    const role = useState(localStorage.getItem('role'));
    const [showFormType, setShowFormType] = useState(null);

    const handleCardClick = (type) => {
        setShowFormType(type);
    };

    // const handleBackClick = () => {
    //     setShowFormType(null); // Hide form and show cards
    // };

    return (
        <div>
            {/* Show cards if no form is selected */}
            {showFormType === null && (
                <Row gutter={[48, 48]} justify="center" style={{ marginBottom: "20px", marginTop: "100px" }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            cover={<img alt="Agriculture" src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1737451744/images_yi7bub.jpg" style={{filter:"grayscale(40%)",height: "165px" }}/>}
                            onClick={() => handleCardClick('agriculture')}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(159, 159, 167, 0.23)",
                                textAlign: "center", // Center align text
                            }}
                        >
                            <Typography.Title level={4}>{t("landing.agricultural")}</Typography.Title>
                            <Space>
                                <PlusCircleOutlined style={{ color: "#0d416b" }} />
                                <span style={{ color: "#0D416B" }}>{t("dashboard.addproperty")}</span>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            cover={<img alt="Commercial" src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1736342693/dashboard_commercial_j6e4sz.jpg" style={{ height: "165px" }} />}
                            onClick={() => handleCardClick('commercial')}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(159, 159, 167, 0.23)",
                                textAlign: "center", // Center align text
                            }}
                        >
                            <Typography.Title level={4}>{t("landing.commercial")}</Typography.Title>
                            <Space>
                                <PlusCircleOutlined style={{ color: "#0d416b" }} />
                                <span style={{ color: "#0D416B" }}>{t("dashboard.addproperty")}</span>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            cover={<img alt="Layout" src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1736343836/dashboard_layout_l5admf.jpg" style={{ height: "165px" }} />}
                            onClick={() => handleCardClick('layout')}
                            style={{

                                backgroundColor: "rgba(159, 159, 167, 0.23)",
                                textAlign: "center", // Center align text
                            }}
                        >
                            <Typography.Title level={4}>{t("landing.layout")}</Typography.Title>
                            <Space>
                                <PlusCircleOutlined style={{ color: "#0d416b" }} />
                                <span style={{ color: "#0D416B" }}>{t("dashboard.addproperty")}</span>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            hoverable
                            cover={<img alt="Residential" src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1736343795/dashboard_residential_xih4qw.jpg" style={{ height: "165px" }} />}
                            onClick={() => handleCardClick('residential')}
                            style={{



                                backgroundColor: "rgba(159, 159, 167, 0.23)",
                                textAlign: "center", // Center align text
                            }}
                        >
                            <Typography.Title level={4}>{t("landing.residential")}</Typography.Title>
                            <Space>
                                <PlusCircleOutlined style={{ color: "#0d416b" }} />
                                <span style={{ color: "#0D416B" }}>{t("dashboard.addproperty")}</span>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Show back button when form is displayed */}
         

            {/* Show forms based on the selected card */}
            {showFormType === "commercial" && (
                <CommercialForm setShowFormType={setShowFormType} />
            )}
            {showFormType === "agriculture" && (
                <AddProperty setShowFormType={setShowFormType} />
            )}
            {showFormType === "layout" && (
                <LayoutForm setShowFormType={setShowFormType} />
            )}
            {showFormType === "residential" && (
                <ResidentialForm setShowFormType={setShowFormType} />
            )}

            {/* Close button for role !== "5" */}
            {role !== "5" && (
                <CloseOutlined
                    style={{
                        fontSize: "20px",
                        color: "red",
                        border: "1px solid black",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        padding: "5px",
                        float: "right",
                        marginTop: "15px",
                        marginRight: "40px",
                    }}
                    onClick={() => setShowFormType(null)}
                />
            )}
        </div>
    );
};

export default Users;

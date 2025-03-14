

import React, { useState, useEffect } from "react";
import { _get } from "../../../Service/apiClient";

import { Card, Button, Row, Col, Typography } from "antd";


import "./Plan.css";

import { EnvironmentOutlined, ExpandOutlined } from "@ant-design/icons";
import Payment from "./Payment";

const { Title, Text } = Typography;



const Plans = () => {
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleButtonClick = () => {
        setIsModalVisible(true); // Show the modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Hide the modal when canceled
    };



    //  Define Routes

    const [plans, setPlans] = useState([

        {
            title: "Basic",
            subtitle: "For Casual Browsers",
            price: " ₹199/month",
            features: [
                { text: "1 Listing", icon: "📜" },
                { text: "Basic Support", icon: "📞" },
                { text: "Ads Displayed", icon: "📺" },
                { text: "1 Listing", icon: "📜" },
                { text: "Basic Support", icon: "📞" },
                { text: "Ads Displayed", icon: "📺" },
            ],
            type: "basic",
            star: "✨",
            extraInfo: "Free trial, Limited access, Ads displayed",
            properties: [],
        },
        {
            title: "Standard",
            subtitle: "Perfect for Frequent Buyers",
            price: " ₹499/month",
            features: [
                { text: "10 Listings", icon: "📜" },
                { text: "Standard Support", icon: "📞" },
                { text: "Ads Displayed", icon: "📺" },
                { text: "10 Listings", icon: "📜" },
                { text: "Standard Support", icon: "📞" },
                { text: "Ads Displayed", icon: "📺" },
            ],
            type: "standard",
            star: "⭐",
            extraInfo: "Affordable plans, Reliable listings, Quality support",
            properties: [],
        },
        {
            title: "Premium",
            subtitle: "Ideal for Serious Buyers",
            price: " ₹999/month",
            features: [
                { text: "Unlimited Listings", icon: "📜" },
                { text: "Priority Support", icon: "📞" },
                { text: "Ad-Free Experience", icon: "🚫" },
                { text: "Unlimited Listings", icon: "📜" },
                { text: "Priority Support", icon: "📞" },
                { text: "Ad-Free Experience", icon: "🚫" },
            ],
            type: "premium",
            star: "💎",
            extraInfo: "Best agents support, Top-rated properties, Exclusive deals",
            properties: [],
            agentsSupport: {
                topAgent: {
                    name: " Premium Agent Support",
                    image: "https://via.placeholder.com/100", // Replace with the actual agent image URL
                },
            },
            bank: {
                service: "Bank Services Available",
                image: "https://via.placeholder.com/100", // Replace with the actual bank image URL
            },
            adFree: {
                icon: "🚫",
                text: "Ad-Free Listing View",
            },
        },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = plans.map(async (plan) => {
                    const response = await _get(
                        `/property/plansBasedProperties?type=${plan.type}`
                    );
                    return { ...plan, properties: response.data };
                });

                const updatedPlans = await Promise.all(promises);
                setPlans(updatedPlans);
            } catch (error) {
                console.error("Error fetching property data:", error);
            }
        };

        fetchData();
    }, []);





    return (
        <div className="landing-page-buyer-container">
            {/* Left Section */}
            <div className="landing-page-buyer">
                <div className="hero-section">
                    <Title level={2} style={{ textAlign: "center", color: "#fff" }}>
                        Find Your Dream Property
                    </Title>
                    <Text
                        style={{
                            textAlign: "center",
                            display: "block",
                            marginBottom: 20,
                            color: "#d1d1d1",
                        }}
                    >
                        Explore the best properties and choose a subscription plan that
                        suits you!
                    </Text>
                </div>
                <Row gutter={[16, 16]} justify="center">
                    {plans.map((plan, index) => (
                        <Col
                            xs={24}
                            sm={12}
                            md={8}
                            key={index}
                            onMouseEnter={() => setHoveredPlan(plan)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            <div className="glass-card">
                                <Card
                                    title={
                                        <>
                                            <Title
                                                level={4}
                                                style={{
                                                    color: "#fff",
                                                    fontFamily: "'Poppins', sans-serif",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                {plan.title}
                                                <span className="plan-star">{plan.star}</span>
                                            </Title>

                                            {/*  for subtitle */}

                                            <Text style={{ color: "#ddd" }}>{plan.subtitle}</Text>
                                        </>
                                    }
                                    bordered={false}
                                    hoverable
                                    className={`subscription-card`}
                                >
                                    <div className="plan-price">
                                        <Title level={3} style={{ color: "#fff" }}>
                                            {plan.price}
                                        </Title>
                                    </div>
                                    <ul className="plan-features">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="feature-item">
                                                <span className="feature-icon">{feature.icon}</span>
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* <Button
type="primary"
block
style={{
marginTop: 20,
width: "40%",
backgroundColor: "#0d416b",
}}
>
Choose Plan
</Button> */}

                                    {/* <Button
type="primary"
block
style={{
marginTop: 20,
width: "40%",
backgroundColor: "#0d416b",
}}
onClick={handleButtonClick} // Call the handleButtonClick function on click
>
Choose Plan
</Button> */}

                                    <Button
                                        type="primary"
                                        block
                                        style={{
                                            marginTop: 20,
                                            width: "40%",
                                            backgroundColor: "#0d416b",
                                        }}
                                        onClick={handleButtonClick} // Trigger navigation on button click
                                    >
                                        Choose Plan
                                    </Button>


                                </Card>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Right Section */}

            {/*  new code from here... */}

            <div className="hover-info">
                {hoveredPlan ? (
                    <div className="info-box">
                        <Title level={3} style={{ color: "#fff" }}>
                            {hoveredPlan.title}
                        </Title>

                        <Row gutter={[16, 16]}>
                            {hoveredPlan.properties.map((property, idx) => (
                                <Col xs={12} key={idx}>
                                    <Card
                                        hoverable
                                        cover={
                                            <div className="property-image-container">
                                                <div className="price-overlay">
                                                    <Text
                                                        style={{
                                                            color: "#fff",
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                            marginLeft: "-20%",
                                                        }}
                                                    >
                                                        ₹{property.totalPrice}
                                                    </Text>
                                                </div>
                                                <img
                                                    alt={property.name}
                                                    src={property.images}
                                                    className="property-image"
                                                />
                                            </div>
                                        }
                                        className="property-card"
                                    >
                                        <Row style={{ marginBottom: "8px" }}>
                                            <Title level={5} style={{ margin: 0, color: "white" }}>
                                                {property.name}
                                            </Title>

                                            <Row
                                                align="middle"
                                                justify="start"
                                                gutter={16}
                                                style={{ marginTop: "4px" }} // Adds spacing between lines
                                            >
                                                {/* Location */}
                                                <Col>
                                                    <Row align="middle" gutter={8}>
                                                        <Col>
                                                            <EnvironmentOutlined
                                                                style={{ color: "black", fontSize: "16px" }}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Text style={{ color: "white" }}>
                                                                {property.district}
                                                            </Text>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                {/* Size */}
                                                <Col>
                                                    <Row align="middle" gutter={8}>
                                                        <Col>
                                                            <ExpandOutlined
                                                                style={{ color: "black", fontSize: "16px" }}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Text style={{ color: "white" }}>
                                                                {property.size}
                                                            </Text>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Agent Support */}
                        <div className="agent-support" style={{ marginTop: "24px" }}>
                            <img
                                src="https://cdn-icons-png.freepik.com/256/17714/17714212.png?ga=GA1.1.786688213.1732196452&semt=ais_hybrid" // Replace with the actual agent image URL
                                alt="Top Agent"
                                style={{
                                    borderRadius: "50%",
                                    marginBottom: "8px",
                                    width: "15%",
                                }}
                            />
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                Premium Agent Support
                            </Text>
                        </div>

                        {/* Customer Support */}
                        <div className="customer-support">
                            <img
                                src="https://cdn-icons-png.freepik.com/256/4961/4961759.png?ga=GA1.1.786688213.1732196452&semt=ais_hybrid" // Replace with actual customer support image URL
                                alt="Customer Support"
                                style={{
                                    borderRadius: "50%",
                                    marginRight: "8px",
                                    verticalAlign: "middle",
                                    width: "15%",
                                }}
                            />
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                24/7 Customer Support
                            </Text>
                        </div>

                        {/* Bank Information */}

                        <div className="bank-info" style={{ marginTop: "12px" }}>
                            <img
                                src="https://cdn-icons-png.freepik.com/256/11539/11539372.png?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                                alt="Bank Services"
                                style={{
                                    borderRadius: "8px",
                                    marginRight: "8px",
                                    verticalAlign: "middle",
                                    width: "15%",
                                }}
                            />
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                Bank Services Available
                            </Text>
                        </div>
                    </div>
                ) : (
                    // <div className="info-placeholder">
                    //   <Text style={{ color: "#fff", fontSize: "16px" }}>
                    //     Discover the property across agriculture, residential, commercial,
                    //     layout.
                    //   </Text>
                    // </div>

                    <div className="info-placeholder">
                        <Row gutter={[16, 16]} justify="center">
                            {/* Agriculture Card */}
                            <Col xs={24} sm={12} lg={10}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                    bodyStyle={{
                                        padding: "0",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            height: "200px",
                                            backgroundImage: `url('https://img.freepik.com/free-photo/green-tea-bud-leaves-green-tea-plantations-sunny-morning_335224-952.jpg?ga=GA1.1.786688213.1732196452&semt=ais_tags_boosted')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* Overlay to darken the background */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjust the opacity here
                                                zIndex: 1,
                                            }}
                                        ></div>
                                        {/* Text on top */}
                                        <div
                                            style={{
                                                position: "relative",
                                                zIndex: 2,
                                                color: "#fff",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Agriculture
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            {/* Residential Card */}
                            <Col xs={24} sm={12} lg={10}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                    bodyStyle={{
                                        padding: "0",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            height: "200px",
                                            backgroundImage: `url('https://img.freepik.com/premium-photo/suburban-homes-modern-development_332679-26266.jpg?ga=GA1.1.786688213.1732196452&semt=ais_tags_boosted')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* Overlay to darken the background */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjust opacity here for darkness
                                                zIndex: 1,
                                            }}
                                        ></div>
                                        {/* Text on top */}
                                        <div
                                            style={{
                                                position: "relative",
                                                zIndex: 2,
                                                color: "#fff",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Residential
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            {/* Commercial Card */}
                            <Col xs={24} sm={12} lg={10}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                    bodyStyle={{
                                        padding: "0",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            height: "200px",
                                            backgroundImage: `url('https://img.freepik.com/free-photo/empty-brick-floor-with-modern-building-background_1359-728.jpg?ga=GA1.1.786688213.1732196452&semt=ais_tags_boosted')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* Overlay to darken the background */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjust opacity here for darkness
                                                zIndex: 1,
                                            }}
                                        ></div>
                                        {/* Text on top */}
                                        <div
                                            style={{
                                                position: "relative",
                                                zIndex: 2,
                                                color: "#fff",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Commercial
                                        </div>
                                    </div>
                                </Card>
                            </Col>

                            {/* Layout Card */}
                            <Col xs={24} sm={12} lg={10}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                    bodyStyle={{
                                        padding: "0",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            height: "200px",
                                            backgroundImage: `url('https://img.freepik.com/free-photo/view-land-plot-real-estate-business-development_23-2149916725.jpg?ga=GA1.1.786688213.1732196452&semt=ais_tags_boosted')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                                zIndex: 1,
                                            }}
                                        ></div>
                                        {/* Text on top */}
                                        <div
                                            style={{
                                                position: "relative",
                                                zIndex: 2,
                                                color: "#fff",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Layout
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
            {isModalVisible && (
                <Payment
                    isModalVisible={isModalVisible}
                    handleCancel={handleCancel}
                />
            )}
        </div>

    );
};

export default Plans;
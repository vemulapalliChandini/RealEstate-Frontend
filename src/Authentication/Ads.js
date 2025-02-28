import React from "react";
import { Row, Col, Card } from "antd";

const Ads = () => {
    return (
        <Row
            gutter={[16, 16]}
            justify="center"
            align="top"
            style={{ marginTop: 100, marginLeft: 30, marginBottom: 10 }}
        >
            {/* Card 1: Top Agents */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                    }}
                    cover={
                        <img
                            alt="Top Agents"
                            src="https://img.freepik.com/free-photo/businessman-black-suit-makes-thumbs-up_114579-15900.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
                        >
                            Meet the Best Agents
                        </h2>
                    </div>
                </Card>
            </Col>

            {/* Card 2: Marketing Experts */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        marginLeft: 30,
                    }}
                    cover={
                        <img
                            alt="Top Marketing Agents"
                            src="https://img.freepik.com/free-photo/medium-shot-men-holding-smartphone_23-2150208243.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "15px", fontWeight: "bold" }}
                        >
                            Expert Marketing Agents
                        </h2>
                    </div>
                </Card>
            </Col>

            {/* Card 3: Top Property Listings */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        marginLeft: 30,
                    }}
                    cover={
                        <img
                            alt="Top Property Listings"
                            src="https://static.99acres.com/universalhp/img/d_hp_availability_2.webp"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
                        >
                            Explore Premium Listings
                        </h2>
                    </div>
                </Card>
            </Col>

            {/* Card 4: Variety of Properties */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        marginLeft: 30,
                    }}
                    cover={
                        <img
                            alt="Variety of Properties"
                            src="https://img.freepik.com/free-photo/couple-traveling-with-vaccination-passports_23-2149351530.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
                        >
                            Discover Diverse Properties
                        </h2>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default Ads;

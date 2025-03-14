import React from "react";
import { Row, Col, Card } from "antd";
import "./Styles/Ads.css"; // Import the separate CSS file

const Ads = () => {
    return (
        <Row className="ads-row">
            {[
                {
                    title: "Meet the Best Agents",
                    imgSrc:
                        "https://img.freepik.com/free-photo/businessman-black-suit-makes-thumbs-up_114579-15900.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
                },
                {
                    title: "Expert Marketing Agents",
                    imgSrc:
                        "https://img.freepik.com/free-photo/medium-shot-men-holding-smartphone_23-2150208243.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
                },
                {
                    title: "Explore Premium Listings",
                    imgSrc:
                        "https://static.99acres.com/universalhp/img/d_hp_availability_2.webp",
                },
                {
                    title: "Discover Diverse Properties",
                    imgSrc:
                        "https://img.freepik.com/free-photo/couple-traveling-with-vaccination-passports_23-2149351530.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
                },
            ].map((ad, index) => (
                <Col key={index} span={6}>
                    <Card className="ad-card" cover={<img alt={ad.title} src={ad.imgSrc} />} >
                        <div className="ad-overlay">
                            <h2 className="ad-title">{ad.title}</h2>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default Ads;

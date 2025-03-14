import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "antd";
import Option from "./Option";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import "./Styles/Buy.css"; // Import the external CSS file

const Buy = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const fullText = "Journey to Find Your Property Begins Here......";

  const handleLoginClose = () => {
    setIsLoginVisible(false);
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText[index]);
      index += 1;
      if (index === fullText.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LoginPage visible={isLoginVisible} handleLoginClose={handleLoginClose} />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <div className="buy-hero">
            <img
              src="https://www.realestatemy.com/wp-content/uploads/2017/06/Five-Considerations-When-Buying-Your-First-Investment-Property-min.jpg"
              alt="Dream Home"
              className="buy-hero-img"
            />
            <div className="buy-hero-overlay" />
            <div className="buy-hero-text">
              <h1>{text}</h1>
            </div>
          </div>
        </Col>
      </Row>

      <div className="buy-info">
        <Card className="buy-info-card">
          <h3>
            Discover Your Perfect Property with Confidence! Whether you're a
            first-time homebuyer or looking for an investment opportunity, we
            provide expert guidance every step of the way. Trust our experienced
            agents to help you find the ideal property that suits your needs and
            budget. Start your property journey with us today!
          </h3>
          <button
            className="buy-find-agents-btn"
            onClick={() => navigate("/findanagent")}
          >
            Find Agents
          </button>
        </Card>

        <h1 className="buy-heading">Find and Own Your Dream Home......</h1>

        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738061473/modern-minimalist-office_23-2151780708_kclnve.jpg"
              alt="Office"
              className="buy-office-img"
            />
          </Col>
          <Col xs={24} md={12}>
            <p className="buy-text">
              Discover the best places to live or work with the help of our expert
              agents. Explore properties that match your lifestyle and needs.
            </p>
            <Button
              type="primary"
              className="buy-explore-btn"
              onClick={() => setIsLoginVisible(true)}
            >
              Explore Buying
            </Button>
          </Col>
        </Row>

        <h1 className="buy-latest-properties-heading">Latest Properties</h1>
        <Option />

        <Row gutter={[16, 16]} className="buy-properties-row">
          <Col xs={24} md={12} className="buy-property-col">
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738064152/download_njkmni.jpg"
              alt="Commercial Property"
              className="buy-property-img"
            />
            <div className="buy-property-overlay">
              <h1>Commercial Property</h1>
              <p>A perfect place to build your future. Explore more.</p>
              <button
                className="buy-property-btn"
                onClick={() => setIsLoginVisible(true)}
              >
                Explore More
              </button>
            </div>
          </Col>
          <Col xs={24} md={12} className="buy-property-col">
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738064098/modern-house_yk2s61.png"
              alt="Residential Property"
              className="buy-property-img"
            />
            <div className="buy-property-overlay">
              <h1>Residential Property</h1>
              <p>Explore from Apartments, builder floors, villas and more</p>
              <button
                className="buy-property-btn"
                onClick={() => setIsLoginVisible(true)}
              >
                Explore More
              </button>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="buy-properties-row">
          <Col xs={24} md={12} className="buy-property-col">
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738065207/images_3_ool8ul.jpg"
              alt="Layout Property"
              className="buy-property-img"
            />
            <div className="buy-property-overlay">
              <h1>Layout Property</h1>
              <p>A perfect place to build to find your Plots. Explore more.</p>
              <button
                className="buy-property-btn"
                onClick={() => setIsLoginVisible(true)}
              >
                Explore More
              </button>
            </div>
          </Col>
          <Col xs={24} md={12} className="buy-property-col">
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738065241/sprawling-agricultural-farm-featuring-fields-of-crops-ai-generated-photo_osvwfp.jpg"
              alt="Agricultural Property"
              className="buy-property-img"
            />
            <div className="buy-property-overlay">
              <h1>Agricultural Property</h1>
              <p>A perfect place for farming. Explore more.</p>
              <button
                className="buy-property-btn"
                onClick={() => setIsLoginVisible(true)}
              >
                Explore More
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Buy;

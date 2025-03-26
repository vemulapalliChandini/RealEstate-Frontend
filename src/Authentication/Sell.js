import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import Options from "./Options";
import "./Styles/Sell.css"
const Sell = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const navigate = useNavigate();
  const handleLoginClose = () => {
    setIsLoginVisible(false);
  };
  const [text, setText] = useState('');
  const fullText = "Sell your Property With a Confidence....";

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
      <LoginPage
        visible={isLoginVisible}
        handleLoginClose={handleLoginClose}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <div >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLVwu6zklJzYJwUAkXsV4mqAS9Zc6dzH4RmA&s"
              alt="Dream Home"
              className="banner-img"
            />
            <div
              className="banner-overlay"
            />
            <div className="banner-text">
              <h1 className="banner-heading">{text}</h1>
            </div>

          </div>
        </Col>
      </Row>
      <div >
      <Card hoverable className="property-card1">
  <h3 className="property-card-text">
    "Sell Your Property with Confidence! Whether you're a first-time seller or looking to make a profitable sale, we provide expert guidance every step of the way. Trust our experienced agents to help you showcase your property in the best light and get the best value. Start your selling journey with us today and make your property stand out to the right buyers!"
  </h3>
  <button className="find-agent-button" onClick={() => navigate("/findanagent")}>
    Find Agents
  </button>
</Card>

        <h1 className="heading">
          Post Your Property Here in 3 Simple Steps
        </h1>
        <Row gutter={[16, 16]} style={{ marginLeft: "3%" }}>
          <Col xs={5} md={8} xl={8}>
            <p className="details">
              <b>01.Add Details Of your Property</b><br></br>
              <p>Tell us the Unique Features of the Property such that the users can attract and also all the details about your property</p>
            </p>

          </Col>
          <Col xs={5} md={8} xl={8}>

            <p className="details">
              <b>02.Upload Photos and Videos</b><br></br>
              <p>Upload neat and clean Videos and photos of your property </p>
            </p>

          </Col>
          <Col xs={5} md={8} xl={8}>

            <p className="details">
              <b>03.Add Pricing and OwnerShip</b><br></br>
              <p>Just update your property's ownership details and your expected price and your property is ready for posting </p>
            </p>

          </Col>
        </Row>
        <Button
          type="primary"
          style={{
            marginTop: "20px",
            backgroundColor: "#0D416B",
            borderColor: "#0D416B",
            fontSize: "16px",
            padding: "10px 20px",
            marginLeft: "38%",
          }}
          onClick={() => {
            setIsLoginVisible(true);
          }}
        >
          Begin To Post Your Property
        </Button>
       
        <Options />
        <Row gutter={[16, 16]} style={{ marginTop: "5%", paddingLeft: "100px", paddingRight: "100px" }}>
          <Col xs={24} md={12} >
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738064152/download_njkmni.jpg"
              alt="Dream Home"
              className="buy-property-img"

              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div className="buy-property-overlay">

              <h1 style={{ marginBottom: "10px" }}>Commercial Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Offering an ideal location for growth and success. Grab this opportunity to own the future.
              </p>
              <button
                className="buy-property-btn"

                onClick={() => {
                  setIsLoginVisible(true);
                }}
              >
                Post Your Property
              </button>
            </div>
          </Col>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738064098/modern-house_yk2s61.png" // Replace with your image URL
              alt="Dream Home"
              className="buy-property-img"

              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div className="buy-property-overlay">

              <h1 style={{ marginBottom: "10px" }}>Residential Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Offering premium apartments, builder floors, villas, and more—perfect for your next investment.
              </p>

              <button
                className="buy-property-btn"

                onClick={() => {
                  setIsLoginVisible(true);
                }}
              >
                Post Your Property
              </button>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{paddingLeft: "100px", paddingRight: "100px",marginTop:"3%" }}>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738065207/images_3_ool8ul.jpg" // Replace with your image URL
              alt="Dream Home"
              className="buy-property-img"

              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div className="buy-property-overlay">

              <h1 style={{ marginBottom: "10px" }}>Layout Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Offering well-planned plots in prime locations—an ideal opportunity to build your dream project.
              </p>

              <button
                className="buy-property-btn"
                onClick={() => {
                  setIsLoginVisible(true);
                }}
              >
                Post Your Property
              </button>
            </div>
          </Col>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738065241/sprawling-agricultural-farm-featuring-fields-of-crops-ai-generated-photo_osvwfp.jpg" // Replace with your image URL
              alt="Dream Home"
              className="buy-property-img"

              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div className="buy-property-overlay">

              <h1 style={{ marginBottom: "10px" }}>Agricultural Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Fertile land available—perfect for farming and agricultural ventures. Don’t miss this opportunity.
              </p>

              <button
                className="buy-property-btn"

                onClick={() => {
                  setIsLoginVisible(true);
                }}
              >
                Post Your Property
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Sell;

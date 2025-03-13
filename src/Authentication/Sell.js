import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "antd";
import Option from "./Option";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
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
          <div style={{ position: "relative", width: "100%", height: "350px" }}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLVwu6zklJzYJwUAkXsV4mqAS9Zc6dzH4RmA&s"
              alt="Dream Home"
              style={{
                width: "100%",
                height: "430px",
                objectFit: "cover",
                borderRadius: "10px",
                marginTop: "-2%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "440px",
                backgroundColor: "rgba(0, 0, 0, 0.3)", 
                borderRadius: "10px",
                marginTop: "-2%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgb(0,0,0,0.5)",
                color: "#FFFFFF",
                textAlign: "center",
                padding: "10px 20px",
                borderRadius: "10px",
              }}
            >
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: 0,
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  display: "inline-block", 
                }}
              >
                {text}
              </h1>
            </div>
          </div>
        </Col>
      </Row>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        <Card
          hoverable
          style={{
            width: '80%',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginLeft: "10%",
            marginBottom: "2%",
            marginTop:"-3%",
            backgroundColor: "rgb(248, 250, 255)"
          }}>
          <h3 style={{ marginLeft: "40px", marginRight: "40px", color: "#0D416b" }}>
            "Sell Your Property with Confidence! Whether you're a first-time seller or looking to make a profitable sale, we provide expert guidance every step of the way. Trust our experienced agents to help you showcase your property in the best light and get the best value. Start your selling journey with us today and make your property stand out to the right buyers!"
          </h3>
          <button
            style={{
              padding: "8px 15px",
              backgroundColor: "#0d416b",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "40%",
              marginBottom: "2%",
            }}
            onClick={() => navigate("/findanagent")} 
          >
            Find Agents
          </button>
        </Card>
        <h1 style={{ fontWeight: "bold", marginLeft: "25%", fontSize: "40px" }}>
          Post Your Property Here in 3 Simple Steps
        </h1>
        <Row gutter={[16, 16]} style={{ marginLeft: "3%" }}>
          <Col xs={5} md={8} xl={8}>
            <p style={{ fontSize: "18px", color: "black", marginTop: "10px", marginRight: "27%" }}>
              <b>01.Add Details Of your Property</b><br></br>
              <p>Tell us the Unique Features of the Property such that the users can attract and also all the details about your property</p>
            </p>

          </Col>
          <Col xs={5} md={8} xl={8}>

            <p style={{ fontSize: "18px", color: "black", marginTop: "10px", marginRight: "27%" }}>
              <b>02.Upload Photos and Videos</b><br></br>
              <p>Upload neat and clean Videos and photos of your property </p>
            </p>

          </Col>
          <Col xs={5} md={8} xl={8}>

            <p style={{ fontSize: "18px", color: "black", marginTop: "10px", marginRight: "27%" }}>
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
        <h1 style={{ fontSize: "23px", fontWeight: "bold", marginLeft: "40%", marginTop: "2%" }}>
          Recently Posted Properties
        </h1>
        <Option />
        <Row gutter={[16, 16]} style={{ marginTop: "5%", paddingLeft: "100px", paddingRight: "100px" }}>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738064152/download_njkmni.jpg" 
              alt="Dream Home"
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "10px",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)"; 
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)"; 
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",

              }}
            >
              <h1 style={{ marginBottom: "10px" }}>Commercial Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Offering an ideal location for growth and success. Grab this opportunity to own the future.
              </p>
              <button
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#0d416b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
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
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "10px",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",

              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h1 style={{ marginBottom: "10px" }}>Residential Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Offering premium apartments, builder floors, villas, and more—perfect for your next investment.
              </p>

              <button
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#0d416b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsLoginVisible(true);
                }}
              >
                Post Your Property
              </button>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "3%", paddingLeft: "100px", paddingRight: "100px" }}>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <img
              src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738065207/images_3_ool8ul.jpg" // Replace with your image URL
              alt="Dream Home"
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "10px",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",

              }}
            >
              <h1 style={{ marginBottom: "10px" }}>Layout Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Offering well-planned plots in prime locations—an ideal opportunity to build your dream project.
              </p>

              <button
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#0d416b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
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
              style={{
                width: "100%",
                height: "350px",
                borderRadius: "10px",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",

              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)"; 
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)"; 
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h1 style={{ marginBottom: "10px" }}>Agricultural Property for Sale</h1>
              <p style={{ marginBottom: "10px" }}>
                Fertile land available—perfect for farming and agricultural ventures. Don’t miss this opportunity.
              </p>

              <button
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#0d416b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
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

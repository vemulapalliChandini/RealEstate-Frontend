import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "antd";
import Option from "./Option";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";

const Buy = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const navigate=useNavigate();
  
   const handleLoginClose = () => {
    setIsLoginVisible(false);
  };
  const [text, setText] = useState('');
  const fullText = "Journey to Find Your Property Begins Here......";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText[index]);
      index += 1;
      if (index === fullText.length) {
        clearInterval(interval); // Stop when the full text is displayed
      }
    }, 100); // Adjust the speed of the animation (milliseconds)
    
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <LoginPage
          visible={isLoginVisible}
          handleLoginClose={handleLoginClose}
        />
      <Row gutter={[16, 16]}>
        {/* Left Column: Image with Text Overlay */}
        <Col xs={24} md={24}>
  <div style={{ position: "relative", width: "100%", height: "350px" }}>
    {/* Image */}
    <img
      src="https://www.realestatemy.com/wp-content/uploads/2017/06/Five-Considerations-When-Buying-Your-First-Investment-Property-min.jpg"
      alt="Dream Home"
      style={{
        width: "100%",
        height: "440px",
        objectFit: "cover",
        borderRadius: "10px",
        marginTop: "-2%",
      }}
    />

    {/* Black Overlay */}
    <div
      style={{
        position: "absolute",
        top: "0px",
        left: 0,
        width: "100%",
        height: "440px",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Black color with opacity
        borderRadius: "10px",
        marginTop:"-2%"
      }}
    />

    {/* Overlay Text */}
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
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
          whiteSpace: "nowrap", // Prevents the text from wrapping
          overflow: "hidden",   // Hides the overflow until it appears
          display: "inline-block", // Keeps the text as a block so we can manipulate it
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
        marginLeft:"10%",
        marginBottom:"2%",
        marginTop:"-5%",
         backgroundColor: "rgb(248, 250, 255)"
      }}>
      <h3 style={{marginLeft:"40px",marginRight:"40px",color:"#0D416b"}}>
  Discover Your Perfect Property with Confidence! Whether you're a first-time homebuyer or looking for an investment opportunity, we provide expert guidance every step of the way. Trust our experienced agents to help you find the ideal property that suits your needs and budget. Start your property journey with us today!
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
      onClick={() => navigate("/findanagent")} // Use an arrow function to pass the navigate action
    >
      Find Agents
    </button>
      </Card>
       <h1 style={{ fontWeight: "bold",marginLeft:"10%" }}>
            Find and Own Your Dream Home......
          </h1>
         
      <Row gutter={[16, 16]} align="middle">
        {/* Left Column: Image */}
        <Col xs={24} md={12}>
  <img
    src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738061473/modern-minimalist-office_23-2151780708_kclnve.jpg" // Replace with your image URL
    alt="Dream Home"
    style={{
      width: "85%",
      borderRadius: "10px",
      marginLeft: "14%",
      objectFit: "cover",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease-in-out", // Add transition for smooth zoom effect
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.1)"; // Zoom in on hover
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)"; // Zoom out when hover ends
    }}
  />
</Col>


        {/* Right Column: Text and Button */}
        <Col xs={24} md={12}>
         
          <p style={{ fontSize: "25px", color: "#4A4A4A", marginTop: "10px",marginRight:"27%"}}>
            Discover the best places to live or work with the help of our expert agents. Explore properties that match your lifestyle and needs.
          </p>
          <Button
            type="primary"
            style={{
              marginTop: "20px",
              backgroundColor: "#0D416B",
              borderColor: "#0D416B",
              fontSize: "16px",
              padding: "10px 20px",
              marginLeft:"25%",
            }}
            onClick={() => {
              setIsLoginVisible(true);
            }}
          >
            Explore Buying
          </Button>
        </Col>
      </Row>
      <h1 style={{ fontSize: "23px", fontWeight: "bold", marginLeft:"40%",marginTop:"2%"}}>
                Latest Properties
              </h1>
      <Option />
      <Row gutter={[16, 16]} style={{ marginTop: "5%",paddingLeft:"100px",paddingRight:"100px"}}>
  {/* First Column */}
  <Col xs={24} md={12} style={{ position: "relative" }}>
    <img
      src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738064152/download_njkmni.jpg" // Replace with your image URL
      alt="Dream Home"
      style={{
        width: "100%",
        height: "350px",
        borderRadius: "10px",
        objectFit: "cover",
        transition: "transform 0.3s ease-in-out", 
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.1)"; // Zoom in on hover
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)"; // Zoom out when hover ends
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
      <h1 style={{ marginBottom: "10px" }}>Commercial Property</h1>
      <p style={{ marginBottom: "10px" }}>
        A perfect place to build your future. Explore more.
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
        Explore More
      </button>
    </div>
  </Col>

  {/* Second Column */}
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
        e.target.style.transform = "scale(1.1)"; // Zoom in on hover
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)"; // Zoom out when hover ends
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
      <h1 style={{ marginBottom: "10px" }}>Residential Property</h1>
      <p style={{ marginBottom: "10px" }}>
      Explore from Apartments, builder floors, villas and more
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
        Explore More
      </button>
    </div>
  </Col>
</Row>
<Row gutter={[16, 16]} style={{ marginTop: "3%",paddingLeft:"100px",paddingRight:"100px"}}>
  {/* First Column */}
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
        e.target.style.transform = "scale(1.1)"; // Zoom in on hover
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)"; // Zoom out when hover ends
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
      <h1 style={{ marginBottom: "10px" }}>Layout Property</h1>
      <p style={{ marginBottom: "10px" }}>
        A perfect place to build to find your Plots. Explore more.
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
        Explore More
      </button>
    </div>
  </Col>

  {/* Second Column */}
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
        e.target.style.transform = "scale(1.1)"; // Zoom in on hover
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)"; // Zoom out when hover ends
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
      <h1 style={{ marginBottom: "10px" }}>Agricultural Property</h1>
      <p style={{ marginBottom: "10px" }}>
      A perfect place for farming. Explore more.
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

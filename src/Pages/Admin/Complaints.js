import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";


const Complaints = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // or wherever you get the role

  // const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
    
      <Row
        gutter={[48, 48]}
        justify="center"
        style={{ marginBottom: "20px", marginTop: "20px" }}
      >
        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onClick={() => {
              const role = 1;
              // navigate("BuyerComplaints/${role}");
              navigate(`AgentComplaints/${role}`); // Ensure this matches the route
            }}
          >
            <h2>Agents</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onClick={() => {
              // navigate("/dashboard/admin/buyers")
              const role = 3;
              navigate(`BuyerComplaints/${role}`);
            }}
          >
            <h2>Buyers</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onClick={() => {
              const role = 2;
              navigate(`SellerComplaints/${role}`);
            }}
          >
            <h2>Sellers</h2>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              background:
                "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onClick={() => {
              const role = 4;

              navigate(`ClientComplaints/${role}`); // Ensure this matches the route
            }}
          >
            <h2>Estate Clients</h2>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Complaints;

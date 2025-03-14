import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";



const Users = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "90px" }}>

      <Row
        gutter={[48, 48]}
        justify="center"
        style={{ marginBottom: "20px", marginTop: "5px" }}
      >



        <Col xs={24} sm={12} md={6}>
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
            onClick={() => navigate("/dashboard/admin/agents")}
          >
            <h2>Agents</h2>
          </Card>
        </Col>



        <Col xs={24} sm={12} md={6}>
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
            onClick={() => navigate("/dashboard/admin/buyers")}
          >
            <h2>Buyers</h2>
          </Card>
        </Col>





        <Col xs={24} sm={12} md={6}>
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
            onClick={() => navigate("/dashboard/admin/sellers")}
          >
            <h2>Sellers</h2>
          </Card>
        </Col>



        <Col xs={24} sm={12} md={6}>
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
            onClick={() => navigate("/dashboard/admin/clients")}
          >
            <h2>Estate Clients</h2>
          </Card>
        </Col>



        {/*  CSR */}

        <Col xs={24} sm={12} md={6}>
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
            onClick={() => navigate("/dashboard/admin/csr")}
          >
            <h2>CSR</h2>
          </Card>
        </Col>

        {/* Marketing Agent */}

        <Col xs={24} sm={12} md={8}>
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
            onClick={() => navigate("/dashboard/admin/marketingagent")}
          >
            <h2>Marketing Agent</h2>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Users;

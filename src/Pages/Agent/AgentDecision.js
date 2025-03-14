import React from 'react';
import { Row, Col, Card } from 'antd';


const AgentDecision = () => {
  const handleBuy = () => {
    localStorage.setItem("agentrole",11);
    window.location.reload();  
  };

  const handleSell = () => {
    localStorage.setItem("agentrole", 12);
    window.location.reload();  
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px',marginTop:"2%"}}>
        <h1>Hello, {localStorage.getItem("name")}! 👋</h1>
        <h3>What would you like to do today?</h3>
      </div>

      {/* Grid Layout for Cards */}
      <Row gutter={16} justify="center" align="top" >
        {/* Buy Property Card */}
        <Col xs={24} sm={12} md={7}>
          <Card
            hoverable
            cover={
              <img
                alt="Buy Property"
                src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1737710453/sellersideimage_b6hrz4.jpg"
                style={{ borderRadius: '10px 10px 0 0',height:"155px" }}
              />
            }
            onClick={handleBuy}
            style={{ cursor: 'pointer',borderRadius:"24px" }}
          >
            <h2 style={{textAlign:"center",color:"#0D416B"}}>Buy a Property</h2>
            <p style={{textAlign:"center"}}>Find your dream property to buy!</p>
          </Card>
        </Col>

        {/* Sell Property Card */}
        <Col xs={24} sm={12} md={7}>
          <Card
            hoverable
            cover={
              <img
                alt="Sell Property"
                src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1737710436/buyersideimage_fmdcb4.jpg"
                style={{ borderRadius: '10px 10px 0 0' }}
              />
            }
            onClick={handleSell}
            style={{ cursor: 'pointer',borderRadius:"24px" }}
          >
            <h2 style={{textAlign:"center",color:"#0D416B"}}>Sell a Property</h2>
            <p style={{textAlign:"center"}}>Ready to sell your property? Let's get started!</p>
          </Card>
        </Col>
      </Row>

     
    </div>
  );
};

export default AgentDecision;

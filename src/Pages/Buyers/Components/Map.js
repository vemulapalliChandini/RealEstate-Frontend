import React from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { Card, Col, Row } from "antd";

function MapComponent(props) {
  return (
    <Card title="Location" style={{ height: "450px" }}>
      <Row>
        <Col span={24}>
          <Map
            google={props.google}
            style={{ height: "350px" }}
            zoom={10}
            initialCenter={{
              lat: 18.030655,
              lng: 83.49369,
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(MapComponent);
















//   Real Estate Companies

// Real estate websites use Google Analytics to monitor user engagement, property searches, and conversions on property inquiries or sign-ups.

// Zillow
// Realtor.com
// Trulia
// Redfin

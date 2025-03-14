import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Card, Col, Row } from "antd";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const center = {
  lat: 18.030655,
  lng: 83.49369,
};

function MapComponent() {
  return (
    <Card title="Location" style={{ height: "450px" }}>
      <Row>
        <Col span={24}>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} />
          </LoadScript>
        </Col>
      </Row>
    </Card>
  );
}

export default MapComponent;

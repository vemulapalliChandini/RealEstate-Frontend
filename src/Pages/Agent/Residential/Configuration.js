import React, { useState } from "react";
import {
  Form,
  Card,
  Row,
  Col,
  InputNumber,
  Switch,
  Input,
  Checkbox,
  Grid,
} from "antd";
import "./Residential.css";
const { useBreakpoint } = Grid;
export default function Configuration({ setExtraAmmenitiesData }) {
  const screens = useBreakpoint();
  const [dynamicFields, setDynamicFields] = useState([]);

 
  setExtraAmmenitiesData(dynamicFields);
  return (
    <>
      <Row>
        <Col span={24}>
          <Card
            title="Configurations"
            className="form-card"
            style={{
              marginBottom: "20px",
              border: "1px solid #808080",
              paddingLeft: "15px",
              height: "94%",
            }}
          >
            <Row gutter={16} style={{ marginBottom: "10px" }}>
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  label="Bathrooms Count"
                  name="bathroomCount"
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                >
                  <InputNumber
                    placeholder="Enter no of Bathrooms"
                    min={0}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid lightgrey",
                    }}
                  />
                </Form.Item>
              </Col>
             
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Balcony Count"
                  name="balconyCount"
                >
                  <InputNumber
                    placeholder="Enter no of Balconies"
                    min={0}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid lightgrey",
                    }}
                  />
                </Form.Item>
              </Col>
             
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Floor Number"
                  name="floorNumber"
                >
                  <InputNumber
                    placeholder="Please Enter floor number"
                    min={0}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid lightgrey",
                    }}
                  />
                </Form.Item>
              </Col>
            
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ marginBottom: screens.xs && "-5%" }}
              >
                <Form.Item label="Property Description" name="propDesc">
                  <Input.TextArea
                    rows={2}
                    cols={10}
                    style={{ width: "75%" }}
                    maxLength={300}
                    placeholder="Enter property description(maximum 300 characters)"
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Property Age"
                  name="propertyAge"
                >
                  <InputNumber
                    placeholder="Enter years"
                    min={1}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid lightgrey",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Maintenance Cost"
                  name="maintenanceCost"
                >
                  <InputNumber
                    placeholder="Enter Maintenance Cost"
                    min={1}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid lightgrey",
                    }}
                  />
                </Form.Item>
              </Col>
            
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Visitor Parking"
                  name="visitorParking" valuePropName="checked">
                  <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    size="small"
                    defaultChecked={false}
                  />
                </Form.Item>
              </Col>
             
                <Col
                xs={24}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Play Zone"
                  name="playZone" valuePropName="checked">
                  <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    size="small"
                    defaultChecked={false}
                  />
                </Form.Item>
              </Col>
             
                <Col
               xs={24}
               sm={24}
               md={24}
               lg={12}
               xl={10}
                style={{ marginBottom: screens.xs && "-10%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Water Source" name="waterSource">
                  <Checkbox.Group >
                    <Row gutter={[16]}>
                      <Col span={8} xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Checkbox value="municipal">Municipal</Checkbox>
                      </Col>
                      <Col span={8} xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Checkbox value="borewells">Borewells</Checkbox>
                      </Col>
                      <Col span={8} xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Checkbox value="tankWater">Tank Water</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
             
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

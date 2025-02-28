import React, { useState, useEffect } from "react";
import {
  Form,
  Card,
  Row,
  Col,
  InputNumber,
  Switch,
  Carousel,
  Button,
  Tooltip,
  Grid,
  Input,
  Select,
  Checkbox
} from "antd";
import "./Residential.css";
import { InfoCircleOutlined } from "@ant-design/icons";
import Configuration from "./Configuration";
const { useBreakpoint } = Grid;
const { Option } = Select;
export default function Amenities({ setExtraAmmenitiesData }) {
  const screens = useBreakpoint();
  const [isModalVis, setIsModalVis] = useState(false);

  const handleModalClose = () => {
    setIsModalVis(!isModalVis);
  };

  return (
    <>
      <Row  >
        <Col xs={24} sm={12} md={8} lg={8} xl={6} style={{ display: "flex" }}>
          <span style={{ marginTop: "4px", marginRight: "6px" }}>
            Powerbackup{" "}
            <Tooltip
              placement="rightTop"
              title={
                <div>
                  <p>
                    <strong>
                      Toggle this if any of the following backup power
                      facilities are available:
                    </strong>
                  </p>
                  <ul>
                    <li>Backup Generators</li>
                    <li>Inverters and Battery Backups</li>
                    <li>UPS (Uninterruptible Power Supply)</li>
                  </ul>
                </div>
              }
            >
              <InfoCircleOutlined
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
            </Tooltip>
          </span>

          <Form.Item
            name="powerSupply"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 12 }}
            valuePropName="checked"
          >
            <Switch
              checkedChildren=""
              unCheckedChildren=""
              size="large"
              defaultChecked={false}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={6} style={{ display: "flex" }}>
          <span style={{ marginTop: "4px", marginRight: "6px" }}>
            Water Facility{" "}
            <Tooltip
              title={
                <div>
                  <p>
                    <strong>
                      Toggle this if below mentioned water facilities were
                      available:
                    </strong>
                  </p>
                  <ul>
                    <li>24/7 Clean Water Access</li>
                    <li>High-Quality Filtration</li>
                    <li>Backup Supply Available</li>
                  </ul>
                </div>
              }
            >
              <InfoCircleOutlined
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
            </Tooltip>
          </span>
          <Form.Item
            name="waterFacility"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            valuePropName="checked"
          >
            <Switch
              size="large"
              checkedChildren=""
              unCheckedChildren=""
              defaultChecked={false}
            />
          </Form.Item>
        </Col>
     

        <Col xs={12} sm={12} md={8} lg={8} xl={6} style={{ display: "flex" }}>
          <span style={{ marginTop: "4px", marginRight: "6px" }}>
            GymFacility{" "}
            <Tooltip
              title={
                <div>
                  <ul>
                    <li>Toggle YES if your property have GymFacility</li>
                  </ul>
                </div>
              }
            >
              <InfoCircleOutlined
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
            </Tooltip>
          </span>
          <Form.Item
            name="gymFacility"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 5 }}
            valuePropName="checked"
          >
            <Switch
              size="large"
              checkedChildren=""
              unCheckedChildren=""
              defaultChecked={false}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={6} style={{ display: "flex" }}>
          <span style={{ marginTop: "4px" }}>
            Elevator{" "}
            <Tooltip
              title={
                <div>
                  <ul>
                    <li>Toggle YES if YOur Property has Elevator Facility</li>
                  </ul>
                </div>
              }
            >
              <InfoCircleOutlined
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
            </Tooltip>
          </span>
          <Form.Item
            name="elevator"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            valuePropName="checked"
          >
            <Switch
              size="large"
              checkedChildren=""
              unCheckedChildren=""
              defaultChecked={false}
            />
          </Form.Item>
        </Col>


        <Col xs={12} sm={12} md={8} lg={8} xl={6} style={{ display: "flex" }}>
          <span style={{ marginTop: "4px", marginRight: "6px" }}>
            CCTV{" "}
            <Tooltip
              placement="rightTop"
              title={
                <div>
                  <p>
                    <strong>CCTV Security:</strong>
                  </p>
                  <ul>
                    <li>Toggle YES if Your Property have CCTV facility</li>
                  </ul>
                </div>
              }
            >
              <InfoCircleOutlined
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
            </Tooltip>
          </span>
          <Form.Item
            name="cctv"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            valuePropName="checked"
          >
            <Switch
              size="large"
              checkedChildren=""
              unCheckedChildren=""
              defaultChecked={false}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6} xl={6} style={{ display: "flex" }}>
          <span style={{ marginTop: "4px",  }}>
            Watchman{" "}
            <Tooltip
              title={
                <div>
                  <ul>
                    <li>
                      {" "}
                      <li>Toggle YES if Your Property has a Watchman</li>
                    </li>
                  </ul>
                </div>
              }
            >
              <InfoCircleOutlined
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
            </Tooltip>
          </span>
          <Form.Item
            name="watchman"
            
            valuePropName="checked"
          >
            <Switch
              size="large"
              checkedChildren=""
              unCheckedChildren=""
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
                style={{ marginBottom: screens.xs && "-10%",marginLeft:"-4%" }}
              >
                <Form.Item
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Visitor Parking"
                  name="visitorParking" valuePropName="checked">
                  <Switch
                    checkedChildren=""
                    unCheckedChildren=""
                    size="large"
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
                    checkedChildren=""
                    unCheckedChildren=""
                    size="large"
                    defaultChecked={false}
                  />
                </Form.Item>
              </Col>
        <Col
          xs={24}
          lg={6}
          sm={12}
          md={12}
          xl={6}
         
        >
          <Form.Item
            label={
              <>
                Type of Electricity{" "}
                <Tooltip
                  placement="rightBottom"
                  title={
                    <div>
                      <p>
                        <strong>Choose the type of electricity supply available for the property:</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>Domestic:</strong> Electricity used for household purposes such as lighting, heating, and appliances.
                        </li>
                        <li>
                          <strong>Industrial:</strong> High voltage electricity typically used in factories or manufacturing units for heavy machinery.
                        </li>
                        <li>
                          <strong>Commercial:</strong> Electricity used in business establishments such as offices, shops, and malls.
                        </li>
                        <li>
                          <strong>Residential:</strong> Electricity supplied to residential complexes or multi-family housing units.
                        </li>
                        <li>
                          <strong>None:</strong> Indicates that no electricity supply is available for the property.
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 2 }} />
                </Tooltip>
              </>
            }
            name="electricity"
            rules={[
              { required: true, message: "Please select a Electricity type!" },
            ]}
            
           
            className="road"
          >
            <Select placeholder="Select Type of Electricity" style={{width:"90%"}}>
              <Option value="domestic">Domestic</Option>
              <Option value="industrial">Industrial</Option>
              <Option value="commercial">Commercial</Option>
              <Option value="residential">Residential</Option>
              <Option value="none">None</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col
           xs={24}
          lg={8}
          xl={6}
          sm={12}
          md={12}
          style={{ marginBottom: "-25px",marginLeft:"8%"}}
        >
          <Form.Item
            label={
              <>
                Nearby Grocery:
                <Tooltip
                  title={
                    <div>
                      <br />
                      Please Provide nearest Grocery store distance in
                      kilometers.
                    </div>
                  }
                >
                  <InfoCircleOutlined
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                </Tooltip>
              </>
            }
            name="grocery"
             
            className="road"
          >
            <Input
              type="number"
              min={1}
              placeholder="Enter distance in Kms"
              addonAfter="/km"
            />
          </Form.Item>
        </Col>


        <Col
           xs={24}
          lg={10}
          sm={24}
          md={24}
          xl={6}
          style={{ marginBottom: "-25px",marginLeft:"5%" }}
        >
          <Form.Item
            label={
              <>
                <span  >
                               Nearby Medical Facility:
                               <Tooltip title="Please specify the distance to the nearest Medical facility in kilometers.">
                                 <InfoCircleOutlined  />
                               </Tooltip>
                             </span>
              </>
            }
            name="educational"
            
            className="road"
          >
            <Input
              type="number"
              min={1}
              placeholder="Enter distance in Kms"
              addonAfter="/km"
              style={{width:"90%"}}
             />
          </Form.Item>
        </Col>
        <Col

          xs={24}
          lg={6}
          sm={12}
          md={12}
          xl={8}
           
        >
          <Form.Item
            label={
              <>
                Road Proximity{" "}
                <Tooltip
                  placement="rightbottom"
                  title={
                    <div>
                      <p>
                        <strong>
                          Enter the Distance to Nearest Road in kilometers
                        </strong>
                      </p>
                    </div>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 2 }} />
                </Tooltip>
              </>
            }
            name="distanceFromRoad"

        
            className="road"
          >
            <Input
              type="number"
              placeholder="Enter distance in Kms"
              addonAfter="/km"
              style={{width:"80%"}}
            />
          </Form.Item>
        </Col>
        <Col
          xs={24}
          lg={8}
          sm={12}
          md={12}
          xl={6}
         >
          <Form.Item
            label={
              <>
                Near By Type of Road
                <Tooltip
                  placement="rightBottom"
                  title={
                    <div>
                      <p>
                        <strong>
                          Select the type of road closest to the property.
                        </strong>
                      </p>
                    </div>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 2 }} />
                </Tooltip>
              </>
            }
            name="roadType"
            rules={[
              { required: true, message: "Please select a road type!" },
            ]}
           
            className="road"
          >
            <Select placeholder="Select road proximity">
              <Option value="rnb">RNB</Option>
              <Option value="highway">Highway</Option>
              <Option value="panchayat"> Panchayat</Option>
              <Option value="village"> to Village</Option>
              <Option value="none">None</Option>
            </Select>
          </Form.Item>
        </Col>
    
             
                <Col
               xs={24}
               sm={24}
               md={24}
               lg={12}
               xl={10}
                
              >
                <Form.Item
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                  label="Water Source" name="waterSource">
                  <Checkbox.Group >
                    <Row gutter={[16]}>
                      <Col span={8} xs={24} sm={8} md={8} lg={8} xl={7}>
                        <Checkbox value="municipal">Municipal</Checkbox>
                      </Col>
                      <Col span={8} xs={24} sm={8} md={8} lg={8} xl={7}>
                        <Checkbox value="borewells">Borewells</Checkbox>
                      </Col>
                      <Col span={8} xs={24} sm={8} md={8} lg={8} xl={10}>
                        <Checkbox value="tankWater">Tank Water</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
             
      
      </Row>

    </>
  );
}
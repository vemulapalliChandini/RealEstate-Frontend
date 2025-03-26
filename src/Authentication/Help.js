import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { Button, Input, Select, Form } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { _post } from "../Service/apiClient";
import "./Styles/Help.css"; // Import the external CSS file

const { Option } = Select;

const Help = () => {
  const [form] = Form.useForm();
  const [text, setText] = useState("");
  const fullText = "If you have any queries.....contact us through 9898998291";

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

  const handleSubmit = async (values) => {
    try {
      const res = await _post(
        "/contactUs",
        values,
        "Your request has been submitted successfully!",
        "There was an issue submitting your request."
      );
      if (res?.status === 200 || res?.status === 201) {
        form.resetFields();
      } else {
        alert("There was an issue submitting your request.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={24}>
          <div className="help-image-container">
            <img
              src="https://img.freepik.com/free-vector/tiny-real-estate-agents-with-clients-near-houses-line-growing-upwards-homes-increasing-price-buildings-constructions-flat-vector-illustration-real-estate-property-growth-concept_74855-25362.jpg"
              alt="Dream Home"
              className="help-image"
            />
            <div className="help-image-overlay"></div>
            <div className="help-image-text">
              <h1>{text}</h1>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center" align="top" className="help-cards-row">
        <Col span={6}>
          <Card
            className="help-card"
            cover={
              <img
                alt="Top Agents"
                src="https://img.freepik.com/free-photo/businessman-black-suit-makes-thumbs-up_114579-15900.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                className="help-card-cover"
              />
            }
          >
            <div className="help-card-overlay">
              <h2>Meet the Best Agents</h2>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="help-card help-card-margin"
            cover={
              <img
                alt="Top Marketing Agents"
                src="https://img.freepik.com/free-photo/medium-shot-men-holding-smartphone_23-2150208243.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                className="help-card-cover"
              />
            }
          >
            <div className="help-card-overlay">
              <h2>Expert Marketing Agents</h2>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="help-card help-card-margin"
            cover={
              <img
                alt="Top Property Listings"
                src="https://static.99acres.com/universalhp/img/d_hp_availability_2.webp"
                className="help-card-cover"
              />
            }
          >
            <div className="help-card-overlay">
              <h2>Explore Premium Listings</h2>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            className="help-card help-card-margin"
            cover={
              <img
                alt="Variety of Properties"
                src="https://img.freepik.com/free-photo/couple-traveling-with-vaccination-passports_23-2149351530.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                className="help-card-cover"
              />
            }
          >
            <div className="help-card-overlay">
              <h2>Discover Diverse Properties</h2>
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="contact-card">
        <h3 className="contact-title">CONTACT US</h3>
        <div className="contact-info">
          <div className="contact-box">
            <p>
              <strong>Toll Free</strong>
            </p>
            <p>9:30 AM to 6:30 PM (Mon-Sun)</p>
            <p>1800-41-99099</p>
          </div>
          <div className="contact-box">
            <p>
              <strong>For International Users</strong>
            </p>
            <p>+91-120-6637501</p>
          </div>
        </div>
        <Card className="contact-form-card" bordered={false}>
          <Form
            id="contactForm"
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{
              name: "",
              phone: "",
              email: "",
              roleName: "",
              timeOfAvailability: "",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your name!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Enter your name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter your phone number!" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Please enter a valid phone number!",
                    },
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email address!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Enter email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="What Defines You Best"
                  name="roleName"
                  rules={[{ required: true, message: "Please select your role!" }]}
                >
                  <Select>
                    <Option value="Buyer">Buyer</Option>
                    <Option value="Seller">Seller</Option>
                    <Option value="Agent">Agent</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Time of Availability"
              name="timeOfAvailability"
              rules={[
                { required: true, message: "Please select your preferred time!" },
              ]}
            >
              <Select>
                <Option value="8 AM to 12 PM">8 AM to 12 PM</Option>
                <Option value="12 PM to 3 PM">12 PM to 3 PM</Option>
                <Option value="3 PM to 7 PM">3 PM to 7 PM</Option>
              </Select>
            </Form.Item>
          </Form>
          <Button
            key="submit"
            type="primary"
            form="contactForm"
            htmlType="submit"
            className="contact-submit-button"
          >
            Request a Call Back
          </Button>
        </Card>
      </Card>
    </>
  );
};

export default Help;

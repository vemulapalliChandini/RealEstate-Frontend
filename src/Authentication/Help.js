import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import Call from "./Call";
import { Modal, Button, Input, Select, Form } from "antd";
import {
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    FieldTimeOutlined,
} from "@ant-design/icons";
import { _post } from "../Service/apiClient";

const { Option } = Select;
const Help = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use Form hook to get form instance
    const [form] = Form.useForm();
  const [text, setText] = useState('');
  const fullText = "If you have any queries.....contact us through 9898998291";

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

    const handleSubmit = async (values) => {
        try {
            const res = await _post(
                "/contactUs",
                values,
                "Your request has been submitted successfully!",
                "There was an issue submitting your request."
            );

            if (res?.status === 200 || res?.status === 201) {
                // Reset form fields after successful submission
                form.resetFields();

                setIsModalOpen(false);
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
                {/* Left Column: Image with Text Overlay */}
                <Col xs={24} md={24}>
  <div style={{ position: "relative", width: "100%", height: "350px" }}>
    {/* Image */}
    <img
      src="https://img.freepik.com/free-vector/tiny-real-estate-agents-with-clients-near-houses-line-growing-upwards-homes-increasing-price-buildings-constructions-flat-vector-illustration-real-estate-property-growth-concept_74855-25362.jpg"
      alt="Dream Home"
      style={{
        width: "100%",
        height: "400px",
        objectFit: "cover",
        borderRadius: "10px",
        marginTop: "-2%",
      }}
    />

    {/* Black Overlay */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "411px",
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Black color with opacity
        borderRadius: "10px",
        marginTop: "-2%",
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
      <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
        {text}
      </h1>
    </div>
  </div>
</Col>

              </Row>
        <Row
            gutter={[16, 16]}
            justify="center"
            align="top"
            style={{ marginTop: 100, marginLeft: 30, marginBottom: 10 }}
        >
            {/* Card 1: Top Agents */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        height:"250px",
                    }}
                    cover={
                        <img
                            alt="Top Agents"
                            src="https://img.freepik.com/free-photo/businessman-black-suit-makes-thumbs-up_114579-15900.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
                        >
                            Meet the Best Agents
                        </h2>
                    </div>
                </Card>
            </Col>

            {/* Card 2: Marketing Experts */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        marginLeft: 30,
                        height:"250px",
                    }}
                    cover={
                        <img
                            alt="Top Marketing Agents"
                            src="https://img.freepik.com/free-photo/medium-shot-men-holding-smartphone_23-2150208243.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "15px", fontWeight: "bold" }}
                        >
                            Expert Marketing Agents
                        </h2>
                    </div>
                </Card>
            </Col>

            {/* Card 3: Top Property Listings */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        marginLeft: 30,
                        height:"250px",
                    }}
                    cover={
                        <img
                            alt="Top Property Listings"
                            src="https://static.99acres.com/universalhp/img/d_hp_availability_2.webp"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
                        >
                            Explore Premium Listings
                        </h2>
                    </div>
                </Card>
            </Col>

            {/* Card 4: Variety of Properties */}
            <Col span={6}>
                <Card
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        width: "70%",
                        marginLeft: 30,
                        height:"250px",
                    }}
                    cover={
                        <img
                            alt="Variety of Properties"
                            src="https://img.freepik.com/free-photo/couple-traveling-with-vaccination-passports_23-2149351530.jpg?ga=GA1.1.786688213.1732196452&semt=ais_hybrid"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //   backgroundColor: "rgba(0, 0, 0, 0.4)",
                            marginTop: "70%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
                        >
                            Discover Diverse Properties
                        </h2>
                    </div>
                </Card>
            </Col>
        </Row>
         <Card
              hoverable
              style={{
                width: '70%',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                marginLeft:"15%",
                marginBottom:"2%",
                 backgroundColor: "rgb(248, 250, 255)"
              }}>
            <h3 style={{fontWeight:"bold",marginLeft:"45%"}}>CONTACT US</h3>
            <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  }}
>
  <div
    style={{
      backgroundColor: "#f0f0f0",
      padding: "10px",
      borderRadius: "5px",
      width: "48%", // Adjust width to fit two items in a row
    }}
  >
    <p>
      <strong>Toll Free</strong>
    </p>
    <p>9:30 AM to 6:30 PM (Mon-Sun)</p>
    <p>1800-41-99099</p>
  </div>
  <div
    style={{
      backgroundColor: "#f0f0f0",
      padding: "10px",
      borderRadius: "5px",
      width: "48%", // Adjust width to fit two items in a row
    }}
  >
    <p>
      <strong>For International Users</strong>
    </p>
    <p>+91-120-6637501</p>
  </div>
</div>

           
            {/* Modal from Ant Design */}
            
                <Card
                    bordered={false}
                    style={{
                        width: "70%",
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        marginLeft:"17%"
                    }}
                >
                    <Form
                        id="contactForm"
                        layout="vertical"
                        form={form} // Attach form instance here
                        onFinish={handleSubmit}
                        initialValues={{
                            name: "",
                            phone: "",
                            email: "",
                            roleName: "",
                            timeOfAvailability: "",
                        }}
                    >
                        <Row gutter={[16,16]}>
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
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Enter phone number"
                            />
                        </Form.Item>
                        </Col>
                        </Row>
                        <Row gutter={[16,16]}>
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
                            <Select style={{ width: "100%" }}>
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
                                {
                                    required: true,
                                    message: "Please select your preferred time!",
                                },
                            ]}
                        >
                            <Select style={{ width: "100%" }}>
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
                        style={{
                            backgroundColor: "#0d416b",
                            color: "#fff",
                            borderRadius: "5px",
                            padding: "10px 20px",
                            // marginRight: "20%",
                            marginTop: "-20%",
                            marginLeft: "30%",
                        }}
                    >
                        Request a Call Back
                    </Button>

                </Card>
        
        </Card>
        </>
    );
};

export default Help;

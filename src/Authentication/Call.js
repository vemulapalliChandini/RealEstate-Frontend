
import React, { useState } from "react";
import { Modal, Button, Card, Input, Select, Form } from "antd";
import {
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    FieldTimeOutlined,
} from "@ant-design/icons";
import { _post } from "../Service/apiClient";

const { Option } = Select;

const Call = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use Form hook to get form instance
    const [form] = Form.useForm();

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
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "77%",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                width: "300px",
                textAlign: "center",
            }}
        >
            <h3>CONTACT US</h3>
            <div
                style={{
                    backgroundColor: "#f0f0f0",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "10px",
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
                    marginBottom: "10px",
                }}
            >
                <p>
                    <strong>For International Users</strong>
                </p>
                <p>+91-120-6637501</p>
            </div>
            <Button
                type="primary"
                onClick={() => {
                    console.log("Modal is opening...");
                    setIsModalOpen(true);
                  }}
                style={{
                    backgroundColor: "#0d416b",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "10px 20px",
                }}
            >
                Request a Call Back
            </Button>

            {/* Modal from Ant Design */}
            <Modal
                title={
                    <>
                        <span>Want us to call you back?</span>
                        <p style={{ color: "#888", fontSize: "12px", marginTop: "5px" }}>
                            Get a callback from our customer service team
                        </p>
                    </>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                width={400}
                // height={400}
                footer={[
                    // <Button
                    //   key="submit"
                    //   type="primary"
                    //   form="contactForm"
                    //   htmlType="submit"
                    //   style={{
                    //     backgroundColor: "#0d416b",
                    //     color: "#fff",
                    //     borderRadius: "5px",
                    //     padding: "10px 20px",
                    //     marginRight: "30%",
                    //     marginTop: "-20%",
                    //   }}
                    // >
                    //   Request a Call Back
                    // </Button>,
                ]}
            >
                <Card
                    bordered={false}
                    style={{
                        width: "100%",
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
                        <Form.Item
                            label="Full Name"
                            name="name"
                            rules={[{ required: true, message: "Please enter your name!" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
                        </Form.Item>

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
                            marginLeft: "15%",
                        }}
                    >
                        Request a Call Back
                    </Button>

                </Card>
            </Modal>
        </div>
    );
};

export default Call;
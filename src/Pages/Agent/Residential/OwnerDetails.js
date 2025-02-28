import React from "react";
import { Form, Input, Col, Row } from "antd";
import "./Residential.css";


export default function OwnerDetails() {
    return (
        <div>
            <Row gutter={[16, 16]} >
                <Col xs={24} sm={12} md={8} xl={6} >
                    <Form.Item
                        label="Name"
                        name="ownerName"
                        labelCol={{ xs: { span: 5 } }}
                        wrapperCol={{ xs: { span: 24 } }}
                        rules={[
                            { required: true, message: "Please enter Owner Name!" },
                            {
                                pattern: /^[A-Za-z\s]+$/,
                                message: "Owner Name can only contain letters and spaces!",
                            },
                            {
                                max: 32,
                                message: "Owner Name cannot exceed 32 characters!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Name"
                            style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "1px solid lightgray",
                            }}
                        />
                    </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={8} xl={6}>
                    <Form.Item
                        label="Contact No"
                        name="contact"
                        labelCol={{
                            xs: { span: 8 },
                            sm: { span: 14 },
                            md: { span: 13 },
                            lg: { span: 10 },
                        }}
                        wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 16 },
                            md: { span: 14 },
                            lg: { span: 16 },
                        }}


                        rules={[
                            { required: true, message: "Please enter contact number!" },
                            {
                                validator: (_, value) => {
                                    const startPattern = /^[6-9]/;
                                    const fullPattern = /^[6-9]\d{9}$/;


                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    if (value && /[^0-9]/.test(value)) {
                                        return Promise.reject(new Error("Only numeric values are allowed!"));
                                    }
                                    if (!startPattern.test(value)) {
                                        return Promise.reject(
                                            new Error("Contact number must start with 6, 7, 8, or 9!")
                                        );
                                    }
                                    if (!fullPattern.test(value)) {
                                        return Promise.reject(
                                            new Error("Contact number must be digits of length 10!")
                                        );
                                    }


                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Contact Number"
                            style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "1px solid lightgray",
                            }}
                        />
                    </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={8} xl={6} style={{ marginBottom: "-10px" }}>
                    <Form.Item
                        label="Email"
                        name="ownerEmail"
                        labelCol={{ xs: { span: 8 } }}
                        wrapperCol={{ xs: { span: 24 } }}
                        rules={[
                            {
                                type: "email",
                                message: "The input is not a valid E-mail!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Email"
                            style={{
                                width: "100%",
                                backgroundColor: "transparent",
                                border: "1px solid lightgray",
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
}
import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from "axios"
import { _get, _post } from "./Service/apiClient";
const { Title } = Typography;

function ResetPassword() {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const payload = {
            email: values.username,
            password: values.password,
        };
        try {
            const res = await _post(
                "/resetPassword",
                payload,
                "Password Updated Successfully",
                "Failed to Update the Password"
            );
            if (res.status === 201 || res.status === 200) {
                form.resetFields();

            }
        } catch (error) {
        }
    };



    const validateConfirmPassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match!'));
        },
    });

    return (
        <div style={{ maxWidth: '450px', margin: 'auto', padding: '20px', marginTop: "3%" }}>
            <Form
                name="resetPassword"
                form={form}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                layout="horizontal"
                onFinish={onFinish}
                style={{ backgroundColor: "rgb(255,255,255,0.6)", padding: "20px" }}
                initialValues={{ username: '', password: '', confirmPassword: '' }}
            >
                <Title level={3} style={{ textAlign: 'center', marginBottom: "7%" }}>Reset Password</Title>

                {/* Username Field */}
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>

                {/* Password Field */}
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                {/* Confirm Password Field */}
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        validateConfirmPassword,
                    ]}
                >
                    <Input.Password placeholder="Confirm your password" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block style={{ width: "50%", marginLeft: "55%" }}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ResetPassword;

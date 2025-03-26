import React, { useState } from "react";
import { Modal, Button, Card, Input, Select, Form } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { _post } from "../Service/apiClient";
import "./Styles/Call.css"; // Import the external CSS file

const { Option } = Select;

const Call = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="call-container">
      <h3>CONTACT US</h3>
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
      <Button
        type="primary"
        onClick={() => {
          console.log("Modal is opening...");
          setIsModalOpen(true);
        }}
        className="request-callback-button"
      >
        Request a Call Back
      </Button>
      <Modal
        title={
          <>
            <span>Want us to call you back?</span>
            <p className="modal-subtitle">
              Get a callback from our customer service team
            </p>
          </>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={400}
      >
        <Card className="call-card">
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
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
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
              <Select>
                <Option value="Buyer">Buyer</Option>
                <Option value="Seller">Seller</Option>
                <Option value="Agent">Agent</Option>
              </Select>
            </Form.Item>
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
            className="callback-submit-button"
          >
            Request a Call Back
          </Button>
        </Card>
      </Modal>
    </div>
  );
};

export default Call;

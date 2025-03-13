import React, { useState } from "react";
import { Form, Input, Button, Select, Radio, Row, Col, Card } from "antd";
import { _post } from "../../Service/apiClient";
const { Option } = Select;

const SurveyForm = () => {
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [role, setRole] = useState(null);
  const [form] = Form.useForm(); // Create form instance

  const onFinish = async (values) => {

        const updatedValues =[ {
     
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            whatsAppNumber:values.whatsAppNumber,
            phoneNumber: values.phoneNumber,
            pinCode: values.pinCode,
            state: values.state,
            country: values.country,
            district: values.district,
            mandal: values.mandal,
            village: values.village,
            occupation:values.occupation,
            customerRole:role,
            budget:values.budget,
            description:values.propertyDesc,
        }];
    
    console.log(updatedValues);

    try {
        const res = await _post(
            "/customer/insertSurvey",
            updatedValues,
            "Customers Added Successfully",
            "Error Adding Customers"
        );
        if (res.status === 200 || res.status === 201) {
            form.resetFields();
        }
    } catch (error) {
    }
};

  const handleClear = () => {
    form.resetFields(); // Reset the form fields
  };

  return (
    <Card
      title={<div style={{ textAlign: "center", color: "white" }}>Customer Details</div>}
      bordered={true}
      style={{
        maxWidth: 900,
        margin: "auto",
        marginTop: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Added box shadow
      }}
      headStyle={{
        backgroundColor: "#0d416b",
        color: "white",
      }}
    >
      <Form
        form={form} // Assign the form instance
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isWhatsApp: false,
          state: "Andhra Pradesh",  // Default value for state
          country: "India",         // Default value for country
        }}
      >
        <Row gutter={[16, 16]}>
          {/* First Name */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label ><span className="required">*</span> First Name</label>
              </div>
            </Form.Item>
          </Col>

          {/* Last Name */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Please enter your last name" }]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Last Name</label>
              </div>
            </Form.Item>
          </Col>

          {/* Phone Number */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter your phone number" },
                { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Phone Number</label>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Is WhatsApp Number */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Is this a WhatsApp number?" name="isWhatsApp">
              <Radio.Group onChange={(e) => setIsWhatsApp(e.target.value)}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* WhatsApp Number */}
          {isWhatsApp === false && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="whatsAppNumber"
                rules={[
                  { required: true, message: "Please enter your WhatsApp number" },
                  { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
                ]}
              >
                <div className="floating-label">
                  <Input placeholder=" " />
                  <label><span className="required">*</span> WhatsApp Number</label>
                </div>
              </Form.Item>
            </Col>
          )}

          {/* Email */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="email"
              rules={[

                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label>Email</label>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Occupation */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="occupation"
              rules={[

                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "registration.Only alphabets are allowed",
                },
                {
                  min: 3,
                  max: 30,
                  message: "Occupation must be between 2 and 30 characters",
                },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label>Occupation</label>
              </div>
            </Form.Item>
          </Col>

          {/* Country */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="country"
              rules={[
                { required: true, message: "Country is required" },
                { pattern: /^[A-Za-z\s]+$/, message: "Only alphabets are allowed" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Country</label>
              </div>
            </Form.Item>
          </Col>

          {/* State */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="state"
              rules={[
                { required: true, message: "State is required" },
                { pattern: /^[A-Za-z\s]+$/, message: "Only alphabets are allowed" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> State</label>
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* Address Fields */}
        <Row gutter={[16, 16]}>
          {/* Pin Code */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="pinCode"
              rules={[
                { pattern: /^[0-9]{6}$/, message: "Only 6 digit code is allowed" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Pin Code</label>
              </div>
            </Form.Item>
          </Col>

          {/* District */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="district"
              rules={[
                { required: true, message: "District is required" },
                { pattern: /^[A-Za-z\s]+$/, message: "Only alphabets are allowed" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> District</label>
              </div>
            </Form.Item>
          </Col>

          {/* Mandal */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="mandal"
              rules={[
                { required: true, message: "Mandal is required" },
                { pattern: /^[A-Za-z\s]+$/, message: "Only alphabets are allowed" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Mandal</label>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Village */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="village"
              rules={[
                { required: true, message: "Village is required" },
                { pattern: /^[A-Za-z\s]+$/, message: "Only alphabets are allowed" },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Village</label>
              </div>
            </Form.Item>
          </Col>

          {/* Role */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="role" rules={[{ required: true, message: "Please select your role" }]}>
              <Select
                placeholder={
                  <span>
                    <span style={{ color: "red" }}>*</span>&nbsp;
                    "Select Your Role"
                  </span>
                }
                onChange={(value) => setRole(value)}
                style={{ height: "38px" }}
              >
                <Option value="Buyer">Buyer</Option>
                <Option value="Seller">Seller</Option>
                <Option value="Both">Both</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Budget */}
          {role === "Buyer" && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
               name="budget"
                rules={[{ required: true, message: "Please enter your budget" }]}
              >
                 <div className="floating-label">
                <Input placeholder=" " />
                <label><span className="required">*</span> Budget</label>
              </div>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item name="propertyDesc">
              <Input.TextArea
                placeholder="Please provide details about the discussion"
                maxLength={300}
                rows={2}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit and Clear Buttons */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item style={{ float: "right" }}>
              <Button style={{ backgroundColor: "#0D416B", color: "white" }} htmlType="submit">
                Submit
              </Button>
              <Button type="default" onClick={handleClear} style={{ marginLeft: "10px" }}>
                Clear
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SurveyForm;

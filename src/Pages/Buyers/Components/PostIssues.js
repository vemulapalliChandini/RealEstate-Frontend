import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Modal,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { _post } from "../../../Service/apiClient";

const { TextArea } = Input;
const { Option } = Select;

const PostIssues = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const handleSubmit = async (values) => {
    const { issue, category, attachment } = values;

    // Preprocess data
    const processedData = {
      userId,
      role,
      message: issue.trim(),
      category: category.toLowerCase(),
    };

    // Prepare form data for submission
    const formData = new FormData();
    formData.append("userId", processedData.userId);
    formData.append("role", processedData.role);
    formData.append("message", processedData.message);
    formData.append("category", processedData.category);

    if (attachment && attachment.file) {
      formData.append("attachment", attachment.file);
    }
    // // Add file if available
    // if (attachment && attachment.file) {
    // formData.append('attachment', attachment.file);
    // }

    setIsSubmitting(true);

    try {
      const response = await _post("/complaint/postComplaint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        // Show success modal
        setIsModalVisible(true);
        // Reset the form fields after successful submission
        form.resetFields();
      } else {
        // Handle unexpected response status
        message.error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to submit the issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleFileValidation = (file) => {
  // const isAllowedSize = file.size / 1024 / 1024 < 5; // Less than 5MB
  // if (!isAllowedSize) {
  // message.error('File size should not exceed 5MB.');
  // }
  // return isAllowedSize;
  // };

  const handleFileValidation = (file) => {
    const isAllowedSize = file.size / 1024 / 1024 < 5; // Less than 5MB
    if (!isAllowedSize) {
      message.error("File size should not exceed 5MB.");
    }
    return isAllowedSize;
  };

  const handleModalOk = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "700px", // Height of the cell
        width: "100%", // Full width of the screen

        borderRadius: "5px", // Optional, to make it round
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#e0f7fa", // Light blue color
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          maxWidth: "700px", // Increase the max width for larger screens
          width: "100%", // Make the form responsive
          margin: "0 16px", // Margin for responsiveness
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "24px",
            textEmphasisColor: "ActiveBorder",
            color: "black",
          }}
        >
          Post Your Issue
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: "100%" }}
        >
          {/* Category */}
          <Form.Item
            style={{ marginBottom: 10 }}
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              style={{ width: 300, height: 40 }}
              placeholder="Select a category"
              allowClear
            >
              <Option value="technical">Technical</Option>
              <Option value="billing">Billing</Option>
              <Option value="general">General</Option>
            </Select>
          </Form.Item>

          {/* Issue Description */}
          <Form.Item
            label="Description"
            name="issue"
            rules={[
              { required: true, message: "Please describe your issue!" },
              {
                max: 500,
                message: "Description cannot exceed 500 characters.",
              },
            ]}
          >
            <TextArea placeholder="Describe your issue here" rows={4} />
          </Form.Item>

          {/* File Attachment */}
          <Form.Item label="Attachment (Optional)" name="attachment">
            <Upload
              beforeUpload={handleFileValidation}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: true,
              }}
              customRequest={({ onSuccess }) =>
                setTimeout(() => onSuccess("ok"), 0)
              }
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              style={{ width: 300, height: 40, background: "black" }}
              type="primary"
              htmlType="submit"
              // style={{ width: '100%' }}
              loading={isSubmitting}
            >
              {isSubmitting ? <Spin /> : "Submit Issue"}
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Success Modal */}
      <Modal
        title="Success"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        style={{ marginLeft: 400 }}
      >
        <p>Complaint raised successfully!</p>
      </Modal>
    </div>
  );
};

export default PostIssues;

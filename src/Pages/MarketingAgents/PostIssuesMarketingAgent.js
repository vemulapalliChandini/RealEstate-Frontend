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

import { _post } from "../../Service/apiClient";

const { TextArea } = Input;
const { Option } = Select;

const PostIssuesAgent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const handleSubmit = async (values) => {
    const { issue, category, attachment } = values;


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
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "548px", // Height of the cell
    //         width: "100%", // Full width of the screen

    //         borderRadius: "5px", // Optional, to make it round
    //       }}
    //     >
    //       <div
    //         style={{
    //           textAlign: "center",
    //           backgroundColor: "#e0f7fa", // Light blue color
    //           padding: "24px",
    //           borderRadius: "8px",
    //           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    //           maxWidth: "700px", // Increase the max width for larger screens
    //           width: "100%", // Make the form responsive
    //           margin: "0 16px", // Margin for responsiveness
    //         }}
    //       >
    //         <h2
    //           style={{
    //             textAlign: "center",
    //             marginBottom: "24px",
    //             textEmphasisColor: "ActiveBorder",
    //             color: "black",
    //           }}
    //         >
    //           Post Your Issue
    //         </h2>
    //         <Form
    //           form={form}
    //           layout="vertical"
    //           labelCol={{ flex: '0px' }}
    //           onFinish={handleSubmit}
    //           style={{ maxWidth: "100%" }}
    //      labelAlign="left"
    //     labelWrap
    //          >
    //           {/* Category */}
    //           <Form.Item
    //             label="Category"
    //             name="category"
    //             rules={[{ required: true, message: "Please select a category!" }]}
    //           >

    //             <Select
    //               style={{ width: 250, height: 40 }}
    //               placeholder="Select a category"
    //               allowClear
    //             >
    //               <Option value="technical">Technical</Option>
    //               <Option value="billing">Billing</Option>
    //               <Option value="general">General</Option>
    //             </Select>
    //           </Form.Item>

    //           {/* Issue Description */}
    //           <Form.Item
    //             label="Description"
    //             name="issue"
    //             rules={[
    //               { required: true, message: "Please describe your issue!" },
    //               {
    //                 max: 500,
    //                 message: "Description cannot exceed 500 characters.",
    //               },
    //             ]}
    //           >
    // <TextArea
    //   placeholder="Describe your issue here"
    //   rows={4}
    //   style={{ width: '70%' }}  // Adjust this value as per your needs
    // />
    //           </Form.Item>

    //           {/* File Attachment */}
    //           <Form.Item label="Attachment (Optional)" name="attachment">
    //             <Upload
    //               beforeUpload={handleFileValidation}
    //               maxCount={1}
    //               showUploadList={{
    //                 showRemoveIcon: true,
    //               }}
    //               customRequest={({ onSuccess }) =>
    //                 setTimeout(() => onSuccess("ok"), 0)
    //               }
    //             >
    //               <Button icon={<UploadOutlined />}>Upload File</Button>
    //             </Upload>
    //           </Form.Item>

    //           {/* Submit Button */}
    //           <Form.Item>
    //             <Button
    //               style={{ width: 300, height: 40, background: "black" }}
    //               type="primary"
    //               htmlType="submit"
    //               // style={{ width: '100%' }}
    //               loading={isSubmitting}
    //             >
    //               {isSubmitting ? <Spin /> : "Submit Issue"}
    //             </Button>
    //           </Form.Item>
    //         </Form>
    //       </div>

    //       {/* Success Modal */}
    //       <Modal
    //         title="Success"
    //         visible={isModalVisible}
    //         onOk={handleModalOk}
    //         onCancel={handleModalOk}
    //         style={{ marginLeft: 400 }}
    //       >
    //         <p>Complaint raised successfully!</p>
    //       </Modal>




    //     </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '548px', // Height of the cell
        width: '100%', // Full width of the screen
        borderRadius: '5px', // Optional, to make it round

      }}
    >
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#c7cdd1', // Light blue color
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          maxWidth: '700px', // Increase the max width for larger screens
          width: '100%', // Make the form responsive
          margin: '0 16px', // Margin for responsiveness
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: 'black',
          }}
        >
          Post Your Issue
        </h2>
        <Form
          form={form}
          name="post-issue"
          labelCol={{ span: 6 }} // Reduce gap between label and input
          wrapperCol={{ span: 18 }} // Reduce gap between label and input
          layout="horizontal"
          onFinish={handleSubmit}
          style={{ maxWidth: '100%' }}
        >
          {/* Category */}
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category!' }]}
            style={{ marginBottom: 8 }} // Reduce the margin between items
          >
            <Select
              style={{
                width: '100%',
                height: 40,
                textAlign: 'center', // Align placeholder to center
              }}
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
              { required: true, message: 'Please describe your issue!' },
              {
                max: 500,
                message: 'Description cannot exceed 500 characters.',
              },
            ]}
            style={{ marginBottom: 8 }} // Reduce the margin between items
          >
            <TextArea
              placeholder="Describe your issue here"
              rows={4}
              style={{
                width: '100%',
                textAlign: 'center', // Align placeholder to center
              }}
            />
          </Form.Item>

          {/* File Attachment */}
          <Form.Item
            label="Attachment (Optional)"
            name="attachment"
            wrapperCol={{ offset: -1, span: 1 }} // Center the submit button

            style={{ marginBottom: 8 }} // Reduce the margin between items
          >
            <Upload
              beforeUpload={handleFileValidation}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: true,
              }}
              customRequest={({ onSuccess }) =>
                setTimeout(() => onSuccess('ok'), 0)
              }
            >
              <Button
                icon={<UploadOutlined />}
              >
                Upload File
              </Button>
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item
            wrapperCol={{ offset: 20, span: 20 }} // Center the submit button
            style={{ marginTop: 8 }} // Reduce top margin
          >
            <Button
              style={{ height: 40 }}
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? <Spin /> : 'Submit Issue'}
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

export default PostIssuesAgent;

// import React, { useState } from 'react';
// import { Form, Input, Button, Select, Upload, Modal, Spin } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';

// import { _post } from "../../Service/apiClient";
// const { TextArea } = Input;
// const { Option } = Select;

// const PostIssueForm = () => {
//   const [form] = Form.useForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const handleSubmit = async (values) => {
//         const { issue, category, attachment } = values;


//         const processedData = {
//           userId,
//           role,
//           message: issue.trim(),
//           category: category.toLowerCase(),
//         };

//         // Prepare form data for submission
//         const formData = new FormData();
//         formData.append("userId", processedData.userId);
//         formData.append("role", processedData.role);
//         formData.append("message", processedData.message);
//         formData.append("category", processedData.category);

//         if (attachment && attachment.file) {
//           formData.append("attachment", attachment.file);
//         }
//         // // Add file if available
//         // if (attachment && attachment.file) {
//         // formData.append('attachment', attachment.file);
//         // }

//         setIsSubmitting(true);

//         try {
//           const response = await _post("/complaint/postComplaint", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//           });

//           if (response.status === 200) {
//             // Show success modal
//             setIsModalVisible(true);
//             // Reset the form fields after successful submission
//             form.resetFields();
//           } else {
//             // Handle unexpected response status
//             message.error("Unexpected response from the server.");
//           }
//         } catch (error) {
//           console.error(error);
//           message.error("Failed to submit the issue. Please try again.");
//         } finally {
//           setIsSubmitting(false);
//         }
//       };
//   const handleModalOk = () => {
//     setIsModalVisible(false);
//   };

//   const handleFileValidation = (file) => {
//     // Add your file validation logic here
//     return true;
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '548px', // Height of the cell
//         width: '100%', // Full width of the screen
//         borderRadius: '5px', // Optional, to make it round
//       }}
//     >
//       <div
//         style={{
//           textAlign: 'center',
//           backgroundColor: '#e0f7fa', // Light blue color
//           padding: '24px',
//           borderRadius: '8px',
//           boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
//           maxWidth: '700px', // Increase the max width for larger screens
//           width: '100%', // Make the form responsive
//           margin: '0 16px', // Margin for responsiveness
//         }}
//       >
//         <h2
//           style={{
//             textAlign: 'center',
//             marginBottom: '24px',
//             color: 'black',
//           }}
//         >
//           Post Your Issue
//         </h2>
//         <Form
//           form={form}
//           name="post-issue"
//           labelCol={{ span: 6 }} // Reduce gap between label and input
//           wrapperCol={{ span: 18 }} // Reduce gap between label and input
//           layout="horizontal"
//           onFinish={handleSubmit}
//           style={{ maxWidth: '100%' }}
//         >
//           {/* Category */}
//           <Form.Item
//             label="Category"
//             name="category"
//             rules={[{ required: true, message: 'Please select a category!' }]}
//             style={{ marginBottom: 8 }} // Reduce the margin between items
//           >
//             <Select
//               style={{
//                 width: '100%',
//                 height: 40,
//                 textAlign: 'center', // Align placeholder to center
//               }}
//               placeholder="Select a category"
//               allowClear
//             >
//               <Option value="technical">Technical</Option>
//               <Option value="billing">Billing</Option>
//               <Option value="general">General</Option>
//             </Select>
//           </Form.Item>

//           {/* Issue Description */}
//           <Form.Item
//             label="Description"
//             name="issue"
//             rules={[
//               { required: true, message: 'Please describe your issue!' },
//               {
//                 max: 500,
//                 message: 'Description cannot exceed 500 characters.',
//               },
//             ]}
//             style={{ marginBottom: 8 }} // Reduce the margin between items
//           >
//             <TextArea
//               placeholder="Describe your issue here"
//               rows={4}
//               style={{
//                 width: '100%',
//                 textAlign: 'center', // Align placeholder to center
//               }}
//             />
//           </Form.Item>

//           {/* File Attachment */}
//           <Form.Item
//             label="Attachment (Optional)"
//             name="attachment"
//             wrapperCol={{ offset: -1, span: 1 }} // Center the submit button

//             style={{ marginBottom: 8 }} // Reduce the margin between items
//           >
//             <Upload
//               beforeUpload={handleFileValidation}
//               maxCount={1}
//               showUploadList={{
//                 showRemoveIcon: true,
//               }}
//               customRequest={({ onSuccess }) =>
//                 setTimeout(() => onSuccess('ok'), 0)
//               }
//             >
//               <Button
//                 icon={<UploadOutlined />}
//                >
//                 Upload File
//               </Button>
//             </Upload>
//           </Form.Item>

//           {/* Submit Button */}
//           <Form.Item
//             wrapperCol={{ offset: 20, span: 20 }} // Center the submit button
//             style={{ marginTop: 8 }} // Reduce top margin
//           >
//             <Button
//               style={{  height: 40 }}
//               type="primary"
//               htmlType="submit"
//               loading={isSubmitting}
//             >
//               {isSubmitting ? <Spin /> : 'Submit Issue'}
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>

//       {/* Success Modal */}
//       <Modal
//         title="Success"
//         visible={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={handleModalOk}
//         style={{ marginLeft: 400 }}
//       >
//         <p>Complaint raised successfully!</p>
//       </Modal>
//     </div>
//   );
// };

// export default PostIssueForm;
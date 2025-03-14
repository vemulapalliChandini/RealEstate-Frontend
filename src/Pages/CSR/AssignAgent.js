import React, { useState } from 'react';
import { Form, Input, Radio, Button, Space, Card, Row, Col  } from 'antd';
// import { PlusOutlined, PlusCircleFilled, InfoCircleOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
// import { Option } from "antd/es/mentions";
import "../../Authentication/Styles/FloatingLabel.css";
import { useTranslation } from "react-i18next";
import { _get, _post } from "../../Service/apiClient";
// import { DeleteOutlineOutlined } from '@mui/icons-material';

function AssignAgent() {
    // const [fileList, setFileList] = useState(null);
    const { t  } = useTranslation();
    const [form] = Form.useForm();
    // const [addressDetails, setAddressDetails] = useState({
    //     district: "",
    //     mandal: "",
    //     village: "",
    // });
    const [showAssignAgentButton, setShowAssignAgentButton] = useState("");
    // const [mandals, setMandals] = useState([]);
    // const [selectedDistrict, setSelectedDistrict] = useState("");
    // const [villages, setVillages] = useState([]);
    // const [pincode, setPincode] = useState(null);
    // const [selectedMandal, setSelectedMandal] = useState("");
    // const [customerData, setCustomerData] = useState([]);
    // const [uploadedFileName, setUploadedFileName] = useState(null);
    const [district, setDistrict] = useState('');
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const[agents,setAgents]=useState([]);
    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
    };
    // const handlevillageChange = async (value) => {
    //     setAddressDetails((prev) => ({ ...prev, village: value }));
    // };

    // const handleAddCustomer = () => {
    //     form
    //         .validateFields()
    //         .then((values) => {
    //             setCustomerData((prevData) => [...prevData, values]);
    //             console.log('Customer Data:', customerData);
    //             form.resetFields();

    //         })
    //         .catch((errorInfo) => {
    //             console.log('Validate Failed:', errorInfo);
    //         });
    // };


    const onFinish = async (values) => {
        console.log(values);
        const Payload = [values];
        try {
            const res = await _post(
                "/customer/addCustomers",
                Payload,
                "Customers Added Successfully",
                "Error Adding Customers"
            );
            if (res.status === 200 || res.status === 201) {
                form.resetFields();
            }


        } catch (error) {
        }
    };
    // const onDelete = () => {
    //     setUploadedFileName(null);
    //     setFileList(null);
    // }
    const fetchAgents = async () => {
        const response = await _get(`/agent/getAgentByDistrict/${district}`);
        console.log(response.data);
        // setIsModalOpen(true);
    }
    // const onUpload = async () => {
    //     if (fileList.length === 0) {
    //         return message.error('Please upload a file first');
    //     }

    //     const formData = new FormData();
    //     formData.append('file', fileList[0]);

    //     try {

    //         const response = await _post('/csr/upload-excel', formData);

    //         if (response.status === 200) {
    //             message.success('File uploaded successfully');
    //         }
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         message.error('Error uploading file');
    //     }
    // };
    return (
        <Card style={{
            maxWidth: '800px', margin: 'auto', padding: '20px', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px"
        }}>





            <div style={{ marginTop: "3%" }}>
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="Property Name"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: "This Field is Required" },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span>Property Name
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="firstName"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: `${t("registration.First name is required")}` },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> {t("registration.First Name")}
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item
                                name="lastName"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true, message: `${t("registration.Last name is required")}`
                                    },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> {t("registration.Last Name")}
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="phoneNumber"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
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
                                                return Promise.reject(
                                                    new Error("Only numeric values are allowed!")
                                                );
                                            }
                                            if (!startPattern.test(value)) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Contact number must start with 6, 7, 8, or 9!"
                                                    )
                                                );
                                            }
                                            if (!fullPattern.test(value)) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Contact number must be digits of length 10!"
                                                    )
                                                );
                                            }

                                            return Promise.resolve(); // Valid number
                                        },
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input maxLength={10} placeholder=" " />
                                    <label>
                                        <span className="required">*</span> {t("registration.Phone Number")}
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="email"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message: `${t("registration.Please input your email!")}`,
                                    },
                                    {
                                        type: "email",
                                        message: `${t("registration.The input is not a valid email!")}`
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> {t("registration.Email")}
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="state"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: `State is Required` },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> State
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="country"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: `Country is Required` },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> Country
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="district"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: `District is Required` },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input
                                        placeholder=" "
                                        value={district}
                                        onChange={handleDistrictChange}
                                    />

                                    <label>
                                        <span className="required">*</span> District
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="mandal"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: `Mandal is Required` },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> Mandal
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="village"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    { required: true, message: `Village is Required` },
                                    {
                                        pattern: /^[A-Za-z\s]+$/,
                                        message: `${t("registration.Only alphabets are allowed")}`,
                                    },
                                ]}
                            >
                                <div className="floating-label">
                                    <Input placeholder=" " />
                                    <label>
                                        <span className="required">*</span> Village
                                    </label>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={16} >
                            <Form.Item

                                name="interestedIn"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message: `This Field is required`,
                                    },
                                ]}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span className="required">*</span><span style={{ marginRight: "10px" }}>Interested In</span>
                                    <Radio.Group
                                        onChange={(e) => {
                                            setShowAssignAgentButton(e.target.value === "Yes");
                                        }}
                                    >
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio value="No">No</Radio>
                                        <Radio value="Pending">Pending</Radio>
                                    </Radio.Group>
                                    {showAssignAgentButton && (
                                        <Button onClick={fetchAgents} type="primary" style={{ marginTop: "10px" }}>
                                            Assign Agent
                                        </Button>
                                    )}
                                </div>

                            </Form.Item>

                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Add Comments"
                                name="comment"
                                labelCol={{ span: 8.5 }}
                                wrapperCol={{ span: 24 }}

                            >
                                <Input.TextArea
                                    className="input-box"
                                    placeholder="add the comments from the buyer"
                                    maxLength={300}
                                    rows={2}
                                    cols={10}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Form>
            </div>






        </Card>
    );
}

export default AssignAgent;

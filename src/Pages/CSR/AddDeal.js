import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Button, Upload, message, Space, Card, Row, Col, Select, Tooltip, Spin, Modal, Table, InputNumber } from 'antd';
import { PlusOutlined, PlusCircleFilled, InfoCircleOutlined, CheckCircleOutlined, DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { Option } from "antd/es/mentions";
import "../../Authentication/Styles/FloatingLabel.css";
import { useTranslation } from "react-i18next";
import { _get, _post } from "../../Service/apiClient";
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { color } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

function AddDeal() {
    const [fileList, setFileList] = useState(null);
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const [addressDetails, setAddressDetails] = useState({
        district: "",
        mandal: "",
        village: "",
    });

    const [mandals, setMandals] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [villages, setVillages] = useState([]);
    const [pincode, setPincode] = useState(null);
    const [selectedMandal, setSelectedMandal] = useState("");
    const [customerData, setCustomerData] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(null);

    const [showAssignAgentButton, setShowAssignAgentButton] = useState("");
    const [district, setDistrict] = useState('');
    const [nameSearchQuery, setNameSearchQuery] = useState([]);
    const [isAddModalOPen, setIsAddModalOpen] = useState(false);
    const [ExistingCustomerDetails, setExistingCustomerDetails] = useState([]);
    const [IsModalVisible, setIsModalVisible] = useState(false);
    const handlevillageChange = async (value) => {
        setAddressDetails((prev) => ({ ...prev, village: value }));
    };
    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
    };
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    const [customerExists, setCustomerExists] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerDetails1, setCustomerDetails1] = useState([]);

    const handleCloseModal = async () => {
        setIsAddModalOpen(false);
    }
    // form.resetFields();
    const role = parseInt(localStorage.getItem("role"));
    const agentrole = parseInt(localStorage.getItem("agentrole"))
    const handlePhoneNumber = async (value) => {
        try {

            const response = await _get(`/deal/checkUser/${value}`);
            console.log(response.data);
            setCustomerExists(true);

            setCustomerDetails(response.data.data);
            console.log(customerExists);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.message);
            if (error.response.data.message === "Customer not found") {
                setCustomerExists(false);
                setIsModalOpen(false);
                console.log(customerExists);
            } else {
                const errorMessage = error?.response?.data?.message || "An error occurred while fetching agents.";
                message.error(errorMessage);
            }
        }
    };
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await _get(`/customer/getCustomer`);
                console.log(response.data);
                setCustomerDetails1(response.data);
            } catch (error) {
                console.error("Error fetching agents: ", error);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const response = await _get('/deal/getAllProperties');
                console.log(response);
                const data = response.data.data || [];
                console.log(data);
                setProperties(
                    data.map((agent) => ({
                        propertyId: agent.id,
                        propertyName: agent.propertyName,
                        type: agent.type,
                        agentId: agent.agentId
                    }))
                );

                setFilteredProperties(
                    data.map((agent) => ({
                        propertyId: agent.id,
                        propertyName: agent.propertyName,
                        type: agent.type,
                        agentId: agent.agentId,
                        displayName: `${agent.propertyName} - ${agent.type}`, // This is for display in the Select
                    }))
                );
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);


    const handleAddCustomer = () => {
        form
            .validateFields()
            .then((values) => {
                setCustomerData((prevData) => [...prevData, values]);
                console.log('Customer Data:', customerData);
                form.resetFields();

            })
            .catch((errorInfo) => {
                console.log('Validate Failed:', errorInfo);
            });
    };

    const csrId = localStorage.getItem("userId");
    const onFinish = async (values) => {
        console.log(values);
        console.log(nameSearchQuery);
        const properties = nameSearchQuery.map((property) => ({
            propertyId: property.propertyId,
            propertyName: property.propertyName,
            propertyType: property.type,
            agentId: property.agentId,
            csrId: property.csrId,
        }));
        console.log("role",role);
        console.log("agentrole",agentrole);
        let updatedValues = {
            ...values,
            
            ...(role === 1 && {
                agentRole: agentrole === 11 ? "buyer" : "seller",
            }),
            properties: properties,
        };


        console.log(properties);
        if (customerExists && customerDetails && Object.keys(customerDetails).length > 0) {
            console.log("hgdghdghd");
            updatedValues = {
                ...updatedValues,
                firstName: customerDetails.firstName,
                lastName: customerDetails.lastName,
                email: customerDetails.email,
                phoneNumber: customerDetails.phoneNumber,
                pincode: customerDetails.pincode,
                state: customerDetails.state,
                country: customerDetails.country,
                district: customerDetails.district,
                mandal: customerDetails.mandal,
                village: customerDetails.village,

            };
        }
        console.log(updatedValues);
        setLoading(true);
        try {
            const res = await _post(
                "/deal/createDeal",
                updatedValues,
                "Deal Created Successfully",
                "Error Adding Customers"
            );
            if (res.status === 200 || res.status === 201) {
                form.resetFields();
                setLoading(false);
                setNameSearchQuery([]);
            }


        } catch (error) {
        }
    };
    const onDelete = () => {
        setUploadedFileName(null);
        setFileList(null);
    }
    const handleSearch = (searchValue) => {
        console.log(searchValue);
        setNameSearchQuery(searchValue);
        if (!searchValue) {
            setFilteredProperties(properties);
        } else {
            const filtered = properties.filter((property) =>
                property.label.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredProperties(filtered);
        }
    };
    const onUpload = async () => {
        if (fileList.length === 0) {
            return message.error('Please upload a file first');
        }

        const formData = new FormData();
        formData.append('file', fileList[0]);

        try {

            const response = await _post('/csr/upload-excel', formData);

            if (response.status === 200) {
                message.success('File uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error('Error uploading file');
        }
    };

    return (
        <>


            <Card
                title="Deal Details"
                style={{
                    maxWidth: '800px',
                    margin: 'auto',
                    padding: '20px',
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px"
                }}
                headStyle={{
                    backgroundColor: '#0d416b',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}
            >


                {/* <div style={{ display: 'flex' }}>
                <h3 style={{ marginLeft: "37%" }}>Enter Customer Details</h3>
                <div style={{ display: 'flex', flexDirection: "column" }}>
                    <Form.Item
                        name="excelUpload"
                        rules={[{ required: true, message: "Please upload an Excel file!" }]}
                        style={{ marginLeft: "80%" }}
                    >
                        <div style={{ display: "flex" }}>
                            <Upload
                                beforeUpload={handleUpload}
                                showUploadList={false}
                                accept=".xls,.xlsx"
                            >
                                <Button icon={<PlusOutlined />}>Click to Upload</Button>
                            </Upload>
                            <Tooltip
                                title="Only upload Excel files with .xls or .xlsx extensions."
                                placement="topRight"

                            >
                                <InfoCircleOutlined style={{ fontSize: 20, color: "#0d416b", cursor: "pointer" }} />
                            </Tooltip>
                        </div>
                    </Form.Item>

                    <div style={{ display: 'flex', marginTop: "-2%", marginLeft: "40%" }}>
                        <div style={{ color: "#0d416b" }}>
                            <strong>Uploaded File:</strong>
                        </div>

                        {uploadedFileName && (
                            <div style={{ color: "#0d416b" }}>
                                {uploadedFileName}
                                <span onClick={onUpload}>
                                    <CheckCircleOutlined style={{ fontSize: '15px', color: 'green', marginRight: "10px", marginLeft: "10px" }} />
                                </span>
                                <span onClick={onDelete}>
                                    <DeleteOutlined style={{ fontSize: '15px', color: 'red' }} />
                                </span>
                            </div>
                        )}

                    </div>
                </div>
            </div> */}




                <div style={{ marginTop: "3%" }}>
                    <Form form={form} onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8} lg={8}>
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
                                        <Input
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Call the function only if the length is 10
                                                if (value.length === 10) {
                                                    handlePhoneNumber(value);
                                                }
                                            }}
                                            maxLength={10}
                                            placeholder=" "
                                        />
                                        <label>
                                            <span className="required">*</span> {t("registration.Phone Number")}
                                        </label>
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={8}>
                                <Form.Item

                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <div className={`floating-label ${nameSearchQuery.length > 0 ? "has-value" : ""}`}>

                                        <Select
                                            mode="multiple"
                                            showSearch
                                            allowClear={false}
                                            className="ant-select"
                                            style={{
                                                width: "100%",
                                                marginBottom: "10px",
                                                height: "40px"
                                            }}
                                            value={nameSearchQuery.map((property) => property.displayName)} // Display name and type
                                            onChange={(values) => {

                                                const selectedProperties = values.map((displayName) =>
                                                    filteredProperties.find((property) => property.displayName === displayName)
                                                );
                                                setNameSearchQuery(selectedProperties); // Store the full object with id, name, type
                                            }}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            placeholder=" " // Empty placeholder to reserve space
                                        >
                                            {[...new Map(filteredProperties.map(property => [property.displayName, property])).values()]
                                                .map((property) => (
                                                    <Option key={property.propertyId} value={property.displayName}>
                                                        {property.displayName}
                                                    </Option>
                                                ))}
                                        </Select>
                                        <label className="floating-label property-name-label">
                                            <span style={{ color: "red", marginRight: "5px" }}>*</span> Property Name
                                        </label>
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={8}>
                                <Form.Item
                                    name="expectedPrice"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    rules={[

                                        {
                                            pattern: /^[0-9]+$/,
                                            message: "Only Numbers are allowed",
                                        },
                                    ]}
                                >
                                    <div className="floating-label">
                                        <Input
                                            placeholder=" "
                                            min={0}
                                            style={{ width: '100%' }}
                                        />
                                        <label>
                                            Expected Price
                                        </label>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>




                        <Row gutter={16}>



                            <Col xs={24} sm={24} md={16} lg={16}>
                                <Form.Item

                                    name="interestIn"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}

                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ color: "red", marginRight: "5px" }}>*</span>
                                        <span style={{ marginRight: "10px" }}>Interested In</span>

                                        <Radio.Group

                                        >
                                            <Radio value="1">Yes</Radio>
                                            <Radio value="2">No</Radio>
                                            <Radio value="0">Pending</Radio>
                                        </Radio.Group>

                                    </div>

                                </Form.Item>

                            </Col>


                        </Row>
                        <Row gutter={16}>

                            <Col xs={24} sm={24} md={16} lg={16}>
                                <Form.Item

                                    name="comments"
                                    labelCol={{ span: 8.5 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <div className="floating-label">
                                        <Input.TextArea
                                            className="input-box"
                                            placeholder=" "
                                            maxLength={300}
                                            rows={2}
                                            cols={10}
                                            style={{ width: "100%" }}
                                        />
                                        <label className="floating-label-text">
                                            <span style={{ color: "red", marginRight: "5px" }}>*</span> Add Comments from the Buyers
                                        </label>
                                    </div>
                                </Form.Item>
                            </Col>

                        </Row>

                        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" disabled={loading}>
                                        {loading ? <Spin size="small" /> : "Search"}
                                    </Button>
                                    
                                </Space>
                            </Form.Item>
                        </Col>
                    </Form>
                </div>






            </Card>


        </>
    );
}

export default AddDeal;


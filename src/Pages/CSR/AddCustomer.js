import React, { useState } from 'react';
import { Form, Input,   Button, message, Space, Card, Row, Col, Select } from 'antd';
// import { PlusOutlined, PlusCircleFilled, InfoCircleOutlined, CheckCircleOutlined, DeleteOutlined, MailOutlined } from '@ant-design/icons';
// import { Option } from "antd/es/mentions";
import "../../Authentication/Styles/FloatingLabel.css";
import { useTranslation } from "react-i18next";
import { _get, _post } from "../../Service/apiClient";
// import { DeleteOutlineOutlined } from '@mui/icons-material';
// import { color } from 'framer-motion';
// import { FaWhatsapp } from 'react-icons/fa';

function AddCustomer({ formReset }) {
    // const [fileList, setFileList] = useState(null);
    const { t } = useTranslation();
    const [form] = Form.useForm();
    // const [addressDetails, setAddressDetails] = useState({
    //     district: "",
    //     mandal: "",
    //     village: "",
    // });

    // const [mandals, setMandals] = useState([]);
    // const [selectedDistrict, setSelectedDistrict] = useState("");
    // const [villages, setVillages] = useState([]);
    // const [pincode, setPincode] = useState(null);
    // const [selectedMandal, setSelectedMandal] = useState("");
    // const [customerData, setCustomerData] = useState([]);
    // const [uploadedFileName, setUploadedFileName] = useState(null);

    // const [showAssignAgentButton, setShowAssignAgentButton] = useState("");
    // const [district, setDistrict] = useState('');
    const [nameSearchQuery, setNameSearchQuery] = useState([]);
    // const [isAddModalOPen, setIsAddModalOpen] = useState(false);
    // const [ExistingCustomerDetails, setExistingCustomerDetails] = useState([]);
    // const [IsModalVisible, setIsModalVisible] = useState(false);
    // const handlevillageChange = async (value) => {
    //     setAddressDetails((prev) => ({ ...prev, village: value }));
    // };
    // const handleDistrictChange = (e) => {
    //     setDistrict(e.target.value);
    // };
    // const [properties, setProperties] = useState([]);
    // const [filteredProperties, setFilteredProperties] = useState([]);
    // const [loading, setLoading] = useState(false);

    const [customerExists, setCustomerExists] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [customerDetails1, setCustomerDetails1] = useState([]);

    // const handleCloseModal = async () => {
    //     setIsAddModalOpen(false);
    // }
    form.resetFields();
    // setCustomerExists(false);
    const handlePhoneNumber = async (value) => {
        try {

            const response = await _get(`/deal/checkUser/${value}`);
            console.log(response.data);
            setCustomerExists(true);
            message.error("customer already Exists");
            setCustomerDetails(response.data.data);
            console.log(customerExists);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.message);
            if (error.response.data.message === "Customer not found") {
                setCustomerExists(false);
                // setIsModalOpen(false);
                console.log(customerExists);
            } else {
                const errorMessage = error?.response?.data?.message || "An error occurred while fetching agents.";
                message.error(errorMessage);
            }
        }
    };
    // useEffect(() => {


    //     const fetchCustomers = async () => {
    //         try {
    //             const response = await _get(`/customer/getCustomer`);
    //             console.log(response.data);
    //             setCustomerDetails1(response.data);
    //         } catch (error) {
    //             console.error("Error fetching agents: ", error);
    //         }
    //     };
    //     fetchCustomers();
    // }, []);

    // useEffect(() => {
    //     const fetchProperties = async () => {
    //         // setLoading(true);
    //         try {
    //             const response = await _get('/deal/getAllProperties');
    //             console.log(response);
    //             const data = response.data.data || [];
    //             console.log(data);
    //             // setProperties(
    //             //     data.map((agent) => ({
    //             //         propertyId: agent.id,
    //             //         propertyName: agent.propertyName,
    //             //         type: agent.type,
    //             //         agentId: agent.agentId
    //             //     }))
    //             // );

    //             // setFilteredProperties(
    //             //     data.map((agent) => ({
    //             //         propertyId: agent.id,
    //             //         propertyName: agent.propertyName,
    //             //         type: agent.type,
    //             //         agentId: agent.agentId,
    //             //         displayName: `${agent.propertyName} - ${agent.type}`, // This is for display in the Select
    //             //     }))
    //             // );
    //         } catch (error) {
    //             console.error('Error fetching properties:', error);
    //         } finally {
    //             // setLoading(false);
    //         }
    //     };
    //     fetchProperties();
    // }, []);


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

    // const csrId = localStorage.getItem("userId");
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
        let updatedValues = {
            ...values,
            // properties: properties
            role: "3",

        };
        console.log(properties);
        if (customerExists && customerDetails && Object.keys(customerDetails).length > 0) {
            updatedValues = {
                ...updatedValues,
                firstName: customerDetails.firstName,
                lastName: customerDetails.lastName,
                email: customerDetails.email,
                phoneNumber: customerDetails.phoneNumber,
                pinCode: customerDetails.pincode,
                state: customerDetails.state,
                country: customerDetails.country,
                district: customerDetails.district,
                mandal: customerDetails.mandal,
                village: customerDetails.village,
                role: "3",

            };
        }
        console.log(updatedValues);

        try {
            const res = await _post(
                "/users/createCSR",
                updatedValues,
                "Customers Added Successfully",
                "Error Adding Customers"
            );
            if (res.status === 200 || res.status === 201) {
                form.resetFields();
                setNameSearchQuery([]);
            }


        } catch (error) {
        }
    };
    // const onDelete = () => {
    //     setUploadedFileName(null);
    //     setFileList(null);
    // }
    // const handleSearch = (searchValue) => {
    //     console.log(searchValue);
    //     setNameSearchQuery(searchValue);
    //     if (!searchValue) {
    //         setFilteredProperties(properties);
    //     } else {
    //         const filtered = properties.filter((property) =>
    //             property.label.toLowerCase().includes(searchValue.toLowerCase())
    //         );
    //         setFilteredProperties(filtered);
    //     }
    // };
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
        <>


            <Card
                title="Customer Details"
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
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
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
                                            {
                                                min: 3,
                                                max: 30,
                                                message: "First name must be between 2 and 50 characters",
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
                            )}
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>

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
                                            {
                                                min: 3,
                                                max: 60,
                                                message: "Last name must be between 2 and 50 characters",
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
                            )}

                        </Row>
                        <Row gutter={16}>
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
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
                            )}
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
                                    <Form.Item
                                        name="occupation"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            
                                            {
                                                pattern: /^[A-Za-z\s]+$/,
                                                message: `${t("registration.Only alphabets are allowed")}`,
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
                                            <label>
                                                Occupation
                                            </label>
                                        </div>
                                    </Form.Item>
                                </Col>
                            )}
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
                                    <Form.Item
                                        name="income"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <div className="floating-label">
                                            <Select placeholder="Select Income">
                                                <Select.Option value="0-5">0 - 5 Lakhs</Select.Option>
                                                <Select.Option value="5-10">5 - 10 Lakhs</Select.Option>
                                                <Select.Option value="10-20">10 - 20 Lakhs</Select.Option>
                                                <Select.Option value="20-50">20 - 50 Lakhs</Select.Option>
                                                <Select.Option value="50-100">50 Lakhs - 1 Crore</Select.Option>
                                            </Select>

                                        </div>
                                    </Form.Item>
                                </Col>
                            )}


                        </Row>
                        <Row gutter={16}>
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
                                    <Form.Item
                                        name="country" // Ensure this matches the field name

                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        rules={[{ required: true, message: 'Country is Required' }]} // Validation
                                    >
                                        <div className="floating-label">
                                            <Select
                                                placeholder="Select a country"
                                                allowClear
                                                value={form.getFieldValue('country')} // Bind value to the form field
                                                onChange={(value) => form.setFieldsValue({ country: value })} // Update form field value when selected
                                                options={[
                                                    { value: 'india', label: 'India' },
                                                    { value: 'uk', label: 'United Kingdom' },
                                                    { value: 'us', label: 'United States' },
                                                    { value: 'singapore', label: 'Singapore' },
                                                    { value: 'australia', label: 'Australia' },
                                                ]}
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>
                            )}
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
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
                            )}

                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
                                    <Form.Item
                                        name="pinCode"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            {
                                                pattern: /^[0-9]{6}$/,

                                                message: `${t("registration.Only 6 digit code is allowed")}`,
                                            },
                                        ]}
                                    >
                                        <div className="floating-label">
                                            <Input placeholder=" " />
                                            <label> <span className="required">*</span> {t("registration.Pincode")}</label>
                                        </div>
                                    </Form.Item>
                                </Col>
                            )}

                        </Row>
                        <Row gutter={16}>
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
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

                                            />

                                            <label>
                                                <span className="required">*</span> District
                                            </label>
                                        </div>
                                    </Form.Item>
                                </Col>
                            )}
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
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
                            )}
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
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
                            )}

                        </Row>
                        <Row>
                            {!customerExists && (
                                <Col xs={24} sm={12} md={8} lg={8}>
                                    <Form.Item
                                        name="budget"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            { required: true, message: "Budget is required" },
                                            {
                                                pattern: /^[0-9]+$/,
                                                message: "Only numbers are allowed for the budget",
                                            },
                                            {
                                                validator(_, value) {
                                                    if (value && (parseInt(value) < 0 || parseInt(value) > 100000000)) {
                                                        return Promise.reject(new Error("Budget must be between 0 and 10 crore"));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <div className="floating-label">
                                            <Input
                                                placeholder=" "
                                                style={{ width: "96%" }}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                                                    e.target.value = value;
                                                }}
                                            />
                                            <label>Budget</label>
                                        </div>
                                    </Form.Item>
                                </Col>

                            )}
                        </Row>
                        {/* 
                        <Row gutter={16}>

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
                                            {filteredProperties.map((property) => (
                                                <Option key={property.propertyId} value={property.displayName}>
                                                    {property.displayName}
                                                </Option>
                                            ))}
                                        </Select>
                                        <label className="floating-label property-name-label">
                                            Property Name
                                        </label>
                                    </div>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={16} lg={16}>
                                <Form.Item

                                    name="interestIn"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}

                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
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
                                            Add Comments from the Buyers
                                        </label>
                                    </div>
                                </Form.Item>
                            </Col>

                        </Row> */}
                        {!customerExists && (
                            <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Form.Item>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>)}
                    </Form>
                </div>






            </Card>


        </>
    );
}

export default AddCustomer;


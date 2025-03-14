import React, { useEffect, useState, useRef } from "react";
import { _get} from "../../Service/apiClient";
import { Table, Avatar, Modal, Row, Col, Input, Select, Card, Button, DatePicker, Spin, Form } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, UserOutlined, IdcardOutlined, MoneyCollectOutlined, PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import moment from 'moment';
import "./Customers.css"
import AddCustomer from "./AddCustomer";
const { Option } = Select;
// const { Search } = Input
export default function Customers() {
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    // const [locationSearchQuery, setLocationSearchQuery] = useState("");
    const [agentNames, setAgentNames] = useState([]);
    const location = useLocation();
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const enableSelection = location.state?.enableSelection || false;
    // const MarketingAgentId = location.state?.MarketingAgentId || null;
    const [loading, setLoading] = useState(false);
    const [assignedDate, setAssignedDate] = useState(null);
    const [selectDate, setSelectDate] = useState(false);
    const datePickerRef = useRef(null);
    const [form] = Form.useForm();
    const [isAddModalOPen, setIsAddModalOpen] = useState(false);
    const handleChooseDateClick = () => {
        setSelectDate(true);
        if (datePickerRef.current) {
            datePickerRef.current.focus();
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAgents = async () => {
            // const id = localStorage.getItem("userId");
            setLoading(true);
            try {
                const response = await _get(`/customer/getCustomer`);
                if (response && response.data) {
                    setAgents(response.data);
                    setAgentNames(
                        Array.from(
                            new Set(
                                response.data.map((agent) => `${agent.firstName} ${agent.lastName}`)
                            )
                        )
                    );

                    setLoading(false);
                    console.log("Agents fetched successfully:", response.data);
                } else {
                    console.log("No data received from the API.");
                }
            } catch (error) {
                console.error("Error fetching agents: ", error);
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);
    const handleCloseModal = () => {
        setIsAssignModalOpen(false);
        setSelectDate(false);
        setIsAddModalOpen(false);
    };
    const handleAssignClick = () => {
        setIsAssignModalOpen(true);
    };
    const handleDateChange = (date) => {
        setAssignedDate(date);
    };

    const handleAssign = async (dateType) => {
        // const csrId = localStorage.getItem("userId");

        let dateToAssign;

        if (dateType === "Today") {
            setSelectDate(false);
            dateToAssign = moment();
        } else if (dateType === "Tomorrow") {
            setSelectDate(false);
            console.log("fhfhf");
            dateToAssign = moment().add(1, "days");
            console.log(dateToAssign);
        } else {
            const date = new Date(assignedDate);
            date.setDate(date.getDate() + 1);
            dateToAssign = date;
        }
        console.log(dateToAssign);
        // const payload = {
        //     assignedBy: csrId,
        //     assignedTo: MarketingAgentId,
        //     assignedDate: dateToAssign,
        //     customers: selectedRowKeys.map((customerId) => ({
        //         customerId: customerId,
        //         status: "",
        //         description: "",
        //     })),
        // };

        setLoading(true);
        try {
            // const res = await _post(
            //     "/csr/assignCustomer",
            //     payload,
            //     "Assigned Successfully",
            //     "Customer already assigned for this"
            // );
            setAssignedDate(null);
            setIsAssignModalOpen(false);
            setSelectedRowKeys([]);
        } catch (error) {
            console.error("Error in assigning:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleBackToCustomers = () => {
        navigate('/dashboard/csr/MarketingAgents');
    };
    const handleAvatarClick = (agent) => {
        setSelectedAgent(agent);
        setIsModalVisible(true);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            setSelectedRowKeys(keys);

        },
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedAgent(null);
    };
    const handleAddClick = async () => {
        setIsAddModalOpen(true);
    }

    const columns = [
        {

            title: "Profile",
            dataIndex: "profilePicture",
            key: "profilePicture",
            align: "center",
            render: (text, record) => (
                <Avatar
                    src={text}
                    size={40}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAvatarClick(record)}
                />
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },

        {
            title: "Name",
            dataIndex: "firstName",
            key: "firstName",
            align: "center",
            render: (text, record) => (
                <span>

                    <p
                        onClick={() => handleAvatarClick(record)}
                        style={{
                            color: "#0D416B",

                            cursor: "pointer",
                        }}
                    >

                        {`${record.firstName} ${record.lastName}`}
                    </p>
                </span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                },
            }),
        },


        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            align: "center",
            render: (text) => (
                <>
                    <MailOutlined style={{ marginRight: "5px", color: "#0d416b" }} />
                    {text}
                </>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center",
            render: (text) => (
                <>
                    <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                    {formatPhoneNumber(text)}
                </>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: "District",
            dataIndex: "district",
            key: "district",
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: "Mandal",
            dataIndex: "mandal",
            key: "mandal",
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: "City",
            dataIndex: ["city", "village"],
            key: "city",
            align: "center",
            render: (text, record) => record.city || record.village || "N/A",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                },
            }),

        },
    ];
    console.log(agents);
    const filteredAgents = agents.filter((agent) => {
        const nameMatch = nameSearchQuery
            ? `${agent.firstName} ${agent.lastName}`
                .toLowerCase()
                .includes(nameSearchQuery.toLowerCase())
            : true;

        // const locationMatch = locationSearchQuery
        //     ? (agent.district && agent.district.toLowerCase().includes(locationSearchQuery.toLowerCase())) ||
        //     (agent.mandal && agent.mandal.toLowerCase().includes(locationSearchQuery.toLowerCase())) ||
        //     (agent.village && agent.village.toLowerCase().includes(locationSearchQuery.toLowerCase()))
        //     : true;

        return nameMatch ;
    });

    if (loading) {
        return <Spin size="large" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
        }} />;
    }

    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber; // Return the original if it doesn't match the pattern
    };
    return (
        <div>

            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                }}
            >
                <Row gutter={[16, 16]}>
                    {enableSelection && (
                        <Col xs={24} sm={12} md={2} lg={2}>
                            <button
                                onClick={handleBackToCustomers}
                                style={{
                                    padding: "6px 10px",
                                    backgroundColor: "#0D416B",
                                    color: "white",
                                    // marginLeft: "-43%",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                <FaArrowLeft />
                            </button>
                        </Col>
                    )}
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <Select
                            showSearch
                            placeholder="Search by Customer name"
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}
                            value={nameSearchQuery || undefined}
                            onChange={(value) => setNameSearchQuery(value)}
                            onSearch={(value) => setNameSearchQuery(value)}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        >
                            {agentNames.map((name, index) => (
                                <Option key={index} value={name}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                        <Input
                            placeholder="Search by Location"
                            allowClear
                            onChange={(e) => setNameSearchQuery(e.target.value)}
                            style={{ width: 250, height: "36px" }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>

                    <Col
                        xs={24}
                        sm={12}
                        md={3}
                        lg={3}
                        style={{
                            marginLeft: enableSelection ? "10%" : "35%", // Dynamically set marginLeft
                        }}
                    >
                        <Button
                            onClick={handleAddClick}
                            style={{ backgroundColor: "#0D416B", color: "white" }}
                        >
                            <PlusCircleFilled /> Add Customer
                        </Button>
                    </Col>
                    {enableSelection && (
                        <Col xs={24} sm={12} md={4} lg={4}>
                            <Button
                                type="primary"
                                onClick={handleAssignClick}
                                style={{
                                    width: "65%",
                                    backgroundColor: selectedRowKeys.length === 0 ? "#B0B0B0" : "#0D416B", // Change color when disabled
                                    color: "white",

                                }}
                                disabled={selectedRowKeys.length === 0}
                            >
                                Assign
                            </Button>
                        </Col>
                    )}
                </Row>
            </Card>
            <Row style={{ marginTop: "20px" }}>
                <Col xs={24}>
                    <Table
                        dataSource={filteredAgents}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: "max-content" }} // Allows horizontal scroll for smaller screens
                        style={{ marginTop: "20px" }}
                        {...(enableSelection ? { rowSelection } : {})}


                    />
                </Col>
            </Row>

            {selectedAgent && (
                <Modal
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                    width={800}

                    style={{
                        marginTop: "5%"
                    }}

                >

                    <Card
                        title={
                            <div style={{ backgroundColor: "#0d416b", color: "white", padding: "10px" }}>
                                Customer Details
                            </div>
                        }
                        headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                        style={{
                            width: "99%",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                            {/* Customer Name */}
                            <Col span={8}>
                                <UserOutlined /> <strong>{selectedAgent.firstName} {selectedAgent.lastName}</strong>
                            </Col>
                            <Col span={8}>
                                <PhoneOutlined /> <span>{formatPhoneNumber(selectedAgent.phoneNumber)}</span>
                            </Col>
                            <Col span={8}>
                                <MailOutlined /> <span>{selectedAgent.email}</span>
                            </Col>
                        </Row>


                        <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                            {/* Address */}
                            <Col span={24}>
                                <EnvironmentOutlined /> <strong>Address:</strong>{" "}
                                <span>
                                    {[
                                        selectedAgent.village,
                                        selectedAgent.mandal,
                                        selectedAgent.district,
                                        selectedAgent.state,
                                        selectedAgent.country,
                                    ]
                                        .filter((part) => part) // Remove empty or null values
                                        .join(", ")}
                                </span>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            {/* Occupation */}
                            <Col span={12}>
                                <IdcardOutlined /> <strong>Occupation:</strong>{" "}
                                {selectedAgent.occupation ? selectedAgent.occupation : "N/A"}
                            </Col>
                            <Col span={12}>
                                <MoneyCollectOutlined /> <strong>Income:</strong>{" "}
                                {selectedAgent.income ? selectedAgent.income : "N/A"}
                            </Col>
                        </Row>
                    </Card>

                </Modal>


            )}
            <Modal
                title="Select Date"
                visible={isAssignModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={350}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        <Button
                            type="primary"
                            style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
                            onClick={() => handleAssign("Today")}
                            disabled={loading}
                        >
                            Today
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Button
                            type="primary"
                            style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
                            onClick={() => handleAssign("Tomorrow")}
                            disabled={loading}
                        >
                            Tomorrow
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Button
                            type="primary"
                            style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
                            onClick={handleChooseDateClick}
                            disabled={loading}
                        >
                            Choose Date
                        </Button>
                    </Col>
                </Row>
                {selectDate && (
                    <Row>
                        <Col span={24}>
                            <DatePicker
                                ref={datePickerRef}
                                value={assignedDate}
                                onChange={handleDateChange}
                                placeholder="Select Assignment Date"
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                                disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Col>
                    </Row>
                )}
                {selectDate && (
                    <Row style={{ marginTop: '20px', marginLeft: "20%" }} gutter={16}>
                        <Col span={8}>
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={() => handleAssign("Custom")}
                                style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
                            >
                                Assign
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button
                                onClick={handleCloseModal}
                                style={{ width: '100%' }}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                )}
            </Modal>
            <Modal
                visible={isAddModalOPen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <AddCustomer formReset={form.resetFields} />
            </Modal>
        </div >
    );
}

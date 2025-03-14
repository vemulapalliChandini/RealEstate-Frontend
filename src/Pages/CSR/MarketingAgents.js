    /* eslint-disable */



import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, Table, Modal, Avatar, Menu, Dropdown, Spin, Input } from "antd";
import { _get } from "../../Service/apiClient";
import { useNavigate } from "react-router-dom";
 // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import AddMarketingAgents from "./AddMarketingAgents";
import { MailOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";
// import AssignedProperties from "../MarketingAgents/AssignedProperties";

// const { Search } = Input;
 

const MarketingAgent = ({ responseTrue }) => {

    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null); // For Modal
    const [isModalVisible, setIsModalVisible] = useState(false); // To control the modal visibility
    const [isMarketingAgentsModalVisible, setIsMarketingAgentsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState("");
    // const [selectedAgentId,setSelectedAgentId]=useState(null);
    const navigate = useNavigate();

    const showModal = (record) => {
        setIsModalVisible(true);
        setSelectedAgent(record);
    };
    const showMarketingAgentsModal = () => {
        setIsMarketingAgentsModalVisible(true);
    }


    //  new navigation..

    const handleAssignPropertiess = (id) => {
        console.log(id); 
        navigate("/dashboard/csr/assignedproperties", { state: { id } }); // Send the ID directly in state
    };
    
    const handleAssignCustomer = () => {
        navigate("/dashboard/csr/assignedcustomer"); // Route to 'assign-customer' page
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsMarketingAgentsModalVisible(false);
    };
    const handleAssignCustomers = (record) => {
        navigate("/dashboard/csr/Customers", {
            state: {
                enableSelection: true,
                MarketingAgentId: record._id,
            }
        });
    };
    // const handleCustomerStatus = (record) => {
    //     navigate("/dashboard/csr/customerfortoday", {
    //         state: {
    //             enableSelection: true,
    //             MarketingAgentId: record._id,
    //         }
    //     });
    // };
    const handleAssignProperties = (record) => {
        navigate("/dashboard/csr/Properties", {
            state: {
                enableSelection: true,
                MarketingAgentId: record._id,
            }
        });
    }
    const fetchAgents = async () => {
        try {
            setLoading(true);
            const response = await _get("/marketingAgent/getMAgent");
            console.log(response.data.data);
            setLoading(false);
            setAgents(response.data.data);
        } catch (error) {
            setLoading(false);
            console.error("Error Fetching data:", error);
        }
    };
    const filteredAgents = agents.filter((agent) => {
        console.log(agent);
        const nameSearch = nameSearchQuery ? nameSearchQuery.toLowerCase() : '';

        const trimmedNameSearch = nameSearch.trim().toLowerCase();
        const fullName = (agent.firstName + " " + agent.lastName).toLowerCase().trim(); // Combine names, make lowercase and trim spaces

        const nameMatch = fullName.includes(trimmedNameSearch); // Compare




        const locationSearch = locationSearchQuery.toLowerCase();

        const locationMatch =

            (agent.district?.toLowerCase().includes(locationSearch)) ||
            (agent.mandal?.toLowerCase().includes(locationSearch)) ||
            (agent.village?.toLowerCase().includes(locationSearch))






        return nameMatch && locationMatch;
    });
    // Fetch agents data from the API
    useEffect(() => {

        fetchAgents();
    }, []);
    useEffect(() => {
        if (responseTrue) {

            console.log("Response is true. Trigger the required logic.");
            fetchAgents();

        }
    }, [responseTrue]);
    // View details page redirect
    // const viewDetails = (agentId) => {
    //     navigate(`/marketing-agent/details/${agentId}`);
    // };
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    };


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
                    onClick={() => showModal(record)}
                />
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },

        {
            title: "Name",
            dataIndex: "fullName",
            align: "center",
            render: (text, record) => `${record.firstName} ${record.lastName}`,
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
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
            title: "Location",
            dataIndex: "district",
            align: "center",
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (text, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item
                            key="assignProperties"
                            onClick={() => handleAssignProperties(record)}
                            style={{ backgroundColor: "#e0e0e0", color: "#000" }}
                        >
                            Assign Properties
                        </Menu.Item>
                        <Menu.Item
                            key="assignCustomers"
                            onClick={() => handleAssignCustomers(record)}
                            style={{ backgroundColor: "#cce7ff", color: "#000" }}
                        >
                            Assign Customers
                        </Menu.Item>

                        {/*  Usenavigation */}

                        <Menu.Item
                            key="viewAssignedProperties"
                            onClick={() => handleAssignPropertiess(record._id)} // Pass record._id to the function
                            style={{ backgroundColor: "#e0e0e0", color: "#000" }}
                        >
                            View Assigned Properties
                           
                        </Menu.Item>


                        <Menu.Item
                            key="viewAssignedCustomer"
                            onClick={handleAssignCustomer}
                            style={{ backgroundColor: "#e0e0e0", color: "#000" }}
                        >
                            View Assigned Customer
                        </Menu.Item>

                    </Menu>
                );

                return (
                    <Dropdown
                        overlay={menu} trigger={['click']}>
                        <Button shape="circle" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),
        }

    ];
    if (loading) {
        return <Spin size="large" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
        }} />;
    }

    return (
        <div style={{ padding: "10px" }}>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                    marginBottom: "2%"
                }}
            >
                <Row gutter={[16, 16]} >
                    <Col xs={24} sm={12} md={8} lg={5}>
                        <Input
                            placeholder="Search by Location"
                            allowClear
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />

                    </Col>
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <Input
                            placeholder="Search by Agent name"
                            allowClear
                            onChange={(e) => setNameSearchQuery(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />

                    </Col>
                    <Col xs={24} sm={12} md={5} lg={5} style={{ marginLeft: "35%" }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showMarketingAgentsModal}
                            style={{ backgroundColor: "#0D416B", color: "white", float: "right" }}
                        >
                            Add Marketing Agents
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Table
                dataSource={filteredAgents}
                columns={columns}
                rowKey="_id"
                pagination={true}
                scroll={{ x: "max-content" }}
                style={{ marginTop: "20px" }}
                locale={{
                    emptyText: 'No Marketing Agents found',
                }}
            />


            {/* Modal to show full agent details */}
            <Modal
                title={
                    <div style={{ textAlign: "center" }}>
                        {`${selectedAgent?.firstName} ${selectedAgent?.lastName}`}
                    </div>
                }
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={500}
            >
                {selectedAgent && (
                    <Card>
                        <img
                            src={selectedAgent.profilePicture}
                            alt="Profile"
                            style={{ width: "100%", objectFit: "cover", height: "200px" }}
                        />

                        <p style={{ marginTop: "2%" }}><strong>Phone Number:</strong> {formatPhoneNumber(selectedAgent.phoneNumber)}</p>
                        <p><strong>Email:</strong> {selectedAgent.email}</p>
                        <p><strong>District:</strong> {selectedAgent.district}</p>
                        <p><strong>Mandal:</strong> {selectedAgent.mandal}</p>
                        <p><strong>Village:</strong> {selectedAgent.city}</p>
                    </Card>
                )}
            </Modal>
            <Modal
                title={
                    <div
                        style={{
                            textAlign: "center",
                            backgroundColor: "#0d416b",
                            color: "white",
                            padding: "10px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                        }}
                    >
                        Add Marketing Agent
                    </div>
                }
                visible={isMarketingAgentsModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                headerStyle={{
                    backgroundColor: "#0d416b",
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >

                <AddMarketingAgents onAddSuccess={fetchAgents} />
            </Modal>
        </div>
    );
};

export default MarketingAgent;
import React, { useEffect, useState } from "react";
import { Modal, Avatar, Button, Checkbox, Table, Input, Col, Select, Spin } from "antd";
import { _get, _put } from "../../Service/apiClient"; // Replace with your actual API call function
import "./Admin.css";
import { FaWhatsapp } from "react-icons/fa";
const { Option } = Select;
function AdminAgents() {
    const [csr, setCsr] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [allAgents, setAllAgents] = useState([]);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState("");
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageToView, setImageToView] = useState({});
    const [assignedAgents, setAssignedAgents] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [csrNames, setCSRNames] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchCsr = async () => {
            setLoading(true);
            try {
                const response = await _get("agent/getAllAgents");
                setCsr(response.data);
                setCSRNames(
                    [...new Set(response.data.map((csr) => `${csr.firstName} ${csr.lastName}`))]
                );
                setLoading(false);
            } catch (error) {
                console.error("Error fetching CSR details:", error);
                setLoading(false);
            }
        };
        fetchCsr();
    }, []);
    const handleViewModalCancel = () => {
        setIsViewModalOpen(false);
        setAssignedAgents([]);
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchAllAgents();
        }
    }, [isModalOpen]);

    const fetchAllAgents = async () => {
        try {
            const response = await _get("/csr/getUnAssignedAgents");
            setAllAgents(response.data);
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedAgent(null);
    };

    const handleCheckboxChange = (agentId) => {
        setSelectedAgents((prevSelected) =>
            prevSelected.includes(agentId)
                ? prevSelected.filter((id) => id !== agentId)
                : [...prevSelected, agentId]
        );
    };

    const handleConfirmAssignment = async () => {
        const body = {
            csrId: selectedAgent._id,
            agents: selectedAgents,
        };

        try {
            await _put("csr/assignAgentToCSR", body, "Agent Added Successfully", "Failed to add Agent");
            fetchAllAgents();
            handleCancel();
        } catch (error) {
            console.error("Error assigning agents:", error);
        }
    };

    const handleImageClick = (details) => {
        setImageToView(details);
        setIsImageModalOpen(true);
    };

    const handleImageModalClose = () => {
        setIsImageModalOpen(false);
        setImageToView(null);
    };

    const columns = [
        {
            title: "Profile",
            dataIndex: "profilePicture",
            key: "profilePicture",
            render: (_, record) => (
                <div
                    style={{
                        position: "relative",
                        display: "inline-block",
                        cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(record)} // Use record.csr.profilePicture to get the image source
                >
                    <Avatar
                        src={record.profilePicture} // Access profile picture from the 'csr' object inside the record
                        size={40}
                        style={{
                            borderRadius: "50%",
                            border: "2px solid #ffffff",
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                </div>
            ),
            
        },
        {
            title: "Name",
            dataIndex: "firstName",
            key: "firstName",
            render: (text, record) => `${record.firstName} ${record.lastName}`,
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
            }),
          
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center",},
            }),
          
            render: (phoneNumber) => {
                <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                const formatPhoneNumber = (phoneNumber) => {
                    if (!phoneNumber) return "";
                    const cleaned = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters
                    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        return `${match[1]}-${match[2]}-${match[3]}`;
                    }
                    return phoneNumber; // Return the original if it doesn't match the pattern
                };
                return formatPhoneNumber(phoneNumber);
            },
          
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),
           
        },
        {
            title: "Location",
            dataIndex: "country",
            key: "country",
            render: (country, record) => record.district,
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center",},
            }),
     
        },
        {
            title: "Assigned CSR",
            dataIndex: "assignedCsr",
            key: "assignedCsr",
            render: (assignedCsr, record) => {
                return assignedCsr ? assignedCsr : "Unassigned";
            },
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),
          
        },
    ];

    const filteredAgents = csr.filter((agent) => {
        const nameSearch = nameSearchQuery ? nameSearchQuery.toLowerCase() : '';


        const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase();

        const nameMatch =
            fullName.includes(nameSearch) ||
            agent.firstName.toLowerCase().includes(nameSearch) ||
            agent.lastName.toLowerCase().includes(nameSearch);


        const locationSearch = locationSearchQuery.toLowerCase();
        const locationMatch =
            (agent.district && agent.district.toLowerCase().includes(locationSearch)) ||
            (agent.mandal && agent.mandal.toLowerCase().includes(locationSearch)) ||
            (agent.village && agent.village.toLowerCase().includes(locationSearch));

        return nameMatch && locationMatch;
    });


    return (
        <div>

            <div xs={24} sm={12} md={8} style={{ display: "flex" }}>


                <Select
                    showSearch
                    placeholder="Search or select agent name"
                    style={{ width: 200, border: "1px solid #666", marginRight: "3%" }}
                    value={nameSearchQuery || undefined} // Ensure undefined for placeholder to show
                    onChange={(value) => {
                        if (value !== null) {
                            setNameSearchQuery(value);
                        } else {
                            setNameSearchQuery(null);
                        }
                    }}
                    onSearch={(value) => {

                        setNameSearchQuery(value);
                    }}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    allowClear
                >
                    {csrNames.map((name, index) => (
                        <Option key={index} value={name}>
                            {name}
                        </Option>
                    ))}
                </Select>

                <Input
                    placeholder="Search by Location"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    style={{ width: 200, border: "1px solid #666", marginRight: "30%" }}
                />
            </div>
            {loading ? (
                <Col xs={24} style={{ position: 'relative', height: '400px' }}>
                    {/* Add a container with relative position to center the loader */}
                    <Spin
                        size="large"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)", // This centers the loader
                        }}
                    />
                </Col>
            ) : (
                <Col xs={24}>
                    <Table
                        dataSource={filteredAgents}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                        style={{ marginTop: "3%" }}
                    />

                </Col>
            )}


            <Modal
                title={<div style={{ textAlign: "center" }}>Assign An Agent</div>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedAgent && (
                    <div>
                        <h3>Available Agents:</h3>
                        <ul>
                            {allAgents.map((agent) => (
                                <li key={agent._id}>
                                    <Checkbox
                                        checked={selectedAgents.includes(agent._id)}
                                        onChange={() => handleCheckboxChange(agent._id)}
                                    >
                                        {agent.firstName} {agent.lastName} - {agent.email}
                                    </Checkbox>
                                </li>
                            ))}
                        </ul>
                        <Button type="primary" onClick={handleConfirmAssignment}>
                            Confirm Assignment
                        </Button>
                    </div>
                )}
            </Modal>
            <Modal
                title={<div style={{ textAlign: "center" }}>Assigned Agents</div>}
                open={isViewModalOpen}
                onCancel={handleViewModalCancel}
                footer={null}
            >
                <ul>
                    {assignedAgents.length > 0 ? (
                        assignedAgents.map((agent) => (
                            <li key={agent._id}>
                                {agent.firstName} {agent.lastName}
                            </li>
                        ))
                    ) : (
                        <p>No agents assigned.</p>
                    )}
                </ul>
            </Modal>
            {isImageModalOpen && (
                <Modal
                    open={isImageModalOpen}
                    footer={null}
                    onCancel={handleImageModalClose}
                    width={250}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={imageToView.profilePicture}
                            alt="Profile"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #1890ff',
                                marginBottom: '16px',
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <strong>
                                <h3 style={{ margin: 0, color: '#333' }}>{imageToView.firstName} {imageToView.lastName}</h3>
                            </strong>
                            <p style={{ margin: '4px 0', color: '#555' }}>
                                <strong>State: </strong> {imageToView.state}
                            </p>
                            <p style={{ margin: '4px 0', color: '#555' }}>
                                <strong>Country: </strong> {imageToView.country}
                            </p>
                            <p style={{ margin: '4px 0', color: '#555' }}>
                                <strong>District: </strong> {imageToView.district}
                            </p>
                            <p style={{ margin: '4px 0', color: '#555' }}>
                                <strong>Mandal: </strong> {imageToView.mandal}
                            </p>
                            <p style={{ margin: '4px 0', color: '#555' }}>
                                <strong>City: </strong> {imageToView.city}
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AdminAgents;

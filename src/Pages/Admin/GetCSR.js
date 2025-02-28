import React, { useEffect, useState } from "react";
import { Modal, Avatar, Button, Checkbox, Table, Row, Col, Select, Card, message, Input, Spin } from "antd";
import { EyeOutlined, PhoneOutlined, PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { _get, _put } from "../../Service/apiClient"; // Replace with your actual API call function
import "./Admin.css"
import { MailOutlined } from '@ant-design/icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FaWhatsapp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteOutline } from "@mui/icons-material";
import { use } from "react";
const { Option } = Select;
function GetCSR() {
    const [csr, setCsr] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [allAgents, setAllAgents] = useState([]);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageToView, setImageToView] = useState({});
    const [assignedAgents, setAssignedAgents] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [csrId, setCsrId] = useState(null);
    const [csrName, setCsrName] = useState(null);
    const [expandedAgentId, setExpandedAgentId] = useState(null);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState("");
    const [nameSearchQuery1, setNameSearchQuery1] = useState("");
    const [nameSearchQuery2, setNameSearchQuery2] = useState("");
    const [agentId, setAgentId] = useState("");
    const [loading, setLoading] = useState(false);
    const handleExpandClick = (agentId) => {
        setExpandedAgentId((prevId) => (prevId === agentId ? null : agentId));
    };
    const [csrNames, setCSRNames] = useState([]);
    useEffect(() => {
        const fetchCsr = async () => {
            setLoading(true);
            try {
                const response = await _get("agent/getAllCsr");
                console.log(response.data);
                setCsr(response.data);
                setCSRNames(
                    [...new Set(response.data.map((csr) => `${csr.csr.firstName} ${csr.csr.lastName}`))]
                );
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching CSR details:", error);
            }
        };
        fetchCsr();
    }, []);

    const fetchAssignedAgents = async (id, firstName, lastName) => {
        try {
            const response = await _get(`/csr/getAssignedAgents/${id}`);
            setAssignedAgents(response.data || []);
            setCsrId(id);
            setCsrName(`${firstName} ${lastName}`);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error("Error fetching assigned agents:", error);
            setAssignedAgents([]);
            setCsrId(id);
            setIsViewModalOpen(true);
        }
    };
    const filteredAgents1 = assignedAgents.filter((agent) =>
        `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(nameSearchQuery1.toLowerCase())
    );
    const filteredAgents2 = allAgents.filter((agent) =>
        `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(nameSearchQuery2.toLowerCase())
    );
    const showModal = (agent) => {
        setSelectedAgent(agent);
        setIsModalOpen(true);
        setIsViewModalOpen(false);
    };

    const handleViewModalCancel = () => {
        setIsViewModalOpen(false);
        setAssignedAgents([]);

    };
    const handleDeleteModalCancel = () => {
        setIsDeleteModalOpen(false);
    };
    const deleteAssignedAgent = async () => {
        const body = {
            agentId: agentId
        };

        try {
            await _put("/admin/unAssignAgent", body, "Agent Deleted Successfully", "Error Deleting an Agent");

            fetchAssignedAgents(csrId);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error assigning agents:", error);
        }
    };


    const fetchAllAgents = async (csrId) => {

        try {
            const response = await _get(`/csr/getUnAssignedAgents/${csrId}`);

            if (response.data === "No agents found") {
                message.info("No agents available to assign.");
                setIsModalOpen(false);
            } else {
                showModal(csrId);
                setAllAgents(response.data);
                setIsModalOpen(true);
            }
        } catch (error) {

            console.error("Error fetching agents:", error.response.data);
            if (error.response.data === "No Agent Found") {
                message.info("No agents available to assign.");
                setIsModalOpen(false);
            } else {
                const errorMessage = error?.response?.data?.message || "An error occurred while fetching agents.";
                message.error(errorMessage);
            }
        }
    };
    const deleteAgent = async (agentId) => {
        setIsDeleteModalOpen(true);
        setAgentId(agentId);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedAgent(null);
        setIsViewModalOpen(true);
    };


    const handleConfirmAssignment = async () => {
        console.log(csrId);
        const body = {
            csrId: csrId,
            agents: selectedAgents,
        };

        try {
            await _put("csr/assignAgentToCSR", body, "Agent Added Successfully", "Failed to add Agent");
            setIsModalOpen(false);
            setIsViewModalOpen(true);
            handleCancel();
        } catch (error) {
            console.error("Error assigning agents:", error);
        }
    };

    const handleImageClick = (details) => {
        console.log(details);
        setImageToView(details);
        setIsImageModalOpen(true);
        console.log(imageToView);
    };

    const handleImageModalClose = () => {
        setIsImageModalOpen(false);
        setImageToView(null);
    };
    const handleAgentSelect = (agentId) => {
        setSelectedAgents((prevSelected) =>
            prevSelected.includes(agentId)
                ? prevSelected.filter((id) => id !== agentId)
                : [...prevSelected, agentId] // Select
        );
        console.log(selectedAgent);
    };
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
            dataIndex: "csr.profilePicture",
            key: "profilePicture",
          
            render: (_, record) => (
                <div
                    style={{
                        position: "relative",
                        display: "inline-block",
                        cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(record.csr)}
                >
                    <Avatar
                        src={record.csr.profilePicture}
                        size={40}
                        style={{
                            borderRadius: "50%",
                            border: "2px solid #ffffff",
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                </div>
            ),
            align: "center",
        },
        {
            title: "Name",
            dataIndex: "csr.firstName",
            key: "firstName",
              align:"center",
            render: (text, record) => `${record.csr.firstName} ${record.csr.lastName}`,
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
            }),

        },
        {
            title: "Phone",
            dataIndex: "csr.phoneNumber",
            key: "phoneNumber",
            align: "center", // Ensures column header is centered
            render: (phoneNumber, record) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Centers the content horizontally
                  alignItems: "center", // Centers the content vertically
                  textAlign: "center", // Ensures the text is centered
                }}
              >
                <a
                  href={`https://wa.me/${record.csr.phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: "8px" }}
                >
                  <FaWhatsapp style={{ color: "black" }} />
                </a>
                <span>{formatPhoneNumber(record.csr.phoneNumber)}</span>
              </div>
            ),
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center", // Ensures header text is centered
              },
            }),
          },
          {
            title: "Email",
            dataIndex: "csr.email",
            key: "email",
            align: "center", // Ensures column header is centered
            render: (email, record) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Centers the content horizontally
                  alignItems: "center", // Centers the content vertically
                  textAlign: "center", // Ensures the text is centered
                }}
              >
                <a
                  href={`mailto:${record.csr.email}`}
                  style={{
                    textDecoration: "none",
                    color: "blue",
                    marginRight: "8px",
                  }}
                  onClick={(e) => {
                    console.log(`Email clicked: ${record.csr.email}`);
                  }}
                >
                  <MailOutlined style={{ color: "black" }} />
                </a>
                {record.csr.email}
              </div>
            ),
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center", // Ensures header text is centered
              },
            }),
          },          

        {
            title: "Location",
            dataIndex: "csr.country",
            key: "country",
              align:"center",
            render: (country, record) => record.csr.district,
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
            }),

        },
        {
            title: "Agent Details",
            key: "agentDetails",
            align: "center", // Centers the column header
            render: (_, record) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center", // Centers the content horizontally
                  alignItems: "center", // Centers the content vertically
                }}
              >
                <Button
                  size="small"
                  style={{
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: "#0D416B",
                  }}
                  onClick={() => fetchAssignedAgents(record.csr._id, record.csr.firstName, record.csr.lastName)}
                >
                  View
                </Button>
              </div>
            ),
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center", // Ensures header text is centered
              },
            }),
          },          
    ];

    const filteredAgents = csr.filter((agent) => {
        const nameSearch = nameSearchQuery ? nameSearchQuery.toLowerCase() : "";


        const fullName = `${agent.csr.firstName} ${agent.csr.lastName}`.toLowerCase();

        const nameMatch =
            fullName.includes(nameSearch) ||
            agent.csr.firstName.toLowerCase().includes(nameSearch) ||
            agent.csr.lastName.toLowerCase().includes(nameSearch);


        const locationSearch = locationSearchQuery.toLowerCase();
        const locationMatch =
            (agent.csr.district && agent.csr.district.toLowerCase().includes(locationSearch)) ||
            (agent.csr.mandal && agent.csr.mandal.toLowerCase().includes(locationSearch)) ||
            (agent.csr.village && agent.csr.village.toLowerCase().includes(locationSearch));

        return nameMatch && locationMatch;
    });

    if (loading) {
        return <Spin size="large" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
        }} />;
    }
    return (
        <div>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                }}
            >
                <Row gutter={[16, 16]}>
                    <Col>
                        <Select
                            showSearch
                            placeholder="Search by Customer Name"
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}

                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            value={nameSearchQuery || undefined} // Ensure undefined for placeholder to show
                            onChange={(value) => {
                                if (value != null) {
                                    setNameSearchQuery(value)
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
                    </Col>
                    <Col>
                        <Input
                            placeholder="Search by Location"
                            value={locationSearchQuery}
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}

                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            allowClear
                        />
                    </Col>
                </Row>
            </Card>
            <Table
                dataSource={filteredAgents}
                columns={columns}
                rowKey={(record) => record.csr._id}
                pagination={{ pageSize: 5 }}
                style={{ marginTop: "3%" }}
                locale={{
                    emptyText: 'No Csr found',
                }}
            />

            <Modal
                title={<div style={{ textAlign: "center" }}>Assign An Agent</div>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={1000}
                style={{
                    marginLeft: "17%",

                }}
            >
                <div>
                    <Input
                        placeholder="Search by Agent Name"
                        value={nameSearchQuery2}
                        onChange={(e) => setNameSearchQuery2(e.target.value)}
                        style={{ width: 200, border: "1px solid #666", marginRight: "2%", marginBottom: "2%" }}
                    />
                    <Row gutter={16}>
                        {filteredAgents2.map((agent) => (
                            <Col span={6} key={agent._id}>
                                <Card
                                    hoverable
                                    style={{
                                        position: "relative",
                                        border: selectedAgents.includes(agent._id)
                                            ? "2px solid #0d416b"
                                            : "1px solid #d9d9d9",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                        textAlign: "center",
                                        paddingTop: "50px",
                                    }}
                                >

                                    <Checkbox
                                        checked={selectedAgents.includes(agent._id)}
                                        onChange={() => handleAgentSelect(agent._id)}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                        }}
                                    />

                                    {/* Avatar */}
                                    <Avatar
                                        src={agent.profilePicture || "/default-avatar.png"}
                                        size={100}
                                        style={{
                                            position: "absolute",
                                            top: "0px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            borderRadius: "50%",
                                            border: "3px solid #ffffff",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />


                                    <h4 style={{ marginTop: "35px" }}>
                                        {`${agent.firstName} ${agent.lastName}`}
                                    </h4>
                                    <p>
                                        <FontAwesomeIcon icon={faWhatsapp} /> {formatPhoneNumber(agent.phoneNumber)}
                                    </p>
                                    <p>
                                        <MailOutlined /> {agent.email}
                                    </p>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                        }}
                    >
                        <Button style={{
                            backgroundColor: "#0D416B",
                            color: "white",
                        }} onClick={handleConfirmAssignment}>
                            Add
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                title={<div style={{ textAlign: "center" }}>Assigned Agents</div>}
                open={isViewModalOpen}
                onCancel={handleViewModalCancel}
                footer={null}
                width={1000}
                style={{
                    marginLeft: "17%",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <Input
                        placeholder="Search by Agent Name"
                        value={nameSearchQuery1}
                        onChange={(e) => setNameSearchQuery1(e.target.value ? e.target.value : null)}
                        style={{ width: 200, border: "1px solid #666", marginRight: "2%" }}
                        allowClear
                    />
                    <Button
                        style={{
                            backgroundColor: "#0D416B",
                            color: "white",
                        }}
                        onClick={() => {
                            fetchAllAgents(csrId);
                        }}
                    >
                        Assign an agent
                    </Button>

                </div>

                <Row gutter={16}>
                    {filteredAgents1.length > 0 ? (
                        filteredAgents1.map((agent) => (
                            <Col span={6} key={agent._id} style={{ marginTop: "2%" }}>
                                <Card
                                    hoverable
                                    style={{
                                        position: "relative",
                                        border: selectedAgents.includes(agent._id)
                                            ? "2px solid #0d416b"
                                            : "1px solid #d9d9d9",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                        textAlign: "center",
                                        paddingTop: "50px",
                                    }}
                                >
                                    <span onClick={() => { deleteAgent(agent._id) }} style={{ float: "right", color: "red", marginTop: "-40%" }}><DeleteOutlined /></span>
                                    <Avatar
                                        src={agent.profilePicture || "/default-avatar.png"}
                                        size={100}
                                        style={{
                                            position: "absolute",
                                            top: "0px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            borderRadius: "50%",
                                            border: "3px solid #ffffff",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                    <p
                                        style={{
                                            marginTop: "17%",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <strong>
                                            {agent.firstName}{" "}
                                            {expandedAgentId === agent._id
                                                ? agent.lastName
                                                : `${agent.lastName.slice(0, 5)}`}
                                        </strong>
                                        {agent.lastName.length > 5 && expandedAgentId !== agent._id && (
                                            <span
                                                style={{ color: "#0d416b", cursor: "pointer" }}
                                                onClick={() => handleExpandClick(agent._id)}
                                            >
                                                {" "}
                                                ...
                                            </span>
                                        )}
                                    </p>

                                    {/* Phone number */}
                                    <p
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <strong>
                                            <FaWhatsapp />
                                        </strong>{" "}
                                        {formatPhoneNumber(agent.phoneNumber)}

                                    </p>

                                    {/* Email - Truncate if necessary */}
                                    <p
                                        style={{
                                            whiteSpace: "nowrap",
                                            // overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <strong>
                                            <MailOutlined />
                                        </strong>{" "}
                                        {agent.email.length > 15 && expandedAgentId !== agent._id
                                            ? `${agent.email.slice(0, 15)}`
                                            : agent.email}
                                        {agent.email.length > 15 && expandedAgentId !== agent._id && (
                                            <span
                                                style={{ color: "#0d416b", cursor: "pointer" }}
                                                onClick={() => handleExpandClick(agent._id)}
                                            >
                                                {" "}
                                                ...
                                            </span>
                                        )}
                                    </p>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <h2 style={{ marginLeft: "40%" }}>No agents assigned.</h2>
                    )}
                </Row>
            </Modal>
            <Modal
                title={<div style={{ textAlign: "center" }}>Are You Sure that you want to delete this Associated Agent with {csrName}</div>}
                open={isDeleteModalOpen}
                onCancel={handleDeleteModalCancel}
                footer={null}
                width={1000}
                style={{
                    marginLeft: "17%",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={deleteAssignedAgent}>Yes</Button>
                    <Button type="primary">No</Button>
                </div>
            </Modal>
            {isImageModalOpen && (
                <Modal
                    open={isImageModalOpen}
                    footer={null}
                    onCancel={handleImageModalClose}
                    width={400}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>

                        <img
                            src={imageToView.profilePicture}
                            alt="Profile"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #1890ff',

                            }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <strong>
                                <h3 style={{ textAlign: 'center', color: '#333', marginTop: "1%" }}>{imageToView.firstName} {imageToView.lastName}</h3>
                            </strong>
                            <p style={{ margin: '4px 0 0 20px', color: '#555' }}>
                                <strong>State: </strong> {imageToView.state}
                            </p>
                            <p style={{ margin: '4px 0 0 20px', color: '#555' }}>
                                <strong>Country: </strong> {imageToView.country}
                            </p>
                            <p style={{ margin: '4px 0 0 20px', color: '#555' }}>
                                <strong>District: </strong> {imageToView.district}
                            </p>
                            <p style={{ margin: '4px 0 0 20px', color: '#555' }}>
                                <strong>Mandal: </strong> {imageToView.mandal}
                            </p>
                            <p style={{ margin: '4px 0 0 20px', color: '#555' }}>
                                <strong>City: </strong> {imageToView.city}
                            </p>

                            {imageToView.identityProof && imageToView.identityProof.length > 0 && (
                                <div style={{ marginTop: '16px', width: '100%' }}>
                                    <h3 style={{ textAlign: 'center', color: '#333' }}>Identity Proof</h3>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                            gap: '8px',
                                            justifyItems: 'center',
                                        }}
                                    >
                                        {imageToView.identityProof.slice(0, 4).map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`Identity Proof ${index + 1}`}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    border: '2px solid #1890ff',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    );
}

export default GetCSR;

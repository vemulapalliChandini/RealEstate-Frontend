import React, { useEffect, useState } from "react";
import {
    Input,
    Table,
    Card,
    Typography,
    Button,
    Pagination,
    message,
    Popover,
    Row,Col
} from "antd";
import { DeleteOutlined, EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import { _get, _delete } from "../../Service/apiClient";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const { Text } = Typography;

const CSRList = () => {
    const [csrAgents, setCsrAgents] = useState([]);
    const [filteredCsrAgents, setFilteredCsrAgents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCsrAgents();
    }, []);

    const fetchCsrAgents = async () => {
        try {
            const response = await _get("admin/csrOrMarketingAgents/5");
            setCsrAgents(response.data);
            setFilteredCsrAgents(response.data);
        } catch (error) {
            console.error("Error fetching CSR agents:", error);
        }
    };

    const handleSearch = () => {
        const filtered = csrAgents.filter((agent) => {
            const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase();
            const location = `${agent.city} ${agent.state} ${agent.country}`.toLowerCase();

            return (
                fullName.includes(searchName.toLowerCase()) &&
                location.includes(searchLocation.toLowerCase())
            );
        });
        setFilteredCsrAgents(filtered);
        setCurrentPage(1);
    };

    const handleNameSearch = (e) => {
        setSearchName(e.target.value);
        handleSearch();
    };

    const handleLocationSearch = (e) => {
        setSearchLocation(e.target.value);
        handleSearch();
    };

    const handleRemoveButtonClick = async (agentId) => {
        try {
            await _delete(
                `admin/removeAgent/${agentId}`,
                "CSR removed successfully",
                "Failed to remove CSR"
            );
            fetchCsrAgents();
        } catch (error) {
            console.error("Error removing CSR:", error);
            message.error("Failed to remove CSR");
        }
    };

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
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
            dataIndex: "profilePicture",
            key: "profilePicture",
            align:"center",
            render: (text) => (
                <img
                    src={text}
                    alt="Profile"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                    }}
                />
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
            title: "Name",
            dataIndex: "firstName",
            key: "name",
            align:"center",
            render: (_, record) => `${record.firstName} ${record.lastName}`,
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
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phone",
            align:"center",
            render: (text) => (
                <span>
                    <FaWhatsapp /> {formatPhoneNumber(text)}
                </span>
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
            dataIndex: "email",
            key: "email",
            align:"center",
            render: (text) => (
                <span>
                    <MailOutlined /> {text}
                </span>
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
            dataIndex: "city",
            key: "location",
            align:"center",
            render: (_, record) => (
                <span>
                    <EnvironmentOutlined /> {`${record.city}, ${record.state}, ${record.country}`}
                </span>
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
            title: "Actions",
            key: "actions",
            align:"center",
            render: (_, record) => (
                <Popover
                    content={
                        <div style={{ textAlign: "center" }}>
                            <p>Are you sure you want to delete this agent?</p>
                            <Button
                                type="primary"
                                danger
                                onClick={() => handleRemoveButtonClick(record._id)}
                            >
                                Yes
                            </Button>
                            <Button type="default">No</Button>
                        </div>
                    }
                    trigger="click"
                >
                   <DeleteOutlined
                            style={{
                             
                              fontSize: "20px",
                              color: "#ff4d4f",
                              cursor: "pointer",
                              backgroundColor: "white",
                              borderRadius: "50%",
                              padding: "5px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                </Popover>
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

    return (
        <div>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    marginBottom: "2%",
                }}
            >
               <Row gutter={[16,16]}>
              
                    <Col span={5}>
                    <Input
                        placeholder="Search by Name"
                        value={searchName}
                        onChange={handleNameSearch}
                    />
                    </Col>
                    <Col span={5}>
                    <Input
                        placeholder="Search by Location"
                        value={searchLocation}
                        onChange={handleLocationSearch}
                    />
                     </Col>
               </Row>
            </Card>

            <Table
                dataSource={filteredCsrAgents}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: 8,
                    total: filteredCsrAgents.length,
                    onChange: handlePaginationChange,
                }}
                rowKey="_id"
            />
        </div>
    );
};

export default CSRList;

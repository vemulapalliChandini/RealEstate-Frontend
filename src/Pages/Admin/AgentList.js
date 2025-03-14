import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Popover,
  Card,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";
import { _get, _delete } from "../../Service/apiClient";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await _get("admin/getAllAgents");
      setAgents(response.data);
      setFilteredAgents(response.data);
      setTotalAgents(response.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    const filtered = agents.filter((agent) => {
      const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase();
      const location = `${agent.city} ${agent.state} ${agent.country}`.toLowerCase();

      return (
        fullName.includes(searchName.toLowerCase()) &&
        location.includes(searchLocation.toLowerCase())
      );
    });
    setFilteredAgents(filtered);
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

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handleRemoveButtonClick = async (agentId) => {
    try {
      await _delete(
        `admin/removeAgent/${agentId}`,
        "Agent removed successfully",
        "Failed to remove agent"
      );

      fetchAgents();
    } catch (error) {
      console.error("Error removing agent:", error);
      message.error("Failed to remove agent");
    }
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };


  const columns = [
     {
      title: "Profile",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (profilePicture) => (
        <img
          src={profilePicture || "default-profile.png"}
          alt="Profile"
          style={{
            width: "40px",
            height: "40px",
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
      dataIndex: "name",
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
      })
    
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align:"center",
     
     
      render: (phoneNumber) => (
        <div>
          <FaWhatsapp style={{  marginRight: 8 }} />
          {formatPhoneNumber(phoneNumber)}
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
      dataIndex: "email",
      key: "email",
      align:"center",
      render: (email) => (
        <div>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
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
      dataIndex: "location",
      key: "location",
      align:"center",
      render: (_, record) => (
        <div>
          <EnvironmentOutlined style={{  marginRight: 8 }} />
          {`${record.city}, ${record.state}, ${record.country}`}
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
      title: "Action",
      key: "action",
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
                style={{ marginRight: "8px" }}
              >
                Yes
              </Button>
              <Button type="default">No</Button>
            </div>
          }
          trigger="click"
          placement="topRight"
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
        <Row gutter={[16, 16]}>
         
          <Col span={5}>
            <Input
              placeholder="Search by Agent Name"
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
        columns={columns}
        dataSource={filteredAgents.map((agent) => ({
          ...agent,
          key: agent._id,
        }))}
        pagination={{
          current: currentPage,
          pageSize: 8,
          total: totalAgents,
          onChange: handlePaginationChange,
        }}
        style={{
          marginTop: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default AgentList;

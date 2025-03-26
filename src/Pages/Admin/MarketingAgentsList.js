import React, { useEffect, useState,useCallback } from "react";
import {
  Input,
  Table,
  Avatar,
  Typography,
  Button,
  message,
  Popover,
  Space,
  Pagination,
  Card,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EnvironmentOutlined,
  MailOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";
import { _get, _delete } from "../../Service/apiClient";
const { Text } = Typography;

const MarketingAgentsList = ({ role, title }) => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const fetchAgents = useCallback(async () => {
    try {
      const response = await _get(`admin/csrOrMarketingAgents/6`);
      setAgents(response.data);
      setFilteredAgents(response.data);
    } catch (error) {
      console.error(`Error fetching ${title} agents:`, error);
    }
  }, [title]);
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

 
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

  const handleRemoveButtonClick = async (agentId) => {
    try {
      await _delete(
        `admin/removeAgent/${agentId}`,
        `Marketing Agent removed successfully`,
        `Failed to remove Marketing Agent`
      );

      fetchAgents();
    } catch (error) {
      console.error(`Error removing ${title}:`, error);
      message.error(`Failed to remove ${title}`);
    }
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
      align: "center",
      render: (text, record) => (
        <Avatar src={record.profilePicture} size={50} />
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
      align: "center",
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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",

      align: "center",
      render: (text) => (
        <Text>
          <FaWhatsapp /> {formatPhoneNumber(text)}
        </Text>
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
      align: "center",
      render: (text) => (
        <Text>
          <MailOutlined /> {text}
        </Text>
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
      align: "center",
      render: (_, record) => (
        <Text>
          <EnvironmentOutlined /> {record.city}, {record.state}, {record.country}
        </Text>
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
      align: "center",
      render: (_, record) => (
        <Popover
          content={
            <Space>
              <Button
                type="primary"
                danger
                onClick={() => handleRemoveButtonClick(record._id)}
              >
                Yes
              </Button>
              <Button>No</Button>
            </Space>
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
        <Row gutter={[16, 16]}>
         
          <Col span={5}>
            <Input
              placeholder="Search by Name"
              value={searchName}
              onChange={handleNameSearch}
              style={{ width: "200px", marginRight: "16px" }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={5}>
            <Input
              placeholder="Search by Location"
              value={searchLocation}
              onChange={handleLocationSearch}
              style={{ width: "200px" }}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredAgents.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
        rowKey="_id"
      />
      <Pagination
        current={currentPage}
        total={filteredAgents.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "16px", textAlign: "center" }}
      />
    </div>
  );
};

export default MarketingAgentsList;

import React, { useState, useEffect } from "react";
import {
  Input,
  Avatar,
  Table,
  Typography,
  Button,
  Empty,
  Popover,
  Spin,
  message,
  Card,
  Row,Col
} from "antd";
import { DeleteOutlined, EnvironmentOutlined, MailOutlined, SearchOutlined } from "@ant-design/icons";
import { _get, _delete } from "../../Service/apiClient";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function Clients() {
  const [client, setClient] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(client); // Set filtered clients to the initial client list
  }, [client]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await _get("emClient/getAllEmClients");
      setClient(response.data);
      setLoading(false);
      console.log("api hits ->", response);
    } catch (error) {
      setLoading(false);
      console.error("error is ", error);
    }
  };

  const filterClients = () => {
    const filtered = client.filter((client) => {
      const matchesName = `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesLocation =
        `${client.city}, ${client.state}, ${client.country}`
          .toLowerCase()
          .includes(searchLocation.toLowerCase());
      return matchesName && matchesLocation;
    });
    setFilteredClients(filtered);
  };

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
    filterClients();
  };

  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
    filterClients();
  };

  const handleRemoveButtonClick = async (agentId) => {
    try {
      await _delete(
        `emClient/removeEmClients/${agentId}`,
        "Client removed successfully",
        "Failed to remove agent"
      );
      fetchClients();
    } catch (error) {
      console.error("Error removing agent:", error);
      message.error("Failed to remove agent");
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
      align: "center",
      render: (text, record) => (
        <Avatar
          src={record.profilePicture}
          size={50}
          style={{ borderRadius: "50%" }}
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
      align: "center",
      render: (text, record) => `${record.firstName} ${record.lastName}`,
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
      dataIndex: "phone",
      align: "center",
      render: (text, record) => (
        <>
          <FaWhatsapp /> {formatPhoneNumber(record.phoneNumber)}
        </>
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
      align: "center",
      render: (text, record) => (<>
        <MailOutlined /> {record.email}
      </>),
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
      align: "center",
      render: (text, record) => `${record.city}, ${record.state}, ${record.country}`,
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
      align: "center",
      render: (text, record) => (
        <Popover
          content={
            <div style={{ textAlign: "center" }}>
              <p>Are you sure you want to delete this property?</p>
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
              fontSize: "18px",
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

  if (loading) {
    return <Spin size="large" style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }} />;
  }

  return (
    <>
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
                onChange={handleNameChange}
                style={{ width: "100%", marginBottom: "16px" }}
                prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
              />
            </Col>
            <Col span={5}>
              <Input
                placeholder="Search by Location"
                value={searchLocation}
                onChange={handleLocationChange}
                style={{ width: "100%", marginBottom: "16px" }}
                prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
              />
            </Col>
          </Row>
        </Card>
      

        {filteredClients.length > 0 ? (
          <Table
            dataSource={filteredClients}
            columns={columns}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              total: filteredClients.length,
            }}
          />
        ) : (
          <Empty description="No agents found, please adjust your search criteria" />
        )}
      </div>
    </>
  );
}

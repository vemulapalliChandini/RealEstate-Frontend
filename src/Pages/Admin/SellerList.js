import React, { useEffect, useState } from "react";
import {
  Input,
  Table,
  Button,
  message,
  Popover,
  Spin,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  EnvironmentOutlined,
  MailOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { _get, _delete } from "../../Service/apiClient";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function SellerList() {
  const [seller, setSeller] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    setFilteredSellers(seller);
  }, [seller]);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await _get("seller/getAllSellers");
      setSeller(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data", error);
    }
  };

  const filterSellers = () => {
    const filtered = seller.filter((seller) => {
      const matchesName = `${seller.firstName} ${seller.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesLocation =
        `${seller.city}, ${seller.state}, ${seller.country}`
          .toLowerCase()
          .includes(searchLocation.toLowerCase());
      return matchesName && matchesLocation;
    });
    setFilteredSellers(filtered);
  };

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
    filterSellers();
  };

  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
    filterSellers();
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
        `seller/removerSeller/${agentId}`,
        "Seller removed successfully",
        "Failed to remove seller"
      );
      fetchSellers();
    } catch (error) {
      console.error("Error removing seller:", error);
      message.error("Failed to remove seller");
    }
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
      }),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align:"center",
      render: (text) => <span><FaWhatsapp />{formatPhoneNumber(text)}</span>,
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
      dataIndex: "location",
      key: "location",
      align:"center",
      render: (_, record) => (
        <span>
          <EnvironmentOutlined /> {record.city}, {record.state}, {record.country}
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
      title: "Action",
      key: "action",
      align:"center",
      render: (_, record) => (
        <Popover
          content={
            <div style={{ textAlign: "center" }}>
              <p>Are you sure you want to delete this seller?</p>
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

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

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
          onChange={handleNameChange}
          style={{  marginRight: "10px" }}
          prefix={<SearchOutlined />}
        />
                    </Col>
                    <Col span={5}>
                    <Input
          placeholder="Search by Location"
          value={searchLocation}
          onChange={handleLocationChange}
        
          prefix={<SearchOutlined />}
        />
                     </Col>
               </Row>
            </Card>
     

      <Table
        dataSource={filteredSellers}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredSellers.length,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey="_id"
      />
    </div>
  );
}

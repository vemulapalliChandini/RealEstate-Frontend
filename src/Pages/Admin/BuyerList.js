import React, { useEffect, useState } from "react";
import {
  Input,
  Table,
  Button,
  Spin,
  message,
  Popover,
  Card,
  Row,
  Col
} from "antd";
import { DeleteOutlined, MailOutlined } from "@ant-design/icons";
import { _get, _delete } from "../../Service/apiClient";
import {  FaWhatsapp } from "react-icons/fa";

export default function BuyerList() {
  const [buyer, setBuyer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredBuyers, setFilteredBuyers] = useState([]);

  useEffect(() => {
    fetchbuyers();
  }, []);

  useEffect(() => {
    setFilteredBuyers(buyer);
  }, [buyer]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const fetchbuyers = async () => {
    setLoading(true);
    try {
      const response = await _get("buyer/getAllBuyers");
      console.log(response.data);
      setBuyer(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error Fetching data", error);
    }
  };

  const filterBuyers = () => {
    const filtered = buyer.filter((b) => {
      const matchesName = `${b.firstName} ${b.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesLocation = `${b.city}, ${b.state}, ${b.country}`
        .toLowerCase()
        .includes(searchLocation.toLowerCase());
      return matchesName && matchesLocation;
    });
    setFilteredBuyers(filtered);
  };

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
    filterBuyers();
  };

  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
    filterBuyers();
  };

  const handleRemoveButtonClick = async (agentId) => {
    try {
      await _delete(
        `buyer/removeBuyers/${agentId}`,
        "Buyer removed successfully",
        "Failed to remove buyer"
      );
      fetchbuyers();
    } catch (error) {
      console.error("Error removing buyer:", error);
      message.error("Failed to remove buyer");
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
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center", // Ensures header text is centered
        },
      }),
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FaWhatsapp style={{ marginRight: 8 }} />
          <span>{formatPhoneNumber(text)}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center", // Ensures header text is centered
        },
      }),
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MailOutlined style={{ marginRight: 8 }} />
          <span>{text}</span>
        </div>
      ),
    },
    
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align:"center",
      render: (_, record) =>
        `${record.city}, ${record.state}, ${record.country}`,
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
            <p>Are you sure you want to delete this property?</p>
            <Button
              type="primary"
              danger
              onClick={() => handleRemoveButtonClick(record._id)}
              style={{ marginRight: "8px" }}
            >
              Yes
            </Button>
            <Button type="default">No</Button> {/* No button to close the popover */}
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
    return <Spin size="large" />;
  }

  const tableData = filteredBuyers.map((b, index) => ({
    key: index,
    ...b,
  }));

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
          onChange={handleNameChange}
          style={{  marginRight: "8px" }}
        />
        </Col>
        <Col span={5}>
        <Input
          placeholder="Search by Location"
          value={searchLocation}
          onChange={handleLocationChange}
          style={{ width: "200px" }}
        />
         </Col>
      </Row>
      </Card>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredBuyers.length,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  );
}

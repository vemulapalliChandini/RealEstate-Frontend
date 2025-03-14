import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Typography, Modal, Empty, Row,Card,Col,Input} from "antd";
import { _get } from "../../Service/apiClient";
import {  FaWhatsapp } from "react-icons/fa";

import { EnvironmentOutlined, MailOutlined } from "@ant-design/icons";

export default function AgentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);


 const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredAgents,setFilteredAgents]=useState(null);
 const [expandedComment, setExpandedComment] = useState(null); // To track which comment is expanded
 const role=1;
    const handleToggle = (id) => {
        console.log(id);
        setExpandedComment(expandedComment === id ? null : id);
        console.log(expandedComment);
    };
  useEffect(() => {
    const fetchBuyerComplaints = async () => {
      setLoading(true);
      try {
        const response = await _get(`complaint/getCompliants/${role}`);
        setComplaints(response.data);
        setFilteredAgents(response.data);
        console.log("The complaints are --> ", response.data);
      } catch (error) {
        console.error("The error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyerComplaints();
  }, [role]);
  
  const handleSearch = () => {
    const filtered = complaints.filter((agent) => {
      const fullName = `${agent.name} `.toLowerCase();
      const location = `${agent.district}`.toLowerCase();

      return (
        fullName.includes(searchName.toLowerCase()) &&
        location.includes(searchLocation.toLowerCase())
      );
    });
    setFilteredAgents(filtered);
  };

  
  const handleNameSearch = (e) => {
    setSearchName(e.target.value);
    handleSearch();
  };

  const handleLocationSearch = (e) => {
    setSearchLocation(e.target.value);
    handleSearch();
  };
  const fetchIssues = async (userId) => {
    try {
      const response = await _get(`complaint/getUserCompliants/${userId}`); // Replace with the correct endpoint
      setSelectedComplaint(response.data);
      console.log("API response is --> ", response.data);
    } catch (error) {
      console.error("The error", error);
    }
  };
  const IssueColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
     
      render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A", // Capitalize the first letter of the category
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          width: "5%",
     
        },
      }),
    },
    {
      title: "Issue",
      dataIndex: "message",
      key: "message",
     
      render: (text, record) => {
        return (
          <div>
            {expandedComment === record.issueId
              ? record.message
              : record.message.slice(0, 100) + (record.message.length > 100 ? "..." : "")}
            
            {record.message.length > 100 && (
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => handleToggle(record.issueId)} // Toggle expanded comment based on issueId
              >
                &nbsp;[{expandedComment === record.issueId ? "Show Less" : "Show More"}]
              </span>
            )}
          </div>
        );

      },
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          width: "30%",

        },
      }),
    },
  ];
  

  const showModal = (record) => {
    fetchIssues(record.userId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      dataIndex: "profile",
      key: "profile",
      render: (profile) => (
        <img
          src={profile || "default-profile.png"}
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
      align: "center",
      render: (text) => <Typography.Text>{text || "N/A"}</Typography.Text>,
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
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      align: "center",
      render: (contact) => (
        <Typography.Text>
          <FaWhatsapp style={{ marginRight: "5px" }} />
          {formatPhoneNumber(contact) || "N/A"}
        </Typography.Text>
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
      render: (email) => (
        <Typography.Text>
          <MailOutlined style={{ marginRight: "5px" }} />
          {email || "N/A"}
        </Typography.Text>
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
      dataIndex: "district",
      key: "district",
      align: "center",
      render: (district) => (
        <Typography.Text>
          <EnvironmentOutlined style={{ marginRight: "5px" }} />
          {district || "Andhra Pradesh"}
        </Typography.Text>
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
      align: "center",
      render: (record) => (
        <Button type="link" onClick={() => showModal(record)}>
          View More
        </Button>
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
    <div style={{ padding: "20px" }}>
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

      {complaints.length === 0 ? (
        <Empty description="No Complaints Found" />
      ) : (
        <Table
          dataSource={filteredAgents}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
       
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{marginRight:"10%"}}
      >

        <Row gutter={[16, 16]}>
          <Table
            columns={IssueColumns}
            dataSource={selectedComplaint}
            pagination={true}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                  No Issues Found
                </div>
              ),
            }}
            style={{ width: '100%' }}
          />
        </Row>
      </Modal>
    </div>
  );
}
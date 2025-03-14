import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { _get } from "../../Service/apiClient";
import {Card, Typography, Avatar, Button, Modal } from "antd";

export default function SellerEachIssues() {
  const { userId } = useParams();
  const [issue, setIssue] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await _get(`complaint/getUserCompliants/${userId}`); // Replace with the correct endpoint
        setIssue(response.data);
        console.log("API response is --> ", response.data);
      } catch (error) {
        console.error("The error", error);
      }
    };

    fetchIssues();
  }, [userId]);

  const showModal = (issueData) => {
    setSelectedIssue(issueData); // Set the selected issue data
    setIsModalVisible(true); // Open the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Issues from Buyer
      </h1>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {issue.length !== 0 ? (
          issue.map((item) => (
            <Card
              key={item._id}
              hoverable
              onClick={() => showModal(item)} // Trigger modal on card click
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "500px", // Card width for horizontal layout
                backgroundColor: "#f9f9f9",
                border: "1px solid #ccc",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "15px",
              }}
            >
              <Avatar
                size={64}
                src={item.profileImage}
                alt={item.name}
                style={{ marginRight: "15px" }}
              />
              <div>
                <Typography.Title level={5} style={{ marginBottom: "10px" }}>
                  {item.name || "Unknown User"}
                </Typography.Title>
                <Typography.Text
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  <strong>Issue ID: </strong> {item.issueId || "No ID"}
                </Typography.Text>
                <Typography.Text
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  <strong>Category: </strong>{" "}
                  {item.category || "No category provided"}
                </Typography.Text>
                <Typography.Text
                  style={{ display: "block", marginBottom: "5px" }}
                >
                  <strong>Status: </strong>{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    Active
                  </span>
                </Typography.Text>
                <Button
                  type="primary"
                  style={{ marginTop: "10px", backgroundColor: "green" }}
                >
                  View
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Typography.Text style={{ textAlign: "center", display: "block" }}>
            No issues found.
          </Typography.Text>
        )}
      </div>

      {/* Modal to display issue details */}
      <Modal
        title="Issue Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // You can customize the footer if needed
      >
        {selectedIssue && (
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={64}
              src={selectedIssue.profileImage}
              alt={selectedIssue.name}
            />
            <Typography.Title level={4} style={{ marginTop: "10px" }}>
              {selectedIssue.name || "Unknown User"}
            </Typography.Title>
            <Typography.Text style={{ display: "block", marginTop: "10px" }}>
              <strong>Category: </strong>{" "}
              {selectedIssue.category || "No category provided"}
            </Typography.Text>
            <Typography.Text style={{ display: "block", marginTop: "10px" }}>
              <strong>Issue: </strong>{" "}
              {selectedIssue.message || "No issue details provided"}
            </Typography.Text>
          </div>
        )}
      </Modal>
    </>
  );
}




import React, { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import { _get } from "../../Service/apiClient";

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(`/api/analytics`);
        setAnalyticsData(response.data); // Storing data for all events
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message || "An error occurred while fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <Spin size="large" style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }} />;
  }
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  // Define the columns for the Ant Design table
  const columns = [
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text) => <span>{text || "N/A"}</span>,
      align: "center",
    },
    {
      title: "Page Path",
      dataIndex: "pagePath",
      key: "pagePath",
      render: (text) => <span>{text || "N/A"}</span>,
      align: "center",
    },
    {
      title: "Active Users",
      dataIndex: "activeUsers",
      key: "activeUsers",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
      align: "center",
    },
    {
      title: "Pageviews",
      dataIndex: "screenPageViews",
      key: "screenPageViews",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
      align: "center",
    },
    {
      title: "Event Count",
      dataIndex: "eventCount", // The data key to map from the API response
      key: "eventCount",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
      align: "center",
    },
    {
      title: "Event Count per User",
      dataIndex: "eventCountPerUser",
      key: "eventCountPerUser",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Analytics Dashboard</h1>

      {/* Render separate tables for each event */}
      {Object.keys(analyticsData).map((eventName) => (
        <div key={eventName} style={{ marginBottom: "40px" }}>
          <h2>{eventName} Data</h2>
          <Table
            columns={columns}
            dataSource={analyticsData[eventName]}
            pagination={{
              position: ["bottomCenter"],
              pageSize: 8,
            }}
            bordered
            rowKey="key"
            size="middle"
          />
        </div>
      ))}
    </div>
  );
};

export default AnalyticsDashboard;






















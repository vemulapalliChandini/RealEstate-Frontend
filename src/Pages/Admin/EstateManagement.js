import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Tag, Divider, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DollarCircleOutlined,

  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock Data
const agentData = [
  { name: "Agent 1", propertiesManaged: 12, performance: "Good" },
  { name: "Agent 2", propertiesManaged: 8, performance: "Average" },
  { name: "Agent 3", propertiesManaged: 15, performance: "Excellent" },
];

const propertyData = [
  { propertyName: "Estate House A", status: "Under Maintenance", profit: 5000 },
  { propertyName: "Estate House B", status: "Available", profit: 7000 },
  { propertyName: "Estate House C", status: "Rented", profit: 3000 },
];

const maintenanceData = [
  { task: "Roof Repair", property: "Estate House A", status: "In Progress" },
  { task: "Plumbing", property: "Estate House B", status: "Completed" },
  { task: "Electrical Work", property: "Estate House C", status: "Pending" },
];

const profitData = [
  { name: "Residential", profit: 15000 },
  { name: "Commercial", profit: 12000 },
  { name: "Agricultural", profit: 8000 },
];



const EstateManagement = () => {
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    // Calculate total profit from all properties
    const profit = propertyData.reduce((acc, curr) => acc + curr.profit, 0);
    setTotalProfit(profit);
  }, []);

  const navigate = useNavigate();

  // Columns for tables
  const agentColumns = [
    {
      title: "Agent Name",
      dataIndex: "name",
      key: "name",
      align:"center",
    },
    {
      title: "Properties Managed",
      dataIndex: "propertiesManaged",
      key: "propertiesManaged",
      align:"center",
    },
    {
      title: "Performance",
      dataIndex: "performance",
      key: "performance",
      render: (text) => (
        <Tag
          color={
            text === "Excellent" ? "green" : text === "Good" ? "blue" : "orange"
          }
        >
          {text}
        </Tag>
      ),
      align:"center",
    },
  ];

  const propertyColumns = [
    {
      title: "Property Name",
      dataIndex: "propertyName",
      key: "propertyName",
      align:"center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Available"
              ? "green"
              : status === "Under Maintenance"
              ? "orange"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
      align:"center",
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (profit) => <span>${profit}</span>,
      align:"center",
    },
  ];

  const maintenanceColumns = [
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      align:"center",
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      align:"center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
              : status === "In Progress"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
      align:"center",
    },
  ];

  // Occupancy rate data
  const occupancyRateData = [
    {
      name: "Available",
      value: propertyData.filter((p) => p.status === "Available").length,
    },
    {
      name: "Rented",
      value: propertyData.filter((p) => p.status === "Rented").length,
    },
    {
      name: "Under Maintenance",
      value: propertyData.filter((p) => p.status === "Under Maintenance")
        .length,
    },
  ];

  return (
    
    <div style={{ padding: "20px" }}>
      <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>
      <Row gutter={16}>
        {/* Total Profit Card */}
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Profit"
              value={totalProfit}
              precision={2}
              prefix={<DollarCircleOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>

        {/* Agents Overview */}
        <Col span={8}>
          <Card
            title="Agents Overview"
            extra={<Tooltip title="View All Agents">?</Tooltip>}
          >
            <Table
              columns={agentColumns}
              dataSource={agentData}
              pagination={false}
              rowKey="name"
              size="small"
            />
          </Card>
        </Col>

        {/* Property Status */}
        <Col span={8}>
          <Card
            title="Property Status"
            extra={<Tooltip title="View All Properties">?</Tooltip>}
          >
            <Table
              columns={propertyColumns}
              dataSource={propertyData}
              pagination={false}
              rowKey="propertyName"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Profit Distribution Bar Chart */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Profit Distribution" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="profit" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Occupancy Rate Bar Chart */}
        <Col span={12}>
          <Card title="Property Occupancy" style={{ height: "100%" }}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={occupancyRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Maintenance Tasks */}
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="Maintenance Tasks"
            extra={<Tooltip title="View All Tasks">?</Tooltip>}
          >
            <Table
              columns={maintenanceColumns}
              dataSource={maintenanceData}
              pagination={false}
              rowKey="task"
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Agent Performance Comparison */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Agent Performance Comparison">
            <Table
              columns={agentColumns}
              dataSource={agentData}
              pagination={false}
              rowKey="name"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EstateManagement;

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Divider } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LineChart, Line } from "recharts";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";



const AssistRevenue = () => {
  const [bankData, setBankData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [assistData, setAssistData] = useState([]);

  // Mock data to simulate API response
  const mockBankData = [
    { bankName: "Bank A", promotionCount: 50 },
    { bankName: "Bank B", promotionCount: 40 },
    { bankName: "Bank C", promotionCount: 30 },
    { bankName: "Bank D", promotionCount: 20 },
    { bankName: "Bank E", promotionCount: 30 },
    { bankName: "Bank F", promotionCount: 20 },
  ];

  const mockLoanData = [
    { bankName: "Bank A", users: 100 },
    { bankName: "Bank B", users: 80 },
    { bankName: "Bank C", users: 60 },
    { bankName: "Bank D", users: 40 },
    { bankName: "Bank E", users: 30 },
    { bankName: "Bank F", users: 20 },
  ];

  const mockAssistData = [
    { bankName: "Bank A", assistanceProvided: 120 },
    { bankName: "Bank B", assistanceProvided: 100 },
    { bankName: "Bank C", assistanceProvided: 80 },
    { bankName: "Bank D", assistanceProvided: 50 },
    { bankName: "Bank E", assistanceProvided: 30 },
    { bankName: "Bank F", assistanceProvided: 20 },
  ];

  useEffect(() => {
    // Simulating API calls for data fetching
    setBankData(mockBankData);
    setLoanData(mockLoanData);
    setAssistData(mockAssistData);
  }, []);

  const navigate = useNavigate();


  return (

    
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Assist Revenue
      </h1>

      {/* Display Bank Promotions */}
      <Row gutter={[8, 16]}>
        {bankData.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{
                // backgroundColor: "white",
                background:
                  "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                padding: "5px",
                width: "70%",
              }}
            >
              <h3>{item.bankName}</h3>
              <Statistic title="Promotions" value={item.promotionCount} />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Bar Chart for Bank Promotions */}
      <ResponsiveContainer width="50%" height={300}>
        <BarChart data={bankData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bankName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="promotionCount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <Divider />

      {/* Bar Chart for Loan Users */}

      <ResponsiveContainer
        width="50%"
        height={300}
        style={{ marginTop: "-28%", marginLeft: "50%" }}
      >
        <BarChart data={loanData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bankName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <Divider />

      {/* Line Chart for Assistance Provided */}
      <ResponsiveContainer width="50%" height={300}>
        <LineChart data={assistData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bankName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="assistanceProvided" stroke="#ff4d4f" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssistRevenue;


import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
    Table,
   Pagination,
 
  List,
  Input,
  Modal,
  Carousel,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  FieldNumberOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { Line } from "@ant-design/charts";

import moment from "moment";
import { _get } from "../../Service/apiClient";

import {
  ArrowDownOutlined,
} from "@ant-design/icons";

import { ArrowUpOutlined } from "@ant-design/icons";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
} from "recharts";


const Dashboards = () => {
  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState(0);
  const [totalProperty, setTotalProperty] = useState(0);

  // const [agentInfo, setAgentInfo] = useState(0);

  const [agentInfo, setAgentInfo] = useState([]);
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  useEffect(() => {
    setFilteredAgents(agentInfo);
  }, [agentInfo]);

  //  state data...

  const [stateData, setStateData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3);

  //  Top property
  const [topProperties, setTopProperties] = useState([]);



  //   search for the agent name and location

  const [filteredAgents, setFilteredAgents] = useState(agentInfo);

  //  modal code from here...

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPropertys, setSelectedPropertys] = useState(null);

  //  meter card related code...

  const propertyData = {
    agricultural: 35, // in percentage
    residential: 45, // in percentage
    commercial: 70, // in percentage
  };

  const totalPercentage =
    propertyData.agricultural +
    propertyData.residential +
    propertyData.commercial;

  // Convert percentages into degrees for the conic gradient
  const agriculturalDegree =
    (propertyData.agricultural / totalPercentage) * 180;
  const residentialDegree =
    (propertyData.residential / totalPercentage) * 180 + agriculturalDegree;
  const commercialDegree = 180;

  const salesData = useMemo(() =>[
    { date: "2024-11-01", price: 30000 },
    { date: "2024-11-02", price: 35000 },
    { date: "2024-11-03", price: 40000 },
    { date: "2024-11-04", price: 45000 },
    { date: "2024-11-05", price: 50000 },
    { date: "2024-11-06", price: 55000 },
    { date: "2024-11-07", price: 60000 },
    { date: "2024-11-08", price: 65000 },
    { date: "2024-11-09", price: 70000 },
    { date: "2024-11-10", price: 75000 },
    { date: "2024-11-11", price: 80000 },
    { date: "2024-11-12", price: 85000 },
  ],[]);


  //  sales related things

  const [filteredData, setFilteredData] = useState(salesData.slice(-7)); // Default to last 7 days
  const [selectedDate] = useState(null);

  // Sample data for the line chart (replace with actual dynamic data)
  const chartData = [
    { date: "2 Nov", sales: 1200 },
    { date: "3 Nov", sales: 1500 },
    { date: "4 Nov", sales: 1000 },
    { date: "5 Nov", sales: 1300 },
    { date: "6 Nov", sales: 1700 },
    { date: "7 Nov", sales: 1600 },
    { date: "8 Nov", sales: 1900 },
  ];

  const data = [
    { month: "Jan", visitors: 20000 },
    { month: "Feb", visitors: 40000 },
    { month: "Mar", visitors: 50000 },
    { month: "Apr", visitors: 30000 },
    { month: "May", visitors: 40000 },
    { month: "Jun", visitors: 80000 },
    { month: "Jul", visitors: 90000 },
    { month: "Aug", visitors: 70000 },
    { month: "Sep", visitors: 80000 },
    { month: "Oct", visitors: 20000 },
    { month: "Nov", visitors: 50000 },
    { month: "Dec", visitors: 20000 },
  ];

  const top3Properties = topProperties.slice(0, 5);

  const maxVisitors = Math.max(...data.map((item) => item.visitors)); // Highest number of visitors

  const agentColumns = [
    {
      title: "Profile",
      dataIndex: "agentProfile",
      key: "agentProfile",
      render: (profileUrl) => (
        <img
          src={profileUrl}
          alt="Agent Profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
      align: "center",
    },
    {
      title: "Agent Name",
      dataIndex: "agentName",
      key: "agentName",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "agentLocation",
      key: "agentLocation",
      align: "center",
    },
    {
      title: "Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      align: "center",
    },
    {
      title: "Total Sales",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (price) => `₹${price.toLocaleString()}`, // Format price
    },
  ];

  // const [nameSearchQuery, setNameSearchQuery] = useState("");
  // const [locationSearchQuery, setLocationSearchQuery] = useState("");

  //  const [filteredAgents, setFilteredAgents] = useState([]);
  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await _get("/admin/getTotalSales");
        setTotalSales(response.data.totalSales || 0);
        setTotalProperty(response.data.totalProperty || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTotalSales("Error");
        setTotalProperty("Error");
      }
    }; // const [nameSearchQuery, setNameSearchQuery] = useState("");
    // const [locationSearchQuery, setLocationSearchQuery] = useState("");

    //  const [filteredAgents, setFilteredAgents] = useState([]);

    fetchTotalSales();

    const AgentTable = async () => {
      try {
        const response = await _get("/agent/getAgentSales");

        setAgentInfo(
          response.data
            ? Array.isArray(response.data)
              ? response.data
              : [response.data]
            : []
        );
      } catch (error) {
        console.error("Error fetching agent data:", error);
        setAgentInfo([]);
      }
    };

    AgentTable();

    const fetchStateData = async () => {
      try {
        const response = await _get("/admin/getStateWiseStats");
        const data = response.data;

        const formattedData = Object.entries(data).map(([state, count]) => ({
          state,
          count,
        }));

        setStateData(formattedData);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    fetchStateData();

    const fetchTopProperties = async () => {
      try {
        const response = await _get("/views/getTopProperties");
        setTopProperties(response.data);
      } catch {
        setTopProperties("Error");
      }
    };
    fetchTopProperties();
  }, []);

  //  [pagination]

  const paginatedData = stateData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to filter data based on selected date
  const handleDateChange = (date, dateString) => {
    if (date) {
      const filtered = salesData.filter((entry) => {
        return new Date(entry.date) >= new Date(dateString);
      });
      setFilteredData(filtered.slice(-7)); // Show only last 7 days
    } else {
      setFilteredData(salesData.slice(-7)); // Default to last 7 days
    }
  };

  useEffect(() => {
    if (selectedDate) {
      // Fetch or filter data based on selected date range here
      // For now, we simulate the filtering with sample data
      const filtered = salesData.filter(
        (entry) => new Date(entry.date) >= new Date(selectedDate)
      );
      setFilteredData(filtered.slice(-7));
    }
  }, [selectedDate,salesData]);

  const showModal = (property) => {
    setSelectedPropertys(property); // Set the selected property
    setIsModalVisible(true); // Open the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedPropertys(null); // Clear the selected property
  };

  const handleNameSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setNameSearchQuery(query);

    if (query === "") {
      setFilteredAgents(agentInfo); // Reset to all agents
      return;
    }

    const filteredData = agentInfo.filter((agent) =>
      agent.agentName.toLowerCase().includes(query)
    );
    setFilteredAgents(filteredData);
  };

  const handleLocationSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setLocationSearchQuery(query);

    if (query === "") {
      setFilteredAgents(agentInfo); // Reset to all agents
      return;
    }

    const filteredData = agentInfo.filter(
      (agent) =>
        agent.agentLocation && agent.agentLocation.toLowerCase().includes(query)
    );
    setFilteredAgents(filteredData);
  };

  return (
    <div>
      <Row
        gutter={[48, 48]}
        justify="center"
        style={{
          marginBottom: "20px",
          marginTop: "30px",
          backgroundColor: "white",
        }}
      >
        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              // textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",

              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",

              backdropFilter: "blur(20px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
              // marginRight:"10%"
              marginLeft: "-25%",
              height: "90%",
            }}
            onClick={() => navigate("/dashboard/admin/")}
          >
            <h2>Total Revenue</h2>
            <div
              style={{
                position: "relative",
                width: "150px",
                height: "75px",
                margin: "0 auto",
              }}
            >
              <svg viewBox="0 0 200 100" width="100%" height="100%">
                <path
                  d="M10 100 A90 90 0 0 1 190 100"
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="20"
                />

                <path
                  d="M10 100 A90 90 0 0 1 140 20"
                  fill="none"
                  stroke="rgb(13, 65, 107)"
                  strokeWidth="20"
                  strokeLinecap="round"
                />

                <text
                  x="100"
                  y="85"
                  textAnchor="middle"
                  fontSize="25"
                  fill="black"
                  fontWeight="bold"
                >
                  ₹1,25,000
                </text>
              </svg>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              // textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",

              backdropFilter: "blur(20px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
              // marginLeft: "-5%",
              height: "90%",
            }}
            onClick={() => navigate("/dashboard/admin/admindashboard")}
          >
            <h2 style={{ marginBottom: "10px", fontSize: "18px" }}>Sales</h2>
            {/* Progress Section */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "20px",
                borderRadius: "25px",
                overflow: "hidden",
                backgroundColor: "rgba(91, 91, 95, 0.23)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Sold Progress */}
              <div
                style={{
                  height: "100%",
                  width: "90%", // Adjust width dynamically to show the percentage
                  background: "rgb(13, 65, 107)",
                  borderTopLeftRadius: "25px",
                  borderBottomLeftRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                90%
              </div>
              {/* Remaining Section */}
              <div
                style={{
                  height: "100%",
                  width: "10%",
                  backgroundColor: "rgba(91, 91, 95, 0.23)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              ></div>
            </div>
            <h2 style={{ marginBottom: "10px", fontSize: "15px" }}>
              Property Sold
            </h2>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "20px",
                borderRadius: "25px",
                overflow: "hidden",
                backgroundColor: "rgba(91, 91, 95, 0.23)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Sold Progress */}
              <div
                style={{
                  height: "100%",
                  width: "90%", // Adjust width dynamically to show the percentage
                  background: "rgb(13, 65, 107)",
                  borderTopLeftRadius: "25px",
                  borderBottomLeftRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                30%
              </div>
              {/* Remaining Section */}
              <div
                style={{
                  height: "100%",
                  width: "90%",
                  backgroundColor: "rgba(91, 91, 95, 0.23)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              ></div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",

              backdropFilter: "blur(20px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
              height: "90%",
              marginLeft: "-8%",
            }}
            onClick={() => navigate("/dashboard/admin/estate")}
          >
            <h2>Estate Management</h2>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "20px",
                borderRadius: "25px",
                overflow: "hidden",
                backgroundColor: "rgba(91, 91, 95, 0.23)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Sold Progress */}
              <div
                style={{
                  height: "100%",
                  width: "90%", // Adjust width dynamically to show the percentage
                  background: "rgb(13, 65, 107)",
                  borderTopLeftRadius: "25px",
                  borderBottomLeftRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                90%
              </div>
              {/* Remaining Section */}
              <div
                style={{
                  height: "100%",
                  width: "10%",
                  backgroundColor: "rgba(91, 91, 95, 0.23)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              ></div>
            </div>
            <h4>PropertyHub</h4>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={5}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",

              backdropFilter: "blur(20px)",

              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
              height: "90%",
              // marginLeft: "-8%",
              marginRight: "-10%",
            }}
            onClick={() => navigate("/dashboard/admin/assist")}
          >
            <h2>AssistRevenue</h2>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "20px",
                borderRadius: "25px",
                overflow: "hidden",
                backgroundColor: "rgba(91, 91, 95, 0.23)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Sold Progress */}
              <div
                style={{
                  height: "100%",
                  width: "90%", // Adjust width dynamically to show the percentage
                  background: "rgb(13, 65, 107)",
                  borderTopLeftRadius: "25px",
                  borderBottomLeftRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                90%
              </div>
              {/* Remaining Section */}
              <div
                style={{
                  height: "100%",
                  width: "10%",
                  backgroundColor: "rgba(91, 91, 95, 0.23)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontWeight: "bold",
                }}
              ></div>
            </div>
          </Card>
        </Col>

        {/*  meter card */}

        <Col xs={24} sm={24} md={7}>
          <Card
            title="Overall Sales"
            style={{
              textAlign: "center",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",
              backdropFilter: "blur(20px)",

              height: "20%",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "75px",
                background: `conic-gradient(
rgb(13, 65, 107) 0deg ${agriculturalDegree}deg,
#9bc4bf ${agriculturalDegree}deg ${residentialDegree}deg,
#7d8cbd ${residentialDegree}deg ${commercialDegree}deg,
#e6e6e6 ${commercialDegree}deg
)`,
                borderRadius: "150px 150px 0 0",
                transform: "rotate(-0deg)",
                margin: "5px auto",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "60px",
                  backgroundColor: "#fff",
                  borderRadius: "120px 120px 0 0",
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                }}
              ></div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                gap: "15px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "green",
                    borderRadius: "100%",
                  }}
                ></span>
                <span style={{ fontSize: "10px" }}>
                  Agricultural ({propertyData.agricultural}%)
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "blue",
                    borderRadius: "100%",
                  }}
                ></span>
                <span style={{ fontSize: "10px" }}>
                  Residential ({propertyData.residential}%)
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "orange",
                    borderRadius: "100%",
                  }}
                ></span>
                <span style={{ fontSize: "10px" }}>
                  Commercial ({propertyData.commercial}%)
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "pink",
                    borderRadius: "100%",
                  }}
                ></span>
                <span style={{ fontSize: "10px" }}>
                  Layout ({propertyData.residential}%)
                </span>
              </div>
            </div>
          </Card>
        </Col>

        {/*  website visitor... */}

        <Col xs={24} sm={12} md={22}>
          <Card
            hoverable
            style={{
              // textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",

              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              marginLeft: "66%",

              height: "290px",
              transition: "transform 0.3s, box-shadow 0.3s",
              marginTop: "-24%",
              // marginLeft:"10%",
            }}
          >
            <h2>Website Visitors</h2>

            <div style={{}}>
              {/* <span
style={{
width: "10px",
height: "10px",
borderRadius: "50%",
backgroundColor: "rgba(13, 65, 107, 0.8)",
marginRight: "5px",
}}
></span>
<span style={{ fontSize: "12px" }}>
Average Visitors: {averageVisitors.toFixed(0)}
</span> */}
            </div>
            {/* <div

style={{
display: "flex",
alignItems: "center",
marginTop: "1px",
}}
>
<span
style={{
width: "10px",
height: "10px",
borderRadius: "50%",
backgroundColor: "rgba(13, 65, 107, 0.8)",
marginRight: "5px",
}}
></span>
<span style={{ fontSize: "12px" }}>
Highest Visitors: {maxVisitors}
</span>
</div> */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "90%",
                  alignItems: "flex-end",
                  marginLeft: "6%",
                  marginTop: "-28px",
                }}
              >
                {data.map((item, index) => {
                  const barHeight = (item.visitors / maxVisitors) * 200; // Adjust the "200" to control the max height of the bars
                  return (
                    <div
                      key={index}
                      style={{
                        width: "5%",
                        margin: "0 5px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        title={`${item.visitors} Visitors`}
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: "rgba(13, 65, 107, 0.8)",
                          transition: "all 0.3s ease",
                        }}
                      />
                      <p>{item.month}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </Col>

        {/*  for displaying the state data... */}

        <Col xs={24} sm={12} md={12}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",
              backdropFilter: "blur(20px)",

              color: "black",
              borderRadius: "12px",
              // padding: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              marginTop: "-55%",
              height: "70%",
              width: "70%",
              // marginRight:"10%",
              marginLeft: "-5%",
            }}
          >
            <h2>Top Selling States</h2>

            <List
              dataSource={paginatedData}
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 20px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {/* State name */}
                  <span style={{ color: "black" }}>{item.state}</span>

                  {/* Arrow and property count */}
                  <span
                    style={{
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {/* Conditional arrow */}
                    {item.count > 0 ? (
                      <ArrowUpOutlined style={{ color: "green" }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: "red" }} />
                    )}
                    {item.count} Property
                  </span>
                </List.Item>
              )}
            />

            {/* Pagination */}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={stateData.length}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </Card>
        </Col>

        {/*  meter card */}

        <Col xs={24} sm={12} md={10}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",

              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",
           

              // background: "#818185",

              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
              marginLeft: "-40%",
            }}
          >
            <h2>Sales Analytics</h2>

            <p style={{ fontSize: "14px", marginBottom: "10px" }}>
              Displaying sales data for the last 7 days.
            </p>

            <DatePicker
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              style={{ marginBottom: "10px" }}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/*  new sales analytics.... code from here... */}

        {/*  new code from ******8 */}

        <Col xs={24} sm={12} md={12}>
          <Card
            hoverable
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              color: "black",
              borderRadius: "12px",
              padding: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              marginTop: "-75%",
              height: "200%",
              width: "65%",
              // marginRight:"20%",
              marginLeft: "-45%",
            }}
          >
            <h2>Top Trending Properties</h2>

            <List
              dataSource={top3Properties} // Using top 3 properties
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 20px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {/* Property image */}
                  <img
                    src={item.propertyImage}
                    alt={item.propertyName}
                    onClick={() => showModal(item)}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      marginRight: "10px",
                    }}
                  />

                  {/* Property name */}
                  <span style={{ color: "black" }}>{item.propertyName}</span>

                  {/* Views count and arrow */}
                  <span
                    style={{
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {/* Conditional arrow */}
                    {item.viewsCount > 0 ? (
                      <ArrowUpOutlined style={{ color: "green" }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: "red" }} />
                    )}
                    {item.viewsCount} Views
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* <AdminDashboard /> */}

      <Row gutter={[48, 48]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Card
            title="Total Sales"
            style={{
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",

              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",
              

              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            {totalSales} Property
          </Card>
        </Col>

        <Col xs={24} sm={12} md={7}>
          <Card
            title="Number of Properties"
            style={{
              textAlign: "center",

              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",

              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",

              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",
              

              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            {totalProperty}
            <br></br>
            Property current on website
          </Card>
        </Col>

        <Col xs={24} sm={12} md={7}>
          <Card
            title="Commission Summary"
            style={{
              textAlign: "center",

              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",

              // background:
              //   "linear-gradient(135deg, rgba(13, 65, 107, 0.8), rgba(255, 255, 255, 0.1))",
              border: "1px solid rgba(172, 172, 172, 0.2)",
              backgroundColor: "rgba(91, 91, 95, 0.23)",


              //  linear

              backdropFilter: "blur(10px)",
              color: "black",
              borderRadius: "12px",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            ₹10,000
            {/*  sra */}
          </Card>
        </Col>
      </Row>

      <Row gutter={[48, 48]} justify="center" style={{ marginTop: "30px" }}>
        <Col xs={24} sm={24} md={12}>
          <Card title="Sales Performance Over Time">
            <div style={{ width: "70%", margin: "0 auto" }}>
              {" "}
              <Line
                data={chartData}
                xField="date"
                yField="sales"
                smooth={true}
                lineStyle={{
                  lineWidth: 6,
                  stroke: "#5B8FF9",
                  color: "black",
                }}
                label={{
                  visible: true,
                  formatter: (v) => `${v}`,
                }}
                xAxis={{
                  label: { autoRotate: false },
                }}
                yAxis={{
                  label: { formatter: (v) => `$${v}` },
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Card title="Agent Sales Performance">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={12}>
                <Input
                  placeholder="Search by Agent Name"
                  value={nameSearchQuery}
                  onChange={handleNameSearchChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Input
                  placeholder="Search by Location"
                  value={locationSearchQuery}
                  onChange={handleLocationSearchChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                />
              </Col>
            </Row>

            <Table
              dataSource={filteredAgents}
              columns={agentColumns}
              rowKey="agentId"
              pagination={{
                pageSize: 8,
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                },
              }}
            />
          </Card>
        </Col>

        {/* <AdminDashboard /> */}
      </Row>

      <Modal
        title="Property Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        bodyStyle={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        {selectedPropertys && (
          <div>
            {/* Carousel for Property Images */}
            <Carousel autoplay>
              <div>
                <img
                  src={selectedPropertys.propertyImage}
                  alt={selectedPropertys.propertyName || "Property"}
                  style={{
                    width: "100%",
                    height: "350px", // Increased height
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "20px",
                  }}
                />
              </div>
              {/* Additional Images */}
              {selectedPropertys.additionalImages?.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Additional ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "20px",
                    }}
                  />
                </div>
              ))}
            </Carousel>

            {/* Grid Layout for Cards */}
            <Row gutter={[16, 16]}>
              {[
                {
                  title: "Owner Details",
                  color: "#ffe7ba",
                  icon: <UserOutlined />,
                  content: [
                    {
                      label: "Name",
                      value: selectedPropertys.ownerName,
                      icon: <UserOutlined />,
                    },
                    {
                      label: "Contact",
                      value: selectedPropertys.ownerContact,
                      icon: <PhoneOutlined />,
                    },
                    {
                      label: "Email",
                      value: selectedPropertys.ownerEmail,
                      icon: <MailOutlined />,
                    },
                  ],
                },
                {
                  title: "Property Details",
                  color: "#bae7ff",
                  icon: <HomeOutlined />,
                  content: [
                    {
                      label: "Plot Size",
                      value: `${selectedPropertys.plotSize || "N/A"} sq.ft.`,
                      icon: <FieldNumberOutlined />,
                    },
                    {
                      label: "Price per Sq.ft",
                      value: `₹${selectedPropertys.price || "N/A"}`,
                      icon: <DollarCircleOutlined />,
                    },
                    {
                      label: "Total Price",
                      value: `₹${selectedPropertys.totalPrice || "N/A"}`,
                      icon: <DollarCircleOutlined />,
                    },
                    {
                      label: "Views Count",
                      value: `${selectedPropertys.viewsCount || "N/A"}`,
                      icon: <EyeOutlined />,
                    },
                  ],
                },
                {
                  title: "Address",
                  color: "#d9f7be",
                  icon: <EnvironmentOutlined />,
                  content: [
                    {
                      label: "Village",
                      value: selectedPropertys.village,
                      icon: <EnvironmentOutlined />,
                    },
                    {
                      label: "Mandal",
                      value: selectedPropertys.mandal,
                      icon: <EnvironmentOutlined />,
                    },
                    {
                      label: "District",
                      value: selectedPropertys.district,
                      icon: <EnvironmentOutlined />,
                    },
                    {
                      label: "State",
                      value: selectedPropertys.state,
                      icon: <EnvironmentOutlined />,
                    },
                    {
                      label: "Country",
                      value: selectedPropertys.country,
                      icon: <GlobalOutlined />,
                    },
                  ],
                },
                {
                  title: "Amenities",
                  color: "#ffccc7",
                  icon: <AppstoreOutlined />,
                  content: [
                    {
                      label: "Water",
                      value: selectedPropertys.water
                        ? "Available"
                        : "Not Available",
                      icon: <AppstoreOutlined />,
                    },
                    {
                      label: "Grocery Stores",
                      value: selectedPropertys.grocery,
                      icon: <AppstoreOutlined />,
                    },
                    {
                      label: "Educational Institutions",
                      value: selectedPropertys.educational,
                      icon: <AppstoreOutlined />,
                    },
                    {
                      label: "Medical Facilities",
                      value: selectedPropertys.medical,
                      icon: <AppstoreOutlined />,
                    },
                  ],
                },
              ].map(({ title, color, icon, content }, index) => (
                <Col key={index} xs={24} md={12}>
                  <Card
                    title={
                      <>
                        {icon} {title}
                      </>
                    }
                    bordered={false}
                    style={{
                      backgroundColor: color,
                      borderRadius: "10px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      minHeight: "200px", // Ensure uniform height
                    }}
                  >
                    {content.map((item, i) => (
                      <p key={i}>
                        {item.icon} <strong>{item.label}:</strong>{" "}
                        {item.value || "N/A"}
                      </p>
                    ))}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboards;
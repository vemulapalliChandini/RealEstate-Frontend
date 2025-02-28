import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Card } from "antd";
import { _get } from "../../Service/apiClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsGraph = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

//   const [analyticscountry, setAnalyticscountry] = useEffect([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(
          "/api/countbyevent"
        );
        setAnalyticsData(response.data);
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
    return <Spin size="large"               style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }}/>;
  }
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  const renderEventChart = (eventName, eventCount) => {
    return (
      <Card title={eventName} style={{ marginBottom: "20px" }}>

        <ResponsiveContainer width="50%" height={300}>

          <LineChart data={[{ name: eventName, count: eventCount }]}>


            <CartesianGrid strokeDasharray="3 3" />
            
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    );
  };
  
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Event Analytics Dashboard</h1>
      {analyticsData.map((event, index) => {
        const eventName = event.dimensionValues[0]?.value;
        const eventCount = event.metricValues[0]?.value;

        // Render a chart for each event from the antdesign.

        return renderEventChart(eventName, eventCount);
      })}
    </div>
  );
};

export default AnalyticsGraph;

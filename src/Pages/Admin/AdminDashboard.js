


import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { Card, Row, Col, Tabs, Modal } from "antd";
import { _get } from "../../Service/apiClient";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";


const { TabPane } = Tabs;



const COLORS = ["#36A2EB", "#FF6384", "rgb(13, 65, 107)"]; // Blue, Pink, Dark Blue

const renderCustomizedLabel = ({ name, value }) => `${name}: ${value}`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("agriculture");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedData, setSelectedData] = useState(null);


  const [agricultureData, setAgricultureData] = useState([]);


  const [commercialSoldData, setCommercialSoldData] = useState([]);
  const [commercialUnsoldData, setCommercialUnsoldData] = useState([]);


  const [layoutData, setLayoutData] = useState([]);

  const [residentialSoldData, setResidentialSoldData] = useState([]);
  const [residentialUnsoldData, setResidentialUnsoldData] = useState([]);


  const [summary, setSummary] = useState({});
  const navigate = useNavigate();


  useEffect(() => {

    const fetchAgricultureData = async () => {

      try {

        const response = await _get("/admin/getFeildStats");
        

        const formattedData = [

          { name: "Sold", value: response.data.sold },
          { name: "Unsold", value: response.data.unSoldData },

        ];

        setAgricultureData(formattedData);


        setSummary({
          totalProperties: response.data.totalProperties || 0,
          sold: response.data.sold || 0,
          unsold: response.data.unSoldData || 0,
          totalValue: response.data.totalValue || 0,
        });

      } catch (error) {
        console.error("Error fetching agriculture data", error);
      }
    };



    const fetchCommercialData = async () => {



      try {
        const response = await _get(
          "/admin/getCommercialStats"
        );


        const sold = Object.entries(response.data.sold).map(([key, value]) => ({
          name: key,
          value,
        }));


        const unsold = Object.entries(response.data.unSold).map(
          ([key, value]) => ({
            name: key,
            value,
          })

        );
        setCommercialSoldData(sold);
        setCommercialUnsoldData(unsold);
        setSummary({
          totalProperties: response.data.totalProperty || 0,
          sold: sold.reduce((sum, item) => sum + item.value, 0),
          unsold: unsold.reduce((sum, item) => sum + item.value, 0),
          totalValue: response.data.totalValue || 0,
        });

      } catch (error) {
        console.error("Error fetching commercial data", error);
      }
    };


    const fetchLayoutData = async () => {
      try {
        const response = await _get(
          "/admin/getLayoutStats"
        );


        const formattedData = [
          { name: "Sold", value: response.data.sold },
          { name: "Unsold", value: response.data.unSold },
        ];


        setLayoutData(formattedData);

        setSummary({
          totalProperties: response.data.totalProperty || 0,
          sold: response.data.sold || 0,
          unsold: response.data.unSold || 0,
          totalValue: response.data.totalValue || 0,
        });

      } catch (error) {
        console.error("Error fetching layout data", error);
      }
    };

    const fetchResidentialData = async () => {
      try {
        const response = await _get(
          "/admin/getResidentialStats"
        );
        const sold = Object.entries(response.data.sold).map(([key, value]) => ({
          name: key,
          value,
        }));

        const unsold = Object.entries(response.data.unSold).map(
          ([key, value]) => ({
            name: key,
            value,
          })
        );

        setResidentialSoldData(sold);
        setResidentialUnsoldData(unsold);
        setSummary({
          totalProperties: response.data.totalProperty || 0,
          sold: sold.reduce((sum, item) => sum + item.value, 0),
          unsold: unsold.reduce((sum, item) => sum + item.value, 0),
          totalValue: response.data.totalValue || 0,
        });

      } catch (error) {
        console.error("Error fetching residential data", error);
      }

    };



    if (activeTab === "agriculture") {
      fetchAgricultureData();

    } else if (activeTab === "commercial") {
      fetchCommercialData();

    } else if (activeTab === "layout") {
      fetchLayoutData();

    } else if (activeTab === "residential") {
      fetchResidentialData();

    }
  }, [activeTab]);



  const renderPieCharts = (data, title) => (
    <Col span={12}>
      <h3>{title}</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}

          cx="50%"
          cy="50%"

          innerRadius={60}
          outerRadius={110}

          fill="#8884d8"

          paddingAngle={5}
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Col>
  );


  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>


      {/* <AnalyticsGraph/> */}

      <Card title="Property Sales Overview">
        <Tabs
          defaultActiveKey="agriculture"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
        >
          {/*  Agriculture... */}

          <TabPane tab="Agriculture" key="agriculture">
            <Row gutter={[16, 16]}>
              {renderPieCharts(
                agricultureData,
                "Sold Properties vs Unsold Properties"
              )}
              <Col span={12}>
                <Card>
                  <p>
                    <strong>Total Properties:</strong> {summary.totalProperties}
                  </p>
                  <p>
                    <strong>Total Value:</strong> ₹{summary.totalValue}
                  </p>
                  <p>
                    <strong>Sold Properties:</strong> {summary.sold}
                  </p>
                  <p>
                    <strong>Unsold Properties:</strong> {summary.unsold}
                  </p>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/*  Commerical */}

          <TabPane tab="Commercial" key="commercial">
            <Row gutter={[16, 16]}>
              {renderPieCharts(
                commercialSoldData,
                "Sold Commercial Properties"
              )}
              {renderPieCharts(
                commercialUnsoldData,
                "Unsold Commercial Properties"
              )}
            </Row>

            <Row>
              <Col span={24}>
                <Card>
                  <p>
                    <strong>Total Properties:</strong> {summary.totalProperties}
                  </p>
                  <p>
                    <strong>Total Value:</strong>₹{summary.totalValue}
                  </p>
                  <p>
                    <strong>Sold Properties:</strong> {summary.sold}
                  </p>
                  <p>
                    <strong>Unsold Properties:</strong> {summary.unsold}
                  </p>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/*  Layout */}

          <TabPane tab="Layout" key="layout">
            <Row gutter={[16, 16]}>
              {renderPieCharts(
                layoutData,
                "Sold Properties vs Unsold Properties"
              )}

              <Col span={12}>
                <Card>
                  <p>
                    <strong> Total Properties:</strong>{" "}
                    {summary.totalProperties}
                  </p>
                  <p>
                    <strong>Total Value:</strong>₹{summary.totalValue}
                  </p>

                  <p>
                    <strong>Sold Properties:</strong> {summary.sold}
                  </p>
                  <p>
                    <strong>Unsold Properties:</strong> {summary.unsold}
                  </p>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/*  Residential */}

          <TabPane tab="Residential" key="residential">
            <Row gutter={[16, 16]}>
              {renderPieCharts(
                residentialSoldData,
                "Sold Residential Properties"
              )}
              {renderPieCharts(
                residentialUnsoldData,
                "Unsold Residential Properties"
              )}
            </Row>
            <Row>
              <Col span={24}>
                <Card>
                  <p>
                    <strong>Total Properties:</strong> {summary.totalProperties}
                  </p>
                  <p>
                    <strong>Total Value:</strong>₹{summary.totalValue}
                  </p>
                  <p>
                    <strong>Sold Properties:</strong> {summary.sold}
                  </p>
                  <p>
                    <strong>Unsold Properties:</strong> {summary.unsold}
                  </p>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Modal
          title={`${selectedData ? selectedData.name : ""} Properties Count`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <p>
            Count of {selectedData ? selectedData.name : ""} Properties:{" "}
            {selectedData ? selectedData.value : 0}
          </p>
        </Modal>
      </Card>
      {/* <AnalyticsDashboard/> */}
    </div>
  );
  
};

export default AdminDashboard;























































































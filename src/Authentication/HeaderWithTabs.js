import React, { useState, useRef, useEffect } from "react";
import { Tabs, Card, Row, Col, Button } from "antd";
import { HomeOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import Call from "./Call";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;

const TabContent = ({ title, content, isVisible }) => {

  return (
    isVisible && (
      <Card
        style={{
          marginTop: "10%",
          padding: "10px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "250px",
          height: "150px",
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          color: "black",
        }}
      >
        <h3
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            color: "black",
            lineHeight: "1.5",
          }}
        >
          {content}
        </p>
      </Card>
    )
  );
};

const HeaderWithTabs = ({ setIsVisible }) => {



  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);




  const [hoveredTab, setHoveredTab] = useState(null);

  const [isIconClicked, setIsIconClicked] = useState(false);

  const [issIconClicked, setIssIconClicked] = useState(false);


  const containerRef = useRef(null); // Ref for the component

  const [activeTab, setActiveTab] = useState(null);

  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false); // State for back button visibility



  const handleTabChange = (key) => {
    setActiveTab(key);
    setIsVisible(false); // Hide "Find Your Dream Property" on tab click
    setIsBackButtonVisible(true); // Show back button when a tab is active

  };

  const handleTabHover = (key) => {
    setHoveredTab(key);
  };

  const handleTabLeave = () => {
    setHoveredTab(null);
  };

  const handleIconClicks = () => {
    setIsIconClicked((prev) => !prev);
  };





  const handleIconClick = () => {
    setIsIconClicked(false); // Close Call component
    setIsVisible(true); // Show "Find Your Dream Property"
    setActiveTab(null); // Reset active tab
    setIsBackButtonVisible(false); // Hide back button when returning to the initial state

  };




  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsIconClicked(false);
        setActiveTab(null);
        setIsBackButtonVisible(false); // Reset back button visibility on outside click

      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);





  return (
    <div style={{ padding: "0px", marginTop: "-7%" }} ref={containerRef}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          float: "right",
          marginRight: "2%",
          marginTop: "1%",
        }}
      >
        <img
          src="https://img.freepik.com/premium-psd/call-center-support-assistant-transparent-background_986960-118551.jpg?ga=GA1.1.786688213.1732196452&semt=ais_tags_boosted"
          alt="Call Icon"
          onClick={handleIconClicks}
          style={{
            width: "40px",
            height: "40px",
            cursor: "pointer",
            borderRadius: "50%",
            border: "2px solid #0d416b",
          }}
        />
       <h2 style={{ color: "white" }}>{t("help.Help")}</h2> 
        {/* Cross Symbol */}
      </div>

      {isIconClicked && <Call />}

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabPosition="top"
        centered
        size="large"
        style={{
          marginBottom: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color:"white",
          width: "70%",
          marginLeft: "15%",
        }}
        onTabClick={handleTabChange}
      >
        <TabPane
          tab={
            <span
              style={{
                backgroundColor: activeTab === "1" ? "#0d416b" : "",
                borderRadius: "8px",
                padding: "8px 16px",
                color: activeTab === "1" ? "#fff" : "white",
              }}
            >
              <strong>{t("header.Buyers")}</strong>
            </span>
          }
          key="1"
          onMouseEnter={() => handleTabHover("1")}
          onMouseLeave={handleTabLeave}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col span={7}>
              <TabContent
                title={t("headerdata.BUY")}
                // content="Flats, Builder Floors, Independent House, Studio Apartments"
                isVisible={activeTab === "1" || hoveredTab === "1"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.POPULAR")}
                // content="Property in Western Mumbai, Verified Properties"
                isVisible={activeTab === "1" || hoveredTab === "1"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.INTRODUCING")}
                // content="Insights, Resident Reviews, Price Trends"
                isVisible={activeTab === "1" || hoveredTab === "1"}
              />
            </Col>
          </Row>
        </TabPane>

        {/* Tab for Tenants */}
        <TabPane
          tab={
            <span
              style={{
                backgroundColor: activeTab === "2" ? "#0d416b" : "",
                borderRadius: "8px",
                padding: "8px 16px",
                color: activeTab === "2" ? "#fff" : "white",
              }}
            >
              <strong>{t("header.Tenants")}</strong>
            </span>
          }
          key="2"
          onMouseEnter={() => handleTabHover("2")}
          onMouseLeave={handleTabLeave}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col span={7}>
              <TabContent
                title={t("headerdata.Rent")}
                // content="Flats, Independent House, Studio Apartments"
                isVisible={activeTab === "2" || hoveredTab === "2"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.SEARCHES")}
                // content="Rent property in Western Mumbai, Verified Properties"
                isVisible={activeTab === "2" || hoveredTab === "2"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.Insights")}
                // content="Insights, Reviews, Price Trends"
                isVisible={activeTab === "2" || hoveredTab === "2"}
              />
            </Col>
          </Row>
        </TabPane>

        {/* Tab for Dealers/Builders */}
        <TabPane
          tab={
            <span
              style={{
                backgroundColor: activeTab === "3" ? "#0d416b" : "",
                borderRadius: "8px", // Rounded corners for the tab
                padding: "8px 16px", // Padding inside the tab
                color: activeTab === "3" ? "#fff" : "white", // White text for active tab
              }}
            >
              <strong>{t("header.Dealers/Builders")}</strong>
            </span>
          }
          key="3"
          onMouseEnter={() => handleTabHover("3")}
          onMouseLeave={handleTabLeave}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col span={7}>
              <TabContent
                title={t("headerdata.Dealer")}
                // content="Post Property, Dealer Services"
                isVisible={activeTab === "3" || hoveredTab === "3"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.RESEARCH")}
                // content="Email us at services"
                isVisible={activeTab === "3" || hoveredTab === "3"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.RESEARCH")}
                // content="Email us at services"
                isVisible={activeTab === "3" || hoveredTab === "3"}
              />
            </Col>
          </Row>
        </TabPane>

        {/* Tab for Agents */}
        <TabPane
          tab={
            <span
              style={{
                backgroundColor: activeTab === "4" ? "#0d416b" : "",

                borderRadius: "8px",

                padding: "8px 16px",

                color: activeTab === "4" ? "#fff" : "white",
              }}
            >
              <strong>{t("header.Agents")}</strong>
            </span>
          }
          key="4"
          onMouseEnter={() => handleTabHover("4")}
          onMouseLeave={handleTabLeave}
        >
          <Row gutter={[16, 16]} justify="center">
            <Col span={7}>
              <TabContent
                title={t("headerdata.AGENT")}
                // content="Insights on properties, grow your business"
                isVisible={activeTab === "4" || hoveredTab === "4"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.TOOLS")}
                // content="Discover tools, marketing resources"
                isVisible={activeTab === "4" || hoveredTab === "4"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.RESOURCES")}
                // content="Discover tools, marketing resources"
                isVisible={activeTab === "4" || hoveredTab === "4"}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      {/* Back Button */}
      {isBackButtonVisible && (
        <span
          style={{
            fontSize: "20px",
            color: "black",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          onClick={handleIconClick}
        >
          <Button
            style={{
              color: "white",
              backgroundColor: "#0D416B",
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </span>
      )}
    </div>
  );
};

export default HeaderWithTabs;
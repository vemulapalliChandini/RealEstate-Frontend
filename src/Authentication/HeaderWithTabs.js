import React, { useState, useRef, useEffect } from "react";
import { Tabs, Card, Row, Col, Button } from "antd";
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
  const containerRef = useRef(null); 
  const [activeTab, setActiveTab] = useState(null);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false); 
  const handleTabChange = (key) => {
    setActiveTab(key);
    setIsVisible(false); 
    setIsBackButtonVisible(true); 
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
    setIsIconClicked(false); 
    setIsVisible(true); 
    setActiveTab(null);
    setIsBackButtonVisible(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsIconClicked(false);
        setActiveTab(null);
        setIsBackButtonVisible(false); 
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
                isVisible={activeTab === "1" || hoveredTab === "1"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.POPULAR")}
                isVisible={activeTab === "1" || hoveredTab === "1"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.INTRODUCING")}
                isVisible={activeTab === "1" || hoveredTab === "1"}
              />
            </Col>
          </Row>
        </TabPane>
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
                isVisible={activeTab === "2" || hoveredTab === "2"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.SEARCHES")}
                isVisible={activeTab === "2" || hoveredTab === "2"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.Insights")}
                isVisible={activeTab === "2" || hoveredTab === "2"}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span
              style={{
                backgroundColor: activeTab === "3" ? "#0d416b" : "",
                borderRadius: "8px",
                padding: "8px 16px",
                color: activeTab === "3" ? "#fff" : "white", 
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
                isVisible={activeTab === "3" || hoveredTab === "3"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.RESEARCH")}
                isVisible={activeTab === "3" || hoveredTab === "3"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.RESEARCH")}
                isVisible={activeTab === "3" || hoveredTab === "3"}
              />
            </Col>
          </Row>
        </TabPane>
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
                isVisible={activeTab === "4" || hoveredTab === "4"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.TOOLS")}
                isVisible={activeTab === "4" || hoveredTab === "4"}
              />
            </Col>
            <Col span={7}>
              <TabContent
                title={t("headerdata.RESOURCES")}
                isVisible={activeTab === "4" || hoveredTab === "4"}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
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
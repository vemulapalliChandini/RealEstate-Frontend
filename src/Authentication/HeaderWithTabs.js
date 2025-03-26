import React, { useState, useRef, useEffect } from "react";
import { Tabs, Card, Row, Col, Button } from "antd";
import Call from "./Call";
import { useTranslation } from "react-i18next";
import "./Styles/HeaderWithTabs.css"; // Import external CSS file

const { TabPane } = Tabs;

const TabContent = ({ title, content, isVisible }) => {
  return (
    isVisible && (
      <Card className="tab-content-card">
        <h3 className="tab-content-card__title">{title}</h3>
        {content && <p className="tab-content-card__content">{content}</p>}
      </Card>
    )
  );
};

const HeaderWithTabs = ({ setIsVisible }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
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
    <div className="header-container" ref={containerRef}>
      <div className="header-top">
        <img
          src="https://img.freepik.com/premium-psd/call-center-support-assistant-transparent-background_986960-118551.jpg?ga=GA1.1.786688213.1732196452&semt=ais_tags_boosted"
          alt="Call Icon"
          onClick={handleIconClicks}
          className="header-icon"
        />
        <h2 className="header-title">{t("help.Help")}</h2>
      </div>
      {isIconClicked && <Call />}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabPosition="top"
        centered
        size="large"
        className="custom-tabs"
        onTabClick={handleTabChange}
      >
        <TabPane
          tab={
            <span className={`custom-tab ${activeTab === "1" ? "custom-tab--active" : ""}`}>
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
            <span className={`custom-tab ${activeTab === "2" ? "custom-tab--active" : ""}`}>
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
            <span className={`custom-tab ${activeTab === "3" ? "custom-tab--active" : ""}`}>
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
            <span className={`custom-tab ${activeTab === "4" ? "custom-tab--active" : ""}`}>
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
        <span className="header-back-button" onClick={handleIconClick}>
          <Button className="header-close-btn">Close</Button>
        </span>
      )}
    </div>
  );
};

export default HeaderWithTabs;

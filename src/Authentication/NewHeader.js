import React, { useEffect, useState } from "react";
import { Layout, Menu, Switch, Col, Typography, Row, Popover, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import NewFooter from "./NewFooter";
import LoginPage from "./LoginPage";
import "./Styles/NewHeader.css"; // External CSS import


const { Header } = Layout; 

function HeaderPage() {
  const { Text } = Typography;
  
  useEffect(() => {
    localStorage.setItem("language", "en");
  }, []);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const changeLanguage = (checked) => {
    const newLanguage = checked ? "te" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const handleLoginClose = () => {
    setIsLoginVisible(false);
  };

  // Popover content definitions
  const buyInfo = (
    <Card title="You can buy:" style={{ width: 300 }}>
      <ul>
        <li>A Home</li>
        <li>Land/Plot</li>
        <li>Agricultural Land</li>
        <li>Flats</li>
        <li>Commercial Spaces</li>
      </ul>
    </Card>
  );

  const agentInfo = (
    <Card title="You can Contact Agents For:" style={{ width: 300 }}>
      <ul>
        <li>Helping You to Buy the expected properties for a reasonable Price with all the expected features</li>
        <li>Sell Your Properties as soon as possible for the expected Price</li>   
      </ul>
    </Card>
  );

  const sellInfo = (
    <Card title="You can Contact Agents For:" style={{ width: 400 }}>
      <ul>
        <li>Getting Expert Advice on Selling Your Property at the Best Price</li>
        <li>Efficiently Marketing Your Property to a Wide Audience</li>
        <li>Managing the Entire Selling Process, From Listing to Closing</li>
        <li>Understanding Market Trends to Make Informed Selling Decisions</li>
        <li>Negotiating Offers to Ensure You Get the Best Deal</li>
        <li>Providing Legal and Financial Support During the Sale Process</li>
      </ul>
    </Card>
  );

  const helpInfo = (
    <Card title="If you find any difficulties:" style={{ width: 300 }}>
      <ul>
        <li>Feel free to reach out to us at +91 7373733783</li>
      </ul>
    </Card>
  );

  return (
    <Layout>
      <LoginPage
        visible={isLoginVisible}
        handleLoginClose={handleLoginClose}
      />
      <Header className="header">
        <Row style={{ width: "100%" }}>
          <Col
            xs={2}
            sm={2}
            md={2}
            lg={2}
            xl={2}
            className="heading1"
            style={{ marginLeft: "-33px" }}
          ></Col>
          <Col
            xs={10}
            sm={10}
            md={8}
            lg={8}
            xl={8}
            style={{ marginLeft: "20px" }}
          >
            <Text className="heading responsive-heading">
              {t("landing.Real Estate Lokam")}
            </Text>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={14}
            lg={14}
            xl={14}
            style={{ float: "right" }}
          >
            <Menu
              theme="dark"
              mode="horizontal"
              items={[
                {
                  key: "0",
                  style: { marginRight: "1%" },
                  label: (
                    <span
                      className="menu-item-label"
                      onClick={() => navigate("/")}
                    >
                      <b className="menu-item-bold">{t("dashboard.Home")}</b>
                    </span>
                  ),
                },
                {
                  key: "1",
                  style: { marginRight: "1%" },
                  label: (
                    <span
                      className="menu-item-label"
                      onClick={() => navigate("/Buy")}
                    >
                      <Popover content={buyInfo}>
                        <span className="menu-item-label">
                          <b className="menu-item-bold">{t("header.buy")}</b>
                        </span>
                      </Popover>
                    </span>
                  ),
                },
                {
                  key: "2",
                  style: { marginRight: "1%" },
                  label: (
                    <span
                      className="menu-item-label"
                      onClick={() => navigate("/sell")}
                    >
                      <Popover content={sellInfo}>
                        <span className="menu-item-label">
                          <b className="menu-item-bold">{t("header.Sell")}</b>
                        </span>
                      </Popover>
                    </span>
                  ),
                },
                {
                  key: "3",
                  style: { marginRight: "1%" },
                  label: (
                    <span
                      className="menu-item-label"
                      onClick={() => navigate("/findanagent")}
                    >
                      <Popover content={agentInfo}>
                        <span className="menu-item-label">
                          <b className="menu-item-bold">{t("header.FindAgent")}</b>
                        </span>
                      </Popover>
                    </span>
                  ),
                },
                {
                  key: "4",
                  style: { marginRight: "30%" },
                  label: (
                    <span
                      className="menu-item-label"
                      onClick={() => navigate("/help")}
                    >
                      <Popover content={helpInfo}>
                        <span className="menu-item-label">
                          <b className="menu-item-bold help-bold">{t("header.Help")}</b>
                        </span>
                      </Popover>
                    </span>
                  ),
                },
                {
                  key: "5",
                  label: (
                    <div className="language-switch-container">
                      {!isLoginVisible && (
                        <Switch
                          checkedChildren="తెలుగు"
                          unCheckedChildren="English"
                          onChange={changeLanguage}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  icon: (
                    <UserOutlined className="user-icon" />

                  ),
                  key: "6",
                  label: (
                    <span
                      className="menu-item-label user-label"
                      onClick={() => setIsLoginVisible(true)}
                    >
                      <b>{t("landing.Sign In")}</b>
                    </span>
                  ),
                },
              ]}
              className="menuStyle"
            />
          </Col>
        </Row>
      </Header>
      <Content >
        <Outlet />
      </Content>
      <NewFooter />
    </Layout>
  );
}

export default HeaderPage;

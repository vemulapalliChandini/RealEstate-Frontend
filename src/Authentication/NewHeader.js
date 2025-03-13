import React, { useEffect, useState } from "react";
import { Layout, Menu, Switch, Col, Typography, Row, Popover, Card } from "antd";
import "./Styles/NewHeader.css";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import NewFooter from "./NewFooter";
import LoginPage from "./LoginPage";
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
  const Help = (
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
            justify="start"
            style={{ marginLeft: "20px" }}
          >
            <Text
              className="heading responsive-heading"
              style={{ color: "white" }}
            >
              {t("landing.Real Estate Lokam")}
            </Text>{" "}
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
                      style={{ color: "white", fontSize: "15px" }}
                      onClick={() => navigate("/")}
                    >
                      <b style={{fontSize:"16px"}}>{t("dashboard.Home")}</b>
                    </span>
                  ),
                },
                {
                  key: "1",
                  style: { marginRight: "1%" }, // Add marginRight style here
                  label: (
                    <span
                      style={{ color: "white", fontSize: "15px" }}
                      onClick={() => navigate("/Buy")}
                    >
                     <Popover content={buyInfo}>
                      <span style={{ color: "white", fontSize: "15px" }}>
                        <b style={{fontSize:"16px"}}>{t("header.buy")}</b>
                      </span>
                    </Popover>
                    </span>
                  ),
                },
                {
                  key: "2",
                  style: { marginRight: "1%" }, // Add marginRight style here
                  label: (
                    <span
                      style={{ color: "white", fontSize: "15px" }}
                      onClick={() => navigate("/sell")}
                    >
                     <Popover content={sellInfo}>
                      <span style={{ color: "white", fontSize: "15px" }}>
                        <b style={{fontSize:"16px"}}>{t("header.Sell")}</b>
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
                      style={{ color: "white", fontSize: "15px" }}
                      onClick={() => navigate("/findanagent")}
                    >
                      <Popover content={agentInfo}>
                      <span style={{ color: "white", fontSize: "15px" }}>
                        <b style={{fontSize:"16px"}}>{t("header.FindAgent")}</b>
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
                      style={{ color: "white", fontSize: "15px" }}
                      onClick={() => navigate("/help")}
                    >
                                            <Popover content={Help}>
                      <span style={{ color: "white", fontSize: "15px" }}>
                        <b style={{fontSize:"18px"}}>{t("header.Help")}</b>
                      </span>
                    </Popover>
                     
                    </span>
                  ),
                },
                {
                  key: "5",
                  label: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "22px",
                      }}
                    >
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
                    <UserOutlined
                      style={{ fontSize: "17px", color: "white", marginTop: "4px" }}
                    />
                  ),
                  key: "6",
                  label: (
                    <span
                      style={{
                        fontSize: "17px",
                        color: "white",
                        marginLeft: "-5%",
                      }}
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
      <Content style={{ marginTop: "30px" }}>
        <Outlet />
      </Content>
      <NewFooter />
    </Layout>
  );
}

export default HeaderPage;

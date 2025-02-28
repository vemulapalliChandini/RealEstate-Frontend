import {
  Avatar,
  Card,
  Col,
  Row,
  Spin,
  Pagination,
  Tooltip,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { _get, _put } from "../../Service/apiClient";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import ContactAgent from "./ContactAgent";

const Agents = ({ estate, setIsModalVis, isModalVis, fetchEstates }) => {
  const [agents, setAgents] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const itemsPerPage = pageSize;
  const [bookModal, SetBookModal] = useState(false);
  const [curAgent, setCurAgent] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard/eClient/assignAgent") {
      setPageSize(12);
    } else {
      setPageSize(8);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await _get(`emClient/getAllAgents/${estate._id}`);
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const currentAgents = agents
    ? agents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handleAssign = async (id) => {
    try {
      const response = await _put(`estate/assignAgent/${id}/${estate._id}`);
      setIsModalVis(!isModalVis)
      fetchEstates();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      {agents === null ? (
        <div
          style={{ textAlign: "center", padding: "20px" }}
          className="content-container"
        >
          <Spin size="large" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
          }} />
          <p>Loading Agents...</p>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 8]}>
            {currentAgents.map((agent, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  style={{
                    backgroundColor: "#fcf8f7",
                    height: "90%",
                    border: "1px solid #fceae6",
                  }}
                >
                  <Col span={24}>
                    <Avatar src={agent.profilePicture} size={80} />
                    <Tooltip title="Contact an agent">
                      <CalendarOutlined
                        style={{
                          color: "#0b4da3",
                          backgroundColor: "white",
                          borderRadius: "30%",
                          padding: "4px",
                          position: "absolute",
                          right: "10px",
                          top: "15px",
                          fontSize: "15px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          SetBookModal(true);
                          setCurAgent(agent);
                        }}
                      />
                    </Tooltip>
                    {agent.assign && (
                      <Button
                        onClick={() => handleAssign(agent._id)}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-5px",
                          zIndex: 1,
                          color: "green",
                          border: "1px solid #e62542",
                          borderRadius: "5px",
                          width: "50px",
                          height: "20px",
                          fontSize: "12px",
                        }}
                      >
                        Assign
                      </Button>

                    )}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <b>
                        <UserOutlined
                          style={{ marginRight: "5px", color: "#0d416b" }}
                        />
                      </b>{" "}
                      {`${agent.firstName} ${agent.lastName}`}
                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <b>
                        <PhoneOutlined
                          style={{ marginRight: "5px", color: "#0d416b" }}
                        />
                      </b>{" "}
                      {formatPhoneNumber(agent.phoneNumber)}

                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <b>
                        <EnvironmentOutlined
                          style={{ marginRight: "5px", color: "#0d416b" }}
                        />
                      </b>{" "}
                      {agent.pinCode !== 0 && `${agent.pinCode}, `}
                      {agent.mandal && `${agent.mandal}, `}
                      {agent.district && `${agent.district}`}
                    </div>
                  </Col>
                </Card>
              </Col>
            ))}
          </Row>
          <Row >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                position: "fixed",
                bottom: "90px",
                right: "20px",
                width: "100%",
                zIndex: 1000,
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={agents.length}
                onChange={handlePageChange}
                pageSizeOptions={["12", "24", "36", "48"]}
                showSizeChanger={true}
              />
            </div>

          </Row>

          {bookModal && (
            <ContactAgent
              isModalVis={bookModal}
              setIsModalVis={SetBookModal}
              estate={estate}
              agent={curAgent}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Agents;

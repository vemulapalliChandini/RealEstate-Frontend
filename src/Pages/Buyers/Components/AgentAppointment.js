import React, { useState, useEffect, useRef } from "react";

import { getSocket } from "../../../Authentication/Socket"
import { jwtDecode } from "jwt-decode";
import {
  Card,
  Button,
  Spin,
  Row,
  Col,

  Select,
  Input,
  
  Empty,
  Badge,
  Table
} from "antd";

import {
  ArrowLeftOutlined,
 
  MessageOutlined,
 
  SearchOutlined,
} from "@ant-design/icons";


// chatbot file import
import Chatbot from "../../Chatbot";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { _delete, _get } from "../../../Service/apiClient";

// const socket = io("http://172.17.13.106:5000"); // Backend URL

const { Option } = Select;

const AgentAppointment = ({ path }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] =
    useState(false);
  const [isAllAppointmentsCleared, setIsAllAppointmentsCleared] =
    useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatModal, setChatModal] = useState(false);
  const [curUser, setCurUser] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const [curReceiver, setCurReceiver] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const socket = getSocket(); 
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    // Connect to WebSocket
    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    // Listen for incoming messages
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Store messages in local storage

      // If chat modal is closed, increment new message count
      if (!chatModal) {
        setNewMessagesCount((count) => count + 1);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup

    return () => {
      socket.off("connect");
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chatModal, messages]);

  useEffect(() => {
    if (chatModal && curReceiver) {
      const fetchMessages = async () => {
        try {
          const response = await _get(
            `/chat/getMessages/${localStorage.getItem("userId")}/${curReceiver}`
          );

          if (Array.isArray(response.data)) {
            setMessages(response.data);
            localStorage.setItem("chatMessages", JSON.stringify(response.data)); // Store fetched messages in local storage
          } else {
            console.error("Fetched messages are not an array:", response.data);
            setMessages([]); // Reset to an empty array if the data is not valid
          }
          console.log("fetching from .... where ? ", response.data);
          // setMessages(response.data);
          // localStorage.setItem("chatMessages", JSON.stringify(response.data)); // Store fetched messages in local storage
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [chatModal, curReceiver]); // Removed userId as it's not used in this hook

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages) || []);
    }
  }, []);
  useEffect(() => {
    console.log("Messages:", messages);
  }, [messages]);

  useEffect(() => {
    const socket = getSocket(); 
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    // Avoid duplicate listeners

    const handleReceiveMessage = (messageData) => {
      console.log("Received message:", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      try {
        console.log(" token is the -->", token);
        const decodedToken = jwtDecode(token);

        setUserId(decodedToken.user.userId);

        console.log("USER ID --> ", decodedToken.userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
        console.log(userId);
      }
    }
  }, []);

  const handleSendMessage = () => {
    timestamp: new Date().toLocaleTimeString();
    if (typedMessage.trim() !== "") {
      const messageData = {
        senderId: localStorage.getItem("userId"),
        receiverId: curReceiver,
        message: typedMessage.trim(),
        // time:
        // timestamp: new Date().toLocaleTimeString(), // Adding the timestamp

        senderRole: 3,
      };

      // console.log(messageData);
const socket = getSocket(); 
      socket.emit("send_message", messageData);

      const updatedMessages = [
        ...messages,
        { ...messageData, senderId: localStorage.getItem("userId") },
      ];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      setTypedMessage("");
    }
  };

  useEffect(() => {
    setAppointments([]);
    setIsAllAppointmentsCleared(true);
  }, [path, isBookAppointmentModalOpen]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, selectedFilter, searchQuery]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await _get(`/booking/buyerreqs`);

      setAppointments(response.data);
      checkAppointmentsStatus(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };
  const checkAppointmentsStatus = (appointments) => {
    const hasPending = appointments.some(
      (appointment) => appointment.status === 0
    );
    setIsAllAppointmentsCleared(!hasPending);
  };

  const filterAppointments = () => {
    let filtered = appointments;
    if (selectedFilter === "Accepted") {
      filtered = appointments.filter((appointment) => appointment.status === 1);
    } else if (selectedFilter === "Rejected") {
      filtered = appointments.filter(
        (appointment) => appointment.status === -1
      );
    } else if (selectedFilter === "Pending") {
      filtered = appointments.filter((appointment) => appointment.status === 0);
    }

    if (searchQuery) {
      filtered = filtered.filter((appointment) =>
        `${appointment.firstName} ${appointment.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    setFilteredAppointments(filtered);
  };

  const label1 = (status, cdate) => {
    const curDate = new Date();
    const createdDate = new Date(cdate);
    const timeDiff = curDate - createdDate;
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (status === 1) {
      return `${t("dashboard.Accepted")}`;
    } else if (status === -1) {
      return `${t("dashboard.Rejected")}`;
    } else {
      if (dayDiff > 10) {
        return "No Response";
      } else {
        return `${t("dashboard.Pending")}`;
      }
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleOpenBookAppointmentModal = () => {
    setIsBookAppointmentModalOpen(true);
  };

  const formatTimeTo12Hour = (time) => {
    const [hour, minute] = time.split(":");
    let period = "AM";
    let hour12 = parseInt(hour, 10);

    if (hour12 >= 12) {
      period = "PM";
      if (hour12 > 12) hour12 -= 12;
    } else if (hour12 === 0) {
      hour12 = 12;
    }

    return `${hour12}:${minute} ${period}`;
  };

  const targetCardRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (targetCardRef.current) {
      targetCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const paginatedData = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async (apId) => {
    const response = await _delete(
      `booking/delete/${apId}`,
      "Appointment deleted successfully",
      "Failed to delete appointment"
    );
    fetchAppointments();
  };

  const handleFetchFilteredData = (name, status) => {
    setSelectedFilter(status);
    filterAppointments();
  };

  const toggleChatModal = (appointment) => {
    // setChatModal(!chatModal);
    setChatModal((prev) => !prev); // Toggle chat modal

    setCurUser(appointment);
    setCurReceiver(appointment.agentId);
    setNewMessagesCount(0);
  };

  useEffect(() => {
    setAppointments([]);
    fetchAppointments();
  }, [path]);
const socket = getSocket(); 
  const setConnection = () => {
    socket.emit("register_user", localStorage.getItem("userId"));
    setChatModal(!chatModal);
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

  // useEffect(() => {
  // if (curReceiver) {
  // fetchMessages(); // Fetch messages when curReceiver changes
  // }
  // }, [curReceiver]);

  return (
    <div style={{ padding: "20px" }}>
      <Chatbot onFetchFilteredData={handleFetchFilteredData} />
      <ArrowLeftOutlined
        ref={targetCardRef}
        style={{ fontSize: "24px", color: "#1890ff", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />
      <div>
        <Card
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

            borderRadius: "8px",
            marginBottom: "2%",

          }}
        >
          <Row

            gutter={[16, 16]}
          >
            <Col
              xl={6}
              lg={6}
              md={6}
              sm={6}
              xxl={6}
              xs={6}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <span style={{ marginTop: "10px" }}>Status: </span>
              <Select
                placeholder="Filter by status"
                style={{
                  width: "100%"
                  , height: "36px"
                }}

                prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                onChange={handleFilterChange}
                defaultValue="All"
              >
                <Option value="All">{t("dashboard.all")}</Option>
                <Option value="Pending">{t("dashboard.Pending1")}</Option>
                <Option value="Accepted">{t("dashboard.Accepted1")}</Option>
                <Option value="Rejected">{t("dashboard.Rejected1")}</Option>
              </Select>
            </Col>

            <Col xl={6} lg={6} md={6} sm={6} xxl={6} xs={6}>
              <Input
                placeholder={t("dashboard.searchName")}

                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: "100%"
                  , height: "36px"
                }}

                prefix={<SearchOutlined style={{ color: "#082d4a" }} />} about=""
              />
            </Col>
          </Row>
        </Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // This centers the loader
            }} />
            <p>{t("dashboard.l3")}</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Col
            span={24}
            style={{ textAlign: "centre" }}
            className="content-container"
          >
            <Empty description={t("dashboard.NoAppointment")} />
          </Col>
        ) : (
          // <>
          //   <Row gutter={[16, 16]}>
          //     {paginatedData.map((appointment) => (
          //       <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={6}>
          //         <Card
          //           key={appointment._id}
          //           hoverable
          //           style={{
          //             textAlign: "start",
          //             margin: "0% 0% 2% 2%",
          //             borderRadius: "10px",
          //             backgroundColor: "#f0f2fa",
          //             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          //             transition: "box-shadow 0.3s ease",
          //             height: "100%",
          //             cursor: "default",
          //           }}
          //           onMouseEnter={(e) => {
          //             e.currentTarget.style.boxShadow =
          //               "0 8px 16px rgba(0, 0, 0, 0.4)";
          //           }}
          //           onMouseLeave={(e) => {
          //             e.currentTarget.style.boxShadow =
          //               "0 4px 8px rgba(0, 0, 0, 0.2)";
          //           }}
          //         >
          //           {/* new code form here... */}

          //           <MessageOutlined
          //             style={{
          //               float: "right",
          //               color: "rgb(13,65,107)",
          //               fontSize: "20px",
          //               marginTop: "10px",
          //             }}
          //             onClick={() => {
          //               setCurUser(appointment);
          //               setCurReceiver(appointment.agentId);
          //               console.log("Chat modal toggled", appointment);
          //               setConnection();
          //             }}
          //           />

          //           <Popconfirm
          //             title="Are you sure you want to delete this appointment?"
          //             onConfirm={() => handleDelete(appointment._id)}
          //             okText="Yes"
          //             cancelText="No"
          //             placement="topRight"
          //           >
          //             <Button
          //               style={{
          //                 position: "absolute",
          //                 top: "10px",
          //                 right: "10px",
          //                 zIndex: 1,
          //                 color: "#e62542",
          //                 border: "1px solid #e62542",
          //                 borderRadius: "5px",
          //                 width: "50px",
          //                 height: "20px",
          //                 fontSize: "12px",
          //               }}
          //             >
          //               Delete
          //             </Button>
          //           </Popconfirm>
          //           {path === undefined && (
          //             <div
          //               style={{
          //                 display: "flex",
          //                 alignItems: "center",
          //                 marginBottom: "15px",
          //               }}
          //             >
          //               <img
          //                 src={appointment.profilePicture}
          //                 alt={`${appointment.firstName} ${appointment.lastName}`}
          //                 style={{
          //                   width: "100px",
          //                   height: "100px",
          //                   borderRadius: "50%",
          //                   marginRight: "15px",
          //                 }}
          //               />

          //               <div>
          //                 <strong>{`${appointment.firstName} ${appointment.lastName}`}</strong>
          //                 <p>
          //                   <PhoneOutlined
          //                     style={{
          //                       marginRight: "5px",
          //                       color: "#0d416b",
          //                     }}
          //                   />
          //                   {formatPhoneNumber(appointment.phoneNumber)}

          //                 </p>
          //               </div>
          //             </div>
          //           )}

          //           <p
          //             style={{
          //               lineHeight: "1",
          //               marginTop: path !== undefined && "5%",
          //             }}
          //           >
          //             {" "}
          //             <CalendarFilled
          //               style={{ marginRight: "5px", color: "#0d416b" }}
          //             />
          //             {new Date(appointment.date).toLocaleDateString("en-US", {
          //               year: "numeric",
          //               month: "long",
          //               day: "numeric",
          //             })}
          //           </p>
          //           <p style={{ lineHeight: "1" }}>
          //             <ClockCircleFilled
          //               style={{ marginRight: "5px", color: "#0d416b" }}
          //             />
          //             {formatTimeTo12Hour(appointment.timing)}
          //           </p>
          //           {path === undefined && (
          //             <p style={{ lineHeight: "1" }}>
          //               <HomeFilled
          //                 style={{ marginRight: "5px", color: "#0d416b" }}
          //               />
          //               {appointment.propertyName}
          //             </p>
          //           )}
          //           <p style={{ lineHeight: "1.5" }}>
          //             <EnvironmentFilled
          //               style={{ marginRight: "5px", color: "#0d416b" }}
          //             />
          //             {appointment.location}
          //           </p>
          //           <p>
          //             <Tooltip
          //               title={
          //                 <>
          //                   <strong>{t("dashboard.requestedOn")}</strong>{" "}
          //                   <br></br>
          //                   {new Date(appointment.createdAt).toLocaleString(
          //                     "en-US",
          //                     {
          //                       year: "numeric",
          //                       month: "long",
          //                       day: "numeric",
          //                       hour: "numeric",
          //                       minute: "numeric",
          //                       hour12: true,
          //                     }
          //                   )}
          //                   <br />
          //                   {appointment.status !== 0 && (
          //                     <>
          //                       <strong>{t("dashboard.updatedOn")}</strong>{" "}
          //                       <br></br>
          //                       {new Date(appointment.updatedAt).toLocaleString(
          //                         "en-US",
          //                         {
          //                           year: "numeric",
          //                           month: "long",
          //                           day: "numeric",
          //                           hour: "numeric",
          //                           minute: "numeric",
          //                           hour12: true,
          //                         }
          //                       )}
          //                     </>
          //                   )}
          //                 </>
          //               }
          //             >
          //               <div style={{ marginBottom: "40px" }}>
          //                 <span
          //                   style={{
          //                     position: "absolute",
          //                     bottom: "15px",
          //                     left: "50%",
          //                     transform: "translateX(-50%)",
          //                     padding: "5px 10px",
          //                     borderRadius: "5px",
          //                     marginTop: "20%",
          //                     backgroundColor:
          //                       appointment.status === 1
          //                         ? "green"
          //                         : appointment.status === -1
          //                           ? "red"
          //                           : "orange",
          //                     color: "white",
          //                   }}
          //                 >
          //                   {label1(appointment.status, appointment.createdAt)}
          //                 </span>
          //               </div>
          //             </Tooltip>
          //           </p>
          //         </Card>
          //       </Col>
          //     ))}
          //   </Row>
          //   {filteredAppointments.length > 6 && (
          //     <Row style={{ margin: "20px 0px 0px 0px" }}>
          //       <Col style={{ textAlign: "left", width: "100%" }}>
          //         <Pagination
          //           current={currentPage}
          //           pageSize={pageSize}
          //           total={filteredAppointments.length}
          //           onChange={handlePaginationChange}
          //           showSizeChanger
          //           pageSizeOptions={["6", "12", "18", "24"]}
          //         />
          //       </Col>
          //     </Row>
          //   )}
          // </>
          <>
            <Table
              dataSource={paginatedData}
              rowKey={(record) => record._id}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredAppointments.length,
                onChange: handlePaginationChange,
              }}
            >
              <Table.Column
                title="Profile"
                dataIndex="profilePicture"
                key="profilePicture"
                align="center"
                onHeaderCell={() => ({
                  style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center" }
                })}
                render={(text, record) => (
                  <img
                    src={record.profilePicture}
                    alt={`${record.firstName} ${record.lastName}`}
                    style={{ width: "50px", borderRadius: "50%" }}
                  />
                )}
              />

              <Table.Column
                title="Name"
                dataIndex="firstName"
                key="firstName"
                align="center"
                onHeaderCell={() => ({
                  style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center"
                  }
                })}
                render={(text, record) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>
                      {`${record.firstName} ${record.lastName}`}
                    </span>
                    <Badge count={newMessagesCount} offset={[10, 10]}>
                      <MessageOutlined
                        style={{
                          color: "rgb(13,65,107)",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          toggleChatModal({
                            agentId: record.agentId,
                            firstName: record.firstName,
                            lastName: record.lastName,
                          })
                        }
                      />
                    </Badge>
                  </div>
                )}
              />

              <Table.Column
                title="Phone"
                dataIndex="phoneNumber"
                key="phoneNumber"
                align="center"
                onHeaderCell={() => ({
                  style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center" }
                })}
                render={(text) => formatPhoneNumber(text)}
              />

              <Table.Column
                title="Date"
                dataIndex="date"
                key="date"
                align="center"
                onHeaderCell={() => ({
                  style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center" }
                })}
                render={(text) => new Date(text).toLocaleDateString("en-US")}
              />

              <Table.Column
                title="Time"
                dataIndex="timing"
                key="timing"
                align="center"
                onHeaderCell={() => ({
                  style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center" }
                })}
                render={(text) => formatTimeTo12Hour(text)}
              />

              <Table.Column
                title="Location"
                dataIndex="location"
                key="location"
                align="center"
                onHeaderCell={() => ({
                  style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center" }
                })}
              />

              <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                align="center"
                onHeaderCell={() => ({
                  style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center" }
                })}
                render={(text) => (
                  <span style={{
                    color: text === 1 ? "green" : text === -1 ? "red" : "orange",
                    fontWeight: "bold"
                  }}>
                    {label1(text)}
                  </span>
                )}
              />
            </Table>
          </>
        )}
      </div>

      {/* For msg count notifications */}

      {/* Alert in the RED colour */}



      {/* new code from here.... */}
      {chatModal && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "20px",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              width: "300px",
              height: "400px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="chatbot-header"
              style={{
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>
                <b>{curUser?.firstName}</b> <b>{curUser?.lastName}</b>
              </h3>
              <Button
                type="text"
                onClick={() => setChatModal(false)}
                style={{ color: "#fff" }}
              >
                ✕
              </Button>
            </div>

            <div
              className="chat-history"
              style={{
                flex: 1,
                padding: "10px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((msg, index) => {
                const isSentByUser =
                  msg.senderId === localStorage.getItem("userId");
                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      // backgroundColor: "#007bff",
                      backgroundColor: isSentByUser ? "#007bff" : "black",
                      borderRadius: "10px",
                      alignSelf: isSentByUser ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                      color: "white",
                    }}
                  >
                    <div>
                      {msg.message}
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "white",
                          marginTop: "5px",
                          textAlign: isSentByUser ? "right" : "left",
                        }}
                      >
                        {" "}
                        {/* {new Date().toLocaleTimeString()} */}
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="chatbot-input-container"
              style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ccc",
              }}
            >
              <Input
                type="text"
                placeholder="Type your message"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="chatbot-input"
              />
              <Button
                type="primary"
                onClick={handleSendMessage}
                style={{ marginLeft: "10px" }}
              >
                Send
              </Button>
            </div>

            <Button
              type="link"
              className="clear-chat"
              onClick={() => setMessages([])}
              style={{ textAlign: "center", marginTop: "5px" }}
            >
              Clear Chat
            </Button>
          </div>
        </div>
      )}

      {/* new messages from here..... */}
    </div>
  );
};

export default AgentAppointment;
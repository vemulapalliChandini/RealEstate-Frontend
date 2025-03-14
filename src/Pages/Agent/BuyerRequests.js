














import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Modal,
  Empty,
  Pagination,
  Tooltip,
  Input,
  Skeleton,
} from "antd";

import {
  PhoneOutlined,
  CalendarFilled,
  HomeFilled,
  EnvironmentFilled,
  ClockCircleFilled,
  MessageOutlined,
} from "@ant-design/icons";

import { getSocket } from "../../Authentication/Socket"

import { jwtDecode } from "jwt-decode";

import Tabs from "./AppointmentTabs";
import { useTranslation } from "react-i18next";
import { _get, _put } from "../../Service/apiClient";
import { Select } from "antd";
import { Grid } from "antd";
import Chatbot from "../Chatbot";
const { useBreakpoint } = Grid;
const { Option } = Select;

// const socket = io("http://172.17.13.106:3000");

const BuyerRequests = ({ path }) => {
  const { t } = useTranslation();
  const [loading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [chatModal, setChatModal] = useState(false);
  const [curUser, setCurUser] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [curReceiver, setCurReceiver] = useState("");

  // const [userId] = useState("currentUserId");

  // const [userId, setUserId] = useState(null);

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
      setMessages((prevMessages) => [...prevMessages, message]);

      // If chat modal is closed, increment new message count

      // if (!chatModal) {
      // setNewMessagesCount((count) => count + 1);
      // }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chatModal]);

  useEffect(() => {
    if (chatModal && curReceiver) {
      const fetchMessages = async () => {
        try {
          const response = await _get(
            `/chat/getMessages/${localStorage.getItem("userId")}/${curReceiver}`
          );
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          } else {
            console.error("Fetched messages are not an array:", response.data);
            setMessages([]); // Reset to an empty array if the data is not valid
          }

          // console.log(response.data);
          // setMessages(response.data); // Set fetched messages
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [chatModal, curReceiver]); // Removed userId as it's not used in this hook

  useEffect(() => {
    const socket = getSocket(); 
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    // Avoid duplicate listeners
    // const handleReceiveMessage = (messageData) => {
    // console.log("Received message:", messageData);
    // setMessages((prevMessages) => [...prevMessages, messageData]);
    // };
    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => {
        // Check if the message already exists
        if (!prevMessages.some((msg) => msg.id === message.id)) {
          // Assuming each message has a unique 'id'
          return [...prevMessages, message];
        }
        return prevMessages; // Return the previous state if the message is a duplicate
      });
    };
    // {here is used for the duplicates }

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("Token"); // Assume token is stored in localStorage
    if (token) {
      try {
        console.log(" token is the -->", token);
        const decodedToken = jwtDecode(token);

        setUserId(decodedToken.user.userId); // Set userId from the token payload

        console.log("USER ID --> ", decodedToken.userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
        console.log(userId);
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (typedMessage.trim() !== "") {
      const messageData = {
        senderId: localStorage.getItem("userId"),
        receiverId: curReceiver,
        message: typedMessage.trim(),
        senderRole: 1,
      };

      console.log(messageData);

      // Emit message to the backend
      const socket = getSocket(); 
      socket.emit("send_message", messageData);

      // Update local state for instant UI feedback

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, senderId: localStorage.getItem("userId") },
      ]);
      setTypedMessage("");
    }
  };

  useEffect(() => {
    localStorage.setItem("form", false);
    fetchUserData(3);
  }, []);

  const [selectedStatus, setSelectedStatus] = useState("@");
  const [searchLocation, setSearchLocation] = useState("");
  const fetchUserData = async (status) => {
    setIsLoading(true);
    try {
      const response = await _get(`/booking/getbookingsbystatus/3/${status}`);
      setUsers(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  const updateBookingStatus = async (_id, status) => {
    const successMessage =
      status === 1
        ? "Accepted successfully"
        : status === -1
          ? "Rejected successfully"
          : "Updated successfully";
    try {
       await _put(
        `booking/updatebookingstatus/${_id}/${status}`,
        {},
        successMessage
      );
      fetchUserData(3);
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleYesClick = (userId, _id) => {
    updateBookingStatus(_id, 1);
  };

  const handleNoClick = (userId, _id) => {
    updateBookingStatus(_id, -1);
  };
  const screens = useBreakpoint();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleFilterChange = (value) => {
    setSelectedStatus(value);

    fetchFilteredData(
      searchLocation === "All" ? "@" : searchLocation,
      value === "All" ? "@" : value
    );
  };

  const handleSearchLocationChange = (value) => {
    setSearchLocation(value);

    fetchFilteredData(
      value === "All" ? "@" : value,
      selectedStatus === "All" ? "@" : selectedStatus
    );
  };

  const fetchFilteredData = async (name, status) => {
    let statusCode = 3;

    if (status.toLowerCase() === "accepted") {
      statusCode = 1;
    } else if (status.toLowerCase() === "rejected") {
      statusCode = -1;
    } else if (status.toLowerCase() === "booked") {
      statusCode = 2;
    }

    try {
      const nameFilter =
        name === "@" || name === "" || name === undefined ? "@" : name;
      const statusFilter = status === "" ? "@" : statusCode;

      const response = await _get(
        `booking/getbyfilters/3/${nameFilter}/${statusFilter}`
      );
      if (response.data && response.data.length > 0) {
        setUsers(response.data);
        setIsLoading(false);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setUsers([]);
    }
  };

  const targetCardRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
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

  const paginatedData = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (name && status) {
      fetchFilteredData(name, status);
    }
  }, [name, status]);

  const handleFetchFilteredData = (name, status) => {
    setName(name);
    setStatus(status);
  };
  const socket = getSocket(); 
  // for registertion

  const setConnection = () => {
    socket.emit("register_user", localStorage.getItem("userId"));
    setChatModal(!chatModal);
  };
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages) || []); // Ensure it's an array
    }
  }, []);
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  return (
    <div style={{ marginLeft: "20px" }} ref={targetCardRef}>
      <Chatbot onFetchFilteredData={handleFetchFilteredData} />
      <>
        <div
          style={{
            paddingRight: "20px",
          }}
        >
          {!screens.md ? (
            <Row>
              <Col xs={24} sm={16} style={{ marginBottom: "3%" }}>
                <Tabs />
              </Col>
              <Col xs={24} sm={8}>
                <Button
                  type="primary"
                  onClick={() => setFilterModalVisible(true)}
                >
                  {t("dashboard.openFilters")}
                </Button>
              </Col>
            </Row>
          ) : (
            <Row align="middle" gutter={[8, 0]}>
              <Col span={12}>
                <Tabs />
              </Col>
              <Col span={6}>
                <Select
                  placeholder={t("registration.Select District")}
                  onChange={handleSearchLocationChange}
                  style={{ width: "70%" }}
                >
                  <Option value="All">{t("dashboard.all")}</Option>
                  <Option value="Visakhapatnam">
                    {t("registration.Visakhapatnam")}
                  </Option>
                  <Option value="Vizianagaram">
                    {t("registration.Vizianagaram")}
                  </Option>
                  <Option value="Srikakulam">
                    {t("registration.Srikakulam")}
                  </Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  placeholder={t("dashboard.statusFilter")}
                  onChange={handleFilterChange}
                  style={{ width: "70%" }}
                >
                  <Option value="All">{t("dashboard.all")}</Option>
                  <Option value="Accepted">{t("dashboard.Accepted1")}</Option>
                  <Option value="Rejected">{t("dashboard.Rejected1")}</Option>
                </Select>
              </Col>
            </Row>
          )}
        </div>

        <Modal
          title={t("dashboard.openFilters")}
          open={filterModalVisible}
          onOk={() => setFilterModalVisible(false)}
          onCancel={() => setFilterModalVisible(false)}
          okText={"Ok"}
          cancelText={"Close"}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Select
                placeholder={t("registration.Select District")}
                onChange={handleSearchLocationChange}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Option value="All">{t("dashboard.all")}</Option>
                <Option value="Visakhapatnam">
                  {t("registration.Visakhapatnam")}
                </Option>
                <Option value="Vizianagaram">
                  {t("registration.Vizianagaram")}
                </Option>
                <Option value="Srikakulam">
                  {t("registration.Srikakulam")}
                </Option>
              </Select>
            </Col>
            <Col span={24}>
              <Select
                placeholder={t("dashboard.statusFilter")}
                onChange={handleFilterChange}
                style={{ width: "100%" }}
              >
                <Option value="All">{t("dashboard.all")}</Option>
                <Option value="Accepted">{t("dashboard.Accepted1")}</Option>
                <Option value="Rejected">{t("dashboard.Rejected1")}</Option>
              </Select>
            </Col>
          </Row>
        </Modal>
      </>
      <Row gutter={[16, 16]}>
        {users.length === 0 ? (
          <Col span={24} style={{ textAlign: "centre" }}>
            <Empty description={t("dashboard.NoAppointment")} />
          </Col>
        ) : users && users.length > 0 && (
          paginatedData.map((user) => (
            <Col
              key={user.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              style={{ marginBottom: "-2%" }}
            >
              <Card
                bordered={false}
                style={{
                  border: "1px solid #d4ebe8",
                  borderRadius: "8px",
                  padding: "16px",
                  position: "relative",
                  transition: "transform 0.3s ease-in-out",
                  backgroundColor: "rgba(159, 159, 167, 0.23)",
                  color: "#333",
                  marginTop: "30px",
                  textAlign: "center",
                  height: "90%",
                  cursor: "default",
                }}
                bodyStyle={{ padding: "10px 0", textAlign: "center" }}
                hoverable
                onClick={() => {
                  setUserId(user._id);
                }}
              >
                <MessageOutlined
                  style={{
                    float: "right",
                    color: "rgb(13,65,107) ",
                    fontSize: "20px",
                  }}
                  onClick={() => {
                    console.log("I am called");

                    setCurUser(user);
                    setCurReceiver(user.userId);
                    setConnection();
                  }}
                />

                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={user.profilePicture}
                    size={100}
                    style={{
                      borderRadius: "50%",
                      boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                      marginRight: "20px",
                    }}
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <b>{user.firstName}</b> <b>{user.lastName}</b>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <b>
                        <PhoneOutlined
                          style={{ marginRight: "5px", color: "#0d416b" }}
                        />
                      </b>{" "}
                      {formatPhoneNumber(user.phoneNumber)}

                    </div>
                  </div>
                </div>

                <div
                  style={{
                    lineHeight: "1.8",
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    textAlign: "start",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <CalendarFilled
                        style={{ marginRight: "5px", color: "#0d416b" }}
                      />
                    </b>{" "}
                    {formatDate(user.date)}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <ClockCircleFilled
                        style={{ marginRight: "5px", color: "#0d416b" }}
                      />
                    </b>{" "}
                    {formatTime(user.timing)}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <HomeFilled
                        style={{ marginRight: "5px", color: "#0d416b" }}
                      />
                    </b>{" "}
                    {user.propertyName}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <EnvironmentFilled
                        style={{ marginRight: "5px", color: "#0d416b" }}
                      />
                    </b>
                    {user.location}
                  </div>
                </div>

                {user.status === 0 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexDirection: "row",
                      }}
                    >
                      <div style={{ marginBottom: "40px" }}>
                        <button
                          style={{
                            background:
                              "#0D416B",
                            border: "none",
                            padding: "4px 10px",
                           
                            fontWeight: "bold",
                            position: "absolute",
                            transform: "translateX(-50%)",
                            borderRadius: "5px",
                            marginTop: "5%",
                            cursor: "pointer",
                            color:"white",
                          }}
                          onClick={() => handleYesClick(user.userId, user._id)}
                        >
                          {t("dashboard.Accept")}
                        </button>
                      </div>
                      <div style={{ marginBottom: "40px" }}>
                        <Button
                          type="danger"
                          style={{
                            color: "black",
                            background:
                              "lightgray",
                            border: "none",
                            padding: "4px 10px",
                            fontWeight: "bold",
                            position: "absolute",
                            transform: "translateX(-50%)",
                            borderRadius: "5px",
                            marginTop: "5%",
                            cursor: "pointer",
                          }}
                          onClick={() => handleNoClick(user.userId, user._id)}
                        >
                          {t("dashboard.Reject")}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : user.status === 1 ? (
                  <Tooltip
                    title={
                      <>
                        <strong>{t("dashboard.requestedOn")}</strong> <br></br>
                        {new Date(user.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                        <br />
                        {user.status !== 0 && (
                          <>
                            <strong>{t("dashboard.updatedOn")}</strong>{" "}
                            <br></br>
                            {new Date(user.updatedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </>
                        )}
                      </>
                    }
                  >
                    <div style={{ marginBottom: "40px" }}>
                      <button
                        type="primary"
                        style={{
                          background:
                            "#0D416B",
                          border: "none",
                          padding: "4px 10px",
                          fontWeight: "bold",
                          position: "absolute",
                          transform: "translateX(-50%)",
                          borderRadius: "5px",
                          marginTop: "5%",
                          cursor: "pointer",
                          color:"white",
                        }}
                      >
                        {t("dashboard.Accepted")}
                      </button>
                    </div>
                  </Tooltip>
                ) : user.status === -1 ? (
                  <Tooltip
                    title={
                      <>
                        <strong>{t("dashboard.requestedOn")}</strong> <br></br>
                        {new Date(user.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                        <br />
                        {user.status !== 0 && (
                          <>
                            <strong>{t("dashboard.updatedOn")}</strong>{" "}
                            <br></br>
                            {new Date(user.updatedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </>
                        )}
                      </>
                    }
                  >
                    <div style={{ marginBottom: "40px" }}>
                      <button
                        type="primary"
                        style={{
                          color: "black",
                          background:
                            "linear-gradient(135deg, #ff5252, #ff1744)",
                          border: "none",
                          padding: "4px 10px",
                          fontWeight: "bold",
                          position: "absolute",
                          transform: "translateX(-50%)",
                          borderRadius: "5px",
                          marginTop: "5%",
                          cursor: "pointer",
                        }}
                      >
                        {t("dashboard.Rejected")}
                      </button>
                    </div>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Card>
            </Col>
          ))
        )}
      </Row>
      {loading && (
        <div
          style={{ textAlign: "center", padding: "20px", width: "100%" }}
          className="content-container"
        >
          <Row
            className="cards-container"

            gutter={[24, 24]}
          >

            {[...Array(8)].map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                <Card className="card-item" hoverable>
                  <Skeleton
                    active
                    avatar={false}
                    paragraph={{ rows: 1, width: "100%" }}
                    title={{ width: "100%" }}
                    style={{
                      height: "200px", // Set a fixed height for the square shape
                      width: "100%",   // Ensure it takes up the full width of the card
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0", // Optional: for a background color
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <p>{t("dashboard.l3")}</p>
        </div>
      )}

      <Row style={{ marginTop: "3%", float: "right" }}>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={users.length}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={["8", "16", "24", "32"]}
        />


      </Row>



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
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "5px",
                    padding: "8px",
                    backgroundColor:
                      msg.senderId === localStorage.getItem("userId")
                        ? "#007bff"
                        : "black",
                    borderRadius: "5px",
                    color: "white",
                    alignSelf:
                      msg.senderId === localStorage.getItem("userId")
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  {/* {msg.senderId === userId ? "You: " : "Friend:g "} */}
                  {msg.message}
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "black",
                      marginTop: "5px",
                      // textAlign: isSentByUser ? "right" : "left",
                    }}
                  >
                    {" "}
                    {/* {new Date().toLocaleTimeString()} */}
                    <div style={{ color: "white" }}>
                      {" "}
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
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

      {/* new code from here... */}
    </div>
  );
};

export default BuyerRequests;









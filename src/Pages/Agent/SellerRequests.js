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
  Grid,
} from "antd";
import {
  FieldTimeOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { _get, _put } from "../../Service/apiClient";
import Tabs from "./AppointmentTabs";
import {  Select } from "antd";
import { useTranslation } from "react-i18next";
const { Option } = Select;
const { useBreakpoint } = Grid;

const SellerRequests = () => {
  const screens = useBreakpoint();
  const { t } = useTranslation();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    localStorage.setItem("form", false);
    fetchUserData(3);
  }, []);
  const [selectedStatus, setSelectedStatus] = useState("@");
  const [searchLocation, setSearchLocation] = useState("");

  const fetchUserData = async (status) => {
    try {
      const response = await _get(`/booking/getbookingsbystatus/2/${status}`);
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    // date.setSeconds(0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };
  const updateBookingStatus = async (_id, status) => {
    const successMessage = status === 1
      ? "Accepted successfully"
      : status === -1
        ? "Rejected successfully"
        : "Updated successfully";
    try {
     await _put(
        `booking/updatebookingstatus/${_id}/${status}`,
        {}, successMessage
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
 

  // const handleFilterChange = (value) => {
  //   setSelectedStatus(value);

  //   fetchFilteredData(
  //     searchLocation === "" ? "@" : searchLocation,
  //     value === "All" ? "@" : value
  //   );
  // };

  // const handleSearchLocationChange = (event) => {
  //   const value = event.target.value;
  //   setSearchLocation(value);
  //   console.log(value);

  //   fetchFilteredData(
  //     value === "" ? "@" : value,
  //     selectedStatus === "All" ? "@" : selectedStatus
  //   );
  // };
  const handleFilterChange = (value) => {
    setSelectedStatus(value);

    fetchFilteredData(
      searchLocation === "All" ? "@" : searchLocation,
      value === "All" ? "@" : value
    );
  };

  const handleSearchLocationChange = (value) => {
    setSearchLocation(value);
    console.log(value);

    fetchFilteredData(
      value === "All" ? "@" : value,
      selectedStatus === "All" ? "@" : selectedStatus
    );
  };

  const fetchFilteredData = async (name, status) => {
    console.log("Selected Name:", name);
    console.log("Selected Status:", status);

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
        `/booking/getbyfilters/2/${nameFilter}/${statusFilter}`
      );
      if (response.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        setUsers([]);
        console.log("No matching data found.");
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
      <>
        <div
          style={{
            // marginTop: screens.xs ? "45px" : "30px",
            paddingRight: "20px",
          }}
        >
          {!screens.md ? (
            <Row gutter={[70, 0]}>
              <Col xs={24} sm={12} md={12} style={{ marginBottom: "3%" }}>
                {/* <Select
                  defaultValue={t("dashboard.Buyer Requests")}
                  style={{ width: "200px", marginBottom: "10px" }}
                >
                  <Option value="buyer">{t("dashboard.Buyer Requests")}</Option>
                  <Option value="seller">
                    {t("dashboard.Seller Requests")}
                  </Option>
                </Select> */}
                <Tabs />
              </Col>
              <Col xs={24} sm={12} md={12}>
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

        {/* Modal for Filters */}
        <Modal
          title={t("dashboard.openFilters")}
          visible={filterModalVisible}
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
        {users && users.length > 0 ? (
          paginatedData.map((user) => (
            <Col key={user.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card
                bordered={false}
                style={{
                  border: "1px solid #d4ebe8",
                  borderRadius: "8px",
                  padding: "16px",
                  position: "relative",
                  transition: "transform 0.3s ease-in-out",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  backgroundColor: "#fff",
                  color: "#333",
                  marginTop: "30px",
                  textAlign: "center",
                }}
                bodyStyle={{ padding: "20px 0", textAlign: "center" }}
                hoverable
               
              >
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={user.profilePicture}
                    size={120}
                    style={{
                      borderRadius: "50%",
                      border: "4px solid #ffffff",
                      boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                      marginTop: "50px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
                <div
                  style={{
                    lineHeight: "1.8",
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>{user.firstName}</b> <b>{user.lastName}</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <PhoneOutlined /> {t("dashboard.Phone")}:
                    </b>{" "}
                    {formatPhoneNumber(user.phoneNumber)}

                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <CalendarOutlined /> {t("dashboard.date")}:
                    </b>{" "}
                    {formatDate(user.date)}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>
                      <FieldTimeOutlined /> {t("dashboard.time")}:
                    </b>{" "}
                    {formatTime(user.timing)}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>{t("dashboard.property")}:</b> {user.propertyName}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <b>{t("dashboard.Location")}:</b> {user.location}
                  </div>
                </div>
                {user.status === 0 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "30px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        style={{
                          background:
                            "linear-gradient(135deg, #00c853, #b2ff59)",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "7px",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleYesClick(user.userId, user._id)}
                      >
                        Accept
                      </button>
                      <Button
                        type="danger"
                        style={{
                          backgroundColor: "white",
                          borderColor: "black",
                        }}
                        onClick={() => handleNoClick(user.userId, user._id)}
                      >
                        Reject
                      </Button>
                    </div>
                    {/* <div
                      style={{
                        background: "linear-gradient(135deg, #6253e1, #04befe)",
                        color: "white",
                        border: "none",
                        borderRadius: "7px",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        marginBottom: "10px", 
                        padding: "2px 2px",
                      }}
                    >
                      <button
                        style={{
                          background: "transparent", // Button background matches the container's gradient
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => showAppointmentModal(user)}
                      >
                        Schedule
                      </button>
                    </div> */}
                  </>
                ) : user.status === 1 ? (
                  <button
                    type="primary"
                    style={{
                      marginTop: "10px",
                      background: "linear-gradient(135deg, #00c853, #b2ff59)", // Gradient green color
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "7px",
                      fontWeight: "bold",
                    }}
                  >
                    Accepted
                  </button>
                ) : user.status === -1 ? (
                  <button
                    type="primary"
                    style={{
                      marginTop: "10px",
                      background: "linear-gradient(135deg, #ff5252, #ff1744)", // Gradient red color
                      border: "none",
                      padding: "4px 10px",
                      borderRadius: "7px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Rejected
                  </button>
                ) : (
                  <></>
                )}
                {/*  user.status === 2 ? (
                   <>
                     <Popover
                      content={
                        detailsVisible[user.userId] ? (
                          <div>
                            <div>
                              <b>Time: </b>
                              {formatTime(detailsVisible[user.userId].timing)}
                            </div>
                            <div>
                              <b>Date: </b>
                              {new Date(
                                detailsVisible[user.userId].date
                              ).toLocaleDateString("en-CA")}
                            </div>
                            <div>
                              <b>Location: </b>
                              {detailsVisible[user.userId].location}
                            </div>
                          </div>
                        ) : (
                          <div>No details available</div>
                        )
                      }
                      title="Booked Details"
                      trigger="click"
                    >
                      <button
                        style={{
                          marginTop: "10px",
                          background:
                            "linear-gradient(135deg, #6253e1, #04befe)", // Button background matches the container's gradient
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "7px",
                          fontWeight: "bold",

                          border: "none",
                        }}
                        onClick={() => toggleDetails(user.userId, user.agentId)}
                      >
                        View Booked Details
                      </button>
                    </Popover>
                  </>
                ) : null */}
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "centre" }}>
            <Empty description={t("dashboard.NoAppointment")} />
          </Col>
        )}
      </Row>
      {paginatedData.length > 6 && (
        <Row align="middle" style={{ margin: "20px 0" }}>
          <Col>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={users.length}
              onChange={handlePaginationChange}
              showSizeChanger
              pageSizeOptions={["8", "16", "24", "32"]}
            />
          </Col>
        </Row>
      )}
      {/* <Modal
        visible={isAppointmentModalVisible}
        title="Book Appointment"
        onCancel={handleCancel}
        footer={null}
      >
        {selectedSeller && (
          <SellerAppointmentForm
            seller={selectedSeller}
            onSubmit={handleAppointmentSubmit(selectedSeller._id)}
            onClose={handleCancel}
          />
        )}
      </Modal> */}
    </div>
  );
};

export default SellerRequests;

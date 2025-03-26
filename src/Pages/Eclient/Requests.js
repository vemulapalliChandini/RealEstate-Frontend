import React, { useEffect, useState,useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Tooltip,
  Avatar,
  Pagination,
  Select,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentFilled,
  HomeFilled,
  ClockCircleFilled,
  CalendarFilled,
} from "@ant-design/icons";
import {  _get} from "../../Service/apiClient";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const Requests = () => {
  const [filteredData, setFilteredData] = useState(null);
  const { t } = useTranslation();
  const [requests, setRequests] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchLocation, setSearchLocation] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await _get("emBooking/getAllClientRequests");
      console.log(response.data);
      setRequests(response.data);
      setFilteredData(response.data);
      fetchFilteredData(searchLocation, selectedStatus, response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }, [searchLocation, selectedStatus]); // Dependencies
  
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]); 
  const handleFilterChange = (value) => {
    setSelectedStatus(value);
    fetchFilteredData(searchLocation, value, requests);
  };

  const handleSearchLocationChange = (value) => {
    setSearchLocation(value);
    fetchFilteredData(value, selectedStatus, requests);
  };

  const fetchFilteredData = async (location, status, data) => {
    let filtered = data;

    if (location === "all") {
      filtered = data;
    } else if (location === "visakhapatnam") {
      filtered = data.filter((prop) =>
        prop.location.toLowerCase().includes("visakhapatnam")
      );
    } else if (location === "vizianagaram") {
      filtered = data.filter((prop) =>
        prop.location.toLowerCase().includes("vizianagaram")
      );
    } else if (location === "srikakulam") {
      filtered = data.filter((prop) =>
        prop.location.toLowerCase().includes("srikakulam")
      );
    }

   if (status === "accepted") {
      filtered = filtered.filter((prop) => prop.status === 1);
    } else if (status === "rejected") {
      filtered = filtered.filter((prop) => prop.status === -1);
    } else if (status === "pending") {
      filtered = filtered.filter((prop) => prop.status === 0);
    }
    setFilteredData(filtered);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

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

  const paginatedRequests = filteredData
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const onPageChange = (page) => {
    setCurrentPage(page);
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


  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{
          padding: "0px 10px 10px 10px",
        }}
      >
        {requests === null ? (
          <div
            style={{ textAlign: "center", padding: "20px", width: "100vw" }}
            className="content-container"
          >
            <Spin size="large" style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // This centers the loader
            }} />
            <p>Loading Requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <Col
            span={24}
            style={{ textAlign: "center" }}
            className="content-container"
          >
            <Empty description="No Requests found!" />
          </Col>
        ) : (
          <>
            <Col span={24}>
              <Row>
                <Col span={12}>
                  <span>Location:</span>
                  <Select
                    placeholder={t("registration.Select District")}
                    onChange={handleSearchLocationChange}
                    style={{ width: "50%" }}
                  >
                    <Option value="all">{t("dashboard.all")}</Option>
                    <Option value="visakhapatnam">
                      {t("registration.Visakhapatnam")}
                    </Option>
                    <Option value="vizianagaram">
                      {t("registration.Vizianagaram")}
                    </Option>
                    <Option value="srikakulam">
                      {t("registration.Srikakulam")}
                    </Option>
                  </Select>
                </Col>
                <Col span={12}>
                  <span>Status:</span>
                  <Select
                    placeholder={t("dashboard.statusFilter")}
                    onChange={handleFilterChange}
                    style={{ width: "50%" }}
                  >
                    <Option value="all">{t("dashboard.all")}</Option>
                    <Option value="pending">{t("dashboard.Pending1")}</Option>
                    <Option value="accepted">{t("dashboard.Accepted1")}</Option>
                    <Option value="rejected">{t("dashboard.Rejected1")}</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            {paginatedRequests.length === 0 ? (
              <Col
                span={24}
                style={{ textAlign: "center" }}
                className="content-container"
              >
                <Empty description="No Requests found, Please select other filters" />
              </Col>
            ) : (
              paginatedRequests.map((property, index) => (
                <Col
                  key={property._id}
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
                      backgroundColor: "#e6f2ff",
                      color: "#333",
                      marginTop: "30px",
                      textAlign: "center",
                      height: "90%",
                      cursor: "default",
                    }}
                    bodyStyle={{ padding: "10px 0", textAlign: "center" }}
                    hoverable
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={property.profilePicture}
                        size={100}
                        style={{
                          borderRadius: "50%",
                          boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                          marginRight: "20px",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "5px",
                          }}
                        >
                          <b>{property.firstName}</b> <b>{property.lastName}</b>
                        </div>
                        <div
                          style={{ display: "flex", alignItems: "baseline" }}
                        >
                          <b>
                            <PhoneOutlined
                              style={{ marginRight: "5px", color: "#0d416b" }}
                            />
                          </b>{" "}
                          {formatPhoneNumber(property.phoneNumber)}

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
                        {formatDate(property.date)}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <b>
                          <ClockCircleFilled
                            style={{ marginRight: "5px", color: "#0d416b" }}
                          />
                        </b>{" "}
                        {formatTime(property.timing)}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <b>
                          <HomeFilled
                            style={{ marginRight: "5px", color: "#0d416b" }}
                          />
                        </b>{" "}
                        {property.estate?.landDetails.landTitle}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          height: "40px",
                        }}
                      >
                        <b>
                          <EnvironmentFilled
                            style={{ marginRight: "5px", color: "#0d416b" }}
                          />
                        </b>
                        {property.location}
                      </div>
                    </div>

                    {property.status === 0 ? (
                      <Tooltip
                        title={
                          <>
                            <strong>{t("dashboard.requestedOn")}</strong>{" "}
                            <br></br>
                            {new Date(property.createdAt).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                            <br />
                            {property.status !== 0 && (
                              <>
                                <strong>{t("dashboard.updatedOn")}</strong>{" "}
                                <br></br>
                                {new Date(property.updatedAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </>
                            )}
                          </>
                        }
                      >
                        <div style={{ marginBottom: "40px" }}>
                          <button
                            type="primary"
                            style={{
                              background: "orange",
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
                            {t("dashboard.Pending")}
                          </button>
                        </div>
                      </Tooltip>
                    ) : property.status === 1 ? (
                      <Tooltip
                        title={
                          <>
                            <strong>{t("dashboard.requestedOn")}</strong>{" "}
                            <br></br>
                            {new Date(property.createdAt).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                            <br />
                            {property.status !== 0 && (
                              <>
                                <strong>{t("dashboard.updatedOn")}</strong>{" "}
                                <br></br>
                                {new Date(property.updatedAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
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
                                "linear-gradient(135deg, #00c853, #b2ff59)",
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
                            {t("dashboard.Accepted")}
                          </button>
                        </div>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          <>
                            <strong>{t("dashboard.requestedOn")}</strong>{" "}
                            <br></br>
                            {new Date(property.createdAt).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                            <br />
                            {property.status !== 0 && (
                              <>
                                <strong>{t("dashboard.updatedOn")}</strong>{" "}
                                <br></br>
                                {new Date(property.updatedAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </>
                            )}
                          </>
                        }
                      >
                        <div style={{ marginBottom: "40px" }}>
                          <button
                            type="primary"
                            style={{
                              color: "white",
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
                    )}
                  </Card>
                </Col>
              ))
            )}
          </>
        )}
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
            pageSize={pageSize}
            total={requests ? requests.length : 0}
            onChange={onPageChange}
            showSizeChanger={false}
            hideOnSinglePage={true}
          />
        </div>

      </Row>

     
    </>
  );
};

export default Requests;

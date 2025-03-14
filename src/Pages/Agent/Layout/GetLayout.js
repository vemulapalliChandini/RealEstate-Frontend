import {
  Card,
  Col,
  InputNumber,
  Pagination,
  Row,
  Empty,
  Tooltip,
  Skeleton,
  Form,
  Modal, Input, DatePicker, Table
} from "antd";
import showMessage from "../../../MessageHandler";

import React, { useEffect, useRef, useState } from "react";
import "./Arrow.css";
import {
  UserOutlined,
  EditFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  AppstoreOutlined,
  EnvironmentOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import "./LayoutStyles/GetLayout.css";
import ShowModal from "../ShowModal";
import { useTranslation } from "react-i18next";
import { _get, _post, _put } from "../../../Service/apiClient.js";
import moment from "moment";


const GetLayout = ({ path, filters, filters1 }) => {

  const { t } = useTranslation();
  const targetCardRef = useRef(null);
  const [rating] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [selectedProperty1, setSelectedProperty1] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sold, setSold] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [propId, setPropId] = useState("");
  const [searchText] = useState(["", "", ""]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState();
  const [pageSize, setPageSize] = useState(6);
  const [plotCount, setPlotCount] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [maxfromAPI, setMaxPriceAPI] = useState(1000000);
  // const [maxsize, setMaxSize] = useState(100000);
  // const [sliderRangesize, setSliderRangesize] = useState([0, 100000]);
  // const [maxsizefromAPIvalue, setMaxSizeAPIvalue] = useState(100000);
  const [propertyName] = useState("");
  const [auctionData, setAuctionData] = useState(null);
  const [isAuctionModalVisible, setIsAuctionModalVisible] = useState(false);
  const [isAuctionViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const handleCheckClick = (propertyId, propertyType, backcount) => {
    if (showTooltip) return;

    if (plotCount == null || plotCount === undefined) {
      alert("hiii");
    } else if (plotCount === 0) {
      setIsChanged(false);
      handleSellingStatus(propertyId, propertyType, 0);
    } else {
      handlePlotsChange(propertyId, backcount);
    }
  };
  const calculateInitialBid1 = (totalPrice) => {
    const baseBid = 5000; // Initial bid is ₹5,000
    const increment = 5000; // Increment by ₹5,000
    const bidLevel = Math.floor(totalPrice / 2500000); // Calculate how many times ₹25,00,000 fits into totalPrice
    return baseBid + (bidLevel * increment);
  };
  const [form] = Form.useForm();
  const handleCloseClick = () => {
    setShowTooltip(false);
    if (!showTooltip) {
      setIsChanged(!isChanged);
    }
  };
  const columns = [
    {
      title: 'Buyer Name',
      dataIndex: 'buyerName',
      key: 'buyerName',
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      render: (text) => `₹${text}`,
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
  ];

  const dataSource = auctionData?.buyers.map((buyer, index) => ({
    key: index,
    buyerName: buyer.buyerName,
    bidAmount: buyer.bidAmount,
  }));
  const handleOk = async () => {
    try {
      // Validate form fields before proceeding
      const values = await form.validateFields();

      const payload = {
        startDate: values.startDate, // Format date to string
        endDate: values.endDate, // Format date to string
        amount: values.amount,
        propertyId: selectedProperty1._id,
        agentId: selectedProperty1.agentId,
        auctionStatus: "active",
      };

      console.log("Payload:", payload);

      const res = await _post(
        "/auction/postAuction",
        payload,
        "Auction Started Successfully!",
        "Failed to Start Auction."
      );

      if (res?.status === 200 || res?.status === 201) {
        // Reset form fields after successful submission
        form.resetFields();
        fetchData();
        setIsAuctionModalVisible(false);
      } else {
        console.log("Error submitting form");
      }
    } catch (error) {
      console.log("Error submitting form:", error);

    }
  };
  const handleCancel = () => {
    setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
    setSelectedProperty1(null);
  };
  const handleFine = () => {
    // setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
    setSelectedProperty1(null);
  };
  const formatPrice = (price) => {
    if (price >= 1_00_00_000) {
      return (price / 1_00_00_000).toFixed(1) + "Cr"; // Convert to Crores
    } else if (price >= 1_00_000) {
      return (price / 1_00_000).toFixed(1) + "L"; // Convert to Lakhs
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1) + "k"; // Convert to Thousands
    } else {
      return price.toString(); // Display as is for smaller values
    }
  };
  useEffect(() => {
    maxsizefromAPI();
    fetchData();
    // fetchVillages();
    // maxPricefromAPI();
  }, [sold, rating, plotCount, filters, filters1]);

  // const maxPricefromAPI = async () => {
  //   try {
  //     const response = await _get("property/maxPrice/layout/@/@/@/@/@");
  //     const data = await response.data.maxPrice;
  //     // setMaxPrice(data);
  //     // setMaxPriceAPI(data);
  //     // setSliderRange([0, data]);
  //   } catch (error) {
  //     console.error("Error fetching village data:", error);
  //   }
  // };
  // const fetchVillages = async () => {
  //   try {
  //     const response = await _get("/location/getallvillages");
  //     const data = await response.data;

  //     const uniqueVillages = [...new Set(data)];
  //     setVillageList(uniqueVillages);
  //     setFilteredVillages(uniqueVillages);
  //   } catch (error) {
  //     console.error("Error fetching village data:", error);
  //   }
  // };
  let data2;
  const fetchLocation = async () => {
    try {
      let type = "";

      let searchText = "";
      if (filters !== undefined) {
        searchText = filters.searchText;
      } else {
        searchText = filters1.searchText;
      }
      if (searchText === null) {
        searchText = "all";
      }
      if (path === "getlayouts") {
        type = localStorage.getItem("mtype");
        const response = await _get(
          `/property/mypropslocation/${type}/${searchText}`
        );
        data2 = response.data;
      } else {
        type = localStorage.getItem("type");
        const response = await _get(`/property/location/${type}/${searchText}`);
        data2 = response.data;
      }
    } catch (error) {
      setFilteredData("");
    }
  };
  const fetchData = async () => {
    try {
      const response = await _get(`/layout/${path}`);
      console.log(response.data);
      setData(response.data);
      setFilteredData(response.data);
      applyFilters(
        checkedValues,
        searchText,
        priceRange,
        sizeRange,
        propertyName,
        response.data,

      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleCardClick = (property) => {
    setPropertyId(property._id);
    setSelectedProperty(property);
    setIsModalVisible(true);
  };

  const handleSellingStatus = async (id, type, status) => {
    let finalObject = {
      propertyId: id,
      propertyType: type,
      status: status === 0 ? 1 : 0,
    };
    try {
      await _put(
        "/property/markassold",
        finalObject,
        status === 0 ? "Marked as Sold" : "Marked as UnSold",
        "Action Failed"
      );

      fetchData();
      setSold(!sold);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProperty(null);
  };

  const handlePlotsChange = async (pid, basic_count) => {
    if (0 < plotCount && plotCount < basic_count) {
      try {
        await _put(
          "/layout/update",
          {
            availablePlots: plotCount,
            propertyId: pid,
          },
          "Plot Count submitted successfully",
          "Submission Failed"
        );
        fetchData();
      } catch (error) {
        console.error(error);
      }
    } else if (basic_count <= plotCount) {
      showMessage(
        "warning",
        "Plot count cannot be greater than the available value and unwanted characters are not allowed."
      );
    } else {
      showMessage("warning", "unwanted characters");
    }
  };

  const [checkedValues] = useState(["sold", "unSold"]);

  const applyFilters = async (
    checkedValues,
    searchText,
    priceRange,
    sizeRange,
    propertyName,
    data
  ) => {
    if (filters != null) {
      checkedValues = filters.checkedValues;
      searchText = filters.searchText;
      priceRange = filters.priceRange;
      sizeRange = filters.sizeRange;
      propertyName = filters.propertyName;
    }
    if (filters1 != null) {
      checkedValues = filters1.checkedValues;
      searchText = filters1.searchText;
      priceRange = filters1.priceRange;
      sizeRange = filters1.sizeRange;
      propertyName = filters1.propertyName;
    }
    let nameSearch2 = propertyName ? propertyName.toLowerCase() : "";
    const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name

    if (searchText !== "") {
      await fetchLocation();
      data = data2;
    }
    console.log("datasss", data);
    let filtered = Array.isArray(data) ? data : [];
    console.log("filyet", filtered);
    if (checkedValues.length === "All") {
      setFilteredData(data);
      return;
    }
    if (checkedValues === "All") {
      filtered = data;
    } else if (checkedValues === "Sold") {
      filtered = data.filter((property) => property.status === 1);
    } else if (checkedValues === "Unsold") {
      filtered = data.filter((property) => property.status === 0);
    }

    if (priceRange) {
      filtered = filtered.filter(
        (property) =>
          Number(property.layoutDetails.totalAmount) >= priceRange[0] &&
          Number(property.layoutDetails.totalAmount) <= priceRange[1]
      );
    }

    if (sizeRange) {
      filtered = filtered.filter(
        (property) =>
          Number(property.layoutDetails.plotSize) >= sizeRange[0] &&
          Number(property.layoutDetails.plotSize) <= sizeRange[1]
      );
    }

    if (nameSearch2 !== "") {
      filtered = filtered.filter((property) => {
        console.log("propertyId:", property.propertyId);
        console.log("layoutTitle:", property.layoutDetails.layoutTitle);

        const nameMatch2 = isPropertyIdSearch
          ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
          : property.layoutDetails.layoutTitle && property.layoutDetails.layoutTitle.toLowerCase().includes(nameSearch2);

        console.log("nameMatch2:", nameMatch2); // Logs the match result
        return nameMatch2;
      });
    }

    setFilteredData(filtered);
    localStorage.setItem("isLoading", false);
  };
  const [priceRange] = useState([0, Infinity]);
  const [sizeRange, setSizeRange] = useState(0, Infinity);
  const handleInputChange = (value, totalcount) => {
    setPlotCount(value);

    if (value > totalcount || isNaN(value) || value < 0) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };
  const handlePaymentSuccess = async () => {
    await fetchData(); // Fetch data first
  };

  useEffect(() => {
    if (propertyId && data.length > 0) {
      const updatedProperty = data.find((prop) => prop._id === propertyId);
      console.log("updatedProperty", updatedProperty);
      if (updatedProperty) {
        setSelectedProperty(updatedProperty);
      }
    }
  }, [data, propertyId]);
  const handleStartAuction = (property) => {
    setIsModalVisible(false);
    setSelectedProperty1(property);

    setIsAuctionModalVisible(true);

    let totalAmount = property.layoutDetails.totalAmount;

    const maxBidAmount = calculateInitialBid1(totalAmount);
    // const maxBidAmount = totalAmount * 0.1; 
    console.log("Max allowed bid amount:", maxBidAmount);

    form.setFieldsValue({
      amount: maxBidAmount, // Set the initial bid amount
    });
  };
  const handleViewAuction = (property) => {
    console.log("proep", property);
    setAuctionData(property.auctionData);
    setIsAuctionViewModalVisible(true);
  };
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

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const maxsizefromAPI = async () => {
    try {
      const first = checkedValues.includes("sold") ? "sold" : "@";
      const second = checkedValues.includes("unSold") ? "unsold" : "@";
      const response = await _get(
        `property/maxSize/layout/@/@/@/@/@/${first}/${second}`
      );
      const data = await response.data.maxSize;

      // setMaxSize(data);
      // setMaxSizeAPIvalue(data);
      // setSliderRangesize([0, data]);
      setSizeRange([0, data]);
    } catch (error) {
      console.error("Error fetching village data:", error);
    }
  };

  return (
    <div ref={targetCardRef}>
      {data !== null ? (
        data.length !== 0 ? (
          <>
            {checkedValues.length === 0 ? (
              <h2>Please select atleast one option</h2>
            ) : filteredData.length === 0 ? (
              <Col
                span={24}
                style={{ textAlign: "centre" }}
                className="content-container"
              >
                <Empty description="No Properties found, Please select other filters" />
              </Col>
            ) : (
              <>
                <Row gutter={[16, 16]} className="row2">
                  {paginatedData.map((property) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                      key={property._id}
                      style={{ marginBottom: "16px" }}
                    >
                      <Card
                        hoverable
                        className={property.status === 1 ? "card-overlay" : "card-item"}
                        title={
                          path === "getlayouts" &&
                          ` ${property.layoutDetails.layoutTitle} (${property.propertyId})`
                        }
                        style={{
                          width: "97%",
                          padding: path === "getlayouts" && "5px",
                          margin: 0,
                          boxShadow:
                            path !== "getlayouts" && "#c3e3f7 0px 5px 10px",
                          border: property.status !== 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 0 }}
                        // onClick={() => handleCardClick(property)}
                        extra={
                          path === "getlayouts" && property.status === 0 ? (
                            <button
                              style={{
                                color: property.status === 0 ? "green" : "red",
                                flexWrap: "wrap",
                                float: "right",
                                width: "100%",
                                fontSize: "10px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSellingStatus(
                                  property._id,
                                  property.propertyType,
                                  property.status
                                );
                              }}
                            >
                              Mark as Sold
                            </button>
                          ) : (
                            property.status === 1 &&
                            path === "getlayouts" && (
                              <span>
                                <button
                                  style={{
                                    color:
                                      property.status === 0 ? "green" : "red",
                                    flexWrap: "wrap",
                                    float: "right",
                                    width: "100%",
                                    fontSize: "10px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSellingStatus(
                                      property._id,
                                      property.propertyType,
                                      property.status
                                    );
                                  }}
                                >
                                  Mark as unsold
                                </button>
                              </span>
                            )
                          )
                        }
                      >
                        <Row gutter={[16, 16]} style={{ marginBottom: "2%" }}>
                          <Col span={24}>
                            {path !== "getlayouts" && (
                              <div
                                style={{
                                  position: "absolute",

                                  left: "7px",
                                  background: "rgba(235, 245, 252, 0.9)",
                                  color: "rgb(13,65,107)",
                                  fontWeight: "bold",
                                  padding: "5px 10px",
                                  borderRadius: "4px",
                                }}
                              >
                                {property.layoutDetails.layoutTitle} ({property.propertyId})
                              </div>
                            )}

                            {property.uploadPics.length !== 0 ? (
                              <img
                                alt="property"
                                src={property.uploadPics[0]}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <img
                                alt="property"
                                src={
                                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcO3D8RCAO_oSv5LS0twSOrcIccJOiv40RKg&s"
                                }
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                        <div style={{ padding: "15px" }}>
                          <Row style={{ marginTop: "10px" }}>
                            <Col
                              span={12}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <AppstoreOutlined className="GlobalOutlined" />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {property.layoutDetails.plotSize}{" "}
                                <small>{property.layoutDetails.sizeUnit}</small>
                              </span>
                            </Col>
                            <Col
                              span={12}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {" "}
                                ₹{" "}
                                {formatPrice(
                                  property.layoutDetails.totalAmount
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              span={12}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <UserOutlined className="GlobalOutlined" />{" "}
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {property.ownerDetails?.ownerName}
                              </span>
                            </Col>
                            <Col
                              span={12}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <EnvironmentOutlined className="GlobalOutlined" />{" "}
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {property.layoutDetails.address?.village}
                              </span>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: "3%" }}>
                            <Col
                              lg={path !== "getlayouts" ? 12 : 24}
                              md={24}
                              xs={path !== "getlayouts" ? 12 : 24}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <>
                                {path !== "getlayouts" ? (
                                  <span
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <UnorderedListOutlined
                                      style={{
                                        fontSize: "12px",
                                        marginRight: "3px",
                                      }}
                                    />
                                    <span
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "100%",
                                        display: "block",
                                        textAlign: "center",
                                        marginRight: "3px",
                                      }}
                                    >
                                      Available Plots:
                                    </span>
                                    {property.layoutDetails.availablePlots}
                                  </span>
                                ) : (
                                  <>
                                    <span>Available Plots: </span>

                                    <Tooltip
                                      overlayInnerStyle={{
                                        backgroundColor: "white",
                                        color: "red",
                                      }}
                                      visible={
                                        showTooltip && propId === property._id
                                      }
                                      title={
                                        plotCount >
                                        property.layoutDetails.plotCount &&
                                        "Plot count cannot exceed available plots!"
                                      }
                                      placement="top"
                                    >
                                      <InputNumber
                                        id="plotInput"
                                        style={{ marginLeft: "2%" }}
                                        PropId
                                        min={0}
                                        value={
                                          property.layoutDetails.availablePlots
                                        }
                                        disabled={
                                          isChanged
                                            ? propId === property._id
                                              ? false
                                              : true
                                            : true
                                        }
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                        onChange={(value) =>
                                          handleInputChange(
                                            value,
                                            property.layoutDetails.plotCount,
                                            property._id
                                          )
                                        }
                                      />
                                    </Tooltip>
                                  </>
                                )}
                              </>
                              {!isChanged &&
                                property.status === 0 &&
                                path === "getlayouts" ? (
                                <span
                                  key={property._id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsChanged(!isChanged);
                                    setPropId(property._id);
                                  }}
                                  className="spanTag"
                                >
                                  <EditFilled
                                    visible={property.status === 0 ? true : false}
                                    style={{ fontSize: "16px" }}
                                    onClick={() => {
                                      setPropId(property._id);
                                      setPlotCount(
                                        property.layoutDetails.availablePlots
                                      );
                                    }}
                                  />
                                </span>
                              ) : propId === property._id &&
                                property.status === 0 ? (
                                <span
                                  key={property._id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsChanged(!isChanged);
                                  }}
                                  className="spanTag"
                                >
                                  {!showTooltip &&
                                    plotCount !== null &&
                                    property.status === 0 && (
                                      <CheckCircleFilled
                                        visible={
                                          property.status === 0 ? true : false
                                        }
                                        onClick={() => {
                                          setPropId(null);
                                          handleCheckClick(
                                            property._id,
                                            property.propertyType,
                                            property.layoutDetails.plotCount
                                          );
                                        }}
                                        className="checkCircleFilled"
                                      />
                                    )}
                                  {property.status === 0 && (
                                    <CloseCircleFilled
                                      visible={
                                        property.status === 0 ? true : false
                                      }
                                      onClick={() => {
                                        setPropId(null);
                                        handleCloseClick();
                                      }}
                                      className="checkCircleFilled"
                                    />
                                  )}
                                </span>
                              ) : (
                                property.status === 0 &&
                                path === "getlayouts" && (
                                  <span
                                    key={property._id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsChanged(!isChanged);
                                      setPropId(property._id);
                                    }}
                                    className="spanTag"
                                  >
                                    <EditFilled
                                      visible={
                                        property.status == 0 ? true : false
                                      }
                                      style={{ fontSize: "16px" }}
                                      onClick={() => {
                                        setPropId(property._id);
                                        setPlotCount(
                                          property.layoutDetails.availablePlots
                                        );
                                      }}
                                    />
                                  </span>
                                )
                              )}
                            </Col>
                            </Row>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginRight: "5%" }}>
                                {path === "getlayouts" && (
                                  <>
                                    <button
                                      style={{
                                        background: property.auctionStatus === "active" ? "#A9A9A9" : "#0D416B",
                                        color: property.auctionStatus === "active" ? "black" : "white",

                                        border: "none",
                                        borderRadius: "7px",
                                        marginTop: "4%",
                                        marginBottom: "4%",
                                        width: "98px",
                                        padding: "4px",
                                        cursor: property.auctionStatus === "active" ? "not-allowed" : "pointer",
                                        opacity: property.auctionStatus === "active" ? 0.6 : 1,
                                      }}
                                      onClick={(e) => {
                                        if (property.auctionStatus !== "active") {
                                          handleStartAuction(property, e);
                                        }
                                      }}
                                      disabled={property.auctionStatus === "active"}
                                    >
                                      Start Auction
                                    </button>
                                  {property.auctionData && (
                                    <button
                                      style={{
                                        background: "#0D416B",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "7px",
                                        marginTop: "4%",
                                        marginBottom: "4%",
                                        width: "170px",
                                        // padding: "10px 20px",
                                      }}
                                      onClick={(e) => handleViewAuction(property, e)}
                                    >
                                      View Auction Details
                                    </button>)}
                                  </>
                                )}
                                <button
                                 style={{
                                  background: "#0D416B",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "7px",
                                  marginTop: "4%",
                                  marginBottom: "4%",
                                  width: "100px",
                                  marginLeft: path !== "getlayouts" ? "10%" : "0",  // Conditionally add marginLeft
                                }}

                                  onClick={() => handleCardClick(property)}
                                >
                                  View More
                                </button>
                              </div>

                          
                    
                        </div>
                        {/* )} */}

                      </Card>
                    </Col>
                  ))}
                </Row>
                {filteredData.length > 6 && (
                  <Row style={{ margin: "20px 0", float: "right" }}>
                    <Col>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  </Row>
                )}
              </>
            )}
          </>
        ) : (
          <h2>{t("dashboard.e1")}</h2>
        )
      ) : (
        <div
          style={{ textAlign: "center", padding: "20px" }}
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
          {path === "getlayouts" ? (
            <p>{t("dashboard.l1")}</p>
          ) : (
            <p>{t("dashboard.l2")}</p>
          )}
        </div>
      )}
      <Modal
        title="Set Auction Details"
        visible={isAuctionModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Start Auction"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select a start date!" }]}
              >
                <DatePicker style={{ width: "100%" }}   disabledDate={(current) => current && current < moment().startOf('day')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "Please select an end date!" }]}
              >
                <DatePicker style={{ width: "100%" }}   disabledDate={(current) => current && current < moment().startOf('day')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Initial Bid"
            name="amount"
            rules={[
              { required: true, message: "Please enter the initial bid!" },
              () => ({
                validator(_, value) {
                  // Initialize totalAmount and minBid
                  let totalAmount = 0;

                  totalAmount = selectedProperty1.layoutDetails.totalAmount;
                  console.log("tot", totalAmount);

                  // const minBid = totalAmount * 0.1; 


                  const minBid = calculateInitialBid1(totalAmount); 
                  // Check if the value is valid based on minBid
                  if (!value || value <= minBid) {
                    return Promise.resolve();
                  }
                  return Promise.reject(`Initial bid must be less than or equal to ₹${minBid}`);
                },
              }),
            ]}
          >
            <Input
              type="number"
              placeholder="Enter initial Bid"
              prefix="₹"
              style={{ width: "100%" }}
            />
          </Form.Item>



        </Form>
      </Modal>
      <Modal
        title="View Auction Details"
        visible={isAuctionViewModalVisible}
        onOk={handleFine}
        onCancel={handleCancel}

      >

        {/* Buyers Table */}
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="key"
          bordered
        />

      </Modal>
      {selectedProperty && (
        <ShowModal
          path={path}
          selectedProperty={selectedProperty}
          isModalVisible={isModalVisible}
          handleCancel={handleModalClose}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      {/* {viewsModal && (
        <ShowViews
          viewProp={viewProp}
          viewsModal={viewsModal}
          setViewsModal={setViewsModal}
        />
      )} */}
    </div>
  );
};

export default GetLayout;

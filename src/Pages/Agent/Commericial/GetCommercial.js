import {
  Card,
  Col,
  Pagination,
  Row,
  Empty,
  Select,
  Input,
  DatePicker,
  Modal,
  Skeleton,
  Form,
Dropdown,
Button,
  Table,
  TimePicker,
  Menu,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  UserOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import "./CommericialStyles/GetCommercial.css";
import "./Arrow.css";
import { _get, _post, _put } from "../../../Service/apiClient.js";
import ShowModal from "../ShowModal";
import { useTranslation } from "react-i18next";
import moment from "moment";
const { Option } = Select;

const GetCommercial = ({ path, filters, filters1 }) => {

  const { t, } = useTranslation();
  const targetCardRef = useRef(null);
  const [rating] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sold, setSold] = useState(false);
  const [searchText] = useState(["", "", ""]);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [propertyName] = useState("");
  const [checkedTypes] = useState(["sell", "rent", "lease"]);
  const [checkedFeatureTypes] = useState(["Retail", "Industrial", "Hospitality", "SocialActivities"])
  const [auctionData, setAuctionData] = useState(null);
  const [isAuctionModalVisible, setIsAuctionModalVisible] = useState(false);
  const [isAuctionViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [propertyId, setPropertyId] = useState(null);
    const [hoursDifference, setHoursDifference] = useState(0);
  useEffect(() => {
    maxsizefromAPI();
    fetchData();
    // fetchVillages();
    maxpricefromAPI();
  }, [sold, rating, filters, checkedTypes, filters1]);
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
      const values = await form.validateFields();

      // Format startDate and startTime into a single value
      const startTime = `${values.startDate.format("YYYY-MM-DD")} ${values.startTime.format("HH:mm:ss")}`;
      const endTime = `${values.endDate.format("YYYY-MM-DD")} ${values.endTime.format("HH:mm:ss")}`;

      const payload = {
        auctionType: values.auctionType,  // Send auction type to the backend
        startTime,                       // Concatenated start date and time
        endTime,                         // Concatenated end date and time
        amount: values.amount,
        propertyId: selectedProperty._id,
        agentId: selectedProperty.agentId,
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
    const handleCancelAuction = async(auctionId) => {
      try {
        // Validate form fields before proceeding
        const payload = {
          auctionId:auctionId,
        };
  
        console.log("Payload:", payload);
  
        const res = await _put(
          "/auction/closeAuction",
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
  };
  const handleFine = () => {
    // setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
  };
  const maxpricefromAPI = async () => {
    const types = ["@", "@", "@"];

    if (checkedTypes.includes("sell")) {
      types[0] = "sell";
    }
    if (checkedTypes.includes("rent")) {
      types[1] = "rent";
    }
    if (checkedTypes.includes("lease")) {
      types[2] = "lease";
    }
    // try {
    //   const response = await _get(
    //     `property/maxPrice/commercial/${types[0]}/${types[1]}/${types[2]}/@/@`
    //   );
    //   const data = await response.data.maxPrice;
    //   setMaxPrice(data);
    //   setMaxPriceAPI(data);
    //   // setSliderRange([0, data]);
    // } catch (error) {
    //   console.error("Error fetching village data:", error);
    // }
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
  const calculateInitialBid1 = (totalPrice) => {
    const baseBid = 5000; // Initial bid is ₹5,000
    const increment = 5000; // Increment by ₹5,000
    const bidLevel = Math.floor(totalPrice / 2500000); // Calculate how many times ₹25,00,000 fits into totalPrice
    return baseBid + (bidLevel * increment);
  };
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
      if (path === "getcommercial") {
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
      const response = await _get(`/commercials/${path}`);
      console.log(response.data);
      setData(response.data);
      setFilteredData(response.data);
      applyFilters(
        checkedValues,
        checkedTypes,
        checkedFeatureTypes,
        searchText,
        priceRange,
        sizeRange,
        propertyName,
        response.data
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
      const res = await _put(
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


  const [checkedValues, setCheckedValues] = useState(["sold", "unSold"]);


  const [priceRange, setPriceRange] = useState([0, Infinity]);

  const applyFilters = async (
    checkedValues,
    checkedTypes,
    checkedFeatureTypes,
    searchText,
    priceRange,
    sizeRange,
    propertyName,
    data
  ) => {
    if (filters !== null) {
      checkedValues = filters.checkedValues;
      checkedFeatureTypes = filters.checkedFeatureTypes;
      searchText = filters.searchText;
      priceRange = filters.priceRange;
      sizeRange = filters.sizeRange;
      propertyName = filters.propertyName;
      if (filters.checkedTypes?.length > 0) {
        checkedTypes = filters.checkedTypes;
      }
    }
    if (filters1 !== null) {
      checkedValues = filters1.checkedValues;
      checkedFeatureTypes = filters1.checkedFeatureTypes;
      searchText = filters1.searchText;
      priceRange = filters1.priceRange;
      sizeRange = filters1.sizeRange;
      propertyName = filters1.propertyName;
      checkedTypes = filters1.checkedTypes;
    }

    let nameSearch2 = propertyName ? propertyName.toLowerCase() : "";
    const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name

    if (searchText !== "" && searchText !== "all") {
      await fetchLocation();
      data = data2;
    }
    let filtered = data;

    if (checkedValues.length === 0) {
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

    if (checkedTypes === "Sell" || checkedTypes === "Rent" || checkedTypes === "Lease") {
      filtered = filtered.filter((property) =>
        property.propertyDetails.landDetails[checkedTypes.toLowerCase()]?.plotSize !== null
      );
    }
    if (checkedFeatureTypes && checkedFeatureTypes.length > 0) {
      // If checkedFeatureTypes is "All", return all data
      if (checkedFeatureTypes === "All") {
        filtered = data;  // Set filtered data to the original data
      } else {
        // Ensure checkedFeatureTypes is always an array
        const featureTypesArray = Array.isArray(checkedFeatureTypes) ? checkedFeatureTypes : [checkedFeatureTypes];

        filtered = filtered.filter((property) => {
          // Collect all land usage types from sell, rent, and lease
          const landUsageTypes = [
            ...property.propertyDetails.landDetails.sell.landUsage,
            ...property.propertyDetails.landDetails.rent.landUsage,
            ...property.propertyDetails.landDetails.lease.landUsage,
          ];

          console.log("Land Usage Types: ", landUsageTypes);
          console.log("Checked Feature Types: ", featureTypesArray);

          // Check if any of the feature types match the land usage types
          return featureTypesArray.some((type) =>
            landUsageTypes.includes(type)  // Check if the type exists in the landUsageTypes array
          );
        });
      }
    }





    if (priceRange) {
      filtered = filtered.filter((property) =>
        property.propertyDetails.landDetails.rent.totalAmount
          ? Number(property.propertyDetails.landDetails.rent.totalAmount) >= priceRange[0] &&
          Number(property.propertyDetails.landDetails.rent.totalAmount) <= priceRange[1]
          : property.propertyDetails.landDetails.lease.totalAmount
            ? Number(property.propertyDetails.landDetails.lease.totalAmount) >= priceRange[0] &&
            Number(property.propertyDetails.landDetails.lease.totalAmount) <= priceRange[1]
            : Number(property.propertyDetails.landDetails.sell.totalAmount) >= priceRange[0] &&
            Number(property.propertyDetails.landDetails.sell.totalAmount) <= priceRange[1]
      );
    }

    if (nameSearch2 !== "") {
      filtered = filtered.filter((property) => {
        const nameMatch2 = isPropertyIdSearch
          ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
          : property.landDetails.title && property.landDetails.title.toLowerCase().includes(nameSearch2);

        return nameMatch2;
      });
    }

    if (sizeRange) {
      filtered = filtered.filter((property) =>
        property.propertyDetails.landDetails.rent.plotSize
          ? Number(property.propertyDetails.landDetails.rent.plotSize) >= sizeRange[0] &&
          Number(property.propertyDetails.landDetails.rent.plotSize) <= sizeRange[1]
          : property.propertyDetails.landDetails.lease.plotSize
            ? Number(property.propertyDetails.landDetails.lease.plotSize) >= sizeRange[0] &&
            Number(property.propertyDetails.landDetails.lease.plotSize) <= sizeRange[1]
            : Number(property.propertyDetails.landDetails.sell.plotSize) >= sizeRange[0] &&
            Number(property.propertyDetails.landDetails.sell.plotSize) <= sizeRange[1]
      );
    }

    setFilteredData(filtered);
    localStorage.setItem("isLoading", false);
  };

  const handleStartAuction = (property) => {
    console.log(property);
    setSelectedProperty(property);
    setIsModalVisible(false);
    setIsAuctionModalVisible(true);

    let totalAmount = 0;

    if (property.propertyDetails.landDetails.rent.plotSize) {
      totalAmount = property.propertyDetails.landDetails.rent.totalAmount;
    } else if (property.propertyDetails.landDetails.sell.plotSize) {
      totalAmount = property.propertyDetails.landDetails.sell.totalAmount;
    } else if (property.propertyDetails.landDetails.lease.plotSize) {
      totalAmount = property.propertyDetails.landDetails.lease.totalAmount;
    }
    const maxBidAmount = calculateInitialBid1(totalAmount);
    // const maxBidAmount = totalAmount * 0.1;
    console.log("Max allowed bid amount:", maxBidAmount); // Log the max bid amount

    form.setFieldsValue({
      amount: maxBidAmount, // Set the initial bid amount
    });
  };


  const handleViewAuction = (property) => {
    console.log("proep", property);
    setAuctionData(property.auctionData);
    setIsAuctionViewModalVisible(true);
  };


  const [sizeRange, setSizeRange] = useState([0, Infinity]);




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
        `property/maxSize/commercial/@/@/@/@/@/${first}/${second}`
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
                  {paginatedData.map((property, index) => (
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
                          path === "getcommercial" && `${property.propertyTitle} (${property.propertyId})`
                        }
                        style={{
                          width: "97%",
                          padding: path === "getcommercial" && "5px",
                          margin: 0,
                          boxShadow:
                            path !== "getlayouts" && "#c3e3f7 0px 5px 10px",
                          border: property.status !== 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 0 }}
                        // onClick={() => handleCardClick(property)}
                        extra={
                          path === "getcommercial" && property.status == 0 ? (
                            <button
                              style={{
                                color: property.status == 0 ? "green" : "red",
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
                            path === "getcommercial" && (
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
                            {path !== "getcommercial" && (
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

                                {property.propertyTitle} ({property.propertyId})
                              </div>
                            )}

                            {property.propertyDetails.uploadPics.length !== 0 ? (
                              <img
                                alt="property"
                                src={property.propertyDetails.uploadPics[0]}
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
                        <div style={{ padding: "12px" }}>
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
                                {property.propertyDetails.landDetails.rent
                                  .plotSize
                                  ? property.propertyDetails.landDetails.rent
                                    .plotSize
                                  : property.propertyDetails.landDetails.lease
                                    .plotSize
                                    ? property.propertyDetails.landDetails.lease
                                      .plotSize
                                    : property.propertyDetails.landDetails.sell
                                      .plotSize}{" "}
                                <small>{property.propertyDetails.landDetails.sizeUnit}</small>
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
                                {property.propertyDetails.landDetails.rent
                                  .totalAmount ? (
                                  <>
                                    <b>Rent: ₹</b>
                                    {formatPrice(property.propertyDetails.landDetails.rent
                                      .totalAmount)}

                                    <small>
                                      (
                                      {
                                        property.propertyDetails.landDetails.rent
                                          .noOfMonths
                                      }
                                      months)
                                    </small>
                                  </>
                                ) : property.propertyDetails.landDetails.lease
                                  .totalAmount ? (
                                  <>
                                    <b>Lease: ₹</b>
                                    {formatPrice(property.propertyDetails.landDetails.lease
                                      .totalAmount)}

                                    <small>
                                      (
                                      {
                                        property.propertyDetails.landDetails.lease
                                          .duration
                                      }
                                      years)
                                    </small>
                                  </>
                                ) : (
                                  <>
                                    <b>Sell: ₹</b>
                                    {formatPrice(property.propertyDetails.landDetails.sell
                                      .totalAmount)}

                                  </>
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
                                {property.propertyDetails.owner?.ownerName}
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
                                {
                                  property.propertyDetails.landDetails.address
                                    ?.village
                                }
                              </span>
                            </Col>
                          </Row>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            {path === "getcommercial" && (
                              <>
                                <button
                                  style={{
                                    background: property.auctionStatus === "active" ? "#A9A9A9" : "#0D416B",
                                    color: property.auctionStatus === "active" ? "black" : "white",
                                    width: "120px",
                                    border: "none",
                                    borderRadius: "7px",
                                    marginTop: "4%",
                                    marginBottom: "4%",
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
                                marginLeft: path !== "getcommercial" ? "10%" : "0",  // Conditionally add marginLeft
                              }}
                              onClick={(e) => handleCardClick(property, e)}
                            >
                              View More
                            </button>
                            {path === "getcommercial" && (
                              <Dropdown
                                overlay={

                                  <Menu>
                                    <Menu.Item key="view" onClick={() => handleViewAuction(property)} style={{ backgroundColor: "#0D416B", color: "white" }}>
                                      View Auction Details
                                    </Menu.Item>
                                    {hoursDifference > 18 && property.auctionStatus === "active" && (
                                      <Menu.Item key="cancel" style={{ backgroundColor: "lightgray", color: "black" }}  onClick={() => handleCancelAuction(property.auctionData[0]._id)}>
                                        Cancel Auction
                                      </Menu.Item>
                                    )}
                                  </Menu>

                                }
                                trigger={["click"]}
                                onOpenChange={async (open) => {
                                  if (open) {
                                    const startTime = new Date(property.auctionData[0].startDate);  // Already in a standard format
                                    const currentTime = new Date();  // Also in standard Date format
                                    console.log("startTime:", startTime);
                                    console.log("currentTime:", currentTime);
                                    // Convert both dates to the same format (if necessary)
                                    const formattedStartTime = new Date(
                                      startTime.getFullYear(),
                                      startTime.getMonth(),
                                      startTime.getDate(),
                                      startTime.getHours(),
                                      startTime.getMinutes(),
                                      startTime.getSeconds()
                                    );
                                  
                                    const formattedCurrentTime = new Date(
                                      currentTime.getFullYear(),
                                      currentTime.getMonth(),
                                      currentTime.getDate(),
                                      currentTime.getHours(),
                                      currentTime.getMinutes(),
                                      currentTime.getSeconds()
                                    );
                                  
                                    // Calculate the difference in hours
                                    const hoursDiff = (formattedStartTime - formattedCurrentTime) / (1000 * 60 * 60);
                                    setHoursDifference(hoursDiff);
                                  
                                    console.log("startTime:", formattedStartTime);
                                    console.log("currentTime:", formattedCurrentTime);
                                    console.log("Difference in hours:", hoursDiff);
                                  }
                                  
                                }}
                              >
                                <Button
                                  shape="circle"
                                  icon={<MoreOutlined />}
                                  style={{
                                    border: "none",
                                    background: "#0D416B",
                                    color: "white",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                    marginTop: "3%"
                                  }}
                                />
                              </Dropdown>)}
                          </div>
                          
                        
                        </div>
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
          {path === "getcommercial" ? (
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
                label="Auction Type"
                name="auctionType"
                rules={[{ required: true, message: "Please select auctionType!" }]}
              >
                <Select placeholder="Select Type">
                  <Option value="public">Public</Option>
                  <Option value="private">Private</Option>
                </Select>
              </Form.Item>
            </Col>
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
            <Col span={12}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[{ required: true, message: "Please select a start time!" }]}
              >
                <TimePicker style={{ width: "100%" }} format="h:mm a" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[{ required: true, message: "Please select an end time!" }]}
              >
                <TimePicker style={{ width: "100%" }} format="h:mm a" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Initial Bid"
                name="amount"
                rules={[
                  { required: true, message: "Please enter the initial bid!" },
                  () => ({
                    validator(_, value) {
                      // Initialize totalAmount and minBid
                      let totalAmount = 0;

                      // Determine the total amount based on the property type
                      if (selectedProperty.propertyDetails.landDetails.rent.plotSize) {
                        totalAmount = selectedProperty.propertyDetails.landDetails.rent.totalAmount;
                      } else if (selectedProperty.propertyDetails.landDetails.sell.plotSize) {
                        totalAmount = selectedProperty.propertyDetails.landDetails.sell.totalAmount;
                      } else if (selectedProperty.propertyDetails.landDetails.lease.plotSize) {
                        totalAmount = selectedProperty.propertyDetails.landDetails.lease.totalAmount;
                      }

                      const minBid = totalAmount * 0.1; 
                      // const minBid = calculateInitialBid1(totalAmount);
                      // Check if the value is valid based on minBid
                      if (!value || value >= minBid) {
                        return Promise.resolve();
                      }
                      return Promise.reject(`Initial bid must be greater than or equal to ₹${minBid}`);
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
            </Col>
          </Row>


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

export default GetCommercial;

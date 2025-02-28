import {
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  EyeFilled,
} from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import "./Residential.css";
import { Empty, Pagination, Grid, Modal, Tabs, Skeleton, Form, Input, Table, DatePicker } from "antd";
import { Card, Col, Row, Rate, Spin } from "antd";
import "../Commericial/Arrow.css";
import ShowModal from "../ShowModal";
import { useTranslation } from "react-i18next";
import { _get, _post, _put } from "../../../Service/apiClient";
import TabPane from "antd/es/tabs/TabPane";
import ShowViews from "../ShowViews";
import moment from "moment";
const { useBreakpoint } = Grid;

export default function Residential({ path, filters, filters1 }) {
  const screens = useBreakpoint();
  const [viewsModal, setViewsModal] = useState(false);
  const [viewProp, setViewProp] = useState(null);
  const { t, i18n } = useTranslation();
  const targetCardRef = useRef(null);
  const [data, setData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProduct1, setSelectedProduct1] = useState(null);
  const [rating, setrating] = useState(0);
  const [sold, setSold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState(["", "", ""]);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [checkedValues, setCheckedValues] = useState(["sold", "unSold"]);
  const [auctionData, setAuctionData] = useState(null);
  const [isAuctionModalVisible, setIsAuctionModalVisible] = useState(false);
  const [isAuctionViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [maxprice, setMaxPrice] = useState(100000);
  const [sliderRange, setSliderRange] = useState([0, Infinity]);
  const [maxfromAPI, setMaxPriceAPI] = useState(1000000);
  const [propertyName, setPropertyName] = useState("");
  const [checkedHouseType, setCheckedValuesHouseType] = useState([
    "Flat",
    "House",
    "Apartment",
  ]);
  const [purposeType, setPurposeType] = useState("sell", "rent", "lease");
  const [form] = Form.useForm();
  const [maxsizefromAPIvalue, setMaxSizeAPIvalue] = useState(100000);
  const [maxsize, setMaxSize] = useState(100000);
  const [sliderRangesize, setSliderRangesize] = useState([0, 100000]);
  const [propertyId, setPropertyId] = useState(null);
  useEffect(() => {
    maxsizefromAPI();
    fetchData();
    // fetchVillages();
    maxPricefromAPI();
  }, [sold, rating, filters, checkedHouseType, filters1]);
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
        propertyId: selectedProduct1._id,
        agentId: selectedProduct1.agentId,
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
  const handlePaymentSuccess = async () => {
    await fetchData(); // Fetch data first
  };

  useEffect(() => {
    if (propertyId && data.length > 0) {
      const updatedProperty = data.find((prop) => prop._id === propertyId);
      console.log("updatedProperty", updatedProperty);
      if (updatedProperty) {
        setSelectedProduct(updatedProperty);
      }
    }
  }, [data, propertyId]);
  const handleCancel = () => {
    setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProduct(null);
    setSelectedProduct1(null);
  };
  const handleFine = () => {
    // setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProduct(null);
    setSelectedProduct1(null);
  };
  const maxPricefromAPI = async () => {
    const data = checkedHouseType;
    const parameters = ["@", "@"];
    if (checkedHouseType.includes("Flat")) {
      parameters[0] = "flat";
    }
    if (checkedHouseType.includes("House")) {
      parameters[1] = "house";
    }
    try {
      const response = await _get(
        `property/maxPrice/residential/@/@/@/${parameters[0]}/${parameters[1]}`
      );
      const data = await response.data.maxPrice;
      setMaxPrice(data);
      setMaxPriceAPI(data);
      setSliderRange([0, data]);
    } catch (error) {
      console.error("Error fetching village data:", error);
    }
  };
  let data2;
  const formatPrice = (price) => {
    if (price == null) {
      return "N/A"; // Return 'N/A' or any other default value for invalid prices
    }

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
  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle empty or undefined values
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
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
      if (path === "getting") {
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
      const response = await _get(`/residential/${path}`);
      console.log(response.data);
      setData(response.data);
      setFilteredData(response.data);
      applyFilters(
        checkedValues,
        searchText,
        priceRange,
        sizeRange,
        propertyName,
        checkedHouseType,
        purposeType,
        response.data
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleCardClick = (product) => {
    setPropertyId(product._id);
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleSellingStatus = async (id, status) => {
    let finalObject = {
      propertyId: id,
      propertyType: "residential",
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
  const calculateInitialBid1 = (totalPrice) => {
    const baseBid = 5000; // Initial bid is ₹5,000
    const increment = 5000; // Increment by ₹5,000
    const bidLevel = Math.floor(totalPrice / 2500000); // Calculate how many times ₹25,00,000 fits into totalPrice
    return baseBid + (bidLevel * increment);
  };
  const applyFilters = async (
    checkedValues,
    searchText,
    priceRange,
    propertyName,
    sizeRange,
    checkedHouseType,
    purposeType,
    data
  ) => {
    if (filters != null) {
      checkedValues = filters.checkedValues;
      searchText = filters.searchText;
      priceRange = filters.priceRange;
      sizeRange = filters.sizeRange;
      propertyName = filters.propertyName;
      checkedHouseType = filters.checkedHouseType;
      purposeType = filters.purposeType;
    }
    if (filters1 != null) {
      checkedValues = filters1.checkedValues;
      searchText = filters1.searchText;
      priceRange = filters1.priceRange;
      sizeRange = filters1.sizeRange;
      propertyName = filters1.propertyName;
      checkedHouseType = filters1.checkedHouseType;
      purposeType = filters1.purposeType;
    }
    let nameSearch2 = propertyName ? propertyName.toLowerCase() : "";
    const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name

    if (searchText != "") {
      await fetchLocation();
      data = data2;
    }
    let filtered = data;

    if (checkedValues === "All") {
      filtered = data;
    } else if (checkedValues === "Sold") {
      filtered = data.filter((property) => property.status === 1);
    } else if (checkedValues === "Unsold") {
      filtered = data.filter((property) => property.status === 0);
    }

    if (checkedHouseType === "All") {
      filtered = filtered;
    } else if (checkedHouseType === "Flat") {
      filtered = filtered.filter(
        (property) => property.propertyDetails.type === "Flat"
      );
    } else if (checkedHouseType === "House") {
      filtered = filtered.filter(
        (property) => property.propertyDetails.type === "House"
      );
    } else if (checkedHouseType === "Apartment") {
      filtered = filtered.filter(
        (property) => property.propertyDetails.type === "Apartment"
      );
    }

    if (purposeType === "All") {
      filtered = filtered;
    } else if (purposeType === "sell") {
      filtered = filtered.filter(
        (property) => property.propertyDetails.propertyPurpose === "sell"
      );
    } else if (purposeType === "rent") {
      filtered = filtered.filter(
        (property) => property.propertyDetails.propertyPurpose === "rent"
      );
    } else if (purposeType === "lease") {
      filtered = filtered.filter(
        (property) => property.propertyDetails.propertyPurpose === "lease"
      );
    }
    const [district, mandal, village] = Array.isArray(searchText)
      ? searchText
      : ["", "", ""];
    if (district) {
      filtered = filtered.filter((property) =>
        property.address?.district
          .toLowerCase()
          .startsWith(district.toLowerCase())
      );
    }
    if (mandal) {
      filtered = filtered.filter((property) =>
        property.address?.mandal.toLowerCase().startsWith(mandal.toLowerCase())
      );
    }
    if (village) {
      filtered = filtered.filter((property) =>
        property.address?.village
          .toLowerCase()
          .startsWith(village.toLowerCase())
      );
    }

    if (priceRange) {
      filtered = filtered.filter(
        (property) =>
          Number(property.propertyDetails.flatCost) >= priceRange[0] &&
          Number(property.propertyDetails.flatCost) <= priceRange[1]
      );
    }

    if (sizeRange) {
      filtered = filtered.filter(
        (property) =>
          Number(property.propertyDetails.flatSize) >= sizeRange[0] &&
          Number(property.propertyDetails.flatSize) <= sizeRange[1]
      );
    }
    if (nameSearch2 !== "") {
      filtered = filtered.filter((property) => {

        const nameMatch2 = isPropertyIdSearch
          ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
          : property.propertyDetails.apartmentName && property.propertyDetails.apartmentName.toLowerCase().includes(nameSearch2);

        // Log the property name or ID


        return nameMatch2;
      });
    }

    setFilteredData(filtered);
    localStorage.setItem("isLoading", false);
  };

  const [sizeRange, setSizeRange] = useState([0, Infinity]);

  const handleStartAuction = (property) => {
    setIsModalVisible(false);
    setSelectedProduct1(property);

    setIsAuctionModalVisible(true);

    let totalAmount = property.propertyDetails.totalCost;
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
        `property/maxSize/residential/@/@/@/@/@/${first}/${second}`
      );
      const data = await response.data.maxSize;
      setMaxSize(data);
      setMaxSizeAPIvalue(data);
      setSliderRangesize([0, data]);
      setSizeRange([0, data]);
    } catch (error) {
      console.error("Error fetching village data:", error);
    }
  };


  return (
    <div ref={targetCardRef}>
      {data != null ? (
        data.length != 0 ? (
          <>
            {checkedValues.length == 0 ? (
              <h2>Please select atleast one option</h2>
            ) : filteredData.length == 0 ? (
              <Col
                span={24}
                style={{ textAlign: "centre" }}
                className="content-container"
              >
                <Empty description="No Properties found, Please select other filters" />
              </Col>
            ) : (
              <>
                <Row
                  gutter={[16, 16]}
                  style={{ padding: "20px", paddingTop: "0px" }}
                >
                  {paginatedData.map((product, index) => (
                    <Col
                      key={product._id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                      style={{ marginBottom: "16px" }}
                    >
                      <Card
                        hoverable
                        className={product.status === 1 ? "card-overlay" : "card-item"}
                        title={
                          path === "getting" &&
                          `${product.propertyDetails.apartmentName} (${product.propertyId})`
                        }
                        style={{
                          width: "97%",
                          padding: path === "getting" && "5px",
                          margin: 0,
                          boxShadow:
                            path !== "getting" && "#c3e3f7 0px 5px 10px",
                          border: product.status != 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 0 }}
                        // onClick={() => handleCardClick(product)}
                        extra={
                          path === "getting" && product.status == 0 ? (
                            <button
                              style={{
                                color: product.status == 0 ? "green" : "red",
                                flexWrap: "wrap",
                                float: "right",
                                width: "100%",
                                fontSize: "10px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSellingStatus(
                                  product._id,
                                  product.status
                                );
                              }}
                            >
                              Mark as Sold
                            </button>
                          ) : (
                            product.status == 1 &&
                            path === "getting" && (
                              <span>
                                <button
                                  style={{
                                    color:
                                      product.status == 0 ? "green" : "red",
                                    flexWrap: "wrap",
                                    float: "right",
                                    width: "100%",
                                    fontSize: "10px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSellingStatus(
                                      product._id,
                                      product.propertyType,
                                      product.status
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
                        <Row
                          gutter={[16, 16]}
                          style={{ margin: 0 }}
                          justify="center"
                          align="middle"
                        >
                          <Col span={24} style={{ padding: 0 }}>
                            {path !== "getting" && (
                              <div
                                style={{
                                  position: "absolute",
                                  left: "0px",
                                  background: "rgba(235, 245, 252, 0.9)",
                                  color: "rgb(13,65,107)",
                                  fontWeight: "bold",
                                  padding: "5px 10px",
                                  borderRadius: "4px",
                                }}
                              >
                                {product.propertyDetails.apartmentName} ({product.propertyId})
                              </div>
                            )}

                            {product.propPhotos.length != 0 ? (
                              <img
                                alt="property"
                                src={product.propPhotos[0]}
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
                            {/* {path === "getting" && (
                              <EyeFilled
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewsModal(!viewsModal);
                                  setViewProp(product);
                                }}
                                style={{
                                  color: "rgb(13,65,107) ",
                                  background: "white",

                                  borderRadius: "50%",
                                  padding: "4px",
                                  position: "absolute",
                                  bottom: 10,
                                  right: 16,
                                  fontSize: "20px",
                                  cursor: "pointer",
                                }}
                              />
                            )} */}
                          </Col>
                        </Row>
                        <div style={{ padding: "24px" }}>
                          <Row style={{ marginTop: "10px" }}>
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
                                <AppstoreOutlined className="GlobalOutlined" />
                                {product.propertyDetails.flatSize} : {" "}
                                <small>{product.propertyDetails.sizeUnit}</small>
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
                                <b>{capitalizeFirstLetter(product.propertyDetails.propertyPurpose)}</b> :  ₹{" "}
                                {formatPrice(
                                  product.propertyDetails.totalCost
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
                              <UserOutlined className="GlobalOutlined" />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {product.owner.ownerName}
                              </span>
                            </Col>
                            <Col
                              span={12}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <EnvironmentOutlined className="GlobalOutlined" />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {product.address?.district &&
                                  product.address?.village}
                              </span>
                            </Col>
                          </Row>

                          <Row>
                            {/* <Col
                            xs={12}
                            sm={12}
                            md={24}
                            lg={24}
                            xl={12}
                            xxl={12}
                            style={{ textAlign: "center", marginTop: "5px" }}
                          >
                            {product.status === 0 &&
                              path === "getallresidentials" ? (
                              <Rate
                                allowHalf
                                defaultValue={product.rating}
                                style={{
                                  border: "black",
                                  marginTop: "5%",
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(value) => {
                                  handleRatingChange(
                                    value,
                                    product._id,
                                    product.propertyType
                                  );
                                }}
                              />
                            ) : (
                              <Rate
                                className="custom-rate"
                                allowHalf
                                defaultValue={product.rating}
                                disabled={true}
                                style={{
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  opacity: 0.9,
                                  transition: "opacity 0.3s",
                                  cursor: "not-allowed",
                                }}
                              />
                            )}
                          </Col> */}

                          </Row>

                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginRight: "5%" }}>
                            {path === "getting" && (
                              <>
                                <button
                                  style={{
                                    background: product.auctionStatus === "active" ? "#A9A9A9" : "#0D416B",
                                    color: product.auctionStatus === "active" ? "black" : "white",

                                    border: "none",
                                    borderRadius: "7px",
                                    marginTop: "4%",
                                    marginBottom: "4%",
                                    width: "98px",
                                    padding: "4px",
                                    cursor: product.auctionStatus === "active" ? "not-allowed" : "pointer",
                                    opacity: product.auctionStatus === "active" ? 0.6 : 1,
                                  }}
                                  onClick={(e) => {
                                    if (product.auctionStatus !== "active") {
                                      handleStartAuction(product, e);
                                    }
                                  }}
                                  disabled={product.auctionStatus === "active"}
                                >
                                  Start Auction
                                </button>
                                {product.auctionData && (
                                <button
                                  style={{
                                    background: "#0D416B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "7px",
                                    marginTop: "4%",
                                    marginBottom: "4%",
                                    width: "170px"
                                    // padding: "10px 20px",
                                  }}
                                  onClick={(e) => handleViewAuction(product, e)}
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
                                marginLeft: path !== "getting" ? "10%" : "0",  // Conditionally add marginLeft
                              }}

                              onClick={() => handleCardClick(product)}
                            >
                              View More
                            </button>
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
          {path === "getting" ? (
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
                <DatePicker style={{ width: "100%" }}    disabledDate={(current) => current && current < moment().startOf('day')} />
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
                  totalAmount = selectedProduct1.propertyDetails.totalCost;

                  const minBid = calculateInitialBid1(totalAmount);

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
      {selectedProduct && (
        <ShowModal
          path={path}
          selectedProperty={selectedProduct}
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
}

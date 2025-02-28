import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Tooltip,
  Pagination,
  Grid,
  Skeleton,
  Button,
  Modal, Table, Input,
  Form
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  HeartOutlined,
  HeartFilled,
  EnvironmentFilled,
  InfoCircleOutlined
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faRuler,
} from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { _post, _get, _delete, _put } from "../../../Service/apiClient";
import { FaShieldAlt } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import Meta from "antd/es/card/Meta";
import moment from "moment";
import { toast } from "react-toastify";
const { useBreakpoint } = Grid;

export default function BuyersLayout({ filters }) {
  const screens = useBreakpoint();
  const { t, i18n } = useTranslation();
  const [layouts, setLayouts] = useState(null);
  const [filteredLayouts, setFilteredLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [agentrole, setAgentRole] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [enteredMoney, setEnteredMoney] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [form] = Form.useForm();

  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  useEffect(() => {
    const storedRole = localStorage.getItem("agentrole");
    if (storedRole) {
      setAgentRole(parseInt(storedRole));  // Parse and store the agent role
    }
  }, [localStorage.getItem("agentrole")]);
  const handleAcceptTerms = (e) => {
    setIsChecked(e.target.checked);
  };
  const handleSubmit = async () => {
    try {
      // Validate form fields before proceeding
      const values = await form.validateFields();

      const payload = {
        bidAmount: values.bidAmount, // Assuming you meant to use the 'amount' field from the form
        buyerName: localStorage.getItem("name"),
        buyerId: localStorage.getItem("userId"),
      };

      console.log("Payload:", payload);


      if (window.Razorpay) {
        const razorpayKeyId = "rzp_test_2OyfmpKkWZJRIP";
        const options = {
          key: razorpayKeyId,
          amount: (payload.bidAmount) * 100, // Razorpay accepts the amount in paise
          currency: "INR",
          name: "Auction Payment",
          description: "Payment for auction bid",
          handler: async function (response) {
            const requestData = {
              bidAmount: payload.bidAmount,
              buyerName: payload.buyerName,
              buyerId: payload.buyerId,
              transactionId: response.razorpay_payment_id,
              reservationAmount: payload.bidAmount,
            };

            console.log(requestData);
            try {
              const apiResponse = await _put(
                `auction/bid/${selectedProperty.auctionData._id}`,
                requestData,
                "Bid placed and payment successful!",
                "Failed to place bid or payment failed."
              );

              if (apiResponse?.status === 200 || apiResponse?.status === 201) {
                // Handle successful submission
                form.resetFields();
                setIsAuctionViewModalVisible(false);
              } else {
                console.log("Error submitting bid or payment");
              }
            } catch (error) {
              console.log("Error submitting bid and payment:", error);
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        // Open Razorpay payment gateway
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Razorpay script not loaded.");
        toast.error("Error: Razorpay script failed to load");
      }
    } catch (error) {
      console.log("Error in form submission:", error);
    }
  };
  const handleConfirmAndProceed = () => {
    if (isChecked) {
      setShowConfirmationModal(false);
      handleSubmit(); // Open Razorpay modal
    }
  };

  const handleCancel = () => {

    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
  };
  const handleMoneyChange = (e) => {
    const value = e.target.value;
    setEnteredMoney(value);
    if (parseFloat(value) > backendMoney) {
      setIsSubmitDisabled(false);
    } else if (parseFloat(value) > requiredBid) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };
  useEffect(() => {
    console.log("filters", filters)
    fetchLayouts();

  }, []);
  useEffect(() => {
    console.log("filters", filters)
    applyFilters(filters);
  }, [filters]);
  const calculateInitialBid = (totalPrice) => {
    const bidIncrement = 500;
    const baseBid = parseFloat(totalPrice);
    console.log(baseBid);
    const bidLevel = Math.floor(totalPrice / 10000);
    console.log(bidLevel);
    return baseBid + (bidLevel * bidIncrement);
  };
  const calculateInitialBid1 = (totalPrice) => {
    const bidIncrement = 500;
    const baseBid = 500;
    const bidLevel = Math.floor(totalPrice / 50000);
    return baseBid + (bidLevel * bidIncrement);
  };
  useEffect(() => {
    console.log("called");
    if (selectedProperty) {
      const startDate = moment(selectedProperty?.auctionData?.[0]?.startDate);
      const endDate = moment(selectedProperty?.auctionData?.[0]?.endDate);
      const now = moment();

      const amount = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        : selectedProperty?.auctionData?.[0]?.amount;

      const initialBid = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ?selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        : selectedProperty?.auctionData?.[0]?.amount;

      // setReservationAmount(initialBid);
      setBackendMoney(amount);
      setRequiredBid(initialBid);
      // Determine the initial state message
      if (now.isBefore(startDate)) {
        setRemainingTime("Auction Not Yet Started");
      } else if (now.isBetween(startDate, endDate)) {
        setRemainingTime(calculateCountdown(endDate)); // Start countdown
      } else {
        setRemainingTime("Auction Ended");
      }

      // Setup interval to update countdown if auction is ongoing
      const interval = setInterval(() => {
        const currentTime = moment();

        if (currentTime.isBefore(startDate)) {
          setRemainingTime("Auction Not Yet Started");
        } else if (currentTime.isBetween(startDate, endDate)) {
          setRemainingTime(calculateCountdown(endDate));
        } else {
          setRemainingTime("Auction Ended");
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedProperty]);
  const calculateCountdown = (endTime) => {
    const now = moment();
    const durationToEnd = moment.duration(endTime.diff(now));

    return `${durationToEnd.days()} Days ${durationToEnd.hours()} Hours ${durationToEnd.minutes()} Minutes`;
  };
  const fetchLayouts = async () => {
    try {
      const response = await _get(`/layout/getalllayouts`);
      const layoutData = response.data;
      console.log(layoutData);
      const initialWishlist = layoutData
        .filter((layout) => layout.wishStatus === 1)
        .map((layout) => layout._id);
      setWishlist(initialWishlist);

      setLayouts(layoutData);
      setFilteredLayouts(layoutData);
      // applyFilters(filters, response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching layouts:", error);
      setLoading(false);
    }
  };
  const formatPrice = (price) => {
    if (!price || isNaN(price)) {
      return "N/A"; // Return a default value if price is undefined or not a number
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

  const handleViewAuction = (property) => {
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
  };


  let data2;
  const fetchLocation = async () => {
    try {
      const type = localStorage.getItem("type");
      let searchText = "";
      if (filters !== undefined) {
        searchText = filters.searchText;
      }
      if (searchText === null) {
        searchText = "all"
      }
      const response = await _get(`/property/location/${type}/${searchText}`);
      data2 = response.data;
    }
    catch (error) {
      setFilteredLayouts("");
    }
  };

  const applyFilters = async (filters) => {
    let filtered = [];
    let backendFilteredData = [];
    const amenityMapping = {
      "UnderGround Water": "UnderGround Water",
      "Drainage System": "Drainage System",
      "Play Zone": "Play Zone",
      "Swimming Pool": "Swimming Pool",
      "Convention Hall": "Convention Hall",
    };
    const PermissionsMapping = {
      "RERA Registered": "RERA Registered",
      "DTCP Approved": "DTCP Approved",
      "TLP Approved": "TLP Approved",
      "FLP Approved": "FLP Approved",

    }

    let amenitiesJson = "";
    if (filters.layoutAmenities && filters.layoutAmenities.length > 0) {
      const amenitiesObject = {};
      Object.keys(amenityMapping).forEach((amenity) => {
        amenitiesObject[amenityMapping[amenity]] = filters.layoutAmenities.includes(amenity) ? "true" : "false";
      });
      amenitiesJson = JSON.stringify(amenitiesObject);
    }
    let permissionsJson = "";
    if (filters.RERA && filters.RERA.length > 0) {
      const permissionsObject = {};
      Object.keys(PermissionsMapping).forEach((amenity) => {
        permissionsObject[PermissionsMapping[amenity]] = filters.RERA.includes(amenity) ? "true" : "false";
      });
      permissionsJson = JSON.stringify(permissionsObject);
    }

    try {
      if (!filters.searchText && !filters.priceRange && !filters.sizeRange) {
        // Backend filtering
        const response = await _get(`/filterRoutes/layoutSearch?road=${filters.layoutDistanceFromRoad}&approvals=${permissionsJson}&amenities=${amenitiesJson}&location=`);

        if (response.data && response.data.data.length > 0) {
          backendFilteredData = response.data.data;
        } else {
          console.warn("No data found for the selected filters.");
        }
      } else {
        // If searchText, priceRange, or sizeRange is present, perform backend fetch first and then apply frontend filters
        const response = await _get(`/filterRoutes/layoutSearch?road=${filters.layoutDistanceFromRoad}&approvals=${permissionsJson}&amenities=${amenitiesJson}&location=`);
        backendFilteredData = response.data?.data || [];
      }

      filtered = backendFilteredData;

      // Frontend filtering
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        if (searchText != "" && searchText != "all") {
          await fetchLocation();
          filtered = data2;
        }
      }
      console.log("hllp", filters.propertyName)
      let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
      const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
      if (nameSearch2 !== "") {
        filtered = filtered.filter((property) => {
          const nameMatch2 = isPropertyIdSearch
            ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
            : property.layoutDetails.layoutTitle && property.layoutDetails.layoutTitle.toLowerCase().includes(nameSearch2);

          return nameMatch2;
        });
      }

      if (filters.priceRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.layoutDetails.totalAmount) >= filters.priceRange[0] &&
            Number(property.layoutDetails.totalAmount) <= filters.priceRange[1]
        );
      }

      if (filters.sizeRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.layoutDetails.plotSize) >= filters.sizeRange[0] &&
            Number(property.layoutDetails.plotSize) <= filters.sizeRange[1]
        );
      }

      setFilteredLayouts(filtered);
      console.log("Final Filtered Products:", filtered);

    } catch (error) {
      console.error("Error fetching products:", error);
      setFilteredLayouts([]);
    }
  };
  // const applyFilters = async (filters, data) => {
  //   const searchText = filters.searchText;
  //   if (searchText != "" && searchText != "all") {
  //     await fetchLocation();
  //     data = data2;
  //   }
  //   let filtered = data;

  //   if (filters.priceRange) {
  //     filtered = filtered.filter(
  //       (property) =>
  //         Number(property.layoutDetails.totalAmount) >= filters.priceRange[0] &&
  //         Number(property.layoutDetails.totalAmount) <= filters.priceRange[1]
  //     );
  //   }

  //   if (filters.sizeRange) {
  //     filtered = filtered.filter(
  //       (property) =>
  //         Number(property.layoutDetails.plotSize) >= filters.sizeRange[0] &&
  //         Number(property.layoutDetails.plotSize) <= filters.sizeRange[1]
  //     );
  //   }
  //   let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
  //   const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
  //   if (nameSearch2 !== "") {
  //     filtered = filtered.filter((property) => {
  //       const nameMatch2 = isPropertyIdSearch
  //         ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
  //         : property.layoutDetails.layoutTitle && property.layoutDetails.layoutTitle.toLowerCase().includes(nameSearch2);

  //       return nameMatch2;
  //     });
  //   }
  //   setFilteredLayouts(filtered);
  // };
  const handleCardClick = (layout) => {
    if (agentrole === 11) {
      navigate(`/dashboard/agent/layout/details/${layout._id}`);
    } else {
      navigate(`/dashboard/buyer/layout/details/${layout._id}`);
    }
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

  const paginatedData = Array.isArray(filteredLayouts)
    ? filteredLayouts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  return (
    <div style={{ padding: "0px 20px" }} ref={targetCardRef}>
      {layouts === null && (
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


                    marginTop: "2%",
                    backgroundColor: "#f0f0f0", // Optional: for a background color
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )
      }

      <Row gutter={[24, 24]} justify="start">
        {Array.isArray(layouts) != null && (
          Array.isArray(layouts).length != 0 ? (
            <>
              {Array.isArray(filteredLayouts) && filteredLayouts.length === 0 ? (
                <Col
                  span={24}
                  style={{ textAlign: "centre" }}
                  className="content-container"
                >
                  <Empty description="No properties found, Please select other filters" />
                </Col>
              ) : (
                <>
                  {paginatedData.map((layout) => (
                    <Col
                      key={layout._id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                    >
                      <Card
                        hoverable
                        className="card-item"

                        cover={
                          <div style={{ position: "relative" }}>
                            {/* <img
                              src={item.landDetails.images[0]}
                              alt="field"
                              style={{
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                                width: "100%",
                                height: 170,
                                objectFit: "cover",
                                borderBottom: "none",
                              }}
                            /> */}
                            {layout?.uploadPics?.length != 0 ? (
                              <img
                                alt="layout"
                                src={layout?.uploadPics?.[0]}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <img
                                alt="layout"
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

                            <div
                              style={{
                                position: "absolute",
                                top: "1px",
                                left: "0px",
                                backgroundColor: "#ffc107",
                                color: "#000",
                                padding: "5px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {" "}
                              <FontAwesomeIcon
                                icon={faTag}
                                style={{ marginRight: "2px" }}
                              />
                              ₹ {formatPrice(layout?.layoutDetails?.totalAmount)}
                            </div>
                            {layout?.auctionStatus && layout?.auctionStatus.toLowerCase() === "active" && (

                              <Button
                                style={{
                                  position: "absolute",
                                  top: "1px",
                                  right: "0px",
                                  backgroundColor: "#ffc107",
                                  color: "#000",
                                  padding: "5px 10px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                onClick={(e) => handleViewAuction(layout, e)}
                              >
                                Participate in Auction
                              </Button>
                            )}
                          </div>
                        }
                        style={{ backgroundColor: "rgba(159, 159, 167, 0.23)" }}
                      >


                        <Meta

                          description={
                            <>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "black",
                                  }}
                                >
                                  <b>Title : </b> <span style={{ marginLeft: "3px" }}> {layout?.layoutDetails?.layoutTitle} {layout?.propertyId}</span>
                                </p>

                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "black",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    style={{ marginRight: "8px" }}
                                  />
                                  {layout?.layoutDetails?.address?.district}
                                </p>
                              </div>

                              <Row
                                gutter={[16, 0]}
                                style={{ marginTop: "20px" }}
                              >
                                <Col
                                  span={8}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faRuler}
                                    style={{ color: "#0d416b" }}
                                  />
                                  <span
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: "100%",
                                      display: "block",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    {layout?.layoutDetails?.plotSize}{" "}
                                    <small>sq. ft</small>
                                  </span>
                                </Col>

                                {layout?.layoutDetails?.dtcpApproved && (
                                  <Col
                                    span={8}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",

                                    }}
                                  >
                                    <FaShieldAlt style={{ color: "#0d416b" }} />
                                    <span
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "100%",
                                        display: "block",
                                        textAlign: "center",
                                        color: "black",
                                      }}
                                    >
                                      DTCP
                                    </span>
                                  </Col>
                                )}
                                {layout?.layoutDetails?.reraRegistered && (
                                  <Col
                                    span={8}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <AiFillSafetyCertificate
                                      style={{ color: "#0d416b" }}
                                    />
                                    <span
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "100%",
                                        display: "block",
                                        textAlign: "center",
                                        color: "black",
                                      }}
                                    >
                                      RERA
                                    </span>
                                  </Col>
                                )}

                              </Row>
                              <button
                                style={{
                                  background: "#0D416B",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "7px",
                                  marginTop: "4%",
                                  marginBottom: "4%",
                                  width: "100px",
                                  float: "right",
                                }}
                                onClick={() => handleCardClick(layout)}
                              >
                                View More
                              </button>
                            </>
                          }
                        />
                      </Card>

                    </Col>
                  ))}

                  {filteredLayouts.length > 6 && (
                    <Col span={24} style={{ marginLeft: "60%" }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredLayouts.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  )}
                </>
              )}
            </>
          ) : (
            <h2>{t("dashboard.e1")}</h2>
          )
        )}
      </Row>
      <Modal
        title="Auction Details"
        visible={isAuctoonViewModalVisible}
        onCancel={handleCancel}
        onOk={() => setShowConfirmationModal(true)}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ disabled: isSubmitDisabled }}  // Disable submit button if auction is not active
      >
        <Form form={form} layout="horizontal">
          {/* Countdown Display */}
          <div style={{ fontWeight: 'bold', color: 'red', marginBottom: "2%", marginLeft: "24%" }}>
            Ends In {remainingTime ? remainingTime : 'Auction Ended'}
          </div>

          {/* Property Start Date */}
          <Row gutter={[16, 16]} style={{ marginBottom: "5%" }}>
            <Col span={12}><b>Start Date:</b> {selectedProperty?.auctionData?.[0]?.startDate ? moment(selectedProperty?.auctionData.startDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}><b>End Date:</b> {selectedProperty?.auctionData?.[0]?.endDate ? moment(selectedProperty?.auctionData.endDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}>
              <b>Basic Bid Amount: ₹</b>
              {selectedProperty?.auctionData?.[0]?.amount}
            </Col>
            <Col span={12}>
            <b>Auction Type : </b> {selectedProperty?.auctionData?.[0]?.auctionType}
            </Col>
            {selectedProperty?.auctionData?.[0]?.auctionType === "public" && (
              <Col span={12}>
                <b>Current Bid Amount: ₹</b>
                {selectedProperty?.auctionData?.[0]?.buyers?.length > 0
                  ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
                  : selectedProperty?.auctionData?.[0]?.amount}
              </Col>)}
          </Row>

          {/* Enter Bid Money */}
          {console.log(backendMoney)}
          {remainingTime !== "Auction Ended" && remainingTime !== "Auction Not Yet Started" && (
            <Form.Item
              label={<span><span style={{ color: 'red' }}>*</span> Enter Bid Money</span>}
              name="bidAmount"
              rules={[

                {
                  validator: async (_, value) => {
                    if (!value) {
                      return Promise.reject('Please enter a valid bid amount');
                    }

                    if (value < requiredBid) {
                      return Promise.reject(`New Bid amount should be a greater than ₹${requiredBid}`);
                    }

                    if (!/^\d+0$/.test(value)) {
                      return Promise.reject('Bid amount should end in 00 (e.g., 1200, 5350, 8950)');
                    }
            
                  },
                },
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  type="number"
                  prefix="₹"
                  placeholder="Enter amount"
                  onChange={(e) => {
                    handleMoneyChange(e);
                    // Trigger validation whenever the input value changes
                    form.validateFields(['bidAmount']);
                  }}
                />
                <Tooltip
                  title={(
                    <div>
                      <p><strong>Bidding Rules:</strong></p>
                      <ul style={{ paddingLeft: '20px' }}>
                        <li>Minimum bid amount Should be ₹{requiredBid}.</li>
                        <li>Each bid should be higher than the last bid.</li>
                        <li>You need to pay the complete bid amount.</li>
                      </ul>
                      <p><strong>Refund Policy:</strong></p>
                      <p>If you don't win the auction, 10% of your bid amount will be deducted and remaining bid amount will be refunded to your account.</p>
                    </div>
                  )}
                >
                  <span style={{ marginLeft: '10px', cursor: 'pointer', color: '#0D416B' }}>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>

              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        title="Confirm Bidding Rules"
        visible={showConfirmationModal}
        onCancel={() => setShowConfirmationModal(false)}
        onOk={handleConfirmAndProceed}
        okText="Accept & Submit"
        cancelText="Cancel"
        okButtonProps={{ disabled: !isChecked }}
      >
        <p><strong>Bidding Rules:</strong></p>
        <ul>
          <li>Minimum bid amount should be ₹{requiredBid}.</li>
          <li>Each bid should be higher than the last bid.</li>
          <li>You need to pay the complete bid amount.</li>
        </ul>

        <p><strong>Refund Policy:</strong></p>
        <p>If you don't win the auction, 10% of your bid amount will be deducted, and the remaining amount will be refunded.</p>

        <div style={{ marginTop: "15px" }}>
          <input type="checkbox" id="acceptTerms" onChange={handleAcceptTerms} />
          <label htmlFor="acceptTerms" style={{ marginLeft: "10px" }}>
            I agree to the bidding terms & conditions.
          </label>
        </div>
      </Modal>
    </div>
  );
}

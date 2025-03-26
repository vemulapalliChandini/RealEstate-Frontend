
import React, { useEffect, useState, useCallback} from "react";
import { Row, Col, Carousel, Card, Button, Modal, Tooltip, Grid, Spin, Form, Input } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import PropertyVR from "./PropertyVR";
import { logEvent } from "../../../analytics";
import "./BuyersAgriculture.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Confetti from 'react-confetti';
import {
  ThunderboltOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  EnvironmentOutlined,
  EnvironmentFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Bookappointment from "./BookAppointment";
import {
  faEnvelope,
  faWarehouse,
  faWater,
  faSeedling,
  faRoad,
  faBalanceScale,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { _get, _put, _post } from "../../../Service/apiClient";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
const { useBreakpoint } = Grid;

const BuyersAgricultureDetails = () => {
  const screens = useBreakpoint();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVis, setIsModalVis] = useState(false);
  
  const [cropDetails, setCropDetails] = useState("");
  const [userId, setUserId] = useState("");
  const [viewsCount, setViewsCount] = useState(0);
  const [properties, setProperties] = useState(null);
  const [ShownInterest, setShownInterest] = useState(null);
  const [showInterestButton, setShowInterestButton] = useState(false);
  const [isPropertyOnHold, setIsPropertyOnHold] = useState("");
  const [role, setRole] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [showNextDay, setShowNextDay] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Update the window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const role1=localStorage.getItem("role");
  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(Number(role));


  }, [role1]);
  const [showBalloons, setShowBalloons] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBalloons(false);
    }, 5000); // Remove balloons after 5 seconds

    return () => clearTimeout(timer);
  }, []);
 

  // const handleShowInterest = async () => {
  //   setShowInterestButton(false); // Temporarily disable the button
  //   setTimeout(() => setShowInterestButton(true), 3000); // Re-enable after 2 seconds
  // };
 
  const calculateInitialBid1 = (totalPrice) => {
    const bidIncrement = 500;
    const baseBid = 500;
    const bidLevel = Math.floor(totalPrice / 50000);
    return baseBid + (bidLevel * bidIncrement);
  };
  useEffect(() => {
    console.log(selectedProperty?.auctionData[0].startDate);
    if (selectedProperty) {
      const startDate = moment(selectedProperty?.auctionData[0]?.startDate);
      const endDate = moment(selectedProperty?.auctionData[0]?.endDate);
      const now = moment();

      const amount = selectedProperty?.auctionData[0]?.buyers?.length > 0
        ? selectedProperty.auctionData[0].buyers[0].bidAmount
        : selectedProperty?.auctionData[0]?.amount;

      const initialBid = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        : selectedProperty?.auctionData?.[0]?.amount;

    
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

    return `${durationToEnd.days()} Days ${durationToEnd.hours()} Hours ${durationToEnd.minutes()} Minutes `;
  };
  // Handle money input change
  const handleMoneyChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) > backendMoney) {
      setIsSubmitDisabled(false);
    } else if (parseFloat(value) > requiredBid) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  // Handle form submission
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
                `auction/bid/${selectedProperty.auctionData[0]._id}`,
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
  const handleAcceptTerms = (e) => {
    setIsChecked(e.target.checked);
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

  const fetchData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await _get(`/deal/customerInterest/${id}`);
      console.log(response.data.data[0]);
      const data = response.data.data[0];
      console.log(data);
      setProperties(data);
      setShownInterest(data.interestIn);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setProperties, setShownInterest]);
const fetchProperty = useCallback(async () => {
  try {
    const response = await _get(`/property/getpropbyid/Agricultural/${id}`);
    setUserId(response.data.userId);
    console.log("get", response.data);
    setProperty(response.data);

    // Check if auctionData exists and has at least one element before accessing its properties
    if (response.data?.auctionData && response.data.auctionData.length > 0) {
      const endDate = response.data.auctionData[0].endDate;
      const nextDay = moment(endDate).add(1, "days");
      const today = moment();

      if (today.isBefore(nextDay)) {
        setShowNextDay(true);
        console.log("✅ Showing balloons");
      } else {
        setShowNextDay(false);
        console.log("❌ Hiding balloons");
      }
    } else {
      console.log("Auction data not available or empty");
    }

    setShownInterest(response.data.interestedIn);
    setIsPropertyOnHold(response.data.propertyOnHold);
    console.log(response.data.propertyOnHold);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching property:", error);
    setLoading(false);
  }
}, [id, setUserId, setProperty, setShowNextDay, setShownInterest, setIsPropertyOnHold, setLoading]);
  const toggleWishlist = async (item) => {
    console.log(properties);
    console.log(item);
    // let res = "";
    try {
      let propertyType = "Agricultural land";

      if (item.propertyType === "Agricultural land") {
        propertyType = "Agricultural";
      } else if (item.propertyType === "Commercial") {
        propertyType = "Commercial";
      } else {
        propertyType = "Residential";
      }
      // handleShowInterest();
      setisLoading(true);
      const userId = localStorage.getItem("userId");
      const payload = {
        properties: [
          {
            propertyId: item._id,
            propertyType: propertyType,
            propertyName: item.landDetails.title,
            agentId: item.userId,
          },
        ],
        ...(agentrole === 11 && { email: property.agentEmail, customerId: userId }), // Conditionally add email
        interestIn: "1",
        comments: "I am interested in this Property",
      };


      // Send the request
    await _post(
        "/deal/createDeal",
        payload,
        `${item.landDetails.title} added to wishlist`, // Success message
        "Property already added to wishlist" // Error message
      );
      setisLoading(false);
      fetchData(item._id);
      // fetchProperty();

    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };
  const revertPropertyReservation = async (property) => {
    const body = {
      propertyId: property._id,
      propertyType: property.propertyType,
    };

    try {
      await _put("deal/unReserveProperty", body, "Reverted Property Reservation Successfully", "Failed to Revert Reservation");
      fetchProperty();

    } catch (error) {
      console.error("Error assigning agents:", error);
    }
  };
  const [agentrole, setAgentRole] = useState(null);

  const countViews = useCallback(async () => {
    console.log("I am still in this page");
    console.log(id);
  
    try {
      const response = await _put(`views/updateViewCount`, {
        propertyId: id,
        propertyType: "Agriculture",
      });
  
      if (response.data) {
        setViewsCount(response.data.viewsCount || 0); // Update the views count in state
      }
  
      console.log(response.data);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  }, [id, setViewsCount]);
useEffect(() => {
  // Always call fetchProperty
  fetchProperty();

  // Conditionally call fetchData if role is 3 or agentrole is 11
  if (role === 3 || agentrole === 11) {
    fetchData();
  }

  // Logging for debugging purposes
  console.log(id);
  console.log(properties);

  // Set up the timeout for counting views
  const timeout = setTimeout(() => {
    countViews();
  }, 2);

  // Clean up the timeout
  return () => clearTimeout(timeout);
}, [role, agentrole, id, properties, fetchProperty, fetchData, countViews]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInterestButton(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  console.log(ShownInterest);
 

 

  const fetchCropDetails = () => {
    const details = `This land is capable to cultivate crops like ${property.landDetails.crops}`;
    setCropDetails(details);
  };
  const role2=localStorage.getItem("agentrole");
  useEffect(() => {
    const storedRole = localStorage.getItem("agentrole");
    if (storedRole) {
      setAgentRole(parseInt(storedRole));  // Parse and store the agent role
    }
  }, [role2]);
  if (loading) return <div>Loading...</div>;
  const updatedAt = property?.createdAt;
  console.log("Deepika", updatedAt
  )
  const daysSinceCreated = moment.utc().diff(moment(updatedAt), "days");
  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  const handleCloseBookAppointmentModal = () => {
    setIsModalVis(false);
  };
  let latitude = null;
  let longitude = null;
  if (property?.address) {
    latitude = property.address.latitude || null;
    longitude = property.address.longitude || null;
  } else {
    console.log("Address is missing or null.");
  }
  const handleContactClick = () => {
    logEvent("Contact", "Consult an agent", "Agriculture Data");
  };

  const handleHoldOnPropertyClick = (property) => {
    const propertyPrice = property?.landDetails?.totalPrice;
    const razorpayAmount = calculateInitialBid1(propertyPrice);

    if (window.Razorpay) {
      console.log(property);
      const razorpayKeyId = "rzp_test_2OyfmpKkWZJRIP";
      const options = {
        key: razorpayKeyId,
        amount: razorpayAmount * 100,
        currency: "INR",
        name: "Pay Now",
        description: "Payment for temple booking",
        handler: async function (response) {
          const requestData = {
            propId: property._id,
            startDate: new Date().toISOString(),
            transactionId: response.razorpay_payment_id,
            propertyType: property.propertyType,
            reservationAmount: razorpayAmount
          };

          console.log(requestData);

          // Send donation data to the backend
          try {
            const donationResponse = await _post(
              "/deal/holdProperty",
              requestData, // Pass the data object directly
              `Payment Done Successfully`, // Success message
              "Payment Failed"
            );

            if (donationResponse.status === 200 || donationResponse.status === 201) {
              fetchProperty();
            } else {
              toast.error("Donation failed!");
            }

          } catch (error) {
            console.error("Error processing donation:", error);
            toast.error("Something went wrong. Please try again.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      console.error("Razorpay script not loaded.");
      toast.error("Error: Razorpay script failed to load");
    }

  };

  //  For Virtual Tour..


  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return "N/A"; // Return a fallback value
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
    console.log(property);
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
  };




  return (
    <div>
      {property?.auctionData?.[0]?.auctionWinner && showNextDay && (
        <div className="relative w-full h-screen bg-white flex items-center justify-center">
          <h1 className="text-4xl font-bold text-green-600 animate-bounce" style={{ marginLeft: "30%" }}>
            🎉 <b>{property?.auctionData[0]?.winnerData?.buyerName}</b> Won the Auction! 🎉
          </h1>
        </div>
      )}

      <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>

      {/* Check if auctionData is available and if auctionStatus is "active" */}
      {property?.auctionData?.length > 0 && property?.auctionData[0]?.auctionStatus.toLowerCase() === "active" && (
        <Button
          style={{
            backgroundColor: "#ffc107",
            color: "#000",
            padding: "20px 10px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            marginLeft: "40%",
          }}
          onClick={(e) => handleViewAuction(property, e)}
        >
          Participate in Auction
        </Button>
      )}



      <div style={{ padding: "5px" }}>
        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          <Col span={24}>
            <Card
              className="cardHoverEffect"
              style={{
                // backgroundColor: "#f0f4f8",
                padding: "10px",
                border: "0px solid black",
              }}
            >

              {property?.landDetails?.propertyDesc && (
                <Row>
                  <Col span={24}>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        fontWeight: "bold",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faClipboard}
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      Property Description
                    </span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      {property?.landDetails?.propertyDesc.endsWith(".")
                        ? property?.landDetails?.propertyDesc.slice(0, -1) + "."
                        : property?.landDetails?.propertyDesc + "."}
                      {console.log(property?.landDetails?.propertyDesc)}
                    </span>
                  </Col>
                </Row>
              )}
              {property?.landDetails?.litigationDesc && (
                <Row style={{ marginTop: "20px" }}>
                  <Col span={24}>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        fontWeight: "bold",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBalanceScale}
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      Litigation Description
                    </span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      {property?.landDetails?.litigationDesc.endsWith(".")
                        ? property?.landDetails?.litigationDesc.slice(0, -1) +
                        "."
                        : property?.landDetails?.litigationDesc + "."}
                    </span>
                  </Col>
                </Row>
              )}


            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
            <Card
              title={
                <span style={{ fontSize: "20px" }}>
                  {property?.landDetails?.title} ({property?.propertyId})
                </span>
              }
              style={{
                // backgroundColor: "#ffffff",
                padding: screens.xs ? "0px" : "5px",
                fontSize: "15px",
              }}
              extra={
                <>
                  <span
                    style={{
                      backgroundColor: "#eb3a34",
                      color: "white",
                      padding: "5px 10px",
                      borderTopRightRadius: "100px",
                      borderBottomRightRadius:"40px",
                      fontWeight: "bold",
                    }}
                  >
                    Posted {daysSinceCreated} day
                    {daysSinceCreated !== 1 ? "s" : ""} ago
                  </span>

                </>
              }
            >
              <Row>
                <Col span={24}>
                  <div
                    style={{
                      position: "absolute",
                      zIndex: "1",
                      backgroundColor: "gold",
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "bold",
                      padding: "5px",
                    }}
                  >
                    {" "}
                    {formatPrice(property?.landDetails?.totalPrice)}
                  </div>
                  <Carousel autoplay arrows>
                    {(property?.landDetails?.images.length > 0
                      ? property?.landDetails?.images
                      : [
                        "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png",
                      ]
                    ).map((pic, index) => (
                      <div key={index}>
                        <img
                          alt={`property-${index + 1}`}
                          src={
                            pic ||
                            "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png"
                          }
                          style={{
                            width: "100%",
                            height: screens.xs ? "300px" : "385px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
              </Row>

              {/* Display views count */}
              <Row style={{ marginTop: "10px" }}>
                <Col span={24}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                      textAlign: "center",
                    }}
                  >
                    Total Views: {viewsCount}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={16} md={16} lg={16} xl={16} xxl={16}>
                {property?.landDetails?.crops.length > 0 && (
                  <Tooltip title={cropDetails} placement="bottom">
                    <Card
                      hoverable
                      style={{
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #d9d9d9",
                        marginRight: "5px",
                      }}
                      onMouseEnter={() => {
                        fetchCropDetails();
                      }}
                    >
                      <Row>
                        <Col span={24}>
                          <span style={{ fontSize: "15px", color: "black" }}>
                            <FontAwesomeIcon
                              icon={faSeedling}
                              style={{
                                fontSize: "15px",
                                color: "#0d416b",
                                width: "15px",
                              }}
                            />{" "}
                            <strong>More Suitable for:</strong>{" "}
                            <span>
                              {property.landDetails?.crops
                                .slice(0, 2)
                                .join(", ")}
                            </span>
                          </span>
                        </Col>
                      </Row>
                    </Card>
                  </Tooltip>
                )}
                {console.log(localStorage.getItem("userId"))}
                {console.log(property)}
              </Col>

              <Col span={24}>
                {console.log(agentrole)}

                <Card
                  title={
                    <strong
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "black",
                      }}
                    >
                      Details
                    </strong>
                  }
                  style={{
                    // backgroundColor: "#ffffff",
                    padding: "10px",
                    fontSize: "15px",
                    border: "0px solid gray",
                  }}

                  extra={
                    (role === 3 || agentrole === 11) && (
                      <>
                        {isPropertyOnHold === "no" ? (
                          <Button
                            type="primary"
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              padding: "10px",
                              height: "40px",
                              position: "absolute",
                              marginLeft: "-20%",
                              backgroundColor: "#00AAE7",
                              color: "white",
                              borderColor: "white",
                              cursor: "pointer",
                            }}
                            onClick={() => handleHoldOnPropertyClick(property)}
                          >
                            Reserve This Property
                          </Button>
                        ) : (

                          localStorage.getItem("userId") === property?.reservedBy ? (
                            <>
                              <Button
                                type="primary"
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  padding: "10px",
                                  height: "40px",
                                  position: "absolute",
                                  marginLeft: "-20%",
                                  backgroundColor: "green",
                                  color: "white",
                                  borderColor: "white",
                                  cursor: "not-allowed",
                                }}
                                disabled
                              >
                                Property Reserved
                              </Button>

                              {/* Extra "Revert Property" button */}
                              <Button
                                type="primary"
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                  padding: "10px",
                                  height: "40px",
                                  marginLeft: "10px", // Adjust spacing
                                  backgroundColor: "#FF6347", // Red color for revert
                                  color: "white",
                                  borderColor: "white",
                                  cursor: "pointer",
                                }}
                                onClick={() => revertPropertyReservation(property)}
                              >
                                Revert Reservation
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="primary"
                              style={{
                                fontWeight: "bold",
                                fontSize: "12px",
                                padding: "10px",
                                height: "40px",
                                position: "absolute",
                                marginLeft: "-20%",
                                backgroundColor: "lightgray",
                                color: "gray",
                                borderColor: "lightgray",
                                cursor: "not-allowed",
                              }}
                              disabled
                            >
                              Property Reserved
                            </Button>
                          )
                        )}

                        {/* Interest Buttons (Same as Before) */}

                        {!screens.md ? (
                          ShownInterest === "1" ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(property, properties);
                              }}
                              style={{
                                color: "black",
                                backgroundColor: "lightgray",
                                padding: "10px",
                                position: "absolute",
                                marginLeft: property?.reservedBy ? "-60%" : "-40%",
                                fontSize: "20px",
                                height: "40px",
                                cursor: "pointer",
                              }}
                            >
                              Interested <ThumbsUp />
                            </Button>
                          ) : showInterestButton ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(property);
                              }}
                              style={{
                                backgroundColor: "#00AAE7",
                                color: "white",
                                fontSize: "12px",
                                padding: "10px",
                                position: "absolute",
                                marginLeft: property?.reservedBy ? "-60%" : "-40%",
                                height: "40px",
                                cursor: "pointer",
                              }}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Spin size="small" style={{ color: "white" }} /> Show Interest..
                                </>
                              ) : (
                                "Show Interest"
                              )}


                            </Button>
                          ) : (
                            <Button
                              disabled
                              style={{
                                backgroundColor: "#e0e0e0",
                                color: "#000",
                                fontSize: "12px",
                                padding: "10px",
                                position: "absolute",
                                height: "40px",
                                marginLeft: property?.reservedBy ? "-60%" : "-40%",
                                cursor: "not-allowed",
                              }}
                            >
                              <Spin size="small" style={{ marginRight: "8px" }} />
                              Shown Interest
                            </Button>
                          )
                        ) : (
                          <Tooltip title={ShownInterest === "1" ? "Interested" : "Show Interest"} placement="topRight">
                            {ShownInterest === "1" ? (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(property);
                                }}
                                style={{
                                  color: "black",
                                  backgroundColor: "lightgray",
                                  marginLeft: property?.reservedBy ? "-60%" : "-40%",
                                  padding: "10px",
                                  position: "absolute",
                                  cursor: "pointer",
                                  height: "40px",
                                }}
                              >
                                Interested <ThumbsUp />
                              </Button>
                            ) : showInterestButton ? (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(property);
                                }}
                                style={{
                                  backgroundColor: "#00AAE7",
                                  color: "white",
                                  fontSize: "12px",
                                  padding: "10px",
                                  position: "absolute",
                                  marginLeft: property?.reservedBy ? "-60%" : "-40%",
                                  height: "40px",
                                  cursor: "pointer",
                                }}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <Spin size="small" style={{ color: "white" }} /> Show Interest..
                                  </>
                                ) : (
                                  "Show Interest"
                                )}



                              </Button>
                            ) : (
                              <Button
                                disabled
                                style={{
                                  backgroundColor: "#e0e0e0",
                                  color: "#000",
                                  fontSize: "12px",
                                  padding: "10px",
                                  position: "absolute",
                                  marginLeft: property?.reservedBy ? "-60%" : "-40%",
                                  cursor: "not-allowed",
                                  height: "40px",
                                }}
                              >
                                <Spin size="small" style={{ marginRight: "8px" }} />
                                Shown Interest
                              </Button>
                            )}
                          </Tooltip>
                        )}


                        {/* Consult An Agent Button */}
                        <Button
                          type="primary"
                          style={{
                            fontWeight: "bold",
                            color: "white",
                            fontSize: "12px",
                            padding: "10px",
                            height: "40px",
                            marginLeft: localStorage.getItem("userId") === property?.reservedBy ? "0%" : "20%",
                            backgroundColor: "#00AAE7",
                            borderColor: "white",
                            animation: "bounce 1s infinite",
                            transition: "all 0.3s ease-in-out",
                          }}
                          onClick={() => {
                            handleContactClick();
                            setIsModalVis(true);
                          }}
                        >
                          Consult An Agent
                        </Button>
                      </>

                    )
                  }
                  actions={[
                    <div
                      style={{
                        width: "100%",
                        padding: "-20px",
                        color: "black",
                      }}
                    >
                      <PropertyVR />

                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginTop: "2%",
                        }}
                      >
                        <tbody style={{ backgroundColor: "#d2eafc" }}>
                          <tr>
                            <th
                              style={{
                                textAlign: "center",
                                border: "1px solid gray",
                                padding: "10px",
                                width: "50%",
                              }}
                            >
                              Plot Size <small>(in {property?.landDetails?.sizeUnit}): </small>
                              {formatNumberWithCommas(
                                property?.landDetails?.size
                              )}
                            </th>
                            <th
                              style={{
                                textAlign: "center",
                                border: "1px solid gray",
                                padding: "10px",
                                width: "50%",
                              }}
                            >
                              Price <small>(/acre)</small>: â‚¹
                              {formatPrice(property?.landDetails?.price)}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>,
                  ]}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        <AreaChartOutlined
                          style={{
                            fontSize: "15px",
                            color: "#0d416b",
                            width: "15px",
                          }}
                        />{" "}
                        <strong>Survey Number:</strong>{" "}
                        {property?.landDetails?.surveyNumber}
                      </span>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      {property?.landDetails?.litigation && (
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FileTextOutlined
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Litigation:</strong>{" "}
                          {property.landDetails?.litigation ? "Yes" : "No"}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        <EnvironmentOutlined
                          style={{
                            fontSize: "15px",
                            color: "#0d416b",
                            width: "15px",
                          }}
                        />{" "}
                        <strong>Address:</strong>{" "}
                        {property?.address.pinCode !== "000000" && (
                          <>
                            {property?.address.pinCode}

                            <span>, </span>
                          </>
                        )}
                        {property?.address.village},{property?.address.mandal},{" "}
                        {property?.address.district}
                        {/* <p>Latitude:{property.address.latitude}</p>
<p>Longitude:{property.address.longitude}</p> */}
                        <p>
                          <strong>Landmark:</strong> {property?.address.landMark}
                        </p>
                      </span>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                        Amenities
                      </h3>
                    </Col>
                  </Row>
                  <Row>
                    {property?.amenities?.boreWell && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faWater}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Borewell:</strong> Available
                        </span>
                      </Col>
                    )}
                    {property?.amenities?.electricity && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <ThunderboltOutlined
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Electricity: </strong> Available
                        </span>
                      </Col>
                    )}
                    {property?.amenities?.storageFacility && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faWarehouse}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Storage Facility: </strong> Available
                        </span>
                      </Col>
                    )}

                    {property?.amenities?.distanceFromRoad && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faRoad}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Distance from Road:</strong>{" "}
                          {property?.amenities?.distanceFromRoad}Km
                        </span>
                      </Col>
                    )}

                    <Col span={24}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        <FontAwesomeIcon
                          icon={faWater}
                          style={{
                            fontSize: "15px",
                            color: "#0d416b",
                            width: "15px",
                          }}
                        />{" "}
                        {property?.landDetails?.landType === "dryland" ? (
                          <strong>DryLand</strong>
                        ) : (
                          <strong>WetLand</strong>
                        )}
                      </span>
                    </Col>
                  </Row>

                  {/* <Col span={24}>
<span style={{ fontSize: "15px", color: "black" }}>
<FontAwesomeIcon
icon={faWater}
style={{
fontSize: "15px",
color: "#0d416b",
width: "15px",
}}
/>{" "}
{property.landDetails?.landType === "dryland" ? (
<strong>DryLand</strong>
) : (
<strong>WetLand</strong>
)}
</span>
</Col> */}

                  <Row style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                        Agent Details
                      </h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          style={{
                            fontSize: "15px",
                            color: "#0d416b",
                            width: "15px",
                          }}
                        />{" "}
                        <strong>E-mail: </strong> {property?.agentEmail}
                      </span>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          style={{
                            fontSize: "15px",
                            color: "green",
                            width: "15px",
                          }}
                        />{" "}
                        <strong>Phone: </strong> {property?.agentNumber}
                      </span>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Modal
                        title={
                          <div
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={property?.agentProfilePicture}
                              alt={`${property?.agentName}'s profile`}
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                marginTop: "-10%",
                              }}
                            />
                            <div
                              style={{ textAlign: "center", marginTop: "-10%" }}
                            >
                              <strong
                                style={{ fontSize: "16px", display: "block" }}
                              >
                                {property?.agentName}
                              </strong>
                              <p
                                style={{
                                  margin: "5px 0",
                                  color: "gray",
                                  fontSize: "14px",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faWhatsapp}
                                  style={{
                                    marginRight: "5px",
                                    color: "#25D366",
                                  }}
                                />
                                {property?.agentNumber}
                              </p>
                              <p
                                style={{
                                  margin: "5px 0",
                                  color: "gray",
                                  fontSize: "14px",
                                }}
                              >
                                <EnvironmentFilled
                                  style={{
                                    marginRight: "5px",
                                    color: "#0d416b",
                                  }}
                                />{" "}
                                {property?.agentCity}
                              </p>
                              <p
                                style={{
                                  margin: "5px 0",
                                  color: "gray",
                                  fontSize: "14px",
                                }}
                              >
                                Please select the date, time and location to
                                book an appointment with {property?.agentName}.
                              </p>
                            </div>
                          </div>
                        }
                        open={isModalVis}
                        onCancel={handleCloseBookAppointmentModal}
                        footer={null}
                        width={450}
                        style={{
                          marginTop: "-2%",
                          marginRight: !screens.xs && "25%",
                        }}
                      >
                        <Bookappointment
                          id={property?.userId}
                          pid={property?._id}
                          ptype={property?.propertyType}
                          onClose={handleCloseBookAppointmentModal}
                          setIsModalVis={setIsModalVis}
                        />
                      </Modal>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
<Col span={24}>
<Card
className="cardHoverEffect"
style={{
backgroundColor: "#f0f4f8",
padding: "10px",
border: "1px solid black",
}}
>
{property.landDetails?.propertyDesc && (
<Row>
<Col span={24}>
<span
style={{
fontSize: "15px",
color: "#0d416b",
fontWeight: "bold",
}}
>
<FontAwesomeIcon
icon={faClipboard}
style={{
fontSize: "15px",
color: "#0d416b",
width: "15px",
}}
/>{" "}
Property Description
</span>
</Col>
<Col span={24}>
<span style={{ fontSize: "15px", color: "black" }}>
{property.landDetails.propertyDesc.endsWith(".")
? property.landDetails.propertyDesc.slice(0, -1) + "."
: property.landDetails.propertyDesc + "."}
{console.log(property.landDetails.propertyDesc)}
</span>
</Col>
</Row>
)}
{property.landDetails?.litigationDesc && (
<Row style={{ marginTop: "20px" }}>
<Col span={24}>
<span
style={{
fontSize: "15px",
color: "#0d416b",
fontWeight: "bold",
}}
>
<FontAwesomeIcon
icon={faBalanceScale}
style={{
fontSize: "15px",
color: "#0d416b",
width: "15px",
}}
/>{" "}
Litigation Description
</span>
</Col>
<Col span={24}>
<span style={{ fontSize: "15px", color: "black" }}>
{property.landDetails?.litigationDesc.endsWith(".")
? property.landDetails?.litigationDesc.slice(0, -1) +
"."
: property.landDetails?.litigationDesc + "."}
</span>
</Col>
</Row>
)}
</Card>
</Col>
</Row> */}

        <Col span={24} style={{ marginTop: "20px" }}>
          <MapContainer
            center={
              latitude && longitude ? [latitude, longitude] : [15.9129, 79.74]
            }
            zoom={latitude && longitude ? 15 : 6}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {latitude && longitude ? (
              <Marker position={[latitude, longitude]}>
                <Popup>
                  <span>Latitude: {latitude}</span>
                  <br />
                  <span>Longitude: {longitude}</span>
                </Popup>
              </Marker>
            ) : (
              <Marker
                position={[15.9129, 79.74]}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  },
                }}
              >
                <Popup>
                  <span>Look into the map for the property</span>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Col>
      </div>
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
            <Col span={12}><b>Start Date:</b> {selectedProperty?.auctionData[0]?.startDate ? moment(selectedProperty?.auctionData.startDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}><b>End Date:</b> {selectedProperty?.auctionData[0]?.endDate ? moment(selectedProperty?.auctionData.endDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}>
              <b>Basic Bid Amount: ₹</b>
              {selectedProperty?.auctionData[0]?.amount}
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

      {property?.auctionData?.[0]?.auctionWinner && showBalloons && showNextDay && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="balloon"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}
      {property?.auctionData?.[0]?.auctionWinner === userId && showBalloons && showNextDay && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          numberOfPieces={200} // Number of confetti pieces
          gravity={0.2} // Adjust the gravity if you want the confetti to fall faster/slower
        />
      )}
    </div>

  );
};

export default BuyersAgricultureDetails;
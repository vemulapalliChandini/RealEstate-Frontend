import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Carousel,
  Card,
  Button,
  Spin,
  Modal,
  Grid,
  Tooltip,
  Pagination,
  Form, Input,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  AreaChartOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  MedicineBoxOutlined,
  EnvironmentFilled,
  InfoCircleOutlined
} from "@ant-design/icons";


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import Confetti from 'react-confetti';
import { useNavigate, useParams } from "react-router-dom";
import {
  faEnvelope,
  faWater,
  faSwimmingPool,
  faGamepad,
  faDumbbell,
  faBuilding,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import Bookappointment from "./BookAppointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { _get, _put, _post, _delete } from "../../../Service/apiClient";
import moment from "moment";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { GiCheckedShield } from "react-icons/gi";
import { BsShieldFillCheck } from "react-icons/bs";
import { FaShieldAlt } from "react-icons/fa";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { logEvent } from "../../../analytics";

const { useBreakpoint } = Grid;
export default function BuyersLayoutDetails() {
  const agentsRef = useRef(null);
  const screens = useBreakpoint();
  const [layout, setLayout] = useState(null);
  const [findAgents] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalVis, setIsModalVis] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [wishlist, setWishlist] = useState("");
  const [properties, setProperties] = useState(null);
  const [showInterestButton, setShowInterestButton] = useState(false);
  const [ShownInterest, setShownInterest] = useState(null);
  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);

  const [agentrole] = useState(null);
  const [isPropertyOnHold, setIsPropertyOnHold] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  //  pagination code..
  const [currentPages, setCurrentPages] = useState(1);
  const itemsPerPages = 8;
  const [showNextDay, setShowNextDay] = useState(false);
  const handlePageChange = (page) => {
    setCurrentPages(page);
  };
  const [showBalloons, setShowBalloons] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const userId = localStorage.getItem("userId");
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBalloons(false);
    }, 5000); // Remove balloons after 5 seconds

    return () => clearTimeout(timer);
  }, []);
  const role = localStorage.getItem("role");
  const fetchData = async (id) => {
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
  };
  const fetchLayout = useCallback(async () => {
    try {
      const response = await _get(`/property/getpropbyid/Layout/${id}`);
      console.log(response.data);
      setLayout(response.data);
      setIsPropertyOnHold(response.data.propertyOnHold);
      setShownInterest(response.data.interestedIn);
      setLoading(false);
      if (response.data?.auctionData[0]?.endDate) {
        const endDate = response.data?.auctionData?.[0].endDate;
        const nextDay = moment(endDate).add(1, "days");
        const today = moment();


        if (today.isBefore(nextDay)) {
          setShowNextDay(true);
          console.log("✅ Showing balloons");
        } else {
          setShowNextDay(false);
          console.log("❌ Hiding balloons");
        }
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching layout:", error);
      setLoading(false);
    }
  }, [id]);
  const handleHoldOnPropertyClick = () => {


    if (window.Razorpay) {

      const razorpayKeyId = "rzp_test_2OyfmpKkWZJRIP";
      const options = {
        key: razorpayKeyId,
        amount: 1500 * 100,
        currency: "INR",
        name: "Pay Now",
        description: "Payment for temple booking",
        handler: async function (response) {
          const requestData = {

            propId: layout._id,
            startDate: new Date().toISOString(),
            transactionId: response.razorpay_payment_id,
            propertyType: layout.propertyType,
            reservationAmount: 15000

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
              fetchLayout();
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
  const revertPropertyReservation = async (property) => {
    const body = {
      propertyId: property._id,
      propertyType: property.propertyType,
    };

    try {
      await _put("deal/unReserveProperty", body, "Reverted Property Reservation Successfully", "Failed to Revert Reservation");
      fetchLayout();

    } catch (error) {
      console.error("Error assigning agents:", error);
    }
  };

  const handleContactClick = () => {
    logEvent("Contact", "Consult an agent", "Agriculture Data");
  };

  useEffect(() => {
    if (findAgents && agentsRef.current) {
      agentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [findAgents]);

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
  const countViews = useCallback(async () => {
    console.log("I am still in this page");
    console.log(id);

    try {
      const response = await _put(`views/updateViewCount`, {
        propertyId: id,
        propertyType: "Layout",
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
    fetchLayout();
    fetchData();
    const interval = setTimeout(() => {
      countViews();
    }, 10000); //10 seconds interval

    return () => clearInterval(interval);
  }, [countViews, fetchLayout]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInterestButton(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  const toggleWishlist = async (layout) => {
    try {
      if (wishlist.includes(layout._id)) {
        await _delete(
          `/wishlist/delete/${layout._id}`,
          `${layout.layoutDetails.layoutTitle} removed from wishlist`
        );

        setWishlist(wishlist.filter((id) => id !== layout._id));
      } else {
        // handleShowInterest();
        setisLoading(true);

        // Send the request

        setWishlist([...wishlist, layout._id]);
      }
      // fetchLayout();
      setisLoading(false);
      fetchData(layout._id);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };
  const handleViewAuction = (property) => {
    console.log(property);
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
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



  const handleCloseBookAppointmentModal = () => {
    setIsModalVis(false);
  };
  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
        <Spin
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
          }}
        />
        <p>Loading Property Details...</p>
      </div>
    );
  }

  if (!layout) {
    return <p>Property not found</p>;
  }

  const { layoutDetails, amenities, uploadPics } = layout;

  const updatedAt = layout.createdAt;

  const daysSinceCreated = moment().diff(moment(updatedAt), "days");






  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const latitude = layoutDetails.address?.latitude || null;

  const longitude = layoutDetails.address?.longitude || null;

  return (
    <div style={{ padding: "10px" }}>
      {layout?.auctionData?.[0]?.auctionWinner && showNextDay && (
        <div className="relative w-full h-screen bg-white flex items-center justify-center">
          <h1 className="text-4xl font-bold text-green-600 animate-bounce " style={{ marginLeft: "30%" }}>
            🎉 <b>{layout?.auctionData?.[0]?.winnerData?.buyerName}</b> Won the Auction! 🎉
          </h1>
        </div>)}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Back Button on the Left */}
        <div
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        </div>

        {/* Download Brochure Button on the Right */}
        {layout.layoutDetails.brochure && (
          <div>
            <Button
              style={{ backgroundColor: "#0D416B", color: "white",fontWeight:"bold" }}
              onClick={() => {
                const link = document.createElement("a");
                link.href = layout.layoutDetails.brochure;
                link.download = "Brochure.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Brochure
            </Button>
          </div>
        )}
      </div>


      {layout.auctionStatus && layout.auctionStatus.toLowerCase() === "active" && (

        <Button
          style={{

            backgroundColor: "#ffc107",
            color: "#000",
            padding: "20px 10px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            marginLeft: "40%",
            fontWeight: "bold",
          }}
          onClick={(e) => handleViewAuction(layout, e)}
        >
          Participate in Auction
        </Button>
      )}
      <div style={{ padding: "10px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
            <Card
              title={
                <span style={{ fontSize: "20px" }}>
                  {layoutDetails.layoutTitle} {layoutDetails.propertyId}
                </span>
              }
              style={{
                backgroundColor: "#ffffff",
                padding: screens.xs ? "0px" : "5px",
                fontSize: "15px",
              }}
              extra={
                <span
                  style={{
                    backgroundColor: "#eb3a34",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Posted {daysSinceCreated} day
                  {daysSinceCreated !== 1 ? "s" : ""} ago
                </span>
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
                    ₹ {formatPrice(layoutDetails.totalAmount)}
                  </div>

                  <Carousel autoplay arrows>
                    {(uploadPics.length > 0
                      ? uploadPics
                      : [
                        "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png",
                      ]
                    ).map((photo, index) => (
                      <div key={index}>
                        <img
                          alt={`Layout  ${index + 1}`}
                          src={
                            photo ||
                            "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                          }
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
              </Row>
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
                backgroundColor: "#ffffff",
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
                        onClick={() => handleHoldOnPropertyClick(layout)}
                      >
                        Reserve This Property
                      </Button>
                    ) : (

                      localStorage.getItem("userId") === layout?.reservedBy ? (
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
                            onClick={() => revertPropertyReservation(layout)}
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
                            toggleWishlist(layout, properties);
                          }}
                          style={{
                            color: "black",
                            backgroundColor: "lightgray",
                            padding: "10px",
                            position: "absolute",
                            marginLeft: layout?.reservedBy ? "-60%" : "-40%",
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
                            toggleWishlist(layout);
                          }}
                          style={{
                            backgroundColor: "#00AAE7",
                            color: "white",
                            fontSize: "12px",
                            padding: "10px",
                            position: "absolute",
                            marginLeft: layout?.reservedBy ? "-60%" : "-40%",
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
                            marginLeft: layout?.reservedBy ? "-60%" : "-40%",
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
                              toggleWishlist(layout);
                            }}
                            style={{
                              color: "black",
                              backgroundColor: "lightgray",
                              marginLeft: layout?.reservedBy ? "-60%" : "-40%",
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
                              toggleWishlist(layout);
                            }}
                            style={{
                              backgroundColor: "#00AAE7",
                              color: "white",
                              fontSize: "12px",
                              padding: "10px",
                              position: "absolute",
                              marginLeft: layout?.reservedBy ? "-60%" : "-40%",
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
                              marginLeft: layout?.reservedBy ? "-60%" : "-40%",
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
                        backgroundColor: "#00AAE7",
                        borderColor: "white",
                        animation: "bounce 1s infinite",
                        transition: "all 0.3s ease-in-out",
                        marginLeft: localStorage.getItem("userId") === layout?.reservedBy ? "0%" : "20%",
                      }}
                      onClick={() => {
                        handleContactClick();
                        setAgentId(layout.userId);
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
                  style={{ width: "100%", padding: "-20px", color: "black" }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
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
                          Plot Size<small>(in {layoutDetails.sizeUnit})</small>:{" "}
                          {formatNumberWithCommas(layoutDetails.plotSize)}
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            border: "1px solid gray",
                            padding: "10px",
                            width: "50%",
                          }}
                        >
                          Price<small>(/{layoutDetails.priceUnit})</small>: ₹
                          {formatPrice(layoutDetails.plotPrice)}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>,
              ]}
            >
              <Row>
                {layoutDetails?.availablePlots !== 0 && (
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <AreaChartOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Available Plots: </strong>{" "}
                      {layoutDetails.availablePlots}
                    </span>
                  </Col>
                )}
                {layoutDetails?.plotCount !== 0 && (
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <FileTextOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Plot Count:</strong> {layoutDetails.plotCount}
                    </span>
                  </Col>
                )}
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
                    {layoutDetails.address.pinCode !== "000000" && (
                      <>
                        {layoutDetails.address.pinCode}
                        <span>, </span>
                      </>
                    )}
                    {layoutDetails.address.village},{" "}
                    {layoutDetails.address.mandal},{" "}
                    {layoutDetails.address.district}.
                  </span>
                </Col>
              </Row>

              <Row style={{ marginTop: "10px" }}>
                <Col span={24}>
                  <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                    Approvals
                  </h3>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <span style={{ fontSize: "15px", color: "black" }}>
                    <AiFillSafetyCertificate
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        width: "15px",
                      }}
                    />{" "}
                    <strong>RERA:</strong>{" "}
                    {layoutDetails.reraRegistered ? "Approved" : "Not Approved"}
                  </span>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <span style={{ fontSize: "15px", color: "black" }}>
                    <FaShieldAlt
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        width: "15px",
                      }}
                    />{" "}
                    <strong>DTCP:</strong>{" "}
                    {layoutDetails.dtcpApproved ? "Approved" : "Not Approved"}
                  </span>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <span style={{ fontSize: "15px", color: "black" }}>
                    <BsShieldFillCheck
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        width: "15px",
                      }}
                    />{" "}
                    <strong>FLP:</strong>{" "}
                    {layoutDetails.flpApproved ? "Approved" : "Not Approved"}
                  </span>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <span style={{ fontSize: "15px", color: "black" }}>
                    <GiCheckedShield
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        width: "15px",
                      }}
                    />{" "}
                    <strong>TLP:</strong>{" "}
                    {layoutDetails.tlpApproved ? "Approved" : "Not Approved"}
                  </span>
                </Col>
              </Row>

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
                    <strong>E-mail:</strong> {layout.agentEmail}
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
                    <strong>Phone:</strong> {layout.agentNumber}
                  </span>
                </Col>

                <Modal
                  title={
                    <div
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={layout.agentProfilePicture}
                        alt={`${layout.agentName}'s profile`}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          marginTop: "-10%",
                        }}
                      />
                      <div style={{ textAlign: "center", marginTop: "-10%" }}>
                        <strong style={{ fontSize: "16px", display: "block" }}>
                          {layout.agentName}
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
                          {layout.agentNumber}
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
                          {layout.agentCity}
                        </p>
                        <p
                          style={{
                            margin: "5px 0",
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          Please select the date, time and location to book an
                          appointment with {layout.agentName}.
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
                    id={agentId}
                    pid={layout._id}
                    ptype={layout.propertyType}
                    onClose={handleCloseBookAppointmentModal}
                    setIsModalVis={setIsModalVis}
                  />
                </Modal>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          <Col span={24}>
            {(amenities?.underGroundWater ||
              amenities?.swimmingPool ||
              amenities?.electricityFacility ||
              amenities?.drainageSystem ||
              amenities?.playZone ||
              amenities?.gym ||
              amenities?.conventionHall ||
              amenities?.educational ||
              amenities?.medical ||
              layoutDetails.description !== undefined) && (
                <Card
                  className="cardHoverEffect"
                  style={{
                    // backgroundColor: "#f0f4f8",
                    padding: "10px",
                    border: "0px solid black",
                  }}
                >
                  {layoutDetails.description !== undefined && (
                    <Row>
                      <Col span={24}>
                        <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                          Property Description
                        </h3>
                      </Col>
                      <Col span={24}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          {layoutDetails.description.endsWith(".")
                            ? layoutDetails.description.slice(0, -1) + "."
                            : layoutDetails.description + "."}
                        </span>
                      </Col>
                    </Row>
                  )}
                  {(amenities?.underGroundWater ||
                    amenities?.swimmingPool ||
                    amenities?.electricityFacility ||
                    amenities?.drainageSystem ||
                    amenities?.playZone ||
                    amenities?.gym ||
                    amenities?.conventionHall ||
                    amenities?.educational ||
                    amenities?.medical) && (
                      <Row gutter={[0, 16]} style={{ marginTop: "10px" }}>
                        <Col span={24}>
                          <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                            Amenities
                          </h3>
                        </Col>
                      </Row>
                    )}
                  <Row gutter={[0, 8]}>
                    {amenities?.underGroundWater && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faWater}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Water Facility:</strong>{" "}
                          {amenities?.underGroundWater && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.swimmingPool && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faSwimmingPool}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Swimming Pool:</strong>{" "}
                          {amenities?.swimmingPool && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.electricityFacility && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <ThunderboltOutlined
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong> Electricity Facility: </strong>{" "}
                          {amenities?.electricityFacility && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.drainageSystem && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <CheckCircleFilled
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Drainage System:</strong>{" "}
                          {amenities?.drainageSystem && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.playZone && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faGamepad}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Play Zone: </strong>{" "}
                          {amenities?.playZone && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.gym && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faDumbbell}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Gym: </strong> {amenities?.gym && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.conventionHall && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faBuilding}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Convention Hall: </strong>{" "}
                          {amenities?.conventionHall && "Available"}
                        </span>
                      </Col>
                    )}
                    {amenities?.educational && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faGraduationCap}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Educational Institute: </strong>{" "}
                          {amenities.educational}
                          <small>km</small>
                        </span>
                      </Col>
                    )}
                    {amenities?.medical && (
                      <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <MedicineBoxOutlined
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Medical Clinic: </strong> {amenities.medical}
                          <small>km</small>
                        </span>
                      </Col>
                    )}
                  </Row>
                </Card>
              )}
          </Col>

          <div style={{ padding: "20px" }}>
            <Row gutter={[16, 16]}>
              {layoutDetails.plots.map((plot) => (

                // {currentData.map((plot) => (
                <Col xs={24} sm={12} md={12} lg={12} key={plot.plotId}>
                  <Card
                    bordered={true}
                    style={{
                      textAlign: "center",
                      backgroundColor: "rgba(159, 159, 167, 0.23)",
                      position: "relative",
                      padding: "0px"
                    }}
                  >
                    {/* Image Section with Overlay Text */}
                    <div style={{ position: "relative", textAlign: "center" }}>
                      {(uploadPics.length > 0 ? uploadPics : [
                        "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png",
                      ]).map((photo, index) => (
                        <div key={index} style={{ position: "relative", display: "inline-block" }}>
                          <img
                            alt={`Layout ${index + 1}`}
                            src={photo}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "150px",
                              borderRadius: "8px",
                            }}
                          />
                          {/* Overlay for Plot Size on Image */}
                          <div
                            style={{
                              position: "absolute",
                              top: "0px",
                              right: "0px",
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              color: "white",
                              padding: "5px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            {plot.plotLength
                            } * {plot.plotWidth}
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              top: "0px",
                              left: "0px",
                              backgroundColor: "#0d416b",
                              color: "#fff",
                              padding: "5px",
                              borderRadius: "4px",

                            }}
                          >
                            <strong>{`Plot ${plot.plotId}`}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Plot ID and Price Section */}


                    {/* Price Tag */}

                    {/* Size and Price Info Below Image */}
                    <div style={{ marginTop: "10px", textAlign: "left", padding: "0 10px" }}>
                      <p>
                        <strong>Size:</strong> {plot.plotSize} {plot.sizeUnit}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹ {formatPrice(plot.plotAmount)} per {plot.sizeUnit}
                      </p>
                    </div>
                  </Card>
                </Col>

              ))}
            </Row>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Pagination
                align="center"
                current={currentPages}
                pageSize={itemsPerPages}
                total={layoutDetails.plots.length}
                onChange={handlePageChange}
              />
            </div>
          </div>

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
        </Row>
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
            <Col span={12}>
              <b>Start Date:</b>{" "}
              {selectedProperty?.auctionData?.[0]?.startDate
                ? moment(selectedProperty.auctionData[0].startDate).format("YYYY-MM-DD")
                : "N/A"}
            </Col>
            <Col span={12}>
              <b>End Date:</b>{" "}
              {selectedProperty?.auctionData?.[0]?.endDate
                ? moment(selectedProperty.auctionData[0].endDate).format("YYYY-MM-DD")
                : "N/A"}
            </Col>

            <Col span={12}>
              <b>Basic Bid Amount: ₹</b>
              {selectedProperty?.auctionData?.[0]?.amount}
            </Col>
            <Col span={12}>
              <b>Auction Type :</b> {selectedProperty?.auctionData?.[0]?.auctionType}
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

      {layout?.auctionData?.[0]?.auctionWinner && showBalloons && showNextDay && (
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
      {layout?.auctionData?.[0]?.auctionWinner === userId && showBalloons && (
        <Confetti
          width={windowWidth}
          height={windowHeight}
          numberOfPieces={200} // Number of confetti pieces
          gravity={0.2} // Adjust the gravity if you want the confetti to fall faster/slower
        />
      )}
    </div>
  );
}

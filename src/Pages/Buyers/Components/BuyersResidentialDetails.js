import React, { useState, useEffect,useCallback } from "react";
import {
  Row,
  Col,
  Carousel,
  Card,
  Button,
  Modal,
  Spin,
  Tooltip,
  Grid,
  Pagination, Input, Form
} from "antd";


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";






import {
  HomeOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  GoldOutlined,
  LayoutOutlined,
  ExpandOutlined,
  MedicineBoxOutlined,
  UpOutlined,
  CarOutlined,
  RocketOutlined,
  EnvironmentFilled,
  SafetyCertificateFilled,
  CameraFilled,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Bookappointment from "./BookAppointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faDumbbell,
  faBath,
  faBed,
  faGraduationCap,
  faLandmark,
  faWater,
  faHourglass,
  faSign,
  faThumbtack,
  faDoorOpen,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment";
import { _get, _put, _post, _delete } from "../../../Service/apiClient";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { logEvent } from "../../../analytics";

import Confetti from 'react-confetti';
const { useBreakpoint } = Grid;

export default function ResidentialDetails() {
  const screens = useBreakpoint();
  const formatPrice = (price) => {
    if (price == null || isNaN(price)) {
      return "N/A"; // Handle undefined or invalid values
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


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredFurnish, setHoveredFurnish] = useState(false);
  const [hoveredLayout, setHoveredLayout] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalVis, setIsModalVis] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [wishlist, setWishlist] = useState("");
  // const [currentPage] = useState(1);
  const [showInterestButton, setShowInterestButton] = useState(false);
  const [properties, setProperties] = useState(null);
  const [ShownInterest, setShownInterest] = useState(null);
  const [isPropertyOnHold, setIsPropertyOnHold] = useState("");
  const [currentPages, setCurrentPages] = useState(1);
  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [showNextDay, setShowNextDay] = useState(false);
  const itemsPerPages = 8;
  const userId=localStorage.getItem("userId");
  // const pageSize = 4;
   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    // const userId=localStorage.getItem("userId");
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
    }, []); // Ensure dependencies are minimal
    
  const [showBalloons, setShowBalloons] = useState(true);
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await _get(`/property/getpropbyid/Residential/${id}`);
  
      setProduct(response.data);
      setIsPropertyOnHold(response.data.propertyOnHold);
      setShownInterest(response.data.interestedIn);
      setLoading(false);
  
      if (response.data?.auctionData?.[0]?.endDate) {
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
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  }, [id]);
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowBalloons(false);
      }, 5000); // Remove balloons after 5 seconds
  
      return () => clearTimeout(timer);
    }, []);
  const revertPropertyReservation = async (property) => {

    const body = {
      propertyId: property._id,
      propertyType: property.propertyType,
    };

    try {
      await _put("deal/unReserveProperty", body, "Reverted Property Reservation Successfully", "Failed to Revert Reservation");
      fetchProduct();

    } catch (error) {
      console.error("Error assigning agents:", error);
    }
  };

  const handleContactClick = () => {
    logEvent("Contact", "Consult an agent", "Agriculture Data");
  };
  const handlePageChange = (page) => {
    setCurrentPages(page);
  };
  const groupedFlats = product?.propertyDetails?.flat.reduce((acc, plot) => {
    if (plot.floorNumber !== undefined && plot.floorNumber !== null) { // Ensure floor number is defined
      if (!acc[plot.floorNumber]) {
        acc[plot.floorNumber] = [];
      }
      acc[plot.floorNumber].push(plot);
    }
    return acc;
  }, {});
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

      // setReservationAmount(initialBid);2
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
  const handleMoneyChange = (e) => {
    const value = e.target.value;
    // setEnteredMoney(value);
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
  const countViews = useCallback(async () => {
    console.log("I am still in this page");
    console.log(id);
    try {
      await _put(`views/updateViewCount`, {
        propertyId: id,
        propertyType: "Residential",
      });
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  }, [id]); 
  useEffect(() => {
    fetchProduct();
    fetchData();

    const interval = setTimeout(() => {
      countViews();
    }, 10000); // 10 seconds interval

    return () => clearTimeout(interval);
  }, [fetchProduct, fetchData, countViews]); 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInterestButton(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const [agentrole, setAgentRole] = useState(null);
  const role = parseInt(localStorage.getItem("role"));
  const agentrole1=localStorage.getItem("agentrole");
  useEffect(() => {
    const storedRole = localStorage.getItem("agentrole");
    if (storedRole) {
      setAgentRole(parseInt(storedRole));  // Parse and store the agent role
    }
  }, [agentrole1]);
  const toggleWishlist = async (product) => {
    // let res = "";
    try {
      let propertyType = "Residential";

      if (wishlist.includes(product._id)) {
        await _delete(
          `/wishlist/delete/${product._id}`,
          `${product.propertyDetails.apartmentName} removed from wishlist`
        );

        setWishlist(wishlist.filter((id) => id !== product._id));
      } else {
        // handleShowInterest();
        setisLoading(true);
        const userId = localStorage.getItem("userId");
        const payload = {
          properties: [
            {
              propertyId: product._id,
              propertyType: propertyType,
              propertyName: product.propertyDetails.apartmentName,
              agentId: product.userId,
            },
          ],
          ...(agentrole === 11 && { email: product.agentEmail, customerId: userId }),
          interestIn: "1",
          comments: "Iam intersted in this Property",
        };

        // Send the request
        await _post(
          "/deal/createDeal",
          payload,
          `${product.propertyDetails.apartmentName} added to wishlist`, // Success message
          "Property already added to wishlist" // Error message
        );

        setWishlist([...wishlist, product._id]);
      }
      // fetchProduct();
      setisLoading(false);
      fetchData(product._id);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };
  const handleHoldOnPropertyClick = () => {


    if (window.Razorpay) {
      console.log(product);
      const razorpayKeyId = "rzp_test_2OyfmpKkWZJRIP";
      const options = {
        key: razorpayKeyId,
        amount: 1500 * 100,
        currency: "INR",
        name: "Pay Now",
        description: "Payment for temple booking",
        handler: async function (response) {
          const requestData = {

            propId: product._id,
            startDate: new Date().toISOString(),
            transactionId: response.razorpay_payment_id,
            propertyType: product.propertyType,
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
              fetchProduct();
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

  // const handleShowInterest = async () => {
  //   setShowInterestButton(false); // Temporarily disable the button
  //   setTimeout(() => setShowInterestButton(true), 3000); // Re-enable after 2 seconds
  // };

 

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // This centers the loader
        }} />
        <p>Loading Property Details...</p>
      </div>
    );
  }

  const handleCloseBookAppointmentModal = () => {
    setIsModalVis(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  const updatedAt = product.createdAt;

  const daysSinceCreated = moment().diff(moment(updatedAt), "days");

  const getStarColor = () => "#f5d03d";

  const Star = ({ isHalf }) => (
    <span style={{ color: getStarColor(), fontSize: "20px" }}>
      {isHalf ? "☆" : "★"}
    </span>
  );

  const averageRating = product.rating || 0;

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  const totalStars = averageRating > 0 ? fullStars + (hasHalfStar ? 1 : 0) : 0;


  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };


  const latitude = product.address?.latitude || null;
  const longitude = product.address?.longitude || null;



  return (
    <div style={{ padding: "10px" }}>
       {product?.auctionData?.[0]?.auctionWinner && showNextDay && (
        <div className="relative w-full h-screen bg-white flex items-center justify-center">
          <h1 className="text-4xl font-bold text-green-600 animate-bounce " style={{ marginLeft: "30%" }}>
            🎉 <b>{product?.auctionData?.[0]?.winnerData?.buyerName}</b> Won the Auction! 🎉
          </h1>
        </div>)}
      <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>
      {product.auctionStatus && product.auctionStatus.toLowerCase() === "active" && (

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
          onClick={(e) => handleViewAuction(product, e)}
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
                  {product.propertyDetails.apartmentName} {product.propertyId}
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
                    ₹{" "}
                    {formatPrice(product.propertyDetails.totalCost)}
                  </div>
                  <Carousel autoplay arrows>
                    {(product.propPhotos.length > 0
                      ? product.propPhotos
                      : ["https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"]
                    ).map((photo, index) => (
                      <div key={index}>
                        <img
                          alt={`Property  ${index + 1}`}
                          src={photo || "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"}
                          style={{
                            width: "100%",
                            height: screens.md ? "410px" : "300px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>

                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
            <Row gutter={[8, 8]}>
              <Col
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faBed}
                  style={{ fontSize: "24px", color: "#0d416b" }}
                />
                <span style={{ marginTop: "8px" }}>
                  {product.propertyDetails.apartmentLayout.includes("BHK") ? (
                    <strong>
                      {parseInt(product.propertyDetails.apartmentLayout)}{" "}
                      Bedrooms
                    </strong>
                  ) : (
                    "Unknown Layout"
                  )}
                </span>
              </Col>
              <Col
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faBath}
                  style={{ fontSize: "24px", color: "#0d416b" }}
                />

                <span style={{ marginTop: "8px" }}>
                  <strong>
                    {product.configurations?.bathroomCount || "1"} Bathrooms
                  </strong>
                </span>
              </Col>
              <Col
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faLandmark}
                  style={{ fontSize: "24px", color: "#0d416b" }}
                />
                <span style={{ marginTop: "8px" }}>
                  <strong>
                    {product.configurations?.balconyCount !== undefined
                      ? product.configurations?.balconyCount
                      : "No"}{" "}
                    Balcony
                  </strong>
                </span>
              </Col>
              <Col
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Card
                  style={{
                    position: "relative",
                    backgroundColor: "#f0f4f8",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    overflow: "visible",
                    height: "70px",
                    width: "85%",
                  }}
                  onMouseEnter={() => setHoveredFurnish(true)}
                  onMouseLeave={() => setHoveredFurnish(false)}
                >
                  <HomeOutlined
                    style={{ fontSize: "15px", marginRight: "1px" }}
                  />
                  <span style={{ fontSize: "15px", color: "black" }}>
                    {" "}
                    <strong>
                      {product.propertyDetails.furnitured === "Full"
                        ? "Fully Furnished"
                        : "Semi Furnished"}
                    </strong>
                  </span>

                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      opacity: hoveredFurnish ? 1 : 0,
                      visibility: hoveredFurnish ? "visible" : "hidden",
                      transition: "opacity 0.3s, visibility 0.3s",
                      zIndex: 2,
                      whiteSpace: "nowrap",
                      marginTop: "5px",
                    }}
                  >
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        {product.propertyDetails.apartmentLayout}
                      </span>
                      <br />
                      <span>Flooring: Carpet</span>
                    </span>
                  </div>
                </Card>
              </Col>
              <Col
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Card
                  style={{
                    position: "relative",
                    backgroundColor: "#f0f4f8",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    overflow: "visible",
                    height: "70px",
                    width: "85%",
                  }}
                >
                  <ExpandOutlined
                    style={{ fontSize: "16px", marginRight: "8px" }}
                  />
                  <span style={{ fontSize: "15px", color: "black" }}>
                    <strong>
                      {formatNumberWithCommas(product.propertyDetails.flatSize)}{" "}
                      {product.propertyDetails.sizeUnit}
                    </strong>
                  </span>
                </Card>
              </Col>
              <Col
                xs={12}
                sm={8}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Card
                  bordered={false}
                  style={{
                    position: "relative",
                    backgroundColor: "#f0f4f8",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    overflow: "visible",
                    height: "70px",
                    width: "85%",
                  }}
                  onMouseEnter={() => setHoveredLayout(true)}
                  onMouseLeave={() => setHoveredLayout(false)}
                >
                  <LayoutOutlined
                    style={{ fontSize: "16px", marginRight: "8px" }}
                  />
                  <span style={{ fontSize: "15px", color: "black" }}>
                    <strong>{product.propertyDetails.apartmentLayout}</strong>
                  </span>

                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#ffffff",
                      border: "1px solid #ddd",
                      padding: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      opacity: hoveredLayout ? 1 : 0,
                      visibility: hoveredLayout ? "visible" : "hidden",
                      transition: "opacity 0.3s, visibility 0.3s",
                      zIndex: 2,
                      whiteSpace: "nowrap",
                      marginTop: "5px",
                    }}
                  >
                    <span style={{ marginTop: "8px" }}>
                      {product.propertyDetails.apartmentLayout.includes("BHK")
                        ? `${parseInt(
                          product.propertyDetails.apartmentLayout
                        )} Bedrooms`
                        : "Unknown Layout"}
                    </span>

                    <br />
                    <span style={{ marginTop: "8px" }}>
                      {product.configurations?.bathroomCount} Bathrooms
                    </span>
                    <br />
                    <span style={{ marginTop: "8px" }}>
                      {product.configurations?.balconyCount} Balcony
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col span={24}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "black",
                          }}
                        >
                          Details
                        </strong>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {averageRating > 0 && (
                          <Tooltip
                            title={
                              <span
                                style={{ fontSize: "15px", color: "black" }}
                              >
                                <strong>Rated by:</strong> {product.ratingCount}{" "}
                                {product.ratingCount === 1
                                  ? "person"
                                  : "people"}
                              </span>
                            }
                            overlayInnerStyle={{
                              backgroundColor: "white",
                              color: "black",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "15px",
                                color: "black",
                                marginRight: "5px",
                              }}
                            >
                              <strong>Rating:</strong> ({averageRating})
                            </span>
                          </Tooltip>
                        )}
                        {[...Array(totalStars)].map((_, index) => (
                          <Star
                            key={index}
                            isHalf={index === fullStars && hasHalfStar}
                            style={{ fontSize: "15px", color: "gold" }}
                          />
                        ))}
                      </div>

                      <div>
                        {(role === 3 || agentrole === 11) && (
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
                                onClick={() => handleHoldOnPropertyClick(product)}
                              >
                                Reserve This Property
                              </Button>
                            ) : localStorage.getItem("userId") === product?.reservedBy ? (
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

                                {/* Revert Property Button */}
                                <Button
                                  type="primary"
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    padding: "10px",
                                    height: "40px",
                                    marginLeft: "10px",
                                    backgroundColor: "#FF6347",
                                    color: "white",
                                    borderColor: "white",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => revertPropertyReservation(product)}
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
                            )}

                            {/* Interest Buttons */}

                            {(!screens.md ? (
                              ShownInterest === "1" ? (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(product, properties);
                                  }}
                                  style={{
                                    color: "black",
                                    backgroundColor: "lightgray",
                                    padding: "10px",
                                    position: "absolute",
                                    marginLeft: product?.reservedBy ? "-60%" : "-40%",
                                    fontSize: "16px",
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
                                    toggleWishlist(product);
                                  }}
                                  style={{
                                    backgroundColor: "#00AAE7",
                                    color: "white",
                                    fontSize: "12px",
                                    padding: "10px",
                                    position: "absolute",
                                    marginLeft: product?.reservedBy ? "-60%" : "-40%",
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
                                    marginLeft: product?.reservedBy ? "-60%" : "-40%",
                                    cursor: "not-allowed",
                                  }}
                                >
                                  <Spin size="small" style={{ marginRight: "8px" }} />
                                  Shown Interest
                                </Button>
                              )
                            ) : (
                              <Tooltip
                                title={ShownInterest === "1" ? "Interested" : "Show Interest"}
                                placement="topRight"
                              >
                                {ShownInterest === "1" ? (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleWishlist(product, properties);
                                    }}
                                    style={{
                                      color: "black",
                                      backgroundColor: "lightgray",
                                      padding: "10px",
                                      position: "absolute",
                                      marginLeft: product?.reservedBy ? "-60%" : "-40%",
                                      fontSize: "16px",
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
                                      toggleWishlist(product);
                                    }}
                                    style={{
                                      backgroundColor: "#00AAE7",
                                      color: "white",
                                      fontSize: "12px",
                                      padding: "10px",
                                      position: "absolute",
                                      marginLeft: product?.reservedBy ? "-60%" : "-40%",
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
                                      marginLeft: product?.reservedBy ? "-60%" : "-40%",
                                      cursor: "not-allowed",
                                      height: "40px",
                                    }}
                                  >
                                    <Spin size="small" style={{ marginRight: "8px" }} />
                                    Shown Interest
                                  </Button>
                                )}
                              </Tooltip>
                            ))}

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
                                marginLeft: localStorage.getItem("userId") === product?.reservedBy ? "0%" : "20%",
                                // marginLeft: "20%"
                              }}
                              onClick={() => {
                                handleContactClick();
                                setAgentId(product.userId);
                                // setAgentName(product.agentName);
                                setIsModalVis(true);
                              }}
                            >
                              Consult An Agent
                            </Button>
                          </>
                        )}
                      </div>

                    </div>
                  }
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "10px",
                    fontSize: "15px",
                    border: "0px solid gray",
                  }}
                  actions={[
                    <div
                      style={{
                        width: "100%",
                        padding: "-20px",
                        color: "black",
                      }}
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
                                cursor: "default",
                              }}
                            >
                              Price <small>(/{product.propertyDetails.sizeUnit})</small>: ₹
                              {formatPrice(
                                product.propertyDetails.flatCost
                              )}
                            </th>
                            {product.configurations?.maintenanceCost && (
                              <th
                                style={{
                                  textAlign: "center",
                                  border: "1px solid gray",
                                  padding: "10px",
                                  width: "50%",
                                }}
                              >
                                <strong>Maintenance Cost:</strong> ₹
                                {formatPrice(
                                  product.configurations?.maintenanceCost
                                )}
                              </th>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>,
                  ]}
                >
                  <Row>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      {product.propertyDetails?.flatNumber && (
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faSign}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Flat Number:</strong>{" "}
                          {product.propertyDetails.flatNumber}
                        </span>
                      )}
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      {product.propertyDetails.flatFacing && (
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <FontAwesomeIcon
                            icon={faDoorOpen}
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Flat Facing:</strong>{" "}
                          {product.propertyDetails.flatFacing}
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <span style={{ fontSize: "15px", color: "black" }}>
                        <EnvironmentFilled
                          style={{
                            fontSize: "15px",
                            color: "#0d416b",
                            width: "15px",
                          }}
                        />{" "}
                        <strong>Address:</strong>{" "}
                        {product.address.pincode !== "000000" && (
                          <>
                            {product.address.pincode}
                            <span>, </span>
                          </>
                        )}
                        {product.address.village}, {product.address.mandal},{" "}
                        {product.address.district}
                        <br></br>
                        {product.address.landMark}.
                      </span>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    {(product.amenities?.watchman ||
                      product.amenities?.cctv) && (
                        <Col span={24}>
                          <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                            Security
                          </h3>
                        </Col>
                      )}
                  </Row>
                  <Row>
                    {product.amenities?.watchman && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <SafetyCertificateFilled
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>Watchman: </strong>Available
                        </span>
                      </Col>
                    )}
                    {product.amenities?.cctv && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <span style={{ fontSize: "15px", color: "black" }}>
                          <CameraFilled
                            style={{
                              fontSize: "15px",
                              color: "#0d416b",
                              width: "15px",
                            }}
                          />{" "}
                          <strong>CCTV: </strong>Available
                        </span>
                      </Col>
                    )}
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
                        <strong>E-mail: </strong>
                        {product.agentEmail}
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
                        <strong>Phone: </strong>
                        {product.agentNumber}
                      </span>
                    </Col>
                  </Row>
                  <Modal
                    title={
                      <div
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={product.agentProfilePicture}
                          alt={`${product.agentName}'s profile`}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            marginTop: "-10%",
                          }}
                        />
                        <div style={{ textAlign: "center", marginTop: "-10%" }}>
                          <strong
                            style={{ fontSize: "16px", display: "block" }}
                          >
                            {product.agentName}
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
                            {product.agentNumber}
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
                            {product.agentCity}
                          </p>
                          <p
                            style={{
                              margin: "5px 0",
                              color: "gray",
                              fontSize: "14px",
                            }}
                          >
                            Please select the date, time and location to book an
                            appointment with {product.agentName}.
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
                      pid={product._id}
                      ptype={product.propertyType}
                      onClose={handleCloseBookAppointmentModal}
                      setIsModalVis={setIsModalVis}
                    />
                  </Modal>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
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
              {product.configurations.propDesc !== undefined && (
                <Row>
                  <Col span={24}>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#0d416b",
                        fontWeight: "bold",
                      }}

                    //
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
                      {product.configurations.propDesc?.endsWith(".")
                        ? product.configurations.propDesc.slice(0, -1) + "."
                        : product.configurations.propDesc + "."}
                    </span>
                  </Col>
                </Row>
              )}
              {(product.amenities?.waterFacility ||
                product.amenities?.powerSupply ||
                product.configurations?.visitorParking ||
                product.amenities?.elevator ||
                product.configurations?.playZone ||
                product.amenities?.gymFacility) && (
                  <Row gutter={[0, 16]} style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                        Amenities
                      </h3>
                    </Col>
                  </Row>
                )}
              <Row gutter={[0, 8]}>
                {product.amenities?.waterFacility && (
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
                      <strong>Water Facility: </strong>
                      {product.amenities?.waterFacility && "Available"}
                    </span>
                  </Col>
                )}
                {product.amenities?.powerSupply && (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <SafetyCertificateOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Power Backup: </strong>Available
                    </span>
                  </Col>
                )}
                {product.configurations?.visitorParking && (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <CarOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Visitor Parking: </strong>Available
                    </span>
                  </Col>
                )}

                {product.amenities?.elevator && (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <UpOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Elevator: </strong>Available
                    </span>
                  </Col>
                )}
                {product.configurations?.playZone && (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <RocketOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Play Zone: </strong>Available
                    </span>
                  </Col>
                )}
                {product.amenities?.gymFacility && (
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
                      <strong>Gym: </strong>Available
                    </span>
                  </Col>
                )}
              </Row>
              {(product.amenities.medical !== 0 ||
                product.amenities.grocery !== 0 ||
                product.amenities.educational !== 0) && (
                  <Row gutter={[0, 16]} style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                        Near by
                      </h3>
                    </Col>
                  </Row>
                )}
              <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                  {product.amenities.medical !== 0 && (
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <MedicineBoxOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Medical: </strong>
                      {product.amenities.medical} <small>km</small>
                    </span>
                  )}
                </Col>

                <Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                  {product.amenities.grocery !== 0 && (
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <GoldOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Grocery: </strong>
                      {product.amenities.grocery} <small>km</small>
                    </span>
                  )}
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                  {product.amenities.educational !== 0 && (
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Educational: </strong>
                      {product.amenities.educational} <small>km</small>
                    </span>
                  )}
                </Col>
              </Row>
              {(product.configurations?.floorNumber ||
                product.configurations?.propertyAge) && (
                  <Row gutter={[0, 16]} style={{ marginTop: "10px" }}>
                    <Col span={24}>
                      <h3 style={{ fontWeight: "bold", color: "#0d416b" }}>
                        Extra Information
                      </h3>
                    </Col>
                  </Row>
                )}
              <Row>
                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                  {product.configurations?.floorNumber && (
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <FontAwesomeIcon
                        icon={faThumbtack}
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Floor Number: </strong>
                      {product.configurations.floorNumber}
                    </span>
                  )}
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                  {product.configurations?.propertyAge && (
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <FontAwesomeIcon
                        icon={faHourglass}
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />{" "}
                      <strong>Property Age: </strong>
                      {product.configurations.propertyAge} <small>years</small>
                    </span>
                  )}
                </Col>
                <Col span={24} style={{ marginTop: "10px" }}>
                  {product.configurations.waterSource.length > 0 && (
                    <span style={{ fontSize: "15px", color: "black" }}>
                      <strong>Water Source: </strong>
                      {product.configurations.waterSource
                        .map((source, index, array) =>
                          index === array.length - 1
                            ? `${source}.`
                            : `${source}, `
                        )
                        .join("")}
                    </span>
                  )}
                </Col>
              </Row>

              <div style={{ padding: "20px" }}>

                <Row gutter={[16, 16]}>
                  {Object.keys(groupedFlats).length > 0 &&
                    Object.keys(groupedFlats).map((floor) => (

                      <Card
                        title={
                          <div
                            style={{
                              backgroundColor: "#0d416b",
                              color: "#fff",
                              padding: "10px",
                              borderRadius: "6px",
                              textAlign: "center",
                              fontSize: "18px",
                            }}
                          >
                            Floor {floor}
                          </div>
                        }
                        bordered={true}
                        style={{
                          textAlign: "center",
                          backgroundColor: "rgba(159, 159, 167, 0.23)",
                          height: "auto",
                          padding: "15px",
                          width: "150%",
                        }}
                      >
                        <Row gutter={[16, 16]}>
                          {groupedFlats[floor].map((plot) => (
                            <Col xs={24} sm={12} md={8} lg={8} key={plot.flatNumber}>
                              <Card
                                bordered={false}
                                style={{
                                  textAlign: "center",
                                  backgroundColor: "#fff",
                                  borderRadius: "6px",
                                  padding: "15px",
                                  marginBottom: "15px",
                                }}
                              >
                                {/* Flat Number and Cost */}
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    color: "#0D416B",
                                  }}
                                >
                                  Flat {plot.flatNumber}
                                </div>
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "gold",
                                    padding: "5px",
                                    fontWeight: "bold",
                                    borderRadius: "4px",
                                  }}
                                >
                                  ₹ {formatPrice(plot.flatCost)}
                                </div>

                                {/* Image */}
                                <img
                                  alt={`Flat ${plot.flatNumber}`}
                                  src={
                                    product.propPhotos.length > 0
                                      ? product.propPhotos[0]
                                      : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                                  }
                                  style={{
                                    width: "100%",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                    marginTop: "10px",
                                  }}
                                />

                                {/* Flat Details */}
                                <Row style={{ marginTop: "10px" }}>
                                  <Col span={12}>
                                    <p

                                    >
                                      <strong>Size:</strong>
                                      <span>{plot.flatSize} {plot.flatSizeUnit}</span>
                                    </p>
                                  </Col>

                                  <Col span={12}>
                                    <p style={{
                                      display: "flex",
                                      justifyContent: "space-between",  // Align the text and the unit with some space
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",  // Prevent text from wrapping to the next line
                                      textOverflow: "ellipsis",  // Show ellipses when text overflows
                                    }}>
                                      <strong>Price:</strong> ₹{plot.flatCost} per {plot.flatSizeUnit}
                                    </p>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={12}>
                                    <p>
                                      <strong>Bedrooms:</strong> {plot.bedroomCount}
                                    </p>
                                  </Col>
                                  <Col span={12}>
                                    <p>
                                      <strong>Balconies:</strong> {plot.balconyCount}
                                    </p>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={12}>
                                    <p>
                                      <strong>Furnished:</strong> {plot.furnitured}
                                    </p>
                                  </Col>
                                  <Col span={12}>
                                    <p>
                                      <strong>Facing:</strong> {plot.flatFacing}
                                    </p>
                                  </Col>
                                </Row>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card>

                    ))}
                </Row>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Pagination
                    align="center"
                    current={currentPages}
                    pageSize={itemsPerPages}
                    total={product.propertyDetails.flat.length}
                    onChange={handlePageChange}
                  />
                </div>
              </div>

            </Card>
          </Col>
        </Row>

        {/*
<Col span={24} style={{ marginTop: "20px" }}>
<GoogleApiWrapper
lat={product.propertyDetails.latitude}
lng={product.propertyDetails.longitude}
/>
</Col> */}

        {/* <Col span={24} style={{ marginTop: "20px" }}>
<MapContainer
center={[latitude, longitude]}
zoom={15}
style={{ height: "500px", width: "100%" }}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/>


<Marker position={[latitude, longitude]}>
<Popup>
<span>Latitude: {latitude}</span>
<br />
<span>Longitude: {longitude}</span>
</Popup>
</Marker>
</MapContainer>
</Col> */}

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

      {product?.auctionData?.[0]?.auctionWinner && showBalloons && showNextDay && (
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
             {product?.auctionData?.[0]?.auctionWinner === userId && showBalloons && (
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

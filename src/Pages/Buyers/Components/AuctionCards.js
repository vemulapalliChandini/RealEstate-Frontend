import React, { useEffect, useState } from 'react';
import { Card, Modal, Carousel, Row, Col,Button, Form,Input,Tooltip } from 'antd';
import { _get,_put } from "../../../Service/apiClient";
import dayjs from 'dayjs';
import {
  EnvironmentOutlined,
  UserOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  ShopOutlined,
  BorderInnerOutlined,
  BorderlessTableOutlined,
  HomeOutlined,
  CloseOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import { toast } from 'react-toastify';
const AuctionCards = ({ showModalOnLoad }) => {
  const [auctions, setAuctions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(showModalOnLoad || false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [selectedProperty,setSelectedProperty]=useState(null);
  const [isAuctoonViewModalVisible,setIsAuctionViewModalVisible]=useState(false);
  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [enteredMoney, setEnteredMoney] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [reservationAmount, setReservationAmount] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    console.log("Fetching auctions...");
    const fetchAuctionData = async () => {
      try {
        const response = await _get('/auction/getTodayAuctions');
        console.log("auction data", response.data.data);
        if (Array.isArray(response.data.data)) {
          setAuctions(response.data.data);
        } else {
          console.error("API response is not an array");
        }
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctionData();
  }, []);
  const handleViewAuction = (property) => {
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
  };
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
      const startDate = moment(selectedProperty?.auctionData?.startDate);
      const endDate = moment(selectedProperty?.auctionData?.endDate);
      const now = moment();

      const amount = selectedProperty?.auctionData?.buyers?.length > 0
        ? selectedProperty.auctionData.buyers[0].bidAmount
        : selectedProperty?.auctionData?.amount;
      const initialBid = calculateInitialBid(amount);
      console.log(initialBid);
      const razorpayAmount = calculateInitialBid1(amount);
      // setReservationAmount(razorpayAmount);
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

    return `${durationToEnd.days()} Days ${durationToEnd.hours()} Hours ${durationToEnd.minutes()} Minutes until Auction Ends`;
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

  const showModal = (auction) => {
    setSelectedAuction(auction);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAuction(null);
    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
  };

  const isTodayAuction = (auctionDate) => {
    return dayjs(auctionDate).isSame(dayjs(), 'day');
  };

  return (
    <div>
      <Modal
        title={
          <div style={{ fontWeight: 'bold', color: '#FF6347', fontSize: '20px' }}>
            These properties are in auction today!
          </div>
        }
        open={isModalVisible} // FIXED: Changed from `visible` to `open`
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        {/* Carousel for auction images */}
        <Carousel autoplay autoplaySpeed={2000} dots>
          {auctions.length > 0 ? (
            auctions.map((auction) => (
              <div key={auction._id}>
                <Row gutter={[16, 16]} justify="start">
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Card
                      cover={
                        <div style={{ position: "relative" }}>
                          <img
                            alt="property"
                            src={
                              auction?.property?.propertyType === "Agricultural land"
                                ? auction?.property?.landDetails?.images?.[0]
                                : auction?.property?.propertyType === "Commercial"
                                  ? auction?.property?.propertyDetails?.uploadPics?.[0]
                                  : auction?.property?.propertyType === "Residential"
                                    ? auction?.property?.propPhotos?.[0]
                                    : auction?.property?.uploadPics?.[0] || "fallback-image-url.jpg"
                            }
                            style={{ height: "200px", objectFit: "cover", width: "100%" }}
                          />
                          {auction.auctionStatus && auction.auctionStatus.toLowerCase() === "active" && (
                            <Button

                              style={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                                backgroundColor: "#ffc107",
                                color: "#000",
                                padding: "5px 10px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                zIndex: 1, // Ensure it's on top
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                              }}
                              onClick={(e) => handleViewAuction(auction, e)}
                            >
                              Participate in Auction
                            </Button>
                          )}
                        </div>
                      }
                      onClick={() => showModal(auction)}
                      style={{
                        border: isTodayAuction(auction?.property?.landDetails?.auctionDate)
                          ? '2px solid #FF6347'
                          : 'none',
                        boxShadow: isTodayAuction(auction?.property?.landDetails?.auctionDate)
                          ? '0 4px 8px rgba(255, 99, 71, 0.3)'
                          : 'none',
                      }}
                    >

                      <Card.Meta
                        title={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{auction?.property?.propertyType === "Agricultural land"
                              ? auction?.property?.landDetails?.title
                              : auction?.property?.propertyType === "Commercial"
                                ? auction?.property?.propertyTitle
                                : auction?.property?.propertyType === "Residential"
                                  ? auction?.property?.propertyDetails?.apartmentName
                                  : auction?.property?.layoutDetails?.layoutTitle || "fallback-image-url.jpg"}
                            </span>
                            <span style={{ fontWeight: "bold", color: "black" }}>
                              {auction?.property?.propertyType === "Agricultural land"
                                ? `${auction?.property?.landDetails?.size} ${auction?.property?.landDetails?.sizeUnit}`
                                : auction?.property?.propertyType === "Commercial"
                                  ? auction?.property?.propertyDetails?.landDetails?.rent?.plotSize
                                    ? `${auction?.property.propertyDetails.landDetails.rent.plotSize} ${auction?.property.propertyDetails.landDetails.sizeUnit}`
                                    : auction?.property?.propertyDetails?.landDetails?.lease?.plotSize
                                      ? `${auction?.property.propertyDetails.landDetails.lease.plotSize} ${auction?.property.propertyDetails.landDetails.sizeUnit}`
                                      : auction?.property?.propertyDetails?.landDetails?.sell?.plotSize
                                        ? `${auction?.property.propertyDetails.landDetails.sell.plotSize} ${auction?.property.propertyDetails.landDetails.sizeUnit}`
                                        : "N/A"
                                  : auction?.property?.propertyType === "Residential"
                                    ? `${auction?.property?.propertyDetails?.flatSize} ${auction?.property?.propertyDetails?.sizeUnit}`
                                    : `${auction?.property?.layoutDetails?.plotSize} ${auction?.property?.layoutDetails?.sizeUnit}` || "N/A"}
                            </span>

                          </div>
                        }
                        description={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "black" }}>
                            <span>
                              {auction?.property?.propertyType === "Agricultural land"
                                ? `₹${formatPrice(auction?.property?.landDetails?.totalPrice)}`
                                : auction?.property?.propertyType === "Commercial"
                                  ? auction.property.propertyDetails?.landDetails?.rent?.totalAmount
                                    ? (
                                      <>
                                        <b>Rent: ₹</b>{formatPrice(auction.property.propertyDetails.landDetails.rent.totalAmount)}<br />
                                      </>
                                    )
                                    : auction.property.propertyDetails?.landDetails?.lease?.totalAmount
                                      ? (
                                        <>
                                          <b>Lease: ₹</b>{formatPrice(auction.property.propertyDetails.landDetails.lease.totalAmount)}<br />
                                        </>
                                      )
                                      : auction.property.propertyDetails?.landDetails?.sell?.totalAmount
                                        ? (
                                          <>
                                            <b>Sell: ₹</b>{formatPrice(auction.property.propertyDetails.landDetails.sell.totalAmount)}
                                          </>
                                        )
                                        : "N/A"
                                  : auction?.property?.propertyType === "Residential"
                                    ? `₹${formatPrice(auction.property.propertyDetails?.totalCost)}`
                                    : `₹${formatPrice(auction.property.layoutDetails?.totalAmount)}` || "N/A"}
                            </span>

                            <span><EnvironmentOutlined />{auction?.property?.propertyType === "Agricultural land"
                              ? auction?.property?.address?.district
                              : auction?.property?.propertyType === "Commercial"
                                ? auction?.property?.propertyDetails?.landDetails?.address?.district
                                : auction?.property?.propertyType === "Residential"
                                  ? auction?.property?.address?.district
                                  : auction?.property?.layoutDetails?.address?.district || "fallback-image-url.jpg"
                            }</span>
                          </div>
                        }
                      />

                      {isTodayAuction(auction?.property?.landDetails?.auctionDate) && (
                        <div style={{ color: '#FF6347', fontWeight: 'bold', marginTop: '10px' }}>
                          Auction Today!
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <p>No auctions available</p>
          )}
        </Carousel>
      </Modal>
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
          <Form.Item label="Auction Countdown" name="countdown">
            <div style={{ fontWeight: 'bold', color: 'red' }}>
              {remainingTime ? remainingTime : 'Auction Ended'}
            </div>
          </Form.Item>

          {/* Property Start Date */}
          <Row gutter={[16, 16]} style={{ marginBottom: "5%" }}>
            <Col span={12}><b>Start Date:</b> {selectedProperty?.auctionData?.startDate ? moment(selectedProperty?.auctionData.startDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}><b>End Date:</b> {selectedProperty?.auctionData?.endDate ? moment(selectedProperty?.auctionData.endDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}>
              <b>Basic Bid Amount: ₹</b>
              {selectedProperty?.auctionData?.amount}
            </Col>
            <Col span={12}>
              <b>Current Bid Amount: ₹</b>
              {selectedProperty?.auctionData?.buyers?.length > 0
                ? selectedProperty.auctionData.buyers[0].bidAmount
                : selectedProperty?.auctionData?.amount}
            </Col>
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
};

export default AuctionCards;

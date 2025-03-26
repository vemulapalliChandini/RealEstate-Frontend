import React, { useState, useEffect, useRef,useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Empty,
  Tooltip,
  Pagination,
  Tag,
  Skeleton,
  Button,
  Modal,
  Form
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 
  faRuler,
 
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  
  InfoCircleOutlined
} from "@ant-design/icons";
import { _get, _put } from "../../../Service/apiClient";
import { useTranslation } from "react-i18next";
import Meta from "antd/es/card/Meta";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { toast } from "react-toastify";

export default function BuyersResidential({ filters }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [agentrole, setAgentRole] = useState(null);
  const role1=localStorage.getItem("agentrole");
  useEffect(() => {
    const storedRole = localStorage.getItem("agentrole");
    if (storedRole) {
      setAgentRole(parseInt(storedRole));  // Parse and store the agent role
    }
  }, [role1]);
  
   const dataRef = useRef(null);
     const fetchLocation = useCallback(async () => {
       try {
         const type = localStorage.getItem("type");
         let searchText = filters?.searchText || "all"; // Handle undefined filters safely
     
         const response = await _get(`/property/location/${type}/${searchText}`);
     
         if (response?.data) {
           dataRef.current = Array.isArray(response.data) ? response.data : [response.data]; // Ensure data is always an array
         } else {
           dataRef.current = [];
         }
       } catch (error) {
         console.error("Error fetching location data:", error);
         dataRef.current = [];
       }
     }, [filters]); 
  const applyFilters = useCallback(async (filters) => {
    let filtered = [];
    let backendFilteredData = [];
    const amenityMapping = {
      Parking: "parking",
      PowerBackUp: "PowerBackUp",
      Park: "park",
      Swimming: "swimming",
      Lift: "lift",
      Gym: "gym",
      Security: "security"
    };

    let amenitiesJson = "";
    if (filters.amenities && filters.amenities.length > 0) {
      const amenitiesObject = {};
      Object.keys(amenityMapping).forEach((amenity) => {
        amenitiesObject[amenityMapping[amenity]] = filters.amenities.includes(amenity) ? "true" : "false";
      });
      amenitiesJson = JSON.stringify(amenitiesObject);
    }

    try {
      if (!filters.searchText && !filters.priceRange && !filters.sizeRange) {
        // Backend filtering
        const response = await _get(`/filterRoutes/residentialSearch?purchaseType=${filters.lookingFor}&location=&propertyName=&furniture=${filters.furnished}&bedRoom=&facing=${filters.propertyFacing}&propertyLayout=${filters.BHKS}&amenities=${amenitiesJson}&medical=${filters.distanceMedicine}&educational=${filters.distanceEducation}&road=${filters.distanceFromRoad}&minPrice=&maxPrice=&minSize=&maxSize=&propertyType=${filters.propertyType}`);

        if (response.data && response.data.data.length > 0) {
          backendFilteredData = response.data.data;
        } else {
          console.warn("No data found for the selected filters.");
        }
      } else {
        // If searchText, priceRange, or sizeRange is present, perform backend fetch first and then apply frontend filters
        const response = await _get(`/filterRoutes/residentialSearch?purchaseType=${filters.lookingFor}&location=&furniture=${filters.furnished}&facing=${filters.propertyFacing}&propertyLayout=${filters.BHKS}&amenities=${amenitiesJson}&medical=${filters.distanceMedicine}&educational=${filters.distanceEducation}&road=${filters.distanceFromRoad}&propertyType=${filters.propertyType}`);

        backendFilteredData = response.data?.data || [];
      }

      filtered = backendFilteredData;

      // Frontend filtering
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        if (searchText !== "" && searchText !== "all") {
          if (!dataRef.current) {
            await fetchLocation(); 
          }
          filtered = dataRef.current || [];
        }
      }
      console.log("hllp", filters.propertyName)
      let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
      const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
      if (nameSearch2 !== "") {
        filtered = filtered.filter((property) => {
          const nameMatch2 = isPropertyIdSearch
            ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
            : property.propertyDetails.apartmentName && property.propertyDetails.apartmentName.toLowerCase().includes(nameSearch2);

          return nameMatch2;
        });
      }

      if (filters.priceRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.propertyDetails.totalCost) >= filters.priceRange[0] &&
            Number(property.propertyDetails.totalCost) <= filters.priceRange[1]
        );
      }

      if (filters.sizeRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.propertyDetails.flatSize) >= filters.sizeRange[0] &&
            Number(property.propertyDetails.flatSize) <= filters.sizeRange[1]
        );
      }

      setFilteredProducts(filtered);
      console.log("Final Filtered Products:", filtered);

    } catch (error) {
      console.error("Error fetching products:", error);
      setFilteredProducts([]);
    }
  },[setFilteredProducts,fetchLocation]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await _get(`/residential/getallresidentials`);
        const productsData = response.data;
        console.log(productsData);
        // const initialWishlist = productsData
        //   .filter((product) => product.wishlistStatus === 1)
        //   .map((product) => product._id);
        // setWishlist(initialWishlist);
        setProducts(response.data);
        setFilteredProducts(response.data);
        applyFilters(filters, response.data);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    };
    fetchProducts();

  }, [filters,applyFilters]);
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
  const handleViewAuction = (property) => {
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
  };
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
    // setEnteredMoney(value);
    if (parseFloat(value) > backendMoney) {
      setIsSubmitDisabled(false);
    } else if (parseFloat(value) > requiredBid) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };
  
 

  

  const handleCardClick = (product) => {
    if (agentrole === 11) {
      navigate(`/dashboard/agent/residential/details/${product._id}`);
    } else {
      navigate(`/dashboard/buyer/residential/details/${product._id}`);
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
  const paginatedData = Array.isArray(filteredProducts)
    ? filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const formatPrice = (price) => {
    // Ensure price is a valid number
    if (price === undefined || price === null || isNaN(price)) {
      return "Invalid Price"; // Or any default value you'd prefer
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

  return (
    <div
      style={{
        padding: "0px 20px",
      }}
      ref={targetCardRef}
    >
      {products === null && (
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

        {products !== null && (
          Array.isArray(products) && products.length !== 0 ? (
            <>
              {Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
                <Col
                  span={24}
                  style={{ textAlign: "center" }}
                  className="content-container"
                >
                  <Empty description="No properties found, Please select other filters" />
                </Col>
              ) : (
                <>
                  {paginatedData.map((product) => (
                    <Col
                      key={product._id}
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
                            {product.propPhotos.length !== 0 ? (
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
                              ₹ {formatPrice(product.propertyDetails.totalCost)}
                            </div>
                            {product.auctionStatus && product.auctionStatus.toLowerCase() === "active" && (

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
                                onClick={(e) => handleViewAuction(product, e)}
                              >
                                Participate in Auction
                              </Button>
                            )}
                            <div style={{ marginTop: "-25px", float: "left" }}>
                              {product.propertyDetails.propertyPurpose && (
                                <Tag
                                  color={
                                    product.propertyDetails.propertyPurpose.toLowerCase() ===
                                      "sell"
                                      ? "green"
                                      : product.propertyDetails.propertyPurpose.toLowerCase() ===
                                        "rent"
                                        ? "orange"
                                        : "blue"
                                  }
                                >
                                  {product.propertyDetails.propertyPurpose
                                    .charAt(0)
                                    .toUpperCase() +
                                    product.propertyDetails.propertyPurpose
                                      .slice(1)
                                      .toLowerCase()}
                                </Tag>
                              )}
                            </div>
                            <div style={{ marginTop: "-25px", float: "right" }}>
                              {product.propertyDetails.type && (
                                <Tag
                                  color={
                                    product.propertyDetails.type.toLowerCase() ===
                                      "House"
                                      ? "green"
                                      : product.propertyDetails.type.toLowerCase() ===
                                        "flat"
                                        ? "orange"
                                        : "blue"
                                  }
                                >
                                  {product.propertyDetails.type
                                    .charAt(0)
                                    .toUpperCase() +
                                    product.propertyDetails.type
                                      .slice(1)
                                      .toLowerCase()}
                                </Tag>
                              )}
                            </div>
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
                                  <b>Title : </b> <span style={{ marginLeft: "3px" }}> {product.propertyDetails.apartmentName} ({product.propertyId})</span>
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
                                  {product.address.district}
                                </p>
                              </div>

                              <Row
                                gutter={[0, 0]}
                                style={{ marginTop: "20px" }}
                              >
                                <Col
                                  span={12}
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
                                    {product.propertyDetails.flatSize}{" "}
                                    <small>{product.propertyDetails.sizeUnit}</small>
                                  </span>
                                </Col>


                                <Col
                                  span={8}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",

                                  }}
                                >
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
                                    onClick={() => handleCardClick(product)}
                                  >
                                    View More
                                  </button>
                                </Col>


                              </Row>

                            </>
                          }
                        />
                      </Card>

                    </Col>
                  ))}
                  {filteredProducts.length > 6 && (
                    <Col span={24} style={{ marginLeft: "60%" }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredProducts.length}
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

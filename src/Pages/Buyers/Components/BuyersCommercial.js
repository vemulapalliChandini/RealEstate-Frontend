import React, { useState, useEffect, useRef,useCallback } from "react";
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Input,
  Empty,
  Tooltip,
  Tag,
  Pagination,
  Skeleton,
  Button,
  Modal,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faBolt,
  faTint,
  faRuler,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import {_get, _put } from "../../../Service/apiClient";
import { useTranslation } from "react-i18next";
import Meta from "antd/es/card/Meta";
import { toast } from "react-toastify";

export default function GetCommercial({ filters }) {
  const { t } = useTranslation();
  const [properties, setProperties] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [agentrole, setAgentRole] = useState(null);
  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const role1=localStorage.getItem("agentrole");
  useEffect(() => {
    const storedRole = localStorage.getItem("agentrole");
    if (storedRole) {
      setAgentRole(parseInt(storedRole));  // Parse and store the agent role
    }
  }, [role1]);
 
  useEffect(() => {
    console.log("called");
    if (selectedProperty) {
      const startDate = moment(selectedProperty?.auctionData?.[0]?.startDate);
      const endDate = moment(selectedProperty?.auctionData?.[0]?.endDate);
      const now = moment();

      const amount = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        :selectedProperty?.auctionData?.[0]?.amount;

      const initialBid = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        :selectedProperty?.auctionData?.[0]?.amount;

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
          amount : (payload.bidAmount * 0.02) * 100, // Razorpay accepts the amount in paise
          currency: "INR",
          name: "Auction Payment",
          description: "Payment for auction bid",
          handler: async function (response) {
            const requestData = {
              bidAmount: payload.bidAmount,
              buyerName: payload.buyerName,
              buyerId: payload.buyerId,
              transactionId: response.razorpay_payment_id,
              reservationAmount: payload.bidAmount * 0.02,
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
    if (parseFloat(value) > backendMoney) {
      setIsSubmitDisabled(false);
    } else if (parseFloat(value) > requiredBid) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };
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
    "Parking": "Parking",
    "Security": "Security",
    "PowerBackUp": "PowerBackUp",
    "Road Faced": "Road Faced",
  };

  let amenitiesJson = "";
  if (filters.commercialAmenities && filters.commercialAmenities.length > 0) {
    const amenitiesObject = {};
    Object.keys(amenityMapping).forEach((amenity) => {
      amenitiesObject[amenityMapping[amenity]] = filters.commercialAmenities.includes(amenity)
        ? "true"
        : "false";
    });
    amenitiesJson = JSON.stringify(amenitiesObject);
  }

  try {
    if (!filters.searchText && !filters.priceRange && !filters.sizeRange) {
      // Backend filtering
      const response = await _get(
        `/filterRoutes/commercialSearch?location=&propertyFor=${filters.commercialPurpose}&usage=${filters.commercialUsage}&amenities=${amenitiesJson}`
      );
      if (response.data && response.data.data.length > 0) {
        backendFilteredData = response.data.data;
      } else {
        console.warn("No data found for the selected filters.");
      }
    } else {
      // If searchText, priceRange, or sizeRange is present, perform backend fetch first and then apply frontend filters
      const response = await _get(
        `/filterRoutes/commercialSearch?location=&propertyFor=${filters.commercialPurpose}&usage=${filters.commercialUsage}&amenities=${amenitiesJson}`
      );
      backendFilteredData = response.data?.data || [];
    }

    filtered = backendFilteredData;

    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase();
      if (searchText !== "" && searchText !== "all") {
        if (!dataRef.current) {
          await fetchLocation(); 
        }
        filtered = dataRef.current || [];
      }
    }
    console.log("hllp", filters.propertyName);
    let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
    const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
    if (nameSearch2 !== "") {
      filtered = filtered.filter((property) => {
        const nameMatch2 = isPropertyIdSearch
          ? property.propertyId &&
            property.propertyId.toString().toLowerCase().includes(nameSearch2)
          : property.propertyTitle &&
            property.propertyTitle.toLowerCase().includes(nameSearch2);
        return nameMatch2;
      });
    }

    if (filters.priceRange) {
      filtered = filtered.filter((property) =>
        property.propertyDetails.landDetails.rent.totalAmount
          ? Number(property.propertyDetails.landDetails.rent.totalAmount) >= filters.priceRange[0] &&
            Number(property.propertyDetails.landDetails.rent.totalAmount) <= filters.priceRange[1]
          : property.propertyDetails.landDetails.lease.totalAmount
          ? Number(property.propertyDetails.landDetails.lease.totalAmount) >= filters.priceRange[0] &&
            Number(property.propertyDetails.landDetails.lease.totalAmount) <= filters.priceRange[1]
          : Number(property.propertyDetails.landDetails.sell.totalAmount) >= filters.priceRange[0] &&
            Number(property.propertyDetails.landDetails.sell.totalAmount) <= filters.priceRange[1]
      );
    }

    if (filters.sizeRange) {
      filtered = filtered.filter((property) =>
        property.propertyDetails.landDetails.rent.plotSize
          ? Number(property.propertyDetails.landDetails.rent.plotSize) >= filters.sizeRange[0] &&
            Number(property.propertyDetails.landDetails.rent.plotSize) <= filters.sizeRange[1]
          : property.propertyDetails.landDetails.lease.plotSize
          ? Number(property.propertyDetails.landDetails.lease.plotSize) >= filters.sizeRange[0] &&
            Number(property.propertyDetails.landDetails.lease.plotSize) <= filters.sizeRange[1]
          : Number(property.propertyDetails.landDetails.sell.plotSize) >= filters.sizeRange[0] &&
            Number(property.propertyDetails.landDetails.sell.plotSize) <= filters.sizeRange[1]
      );
    }

    setFilteredProperties(filtered);
    console.log("Final Filtered Products:", filtered);
  } catch (error) {
    console.error("Error fetching products:", error);
    setFilteredProperties([]);
  }
}, [fetchLocation, setFilteredProperties]);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await _get(`/commercials/getallcommercials`);
        console.log(response.data);
        setProperties(response.data);
        setFilteredProperties(response.data);
        applyFilters(filters, response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, [applyFilters,filters]);


 
  
  

  
  // const applyFilters = async (filters, data) => {
  //   const searchText = filters.searchText;
  //   if (searchText != "" && searchText!="all") {
  //     await fetchLocation();
  //     data = data2;
  //   }
  //   let filtered = data;

  //   if (filters.checkedTypes === "Sell") {

  //     filtered = filtered.filter((property) =>
  //       property.propertyDetails.landDetails[filters.checkedTypes.toLowerCase()]?.plotSize != null
  //     );
  //   }
  //   if (filters.checkedTypes === "Rent") {

  //     filtered = filtered.filter((property) =>
  //       property.propertyDetails.landDetails[filters.checkedTypes.toLowerCase()]?.plotSize != null
  //     );
  //   }
  //   if (filters.checkedTypes === "Lease") {

  //     filtered = filtered.filter((property) =>
  //       property.propertyDetails.landDetails[filters.checkedTypes.toLowerCase()]?.plotSize != null
  //     );
  //   }
  //   if (filters.checkedFeatureTypes && filters.checkedFeatureTypes.length > 0) {
  //     // If checkedFeatureTypes is "All", return all data
  //     if (filters.checkedFeatureTypes === "All") {
  //       filtered = data;  // Set filtered data to the original data
  //     } else {
  //       const featureTypesArray = Array.isArray(filters.checkedFeatureTypes) ? filters.checkedFeatureTypes : [filters.checkedFeatureTypes];

  //       filtered = filtered.filter((property) => {
  //         // Collect all land usage types from sell, rent, and lease
  //         const landUsageTypes = [
  //           ...property.propertyDetails.landDetails.sell.landUsage,
  //           ...property.propertyDetails.landDetails.rent.landUsage,
  //           ...property.propertyDetails.landDetails.lease.landUsage,
  //         ];

  //         // Check if any of the feature types match the land usage types
  //         return featureTypesArray.some((type) => landUsageTypes.includes(type));
  //       });
  //     }
  //   }

  //   if (filters.priceRange) {
  //     filtered = filtered.filter((property) =>
  //       property.propertyDetails.landDetails.rent.totalAmount
  //         ? Number(property.propertyDetails.landDetails.rent.totalAmount) >=
  //         filters.priceRange[0] &&
  //         Number(property.propertyDetails.landDetails.rent.totalAmount) <=
  //         filters.priceRange[1]
  //         : property.propertyDetails.landDetails.lease.totalAmount
  //           ? Number(property.propertyDetails.landDetails.lease.totalAmount) >=
  //           filters.priceRange[0] &&
  //           Number(property.propertyDetails.landDetails.lease.totalAmount) <=
  //           filters.priceRange[1]
  //           : Number(property.propertyDetails.landDetails.sell.totalAmount) >=
  //           filters.priceRange[0] &&
  //           Number(property.propertyDetails.landDetails.sell.totalAmount) <=
  //           filters.priceRange[1]
  //     );
  //   }

  //   if (filters.sizeRange) {
  //     filtered = filtered.filter((property) =>
  //       property.propertyDetails.landDetails.rent.plotSize
  //         ? Number(property.propertyDetails.landDetails.rent.plotSize) >=
  //         filters.sizeRange[0] &&
  //         Number(property.propertyDetails.landDetails.rent.plotSize) <=
  //         filters.sizeRange[1]
  //         : property.propertyDetails.landDetails.lease.plotSize
  //           ? Number(property.propertyDetails.landDetails.lease.plotSize) >=
  //           filters.sizeRange[0] &&
  //           Number(property.propertyDetails.landDetails.lease.plotSize) <=
  //           filters.sizeRange[1]
  //           : Number(property.propertyDetails.landDetails.sell.plotSize) >=
  //           filters.sizeRange[0] &&
  //           Number(property.propertyDetails.landDetails.sell.plotSize) <=
  //           filters.sizeRange[1]
  //     );
  //   }
  //   let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
  //   const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
  //   if (nameSearch2 !== "") {
  //     filtered = filtered.filter((property) => {
  //       const nameMatch2 = isPropertyIdSearch
  //         ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
  //         : property.propertyTitle && property.propertyTitle.toLowerCase().includes(nameSearch2);

  //       return nameMatch2;
  //     });
  //   }

  //   setFilteredProperties(filtered);
  // };
  const handleCardClick = (property) => {
    if (agentrole === 11) {
      navigate(`/dashboard/agent/commercial/details/${property._id}`);
    } else {
      navigate(`/dashboard/buyer/commercial/details/${property._id}`);
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
  const paginatedData = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const handleViewAuction = (property) => {
    console.log(property);
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
  };







  return (
    <div style={{ padding: "0px 20px" }} ref={targetCardRef}>
      {properties === null && (
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
        {properties !== null && (
          properties.length !== 0 ? (
            <>
              {filteredProperties.length === 0 ? (
                <Col
                  span={24}
                  style={{ textAlign: "centre" }}
                  className="content-container"
                >
                  <Empty description="No properties found, Please select other filters" />
                </Col>
              ) : (
                <>
                  {paginatedData.map((property) => (
                    <Col
                      key={property._id}
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
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcO3D8RCAO_oSv5LS0twSOrcIccJOiv40RKg&s"
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
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FontAwesomeIcon icon={faTag} style={{ marginRight: "2px" }} />
                              ₹
                              {formatPrice(
                                property.propertyDetails.landDetails?.sell?.totalAmount ||
                                property.propertyDetails.landDetails?.rent?.totalAmount ||
                                property.propertyDetails.landDetails?.lease?.totalAmount
                              )}
                            </div>
                            {property.auctionStatus && property.auctionStatus.toLowerCase() === "active" && (

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
                                onClick={(e) => handleViewAuction(property, e)}
                              >
                                Participate in Auction
                              </Button>
                            )}

                            <div style={{ marginTop: "-25px", float: "right" }}>
                              {property.propertyDetails.landDetails?.sell?.totalAmount && (
                                <Tag color="green">For Sale</Tag>
                              )}
                              {property.propertyDetails.landDetails?.rent?.totalAmount && (
                                <Tag color="blue">For Rent</Tag>
                              )}
                              {property.propertyDetails.landDetails?.lease?.totalAmount && (
                                <Tag color="orange">For Lease</Tag>
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
                                  <b>Title: </b>
                                  <span style={{ marginLeft: "3px" }}>
                                    {property.propertyTitle} ({property.propertyId})
                                  </span>
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
                                  {property.propertyDetails.landDetails?.address?.district}
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
                                  <FontAwesomeIcon icon={faRuler} style={{ color: "#0d416b" }} />
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
                                    {property.propertyDetails.landDetails?.sell?.plotSize ||
                                      property.propertyDetails.landDetails?.rent?.plotSize ||
                                      property.propertyDetails.landDetails?.lease?.plotSize}{" "}
                                    <small>sq. ft</small>
                                  </span>
                                </Col>

                                {property.propertyDetails.amenities?.isElectricity && (
                                  <Col
                                    span={8}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faBolt} style={{ color: "#0d416b" }} />
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
                                      Electricity
                                    </span>
                                  </Col>
                                )}

                                {property.propertyDetails.amenities?.isWaterFacility && (
                                  <Col
                                    span={8}
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTint} style={{ color: "#0d416b" }} />
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
                                      Water Access
                                    </span>
                                  </Col>
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
                                    float: "right",
                                  }}
                                  onClick={() => handleCardClick(property)}
                                >
                                  View More
                                </button>
                              </Row>

                            </>
                          }
                        />
                      </Card>


                    </Col>
                  ))}
                  {filteredProperties.length > 6 && (
                    <Col span={24} style={{ marginLeft: "60%" }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredProperties.length}
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
        okButtonProps={{ disabled: isSubmitDisabled }}  
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
          <li>If you win the bid you need to pay the complete bid amount.</li    >
        </ul>

        {/* <p><strong>Refund Policy:</strong></p>
        <p>If you don't win the auction, 2% of your bid amount will be deducted.</p> */}

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

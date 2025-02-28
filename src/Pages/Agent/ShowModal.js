import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MdElevator, MdSecurity, MdSchool } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { Card, Row, Col, Modal, Carousel, Divider, Grid, Button, Form, Input, Collapse, Switch, Select } from "antd";
import { FaShieldAlt, FaSwimmingPool } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaDumbbell } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { FaSchool } from "react-icons/fa";
import { FaBolt } from "react-icons/fa";
import { FaWater } from "react-icons/fa";
import { FaFaucet } from "react-icons/fa";
import { FaRuler } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { GiCheckedShield } from "react-icons/gi";
import { AiFillSafetyCertificate } from "react-icons/ai";
import {
  PhoneOutlined,
  ExpandOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  StarFilled,
  HomeOutlined,
  BankOutlined,
  EnvironmentOutlined,
  LayoutOutlined,
  UserOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  TagsOutlined,
  GlobalOutlined,
  BorderOuterOutlined,
  MoneyCollectOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  NumberOutlined,
  CompassOutlined,
  ExperimentOutlined,
  AppstoreAddOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  DownOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import {
  MailOutlined,
  EllipsisOutlined,
  ContactsOutlined,
  ClusterOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import "../Agent/ShowModal.css";
import { _get, _put, _post } from "../../Service/apiClient";
import ShowViews from "./ShowViews";
import { Center } from "@chakra-ui/react";
import { SecurityOutlined, StorageOutlined, WaterOutlined } from "@mui/icons-material";
import { PowerIcon } from "lucide-react";
import { toast } from "react-toastify";

const { Panel } = Collapse;
const { useBreakpoint } = Grid;
const { Option } = Select;
const ShowModal = ({ path, selectedProperty, isModalVisible, handleCancel, onPaymentSuccess }) => {

  const [totalViews, setTotalViews] = useState(0);
  const [buyersCount, setBuyersCount] = useState(0);
  const [viewsModal, setViewsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPlots, setShowPlots] = useState(false);
  const [showFlats, setShowFlats] = useState(false);
  const [isPropertyOnHold, setIsPropertyOnHold] = useState("");
  const togglePlots = () => {
    setShowPlots(!showPlots);
  };

  const toggleFlats = () => {
    setShowFlats(!showFlats);
  };

  const [form] = Form.useForm();
  const handleEditClick = () => {
    setIsEditing(true);
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
  function capitalizeFirstLetter(string) {
    if (!string || typeof string !== "string") {
      return ""; // Return an empty string if input is not valid
    }
    return string
      .toLowerCase() // Ensure all letters are lowercase first
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  }
  const handleSave = () => {
    form.validateFields()
      .then((values) => {
        console.log('Updated details:', values);
        // You can save the updated values here
        setIsEditing(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  const role = localStorage.getItem("role");

  const handleCancel1 = () => {
    setIsEditing(false);
  };
  useEffect(() => {
    console.log("useeffect", selectedProperty);
    setIsPropertyOnHold(selectedProperty?.propertyOnHold);
    showTotalViews();
    console.log(role);
    console.log("Selectedpropertychanges")
  }, [viewsModal, selectedProperty]);


  const showTotalViews = async () => {

    try {
      const response = await _get(`views/totalViews1/${selectedProperty._id}/${selectedProperty.propertyType}`);
      console.log(response.data);
      setTotalViews(response.data.viewCount);
      setBuyersCount(response.data.viewrsCount)
    } catch (error) {
      console.error("Error fetching total views:", error);
    }
  };
  const calculateInitialBid1 = (totalPrice) => {
    const bidIncrement = 1000;
    const bidLevel = Math.floor(totalPrice / 20000);
    return (bidLevel * bidIncrement);
  };
  const handleHoldOnPropertyClick = (property) => {
    let propertyPrice = 0;
    console.log(property);
    // Check property type and determine the total amount accordingly
    if (property?.propertyType === 'Agricultural land') {
      propertyPrice = property?.landDetails?.totalPrice;

    } else if (property?.propertyType === 'Commercial') {
      if (property.propertyDetails?.landDetails?.rent?.plotSize) {
        propertyPrice = property.propertyDetails.landDetails.rent.totalAmount;
      } else if (property.propertyDetails?.landDetails?.sell?.plotSize) {
        propertyPrice = property.propertyDetails.landDetails.sell.totalAmount;
      } else if (property.propertyDetails?.landDetails?.lease?.plotSize) {
        propertyPrice = property.propertyDetails.landDetails.lease.totalAmount;
      }

    } else if (property?.propertyType === 'Layout') {
      propertyPrice = property.layoutDetails?.totalAmount || 0;
    } else if (property?.propertyType === 'Residential') {
      propertyPrice = property.propertyDetails?.totalCost || 0;
    }


    console.log("total price", propertyPrice);

    const razorpayAmount = calculateInitialBid1(propertyPrice);
    console.log("RazorPay Amount", razorpayAmount);

    if (window.Razorpay) {
      console.log(property);
      const razorpayKeyId = "rzp_test_2OyfmpKkWZJRIP";
      const options = {
        key: razorpayKeyId,
        amount: razorpayAmount * 100,
        currency: "INR",
        name: "Donate Now",
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
              onPaymentSuccess();

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
      propertyName: property.landDetails.title,
    };

    try {
      await _put("deal/unReserveProperty/", body, "Reverted Property Reservation Successfully", "Failed to Revert Reservation");
      // fetchProperty();

    } catch (error) {
      console.error("Error assigning agents:", error);
    }
  };
  const screens = useBreakpoint();
  const getStarColor = (rating) => {
    if (rating <= 2) {
      return "red";
    } else if (rating > 2 && rating <= 3.5) {
      return "#f5d03d";
    } else if (rating > 3.5) {
      return "green";
    }
  };
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = String(phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  const hasAgricultureImages = selectedProperty.landDetails?.images?.length > 0;
  const hasAgricultureVideo = selectedProperty?.landDetails?.videos && selectedProperty.landDetails.videos.length > 0
    ? selectedProperty.landDetails.videos[0]
    : null;

  const hasCommercialImages = selectedProperty.propertyDetails?.uploadPics?.length > 0;
  const hasCommercialVideo = selectedProperty?.propertyDetails?.videos?.length > 0 ? selectedProperty.propertyDetails.videos[0] : null;
  const hasLayoutImages = selectedProperty.uploadPics?.length > 0;
  const hasLayoutVideo = selectedProperty?.videos && selectedProperty.videos.length > 0 ? selectedProperty.videos[0] : null;
  const hasResidentialImages = selectedProperty.propPhotos?.length > 0;
  const hasResidentialVideo = selectedProperty?.videos && selectedProperty.videos.length > 0 ? selectedProperty.videos[0] : null;


  return (
    <>
      {selectedProperty.propertyType === "Agricultural land" && (
        <Modal
          centered
          style={{
            marginRight: !screens.xs && "10%",
            marginTop: !screens.xs && "-4%",
            // marginTop: "10%",
            top: "15%",
            marginLeft: "18%",
          }}
          title={
            <div
              className="PropertyStyle"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {selectedProperty.propertyId} -{" "}
                {selectedProperty.landDetails.title?.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </span>

              {path === "getfields" && (
                isPropertyOnHold === "no" ? (
                  <Button
                    type="primary"
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      padding: "10px",
                      height: "40px",
                      position: "absolute",
                      marginLeft: "75%",
                      backgroundColor: "#00AAE7",
                      color: "white",
                      borderColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleHoldOnPropertyClick(selectedProperty)}
                  >
                    Reserve This Property
                  </Button>
                ) : localStorage.getItem("userId") === selectedProperty?.reservedBy ? (
                  <>
                    <Button
                      type="primary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        padding: "10px",
                        height: "40px",
                        position: "absolute",
                        marginLeft: "65%",
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
                        marginRight: "2%",
                        backgroundColor: "#FF6347", // Red color for revert
                        color: "white",
                        borderColor: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => revertPropertyReservation(selectedProperty)}
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
                      marginLeft: "75%",
                      backgroundColor: "lightgray",
                      color: "gray",
                      borderColor: "lightgray",
                      cursor: "not-allowed",
                      marginBottom: "1%",
                    }}
                    disabled
                  >
                    Property Reserved
                  </Button>
                )
              )}
            </div>
          }

          open={isModalVisible}
          onCancel={handleCancel}
          width={930}
          footer={null}
          // bodyStyle={{ maxHeight: "700px", overflowY: "auto" }}
          bodyStyle={{// Return the original input if it doesn't match the pattern
            maxHeight: "80vh", // Constrain the modal's height to prevent overflow
            overflowY: "auto", // Add vertical scrolling if necessary
            overflowX: "hidden",
          }}
        >
          <Row gutter={16}>
            {hasAgricultureImages && hasAgricultureVideo ? (
              <>
                <Col span={12}>
                  <Carousel arrows autoplay>
                    {selectedProperty.landDetails.images.map((pic, index) => (
                      <div key={index}>
                        <img
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                          alt={`property-${index}`}
                          src={pic}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
                <Col span={12}>
                  <video
                    width="100%"
                    height="250px"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source
                      src={selectedProperty.landDetails.videos[0]}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </>
            ) : hasAgricultureImages ? (
              <Col span={24}>
                <Carousel arrows autoplay>
                  {selectedProperty.landDetails.images.map((pic, index) => (
                    <div key={index}>
                      <img
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                        alt={`property-${index}`}
                        src={pic}
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
            ) : hasAgricultureVideo ? (
              <Col span={24}>
                <video
                  width="100%"
                  height="250px"
                  controls
                  style={{ objectFit: "cover" }}
                >
                  <source
                    src={selectedProperty.landDetails.videos[0]}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </Col>
            ) : (
              <span style={{ marginLeft: "35%", fontSize: "18px" }}>No Images or Video Provided</span>
            )}

            {totalViews !== 0 && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#0D416B",
                  }}
                >
                  <h4>{`${buyersCount} Viewers &  ${totalViews} Views `}</h4>
                  <Button
                    type="text"
                    icon={<DownOutlined />}
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#1890ff",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #1890ff",  // Adds border around the button
                      padding: "5px",               // Adds padding inside the button
                      borderRadius: "4px",          // Optional: Adds rounded corners to the box
                    }}
                    onClick={(e) => {
                      setViewsModal(!viewsModal);
                    }}
                  />

                </div>
              </Col>
            )}


            <Col span={24}>
              <span>

                <strong>Property Description: </strong>{" "}
                {selectedProperty.landDetails.propertyDesc ? selectedProperty.landDetails.propertyDesc : "N/A"}

              </span>
            </Col>
            <Row gutter={16} style={{ background: "#f0f2f5" }}>

              <Col span={24}>

                {selectedProperty.amenities.extraAmenities &&
                  selectedProperty.amenities.extraAmenities.length > 0 && (
                    <Col span={24}>
                      <strong>Extra Amenities: </strong>{" "}
                      {selectedProperty.amenities.extraAmenities.join(", ")}
                    </Col>
                  )}
                <Col>

                  <strong>Dispute Description: </strong>{" "}
                  {selectedProperty.landDetails.litigationDesc ? selectedProperty.landDetails.litigationDesc : "N/A"}


                </Col>

              </Col>

            </Row>
          </Row>
          <Divider />
          {console.log(role)}
          <Row
            gutter={[16, 16]}
            style={{ marginTop: "20px", background: "#f0f2f5" }}
            className="modalComm"
          >
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
            {console.log("roeleole",role)}
              <Card
                title={
                  <>
                    Owner Details
                    {parseInt(role) === 1 || role == 3 && (
                      
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        style={{ marginLeft: 10, marginRight: 50 }}
                        onClick={handleEditClick}
                      />)}
                    {isEditing && (
                      <>
                        <Button
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={handleCancel1}
                          style={{ marginRight: 8, backgroundColor: "red", color: "white" }}
                        />
                        <Button

                          size="small"
                          icon={<CheckOutlined />}
                          onClick={handleSave}
                          style={{ backgroundColor: "green", color: "white" }}
                        />
                      </>
                    )}
                  </>
                }
                style={{
                  margin: 0,
                  padding: 10,
                  height: !screens.xs ? "146px" : "150px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  // color: "#fff",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                {isEditing ? (
                  <Form form={form} layout="horizontal" initialValues={selectedProperty.ownerDetails}>
                    <Form.Item
                      label="Name"
                      name="ownerName"
                      rules={[{ required: true, message: 'Please enter the owner name!' }]}
                    >
                      <Input prefix={<UserOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      label="Contact"
                      name="phoneNumber"
                      rules={[{ required: true, message: 'Please enter the contact number!' }]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        value={selectedProperty.ownerDetails.phoneNumber} // Assuming this is the phone number format
                        onChange={(e) => form.setFieldsValue({ phoneNumber: e.target.value })}
                        style={{ width: "80%" }}
                      />
                    </Form.Item>

                  </Form>
                ) : (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <UserOutlined style={{ color: "#0d416b" }} />{" "}
                      <span>
                        <strong>Name:</strong> {selectedProperty.ownerDetails.ownerName}
                      </span>
                    </Col>
                    <Col span={12}>
                      <PhoneOutlined style={{ color: "#0d416b" }} />{" "}
                      <span>
                        <strong>Contact:</strong> {formatPhoneNumber(selectedProperty.ownerDetails.phoneNumber)}
                      </span>
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                title={
                  <>
                    Amenities
                    {role == 1 || role == 3 && (
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        style={{ marginLeft: 10, marginRight: 50 }}
                        onClick={handleEditClick}
                      />)}
                    {isEditing && (
                      <>
                        <Button
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={handleCancel1}
                          style={{ marginRight: 8, backgroundColor: "red", color: "white" }}
                        />
                        <Button
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={handleSave}
                          style={{ backgroundColor: "green", color: "white" }}
                        />
                      </>
                    )}
                  </>
                }
                style={{
                  margin: 0,
                  padding: 5,
                  height: "auto",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                {isEditing ? (
                  <Form form={form} layout="horizontal" initialValues={selectedProperty.amenities}>
                    <Form.Item
                      label="Electricity"
                      name="electricity"
                      rules={[{ required: true, message: 'Please enter electricity details!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label="BoreWell"
                          name="boreWell"
                          valuePropName="checked"
                        >
                          <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Storage Facility"
                          name="storageFacility"
                          valuePropName="checked"
                        >
                          <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label="Distance from Road (in kms)"
                      name="distanceFromRoad"
                      rules={[{ required: true, message: 'Please enter distance from road!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Form>
                ) : (
                  <>
                    <Row gutter={[0, 0]}>
                      <Col span={12}>
                        <span>
                          <ThunderboltOutlined style={{ color: "#0d416b" }} />{" "}
                          <strong>Electricity: </strong>
                          {capitalizeFirstLetter(selectedProperty.amenities.electricity)}
                        </span>
                      </Col>
                      <Col span={12}>
                        <span>
                          <ExperimentOutlined style={{ color: "#0d416b" }} />{" "}
                          <strong>Storage Facility: </strong>
                          {selectedProperty.amenities.storageFacility ? "Yes" : "No"}
                        </span>
                      </Col>

                    </Row>
                    <Row gutter={[0, 0]}>
                      <Col span={12}>
                        <span>
                          <ExperimentOutlined style={{ color: "#0d416b" }} />{" "}
                          <strong>BoreWell: </strong>
                          {selectedProperty.amenities.boreWell ? "Yes" : "No"}
                        </span>
                      </Col>
                      <Col span={12}>
                        <span>
                          <CompassOutlined style={{ color: "#0d416b" }} />{" "}
                          <strong>Distance from Road: </strong>
                          {selectedProperty.amenities.distanceFromRoad} kms
                        </span>
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                title={
                  <>
                    Address

                    {role == 1 || role == 3 && (
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        style={{ marginLeft: 10, marginRight: 50 }}
                        onClick={handleEditClick}
                      />)}

                    {isEditing && (
                      <>
                        <Button
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={handleCancel1}
                          style={{ marginRight: 8, backgroundColor: "red", color: "white" }}
                        />
                        <Button
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={handleSave}
                          style={{ backgroundColor: "green", color: "white" }}
                        />
                      </>
                    )}
                  </>
                }
                style={{
                  margin: 0,
                  padding: 10,
                  height: "93%",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                }}
              >
                {!isEditing ? (
                  <>
                    <Row gutter={[0, 0]}>
                      <Col span={12}>
                        {selectedProperty.address.pinCode &&
                          selectedProperty.address.pinCode !== "000000" && (
                            <span>
                              <>
                                <NumberOutlined style={{ color: "#0d416b" }} />{" "}
                                <strong>Pincode:</strong>{" "}
                                {selectedProperty.address.pinCode}
                              </>
                              <br />
                            </span>
                          )}
                      </Col>
                      <Col span={12}>
                        <HomeOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>Village:</strong> {selectedProperty.address.village}
                        </span>
                      </Col>
                    </Row>
                    <Row gutter={[0, 0]}>

                      <Col span={12}>
                        <BorderOuterOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>Mandal:</strong> {selectedProperty.address.mandal}
                        </span>
                      </Col>
                      <Col span={12}>
                        <EnvironmentOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>District:</strong> {selectedProperty.address.district}
                        </span>
                      </Col>
                    </Row>
                    <Row gutter={[0, 0]}>

                      <Col span={12}>
                        <BankOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>State:</strong> {selectedProperty.address.state}
                        </span>
                      </Col>
                      <Col span={12}>
                        <GlobalOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>Country:</strong> {selectedProperty.address.country}
                        </span>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Form form={form} layout="horizontal">
                    <Form.Item
                      name="pinCode"
                      label="Pincode"
                      rules={[{ required: true, message: "Pincode is required!" }]}
                    >
                      <Input prefix={<NumberOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="village"
                      label="Village"
                      rules={[{ required: true, message: "Village is required!" }]}
                    >
                      <Input prefix={<HomeOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="mandal"
                      label="Mandal"
                      rules={[{ required: true, message: "Mandal is required!" }]}
                    >
                      <Input prefix={<BorderOuterOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="district"
                      label="District"
                      rules={[{ required: true, message: "District is required!" }]}
                    >
                      <Input prefix={<EnvironmentOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="state"
                      label="State"
                      rules={[{ required: true, message: "State is required!" }]}
                    >
                      <Input prefix={<BankOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="country"
                      label="Country"
                      rules={[{ required: true, message: "Country is required!" }]}
                    >
                      <Input prefix={<GlobalOutlined style={{ width: "80%" }} />} />
                    </Form.Item>
                  </Form>
                )}
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                title={
                  <>
                    Land Details

                    {role == 1 || role == 3 && (
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        style={{ marginLeft: 10, marginRight: 50 }}
                        onClick={handleEditClick}
                      />)}

                    {isEditing && (
                      <>
                        <Button
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={handleCancel1}
                          style={{ marginRight: 8, backgroundColor: "red", color: "white" }}
                        />
                        <Button
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={handleSave}
                          style={{ backgroundColor: "green", color: "white" }}
                        />
                      </>
                    )}
                  </>
                }
                style={{
                  margin: 0,
                  padding: 10,
                  height: "93%",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  // color: "#fff",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                {!isEditing ? (
                  <>
                    <Row gutter={[0, 0]}>
                      <Col span={12}>
                        <TagsOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>Land Type:</strong>{" "}
                          {selectedProperty.landDetails.landType}
                        </span>
                      </Col>
                      <Col span={12}>
                        <AppstoreOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>Size:</strong> {selectedProperty.landDetails.size}{" "}
                          <small>{selectedProperty.landDetails.sizeUnit}</small>
                        </span>
                      </Col>
                    </Row>
                    <Row gutter={[0, 0]}>
                      <Col span={12}>
                        <MoneyCollectOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>
                            Price<small>(/ {selectedProperty.landDetails.priceUnit})</small>:
                          </strong>{" "}
                          {formatPrice(selectedProperty.landDetails.price)}{" "}
                        </span>
                      </Col>
                      <Col span={12}>
                        <MoneyCollectOutlined style={{ color: "#0d416b" }} />{" "}
                        <span>
                          <strong>
                            Total Price:{" "}
                            {formatPrice(
                              selectedProperty.landDetails.totalPrice
                            )}
                          </strong>
                        </span>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Form form={form} layout="horizontal">
                    <Form.Item
                      label="Land Type"
                      name="landType"
                      initialValue={selectedProperty.landDetails.landType}
                      rules={[{ required: true, message: "Please select a land type!" }]}
                    >
                      <Select
                        style={{ width: "200px" }}
                        placeholder="Select Land Type"
                      >
                        <Option value="Dry Land">Dry Land</Option>
                        <Option value="Wet Land">Wet Land</Option>
                        <Option value="Converted Land">Converted Land</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="size"
                      label="Size"
                      rules={[{ required: true, message: "Size is required!" }]}
                    >
                      <Input prefix={<HomeOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="price"
                      label="Price"
                      rules={[{ required: true, message: "Price is required!" }]}
                    >
                      <Input prefix={<BorderOuterOutlined />} style={{ width: "80%" }} />
                    </Form.Item>
                    <Form.Item
                      name="totalPrice"
                      label="Total Price"
                      rules={[{ required: true, message: "Total Price is required!" }]}
                    >
                      <Input prefix={<EnvironmentOutlined />} style={{ width: "80%" }} />
                    </Form.Item>

                  </Form>
                )}

              </Card>
            </Col>
          </Row>

        </Modal>
      )}

      {/* Agriculture code end  */}

      {selectedProperty.propertyType === "Commercial" && (
        <Modal
          style={{
            marginRight: !screens.xs && "10%",
            marginTop: !screens.xs && "-4%",
          }}
          title={
            <div className="PropertyStyle">
              <span>
                {selectedProperty.propertyId} -{' '}
                {selectedProperty.propertyTitle?.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </span>
              {path === "getcommercial" && (
                isPropertyOnHold === "no" ? (
                  <Button
                    type="primary"
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      padding: "10px",
                      height: "40px",
                      position: "absolute",
                      marginLeft: "75%",
                      backgroundColor: "#00AAE7",
                      color: "white",
                      borderColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleHoldOnPropertyClick(selectedProperty)}
                  >
                    Reserve This Property
                  </Button>
                ) : localStorage.getItem("userId") === selectedProperty?.reservedBy ? (
                  <>
                    <Button
                      type="primary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        padding: "10px",
                        height: "40px",
                        position: "absolute",
                        marginLeft: "65%",
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
                        marginRight: "2%",
                        backgroundColor: "#FF6347", // Red color for revert
                        color: "white",
                        borderColor: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => revertPropertyReservation(selectedProperty)}
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
                      marginLeft: "75%",
                      backgroundColor: "lightgray",
                      color: "gray",
                      borderColor: "lightgray",
                      cursor: "not-allowed",
                      marginBottom: "1%",
                    }}
                    disabled
                  >
                    Property Reserved
                  </Button>
                )
              )}
              {selectedProperty.rating ? (
                <div className="selectedProperty">
                  <StarFilled
                    style={{
                      marginRight: "5px",
                      color: "#f5d03d",
                    }}
                  />
                  <span>{selectedProperty.rating}</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
        >
          <Row gutter={16}>
            {hasCommercialImages && hasCommercialVideo ? (
              <>
                <Col span={12}>
                  <Carousel arrows autoplay>
                    {selectedProperty?.propertyDetails?.uploadPics.map((pic, index) => (
                      <div key={index}>
                        <img
                          className="image2"
                          alt={`property-${index}`}
                          src={pic}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
                <Col span={12}>
                  <video
                    width="100%"
                    height="250px"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source
                      src={selectedProperty.propertyDetails.videos[0]}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </>
            ) : hasCommercialImages ? (
              <Col span={24}>
                <Carousel arrows autoplay>
                  {selectedProperty?.propertyDetails?.uploadPics.map((pic, index) => (
                    <div key={index}>
                      <img
                        className="image2"
                        alt={`property-${index}`}
                        src={pic}
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
            ) : hasCommercialVideo ? (
              <Col span={24}>
                <video
                  width="100%"
                  height="250px"
                  controls
                  style={{ objectFit: "cover" }}
                >
                  <source
                    src={selectedProperty.propertyDetails.videos[0]}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </Col>
            ) : (
              <span style={{ marginLeft: "35%", fontSize: "18px" }}>
                No Images or Video Provided
              </span>
            )}


            {totalViews !== 0 && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <h4>{`${buyersCount} Viewers &  ${totalViews} Views `}</h4>
                  <Button
                    type="text"
                    icon={<DownOutlined />}
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#1890ff",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #1890ff",  // Adds border around the button
                      padding: "5px",               // Adds padding inside the button
                      borderRadius: "4px",          // Optional: Adds rounded corners to the box
                    }}
                    onClick={(e) => {
                      setViewsModal(!viewsModal);
                    }}
                  />
                </div>
              </Col>
            )}
            <Col span={24} style={{ marginTop: "20px" }}>
              <span>


                <strong>Property Description: </strong>{" "}
                {selectedProperty.propertyDetails.landDetails.description ? selectedProperty.propertyDetails.landDetails.description : "N/A"}

              </span>
            </Col>
            <Col span={24}>

              <span>
                <strong>Dispute Description: </strong>
                {selectedProperty.propertyDetails.owner.disputeDesc ? selectedProperty.propertyDetails.owner.disputeDesc : "N/A"}
              </span>

            </Col>
            <Col span={24}>
              {selectedProperty.propertyDetails.amenities?.extraAmenities &&
                selectedProperty.propertyDetails.amenities.extraAmenities
                  .length > 0 && (
                  <span>
                    <strong>Extra Amenities: </strong>
                    {selectedProperty.propertyDetails.amenities.extraAmenities.join(
                      ", "
                    )}
                  </span>
                )}
            </Col>
          </Row>
          <Divider />

          <Row
            gutter={[16, 16]}
            style={{ marginTop: "20px", background: "#f0f2f5" }}
            className="modalComm"
          >
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                classNames="rowStyle"
                title={<span style={{ color: "#0d416b" }}>Owner Details</span>}
                style={{
                  margin: 0,
                  padding: 10,
                  height: !screens.xs ? "140px" : "150px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  // color: "#fff",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <span>
                        {" "}
                        <UserOutlined className="GlobalOutlined" />
                        <strong> Name: </strong>
                        {selectedProperty.propertyDetails.owner?.ownerName}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        <ContactsOutlined style={{ marginRight: "3px" }} />
                        <strong>Contact: </strong>{" "}
                        {formatPhoneNumber(selectedProperty.propertyDetails.owner?.ownerContact)}
                      </span>
                    </Col>
                  </Row>
                  {selectedProperty.propertyDetails.owner?.ownerEmail !==
                    "" && (
                      <span>
                        <MailOutlined className="GlobalOutlined" />
                        <strong> Email: </strong>
                        {selectedProperty.propertyDetails.owner?.ownerEmail}
                      </span>
                    )}
                  <br></br>
                </Col>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                classNames="rowStyle"
                hoverable
                // title="Amenities"
                title={<span style={{ color: "#0d416b" }}>Amenities</span>}
                style={{
                  margin: 0,
                  padding: 5,
                  height: "140px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                <Col span={24}>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <ThunderboltOutlined />{" "}
                      <span>
                        <strong>Electricity: </strong>
                        {selectedProperty.propertyDetails.amenities?.isElectricity}
                      </span>
                    </Col>
                    <Col span={12}>
                      <ExperimentOutlined />{" "}
                      <span>
                        <strong>Park Facility: </strong>
                        {selectedProperty.propertyDetails.amenities?.isParkingFacility
                          ? "Yes"
                          : "No"}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <CompassOutlined />{"  "}
                      <span style={{ marginLeft: "5px" }}>
                        <strong>Road Faced: </strong>
                        {selectedProperty.propertyDetails.amenities?.isRoadFace
                          ? "Yes"
                          : "No"}
                      </span>
                    </Col>
                    <Col span={12}>
                      <SecurityOutlined style={{ fontSize: "17px" }} />{" "}
                      <span style={{ marginLeft: "5px" }}>
                        <strong>Security: </strong>
                        {selectedProperty.propertyDetails.amenities?.security
                          ? "Yes"
                          : "No"}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <PoweroffOutlined />{" "}
                      <span style={{ marginLeft: "5px" }}>
                        <strong>powerBackup: </strong>
                        {selectedProperty.propertyDetails.amenities?.powerBackup
                          ? "Yes"
                          : "No"}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Card>
            </Col>
            {/* </Row>

                    <Row gutter={16} style={{ margin: "20px" }}> */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                // classNames="cardStyle3"

                hoverable
                // title="Address"
                title={<span style={{ color: "#0d416b" }}>Address</span>}
                style={{
                  margin: 0,
                  padding: 5,
                  height: "200px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      {selectedProperty.propertyDetails.landDetails.address
                        .pinCode &&
                        selectedProperty.propertyDetails.landDetails.address
                          .pinCode !== "000000" && (
                          <span>
                            <NumberOutlined className="GlobalOutlined" />
                            <strong>Pincode: </strong>
                            {
                              selectedProperty.propertyDetails.landDetails.address
                                .pinCode
                            }
                            <br></br>
                          </span>
                        )}
                    </Col>
                    <Col span={12}>
                      <HomeOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Village: </strong>
                        {
                          selectedProperty.propertyDetails.landDetails.address
                            ?.village
                        }
                      </span>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <BorderOuterOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Mandal: </strong>
                        {
                          selectedProperty.propertyDetails.landDetails.address
                            ?.mandal
                        }
                      </span>
                    </Col>
                    <Col span={12}>
                      <EnvironmentOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>District: </strong>
                        {
                          selectedProperty.propertyDetails.landDetails.address
                            ?.district
                        }
                      </span>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <BankOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>State: </strong>
                        {
                          selectedProperty.propertyDetails.landDetails.address
                            ?.state
                        }
                      </span>
                    </Col>
                    <Col span={12}>
                      <GlobalOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Country: </strong>
                        {
                          selectedProperty.propertyDetails.landDetails.address
                            ?.country
                        }
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                // classNames="cardStyle3"

                hoverable
                // title={
                //   selectedProperty.propertyDetails.landDetails.rent.plotSize
                //     ? "Rent Details"
                //     : selectedProperty.propertyDetails.landDetails.lease
                //         .plotSize
                //     ? "Lease Details"
                //     : "Sell Details"
                // }

                title={
                  <span style={{ color: "#0d416b" }}>
                    {selectedProperty.propertyDetails.landDetails.rent.plotSize
                      ? "Rent Details"
                      : selectedProperty.propertyDetails.landDetails.lease
                        .plotSize
                        ? "Lease Details"
                        : "Sell Details"}
                  </span>
                }
                style={{
                  margin: 0,
                  padding: 5,
                  height: "200px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                {selectedProperty.propertyDetails.landDetails.rent.plotSize && (
                  <Col span={24}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <AppstoreOutlined className="GlobalOutlined" />{" "}
                        <span>
                          <strong>Plot Size: </strong>
                          {
                            selectedProperty.propertyDetails.landDetails.rent
                              .plotSize
                          }{" "}
                          <small>{selectedProperty.propertyDetails.landDetails.rent.sizeUnit}</small>
                        </span>
                      </Col>
                      <Col span={12}>
                        <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                        <span>
                          <strong>Rent (/month): </strong>
                          {formatPrice(
                            selectedProperty.propertyDetails.landDetails.rent.rent
                          )}
                        </span>
                      </Col>
                    </Row>
                    <EllipsisOutlined className="GlobalOutlined" />
                    <span>
                      <strong>No of Months: </strong>
                      {
                        selectedProperty.propertyDetails.landDetails.rent
                          .noOfMonths
                      }
                    </span>
                    <br></br>
                    <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                    <span>
                      <strong>Total Amount: </strong>
                      {formatPrice(
                        selectedProperty.propertyDetails.landDetails.rent
                          .totalAmount
                      )}
                    </span>
                    <br></br>
                    <span>
                      <ClusterOutlined className="GlobalOutlined" />{" "}
                      <strong>Land Usage:</strong>{" "}
                      {selectedProperty.propertyDetails.landDetails.rent.landUsage.join(
                        ", "
                      )}
                    </span>
                  </Col>
                )}

                {selectedProperty.propertyDetails.landDetails.sell.plotSize && (
                  <Col span={24}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <AppstoreOutlined className="GlobalOutlined" />{" "}
                        <span>
                          <strong>Plot Size: </strong>
                          {
                            selectedProperty.propertyDetails.landDetails.sell
                              .plotSize
                          }{" "}
                          {selectedProperty.propertyDetails.landDetails.sell.sizeUnit}
                        </span>
                      </Col>
                      <Col span={12}>
                        <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                        <span>
                          <strong>Price (/sq. ft): </strong>
                          {formatPrice(
                            selectedProperty.propertyDetails.landDetails.sell.price
                          )}
                        </span>
                      </Col>
                    </Row>
                    <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                    <span>
                      <strong>Total Amount: </strong>
                      {formatPrice(
                        selectedProperty.propertyDetails.landDetails.sell
                          .totalAmount
                      )}
                    </span>
                    <br></br>
                    <span>
                      <ClusterOutlined className="GlobalOutlined" />{" "}
                      <strong>Land Usage:</strong>{" "}
                      {selectedProperty.propertyDetails.landDetails.sell.landUsage.join(
                        ", "
                      )}
                    </span>
                  </Col>
                )}

                {selectedProperty.propertyDetails.landDetails.lease
                  .plotSize && (
                    <Col span={24}>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <AppstoreOutlined className="GlobalOutlined" />{" "}
                          <span>
                            <strong>Plot Size: </strong>
                            {
                              selectedProperty.propertyDetails.landDetails.lease
                                .plotSize
                            }{" "}
                            {selectedProperty.propertyDetails.landDetails.lease.sizeUnit}
                          </span>
                        </Col>
                        <Col span={12}>
                          <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                          <span>
                            <strong>Price (/year): </strong>
                            {formatPrice(
                              selectedProperty.propertyDetails.landDetails.lease
                                .leasePrice
                            )}
                          </span>
                        </Col>
                      </Row>
                      <EllipsisOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>No of Years: </strong>
                        {
                          selectedProperty.propertyDetails.landDetails.lease
                            .duration
                        }
                      </span>
                      <br></br>
                      <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Total Amount: </strong>
                        {formatPrice(
                          selectedProperty.propertyDetails.landDetails.lease
                            .totalAmount
                        )}
                      </span>
                      <br></br>
                      <span>
                        <ClusterOutlined className="GlobalOutlined" />
                        <strong>Land Usage:</strong>{" "}
                        {selectedProperty.propertyDetails.landDetails.lease.landUsage.join(
                          ", "
                        )}
                      </span>
                    </Col>
                  )}
                <IssuesCloseOutlined
                  style={{ marginRight: "2px", marginLeft: "8px" }}
                />
                <span>
                  {" "}
                  <strong>Has Legal Disputes: </strong>
                  {selectedProperty.propertyDetails.owner?.isLegalDispute
                    ? "Yes"
                    : "No"}
                </span>
              </Card>
            </Col>
          </Row>
          <Divider />


        </Modal>
      )}

      {/*  commerical code end.... */}

      {selectedProperty.propertyType === "Layout" && (
        <Modal
          style={{
            marginRight: !screens.xs && "10%",
            marginTop: !screens.xs && "-4%",
          }}
          title={
            <div className="PropertyStyle" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                {selectedProperty.propertyId} -{' '}
                {selectedProperty.layoutDetails.layoutTitle?.replace(
                  /\b\w/g,
                  (char) => char.toUpperCase()
                )}
              </span>

              {path === "getlayouts" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  {isPropertyOnHold === "no" ? (
                    <Button
                      type="primary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        padding: "10px",
                        height: "40px",
                        backgroundColor: "#00AAE7",
                        color: "white",
                        borderColor: "white",
                        cursor: "pointer",
                        marginRight: "15px"
                      }}
                      onClick={() => handleHoldOnPropertyClick(selectedProperty)}
                    >
                      Reserve This Property
                    </Button>
                  ) : localStorage.getItem("userId") === selectedProperty?.reservedBy ? (
                    <>
                      <Button
                        type="primary"
                        style={{
                          fontWeight: "bold",
                          fontSize: "12px",
                          padding: "10px",
                          height: "40px",
                          backgroundColor: "green",
                          color: "white",
                          borderColor: "white",
                          cursor: "not-allowed",
                          marginRight: "15px"
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
                          backgroundColor: "#FF6347", // Red color for revert
                          color: "white",
                          borderColor: "white",
                          cursor: "pointer",
                          marginRight: "15px"
                        }}
                        onClick={() => revertPropertyReservation(selectedProperty)}
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
                        backgroundColor: "lightgray",
                        color: "gray",
                        borderColor: "lightgray",
                        cursor: "not-allowed",
                        marginRight: "15px"
                      }}
                      disabled
                    >
                      Property Reserved
                    </Button>
                  )}
                </div>
              )}
            </div>
          }

          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
        >
          <Row gutter={[16, 16]}>
            {hasLayoutImages && hasLayoutVideo ? (
              <>
                <Col span={12}>
                  <Carousel arrows autoplay>
                    {selectedProperty?.uploadPics.map((pic, index) => (
                      <div key={index}>
                        <img
                          className="image2"
                          alt={`property-${index}`}
                          src={pic}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
                <Col span={12}>
                  <video
                    width="100%"
                    height="250px"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source src={selectedProperty.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </>
            ) : hasLayoutImages ? (
              <Col span={24}>
                <Carousel arrows autoplay>
                  {selectedProperty?.uploadPics.map((pic, index) => (
                    <div key={index}>
                      <img
                        className="image2"
                        alt={`property-${index}`}
                        src={pic}
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
            ) :
              hasLayoutVideo ? (
                <Col span={24}>
                  <video
                    width="100%"
                    height="250px"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source src={selectedProperty.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Col>

              ) : (
                <span style={{ marginLeft: "35%", fontSize: "18px" }}>
                  No Images or Video Provided
                </span>
              )}

            {totalViews !== 0 && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <h4>{`${buyersCount} Viewers &  ${totalViews} Views `}</h4>
                  <Button
                    type="text"
                    icon={<DownOutlined />}
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#1890ff",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #1890ff",  // Adds border around the button
                      padding: "5px",               // Adds padding inside the button
                      borderRadius: "4px",          // Optional: Adds rounded corners to the box
                    }}
                    onClick={(e) => {
                      setViewsModal(!viewsModal);
                    }}
                  />
                </div>
              </Col>
            )}
            <Col span={24} style={{ marginTop: "20px" }}>
              <span>

                <strong>Property Description: </strong>{" "}
                {selectedProperty.layoutDetails.description ? selectedProperty.layoutDetails.description : "N/A"}

              </span>
            </Col>
          </Row>
          <Divider />

          <Row
            gutter={[16, 16]}
            style={{ marginTop: "20px", background: "#f0f2f5" }}
            className="modalComm"
          >
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card

                // className="getComm"
                classNames="rowStyle"
                // title="Owner Details"
                title={<span style={{ color: "#0d416b" }}>Owner Details</span>}
                style={{
                  margin: 0,
                  padding: 10,
                  height: !screens.xs ? "162px" : "150px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  // color: "#fff",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <span>
                        {" "}
                        <UserOutlined className="GlobalOutlined" />
                        <strong> Name: </strong>
                        {selectedProperty.ownerDetails?.ownerName}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        <PhoneOutlined style={{ marginRight: "3px" }} />
                        <strong>Contact: </strong>{" "}
                        {formatPhoneNumber(selectedProperty.ownerDetails?.ownerContact)}

                      </span>
                    </Col>
                  </Row>
                  {selectedProperty.ownerDetails?.ownerEmail !== "" && (
                    <span>
                      <MailOutlined className="GlobalOutlined" />
                      <strong> Email: </strong>
                      {selectedProperty.ownerDetails?.ownerEmail}
                    </span>
                  )}
                </Col>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                // classNames="cardStyle3"

                hoverable
                // title="Address"
                title={<span style={{ color: "#0d416b" }}>Address</span>}
                style={{
                  margin: 0,
                  padding: 5,
                  height: "162px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                  // background: "#e0dede",
                }}
              >
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      {selectedProperty.layoutDetails.address?.pinCode &&
                        selectedProperty.layoutDetails.address?.pinCode !==
                        "000000" && (
                          <span>
                            <NumberOutlined className="GlobalOutlined" />
                            <strong>Pincode: </strong>
                            {selectedProperty.layoutDetails.address.pinCode}
                            <br></br>
                          </span>
                        )}
                    </Col>
                    <Col span={12}>
                      <HomeOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Village: </strong>
                        {selectedProperty.layoutDetails.address?.village}
                      </span>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <BorderOuterOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Mandal: </strong>
                        {selectedProperty.layoutDetails.address?.mandal}
                      </span>
                    </Col>
                    <Col span={12}>
                      <EnvironmentOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>District: </strong>
                        {selectedProperty.layoutDetails.address?.district}
                      </span>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <BankOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>State: </strong>
                        {selectedProperty.layoutDetails.address?.state}
                      </span>
                    </Col>
                    <Col span={12}>
                      <GlobalOutlined className="GlobalOutlined" />{" "}
                      <span>
                        <strong>Country: </strong>
                        {selectedProperty.layoutDetails.address?.country}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Card>
            </Col>
            {/* </Row>

                    <Row gutter={16}> */}
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                classNames="rowStyle"
                hoverable
                // title="Amenities"
                title={<span style={{ color: "#0d416b" }}>Amenities</span>}
                style={{
                  height:
                    !(
                      selectedProperty.amenities.medical &&
                      selectedProperty.amenities.educational &&
                      !screens.xs
                    ) && "100%",

                  margin: 0,
                  padding: 5,
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                }}
              >
                <Col span={24}>
                  <Row>
                    <Col span={12}>
                      <FaFaucet />{" "}
                      <span>
                        <strong>UnderGround Water: </strong>
                        {selectedProperty.amenities.underGroundWater ? "Yes" : "No"}
                      </span>
                    </Col>
                    <Col span={12}>
                      <FaWater />{" "}
                      <span>
                        <strong>Drainage System: </strong>
                        {selectedProperty.amenities.drainageSystem ? "Yes" : "No"}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FaBolt />{" "}
                      <span>
                        <strong>Electricity Facility: </strong>
                        {selectedProperty.amenities.electricityFacility}
                      </span>
                    </Col>
                    <Col span={12}>
                      <FaSwimmingPool />{" "}
                      <span>
                        <strong>Swimming Pool: </strong>
                        {selectedProperty.amenities.swimmingPool ? "Yes" : "No"}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FaGamepad />{" "}
                      <span>
                        <strong>Play Zone: </strong>
                        {selectedProperty.amenities.playZone ? "Yes" : "No"}
                      </span>{" "}
                    </Col>
                    <Col span={12}>
                      <FaBuilding />{" "}
                      <span>
                        <strong>Convention Hall: </strong>
                        {selectedProperty.amenities.conventionHall ? "Yes" : "No"}
                      </span>
                    </Col>
                  </Row>

                  <FaDumbbell />{" "}
                  <span>
                    <strong>Gym: </strong>
                    {selectedProperty.amenities.gym ? "Yes" : "No"}
                  </span>


                  {selectedProperty.amenities.medical && (
                    <>
                      <FaHospital />{" "}
                      <span>
                        <strong>Near by Medical facilities: </strong>
                        {selectedProperty.amenities.medical}
                        <small> kms</small>
                      </span>
                      <br></br>
                    </>
                  )}
                  {selectedProperty.amenities.educational && (
                    <>
                      <FaSchool />{" "}
                      <span>
                        <strong>Near by Educational Institutions: </strong>
                        {selectedProperty.amenities.educational}
                        <small> kms</small>
                      </span>
                      <br></br>
                    </>
                  )}
                </Col>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                hoverable
                title={<span style={{ color: "#0d416b" }}>Layout Details</span>}
                style={{
                  margin: 0,
                  padding: 5,
                  height: "100%", // You can adjust this value if needed
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                }}
              >
                <div
                  style={{
                    maxHeight: '300px',  // Set a max height for the scrollable area
                    overflowY: 'auto',    // Enable vertical scrolling
                  }}
                >
                  {selectedProperty.layoutDetails.plotSize && (
                    <Col span={24}>
                      <Row>
                        <Col span={12}>
                          <AiFillSafetyCertificate />{" "}
                          <span>
                            <strong>RERA Registered: </strong>
                            {selectedProperty.layoutDetails.reraRegistered
                              ? "Yes"
                              : "No"}
                          </span>
                        </Col>
                        <Col span={12}>
                          <FaShieldAlt />{" "}
                          <span>
                            <strong>DTCP Approved: </strong>
                            {selectedProperty.layoutDetails.dtcpApproved
                              ? "Yes"
                              : "No"}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <GiCheckedShield />{" "}
                          <span>
                            <strong>TLP Approved: </strong>
                            {selectedProperty.layoutDetails.tlpApproved
                              ? "Yes"
                              : "No"}
                          </span>
                        </Col>
                        <Col span={12}>
                          <BsShieldCheck />{" "}
                          <span>
                            <strong>FLP Approved: </strong>
                            {selectedProperty.layoutDetails.flpApproved
                              ? "Yes"
                              : "No"}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <FaList className="GlobalOutlined" />
                          <span>
                            <strong>Total Plots: </strong>
                            {selectedProperty.layoutDetails.plotCount}
                          </span>
                        </Col>
                        <Col span={12}>
                          <FaCheckCircle className="GlobalOutlined" />
                          <span>
                            <strong>Available Plots: </strong>
                            {selectedProperty.layoutDetails.availablePlots}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <FaRuler className="GlobalOutlined" />
                          <span>
                            <strong>Plot Size: </strong>
                            {selectedProperty.layoutDetails.plotSize}{" "}
                            <small>{selectedProperty.layoutDetails.sizeUnit}</small>
                          </span>
                        </Col>
                        <Col span={12}>
                          <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                          <span>
                            <strong>Total Amount: </strong>
                            {formatPrice(
                              selectedProperty.layoutDetails.totalAmount
                            )}
                          </span>
                        </Col>
                        {selectedProperty.layoutDetails.plots.length === 0 && (
                          <Col span={12}>
                            <Button style={{ backgroundColor: "#0D416B", color: "white" }} onClick={togglePlots}>
                              {showPlots ? "Hide Plots" : "Show Plots"}
                            </Button>
                          </Col>
                        )}
                      </Row>
                      {showPlots && (
                        <Collapse style={{ marginTop: "20px" }}>
                          {selectedProperty.layoutDetails.plots.map((plot) => (
                            <Panel
                              header={`Plot ID: ${plot.plotId}`}
                              key={plot._id}
                              style={{ backgroundColor: "#f9f9f9" }}
                            >
                              <Row>
                                <Col span={12}>
                                  <strong>Plot Size: </strong>
                                  {plot.plotSize} {plot.sizeUnit}
                                </Col>
                                <Col span={12}>
                                  <strong>Plot Amount: </strong>
                                  {formatPrice(plot.plotAmount)}
                                </Col>
                              </Row>
                            </Panel>
                          ))}
                        </Collapse>
                      )}
                    </Col>
                  )}
                </div>
              </Card>

            </Col>
          </Row>
          <Divider />

          <Row
            gutter={16}
            style={{ marginTop: "20px", backgroundColor: "#f0f2f5" }}
          >
            {selectedProperty.amenities?.extraAmenities &&
              selectedProperty.amenities.extraAmenities.length > 0 && (
                <Card
                  // className="getComm"
                  // style={{
                  //   marginBottom: "10px",
                  //   width: "100%",
                  // }}
                  style={{
                    marginBottom: "10px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    // color: "#fff",
                    border: "none",
                    // background: "#e0dede",
                  }}
                  // title="Extra Information"
                  title={
                    <span style={{ color: "#0d416b" }}>Extra Information</span>
                  }
                >
                  <Col span={24}>
                    {selectedProperty.amenities?.extraAmenities &&
                      selectedProperty.amenities.extraAmenities.length > 0 && (
                        <span>
                          <strong>Extra Amenities: </strong>
                          {selectedProperty.amenities.extraAmenities.join(", ")}
                        </span>
                      )}
                  </Col>
                </Card>
              )}
          </Row>
        </Modal>
      )}

      {/*  layout code end here... */}

      {selectedProperty.propertyType === "Residential" && (
        <Modal
          style={{
            marginRight: !screens.xs && "10%",
            marginTop: !screens.xs && "-4%",

          }}
          bodyStyle={{
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          title={
            <div className="div2">
              <span>
                {selectedProperty.propertyId} -{' '}
                {selectedProperty.propertyDetails.apartmentName?.replace(
                  /\b\w/g,
                  (char) => char.toUpperCase()
                )}
              </span>
              {path === "getting" && (
                isPropertyOnHold === "no" ? (
                  <Button
                    type="primary"
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      padding: "10px",
                      height: "40px",
                      position: "absolute",
                      marginLeft: "75%",
                      backgroundColor: "#00AAE7",
                      color: "white",
                      borderColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleHoldOnPropertyClick(selectedProperty)}
                  >
                    Reserve This Property
                  </Button>
                ) : localStorage.getItem("userId") === selectedProperty?.reservedBy ? (
                  <>
                    <Button
                      type="primary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        padding: "10px",
                        height: "40px",
                        position: "absolute",
                        marginLeft: "65%",
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
                        marginRight: "2%",
                        backgroundColor: "#FF6347", // Red color for revert
                        color: "white",
                        borderColor: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => revertPropertyReservation(selectedProperty)}
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
                      marginLeft: "75%",
                      backgroundColor: "lightgray",
                      color: "gray",
                      borderColor: "lightgray",
                      cursor: "not-allowed",
                      marginBottom: "1%",
                    }}
                    disabled
                  >
                    Property Reserved
                  </Button>
                )
              )}
              {selectedProperty.rating ? (
                <div className="selectedProduct">
                  <StarFilled
                    style={{
                      marginRight: "5px",
                      color: "#f5d03d",
                    }}
                  />
                  <span>{selectedProperty.rating}</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          extra={
            selectedProperty.rating ? (
              <Col span={6}>
                <StarFilled
                  style={{
                    marginRight: "10px",
                    color: getStarColor(selectedProperty.rating),
                  }}
                />
                <span>{selectedProperty.rating}</span>
              </Col>
            ) : (
              <></>
            )
          }
        >
          <h3>{selectedProperty.title}</h3>
          <Row gutter={16}>
            {hasResidentialImages && hasResidentialVideo ? (
              <>
                <Col span={12}>
                  <Carousel arrows autoplay>
                    {selectedProperty.propPhotos.map((photo, index) => (
                      <div key={index}>
                        <img
                          alt={`Property Photo ${index + 1}`}
                          src={photo}
                          className="carousel"
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>
                <Col span={12}>
                  <video
                    width="100%"
                    height="250px"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source src={selectedProperty.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Col>
              </>
            ) : hasResidentialImages ? (
              <Col span={24}>
                <Carousel arrows autoplay>
                  {selectedProperty.propPhotos.map((photo, index) => (
                    <div key={index}>
                      <img
                        alt={`Property Photo ${index + 1}`}
                        src={photo}
                        className="carousel"
                      />
                    </div>
                  ))}
                </Carousel>
              </Col>
            ) :
              hasResidentialVideo ? (
                <Col span={24}>
                  <video
                    width="100%"
                    height="250px"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source src={selectedProperty.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Col>

              ) : (
                <span style={{ marginLeft: "35%", fontSize: "18px" }}>
                  No Images or Video Provided
                </span>
              )}

            {totalViews !== 0 && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <h4>{`${buyersCount} Viewers &  ${totalViews} Views `}</h4>
                  <Button
                    type="text"
                    icon={<DownOutlined />}
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#1890ff",
                      height: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #1890ff",  // Adds border around the button
                      padding: "5px",               // Adds padding inside the button
                      borderRadius: "4px",          // Optional: Adds rounded corners to the box
                    }}
                    onClick={(e) => {
                      setViewsModal(!viewsModal);
                    }}
                  />
                </div>
              </Col>
            )}
            <Col span={24} style={{ marginTop: "10px" }}>
              {selectedProperty.propertyDetails.propDesc && (
                <>
                  {" "}
                  <strong>Apartment Description:</strong>
                  {selectedProperty.propertyDetails.propDesc}
                </>
              )}
            </Col>
          </Row>
          <Divider />
          <Row
            gutter={16}
            style={{ marginTop: "20px", backgroundColor: "#f0f2f5" }}
            className="modalComm"
          >
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Row gutter={16}>
                <Col span={24}>
                  <Card
                    // className="getComm"
                    // classNames="card3"
                    style={{
                      marginBottom: "15px",
                      // width: "100%",
                      margin: 0,
                      padding: 10,
                      height: !screens.xs ? "135px" : "150px",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                      // color: "#fff",
                      border: "none",
                      // background: "#e0dede",
                    }}
                    // title="Owner Details:"
                    title={
                      <span style={{ color: "#0d416b" }}>Owner Details</span>
                    }
                  >
                    <Row>
                      <Col span={12}>
                        {selectedProperty.owner?.ownerName ? (
                          <span>
                            <strong>
                              <UserOutlined /> Name:
                            </strong>{" "}
                            {selectedProperty.owner.ownerName}
                          </span>
                        ) : (
                          "not entered"
                        )}
                      </Col>
                      <Col span={12}>
                        {selectedProperty.owner?.contact ? (
                          <span>
                            <strong>
                              <PhoneOutlined /> Contact:
                            </strong>
                            {formatPhoneNumber(selectedProperty.owner.contact)}

                          </span>
                        ) : (
                          "not entered"
                        )}
                      </Col>
                      {selectedProperty.owner?.ownerEmail && (
                        <span>
                          <strong>
                            {" "}
                            <MailOutlined /> Email:
                          </strong>
                          {selectedProperty.owner.ownerEmail}
                        </span>
                      )}

                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "2%" }}>
                <Card
                  style={{
                    marginBottom: "30px",
                    width: "100%",
                    padding: 10,
                    height: "auto",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                    border: "none",
                  }}
                  title={<span style={{ color: "#0d416b" }}>Property Details</span>}
                >
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <strong>
                        <HomeOutlined /> Type:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.type}
                    </Col>
                    <Col span={12}>
                      <strong>
                        <HomeOutlined /> Name:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.apartmentName}
                    </Col>

                  </Row>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <strong>
                        <IdcardOutlined /> Number:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.flatNumber}
                    </Col>
                    <Col span={12}>
                      <strong>
                        <LayoutOutlined /> Layout:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.apartmentLayout}
                    </Col>

                  </Row>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <strong>
                        <ExpandOutlined /> Size:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.flatSize}{" "}
                      <small>{selectedProperty.propertyDetails.sizeUnit}</small>
                    </Col>
                    <Col span={12}>
                      <strong>
                        <MoneyCollectOutlined /> Total Amount:
                      </strong>{" "}
                      {formatPrice(selectedProperty.propertyDetails.totalCost)}
                    </Col>

                  </Row>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <strong>
                        <ApartmentOutlined /> Facing:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.flatFacing}
                    </Col>
                    <Col span={12}>
                      <strong>
                        <AppstoreAddOutlined /> Furniture:
                      </strong>{" "}
                      {selectedProperty.propertyDetails.furnitured}
                    </Col>
                    {selectedProperty.propertyDetails.type === "Apartment" && (
                      <>
                        <Col span={12}>
                          <strong>
                            <AppstoreAddOutlined /> FlatsCount:
                          </strong>{" "}
                          {selectedProperty.propertyDetails.flatCount}
                        </Col>
                        <Col span={12}>
                          <strong>
                            <AppstoreAddOutlined /> Available Flats:
                          </strong>{" "}
                          {selectedProperty.propertyDetails.availableFlats}
                        </Col>
                      </>
                    )}
                  </Row>
                  {selectedProperty.propertyDetails.type === "Apartment" && (
                    <Col span={12}>
                      <Button
                        style={{ backgroundColor: "#0D416B", color: "white" }}
                        onClick={toggleFlats}
                      >
                        {showFlats ? "Hide Flats" : "Show Flats"}
                      </Button>

                      {showFlats &&
                        selectedProperty?.propertyDetails?.flat?.length > 0 && (
                          <Collapse
                            style={{ marginTop: "20px", width: "350px" }}
                            defaultActiveKey={
                              selectedProperty.propertyDetails.flat[0]?.flatNumber
                                ? [selectedProperty.propertyDetails.flat[0].flatNumber]
                                : []
                            }
                          >
                            {selectedProperty.propertyDetails.flat
                              .filter((plot) => plot.flatNumber) // ✅ Ensures panel is created only if flatNumber exists
                              .map((plot) => (
                                <Panel
                                  header={`Flat ID: ${plot.flatNumber}`}
                                  key={plot.flatNumber} // ✅ Uses flatNumber as key
                                  style={{ backgroundColor: "#f9f9f9" }}
                                >
                                  <Row>
                                    <Col span={12}>
                                      <strong>Flat Size: </strong>
                                      {plot.flatSize} {plot.flatSizeUnit}
                                    </Col>
                                    <Col span={12}>
                                      <strong>Flat Amount: </strong>₹ {formatPrice(plot.flatCost)}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={12}>
                                      <strong>Bedrooms: </strong>
                                      {plot.bedroomCount}
                                    </Col>
                                    <Col span={12}>
                                      <strong>Balcony: </strong>
                                      {plot.balconyCount}
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col span={12}>
                                      <strong>Furnished: </strong>
                                      {plot.furnitured}
                                    </Col>
                                    <Col span={12}>
                                      <strong>Flat Facing: </strong>
                                      {plot.flatFacing}
                                    </Col>
                                  </Row>
                                </Panel>
                              ))}
                          </Collapse>
                        )}

                    </Col>
                  )}
                </Card>
              </Row>

            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                // className="getComm"
                // classNames="card4"
                style={{
                  marginBottom: "30px",
                  width: "100%",
                  height: "90%",
                  // marginBottom: "30px",
                  // width: "100%",
                  margin: 0,
                  padding: 10,

                  height: !screens.xs ? "323px" : "150px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                  border: "none",
                }}
                title={<span style={{ color: "#0d416b" }}>Amenities</span>}
              >
                <Col span={24}>
                  <p>
                    {" "}
                    <strong>
                      <FaWater /> Water Facility:
                    </strong>{" "}
                    {selectedProperty.amenities?.waterFacility
                      ? "Available"
                      : "Not Available"}
                  </p>

                  <p>
                    <strong>
                      {" "}
                      <FaBolt /> Electricity Facility:
                    </strong>{" "}
                    {selectedProperty.amenities?.electricityFacility}
                  </p>
                  <p>
                    <strong>
                      <MdElevator /> Elevator:
                    </strong>{" "}
                    {selectedProperty.amenities?.elevator
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <p>
                    <strong>
                      <MdSecurity /> Watchman:
                    </strong>
                    {selectedProperty.amenities?.watchman
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <p>
                    <strong>
                      <BiCctv /> CCTV:
                    </strong>
                    {selectedProperty.amenities?.cctv
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <p>
                    <strong>
                      <FaDumbbell /> Gym Facility:
                    </strong>{" "}
                    {selectedProperty.amenities?.gymFacility
                      ? "Available"
                      : "Not Available"}
                  </p>
                  <p>
                    <strong>
                      <FaHospital /> Medical Facilities Nearby:
                    </strong>
                    {selectedProperty.amenities?.medical
                      ? selectedProperty.amenities.medical
                      : "not given"}
                  </p>
                  <p>
                    <strong>
                      <MdSchool /> Educational Institutes Nearby:
                    </strong>{" "}
                    {selectedProperty.amenities?.educational
                      ? selectedProperty.amenities?.educational
                      : "not given"}
                    Km
                  </p>
                  <p>
                    <strong>
                      <FaShoppingCart /> Grocery Stores Nearby:
                    </strong>{" "}
                    {selectedProperty.amenities?.grocery
                      ? selectedProperty.amenities.grocery
                      : "not given"}{" "}
                    Km
                  </p>
                </Col>
              </Card>
            </Col>
          </Row>

          <Row style={{ backgroundColor: " #f0f2f5" }}>
            {(Object.keys(selectedProperty.address).length > 0 ||
              (selectedProperty.configurations?.extraAmenities &&
                selectedProperty.configurations.extraAmenities.length > 0) ||
              (Array.isArray(selectedProperty.configurations?.waterSource) &&
                selectedProperty.configurations.waterSource.length > 0)) && (
                <Col span={24}>
                  <Card
                    // className="getComm"
                    // classNames="card3"
                    style={{
                      marginBottom: "10px",
                      // width: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                      border: "none",
                    }}
                    // title="More Details"
                    title={<span style={{ color: "#0d416b" }}>More Details</span>}
                  >
                    <Col span={24}>
                      <strong>Address: </strong>
                      {selectedProperty.address?.pincode &&
                        selectedProperty.address?.pincode !== "000000" && (
                          <span>
                            <NumberOutlined className="GlobalOutlined" />
                            <strong>Pincode: </strong>
                            {selectedProperty.address.pincode}
                            {screens.xs && <br></br>}
                          </span>
                        )}
                      <strong
                        style={{
                          marginLeft:
                            !screens.xs &&
                            selectedProperty.address?.pincode &&
                            selectedProperty.address?.pincode !== "000000" &&
                            "15px",
                        }}
                      >
                        <HomeOutlined /> Village:{" "}
                      </strong>
                      {selectedProperty.address?.district &&
                        selectedProperty.address?.village}{" "}
                      {screens.xs && <br></br>}
                      <strong style={{ marginLeft: !screens.xs && "15px" }}>
                        <BorderOuterOutlined /> Mandal:{" "}
                      </strong>
                      {selectedProperty.address?.district &&
                        selectedProperty.address?.mandal}{" "}
                      {screens.xs && <br></br>}
                      <strong style={{ marginLeft: !screens.xs && "15px" }}>
                        <EnvironmentOutlined /> District:{" "}
                      </strong>
                      {selectedProperty.address?.district &&
                        selectedProperty.address?.district}{" "}
                      {<br></br>}
                      <strong
                        style={{
                          marginLeft:
                            !screens.xs &&
                            selectedProperty.address?.pincode &&
                            selectedProperty.address?.pincode !== "000000" &&
                            "15px",
                        }}
                      >
                        <BankOutlined /> State:{" "}
                      </strong>
                      {selectedProperty.address?.state &&
                        selectedProperty.address?.state}{" "}
                      {screens.xs && <br></br>}
                      <strong style={{ marginLeft: !screens.xs && "15px" }}>
                        <GlobalOutlined /> Country:{" "}
                      </strong>
                      {selectedProperty.address?.country &&
                        selectedProperty.address?.country}{" "}
                      {screens.xs && <br></br>}
                    </Col>
                    <Col>
                      {(selectedProperty.configurations?.bathroomCount > 0 ||
                        selectedProperty.configurations?.balconyCount > 0 ||
                        selectedProperty.configurations?.floorNumber ||
                        selectedProperty.configurations?.propertyDescription ||
                        selectedProperty.configurations?.propertyAge ||
                        selectedProperty.configurations?.maintenanceCost ||
                        selectedProperty.configurations?.visitorParking ||
                        selectedProperty.configurations?.playZone) && (
                          <span>
                            <strong>Extra Amenities: </strong>
                            {selectedProperty.configurations?.bathroomCount > 0 && (
                              <span>
                                Bathrooms:{" "}
                                {selectedProperty.configurations.bathroomCount}{" "}
                              </span>
                            )}
                            {selectedProperty.configurations?.balconyCount > 0 && (
                              <span>
                                Balconies:{" "}
                                {selectedProperty.configurations.balconyCount}{" "}
                              </span>
                            )}
                            {selectedProperty.configurations?.floorNumber && (
                              <span>
                                Floor: {selectedProperty.configurations.floorNumber}{" "}
                              </span>
                            )}
                            {selectedProperty.configurations
                              ?.propertyDescription && (
                                <span>
                                  Description:{" "}
                                  {
                                    selectedProperty.configurations
                                      .propertyDescription
                                  }{" "}
                                </span>
                              )}
                            {selectedProperty.configurations?.propertyAge && (
                              <span>
                                Age: {selectedProperty.configurations.propertyAge}{" "}
                              </span>
                            )}
                            {selectedProperty.configurations?.maintenanceCost && (
                              <span>
                                Maintenance Cost:{" "}
                                {selectedProperty.configurations.maintenanceCost}{" "}
                              </span>
                            )}
                            {selectedProperty.configurations?.visitorParking && (
                              <span>
                                Visitor Parking:{" "}
                                {selectedProperty.configurations.visitorParking}{" "}
                              </span>
                            )}
                            {selectedProperty.configurations?.playZone && (
                              <span>
                                Play Zone:{" "}
                                {selectedProperty.configurations.playZone}{" "}
                              </span>
                            )}
                          </span>
                        )}
                    </Col>
                    <Col>
                      {selectedProperty.configurations.waterSource &&
                        selectedProperty.configurations.waterSource.length >
                        0 && (
                          <span>
                            <strong>waterSources: </strong>
                            {selectedProperty.configurations.waterSource.join(
                              ", "
                            )}
                          </span>
                        )}
                    </Col>
                  </Card>
                </Col>
              )}
          </Row>
        </Modal>
      )}
      {viewsModal && (
        <ShowViews
          viewProp={selectedProperty}
          viewsModal={viewsModal}
          setViewsModal={setViewsModal}
        />
      )}
    </>
  );
};

export default ShowModal;




import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Empty,
  Button,
  message,
  Pagination,
  Select,
  Input,
  Checkbox,
  Modal, DatePicker,
  Skeleton,
  Tag
} from "antd";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRuler, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { _get, _post } from "../../Service/apiClient";
import Meta from "antd/es/card/Meta";
import moment from 'moment';
import ShowModal from "../Agent/ShowModal";
import { useLocation, useNavigate } from "react-router-dom";
import { MailOutlined, SearchOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import {
  // MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Option } = Select;
function PropertiesCSR() {
  const [landDetails, setLandDetails] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [validInput, setValidInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const location = useLocation();
  const itemsPerPage = 6;
  const rowRef = useRef(null);
  const topRef = useRef(null);
  const navigate = useNavigate();
  const [assignedDate, setAssignedDate] = useState(null);
  const [enableIcons, setEnableIcons] = useState(false);
  const Id = localStorage.getItem("userId");
  const enableSelection = location.state?.enableSelection || false;
  const MarketingAgentId = location.state?.MarketingAgentId || null;
  const fetchData = async (Id) => {
    setLoading(true);
    await _get(`/csr/getPropsByCsr/${Id}`)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setLandDetails(response.data);
        setFilteredProperties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };
  const [selectDate, setSelectDate] = useState(false);
  const datePickerRef = useRef(null);

  const handleChooseDateClick = () => {
    setSelectDate(true);
    if (datePickerRef.current) {
      datePickerRef.current.focus();
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProperty(null);
  };

  const handleCheckboxChange = (propertyId, checked) => {
    console.log(propertyId);
    console.log(enableIcons);

    setSelectedProperties((prevSelected) => {
      const updatedSet = new Set(prevSelected);
      if (checked) {
        updatedSet.add(propertyId);
        setEnableIcons(true);
      } else {
        updatedSet.delete(propertyId);
        setEnableIcons(false);
      }
      return updatedSet;
    });

    // Scroll to the top of the component
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const [isInputVisible, setInputVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setPhoneValid] = useState(false);
  const [shareMethod, setShareMethod] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setInputValid] = useState(false);
  const [typeSearchQuery, setTypeSearchQuery] = useState("All")
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [nameSearchQuery2, setNameSearchQuery2] = useState("");
  const handleShareClick = (method) => {
    console.log("share clicked");
    setShareMethod(method);
    setInputVisible(true);

    setInputValue("");
    setInputValid(false);
    setErrorMessage("");
    setIsModalOpen(true);
  };
  const filterProperties = (landDetails) => {
    return landDetails.filter((item) => {
      console.log(locationSearchQuery);
      const typeSearch = typeSearchQuery !== "All" ? typeSearchQuery.toLowerCase() : "";
      const locationSearch = locationSearchQuery.toLowerCase();
      const agentSearch = nameSearchQuery.toLowerCase();

      const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : "";
      const isPropertyIdSearch = /\d/.test(nameSearch2);
      const typeMatch = typeSearchQuery === "All" || item.propertyType.toLowerCase().includes(typeSearch);
      console.log(item.district);
      console.log(item.mandal);
      console.log(item.village);
      const locationMatch =
        (item.district && item.district.toLowerCase().includes(locationSearch)) ||
        (item.mandal && item.mandal.toLowerCase().includes(locationSearch)) ||
        (item.village && item.village.toLowerCase().includes(locationSearch));
      console.log(locationMatch)


      const agentMatch = nameSearchQuery === "" || item.agentName.toLowerCase().includes(agentSearch);

      // Matches property ID or property name based on the input type.
      const nameMatch2 = isPropertyIdSearch
        ? item.propertyId && item.propertyId.toString().toLowerCase().includes(nameSearch2)
        : item.propertyName && item.propertyName.toLowerCase().includes(nameSearch2);

      // Return true only if all filters match.
      return typeMatch && locationMatch && agentMatch && (nameSearchQuery2 === "" || nameMatch2);
    });
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
  const handleSearchFilters = () => {
    setCurrentPage(1); // Reset to first page after filter
    const filteredProperties = filterProperties(landDetails);
    // Now update your state with filtered properties
    setFilteredProperties(filteredProperties);
  };
  // Example of calling the filter logic on input change or form submission:
  useEffect(() => {
    handleSearchFilters();
  }, [typeSearchQuery, locationSearchQuery, nameSearchQuery, selectedType, nameSearchQuery2]);

  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const handleCardClick = (property) => {
  //   fetchPropetiesData(property.type);
  //   setSelectedProperty(data);
  //   console.log(selectedProperty);
  //   setIsModalVisible(true);
  // };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (shareMethod === "whatsapp") {
      // Validate phone number: must be exactly 10 digits
      const phoneRegex = /^[0-9]{10}$/; // Allows only 10-digit numbers
      if (!phoneRegex.test(value)) {
        setErrorMessage("Invalid phone number. Please enter a 10-digit phone number.");
        setValidInput(false);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (shareMethod === "email") {
      // Validate email address
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrorMessage("Invalid email address. Please enter a valid email.");
        setValidInput(false);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    }
  };

  const handleCardClick = async (property) => {
    console.log("peroio");
    fetchPropetiesData(property.type);

    await _get(
      `property/getpropbyid/${property.propertyType}/${property._id}`
    ).then((response) => {
      setSelectedProperty(response.data);
      setIsModalVisible(true);
    });

    console.log(selectedProperty);
  };
  const fetchPropetiesData = async (path) => {
    console.log("called");
    try {
      const response = await _get(`/fields/${path}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const shareProperties = async () => {
    console.log("selepropert", selectedProperties);
    if (selectedProperties.size === 0) {
      message.warning("No properties selected to share.");
      return;
    }
    console.log("selepropert", landDetails);
    const selectedDetails = Array.from(selectedProperties).map((id) => {

      const property = landDetails.find((item) => item._id === id);
      console.log("propert", property);
      return {
        name: property.propertyName,
        district: property.district,
        price: property.price,
        size: property.size,
        imageUrl: property.images[0],
      };
    });

    const requestBody = {
      propertyData: {
        properties: selectedDetails,
      },
      customerData: {
        name: "Sneha",
        contactType: shareMethod,
        contactValue: inputValue,
      },
    };

    const apiUrl = "/customer/shareProperty";

    try {
      setLoading(true); // Start loader
      const response = await _post(
        apiUrl,
        requestBody,
        `Properties shared successfully via ${shareMethod === "email" ? "Email" : "WhatsApp"
        }!`
      );
      setLoading(false);
      setIsModalOpen(false);
      setInputValue("");

    } catch (error) {
      setLoading(false); // Stop loader on error
      message.error(
        `An error occurred while sharing properties via ${shareMethod}.`
      );
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
    setValidInput(false);
    setErrorMessage("");
  };
  useEffect(() => {
    fetchData(Id);
  }, []);
  const handleBackToCustomers = () => {
    navigate('/dashboard/csr/MarketingAgents');
  };
  const handleCloseModal = () => {
    setIsAssignModalOpen(false);
    setSelectDate(false);
  };
  const handleAssignClick = () => {
    setIsAssignModalOpen(true);
  };
  const handleAssign = async (dateType) => {
    const properties = Array.from(selectedProperties);
    const csrId = localStorage.getItem("userId");
    let dateToAssign;

    if (dateType === "Today") {
      setSelectDate(false);
      dateToAssign = moment();
    } else if (dateType === "Tomorrow") {
      setSelectDate(false);
      console.log("fhfhf");
      dateToAssign = moment().add(1, "days");
      console.log(dateToAssign);
    } else {
      const date = new Date(assignedDate);
      date.setDate(date.getDate() + 1);
      dateToAssign = date;
    }
    console.log(assignedDate);
    const payload = {
      assignedBy: csrId,
      assignedTo: MarketingAgentId,
      propertyIds: properties,
      assignedDate: dateToAssign,
    };

    console.log(payload);
    try {
      const res = await _post(
        "/csr/assigneProperty",
        payload,
        "Assigned Successfully",
        `This Property is already assigned for this date `
      );
      setAssignedDate(null);
      setIsAssignModalOpen(false);
      setSelectedProperties(new Set());
    } catch (error) {
    }
  };
  const handleDateChange = (date) => {
    setAssignedDate(date);
  };
  return (
    <div >
      <Card
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

          borderRadius: "8px",

        }}

      >


        <Row gutter={16} style={{ marginLeft: "2%" }} >
          {enableSelection && (
            <Col>
              <button
                onClick={handleBackToCustomers}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#0D416B',
                  color: 'white',
                  marginLeft: "-20%",
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                <FaArrowLeft />
              </button>
            </Col>
          )}
          <Col xs={24} sm={12} md={8} lg={5}>
            <Select
              defaultValue="All"
              style={{
                width: "100%"
                , height: "36px"
              }}

              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
              onChange={(value) => setTypeSearchQuery(value)}
            >
              <Option value="All">All Properties</Option>
              <Option value="Agricultural land">Agriculture</Option>
              <Option value="Residential">Residential</Option>
              <Option value="Commercial">Commercial</Option>
              <Option value="Layout">Layout</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Input
              placeholder="Search by Location"
              allowClear
              onChange={(e) => setLocationSearchQuery(e.target.value)}
              style={{
                width: "100%"
                , height: "36px"
              }}
              prefix={<SearchOutlined
                style={{ color: "#082d4a" }} />}
            />

          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Input
              placeholder="Property Name / ID"
              allowClear
              onChange={(e) => {
                console.log(e.target.value); // Logs the value entered in the input field
                setNameSearchQuery2(e.target.value); // Updates the state with the new value
              }}

              style={{
                width: "100%"
                , height: "36px"
              }}
              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
            />

          </Col>


          {enableSelection && (
            <Col xs={24} sm={12} md={3} lg={3}>
              <Button
                type="primary"
                onClick={handleAssignClick}
                style={{
                  width: '65%',
                  backgroundColor: selectedProperties.size === 0 ? '#B0B0B0' : "#0D416B", // Change color when disabled
                  color: "white",
                  padding: "18px",
                }}
                disabled={selectedProperties.size === 0}
              >
                Assign
              </Button>
            </Col>
          )}

          {!enableSelection && enableIcons && (
            <>
              <Col style={{ marginLeft: "5%" }}>
                <Tag color="geekblue" onClick={() => handleShareClick("whatsapp")}>
                  <FaWhatsapp style={{ fontSize: "25px" }} />
                </Tag>

              </Col>
              <Col>
                <Tag color="geekblue" onClick={() => handleShareClick("email")}>
                  <MailOutlined style={{ fontSize: "25px" }} />
                </Tag>


              </Col>
            </>
          )}
          {!enableIcons && !enableSelection && (
            <>
              <Col style={{ marginLeft: "5%" }}>
                <Tag
                  color="lightgray" // Light color to indicate disabled state
                  style={{ cursor: "not-allowed", opacity: 0.6 }} // Remove pointer and dim the icon
                  onClick={(e) => e.preventDefault()} // Prevent click actions
                >
                  <FaWhatsapp style={{ fontSize: "25px", color: "gray" }} />

                </Tag>
              </Col>
              <Col>
                <Tag
                  color="lightgray"
                  style={{ cursor: "not-allowed", opacity: 0.6 }}
                  onClick={(e) => e.preventDefault()}
                >
                  <MailOutlined style={{ fontSize: "25px", color: "gray" }} />

                </Tag>
              </Col>
            </>
          )}

        </Row>
      </Card>

      <Modal
        title={`Share via ${shareMethod === "whatsapp" ? "WhatsApp" : "Email"}`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={400}
      >
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={`Enter ${shareMethod === "whatsapp" ? "phone number" : "email address"}`}
          style={{
            marginBottom: "10px",
          }}
        />
        {errorMessage && (
          <div
            style={{
              color: "red",
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            {errorMessage}
          </div>
        )}
        {validInput && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Button
              type="primary"
              onClick={shareProperties}
              loading={loading}
              style={{
                flex: 1,
                backgroundColor: shareMethod === "whatsapp" ? "#25D366" : "#0072C6",
                borderColor: shareMethod === "whatsapp" ? "#25D366" : "#0072C6",
              }}
            >
              {loading ? "Sending..." : "Share"}
            </Button>
            <Button
              onClick={closeModal}
              style={{
                flex: 1,
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </Modal>


      {loading ? (
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
                    marginTop: "2%",
                    backgroundColor: "#f0f0f0", // Optional: for a background color
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row
          ref={rowRef}
          className="cards-container"
          style={{ marginTop: "1%", padding: "20px" }}
          gutter={[24, 24]}
        >

          {currentProperties.length > 0 ? (
            currentProperties.map((item) => (
              <Col
                key={item.propertyId}
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={8}
                xxl={8}
              >

                <Card
                  hoverable
                  className="card-item"
                  cover={
                    <div className="image-container" style={{ position: "relative" }}>
                      <img
                        alt={item.title}
                        style={{
                          height: "164px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        className="property-card"
                        onClick={() => handleCardClick(item)}
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0]
                            : item.propertyType.includes("Agricultural")
                              ? "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png"
                              : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                        }


                      />
                      <div
                        className="price-tag"
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "12px",
                          backgroundColor: "#329da8",
                          color: "white",
                          padding: "5px 16px",
                          borderRadius: "5px",
                        }}
                      >
                        ₹{formatPrice(item.price)}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "white",
                          borderRadius: "5px",
                        }}

                      >

                        <Checkbox
                          checked={selectedProperties.has(item._id)} // Ensure checkbox is properly checked for each item
                          onChange={(e) =>
                            handleCheckboxChange(item._id, e.target.checked)
                          }
                          style={{ marginBottom: "10px" }}
                        />
                      </div>
                    </div>
                  }
                  style={{ backgroundColor: "rgba(159, 159, 167, 0.23)" }}
                >


                  <Meta
                    title={item.title}
                    description={
                      <>
                        {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "black",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faRuler}
                            style={{ marginRight: "8px" }}
                          />
                          {item.size} sq ft
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
                          {item.district}
                        </p>
                      </div>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "black",
                        }}
                      >
                        <strong>Agent:</strong>{item.agentName}
                      </p> */}
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
                            <b style={{ marginLeft: "3px" }}>{item.propertyName} ({item.propertyId})</b>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "black",
                            }}
                          >
                            {/* <FontAwesomeIcon
 icon={faMapMarkerAlt}
 style={{ marginRight: "8px" }}
 /> */}
                            <UserOutlined /> <span style={{ marginLeft: "3px" }}>    {item.agentName}</span>

                          </p>

                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {" "}
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "black",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faRuler}
                              style={{ marginRight: "8px" }}
                            />
                            {item.size} {item.sizeUnit}
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
                            {item.district}
                          </p>
                        </div>
                        <button
                          style={{
                            background:
                              "#0D416B",
                            color: "white",
                            border: "none",
                            borderRadius: "7px",
                            marginTop: "4%",
                            float: "right",
                            marginRight: "9%",
                          }}
                          onClick={(e) => handleCardClick(item, e)}
                        >
                          More
                        </button>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center" }}>
              <Empty description="No properties available" />
            </Col>
          )}

        </Row>
      )}
      {
        selectedProperty && (
          <ShowModal
            selectedProperty={selectedProperty}
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
          />
        )
      }
      <div style={{ float: "right" }}>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredProperties.length}
          onChange={handlePageChange}

        />
      </div>

      {
        isModalVisible && (
          <ShowModal
            selectedProperty={selectedProperty}
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
          />
        )
      }
      <Modal
        title="Select Date"
        visible={isAssignModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={350}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Button
              type="primary"
              style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
              onClick={() => handleAssign("Today")}
              disabled={loading}
            >
              Today
            </Button>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
              onClick={() => handleAssign("Tomorrow")}
              disabled={loading}
            >
              Tomorrow
            </Button>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
              onClick={handleChooseDateClick}
              disabled={loading}
            >
              Choose Date
            </Button>
          </Col>
        </Row>
        {selectDate && (
          <Row>
            <Col span={24}>
              <DatePicker
                ref={datePickerRef}
                value={assignedDate}
                onChange={handleDateChange}
                placeholder="Select Assignment Date"
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                  disabledDate={(current) => current && current < moment().startOf('day')}
              />
            </Col>
          </Row>
        )}
        {selectDate && (
          <Row style={{ marginTop: '20px', marginLeft: "20%" }} gutter={16}>
            <Col span={8}>
              <Button
                type="primary"
                loading={loading}
                onClick={() => handleAssign("Custom")}
                style={{ width: '100%', backgroundColor: "#0D416B", color: "white" }}
              >
                Assign
              </Button>
            </Col>
            <Col span={8}>
              <Button
                onClick={handleCloseModal}
                style={{ width: '100%' }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        )}
      </Modal>
    </div >
  );
}

export default PropertiesCSR;















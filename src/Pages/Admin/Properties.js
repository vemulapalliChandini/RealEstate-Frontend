

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
  Popover,
  Spin,
} from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRuler, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { _get, _delete } from "../../Service/apiClient";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function Properties() {
  const [landDetails, setLandDetails] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
  const rowRef = useRef(null);

  const navigate = useNavigate();


  const fetchData = async () => {
    setLoading(true);
    await _get("/getallprops")
      .then((response) => {
        console.log(response);
        setLandDetails(response.data);
        setFilteredProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const filterByType = (type) => {
    console.log(type);
    setSelectedType(type);
    if (type === "All") {
      setFilteredProperties(landDetails);
    } else {
      setFilteredProperties(
        landDetails.filter((item) => {
          console.log(item.propertyType);
          return item.propertyType === type;
        })
      );
    }
    setCurrentPage(1);
  };


  const filterByLocation = (location) => {
    setSearchLocation(location);
    if (location === "") {
      setFilteredProperties(landDetails);
    } else {
      setFilteredProperties(
        landDetails.filter((item) =>
          item.district.toLowerCase().includes(location.toLowerCase())
        )
      );
    }
    setCurrentPage(1); // Reset to the first page on location change
  };

  const deleteProperty = async (propertyId, propertyType) => {
    if (!propertyId || !propertyType) {
      console.error(
        "Invalid parameters: propertyId or propertyType is missing",
        {
          propertyId,
          propertyType,
        }
      );
      return;
    }

    await _delete(
      `/admin/removeProperties/${propertyId}/${propertyType}`,
      "Property removed successfully",
      "Failed to remove Property"
    )
      .then(() => {
        console.log("Property deleted:", propertyId);
        setFilteredProperties((prevDetails) =>
          prevDetails.filter((property) => property.propertyId !== propertyId)
        );
      })
      .catch((error) => {
        console.error("Error deleting property:", error);
        message.error("Failed to remove Property");
      });
  };

  // Pagination: get current properties based on page
  const currentProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
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


  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Helper function for formatting price
 

  const handleCardClick = (property) => {
    if (property.propertyType === "Agricultural land") {
      navigate(`/dashboard/admin/agriculture/details/${property.propertyId}`);
    } else if (property.propertyType === "Commercial") {
      navigate(`/dashboard/admin/commercial/details/${property.propertyId}`);
    } else if (property.propertyType === "Layout") {
      navigate(`/dashboard/admin/layout/details/${property.propertyId}`);
    } else if (property.propertyType === "Residential") {
      navigate(`/dashboard/admin/residential/details/${property.propertyId}`);
    }
  };




  if (loading) {
    return <Spin size="large" style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }} />;
  }


  return (
    <div>
      <Card
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

          borderRadius: "8px",

        }}
      >
        <Row gutter={[16, 16]}>
          <Col>
            <Select
              defaultValue="All"

              style={{
                width: "100%"
                , height: "36px"
              }}

              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
              onChange={filterByType}
            >
              <Option value="All">All Properties</Option>
              <Option value="Agricultural land">Agriculture</Option>
              <Option value="Residential">Residential</Option>
              <Option value="Commercial">Commercial</Option>
              <Option value="Layout">Layout</Option>
            </Select>
          </Col>
          <Col>
            <Input
              placeholder="Search by Location"
              value={searchLocation}
              onChange={(e) => filterByLocation(e.target.value)}
             
              style={{width: "100%"
                , height: "36px"
            }}
               
              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
            />
          </Col>
        </Row>
      </Card>

      <Row
        ref={rowRef}
        className="cards-container"
        style={{ marginTop: "6%", padding: "20px" }}
        gutter={[24, 24]}
      >
        {currentProperties.length > 0 ? (
          currentProperties.map((item) => (
            <Col key={item._id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Card
                hoverable
                className="card-item"
                cover={
                  <div
                    className="image-container"
                    style={{ position: "relative" }}
                  >
                    <img
                      alt={item.title}
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : item.propertyType.includes("Agricultural")
                            ? "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png"
                            : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                      }

                      style={{
                        height: "164px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      className="property-card"
                      onClick={() => handleCardClick(item)}
                    />

                    <Popover
                      content={
                        <div style={{ textAlign: "center" }}>
                          <p>Are you sure you want to delete this property?</p>
                          <Button
                            type="primary"
                            danger
                            onClick={() => {
                              if (item.propertyId && item.propertyType) {
                                deleteProperty(item.propertyId, item.propertyType);
                              } else {
                                console.error("Invalid property data:", item);
                              }
                            }}
                            style={{ marginRight: "8px" }}
                          >
                            Yes
                          </Button>
                          <Button type="default">No</Button>
                        </div>
                      }
                      trigger="click"
                      placement="topRight"
                    >
                      <DeleteOutlined
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          fontSize: "20px",
                          color: "#ff4d4f",
                          cursor: "pointer",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "5px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    </Popover>
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
                  </div>
                }
                style={{ backgroundColor: "rgba(159, 159, 167, 0.23)" }}
              >
                <Meta
                  description={
                    <div>
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <p>
                            <strong>{item.title}</strong>
                          </p>
                        </Col>
                      </Row>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <p
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "inline-block",
                              maxWidth: "100px", // Adjust as needed
                              position: "relative",
                            }}
                            title={`${item.size}  ${item.sizeUnit}`} // This ensures a native browser tooltip
                          >
                            <FontAwesomeIcon
                              icon={faRuler}
                              style={{
                                marginRight: "5px",
                                color: "#007bff",
                              }}
                            />
                            <strong>{item.size} {item.sizeUnit}</strong>{" "}

                          </p>
                        </Col>

                        <Col span={12}>
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              style={{
                                marginRight: "10px",
                                color: "#007bff",
                              }}
                            />
                            <strong
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100px",
                                display: "inline-block",
                              }}
                            >
                              {item.district}
                            </strong>
                          </span>
                        </Col>
                      </Row>
                      <Row></Row>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center" }}>
            <Empty description="No Properties Found" />
          </Col>
        )}
      </Row>
      <Row >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",

            right: "20px",
            width: "100%",
            zIndex: 1000,
          }}
        >
          <Pagination
            current={currentPage}
            total={filteredProperties.length}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </div>

      </Row>

    </div >
  );
}

export default Properties;






















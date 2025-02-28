import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Spin, Button, Pagination, Grid, Popconfirm, Input, Skeleton } from "antd";

import { useNavigate } from "react-router-dom";

import "antd/dist/reset.css";
import "./Wishlist.css";

import { _delete, _get } from "../../../Service/apiClient";

import {
  MoneyCollectOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  ClusterOutlined,
  EllipsisOutlined,
  AppstoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
const { Meta } = Card;
const { useBreakpoint } = Grid;

const ReservedProperties = () => {
  const { t, i18n } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameSearchQuery2, setNameSearchQuery2] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await _get("/deal/reservedProperty")
      .then((response) => {
        const data = response.data;
        console.log(data);
        const formattedProperties = [];
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleRemove = async (propertyId) => {
    console.log("dshdhd");
    try {
      await _delete(
        `/wishlist/delete/${propertyId}`,
        "Property removed from wishlist",
        "Failed to remove property from wishlist"
      ).then(() => {
        setProperties((prevProperties) =>
          prevProperties.filter((property) => property.propertyId !== propertyId)
        );
      });
    } catch (error) {
      console.error("Error deleting data:", error);
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

  const handleCardClick = (property) => {
    if (property.propertyType === "Agricultural") {
      navigate(`/dashboard/buyer/agriculture/details/${property._id}`);
    } else if (property.propertyType === "Commercial") {
      navigate(`/dashboard/buyer/commercial/details/${property.property._id}`);
    } else if (property.propertyType === "Layout") {
      navigate(`/dashboard/buyer/layout/details/${property._id}`);
    } else if (property.propertyType === "Residential") {
      navigate(`/dashboard/buyer/residential/details/${property._id}`);
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
  const filterProperties = (properties) => {
    return properties.filter((item) => {
      console.log(nameSearchQuery2);
      const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : "";
      console.log(nameSearch2);
      const isPropertyIdSearch = /\d/.test(nameSearch2);
    
      const nameMatch2 = isPropertyIdSearch
        ? item.propertyId && item.propertyId.toString().toLowerCase().includes(nameSearch2)
        : item.propertyName && item.propertyName.toLowerCase().includes(nameSearch2);
      console.log(nameMatch2);
      return nameSearchQuery2 === "" || nameMatch2;
    });
  };


  const filterproperties = filterProperties(properties);
  let paginatedData;
  if (Array.isArray(filterproperties)) {
    paginatedData = filterproperties.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    console.log("Paginated Data:", paginatedData);
  } else {
    console.error("Filtered properties is not an array.");
  }

  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div className="wishlist" ref={targetCardRef}>
      {/* <h1>idena</h1> */}
      <Card
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "2%",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5", // Changed background color for this card


        }}
      >
        <Col xs={24} sm={12} md={8} lg={5} >
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
      </Card>
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
      ) : properties.length === 0 ? (
        <div className="empty-state"></div>
      ) : (
        <div>
          <Row gutter={[16, 24]}>
            {paginatedData.map((property, index) => (
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6} key={index}>
                <Card
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "box-shadow 0.3s ease",
                    backgroundColor:"rgba(159, 159, 167, 0.23)",
                 
                    borderRadius:"27px"
                    // border-radius: 8px;
                    // padding: 10px;
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0, 0, 0, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                  cover={
                    <>
                    
                      <img
                        src={
                          property?.propertyType?.includes("Agricultural")
                            ? property?.landDetails?.images && property?.landDetails?.images.length > 0
                              ? property?.landDetails?.images[0]
                              : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png"
                            : property?.propertyType?.includes("Commercial")
                              ? property?.propertyDetails?.uploadPics && property?.propertyDetails?.uploadPics.length > 0
                                ? property?.propertyDetails?.uploadPics[0]
                                : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                              : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                        }
                        alt="Property"
                        style={{
                          // borderTopLeftRadius: "8px",
                          // borderTopRightRadius: "8px",
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderBottom: "none",
                          borderRadius:"4px"

                          // width: 100%;
                          // height: 150px;
                          // object-fit: cover;
                          // border-radius: 4px;
                        }}
                      />
                    </>
                  }

                 className="card-item"
                  onClick={() => handleCardClick(property)}
                >
                  <Meta
                    title={
                      <Row gutter={[16, 0]}>
                        <Col span={12}>
                          <p
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              display: "block",
                              textAlign: "center",
                            }}
                          >

                            <span>

                              {property.propertyType.includes("Agricultural")
                                ? `${property.landDetails.title} (${property.propertyId})`
                                : property.propertyType.includes("Layout")
                                  ? `${property.layoutDetails.layoutTitle} (${property.propertyId})`
                                  : property.propertyType.includes("Residential")
                                    ? `${property?.propertyDetails?.apartmentName} (${property.propertyId})`
                                    : `${property.property.propertyTitle} (${property.property.propertyId})`}
                            </span>

                          </p>
                        </Col>
                        <Col span={12}>

                          <p
                            className="property-detail"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              display: "block",
                              textAlign: "center",
                            }}
                          >
                            {property.propertyType.includes("Agricultural") ? (
                              <>
                                <Col span={24}>
                                  <AppstoreOutlined className="GlobalOutlined" />{" "}
                                  {property.landDetails.size} {property.landDetails.sizeUnit}
                                  <br />

                                </Col>

                              </>
                            ) : property?.propertyType.includes("Layout") ? (
                              <>
                                <AppstoreOutlined className="GlobalOutlined" />{" "}
                                {property?.layoutDetails?.plotSize}  {property?.layoutDetails?.sizeUnit}

                              </>
                            ) : property?.propertyType?.includes("Residential") ? (
                              <>
                                <AppstoreOutlined className="GlobalOutlined" />{" "}
                                {property?.propertyDetails?.flatSize}  {property?.propertyDetails?.sizeUnit}

                              </>
                            ) : (
                              <>
                                {property?.property.propertyDetails?.landDetails?.sell?.plotSize && (
                                  <Col span={24}>
                                    <AppstoreOutlined className="GlobalOutlined" />{" "}
                                    <span>

                                      {property?.property.propertyDetails?.landDetails?.sell.plotSize}  {property.propertyDetails.landDetails?.sell.sizeUnit}
                                    </span>
                                    <br />

                                  </Col>
                                )}

                                {property?.property.propertyDetails?.landDetails?.lease?.plotSize && (
                                  <Col span={24}>
                                    <AppstoreOutlined className="GlobalOutlined" />{" "}
                                    <span>

                                      {property?.property.propertyDetails?.landDetails?.lease.plotSize}  {property.property.propertyDetails.landDetails.lease.sizeUnit}
                                    </span>
                                    <br />

                                  </Col>
                                )}

                                {property?.property.propertyDetails?.landDetails.rent?.plotSize && (
                                  <Col span={24}>
                                    <AppstoreOutlined className="GlobalOutlined" />{" "}
                                    <span>

                                      {property?.property.propertyDetails?.landDetails.rent.plotSize} {property.property.propertyDetails.landDetails.rent.sizeUnit}
                                    </span>
                                    <br />

                                  </Col>
                                )}
                              </>
                            )}
                          </p>
                        </Col>
                      </Row>
                    }
                    description={
                      <Row gutter={[16, 0]} >
                        <Col span={12}>
                          <p
                            className="property-detail"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              display: "block",
                              textAlign: "center",
                              color:"black",
                            }}
                          >

                            <EnvironmentOutlined />{" "}
                            {property.propertyType.includes("Agricultural")
                              ? property?.address?.district
                              : property.propertyType.includes("Layout")
                                ? property?.layoutDetails?.address?.district
                                : property.propertyType.includes("Residential")
                                  ? property?.address?.district
                                  : property?.property.propertyDetails?.landDetails.address.district}


                          </p>
                        </Col>
                        <Col span={12}>

                          <p
                            className="property-detail"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                              display: "block",
                              textAlign: "center",
                              color:"black",
                            }}
                          >
                            {property.propertyType.includes("Agricultural") ? (
                              <>
                                <Col span={24}>


                                  <MoneyCollectOutlined />{" "}
                                  {formatPrice(property.landDetails.price)}
                                  <br />
                                </Col>

                              </>
                            ) : property.propertyType.includes("Layout") ? (
                              <>

                                <MoneyCollectOutlined />{" "}
                                {formatPrice(property.layoutDetails.totalAmount)}
                              </>
                            ) : property.propertyType.includes("Residential") ? (
                              <>

                                <MoneyCollectOutlined />{" "}
                                {formatPrice(property?.propertyDetails?.totalCost)}
                              </>
                            ) : (
                              <>
                                {property?.property.propertyDetails?.landDetails.sell?.plotSize && (
                                  <Col span={24}>

                                    <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                                    <span>

                                      {formatPrice(
                                        property?.property.propertyDetails?.landDetails.sell.totalAmount
                                      )}
                                    </span>
                                    <br />
                                  </Col>
                                )}

                                {property?.property.propertyDetails?.landDetails.lease?.plotSize && (
                                  <Col span={24}>

                                    <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                                    <span>
                                      <strong>Total Amount: </strong>
                                      {formatPrice(
                                        property?.property.propertyDetails?.landDetails.lease.totalAmount
                                      )}
                                    </span>
                                    <br />
                                  </Col>
                                )}

                                {property?.property.propertyDetails?.landDetails.rent?.plotSize && (
                                  <Col span={24}>

                                    <span style={{ marginTop: "2%" }}>
                                      <MoneyCollectOutlined className="GlobalOutlined" />{" "}
                                      <span>
                                        <strong>Total Amount: </strong>
                                        {formatPrice(
                                          property?.property.propertyDetails?.landDetails.rent.totalAmount
                                        )}
                                      </span>
                                    </span>
                                  </Col>
                                )}
                              </>
                            )}
                          </p>
                        </Col>

                      </Row>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          {properties.length > 6 && (
            <Row  style={{ float:"right",marginTop:"1%"}}>
              <Col>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={properties.length}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  pageSizeOptions={["6", "12", "18", "24"]}
                />
              </Col>
            </Row>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservedProperties;
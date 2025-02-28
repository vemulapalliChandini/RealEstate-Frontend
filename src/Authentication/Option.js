import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Spin, Empty, Tag, Badge } from "antd";
import { _get } from "../Service/apiClient";

const { Meta } = Card;

const { Title, Text } = Typography;

const Option = () => {
  const [landDetails, setLandDetails] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await _get(`/latestprops`)
      .then((response) => {
        console.log(response.data);
        setLandDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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

  const badgeStyle = {
    // backgroundColor: "#ff4d4f",
    backgroundColor: "#0d416b",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    position: "relative",
    marginTop: "-18px",
    animation: "slideBackForth 2s ease-in-out infinite",
    padding: "7px",
    border: "solid 2px",

  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000); // Simulate a 2-second load
    return () => clearTimeout(timer);
  }, []);


  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div style={{ display: "flex" }}>

      <div style={{ width: "8%", margin: "-2% 0% 0% 3%" }}>
        {landDetails.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              marginTop: "20%",
              height: "10px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Spin size="large" />
            <p>Loading latest properties...</p>
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            <div style={{ width: "100%", margin: "0% 0% 0% 3%" }}>
              {landDetails.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    marginTop: "20%",
                    height: "10px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Spin size="large" />
                  <p>Loading latest properties...</p>
                </div>
              ) : (
                <div className="horizontal-banner-container">
                  <div className="scrolling-cards">
                    {landDetails.length > 0 ? (
                      landDetails.slice(0, 6).map((item) => (
                        <div
                          key={item._id}
                          className="vertical-banner-item"
                          style={{
                            marginBottom: "-60px",
                            marginRight: "50px",
                            width: "300%",
                          }}
                        >
                          {item.propertyType === "Agricultural land" && (
                            <Card
                              // title={
                              //   <div
                              //     style={{
                              //       display: "flex",
                              //       justifyContent: "space-between",
                              //     }}
                              //   >
                              //     <span
                              //       style={{
                              //         maxWidth: "10ch",
                              //         overflow: "hidden",
                              //         textOverflow: "ellipsis",
                              //         whiteSpace: "nowrap",
                              //         display: "inline-block",
                              //         fontWeight: "bold",
                              //       }}
                              //     >
                              //       {" "}
                              //       {item.landDetails.title}
                              //     </span>

                              //     <Tag
                              //       style={{
                              //         color: "white",
                              //         border: "none",
                              //         marginLeft: "10px",
                              //         marginTop: "2px",
                              //         borderRadius: "12px",
                              //         padding: "0 8px",
                              //         backgroundColor: "rgb(33,101,155)",
                              //       }}
                              //     >
                              //       ₹{formatPrice(item.landDetails.totalPrice)}
                              //     </Tag>
                              //   </div>
                              // }
                              hoverable
                              className="card-items"
                              cover={
                                <img
                                  src={
                                    item.landDetails.images &&
                                      item.landDetails.images.length > 0
                                      ? item.landDetails.images[0] // If images exist, use the first one
                                      : item.propertyType.includes(
                                        "Agricultural"
                                      )
                                        ? "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png"
                                        : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                                  }
                                  style={{
                                    display: "block",
                                    width: "200px",
                                    borderRadius: "8px 8px 0 0",
                                    height: "12vh",
                                    objectFit: "cover",
                                  }}
                                />
                              }
                              style={{
                                width: "100%",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add box shadow
                                borderRadius: "8px", // Smooth border radius
                                transition: "transform 0.2s ease-in-out", // For hover effect
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}

                            >
                              <Meta
                                description={
                                  <div>
                                    <Row
                                      gutter={[16, 0]}
                                      style={{ color: "#1a1918" }}
                                    >
                                      <Col span={24}>
                                        <strong>{item.landDetails.title}</strong>
                                      </Col>
                                      <Col span={14}>
                                        <p>{item.address.district}</p>
                                      </Col>
                                      <Col span={24} style={{ color: "#0D416B" }}>
                                        {item.landDetails.size} <span> </span>
                                        {item.landDetails.sizeUnit}- ₹{formatPrice(item.landDetails.totalPrice)}
                                      </Col>
                                    </Row>
                                  </div>
                                }
                              />
                            </Card>
                          )}

                          {item.propertyType === "Commercial" && (
                            <Card
                              // title={
                              //   <div
                              //     style={{
                              //       display: "flex",
                              //       justifyContent: "space-between",
                              //     }}
                              //   >
                              //     <span
                              //       style={{
                              //         maxWidth: "10ch",
                              //         overflow: "hidden",
                              //         textOverflow: "ellipsis",
                              //         whiteSpace: "nowrap",
                              //         display: "inline-block",
                              //         fontWeight: "bold",
                              //       }}
                              //     >
                              //       {" "}
                              //       {item.propertyTitle}
                              //     </span>

                              //     <Tag
                              //       style={{
                              //         color: "white",
                              //         border: "none",
                              //         marginLeft: "20px",
                              //         backgroundColor: "rgb(33,101,155)",
                              //         marginTop: "2px",
                              //         borderRadius: "12px",
                              //         padding: "0 8px",
                              //       }}
                              //     >
                              //       {item.propertyDetails.landDetails.rent
                              //         .totalAmount ? (
                              //         <>
                              //           <span>Rent: ₹</span>
                              //           {formatPrice(
                              //             item.propertyDetails.landDetails.rent
                              //               .totalAmount
                              //           )}
                              //         </>
                              //       ) : item.propertyDetails.landDetails.lease
                              //           .totalAmount ? (
                              //         <>
                              //           <span>Lease: ₹</span>
                              //           {formatPrice(
                              //             item.propertyDetails.landDetails.lease
                              //               .totalAmount
                              //           )}
                              //         </>
                              //       ) : (
                              //         <>
                              //           <span>Sell: ₹</span>
                              //           {formatPrice(
                              //             item.propertyDetails.landDetails.sell
                              //               .totalAmount
                              //           )}
                              //         </>
                              //       )}
                              //     </Tag>
                              //   </div>
                              // }
                              hoverable
                              className="card-items"
                              cover={
                                <img
                                  alt={item.propertyTitle}
                                  src={item.propertyDetails.uploadPics[0] || "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"}
                                  style={{
                                    display: "block",
                                    width: "200px",
                                    borderRadius: "8px 8px 0 0",
                                    height: "12vh",
                                    objectFit: "cover",
                                  }}
                                />
                              }
                              style={{
                                width: "100%",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add box shadow
                                borderRadius: "8px", // Smooth border radius
                                transition: "transform 0.2s ease-in-out", // For hover effect
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            // style={{backgroundColor:"rgb(224, 236, 243)"}}
                            >
                              <Meta
                                description={
                                  <div>
                                    <Row
                                      gutter={[16, 0]}
                                      style={{
                                        marginBottom: "-5%",
                                        color: "#1a1918",
                                      }}
                                    >
                                      <Col span={24}>
                                        <p>
                                          <strong>
                                            {item.propertyTitle}
                                          </strong>{" "}
                                        </p>
                                      </Col>
                                      <Col span={15}>
                                        <p>
                                          <p>
                                            {
                                              item.propertyDetails.landDetails
                                                .address.district
                                            }
                                          </p>{" "}
                                        </p>
                                      </Col>
                                      <Col span={24} style={{ marginBottom: "2%", color: "#0D416B" }}>
                                        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                                          <span>
                                            {item.propertyDetails.landDetails.rent.plotSize
                                              ? item.propertyDetails.landDetails.rent.plotSize
                                              : item.propertyDetails.landDetails.lease.plotSize
                                                ? item.propertyDetails.landDetails.lease.plotSize
                                                : item.propertyDetails.landDetails.sell.plotSize}{" "}
                                            {item.propertyDetails.landDetails.sell.sizeUnit}
                                          </span>
                                          <span style={{ marginLeft: '10px' }}>
                                            {item.propertyDetails.landDetails.rent.totalAmount ? (
                                              <>
                                                <span>Rent: ₹</span>
                                                {formatPrice(item.propertyDetails.landDetails.rent.totalAmount)}
                                              </>
                                            ) : item.propertyDetails.landDetails.lease.totalAmount ? (
                                              <>
                                                <span>Lease: ₹</span>
                                                {formatPrice(item.propertyDetails.landDetails.lease.totalAmount)}
                                              </>
                                            ) : (
                                              <>
                                                <span>Sell: ₹</span>
                                                {formatPrice(item.propertyDetails.landDetails.sell.totalAmount)}
                                              </>
                                            )}
                                          </span>
                                        </Row>
                                      </Col>

                                    </Row>
                                  </div>
                                }
                              />
                            </Card>
                          )}

                          {item.propertyType === "Layout" && (
                            <Card
                              // title={
                              //   <div
                              //     style={{
                              //       display: "flex",
                              //       justifyContent: "space-between",
                              //     }}
                              //   >
                              //     <span
                              //       style={{
                              //         maxWidth: "10ch",
                              //         overflow: "hidden",
                              //         textOverflow: "ellipsis",
                              //         whiteSpace: "nowrap",
                              //         display: "inline-block",
                              //         fontWeight: "bold",
                              //       }}
                              //     >
                              //       {item.layoutDetails.layoutTitle}
                              //     </span>

                              //     <Tag
                              //       style={{
                              //         color: "white",
                              //         backgroundColor: "rgb(33,101,155)",
                              //         border: "none",
                              //         marginLeft: "52px",
                              //         marginTop: "2px",
                              //         borderRadius: "12px",
                              //         padding: "0 8px",
                              //       }}
                              //     >
                              //       ₹{formatPrice(item.layoutDetails.plotPrice)}
                              //     </Tag>
                              //   </div>
                              // }
                              hoverable
                              className="card-items"
                              cover={
                                <img
                                  alt={item.layoutDetails.layoutTitle || "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"}
                                  src={item.uploadPics[0] || "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"}
                                  style={{
                                    display: "block",
                                    width: "200px",
                                    borderRadius: "8px 8px 0 0",
                                    height: "12vh",
                                    objectFit: "cover",
                                  }}
                                />
                              }
                              style={{
                                width: "100%",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add box shadow
                                borderRadius: "8px", // Smooth border radius
                                transition: "transform 0.2s ease-in-out", // For hover effect
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                              <Meta
                                description={
                                  <div>
                                    <Row
                                      gutter={[16, 0]}
                                      style={{
                                        marginBottom: "-2%",
                                        marginRight: "-40px",
                                        color: "#1a1918",
                                      }}
                                    >
                                      <Col span={24}>
                                        <strong>

                                          {item.layoutDetails.layoutTitle}

                                        </strong>
                                      </Col>

                                      <Col span={14}>
                                        <p>
                                          <p>
                                            {
                                              item.layoutDetails.address
                                                .district
                                            }
                                          </p>{" "}
                                        </p>
                                      </Col>
                                      <Col span={24} style={{ color: "#0D416B" }}>
                                        <p>
                                          <p>
                                            {item.layoutDetails.plotSize}{item.layoutDetails.sizeUnit}-₹{formatPrice(item.layoutDetails.plotPrice)}
                                          </p>
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                }
                              />
                            </Card>
                          )}

                          {item.propertyType === "Residential" && (
                            <Card
                              title={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span
                                    style={{
                                      maxWidth: "10ch",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      display: "inline-block",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.propertyDetails.apartmentName}
                                  </span>

                                  <Tag
                                    style={{
                                      color: "black",
                                      border: "none",
                                      marginLeft: "22px",
                                      marginTop: "1px",
                                      borderRadius: "12px",
                                      padding: "0 8px",
                                    }}
                                  >
                                    {item.propertyDetails.type}: ₹
                                    {formatNumberWithCommas(
                                      item.propertyDetails.totalCost
                                    )}
                                  </Tag>
                                </div>
                              }
                              hoverable
                              className="card-items"
                              cover={
                                <img
                                  alt={
                                    item.propertyType === "agricultural"
                                      ? item.landDetails.title
                                      : item.propertyType === "commercial"
                                        ? item.propertyDetails.propertyTitle
                                        : item.propertyType === "layout"
                                          ? item.layoutDetails.layoutTitle
                                          : item.propertyDetails.apartmentName
                                  }
                                  src={
                                    item.propertyType === "agricultural"
                                      ? item.landDetails.images
                                      : item.propertyType === "commercial"
                                        ? item.propertyDetails.uploadPics
                                        : item.propertyType === "layout"
                                          ? item.uploadPics
                                          : item.propPhotos || "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                                  }
                                  style={{
                                    display: "block",
                                    width: "99%",
                                    borderRadius: "8px 8px 0 0",
                                    height: "12vh",
                                    objectFit: "cover",
                                  }}
                                />
                              }
                              style={{ backgroundColor: "rgb(224, 236, 243)" }}
                            >
                              <Meta
                                description={
                                  <div>
                                    <Row
                                      gutter={[16, 16]}
                                      style={{
                                        marginBottom: "-5%",
                                        color: "#1a1918",
                                      }}
                                    >
                                      <Col span={14}>
                                        <p>
                                          <strong>
                                            {item.address.district}
                                          </strong>{" "}
                                        </p>
                                      </Col>
                                      <Col span={10}>
                                        <p>
                                          <strong>
                                            {item.propertyDetails.flatSize}{item.propertyDetails.sizeUnit}
                                            
                                          </strong>
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                }
                              />
                            </Card>
                          )}
                        </div>
                      ))
                    ) : (
                      <Empty
                        imageStyle={{
                          height: 100,
                        }}
                        description={
                          <span
                            style={{ fontSize: "20px", fontWeight: "bold" }}
                          >
                            No Properties Found
                          </span>
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Option;
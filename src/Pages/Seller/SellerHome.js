import React, { useEffect, useRef, useState } from "react";
import { _get } from "../../Service/apiClient";
import { useTranslation } from "react-i18next";
import { Col, Pagination, Row, Spin, Tabs, Card } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import dummy from "../../images/dummyagri.png";
import {
  EnvironmentOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import ShowModal from "../Agent/ShowModal";
const SellerHome = () => {
  const [activeTab, setActiveTab] = useState("agriculture");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { t, i18n } = useTranslation();
  const targetCardRef = useRef(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData(activeTab);
    console.log(activeTab);
  }, [activeTab]);

  const fetchData = async (type) => {
    console.log("from fetchData", type);
    setData([]);
    setFilteredData([]);
    try {
      const response = await _get(`/seller/getAllSellerProperties/${type}`);
      console.log(response.data);
      if (type === "layout") {
        console.log(response.data[0].layoutDetails.layoutTitle);
      }
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProperty(null);
  };

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
  const paginatedData = (filteredData || []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setIsModalVisible(true);
  };
  return (
    <div ref={targetCardRef}>
      <Tabs
        defaultActiveKey="agriculture"
        centered
        onChange={(key) => {
          setActiveTab(key);
          fetchData(key);
        }}
      >
        <TabPane tab="Agriculture" key="agriculture">
          {data !== null && activeTab === "agriculture" ? (
            data.length != 0 ? (
              <>
                <Row gutter={16} style={{ padding: "20px", paddingTop: "0px" }}>
                  {paginatedData.map((item, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                      key={index}
                      style={{ marginBottom: "16px" }}
                    >
                      <Card
                        hoverable
                        className={item.status === 1 ? "card-overlay" : ""}
                        style={{
                          width: "97%",
                          margin: 0,
                          boxShadow: "#c3e3f7 0px 5px 10px",
                          border: item.status != 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={() => handleCardClick(item)}
                      >
                        <Row
                          gutter={[16, 16]}
                          style={{ margin: 0 }}
                          justify="center"
                          align="middle"
                        >
                          <Col span={24} style={{ padding: 0 }}>
                            <div
                              style={{
                                position: "absolute",
                                left: "0px",
                                background: "rgba(235, 245, 252, 0.9)",
                                color: "rgb(13,65,107)",
                                fontWeight: "bold",
                                padding: "5px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {item.landDetails.title}
                            </div>
                            {item.landDetails.images.length === 0 ? (
                              <img
                                alt="property"
                                src={dummy}
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
                                src={item.landDetails.images[0]}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <AppstoreOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.landDetails.size} <small>acres</small>
                            </span>
                          </Col>
                          <Col span={12}>
                            <span>
                              {" "}
                              ₹{" "}
                              {formatNumberWithCommas(
                                item.landDetails.totalPrice
                              )}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <UserOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.ownerDetails.ownerName}
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <EnvironmentOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.address.village}
                            </span>
                          </Col>
                        </Row>

                        <button
                          style={{
                            background:
                              "linear-gradient(135deg, #6253e1, #04befe)",
                            color: "white",
                            border: "none",
                            borderRadius: "7px",
                            marginTop: "4%",
                            float: "right",
                            marginRight: "9%",
                          }}
                          onClick={(e) => handleCardClick(item, e)}
                        >
                          View More
                        </button>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filteredData.length > 6 && (
                  <Row>
                    <Col>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <h2>{t("dashboard.e1")}</h2>
            )
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px" }}
              className="content-container"
            >
              <Spin size="large"                style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }}/>
              <p>{t("dashboard.l1")}</p>
            </div>
          )}
        </TabPane>
        <TabPane tab="Commercial" key="commercial">
          {data !== null && activeTab === "commercial" ? (
            data.length != 0 ? (
              <>
                <Row gutter={16} style={{ padding: "20px", paddingTop: "0px" }}>
                  {paginatedData.map((property, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                      key={property._id}
                      style={{ marginBottom: "16px" }}
                    >
                      <Card
                        hoverable
                        className={property.status === 1 ? "card-overlay" : ""}
                        style={{
                          width: "97%",
                          margin: 0,
                          boxShadow: "#c3e3f7 0px 5px 10px",
                          border: property.status != 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={() => handleCardClick(property)}
                      >
                        <Row gutter={[16, 16]} style={{ marginBottom: "2%" }}>
                          <Col span={24}>
                            <div
                              style={{
                                position: "absolute",
                                left: "7px",
                                background: "rgba(235, 245, 252, 0.9)",
                                color: "rgb(13,65,107)",
                                fontWeight: "bold",
                                padding: "5px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {property.propertyTitle}
                            </div>

                            {property.propertyDetails.uploadPics.length != 0 ? (
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
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Col
                            span={10}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <AppstoreOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.propertyDetails.landDetails.rent
                                .plotSize
                                ? property.propertyDetails.landDetails.rent
                                    .plotSize
                                : property.propertyDetails.landDetails.lease
                                    .plotSize
                                ? property.propertyDetails.landDetails.lease
                                    .plotSize
                                : property.propertyDetails.landDetails.sell
                                    .plotSize}{" "}
                              <small>sq. ft</small>
                            </span>
                          </Col>
                          <Col
                            span={14}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {" "}
                              {property.propertyDetails.landDetails.rent
                                .totalAmount ? (
                                <>
                                  <span>Rent: ₹</span>
                                  {formatNumberWithCommas(
                                    property.propertyDetails.landDetails.rent
                                      .totalAmount
                                  )}
                                  <small>
                                    (
                                    {
                                      property.propertyDetails.landDetails.rent
                                        .noOfMonths
                                    }
                                    months)
                                  </small>
                                </>
                              ) : property.propertyDetails.landDetails.lease
                                  .totalAmount ? (
                                <>
                                  <span>Lease: ₹</span>
                                  {formatNumberWithCommas(
                                    property.propertyDetails.landDetails.lease
                                      .totalAmount
                                  )}
                                  <small>
                                    (
                                    {
                                      property.propertyDetails.landDetails.lease
                                        .duration
                                    }
                                    years)
                                  </small>
                                </>
                              ) : (
                                <>
                                  <span>Sell: ₹</span>
                                  {formatNumberWithCommas(
                                    property.propertyDetails.landDetails.sell
                                      .totalAmount
                                  )}
                                </>
                              )}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            span={10}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <UserOutlined className="GlobalOutlined" />{" "}
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.propertyDetails.owner?.ownerName}
                            </span>
                          </Col>
                          <Col
                            span={14}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <EnvironmentOutlined className="GlobalOutlined" />{" "}
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {
                                property.propertyDetails.landDetails.address
                                  ?.village
                              }
                            </span>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "5px" }}>
                          {/* <Col
                            xs={12}
                            sm={12}
                            md={24}
                            lg={24}
                            xl={12}
                            xxl={12}
                            style={{ textAlign: "center" }}
                          >
                            {property.status === 0 &&
                            path === "getallcommercials" ? (
                              <Rate
                                allowHalf
                                defaultValue={property.rating}
                                style={{
                                  border: "black",
                                  marginTop: "5%",
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(value) => {
                                  handleRatingChange(
                                    value,
                                    property._id,
                                    property.propertyType
                                  );
                                }}
                              />
                            ) : (
                              <Rate
                                allowHalf
                                defaultValue={property.rating}
                                disabled={true}
                                style={{
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  opacity: 0.9,
                                  transition: "opacity 0.3s",
                                  cursor: "not-allowed",
                                }}
                              />
                            )}
                          </Col> */}

                          <Col
                            xs={12}
                            sm={12}
                            md={24}
                            lg={24}
                            xl={12}
                            xxl={12}
                            style={{ alignItems: "right" }}
                          >
                            <button
                              className="buttonTag"
                              onClick={() => handleCardClick(property)}
                            >
                              More...
                            </button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filteredData.length > 6 && (
                  <Row>
                    <Col>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <h2>{t("dashboard.e1")}</h2>
            )
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px" }}
              className="content-container"
            >
              <Spin size="large"                style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }}/>
              <p>{t("dashboard.l1")}</p>
            </div>
          )}
        </TabPane>
        <TabPane tab="Layout" key="layout">
          {data !== null && activeTab === "layout" ? (
            data.length != 0 ? (
              <>
                <Row gutter={16} style={{ padding: "20px", paddingTop: "0px" }}>
                  {paginatedData.map((property) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                      key={property._id}
                      style={{ marginBottom: "16px" }}
                    >
                      <Card
                        hoverable
                        className={property.status === 1 ? "card-overlay" : ""}
                        style={{
                          width: "97%",
                          margin: 0,
                          boxShadow: "#c3e3f7 0px 5px 10px",
                          border: property.status != 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={() => handleCardClick(property)}
                      >
                        <Row gutter={[16, 16]} style={{ marginBottom: "2%" }}>
                          <Col span={24}>
                            <div
                              style={{
                                position: "absolute",

                                left: "7px",
                                background: "rgba(235, 245, 252, 0.9)",
                                color: "rgb(13,65,107)",
                                fontWeight: "bold",
                                padding: "5px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {property.layoutDetails.layoutTitle}
                            </div>

                            {property.uploadPics.length != 0 ? (
                              <img
                                alt="property"
                                src={property.uploadPics[0]}
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
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <AppstoreOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.layoutDetails.plotSize}{" "}
                              <small>sq. ft</small>
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {" "}
                              ₹{" "}
                              {formatNumberWithCommas(
                                property.layoutDetails.totalAmount
                              )}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <UserOutlined className="GlobalOutlined" />{" "}
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.ownerDetails?.ownerName}
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <EnvironmentOutlined className="GlobalOutlined" />{" "}
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.layoutDetails.address?.village}
                            </span>
                          </Col>
                        </Row>

                        <Row style={{ marginTop: "3%" }}>
                          <Col lg={24} md={24} xs={24}>
                            <button
                              style={{
                                background:
                                  "linear-gradient(135deg, #6253e1, #04befe)",
                                color: "white",
                                border: "none",
                                borderRadius: "7px",
                                marginTop: "4%",
                                float: "right",
                              }}
                              className="buttonTag"
                              onClick={() => handleCardClick(property)}
                            >
                              View More
                            </button>
                          </Col>
                        </Row>
                        {/* )} */}
                        <Row></Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filteredData.length > 6 && (
                  <Row>
                    <Col>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <h2>{t("dashboard.e1")}</h2>
            )
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px" }}
              className="content-container"
            >
              <Spin size="large"                style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }}/>
              <p>{t("dashboard.l1")}</p>
            </div>
          )}
        </TabPane>
        <TabPane tab="Residential" key="residential">
          {data !== null && activeTab === "residential" ? (
            data.length != 0 ? (
              <>
                <Row gutter={16} style={{ padding: "20px", paddingTop: "0px" }}>
                  {paginatedData.map((product, index) => (
                    <Col
                      key={product._id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                      style={{ marginBottom: "16px" }}
                    >
                      <Card
                        hoverable
                        className={product.status === 1 ? "card-overlay" : ""}
                        style={{
                          width: "97%",
                          margin: 0,
                          boxShadow: "#c3e3f7 0px 5px 10px",
                          border: product.status != 0 && "1px solid #979ba1",
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={() => handleCardClick(product)}
                      >
                        <Row
                          gutter={[16, 16]}
                          style={{ margin: 0 }}
                          justify="center"
                          align="middle"
                        >
                          <Col span={24} style={{ padding: 0 }}>
                            <div
                              style={{
                                position: "absolute",
                                left: "0px",
                                background: "rgba(235, 245, 252, 0.9)",
                                color: "rgb(13,65,107)",
                                fontWeight: "bold",
                                padding: "5px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {product.propertyDetails.apartmentName}
                            </div>

                            {product.propPhotos.length != 0 ? (
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
                          </Col>
                        </Row>
                        <Row style={{ marginTop: "10px" }}>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <AppstoreOutlined className="GlobalOutlined" />
                              {product.propertyDetails.flatSize}{" "}
                              <small>sq. ft</small>
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              ₹{" "}
                              {formatNumberWithCommas(
                                product.propertyDetails.totalCost
                              )}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <UserOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {product.owner.ownerName}
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <EnvironmentOutlined className="GlobalOutlined" />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {product.address?.district &&
                                product.address?.village}
                            </span>
                          </Col>
                        </Row>

                        <Row>
                          <Col span={24} style={{ alignItems: "right" }}>
                            <button
                              className="buttonStyle"
                              onClick={() => handleCardClick(product)}
                            >
                              View More
                            </button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filteredData.length > 6 && (
                  <Row>
                    <Col>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <h2>{t("dashboard.e1")}</h2>
            )
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px" }}
              className="content-container"
            >
              <Spin size="large"                style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }}/>
              <p>{t("dashboard.l1")}</p>
            </div>
          )}
        </TabPane>
      </Tabs>
      {selectedProperty && (
        <ShowModal
          selectedProperty={selectedProperty}
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default SellerHome;

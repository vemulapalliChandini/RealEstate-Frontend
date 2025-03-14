
    /* eslint-disable */

import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
      Spin,
 
    Empty,
    Tag,
    Badge,
    List,
    Pagination
} from "antd";
import { _get } from "../../Service/apiClient";

import {
 
    ArrowDownOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";

const { Meta } = Card;
 
const Promotions = () => {
    const [landDetails, setLandDetails] = useState([]);
    // Top Proprty 

    const [topProperties, setTopProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
     // const [stateData, setStateData] = useState([]);
 
    const pageSize = 5;

    useEffect(() => {
        getData();
        fetchTopProperties();
    }, []);

    const getData = async () => {
        await _get(`/latestprops`)
            .then((response) => {
                setLandDetails(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    // To Display the most viewed 

    const top3Properties = topProperties.slice(0, 5);





    const fetchTopProperties = async () => {
        try {
            const response = await _get("/views/getTopProperties");
            setTopProperties(response.data);
        } catch {
            setTopProperties("Error");
        }
    };


    // pagination

     // const paginatedData = stateData.slice(
    //     (currentPage - 1) * pageSize,
    //     currentPage * pageSize
    // );
 

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const badgeStyle = {
        backgroundColor: "#ff4d4f",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        position: "relative",
        marginTop: "-10px",
        animation: "slideBackForth 2s ease-in-out infinite",
        padding: "7px",
        marginLeft: "-10px",
    };

    // const keyframes = `
    // @keyframes slideBackForth {
    // 0% {
    // transform: translateX(0);
    // }
    // 50% {
    // transform: translateX(10px);
    // }
    // 100% {
    // transform: translateX(0);
    // }
    // }
    // `;

    const formatNumberWithCommas = (num) => {
        return new Intl.NumberFormat("en-IN").format(num);
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ display: "flex" }}>
                {/* <style>{keyframes}</style> */}

                <Badge count={<span style={badgeStyle}>New Launch</span>} />
            </div>

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
                        <Spin size="large" style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)", // This centers the loader
                        }} />
                        <p>Loading latest properties...</p>
                    </div>
                ) : (
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "100%", margin: "0% 0% 0% 3%" }}>
                            <div className="horizontal-banner-container">
                                <div className="scrolling-cards1">
                                    {landDetails.length > 0 ? (
                                        landDetails.map((item) => (
                                            <div
                                                key={item._id}
                                                className="vertical-banner-item"
                                                style={{
                                                    marginBottom: "-60px",
                                                    marginRight: "50px",
                                                    width: "300%",
                                                }}
                                            >
                                                {/* Render property type cards */}
                                                {item.propertyType === "Agricultural land" && (
                                                    <Card
                                                        title={
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                {item.landDetails.title}
                                                                <Tag
                                                                    style={{
                                                                        color: "black",
                                                                        border: "none",
                                                                        marginLeft: "10px",
                                                                        marginTop: "2px",
                                                                        borderRadius: "12px",
                                                                        padding: "0 8px",
                                                                    }}
                                                                >
                                                                    ₹
                                                                    {formatNumberWithCommas(
                                                                        item.landDetails.totalPrice
                                                                    )}
                                                                </Tag>
                                                            </div>
                                                        }
                                                        hoverable
                                                        className="card-items"
                                                        cover={
                                                            <img
                                                                alt={item.landDetails.title}
                                                                src={item.landDetails.images[0]}
                                                                style={{
                                                                    display: "block",
                                                                    width: "100%",
                                                                    borderRadius: "8px 8px 0 0",
                                                                    height: "12vh",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        <Meta
                                                            description={
                                                                <div>
                                                                    <Row gutter={[16, 16]}>
                                                                        <Col span={14}>
                                                                            <strong>{item.address.district}</strong>
                                                                        </Col>
                                                                        <Col span={10}>
                                                                            {item.landDetails.size} <span> </span>
                                                                            {item.landDetails.size === 1
                                                                                ? "acre"
                                                                                : "acres"}
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            }
                                                        />
                                                    </Card>
                                                )}

                                                {item.propertyType === "Commercial" && (
                                                    <Card
                                                        title={
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                {item.propertyTitle}

                                                                <Tag
                                                                    style={{
                                                                        color: "black",
                                                                        border: "none",
                                                                        marginLeft: "20px",
                                                                        marginTop: "2px",
                                                                        borderRadius: "12px",
                                                                        padding: "0 8px",
                                                                    }}
                                                                >
                                                                    {item.propertyDetails.landDetails.rent
                                                                        .totalAmount ? (
                                                                        <>
                                                                            <span>Rent: ₹</span>
                                                                            {formatNumberWithCommas(
                                                                                item.propertyDetails.landDetails.rent
                                                                                    .totalAmount
                                                                            )}
                                                                        </>
                                                                    ) : item.propertyDetails.landDetails.lease
                                                                        .totalAmount ? (
                                                                        <>
                                                                            <span>Lease: ₹</span>
                                                                            {formatNumberWithCommas(
                                                                                item.propertyDetails.landDetails.lease
                                                                                    .totalAmount
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span>Sell: ₹</span>
                                                                            {formatNumberWithCommas(
                                                                                item.propertyDetails.landDetails.sell
                                                                                    .totalAmount
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </Tag>
                                                            </div>
                                                        }
                                                        hoverable
                                                        className="card-items"
                                                        cover={
                                                            <img
                                                                alt={item.propertyTitle}
                                                                src={item.propertyDetails.uploadPics[0]}
                                                                style={{
                                                                    display: "block",
                                                                    width: "99%",
                                                                    borderRadius: "8px 8px 0 0",
                                                                    height: "12vh",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        <Meta
                                                            description={
                                                                <div>
                                                                    <Row
                                                                        gutter={[16, 16]}
                                                                        style={{ marginBottom: "-5%" }}
                                                                    >
                                                                        <Col span={12}>
                                                                            <p>
                                                                                <strong>
                                                                                    {
                                                                                        item.propertyDetails.landDetails
                                                                                            .address.district
                                                                                    }
                                                                                </strong>{" "}
                                                                            </p>
                                                                        </Col>
                                                                        <Col span={12}>
                                                                            <p>
                                                                                <span>
                                                                                    {item.propertyDetails.landDetails.rent
                                                                                        .plotSize
                                                                                        ? item.propertyDetails.landDetails
                                                                                            .rent.plotSize
                                                                                        : item.propertyDetails.landDetails
                                                                                            .lease.plotSize
                                                                                            ? item.propertyDetails.landDetails
                                                                                                .lease.plotSize
                                                                                            : item.propertyDetails.landDetails
                                                                                                .sell.plotSize}{" "}
                                                                                    sq. ft
                                                                                </span>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            }
                                                        />
                                                    </Card>
                                                )}

                                                {item.propertyType === "Layout" && (
                                                    <Card
                                                        title={
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                {item.layoutDetails.layoutTitle}

                                                                <Tag
                                                                    style={{
                                                                        color: "black",
                                                                        border: "none",
                                                                        marginLeft: "52px",
                                                                        marginTop: "2px",
                                                                        borderRadius: "12px",
                                                                        padding: "0 8px",
                                                                    }}
                                                                >
                                                                    ₹
                                                                    {formatNumberWithCommas(
                                                                        item.layoutDetails.plotPrice
                                                                    )}
                                                                </Tag>
                                                            </div>
                                                        }
                                                        hoverable
                                                        className="card-items"
                                                        cover={
                                                            <img
                                                                alt={item.layoutDetails.layoutTitle}
                                                                src={item.uploadPics[0]}
                                                                style={{
                                                                    display: "block",
                                                                    width: "99%",
                                                                    borderRadius: "8px 8px 0 0",
                                                                    height: "12vh",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        <Meta
                                                            description={
                                                                <div>
                                                                    <Row
                                                                        gutter={[16, 16]}
                                                                        style={{
                                                                            marginBottom: "-2%",
                                                                            marginRight: "-40px",
                                                                        }}
                                                                    >
                                                                        <Col span={14}>
                                                                            <p>
                                                                                <strong>
                                                                                    {item.layoutDetails.address.district}
                                                                                </strong>{" "}
                                                                            </p>
                                                                        </Col>
                                                                        <Col span={10}>
                                                                            <p>
                                                                                <strong>
                                                                                    {item.layoutDetails.plotSize}sq. ft
                                                                                </strong>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            }
                                                        />
                                                    </Card>
                                                )}

                                                {/* Residential code from */}

                                                {item.propertyType === "Residential" && (
                                                    <Card
                                                        title={
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                {item.propertyDetails.apartmentName}

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
                                                                alt={item.propertyDetails.apartmentName}
                                                                src={item.propPhotos[0]}
                                                                style={{
                                                                    display: "block",
                                                                    width: "99%",
                                                                    borderRadius: "8px 8px 0 0",
                                                                    height: "12vh",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        }
                                                    >
                                                        <Meta
                                                            description={
                                                                <div>
                                                                    <Row
                                                                        gutter={[16, 16]}
                                                                        style={{ marginBottom: "-5%" }}
                                                                    >
                                                                        <Col span={14}>
                                                                            <p>
                                                                                <strong>{item.address.district}</strong>{" "}
                                                                            </p>
                                                                        </Col>
                                                                        <Col span={10}>
                                                                            <p>
                                                                                <strong>
                                                                                    {item.propertyDetails.flatSize}sq. ft
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
                                                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                                                    No Properties Found
                                                </span>
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* new component code from here.... */}

            <Col xs={24} sm={12} md={12}>
                <Card
                    hoverable
                    style={{
                        textAlign: "center",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        color: "black",
                        borderRadius: "12px",
                        padding: "10px",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        // marginTop: "-75%",
                        height: "60%",
                        width: "65%",
                        // marginRight:"20%",
                        marginLeft: "-35%",
                        marginTop: "40%",
                    }}
                >
                    <h2>Top Trending Properties</h2>

                    <List
                        dataSource={top3Properties} // Using top 3 properties
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px 20px",
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                                }}
                            >
                                {/* Property image */}


                                <img
                                    src={item.propertyImage}
                                    alt={item.propertyName}
                                    // onClick={() => showModal(item)}

                                    // for more indepth details

                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "8px",
                                        marginRight: "10px",
                                    }}
                                />

                                {/* Property name */}

                                <span style={{ color: "black" }}>{item.propertyName}</span>

                                {/* Views count and arrow */}
                                <span
                                    style={{
                                        color: "black",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}
                                >
                                    {/* Conditional arrow */}
                                    {item.viewsCount > 0 ? (
                                        <ArrowUpOutlined style={{ color: "green" }} />
                                    ) : (
                                        <ArrowDownOutlined style={{ color: "red" }} />
                                    )}
                                    {item.viewsCount} Views
                                </span>
                            </List.Item>
                        )}
                    />
                    <Row >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                position: "fixed",
                                bottom: "90px",
                                right: "20px",
                                width: "100%",
                                zIndex: 1000,
                            }}
                        >
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                // total={stateData.length}
                                onChange={handlePageChange}
                                style={{ marginTop: "-6%", textAlign: "center", marginLeft: "30%" }}
                            />
                        </div>

                    </Row>
                    {/* Pagination */}

                </Card>
            </Col>
        </div>
    );
};

export default Promotions;

import React, { useEffect, useRef, useState,useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,

  Empty,
  Select,
  Modal,
  Form,
  Input,
  TimePicker,
  Skeleton,
  DatePicker,
  Table,
  Menu,
  Button,
  Dropdown,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  AppstoreOutlined,
  MoreOutlined,
} from "@ant-design/icons";

import { useTranslation } from "react-i18next";
import { _get, _post, _put } from "../../../Service/apiClient.js";
import "./AgriculturalStyles/Agriculture.css";
import ShowModal from "../ShowModal";
import moment from "moment";

const { Option } = Select;

const Agriculture = ({ path, filters, filters1 }) => {

  const { t } = useTranslation();
  const targetCardRef = useRef(null);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProperty1, setSelectedProperty1] = useState(null);
  const [sold, setSold] = useState(false);
  const [searchText] = useState(["", "", ""]);
  const [propertyName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [checkedValues] = useState(["sold", "unSold"]);


  const [priceRange] = useState([0, Infinity]);


  const [auctionData, setAuctionData] = useState(null);
  const [isAuctionModalVisible, setIsAuctionModalVisible] = useState(false);
  const [isAuctionViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [hoursDifference, setHoursDifference] = useState(0);
  const [form] = Form.useForm();
  const [propertyId, setPropertyId] = useState(null);
 

 
  const handleViewAuction = (property) => {
    // console.log("proep", property);
    setAuctionData(property.auctionData);
    setIsAuctionViewModalVisible(true);
  };
  const handleCancelAuction = async(auctionId) => {
    try {
      // Validate form fields before proceeding
      const payload = {
        auctionId:auctionId,
      };

      console.log("Payload:", payload);

      const res = await _put(
        "/auction/closeAuction",
        payload,
        "Auction Started Successfully!",
        "Failed to Start Auction."
      );

      if (res?.status === 200 || res?.status === 201) {
        // Reset form fields after successful submission
        form.resetFields();
        fetchData();
        setIsAuctionModalVisible(false);
      } else {
        console.log("Error submitting form");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };
  const columns = [
    {
      title: 'Buyer Name',
      dataIndex: 'buyerName',
      key: 'buyerName',
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      render: (text) => `₹${text}`,
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
  ];

  const dataSource = auctionData?.buyers.map((buyer, index) => ({
    key: index,
    buyerName: buyer.buyerName,
    bidAmount: buyer.bidAmount,
  }));
  // this is for the fetchvillages

  // const fetchVillages = async () => {
  //   try {
  //     const response = await _get("/location/getallvillages");
  //     const data = await response.data;

  //     const uniqueVillages = [...new Set(data)];
  //     setVillageList(uniqueVillages);
  //     setFilteredVillages(uniqueVillages);
  //   } catch (error) {
  //     console.error("Error fetching village data:", error);
  //   }
  // };

  // get all fields..
  const handleOk = async () => {
    try {
      // Validate form fields before proceeding
      const values = await form.validateFields();
      const startDate = new Date(
        `${values.startDate.format("YYYY-MM-DD")}T${values.startTime.format("HH:mm:ss")}`
      ).toISOString();
      
      const endDate = new Date(
        `${values.endDate.format("YYYY-MM-DD")}T${values.endTime.format("HH:mm:ss")}`
      ).toISOString();

      const payload = {
        auctionType: values.auctionType,
        startDate,
        endDate,
        amount: values.amount,
        propertyId: selectedProperty1._id,
        agentId: selectedProperty1.agentId,
        auctionStatus: "active",
      };

      console.log("Payload:", payload);

      const res = await _post(
        "/auction/postAuction",
        payload,
        "Auction Started Successfully!",
        "Failed to Start Auction."
      );

      if (res?.status === 200 || res?.status === 201) {
        // Reset form fields after successful submission
        form.resetFields();
        fetchData();
        setIsAuctionModalVisible(false);
      } else {
        console.log("Error submitting form");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };


 
  

  const handlePaymentSuccess = async () => {
    await fetchData(); // Fetch data first
  };

  useEffect(() => {
    if (propertyId && data.length > 0) {
      const updatedProperty = data.find((prop) => prop._id === propertyId);
      // console.log("updatedProperty", updatedProperty);
      if (updatedProperty) {
        setSelectedProperty(updatedProperty);
      }
    }
  }, [data, propertyId]);
  useEffect(() => {
    // console.log("selectedProperty changed:", selectedProperty);
    if (selectedProperty) {
      setIsModalVisible(true);
    }
  }, [selectedProperty]);

  const handleCancel = () => {
    setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
    setSelectedProperty1(null);
  };
  const handleFine = () => {
    // setIsAuctionModalVisible(false);
    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
    setSelectedProperty1(null);
  };
  const handleSellingStatus = async (id, type, status) => {
    let finalObject = {
      propertyId: id,
      propertyType: type,
      status: status === 0 ? 1 : 0,
    };
    try {
       await _put(
        "/property/markassold",
        finalObject,
        status === 0 ? "Marked as Sold" : "Marked as UnSold",
        "Action Failed"
      );
      fetchData();
      setSold(!sold);
    } catch (error) { }
  };
  const handleCardClick = (property) => {
    fetchData();
    setPropertyId(property._id);
    setSelectedProperty(property);
    setIsModalVisible(true);
  };
  const calculateInitialBid1 = (totalPrice) => {
    const baseBid = 5000; // Initial bid is ₹5,000
    const increment = 5000; // Increment by ₹5,000
    const bidLevel = Math.floor(totalPrice / 2500000); // Calculate how many times ₹25,00,000 fits into totalPrice
    return baseBid + (bidLevel * increment);
  };

  const handleStartAuction = (property) => {
    // fetchData();
    setIsModalVisible(false);
    setSelectedProperty1(property);
    setIsAuctionModalVisible(true);
    // const maxBidAmount = property.landDetails.totalPrice * 0.1;
    const maxBidAmount = calculateInitialBid1(property.landDetails.totalPrice);
    form.setFieldsValue({
      amount: maxBidAmount, // Set the initial bid amount
    });
  };




  const [sizeRange, setSizeRange] = useState([0, Infinity]);

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
//  const [data2,setData2]=useState();
 const dataRef = useRef(null);

 const fetchLocation = useCallback(async () => {
   try {
     let type = "";
     let searchText = "";
 
     if (filters !== undefined) {
       searchText = filters.searchText;
     } else {
       searchText = filters1.searchText;
     }
 
     if (!searchText) {
       searchText = "all";
     }
 
     if (path === "getlayouts") {
       type = localStorage.getItem("mtype");
       const response = await _get(`/property/mypropslocation/${type}/${searchText}`);
       dataRef.current = response.data;
     } else {
       type = localStorage.getItem("type");
       const response = await _get(`/property/location/${type}/${searchText}`);
       dataRef.current = response.data; 
     }
   } catch (error) {
     setFilteredData([]);
   }
 }, [filters, filters1, path]); 
 
   

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const applyFilters = useCallback(
    async (
      checkedValues,
      searchText,
      priceRange,
      sizeRange,
      propertyName,
      data
    ) => {
      
  
      if (filters != null || filters !== undefined) {
        checkedValues = filters.checkedValues;
        searchText = filters.searchText;
        priceRange = filters.priceRange;
        sizeRange = filters.sizeRange;
        propertyName = filters.propertyName;
      }
      if (filters1 != null || filters1 !== undefined) {
        checkedValues = filters1.checkedValues;
        searchText = filters1.searchText;
        priceRange = filters1.priceRange;
        sizeRange = filters1.sizeRange;
        propertyName = filters1.propertyName;
      }
      console.log("data", data);
  
      let nameSearch2 = propertyName ? propertyName.toLowerCase() : "";
      const isPropertyIdSearch = /\d/.test(nameSearch2);
  
     
    if (searchText !== "" && searchText !== "all") {
      if (!dataRef.current) { // ✅ Prevents unnecessary API calls
        await fetchLocation();
      }
      data = dataRef.current;
    }
      console.log("data12", data);
  
      let filtered = data;
  
      if (checkedValues === "All") {
        filtered = data;
      } else if (checkedValues === "Sold") {
        filtered = data.filter((property) => property.status === 1);
      } else if (checkedValues === "Unsold") {
        filtered = data.filter((property) => property.status === 0);
      }
  
      // Filter based on price range
      if (priceRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.landDetails.totalPrice) >= priceRange[0] &&
            Number(property.landDetails.totalPrice) <= priceRange[1]
        );
      }
  
      // Filter based on size range
      if (sizeRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.landDetails.size) >= sizeRange[0] &&
            Number(property.landDetails.size) <= sizeRange[1]
        );
      }
  
      // Filter based on property name or ID
      if (nameSearch2 !== "") {
        filtered = filtered.filter((property) => {
          const nameMatch2 = isPropertyIdSearch
            ? property.propertyId &&
              property.propertyId.toString().toLowerCase().includes(nameSearch2)
            : property.landDetails.title &&
              property.landDetails.title.toLowerCase().includes(nameSearch2);
  
          return nameMatch2;
        });
      }
      console.log("data1", data);
      setFilteredData(filtered);
      localStorage.setItem("isLoading", false);
    },
    [filters, filters1, fetchLocation, setFilteredData]
  );
  
 
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
 const filterValuesRef = useRef({
  checkedValues: [],
  searchText: "",
  priceRange: [],
  sizeRange: [],
  propertyName: "",
});

useEffect(() => {
  filterValuesRef.current = {
    checkedValues,
    searchText,
    priceRange,
    sizeRange,
    propertyName,
  };
}, [checkedValues, searchText, priceRange, sizeRange, propertyName]);

const fetchData = useCallback(async () => {
  try {
    const response = await _get(`/fields/${path}`);
    console.log("Fetched data:", response.data);
    if (!response.data || !response.data.data) return;

    setData(response.data.data);
    setFilteredData(response.data.data);
    applyFilters(
      filterValuesRef.current.checkedValues,
      filterValuesRef.current.searchText,
      filterValuesRef.current.priceRange,
      filterValuesRef.current.sizeRange,
      filterValuesRef.current.propertyName,
      response.data.data
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}, [path,applyFilters]);
  const maxsizefromAPI = useCallback(async () => {
    try {
      const first = checkedValues.includes("sold") ? "sold" : "@";
      const second = checkedValues.includes("unSold") ? "unsold" : "@";
      const response = await _get(
        `property/maxSize/agricultural/@/@/@/@/@/${first}/${second}`
      );
      const data = await response.data.maxSize;
  
      setSizeRange([0, data]);
    } catch (error) {
      console.error("Error fetching village data:", error);
    }
  }, [checkedValues, setSizeRange]);
  
  useEffect(() => {
    console.log ("sdjhijshjidhs");
    maxsizefromAPI();
    fetchData();

  }, [fetchData,maxsizefromAPI,filters,filters1]);

  return (
    <div ref={targetCardRef}>
      {data != null ? (
        data.length !== 0 ? (
          <>
            {checkedValues.length === 0 ? (
              <h2>Please select atleast one option</h2>
            ) : filteredData.length === 0 ? (
              <Col
                span={24}
                style={{ textAlign: "centre" }}
                className="content-container"
              >
                <Empty description="No Properties found, Please select other filters" />
              </Col>
            ) : (
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
                        className={item.status === 1 ? "card-overlay" : "card-item"}
                        title={path === "getfields" && `${item.propertyId} (${item.landDetails.title})`}
                        style={{
                          width: "97%",
                          padding: path === "getfields" && "5px",
                          margin: 0,
                          boxShadow:
                            path !== "getfields" && "#c3e3f7 0px 5px 10px",
                          border: item.status !== 0 && "1px solid #979ba1",
                          backgroundColor: "rgba(159, 159, 167, 0.23)"
                        }}

                        bodyStyle={{ padding: 0 }}

                        extra={
                          path === "getfields" && item.status === 0 ? (
                            <button
                              style={{
                                color: item.status === 0 ? "green" : "red",
                                flexWrap: "wrap",
                                float: "right",
                                width: "100%",
                                fontSize: "10px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSellingStatus(
                                  item._id,
                                  item.propertyType,
                                  item.status
                                );
                              }}
                            >
                              Mark as Sold
                            </button>
                          ) : (
                            item.status === 1 &&
                            path === "getfields" && (
                              <span>
                                <button
                                  style={{
                                    color: item.status === 0 ? "green" : "red",
                                    flexWrap: "wrap",
                                    float: "right",
                                    width: "100%",
                                    fontSize: "10px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSellingStatus(
                                      item._id,
                                      item.propertyType,
                                      item.status
                                    );
                                  }}
                                >
                                  Mark as unsold
                                </button>
                              </span>
                            )
                          )
                        }
                      >

                        <Row
                          gutter={[16, 16]}
                          style={{ margin: 0 }}
                          justify="center"
                          align="middle"
                        >
                          <Col span={24} style={{ padding: 0 }}>
                            {path !== "getfields" && (
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
                                {item.landDetails?.title} ({item.propertyId})
                              </div>
                            )}
                            {item.landDetails.images.length === 0 ? (
                              <img
                                alt="property"
                                src={
                                  "data:image/png;base64,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"
                                }
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
                        <div style={{ padding: "24px" }}>
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
                                {item.landDetails.size} <small>{item.landDetails.sizeUnit}</small>
                              </span>
                            </Col>
                            <Col span={12}>
                              <span>
                                {" "}
                                ₹{" "}
                                {formatPrice(item.landDetails.totalPrice)}

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

                          {console.log("paginatedData",item.address)}
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            {path === "getfields" && (
                              <>
                                <button
                                  style={{
                                    background: item.auctionStatus === "active" ? "#A9A9A9" : "#0D416B",
                                    color: item.auctionStatus === "active" ? "black" : "white",
                                    width: "120px",
                                    border: "none",
                                    borderRadius: "7px",
                                    margin: "4% 0",
                                    padding: "4px",
                                    cursor: item.auctionStatus === "active" ? "not-allowed" : "pointer",
                                    opacity: item.auctionStatus === "active" ? 0.6 : 1,
                                  }}
                                  onClick={(e) => {
                                    if (item.auctionStatus !== "active") {
                                      handleStartAuction(item, e);
                                    }
                                  }}
                                  disabled={item.auctionStatus === "active"}
                                >
                                  {item.auctionStatus === "active" ? "Auction Active" : "Start Auction"}
                                </button>


                                {/* {item.auctionData && (
                                  <button
                                    style={{
                                      background: "#0D416B",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "7px",
                                      marginTop: "4%",
                                      marginBottom: "4%",
                                      width: "270px",
                                      // padding: "10px 20px",
                                    }}
                                    onClick={(e) => handleViewAuction(item, e)}
                                  >
                                    View Auction Details
                                  </button>)} */}
                              </>
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
                                marginLeft: path !== "getfields" ? "10%" : "0",  // Conditionally add marginLeft
                              }}
                              onClick={(e) => handleCardClick(item, e)}
                            >
                              View More
                            </button>

                            {path === "getfields" && (
                              <Dropdown
                                overlay={

                                  <Menu>
                                    <Menu.Item key="view" onClick={() => handleViewAuction(item)} style={{ backgroundColor: "#0D416B", color: "white" }}>
                                      View Auction Details
                                    </Menu.Item>
                                    {hoursDifference > 18 && item.auctionStatus === "active" && (
                                      <Menu.Item key="cancel" style={{ backgroundColor: "lightgray", color: "black" }}  onClick={() => handleCancelAuction(item.auctionData[0]._id)}>
                                        Cancel Auction
                                      </Menu.Item>
                                    )}
                                  </Menu>

                                }
                                trigger={["click"]}
                                onOpenChange={async (open) => {
                                  if (open) {
                                    const startTime = new Date(item.auctionData[0].startDate);  // Already in a standard format
                                    const currentTime = new Date();  // Also in standard Date format
                                    console.log("startTime:", startTime);
                                    console.log("currentTime:", currentTime);
                                    // Convert both dates to the same format (if necessary)
                                    const formattedStartTime = new Date(
                                      startTime.getFullYear(),
                                      startTime.getMonth(),
                                      startTime.getDate(),
                                      startTime.getHours(),
                                      startTime.getMinutes(),
                                      startTime.getSeconds()
                                    );
                                  
                                    const formattedCurrentTime = new Date(
                                      currentTime.getFullYear(),
                                      currentTime.getMonth(),
                                      currentTime.getDate(),
                                      currentTime.getHours(),
                                      currentTime.getMinutes(),
                                      currentTime.getSeconds()
                                    );
                                  
                                    // Calculate the difference in hours
                                    const hoursDiff = (formattedStartTime - formattedCurrentTime) / (1000 * 60 * 60);
                                    setHoursDifference(hoursDiff);
                                  
                                    console.log("startTime:", formattedStartTime);
                                    console.log("currentTime:", formattedCurrentTime);
                                    console.log("Difference in hours:", hoursDiff);
                                  }
                                  
                                }}
                              >
                                <Button
                                  shape="circle"
                                  icon={<MoreOutlined />}
                                  style={{
                                    border: "none",
                                    background: "#0D416B",
                                    color: "white",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                    marginTop: "3%"
                                  }}
                                />
                              </Dropdown>)}
                          </div>



                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filteredData.length > 6 && (
                  <Row style={{ float: "right" }}>
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
                      backgroundColor: "#f0f0f0", // Optional: for a background color
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          {path === "getfields" ? (
            <p>{t("dashboard.l1")}</p>
          ) : (
            <p>{t("dashboard.l2")}</p>
          )}
        </div>
      )}

      {selectedProperty && (
        <ShowModal
          path={path}
          selectedProperty={selectedProperty}
          isModalVisible={isModalVisible}
          handleCancel={() => setIsModalVisible(false)} // ✅ Close modal when needed
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      {/* <SearchPage isLoading={isLoading}/> */}
      <Modal
        title="Set Auction Details"
        visible={isAuctionModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Start Auction"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {/* Auction Type and Privacy */}

            <Col span={12}>
              <Form.Item
                label="Auction Type"
                name="auctionType"
                rules={[{ required: true, message: "Please select auctionType!" }]}
              >
                <Select placeholder="Select Type">
                  <Option value="public">Public</Option>
                  <Option value="private">Private</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select a start date!" }]}
              >
                <DatePicker style={{ width: "100%" }}   disabledDate={(current) => current && current < moment().startOf('day')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Start Date and End Date */}

            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "Please select an end date!" }]}
              >
                <DatePicker style={{ width: "100%" }}   disabledDate={(current) => current && current < moment().startOf('day')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[{ required: true, message: "Please select a start time!" }]}
              >
                <TimePicker style={{ width: "100%" }} format="h:mm a" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Start Time and End Time */}

            <Col span={12}>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[{ required: true, message: "Please select an end time!" }]}
              >
                <TimePicker style={{ width: "100%" }} format="h:mm a" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Initial Bid"
                name="amount"
                rules={[
                  { required: true, message: "Please enter the initial bid!" },
                  () => ({
                    validator(_, value) {
                      // const minBid = selectedProperty1?.landDetails?.totalPrice * 0.1;
                      const minBid = calculateInitialBid1(selectedProperty1?.landDetails.totalPrice);
                      if (!value || value <= minBid) {
                        return Promise.resolve();
                      }
                      return Promise.reject(`Initial bid must be Less than or equal to ₹${minBid}`);
                    },
                  }),
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter initial bid"
                  prefix="₹"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Initial Bid */}

        </Form>

      </Modal>
      <Modal
        title="View Auction Details"
        visible={isAuctionViewModalVisible}
        onOk={handleFine}
        onCancel={handleCancel}

      >

        {/* Buyers Table */}
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="key"
          bordered
        />

      </Modal>
    </div >
  );
};

export default Agriculture;

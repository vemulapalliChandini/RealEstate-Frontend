

import React, { useEffect, useState } from "react";
import { Table, Input, Row, Col,Card } from "antd";
import { _get } from "../../Service/apiClient";
import { useParams } from "react-router-dom";
import ShowModal from "../Agent/ShowModal";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@mui/icons-material";
function PropertyDetails() {
    const { id } = useParams();
    const [propertyData, setPropertyData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);

                const response = await _get(`/property/getpropbyid/${id}`);
                console.log(response.data);
                if (response && response.data) {
                    setPropertyData(response.data);
                    setFilteredData(response.data); // Initialize filtered data
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching property details:", error);
            }
        };

        fetchPropertyDetails();
    }, [id]);
    const formatNumberWithCommas = (num) => {
        return new Intl.NumberFormat("en-IN").format(num);
      };
    const handleBackToCustomers = () => {
        navigate('/dashboard/csr/Agentscsr');
    };
    // Handle search input with partial match
    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase();

        const containsDigit = /\d/.test(searchTerm);

        const filtered = propertyData.filter((item) => {
            if (containsDigit) {
              
                return item.propertyId?.toLowerCase().includes(searchTerm);
            } else {

                return item.landDetails?.title?.toLowerCase().includes(searchTerm);
            }
        });

        setFilteredData(filtered);
    };



    const handleMoreClick = (record) => {
        setSelectedCustomer(record); // Set the selected property details
        setIsModalVisible(true); // Open the modal
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedCustomer(null);
    };

    const columns = [
        // {
        // title: "S.No",
        // key: "sno",
        // render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        // align: "center",
        // onHeaderCell: () => ({
        // style: {
        // backgroundColor: "#0D416B",
        // color: "white",
        // fontWeight: "bold",
        // textAlign: "center",
        //     },
        //   }),
        // },
        {
            title: "Property ID",
            key: "propertyId",
            render: (_, record) => record.propertyId, // Assuming _id is the property ID
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                },
            }),
        },
     
        {
            title: "Property Name",
            key: "title",
            align: "center",
            render: (text, record) => {
                console.log(record.propertyType);
              if (record.propertyType === "Agricultural land") {
               
                return record.landDetails ? record.landDetails.title : "No title"; // Render agricultural land title
              } else if (record.propertyType === "Commercial"){
              
                return record.propertyTitle ? record.propertyTitle : "No title"; // Render for other property types
              } else if (record.propertyType === "Layout"){
                
                return record.layoutDetails ? record.layoutDetails.layoutTitle : "No title"; // Render for other property types
              } else{
                return record.propertyDetails ? record.propertyDetails.apartmentName : "No title";
              }
            },
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              },
            }),
          },
                  
          {
            title: "Price",
            key: "price",
            align: "center",
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              },
            }),
            render: (text, record) => {
              console.log(record); // Logs the record for debugging
              return (
                <>
                  {record.propertyType === "Commercial" ? (
                    <>
                      {record.propertyDetails?.landDetails?.sell?.plotSize && (
                        <Col span={24}>
                       
                          <span>
                            {formatNumberWithCommas(
                              record.propertyDetails?.landDetails?.sell.totalAmount
                            )}
                          </span>
                          <br />
                        </Col>
                      )}
                      {record.propertyDetails?.landDetails?.lease?.plotSize && (
                        <Col span={24}>
                         
                          <span>
                           
                            {formatNumberWithCommas(
                              record.propertyDetails?.landDetails?.lease.totalAmount
                            )}
                          </span>
                          <br />
                        </Col>
                      )}
                      {record.propertyDetails?.landDetails?.rent?.plotSize && (
                        <Col span={24}>
                          <span style={{ marginTop: "2%" }}>
                          
                            <span>
                             
                              {formatNumberWithCommas(
                                record.propertyDetails?.landDetails?.rent.totalAmount
                              )}
                            </span>
                          </span>
                        </Col>
                      )}
                    </>
                  ) : record.propertyType === "Agricultural land" ? (
                    <Col span={24}>
                    
                      <span> 
                         {formatNumberWithCommas(
                             record.landDetails?.totalPrice)} </span>
                    </Col>
                  ) : record.propertyType === "Layout"?(
                    <Col span={24}>
                     
                      <span>
                      {formatNumberWithCommas(
                        record.layoutDetails?.totalAmount)}</span>
                    </Col>
                  ):(
                    <span>{formatNumberWithCommas (record.propertyDetails?.totalCost)}</span>
                  )}
                </>
              );
            },
          },
          {
            title: "Size",
            key: "size",
            align: "center",
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              },
            }),
            render: (text, record) => {
              console.log(record); // Logs the record for debugging
              return (
                <>
                  {record.propertyType === "Commercial" ? (
                    <>
                      {record.propertyDetails?.landDetails?.sell?.plotSize && (
                        <Col span={24}>
                       
                          <span>
                          {record.propertyDetails?.landDetails?.sell?.plotSize}{record.propertyDetails?.landDetails?.sell?.sizeUnit}
                          </span>
                          <br />
                        </Col>
                      )}
                      {record.propertyDetails?.landDetails?.lease?.plotSize && (
                        <Col span={24}>
                         
                          <span>
                         
                            {record.propertyDetails?.landDetails?.lease?.plotSize }{record.propertyDetails?.landDetails?.lease?.sizeUnit }
                          </span>
                          <br />
                        </Col>
                      )}
                      {record.propertyDetails?.landDetails?.rent?.plotSize && (
                        <Col span={24}>
                          <span style={{ marginTop: "2%" }}>
                          
                            <span>
                             
                              {record.propertyDetails?.landDetails?.rent?.plotSize} {record.propertyDetails?.landDetails?.rent?.sizeUnit}
                            </span>
                          </span>
                        </Col>
                      )}
                    </>
                  ) : record.propertyType === "Agricultural land" ? (
                    <Col span={24}>
                    
                      <span> 
                         {record.landDetails?.size} {
                             record.landDetails?.sizeUnit}</span>
                    </Col>
                  ) : record.propertyType === "Layout"?(
                    <Col span={24}>
                     
                      <span>
                      {record.layoutDetails?.plotSize}{record.layoutDetails?.sizeUnit}</span>
                    </Col>
                  ):(
                    <span>{record.propertyDetails?.flatSize}{record.propertyDetails?.sizeUnit}</span>
                  )}
                </>
              );
            },
          },                          
          {
            title: "District",
            key: "district",
            align: "center",
            onHeaderCell: () => ({
              style: {
                backgroundColor: "#0D416B",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              },
            }),
            render: (text, record) => {
              console.log(record); // Logs the record for debugging
              return (
                <>
                  {record.propertyType === "Commercial" ? (
                    <>

                      
                        <Col span={24}>
                          <span style={{ marginTop: "2%" }}>
                          
                            <span>
                             
                              {record.propertyDetails?.landDetails?.address?.district}
                            </span>
                          </span>
                        </Col>
                      
                    </>
                  ) : record.propertyType === "Agricultural land" ? (
                    <Col span={24}>
                    
                      <span> 
                      {record.address?.district}</span>
                    </Col>
                  ) : record.propertyType === "Layout"?(
                    <Col span={24}>
                     
                      <span>
                      {record.layoutDetails?.address?.district}</span>
                    </Col>
                  ):(
                    <span>{record.address?.district}</span>
                  )}
                </>
              );
            },
          },        
       
        {
            title: "Action",
            key: "activity",
            render: (_, record) => (
                <p
                    onClick={() => handleMoreClick(record)} // Open the modal on click
                    style={{ color: "#0d416b", cursor: "pointer" }}
                >
                    More
                </p>
            ),
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                },
            }),
        },
    ];

    return (
        <div style={{ padding: "10px" }}>
   <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                    marginBottom: "2%"
                }}
            >
            <Row >
                <Col xs={24} sm={12} md={5} lg={1}>
                    <button
                        onClick={handleBackToCustomers}
                        style={{
                            padding: '6px 10px',
                            backgroundColor: '#0D416B',
                            color: 'white',

                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        <FaArrowLeft />
                    </button>
                </Col>
                <Col xs={24} sm={12} md={5} lg={5}>
                <Input
                            placeholder="Property Name or ID"
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                
                </Col>
            </Row>
            </Card>

            {isModalVisible && (
                <ShowModal
                    selectedProperty={selectedCustomer}
                    isModalVisible={isModalVisible}
                    handleCancel={handleModalClose}

                />
            )}

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
            />
        </div>
    );
}

export default PropertyDetails;

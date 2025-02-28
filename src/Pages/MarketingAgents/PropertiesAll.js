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
} from "antd";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRuler, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { _get, _post } from "../../Service/apiClient";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";
import ShowModal from "../Agent/ShowModal";

const { Option } = Select;

function PropertiesAll() {
    const [landDetails, setLandDetails] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState("All");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchAgent, setSearchAgent] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [data, setData] = useState(null);

    const itemsPerPage = 8;
    const rowRef = useRef(null);
    const navigate = useNavigate();

    const Id = localStorage.getItem("userId");

    const fetchData = async (Id) => {

        await _get(`/csr/getPropsByCsr/${Id}`)

            .then((response) => {
                console.log(response.data);
                setLandDetails(response.data);
                setFilteredProperties(response.data);
            })



            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedProperty(null);
    };
    const handleCheckboxChange = (propertyId, checked) => {
        console.log(propertyId);
        setSelectedProperties((prevSelected) => {
            const updatedSet = new Set(prevSelected);
            if (checked) {
                updatedSet.add(propertyId);
            } else {
                updatedSet.delete(propertyId);
            }
            return updatedSet;
        });
    };


    const filterByType = (type) => {
        setSelectedType(type);
        if (type === "All") {
            setFilteredProperties(landDetails);
        } else {
            setFilteredProperties(
                landDetails.filter((item) => {
                    console.log("item.propertyType:", item.type);
                    console.log("type:", type);
                    return item.type === type;
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
        setCurrentPage(1);
    };

    const filterByAgent = (agentname) => {
        setSearchAgent(agentname);
        if (agentname === "") {
            setFilteredProperties(landDetails);
        } else {
            setFilteredProperties(
                landDetails.filter((item) =>
                    item.agentName.toLowerCase().includes(agentname.toLowerCase())
                )
            );
        }
        setCurrentPage(1);
    };

    const currentProperties = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const handleCardClick = async (property) => {
        console.log("peroio");
        fetchPropetiesData(property.type);

        await _get(
            `property/getpropbyid/${property.propertyType}/${property.propertyId}`
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
    const formatNumberWithCommas = (num) => {
        return new Intl.NumberFormat("en-IN").format(num);
    };

    const shareProperties = async (contactType) => {
        if (selectedProperties.size === 0) {
            message.warning("No properties selected to share.");
            return;
        }

        const selectedDetails = Array.from(selectedProperties).map((id) => {
            const property = landDetails.find((item) => item.propertyId === id);
            return {
                name: property.title,
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
                contactType: contactType,
                contactValue:
                    contactType === "email"
                        ? "priyabattsinghbadal@gmail.com"
                        : "9949775665",
            },
        };

        const apiUrl = "/customer/shareProperty";

        try {
            const response = await _post(
                apiUrl,
                requestBody,
                `Properties shared successfully via ${contactType === "email" ? "Email" : "WhatsApp"
                }!`
            );
        } catch (error) {
            message.error(
                `An error occurred while sharing properties via ${contactType}.`
            );
        }
    };

    useEffect(() => {
        fetchData(Id);
    }, []);

    return (
        <div>
            <h3
                style={{
                    textAlign: "center",
                    color: "rgb(13, 65, 107)",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginTop: "25px",
                }}
            >
                {/* Properties List */}
            </h3>

            <div style={{ marginLeft: "3%" }}>
                <Select
                    defaultValue="All"
                    style={{ width: 200, marginRight: 20, border: "1px solid #666" }}
                    onChange={filterByType}
                >
                    <Option value="All">All Properties</Option>
                    <Option value="Agricultural land">Agriculture</Option>
                    <Option value="Residential">Residential</Option>
                    <Option value="Commercial">Commercial</Option>
                    <Option value="Layout">Layout</Option>

                </Select>

                <Input
                    placeholder="Search by Location"
                    value={searchLocation}
                    onChange={(e) => filterByLocation(e.target.value)}
                    style={{ width: 200, border: "1px solid #666", marginRight: "30%" }}
                />

                <Input
                    placeholder="Search by Agent name"
                    value={searchAgent}
                    onChange={(e) => filterByAgent(e.target.value)}
                    style={{ width: 200, border: "1px solid #666", marginLeft: "-28%" }}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginLeft: "70%",
                    marginTop: "-4%",
                }}
            >
                <button
                    onClick={() => shareProperties("whatsapp")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#25D366",
                        color: "#fff",
                        cursor: "pointer",
                        marginLeft: "55%",
                    }}
                >
                    <FaWhatsapp style={{ marginRight: "8px" }} />

                </button>
                <button
                    onClick={() => shareProperties("email")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#0072C6",
                        color: "#fff",
                        cursor: "pointer",
                        marginLeft: "10%",
                    }}
                >
                    <MdEmail style={{ marginRight: "8px" }} />

                </button>
            </div>

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
                                    <div
                                        className="image-container"
                                        style={{ position: "relative" }}
                                    >
                                        <img
                                            alt={item.title}
                                            src={item.images[0]} // use images array in JSON
                                            style={{
                                                height: "164px",
                                                width: "100%",
                                                objectFit: "cover",
                                            }}
                                            className="property-card"
                                            onClick={() => handleCardClick(item)}
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
                                            ₹{formatNumberWithCommas(item.price)}
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
                                            {console.log("Item Property ID:", item)}
                                            <Checkbox
                                                checked={selectedProperties.has(item.propertyId)} // Ensure checkbox is properly checked for each item
                                                onChange={(e) =>
                                                    handleCheckboxChange(
                                                        item.propertyId,
                                                        e.target.checked
                                                    )
                                                }
                                                style={{ marginBottom: "10px" }}
                                            />
                                        </div>
                                    </div>
                                }
                            >
                                <Meta
                                    title={item.title}
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
                                                    <b> Title: </b>
                                                    {item.propertyName}
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

                                                    <strong>Agent:</strong>
                                                    {item.agentName}
                                                </p>
                                            </div>
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
                                                More...
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
            {selectedProperty && (
                <ShowModal
                    selectedProperty={selectedProperty}
                    isModalVisible={isModalVisible}
                    handleCancel={handleCancel}
                />
            )}
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
                        pageSize={itemsPerPage}
                        total={filteredProperties.length}
                        onChange={handlePageChange}
                        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
                    />
                </div>

            </Row>

            {isModalVisible && (
                <ShowModal
                    selectedProperty={selectedProperty}
                    isModalVisible={isModalVisible}
                    handleCancel={handleCancel}
                />
            )}
        </div>
    );
}

export default PropertiesAll;
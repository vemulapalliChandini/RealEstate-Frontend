import React, { useState, useEffect } from "react";
import {
    Tabs,
    Card,
    List,
    Badge,
    Spin,
    Input,
    Empty,
    Row,
    Col,
    Skeleton,
    Pagination,
    Menu,
    Dropdown,
} from "antd";
import { _get } from "../../Service/apiClient";
import { useNavigate } from "react-router-dom";
import {
    SearchOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { FaHandsHelping } from "react-icons/fa";
import ShowModal from "../Agent/ShowModal";

const { TabPane } = Tabs;

const AdminDeals = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
   
    const itemsPerPage = 6;
    const navigate = useNavigate();
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
 
    const currentProperties = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const currentProperties1 = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
   
    const handleModalClose = () => {
        setIsModalVisible(false);
    };


    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const customerResponse = await _get("/deal/getDeals");
                const customersData = customerResponse.data;

                const customerList = [
                    ...new Map(
                        customersData.map((deal) => {
                            if (!deal.customer || !deal.customer._id) {
                                console.warn("Missing customer data for deal:", deal);
                                return [null, null];
                            }

                            const customerId = deal.customer._id;
                            const interestedProperties = customersData
                                .filter(
                                    (d) =>
                                        d.customer?._id === customerId &&
                                        d.property?.layoutDetails?.layoutTitle
                                )
                                .map((d) => d.property.layoutDetails.layoutTitle);

                            return [
                                customerId,
                                {
                                    id: customerId,
                                    name: `${deal.customer.firstName || ""} ${deal.customer.lastName || ""
                                        }`.trim(),
                                    interestedProperties: [...new Set(interestedProperties)],
                                    totalDeals: deal.totalDeals,
                                    profilePicture: deal.customer.profilePicture,
                                    phoneNumber: deal.customer.phoneNumber,
                                    email: deal.customer.email,
                                    district: deal.customer.district,
                                },
                            ];
                        })
                    ).values(),
                ].filter((customer) => customer !== null);

                setCustomers(customerList);
                setFilteredCustomers(customerList);

                const propertyResponse = await _get("/deal/getDistinctProperties");
                const propertiesData = propertyResponse.data;
                console.log(propertiesData);
                const propertyList = propertiesData.map((property) => ({
                    id: property.propertyId,
                    name: property.propertyName,
                    type: property.propertyType,
                    district: property.district,
                    mandal: property.mandal,
                    customerCount: property.customerCount,
                    images: property.images,
                }));

                setProperties(propertyList);
                setFilteredProperties(propertyList);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleSearch = (e, tabKey) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        if (tabKey === "1") {
            const filtered = customers.filter((customer) =>
                customer.name.toLowerCase().includes(value)
            );
            setFilteredCustomers(filtered);
        } else if (tabKey === "2") {
            const filtered = properties.filter((property) =>
                property.name.toLowerCase().includes(value)
            );
            setFilteredProperties(filtered);
        }
    };

    return (
        <div>
            <Tabs defaultActiveKey="1" onChange={() => setSearchText("")}>


                <TabPane
                    tab={
                        <div
                            style={{
                                backgroundColor: "#0d416b",
                                padding: "10px 30px",
                                borderRadius: "12px",
                                color: "#ffffff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                display: "inline-block",
                            }}
                        >
                            Customer Based Deals
                        </div>
                    }
                    key="1"
                >
                    <Card
                        style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                        }}
                    >
                        <Input
                            placeholder="Search by customer name"
                            value={searchText}
                            onChange={(e) => handleSearch(e, "1")}
                            style={{
                                width: "23%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Card>
                    {loading && (
                        <Row className="cards-container" gutter={[24, 24]}>
                            {[...Array(8)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                                    <Card className="card-item" hoverable>
                                        <Skeleton
                                            active
                                            avatar={false}
                                            paragraph={{ rows: 1, width: "100%" }}
                                            title={{ width: "100%" }}
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#f0f0f0",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {currentProperties.length === 0 ? (
                        <Empty description="No results found" />
                    ) : (
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            style={{ marginTop: "2%" }}
                            dataSource={currentProperties}
                            renderItem={(customer) => (
                                <List.Item>
                                    <Card
                                        title={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={
                                                        customer.profilePicture ||
                                                        "/path/to/default-profile.jpg"
                                                    }
                                                    alt={`${customer.name}'s profile`}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        marginRight: "16px",
                                                    }}
                                                />
                                                <span>{customer.name}</span>
                                            </div>
                                        }
                                        extra={
                                            <Badge
                                                count={customer.totalDeals}
                                                style={{
                                                    backgroundColor: "#0d416b",
                                                    marginTop: "-10%",
                                                }}
                                                onClick={() =>
                                                    navigate(`customer/${customer.id}`, {
                                                        state: { customerName: customer.name },
                                                    })
                                                }
                                            >
                                                {/* Deals */}

                                                <FaHandsHelping
                                                    style={{
                                                        marginTop: "-10%",
                                                        marginLeft: "-80%",
                                                        color: "#050505",
                                                    }}
                                                />
                                            </Badge>
                                        }
                                        hoverable
                                        style={{
                                            minHeight: "220px",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            backgroundColor: "rgba(159, 159, 167, 0.23)",

                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            overflow: "hidden",
                                            borderRadius: "1rem",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease-in-out",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div>
                                                <ul
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#4A5568",
                                                        marginLeft: "-1%",
                                                        fontWeight: "bold",
                                                        listStyleType: "none",
                                                        padding: 0,
                                                    }}
                                                >
                                                    <li
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        <PhoneOutlined
                                                            style={{
                                                                marginRight: "8px",
                                                                color: "#0d416b",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                        {customer.phoneNumber}
                                                    </li>
                                                    <li
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        <MailOutlined
                                                            style={{
                                                                marginRight: "8px",
                                                                color: "#0d416b",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                        {customer.email}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <EnvironmentOutlined
                                                            style={{
                                                                marginRight: "8px",
                                                                color: "#0d416b",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                        {customer.district}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "16px",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`customer/${customer.id}`, {
                                                        state: { customerName: customer.name },
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: "#0d416b",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "2px",

                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    padding: "5px 10px",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}

                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={filteredCustomers.length}
                        onChange={handlePageChange}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    />
                </TabPane>

                <TabPane
                    tab={
                        <div
                            style={{
                                backgroundColor: "#0d416b",
                                padding: "10px 30px",
                                borderRadius: "12px",
                                color: "#ffffff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                display: "inline-block",
                            }}
                        >
                            Property Based Deals
                        </div>
                    }
                    key="2"
                >
                    <Card
                        style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                            borderRadius: "8px",
                        }}
                    >
                        <Input
                            placeholder="Search by property name"
                            value={searchText}
                            onChange={(e) => handleSearch(e, "2")}
                            style={{
                                width: "22%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Card>

                    {loading && (
                        <Row className="cards-container" gutter={[24, 24]}>
                            {[...Array(8)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                                    <Card className="card-item" hoverable>
                                        <Skeleton
                                            active
                                            avatar={false}
                                            paragraph={{ rows: 1, width: "100%" }}
                                            title={{ width: "100%" }}
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#f0f0f0",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {currentProperties1.length === 0 ? (
                        <Empty description="No results found" />
                    ) : (
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            style={{ marginTop: "2%" }}
                            dataSource={currentProperties1}
                            renderItem={(property) => (
                                <List.Item>
                                    <Card
                                        title={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={
                                                        property.images || "/path/to/default-profile.jpg"
                                                    }
                                                    alt={`${property.name}'s profile`}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        marginRight: "16px",
                                                    }}
                                                />
                                                <span>{property.name}</span>
                                            </div>
                                        }
                                        extra={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Badge
                                                    count={property.customerCount}
                                                    style={{
                                                        backgroundColor: "#0d416b",
                                                        marginTop: "-10%",
                                                    }}
                                                    onClick={() =>
                                                        navigate(`property/${property.id}`, {
                                                            state: { propertyName: property.name },
                                                        })
                                                    }
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            marginTop: "-10%",
                                                            marginLeft: "-60%",
                                                            color: "#050505",
                                                        }}
                                                    />
                                                </Badge>
                                            </div>
                                        }
                                        hoverable
                                        style={{
                                            width: "300px",
                                            minHeight: "220px",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            backgroundColor: "rgba(159, 159, 167, 0.23)",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            overflow: "hidden",
                                            borderRadius: "1rem",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease-in-out",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div>
                                                <ul
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#4A5568",
                                                        marginLeft: "-20%",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <HomeOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.type}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <EnvironmentOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.district}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <InfoCircleOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.mandal}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "16px",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`property/${property.id}`, {
                                                        state: { propertyName: property.name },
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: "#0d416b",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "2px",

                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    padding: "5px 10px",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={filteredProperties.length}
                        onChange={handlePageChange}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    />
                </TabPane>

                {/*  new code 3  */}

                <TabPane
                    tab={
                        <div
                            style={{
                                backgroundColor: "#0d416b",
                                padding: "10px 35px",
                                borderRadius: "12px",
                                color: "#ffffff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                display: "inline-block",
                            }}
                        >
                            Agents Based Deals
                        </div>
                    }
                    key="3"
                >
                    <Card
                        style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                            borderRadius: "8px",
                        }}
                    >
                        <Input
                            placeholder="Search by agent name"
                            value={searchText}
                            onChange={(e) => handleSearch(e, "2")}
                            style={{
                                width: "22%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Card>

                    {loading && (
                        <Row className="cards-container" gutter={[24, 24]}>
                            {[...Array(8)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                                    <Card className="card-item" hoverable>
                                        <Skeleton
                                            active
                                            avatar={false}
                                            paragraph={{ rows: 1, width: "100%" }}
                                            title={{ width: "100%" }}
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#f0f0f0",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {currentProperties1.length === 0 ? (
                        <Empty description="No results found" />
                    ) : (
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            style={{ marginTop: "2%" }}
                            dataSource={currentProperties1}
                            renderItem={(property) => (
                                <List.Item>
                                    <Card
                                        title={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={
                                                        property.images || "/path/to/default-profile.jpg"
                                                    }
                                                    alt={`${property.name}'s profile`}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        marginRight: "16px",
                                                    }}
                                                />
                                                <span>{property.name}</span>
                                            </div>
                                        }
                                        extra={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Badge
                                                    count={property.customerCount}
                                                    style={{
                                                        backgroundColor: "#0d416b",
                                                        marginTop: "-10%",
                                                    }}
                                                    onClick={() =>
                                                        navigate(`property/${property.id}`, {
                                                            state: { propertyName: property.name },
                                                        })
                                                    }
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            marginTop: "-10%",
                                                            marginLeft: "-60%",
                                                            color: "#050505",
                                                        }}
                                                    />
                                                </Badge>
                                            </div>
                                        }
                                        hoverable
                                        style={{
                                            width: "300px",
                                            minHeight: "220px",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            backgroundColor: "rgba(159, 159, 167, 0.23)",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            overflow: "hidden",
                                            borderRadius: "1rem",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease-in-out",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div>
                                                <ul
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#4A5568",
                                                        marginLeft: "-20%",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <HomeOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.type}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <EnvironmentOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.district}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <InfoCircleOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.mandal}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "16px",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`property/${property.id}`, {
                                                        state: { propertyName: property.name },
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: "#0d416b",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "2px",

                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    padding: "5px 10px",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={filteredProperties.length}
                        onChange={handlePageChange}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    />
                </TabPane>

                {/*  End 3 */}

                {/*  new code from here 4 */}

                <TabPane
                    tab={
                        <div
                            style={{
                                backgroundColor: "#0d416b",
                                padding: "10px 40px",
                                borderRadius: "12px",
                                color: "#ffffff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                display: "inline-block",
                            }}
                        >
                            CSR Based Deals
                        </div>
                    }
                    key="4"
                >
                    <Card
                        style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                            borderRadius: "8px",
                        }}
                    >
                        <Input
                            placeholder="Search by CSR name"
                            value={searchText}
                            onChange={(e) => handleSearch(e, "2")}
                            style={{
                                width: "22%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Card>

                    {loading && (
                        <Row className="cards-container" gutter={[24, 24]}>
                            {[...Array(8)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                                    <Card className="card-item" hoverable>
                                        <Skeleton
                                            active
                                            avatar={false}
                                            paragraph={{ rows: 1, width: "100%" }}
                                            title={{ width: "100%" }}
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#f0f0f0",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {currentProperties1.length === 0 ? (
                        <Empty description="No results found" />
                    ) : (
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            style={{ marginTop: "2%" }}
                            dataSource={currentProperties1}
                            renderItem={(property) => (
                                <List.Item>
                                    <Card
                                        title={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={
                                                        property.images || "/path/to/default-profile.jpg"
                                                    }
                                                    alt={`${property.name}'s profile`}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        marginRight: "16px",
                                                    }}
                                                />
                                                <span>{property.name}</span>
                                            </div>
                                        }
                                        extra={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Badge
                                                    count={property.customerCount}
                                                    style={{
                                                        backgroundColor: "#0d416b",
                                                        marginTop: "-10%",
                                                    }}
                                                    onClick={() =>
                                                        navigate(`property/${property.id}`, {
                                                            state: { propertyName: property.name },
                                                        })
                                                    }
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            marginTop: "-10%",
                                                            marginLeft: "-60%",
                                                            color: "#050505",
                                                        }}
                                                    />
                                                </Badge>
                                            </div>
                                        }
                                        hoverable
                                        style={{
                                            width: "300px",
                                            minHeight: "220px",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            backgroundColor: "rgba(159, 159, 167, 0.23)",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            overflow: "hidden",
                                            borderRadius: "1rem",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease-in-out",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div>
                                                <ul
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#4A5568",
                                                        marginLeft: "-20%",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <HomeOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.type}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <EnvironmentOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.district}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <InfoCircleOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.mandal}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "16px",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`property/${property.id}`, {
                                                        state: { propertyName: property.name },
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: "#0d416b",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "2px",

                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    padding: "5px 10px",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={filteredProperties.length}
                        onChange={handlePageChange}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    />
                </TabPane>

                {/*  End 4 */}

                {/*  new code from here 5 */}

                <TabPane
                    tab={
                        <div
                            style={{
                                backgroundColor: "#0d416b",
                                padding: "10px 20px",
                                borderRadius: "12px",
                                color: "#ffffff",
                                fontWeight: "bold",
                                fontSize: "14px",
                                display: "inline-block",
                            }}
                        >
                            Marketing Agents Based Deals
                        </div>
                    }
                    key="5"
                >
                    <Card
                        style={{
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                            borderRadius: "8px",
                        }}
                    >
                        <Input
                            placeholder="Search by  Marketing Agents name"
                            value={searchText}
                            onChange={(e) => handleSearch(e, "2")}
                            style={{
                                width: "22%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Card>

                    {loading && (
                        <Row className="cards-container" gutter={[24, 24]}>
                            {[...Array(8)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                                    <Card className="card-item" hoverable>
                                        <Skeleton
                                            active
                                            avatar={false}
                                            paragraph={{ rows: 1, width: "100%" }}
                                            title={{ width: "100%" }}
                                            style={{
                                                height: "200px",
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#f0f0f0",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {currentProperties1.length === 0 ? (
                        <Empty description="No results found" />
                    ) : (
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            style={{ marginTop: "2%" }}
                            dataSource={currentProperties1}
                            renderItem={(property) => (
                                <List.Item>
                                    <Card
                                        title={
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={
                                                        property.images || "/path/to/default-profile.jpg"
                                                    }
                                                    alt={`${property.name}'s profile`}
                                                    style={{
                                                        width: "48px",
                                                        height: "48px",
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        marginRight: "16px",
                                                    }}
                                                />
                                                <span>{property.name}</span>
                                            </div>
                                        }
                                        extra={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Badge
                                                    count={property.customerCount}
                                                    style={{
                                                        backgroundColor: "#0d416b",
                                                        marginTop: "-10%",
                                                    }}
                                                    onClick={() =>
                                                        navigate(`property/${property.id}`, {
                                                            state: { propertyName: property.name },
                                                        })
                                                    }
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            marginTop: "-10%",
                                                            marginLeft: "-60%",
                                                            color: "#050505",
                                                        }}
                                                    />
                                                </Badge>
                                            </div>
                                        }
                                        hoverable
                                        style={{
                                            width: "300px",
                                            minHeight: "220px",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            backgroundColor: "rgba(159, 159, 167, 0.23)",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            overflow: "hidden",
                                            borderRadius: "1rem",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease-in-out",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div>
                                                <ul
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#4A5568",
                                                        marginLeft: "-20%",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <HomeOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.type}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <EnvironmentOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.district}
                                                    </li>
                                                    <li style={{ display: "flex", alignItems: "center" }}>
                                                        <InfoCircleOutlined
                                                            style={{ marginRight: "8px", color: "#0d416b" }}
                                                        />
                                                        {property.mandal}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "16px",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`property/${property.id}`, {
                                                        state: { propertyName: property.name },
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: "#0d416b",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "2px",

                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    padding: "5px 10px",
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                View More
                                            </button>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )}
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={filteredProperties.length}
                        onChange={handlePageChange}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    />
                </TabPane>

                {/*  End 5 */}
            </Tabs>
            {isModalVisible && (
                <ShowModal
                    selectedProperty={selectedCustomer}
                    isModalVisible={isModalVisible}
                    handleCancel={handleModalClose}
                />
            )}
        </div>
    );
};

export default AdminDeals;
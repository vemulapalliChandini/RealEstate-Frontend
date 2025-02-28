
import React, { useEffect, useState } from "react";
import { Table, Input, Space, Modal, Col, Row, Card } from "antd";
import { _get } from "../../Service/apiClient";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    ApartmentOutlined,
    // WorkOutlined,
    UnorderedListOutlined,
    DollarOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { Search } = Input;

function CustomerDetails() {
    const [customerData, setCustomerData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                setLoading(true);
                const response = await _get(`/customer/getCustomer?agentId=${id}`);
                console.log(response.data);
                if (response && response.data) {
                    setCustomerData(response.data);
                    setFilteredData(response.data);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching customer details:", error);
            }
        };

        fetchCustomerDetails();
    }, []);
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, ""); // Remove non-digit characters
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber; // Return the original if it doesn't match the pattern
    };
    // Handle search input with partial match
    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase();
        const filtered = customerData.filter((item) =>
            `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm)
        );
        setFilteredData(filtered);
    };
    const handleBackToCustomers = () => {
        navigate('/dashboard/csr/Agentscsr');
    };
    const formatPrice = (price) => {
        if (price == null || isNaN(price)) {
          return "N/A"; // Handle invalid prices
        }
    
        if (price >= 1_00_00_000) {
          return (price / 1_00_00_000).toFixed(1) + " Cr"; // Convert to Crores
        } else if (price >= 1_00_000) {
          return (price / 1_00_000).toFixed(1) + " L"; // Convert to Lakhs
        } else if (price >= 1_000) {
          return (price / 1_000).toFixed(1) + " K"; // Convert to Thousands
        } else {
          return price.toLocaleString(); // Format small numbers with commas
        }
      };
    const handleMoreClick = (record) => {
        setSelectedCustomer(record);
        setModalVisible(true);
    };


    const handleModalCancel = () => {
        setModalVisible(false);
        setSelectedCustomer(null);
    };

    const columns = [
        {
            title: "S.No",
            key: "sno",
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
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
            title: "Customer Name",
            key: "customerName",
            render: (record) => `${record.firstName} ${record.lastName}`,
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
                    title: "Email",
                    dataIndex: "email",
                    key: "email",
                    align: "center",
                    render: (text) => (
                        <>
                            <MailOutlined style={{ marginRight: "5px", color: "#0d416b" }} />
                            {text}
                        </>
                    ),
                    onHeaderCell: () => ({
                        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
                    }),
        
                },
                {
                    title: "Phone",
                    dataIndex: "phoneNumber",
                    key: "phoneNumber",
                    align: "center",
                    render: (text) => (
                        <>
                            <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                            {formatPhoneNumber(text)}
                        </>
                    ),
                    onHeaderCell: () => ({
                        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
                    }),
        
                },
      
        {
            title: "District",
            dataIndex: "district",
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
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <a
                    onClick={() => handleMoreClick(record)}
                    style={{ color: "#0d416b", cursor: "pointer" }}
                >
                    More
                </a>
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
        <div style={{ padding: "20px" }}>
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
                <Col xs={24} sm={12} md={6} lg={6}>
                        <Input
                            placeholder="Search by Customer Name"
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 250, height: "36px" }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>
            
            </Row>
            </Card>
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

            {selectedCustomer && (
                <Modal
                    visible={modalVisible}
                    onCancel={handleModalCancel}
                    footer={null}
                    width={700}
                    height={100}
                    bodyStyle={{ padding: "40px" }}
                    headerStyle={{ backgroundColor: "#f0f2f5" }}
                >
                    <Card
                        title={<span style={{ color: "white" }}>Customer Information</span>}
                        bordered={true}
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            width: "110%",
                            marginLeft: "-6%",
                        }}
                        headStyle={{ backgroundColor: "#08253d", fontSize: "16px" }}
                        bodyStyle={{ padding: "20px" }}
                    >
                        {/* Customer Details */}
                        <Row gutter={16} style={{ marginBottom: "20px" }}>
                            <Col span={14}>
                                <p style={{ display: "flex", alignItems: "center" }}>
                                    <UserOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                    <strong> Customer Name:</strong>{" "}
                                    {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                                </p>
                            </Col>

                            <Col span={10}>
                                <p
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginLeft: "-12%",
                                    }}
                                >
                                    <MailOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                    <strong> Email:</strong> {selectedCustomer.email}
                                </p>
                            </Col>

                            {/* <Col span={10}>
<p
style={{
display: "flex",
alignItems: "center",
marginLeft: "-12%",
overflow: "hidden",
whiteSpace: "nowrap",
textOverflow: "ellipsis",
}}
>
<MailOutlined
style={{ color: "#0d416b", marginRight: "8px" }}
/>
<strong> Email:</strong>{" "}
{selectedCustomer.email.length > 24
? `${selectedCustomer.email.slice(0, 20)}...`
: selectedCustomer.email}
</p>
</Col> */}
                        </Row>

                        {/* Phone Number and Income */}
                        <Row gutter={48} style={{ marginBottom: "20px" }}>
                            <Col span={12}>
                                <p
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <PhoneOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                    <strong> Phone Number:</strong> {formatPhoneNumber(selectedCustomer.phoneNumber)}
                                </p>
                            </Col>
                            <Col span={12}>
                                <p style={{ display: "flex", alignItems: "center" }}>
                                    <DollarOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                    <strong> Income:</strong> {formatPrice(selectedCustomer.income)}
                                </p>
                            </Col>
                        </Row>

                        {/* Occupation and Affordable */}
                        <Row gutter={48} style={{ marginBottom: "20px" }}>
                            <Col span={12}>
                                <p
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <UnorderedListOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                    <strong> Occupation:</strong> {selectedCustomer.occupation}
                                </p>
                            </Col>
                            <Col span={12}>
                                <p style={{ display: "flex", alignItems: "center" }}>
                                    <CheckCircleOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                <strong>Affordable Budget:</strong> {selectedCustomer.budget ? formatPrice(selectedCustomer.budget) : "N/A"}
                                </p>
                            </Col>
                        </Row>

                        {/* Expected Size */}


                        {/* Address */}
                        <Row gutter={16}>
                            <Col span={24}>
                                <p style={{ display: "flex", alignItems: "center" }}>
                                    <ApartmentOutlined
                                        style={{ color: "#0d416b", marginRight: "8px" }}
                                    />
                                    <strong> Address:</strong>{" "}
                                    {`${selectedCustomer.mandal}, ${selectedCustomer.village}, ${selectedCustomer.district}, ${selectedCustomer.state}`}
                                </p>
                            </Col>
                        </Row>
                    </Card>
                </Modal>
            )}
        </div>
    );
}

export default CustomerDetails;
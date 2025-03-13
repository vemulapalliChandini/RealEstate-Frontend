
import React, { useState, useEffect } from "react";
import { Table, Spin, Input, Empty, Card, Row, Col } from "antd";
import { _get } from "../../Service/apiClient";
import { useParams, useNavigate } from "react-router-dom";

import { FaWhatsapp } from "react-icons/fa";

import {
    SearchOutlined,
} from "@ant-design/icons";
import { FaArrowLeft } from "react-icons/fa";

const PropertyAssociation = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCustomer, setSearchCustomer] = useState(""); // State for customer search
    const [searchAgent, setSearchAgent] = useState(""); // State for agent search
    const handleBackToCustomers = () => {
        navigate('/dashboard/csr/Association');
    };
    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await _get(`/deal/getPropertyDeals/${propertyId}`);
                setDeals(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching property deals:", error);
                setLoading(false);
            }
        };

        fetchDeals();
    }, [propertyId]);



    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = number.toString().replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return number;
    };






    const columns = [
        {
            title: "Customer Name",
            key: "customerName",
            align: "center",
            border: "none",
            render: (_, record) =>
                `${record.customer.firstName} ${record.customer.lastName}`,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },


        {
            title: "Customer Contact",
            key: "customerContact",
            align: "center",
            render: (_, record) => (
                <>
                    <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                    {formatPhoneNumber(record.customer.phoneNumber)}
                </>
            ),

            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "Agent",
            key: "Agent",
            align: "center",
            render: (_, record) =>
                `${record.agent.firstName} ${record.agent.lastName}`,
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "Agent Phno",
            key: "Agent phno",
            align: "center",
            render: (_, record) => (
                <>
                    <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                    {formatPhoneNumber(record.agent.phoneNumber)}
                </>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },
        {
            title: "Comments",
            dataIndex: "comments",
            key: "comments",
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },
    ];

    // Filter the deals based on customer search and agent search
    const filteredDeals = deals.filter((deal) => {
        const customerMatches =
            deal.customer.firstName
                .toLowerCase()
                .includes(searchCustomer.toLowerCase()) ||
            deal.customer.phoneNumber.includes(searchCustomer);
        const agentMatches =
            deal.agent.firstName.toLowerCase().includes(searchAgent.toLowerCase()) ||
            deal.agent.phoneNumber.includes(searchAgent);
        return customerMatches && agentMatches;
    });

    if (loading) {
        return (
            <Spin size="large" style={{ display: "block", margin: "20% auto" }} />
        );
    }

    return (
        <div style={{ padding: "20px" }}>

            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    marginBottom: "2%"
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={1} sm={1} md={1} lg={1}>
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
                    <Col>
                        {/* Search input for customer */}
                        <Input
                            placeholder="Search by customer name or Phone"
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>
                    <Col>
                        <Input
                            placeholder="Search by agent name or Phone"
                            value={searchAgent}
                            onChange={(e) => setSearchAgent(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>
                </Row>
            </Card>
            {/* Display "No results found" if no matching data */}
            {filteredDeals.length === 0 ? (
                <Empty description="No results found" />
            ) : (
                <Table
                    dataSource={filteredDeals.map((deal) => ({
                        ...deal,
                        key: deal.dealId,
                    }))}
                    columns={columns}

                    bordered={false}

                    pagination={true}
                />
            )}
        </div>
    );
};

export default PropertyAssociation;
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Modal, Select, Input, Button, Table, Tabs, Pagination } from 'antd';
import { _get, _put } from "../../Service/apiClient";

import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FaWhatsapp } from "react-icons/fa";
import {
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    MailOutlined,
    AppstoreOutlined, MoneyCollectOutlined, ApartmentOutlined,
    CommentOutlined, CheckCircleOutlined, CloseCircleOutlined, TableOutlined,
    AppstoreAddOutlined
} from "@ant-design/icons";
import moment from "moment";
const { Option } = Select;
const { TabPane } = Tabs;
const DealStatus = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [nameSearchQuery1, setNameSearchQuery1] = useState("");
    const [nameSearchQuery2, setNameSearchQuery2] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState("");
    const [CustomerNames, setCustomerNames] = useState([]);
    const [AgentNames, setAgentNames] = useState([]);
    const [PropertyNames, setPropertyNames] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [view, setView] = useState('card');
    const [activities, setActivites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    };



    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text, record) => (
                <span>
                    <UserOutlined style={{ marginRight: '8px' }} />
                    {record.customer.firstName} {record.customer.lastName}
                </span>
            ),

            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text, record) => (
                <span>
                    <a href={`https://wa.me/${record.customer.phoneNumber}`} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                    </a>
                    {formatPhoneNumber(record.customer.phoneNumber)}

                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: 'Property Name',
            dataIndex: 'propertyName',
            key: 'propertyName',
            render: (text, record) => (
                <span>
                    <HomeOutlined style={{ marginRight: '8px' }} />
                    {record.deal.propertyName}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text, record) => (
                <span>
                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                    {record.property.address.district}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: 'Assigned Agent',
            dataIndex: 'assignedAgent',
            key: 'assignedAgent',
            render: (text, record) => (
                <span>
                    <TeamOutlined style={{ marginRight: '8px' }} />
                    {record.agent.firstName} {record.agent.lastName}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center",},
            }),

        },
        {
            title: 'Status',
            dataIndex: 'sellingStatus',
            key: 'sellingStatus',
            render: (text, record) => (
                <span>

                    {record.deal.sellingStatus}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: 'Sold Cost',
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => (
                <span>
                    {record.deal && record.deal.amount ? record.deal.amount : 'N/A'}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center", },
            }),

        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <button
                    style={{
                        padding: "3px 10px",
                        background: "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                        marginRight: "5%",
                    }}
                    onClick={() => handleViewMore(record.deal._id)}
                >
                    Activities
                </button>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold", textAlign: "center",},
            }),

        },

    ];

    const toggleView = (viewType) => {
        setView(viewType);
    };
    useEffect(() => {


        fetchDeals();
    }, []);
    const onPageChange = (page) => {
        setCurrentPage(page);
    };
    const currentActivities = activities.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const fetchDeals = async () => {
        try {
            const response = await _get('/deal/getClosedDeals');
            console.log(response.data);
            setDeals(response.data);
            setCustomerNames(
                response.data.map((customer) => `${customer.customer.firstName} ${customer.customer.lastName}`)
            );
            setAgentNames(
                response.data.map((agent) => `${agent.agent.firstName} ${agent.agent.lastName}`)
            )
            setPropertyNames(
                response.data.map((agent) => `${agent.deal.propertyName}`)
            )
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deals:', error);
            setLoading(false);
        }
    };
   

    const handleViewMore = async (dealId, agentId) => {
        try {
            const response = await _get(`/activity/activities?agentId=${agentId}&dealingId=${dealId}`);
            console.log(response.data.data);
            const activitiesArray = Array.isArray(response.data) ? response.data : [response.data];
            setActivites(response.data.data);
            setIsActivityModalOpen(true);

        } catch (error) {
            console.error('Error fetching deals:', error);

        }

    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedDeal(null);
        setIsActivityModalOpen(false);
    };
    const filteredAgents = deals.filter((agent) => {
        const nameSearch = nameSearchQuery.toLowerCase();
        const nameSearch1 = nameSearchQuery1.toLowerCase();
        const nameSearch2 = nameSearchQuery2.toLowerCase();
        const fullName = `${agent.customer.firstName} ${agent.customer.lastName}`.toLowerCase();
        const fullName1 = `${agent.agent.firstName} ${agent.agent.lastName}`.toLowerCase();

        const nameMatch =
            fullName.includes(nameSearch) ||
            agent.customer.firstName.toLowerCase().includes(nameSearch) ||
            agent.customer.lastName.toLowerCase().includes(nameSearch);

        const nameMatch1 =
            fullName1.includes(nameSearch1) ||
            agent.agent.firstName.toLowerCase().includes(nameSearch1) ||
            agent.agent.lastName.toLowerCase().includes(nameSearch1);
        const nameMatch2 =

            agent.deal.propertyName.toLowerCase().includes(nameSearch2);


        const statusMatch =
            agent.deal.sellingStatus.includes(selectedStatus);
        console.log(statusMatch);
        const locationSearch = locationSearchQuery.toLowerCase();
        const locationMatch = (() => {
            if (agent.property?.propertyType === "Agricultural land" || agent.property?.propertyType === "Residential") {
                return (
                    (agent.property.address?.district && agent.property.address.district.toLowerCase().includes(locationSearch)) ||
                    (agent.property.address?.mandal && agent.property.address.mandal.toLowerCase().includes(locationSearch)) ||
                    (agent.property.address?.village && agent.property.address.village.toLowerCase().includes(locationSearch))
                );
            } else if (agent.property?.propertyType === "Commercial") {
                return (
                    (agent.property.propertyDetails?.landDetails?.address?.district && agent.property.propertyDetails.landDetails.address.district.toLowerCase().includes(locationSearch)) ||
                    (agent.property.propertyDetails?.landDetails?.address?.mandal && agent.property.propertyDetails.landDetails.address.mandal.toLowerCase().includes(locationSearch)) ||
                    (agent.property.propertyDetails?.landDetails?.address?.village && agent.property.propertyDetails.landDetails.address.village.toLowerCase().includes(locationSearch))
                );
            } else if (agent.property?.propertyType === "Layout") {
                return (
                    (agent.property.layoutDetails?.address?.district && agent.property.layoutDetails.address.district.toLowerCase().includes(locationSearch)) ||
                    (agent.property.layoutDetails?.address?.mandal && agent.property.layoutDetails.address.mandal.toLowerCase().includes(locationSearch)) ||
                    (agent.property.layoutDetails?.address?.village && agent.property.layoutDetails.address.village.toLowerCase().includes(locationSearch))
                );
            }
            return false;
        })();

        if (selectedStatus === "All") {
            return nameMatch && locationMatch && nameMatch1;
        }


        return nameMatch && locationMatch && nameMatch1 && statusMatch && nameMatch2;
    });
    if (loading) {
        return <Spin size="large" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
        }} />;
    }
    return (
        <>

            <Row gutter={[16, 16]} style={{ marginBottom: "3%" }}>
                <Col span={4}>
                    <Select
                        showSearch
                        placeholder="Search by Customer name"
                        style={{ width: "100%", border: "1px solid gray" }}
                        value={nameSearchQuery || undefined}
                        onChange={(value) => {
                            console.log(value);
                            setNameSearchQuery(value);
                        }}
                        onSearch={(value) => {
                            setNameSearchQuery(value);
                        }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {CustomerNames.map((name, index) => (
                            <Option key={index} value={name}>
                                {name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={4}>
                    <Select
                        showSearch
                        placeholder="Search by Agent name"
                        style={{ width: "100%", border: "1px solid gray" }}
                        value={nameSearchQuery1 || undefined}
                        onChange={(value) => {
                            console.log(value);
                            setNameSearchQuery1(value);
                        }}
                        onSearch={(value) => {
                            setNameSearchQuery1(value);
                        }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {AgentNames.map((name, index) => (
                            <Option key={index} value={name}>
                                {name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={4}>
                    <Select
                        showSearch
                        placeholder="Search by Property name"
                        style={{ width: "100%", border: "1px solid gray" }}
                        value={nameSearchQuery2 || undefined}
                        onChange={(value) => {
                            console.log(value);
                            setNameSearchQuery2(value);
                        }}
                        onSearch={(value) => {
                            setNameSearchQuery2(value);
                        }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {PropertyNames.map((name, index) => (
                            <Option key={index} value={name}>
                                {name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={4}>
                    <Input
                        placeholder="Search by Location"
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        style={{ width: "100%", border: "1px solid gray" }}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        placeholder="Select an option"
                        style={{ width: "100%", border: "1px solid gray" }}
                        value={selectedStatus}
                        onChange={(value) => {
                            console.log("Selected Value:", value);
                            setSelectedStatus(value);
                        }}
                    >
                        <Option value="All">All</Option>
                        <Option value="sold">Sold</Option>
                        <Option value="unSold">Unsold</Option>

                    </Select>
                </Col>
                <Col span={2}>
                    <Button
                        icon={<AppstoreAddOutlined />}
                        onClick={() => toggleView('card')}
                        style={{ marginRight: 10 }}
                    >
                        Cards
                    </Button>
                </Col>
                <Col span={2}>
                    <Button
                        icon={<TableOutlined />}
                        onClick={() => toggleView('table')}
                    >
                        Table
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {/* Render the Table only once */}
                {view !== 'card' && (
                    <Col span={24}>
                        <div style={{ marginTop: 20 }}>
                            <Table
                                dataSource={filteredAgents}
                                columns={columns}
                                rowKey={(record) => record.deal._id}
                                style={{ marginTop: "20px" }}
                            />
                        </div>
                    </Col>
                )}

                {/* Render Cards for each response inside the map */}
                {view === 'card' && filteredAgents.map((response, index) => {
                    const interestIn = Number(response.deal.interestIn);
                    const status = interestIn === 1 ? 'Interested' :
                        interestIn === 2 ? 'Not Interested' :
                            'Pending';

                    return (
                        <Col span={8} key={index}>
                            <Card
                                title={response.deal.propertyName}
                                bordered={false}
                                style={{
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'box-shadow 0.3s ease-in-out',
                                    textAlign: 'left',
                                }}
                                headStyle={{ backgroundColor: '#0d416b', color: 'white' }}
                                hoverable
                                extra={
                                    <button
                                        style={{
                                            padding: "3px 10px",
                                            background: "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))", // Corrected background syntax
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "background 0.3s ease",
                                            marginRight: "5%"
                                        }}
                                        onClick={() => handleViewMore(response.deal._id, response.agent._id)}
                                    >
                                        Activities
                                    </button>
                                }
                            >
                                <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <UserOutlined style={{ marginRight: '8px' }} />
                                    {response.customer.firstName} {response.customer.lastName}
                                </h3>
                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <a href={`https://wa.me/${response.customer.phoneNumber}`} target="_blank" rel="noopener noreferrer">
                                        <FaWhatsapp size={20} color="green" style={{ marginRight: '8px' }} />
                                    </a>
                                    {formatPhoneNumber(response.customer.phoneNumber)}

                                </p>
                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                                    {response.property.address.district}, {response.property.address.state}
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <TeamOutlined style={{ marginRight: '8px' }} />
                                    Assigned Agent: {response.agent.firstName} {response.agent.lastName}
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <MoneyCollectOutlined style={{ marginRight: '8px' }} />
                                    <strong>Sold Cost: </strong>{response.deal.amount}
                                </p>
                                <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleOutlined style={{ marginRight: '8px' }} />
                                    <strong>Status:</strong> {response.deal.sellingStatus}
                                </p>

                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Modal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                {selectedDeal && (
                    <Tabs defaultActiveKey="1" style={{ marginTop: "2%" }}
                    >

                        <TabPane tab="Activities" key="1">

                            <p><ApartmentOutlined /> <strong>Property Name:</strong> {selectedDeal.deal.propertyName}</p>
                            <p><HomeOutlined /> <strong>Property Type:</strong> {selectedDeal.deal.propertyType}</p>
                            <p><CommentOutlined /> <strong>Comments:</strong> {selectedDeal.deal.comments}</p>
                            <p><CheckCircleOutlined /> <strong>Status:</strong> {selectedDeal.deal.interestIn === 1 ? 'Interested' : selectedDeal.deal.interestIn === 2 ? 'Not Interested' : 'Pending'}</p>

                        </TabPane>

                        {/* Property Details Tab */}
                        <TabPane tab="Property Details" key="2">

                            <p><strong><AppstoreOutlined /> Size:</strong> {selectedDeal.property.landDetails.size} {selectedDeal.property.landDetails.sizeUnit}</p>
                            <p><strong><MoneyCollectOutlined /> Price:</strong> {selectedDeal.property.landDetails.totalPrice} </p>
                            <p><strong><EnvironmentOutlined /> District:</strong> {selectedDeal.property.address.district}</p>
                            <p><strong><EnvironmentOutlined /> Mandal:</strong> {selectedDeal.property.address.mandal}</p>

                        </TabPane>

                        {/* Customer Details Tab */}
                        <TabPane tab="Customer Details" key="3">

                            <p><strong><UserOutlined /> Name:</strong> {selectedDeal.customer.firstName} {selectedDeal.customer.lastName}</p>
                            <p><strong><FaWhatsapp /> Phone:</strong>{formatPhoneNumber(selectedDeal.customer.phoneNumber)} </p>
                            <p><strong><MailOutlined /> Email:</strong> {selectedDeal.customer.email}</p>
                            <p><strong><EnvironmentOutlined /> District:</strong> {selectedDeal.customer.district}</p>
                            <p><strong><EnvironmentOutlined /> Mandal:</strong> {selectedDeal.customer.mandal}</p>
                            <p><strong><EnvironmentOutlined /> Village:</strong> {selectedDeal.customer.village}</p>

                        </TabPane>

                        {/* Agent Details Tab */}
                        <TabPane tab="Agent Details" key="4">

                            <p><strong><UserOutlined /> Name:</strong> {selectedDeal.agent.firstName} {selectedDeal.agent.lastName}</p>
                            <p><strong><FaWhatsapp /> Phone:</strong> {formatPhoneNumber(selectedDeal.agent.phoneNumber)}</p>
                            <p><strong><MailOutlined /> Email:</strong> {selectedDeal.agent.email}</p>
                            <p><strong><EnvironmentOutlined /> District:</strong> {selectedDeal.agent.district}</p>
                            <p><strong><EnvironmentOutlined /> Mandal:</strong> {selectedDeal.agent.mandal}</p>
                            <p><strong><EnvironmentOutlined /> Village:</strong> {selectedDeal.agent.city}</p>

                        </TabPane>
                    </Tabs>
                )}
            </Modal>
            <Modal
                visible={isActivityModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <Row gutter={16}>

                    {currentActivities.map((activity) => (
                        <Col span={24} key={activity.id}>
                            <Card
                                title={

                                    <strong>
                                        {moment(activity.meetingDate).format("MMMM Do YYYY, h:mm a")} by {activity.activityByName}
                                    </strong>

                                }
                                style={{
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'box-shadow 0.3s ease-in-out',
                                    textAlign: 'left', marginBottom: "1%"
                                }}
                                headStyle={{ backgroundColor: '#0d416b', color: 'white' }}


                            >
                                <p>{activity.comment}</p>
                            </Card>
                        </Col>
                    ))}

                </Row>
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
                            total={activities.length}
                            onChange={onPageChange}
                            style={{ textAlign: "center", marginTop: "20px" }}
                        />
                    </div>

                </Row>
                {/* Pagination */}

            </Modal>
        </>
    );
};

export default DealStatus;

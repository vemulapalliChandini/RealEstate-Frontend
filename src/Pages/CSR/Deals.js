import React, { useEffect, useState, useMemo } from 'react';
import { Card, Col, Row, Spin, Modal, Select, Input, Button, Table, Tabs, Pagination, Menu, Form, Dropdown, Radio, Space, message, TimePicker, DatePicker } from 'antd';
import { _get, _put, _post } from "../../Service/apiClient";

import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    TeamOutlined,
    MailOutlined,
    AppstoreOutlined, MoneyCollectOutlined, ApartmentOutlined,
    CommentOutlined, CheckCircleOutlined, CloseCircleOutlined, TableOutlined,
    AppstoreAddOutlined,
    EllipsisOutlined,
    PhoneOutlined,
    IdcardOutlined,
    PlusCircleFilled,
    SearchOutlined,
    MoreOutlined
} from "@ant-design/icons";
import moment from "moment";
import AddCustomer from './AddCustomer';
import AddDeal from './AddDeal';
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;
const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [nameSearchQuery1, setNameSearchQuery1] = useState("");
    const [nameSearchQuery2, setNameSearchQuery2] = useState("");
    const [nameSearchQuery4, setNameSearchQuery4] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState("");
    const [CustomerNames, setCustomerNames] = useState([]);
    const [AgentNames, setAgentNames] = useState([]);
    const [PropertyNames, setPropertyNames] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [view, setView] = useState('card');
    const [activities, setActivites] = useState([]);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);
    const [isAddModalOPen, setIsAddModalOpen] = useState(false);
    const [deals1, setDeals1] = useState([]);
    const [pageSize] = useState(4);
    const [selectedProperty, setSelectedProperty] = useState([]);
    const [customerExists, setCustomerExists] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [district, setDistrict] = useState('');
    const [properties, setProperties] = useState([]);
    const [role, setRole] = useState(null);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
    };
    const [expandedComment, setExpandedComment] = useState(null); // To track which comment is expanded

    const handleToggle = (id) => {
        setExpandedComment(expandedComment === id ? null : id); // Toggle the comment visibility
    };
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    };
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const response = await _get('/deal/getAllProperties');
                console.log(response);
                const data = response.data.data || [];
                console.log(data);
                setProperties(
                    data.map((agent) => ({
                        propertyId: agent.id,
                        propertyName: agent.propertyName,
                        type: agent.type,
                        agentId: agent.agentId
                    }))
                );

                setFilteredProperties(
                    data.map((agent) => ({
                        propertyId: agent.id,
                        propertyName: agent.propertyName,
                        type: agent.type,
                        agentId: agent.agentId,
                        displayName: `${agent.propertyName} - ${agent.type}`, // This is for display in the Select
                    }))
                );
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);
    const columns = [
        {
            title: "Customer Name",
            dataIndex: "customerName",
            key: "customerName",
            align:"center",
            render: (text, record) => (
                <span>
                    <UserOutlined style={{ marginRight: "8px" }} />
                    <a
                        onClick={() => handleMore(record)}
                        style={{
                            color: "#0D416B",
                            cursor: "pointer",
                        }}
                    >
                        {record.customer.firstName} {record.customer.lastName}
                    </a>
                </span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign:"center"
                },
            }),
        },

        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            align:"center",
            render: (text, record) => (
                <span>
                    <a href={`https://wa.me/${record.customer.phoneNumber}`} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                    </a>
                    {formatPhoneNumber(record.customer.phoneNumber)}

                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
            }),

        },

        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            align:"center",
            render: (text, record) => {

                console.log("Customer District:", record.customer.district);

                return (
                    <span>
                        <EnvironmentOutlined style={{ marginRight: '8px' }} />
                        {record.customer.district ? record.customer.district : "N/A"}
                    </span>
                );
            },

            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center" },
            }),

        },
        {
            title: 'Deals',
            key: 'deals',
            align:"center",
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
                    onClick={() => handleDeals(record.customer._id)}
                >
                    Deals
                </button>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center" },
            }),

        },

        {
            title: 'Actions',
            key: 'actions',
            align:"center",
            render: (text, record) => {
                const menu = (
                    <Menu>

                        <Menu.Item
                            onClick={() => handleActivities(record)}
                            style={{ backgroundColor: '#cce7ff', color: '#000' }}
                        >
                            Activities
                        </Menu.Item>

                    </Menu>
                );
                
                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button shape="circle" icon={<MoreOutlined />}  />
                    </Dropdown>
                );
            },
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
            }),

        },


    ];

    const handleCancel = () => {
        setIsActivityModalOpen(false);

        form.resetFields();
    };
    const handlePhoneNumber = async (value) => {
        try {

            const response = await _get(`/deal/checkUser/${value}`);
            console.log(response.data);
            setCustomerExists(true);
            setCustomerDetails(response.data.data);
            console.log(customerExists);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.message);
            if (error.response.data.message === "Customer not found") {
                setCustomerExists(false);
                setIsModalOpen(false);
                console.log(customerExists);
            } else {
                const errorMessage = error?.response?.data?.message || "An error occurred while fetching agents.";
                message.error(errorMessage);
            }
        }
    };
    const csrId = localStorage.getItem("userId");
    const onFinish = async (values) => {
        console.log(values);
        console.log(customerDetails);
        const properties = nameSearchQuery4.map((property) => ({
            propertyId: property.propertyId,
            propertyName: property.propertyName,
            propertyType: property.type,
            agentId: property.agentId,
        }));
        let updatedValues = {
            ...values,
            properties: properties,
            csrId: csrId,
        };
        if (customerExists && customerDetails && Object.keys(customerDetails).length > 0) {
            updatedValues = {
                ...updatedValues,
                firstName: customerDetails.firstName,
                lastName: customerDetails.lastName,
                email: customerDetails.email,
                phoneNumber: customerDetails.phoneNumber,
                pincode: customerDetails.pincode,
                state: customerDetails.state,
                country: customerDetails.country,
                district: customerDetails.district,
                mandal: customerDetails.mandal,
                village: customerDetails.village,

            };
        }
        console.log(updatedValues);

        try {
            const res = await _post(
                "/deal/createDeal",
                updatedValues,
                "Customers Added Successfully",
                "Error Adding Customers"
            );
            if (res.status === 200 || res.status === 201) {
                form.resetFields();

            }


        } catch (error) {
        }
    };
    const handleMore = (deal) => {
        console.log(deal.customer);
        setSelectedProperty(deal.customer);
        console.log(setSelectedProperty);
        setIsModalVisible(true);
    };
    const handleActivities = async () => {
        setIsActivityModalOpen(true);
        try {
            const response = await _get(`/activity/getActivities`);
            console.log(response.data.data);

            setActivites(response.data.data);


        } catch (error) {
            console.error('Error fetching deals:', error);

        }
    };

    const handleDeals = async (customerId) => {
        try {
            const response = await _get(`/deal/getCustomerDeals/${customerId}`);
            console.log(response.data);

            console.log("skhj");
            if (role === 5) {
                console.log("dsigds");
                navigate(`/dashboard/csr/deals/${customerId}`, { state: { deals: response.data } });
            } else if (role === 0) {

                navigate(`/dashboard/admin/deals/${customerId}`, { state: { deals: response.data } });
            } else if (role === 6) {
                navigate(`/dashboard/marketingagent/deals/${customerId}`, { state: { deals: response.data } });
            } else if (role === 1) {
                navigate(`/dashboard/agent/deals/${customerId}`, { state: { deals: response.data } });
            }



            setDeals1(response.data);
            setIsDealModalOpen(true);

        } catch (error) {
            console.error('Error fetching deals:', error);

        }

    }
    const Activitycolumns = [
        {
            title: 'Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text, record) => (
                <span>{moment(record.updatedAt).format('MMMM Do YYYY, h:mm a')}</span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "30%",
                },
            }),
        },
        {
            title: 'Activity By',
            dataIndex: 'activityByName',
            key: 'activityByName',
            render: (text, record) => (
                <span>{record.activityByName}</span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "22%",
                },
            }),
        },
        {
            title: 'Activity Type',
            dataIndex: 'activityType',
            key: 'activityType',
            render: (text, record) => (
                <span>{record.activityType}</span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "10%",
                },
            }),
        },
        {
            title: 'Description',
            dataIndex: 'comment',
            key: 'comment',
            render: (text, record) => (
                <div>
                    ---{" "}
                    {expandedComment === record._id
                        ? record.comment
                        : record.comment.slice(0, 20) + (record.comment.length > 20 ? '...' : '')}
                    {record.comment.length > 20 && (
                        <span
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => handleToggle(record._id)}
                        >
                            &nbsp;[{expandedComment === record._id ? 'Show Less' : 'Show More'}]
                        </span>
                    )}
                </div>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "35%",
                },
            }),
        },
    ];



    const [currentPage, setCurrentPage] = useState(1);
    const [filterDate, setFilterDate] = useState(null);
    const [filterProperty, setFilterProperty] = useState(null);

    // Memoize the paginated activities
    const currentActivities = useMemo(() => {
        return activities.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );
    }, [activities, currentPage, pageSize]);

    // Unique values for filters
    const dateOptions = useMemo(() => {
        const uniqueDates = [...new Set(
            activities.map(activity =>
                moment(activity.meetingDate).format("DD MMMM YYYY")
            )
        )];
        return uniqueDates.map(date => ({ value: date, label: date }));
    }, [activities]);

    const propertyOptions = useMemo(() => {
        const uniqueProperties = [...new Set(activities.map(activity => activity.propertyName))];
        return uniqueProperties.map(property => ({ value: property, label: property }));
    }, [activities]);
    const filteredActivities = useMemo(() => {
        let filtered = [...activities];

        // Apply date filtering
        if (filterDate) {
            const date = new Date(filterDate.value);
            const formattedFilterDate = new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }).format(date);

            filtered = filtered.filter(activity => {
                const formattedActivityDate = moment(activity.updatedAt).format("DD MMMM YYYY");
                console.log("Formatted Filter Date: ", formattedFilterDate);
                console.log("Formatted Activity UpdatedAt Date: ", formattedActivityDate);
                return formattedActivityDate === formattedFilterDate;
            });
        }

        // Apply other filters (if any)
        if (filterProperty) {
            filtered = filtered.filter(activity => activity.propertyName === filterProperty.value);
        }

        console.log("Filtered Activities: ", filtered);
        return filtered;
    }, [filterDate, filterProperty, activities]);

    const paginatedActivities = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;


        return filteredActivities.slice(startIndex, endIndex);
    }, [filteredActivities, currentPage, pageSize]);
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const data = paginatedActivities.map(activity => ({
        key: activity.id,
        updatedAt: activity.updatedAt,
        activityByName: activity.activityByName,
        activityType: activity.activityType,
        comment: activity.comment,
        _id: activity._id,  // Assuming each activity has a unique ID
    }));

    const toggleView = (viewType) => {
        setView(viewType);
    };
    useEffect(() => {
        const role = localStorage.getItem("role");
        setRole(Number(role));

        fetchDeals();
    }, [localStorage.getItem("role")]);
    const fetchDeals = async () => {
        try {
            const response = await _get('/deal/getDeals');
            console.log(response.data);
            setDeals(response.data);
            console.log(deals);
            setCustomerNames(
                [...new Set(response.data.map((customer) => `${customer.customer.firstName} ${customer.customer.lastName}`))]
            );
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deals:', error);
            setLoading(false);
        }
    };




    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedDeal(null);
        setIsActivityModalOpen(false);
        setIsAddModalOpen(false);
    };
    const filteredAgents = deals.filter((agent) => {
        console.log(agent);
        const nameSearch = nameSearchQuery ? nameSearchQuery.toLowerCase() : '';
        const nameSearch1 = nameSearchQuery1 ? nameSearchQuery1.toLowerCase() : '';
        const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : '';
        const fullName = `${agent.customer.firstName} ${agent.customer.lastName}`.toLowerCase();


        const nameMatch =
            fullName.includes(nameSearch) ||
            agent.customer.firstName.toLowerCase().includes(nameSearch) ||
            agent.customer.lastName.toLowerCase().includes(nameSearch);



        const nameMatch2 =

            agent.deal.propertyName.toLowerCase().includes(nameSearch2);


        const statusMatch =
            Number(agent.deal.interestIn) === Number(selectedStatus);

        const locationSearch = locationSearchQuery.toLowerCase();

        const locationMatch =

            (agent.customer.district?.toLowerCase().includes(locationSearch)) ||
            (agent.customer.mandal?.toLowerCase().includes(locationSearch)) ||
            (agent.customer.village?.toLowerCase().includes(locationSearch))




        if (selectedStatus === "All") {
            return nameMatch && locationMatch;
        }


        return nameMatch && locationMatch && statusMatch && nameMatch2;
    });
    const handleAddClick = async () => {
        setIsAddModalOpen(true);
    }

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
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                }}
            >


                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={5}>
                        <Select
                            showSearch
                            placeholder="Search by Customer name"

                            style={{
                                width: "100%"
                                , height: "36px"
                            }}




                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            value={nameSearchQuery || undefined}
                            onChange={(value) => {
                                if (!value) {
                                    setNameSearchQuery(null);
                                } else {
                                    setNameSearchQuery(value);
                                }
                            }}
                            onSearch={(value) => {
                                setNameSearchQuery(value);
                            }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                        >
                            {CustomerNames.map((name, index) => (
                                <Option key={index} value={name}>
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={5}>
                        <Input
                            placeholder="Search by Agent name"
                            allowClear
                            onChange={(e) => setNameSearchQuery(e.target.value)}

                            style={{
                                width: "100%"
                                , height: "36px"
                            }}




                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>



                    <Col xs={24} sm={12} md={8} lg={5}>

                        <Button onClick={handleAddClick} style={{ backgroundColor: "#0D416B", color: "white", marginLeft: "100%" }}>
                            <PlusCircleFilled /> Add Deal
                        </Button>

                    </Col>


                </Row >
            </Card>
            <Row style={{ marginTop: "20px" }}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Table
                        dataSource={filteredAgents}
                        columns={columns}
                        rowKey={(record) => record.deal._id}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: "max-content" }}
                        style={{ marginTop: "20px", position: "relative" }}
                        locale={{
                            emptyText: loading ? (
                                <div style={{ textAlign: "center", marginTop: "20px" }}>
                                    <Spin size="large" />
                                </div>
                            ) : (
                                'No Customers found'
                            ),
                        }}
                    >
                        {loading && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(255, 255, 255, 0.8)",
                                    zIndex: 1,
                                }}
                            >
                                <Spin size="large" />
                            </div>
                        )}
                    </Table>


                </Col>
            </Row>

            <Modal
                visible={isActivityModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col span={8}>
                        <DatePicker
                            showToday={true}
                            placeholder="Select Date"
                            style={{ width: '100%' }}
                            allowClear
                            onChange={(value) => {
                                console.log("Selected Date Value: ", value);
                                setFilterDate(value ? { value } : null);
                                console.log("filtered date: ", filterDate);
                            }}
  disabledDate={(current) => current && current < moment().startOf('day')}

                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            showSearch
                            placeholder="Select Property"
                            optionFilterProp="children"
                            allowClear
                            onChange={(value) => setFilterProperty(value ? { value } : null)}
                            style={{ width: '100%' }}
                        >
                            {propertyOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <div>
                        {paginatedActivities.length === 0 ? (
                            <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                No activities found on this date
                            </div>
                        ) : (
                            <Table
                                columns={Activitycolumns}
                                dataSource={data}
                                pagination={false}
                                bordered
                                style={{ width: "100%" }}
                            />
                        )}
                    </div>
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
                            total={filteredActivities.length}
                            onChange={onPageChange}
                            style={{ textAlign: "center", marginTop: "20px" }}
                        />
                    </div>

                </Row>

                {/* Pagination */}


            </Modal>
            <Modal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}

                style={{
                    marginTop: "5%"
                }}
            >
                <Card
                    title={
                        <div style={{ backgroundColor: "#0d416b", color: "white", padding: "10px" }}>
                            Customer Details
                        </div>
                    }
                    headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                    style={{
                        width: "99%",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                        {/* Customer Name */}
                        <Col span={8}>
                            <UserOutlined /> <strong>{selectedProperty.firstName} {selectedProperty.lastName}</strong>
                        </Col>
                        <Col span={8}>
                            <PhoneOutlined /> <span>{formatPhoneNumber(selectedProperty.phoneNumber)}</span>
                        </Col>
                        <Col span={8}>
                            <MailOutlined /> <span>{selectedProperty.email}</span>
                        </Col>
                    </Row>


                    <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                        {/* Address */}
                        <Col span={24}>
                            <EnvironmentOutlined /> <strong>Address:</strong>{" "}
                            <span>
                                {[
                                    selectedProperty.village,
                                    selectedProperty.mandal,
                                    selectedProperty.district,
                                    selectedProperty.state,
                                    selectedProperty.country,
                                ]
                                    .filter((part) => part) // Remove empty or null values
                                    .join(", ")}
                            </span>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        {/* Occupation */}
                        <Col span={12}>
                            <IdcardOutlined /> <strong>Occupation:</strong>{" "}
                            {selectedProperty.occupation ? selectedProperty.occupation : "N/A"}
                        </Col>
                        <Col span={12}>
                            <MoneyCollectOutlined /> <strong>Income:</strong>{" "}
                            {selectedProperty.income ? selectedProperty.income : "N/A"}
                        </Col>
                    </Row>
                </Card>


            </Modal>
            <Modal
                visible={isAddModalOPen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <AddDeal />
            </Modal>

        </>
    );
};

export default Deals;


import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Menu, Dropdown, Card, Modal, Row, Col, Pagination, Form, TimePicker, DatePicker, Input, Select, Spin } from 'antd';
import { DeleteOutlined, EllipsisOutlined, EnvironmentOutlined, MoreOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { FaWhatsapp } from 'react-icons/fa';
import ShowModal from '../Agent/ShowModal';
import { _delete, _get, _post, _put } from "../../Service/apiClient";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import moment from "moment";
import { alignProperty } from '@mui/material/styles/cssUtils';
const { Option } = Select;
const DealDetailsPage = () => {
    const location = useLocation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const deals = location.state?.deals || [];
    const [activities, setActivites] = useState([]);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(4);
    const [AgentNames, setAgentNames] = useState([]);
    const [PropertyNames, setPropertyNames] = useState([]);
    const [PropertyId, setPropertyId] = useState([]);
    const [isCommentModal, setIsCommentModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedStatus1, setSelectedStatus1] = useState("All");
    const [comments, setComments] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expandedComment, setExpandedComment] = useState(null); // To track which comment is expanded
    const [dealId, setDealId] = useState(null);
    const handleToggle = (id) => {
        console.log(id);
        setExpandedComment(expandedComment === id ? null : id);
        console.log(expandedComment);
    };
    const navigate = useNavigate();

    const [nameSearchQuery1, setNameSearchQuery1] = useState("");
    const [nameSearchQuery2, setNameSearchQuery2] = useState("");

    const [locationSearchQuery, setLocationSearchQuery] = useState("");
    const [ActivitydealId, setActivityDealId] = useState(null);
    const [ActivityagentId, setActivityAgentId] = useState(null);
    const [agentId, setAgentId] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        if (selectedProperty) {
            console.log('Selected Property:', selectedProperty);
        }
    }, [selectedProperty]);
    useEffect(() => {
        const role = localStorage.getItem("role");
        setRole(Number(role));

    }, [localStorage.getItem("role")]);
    const handleDelete = (dealId) => {
        setDealId(dealId);
        setIsDeleteModalOpen(true);
    }
    const handleBackToCustomers = () => {
        if (role === 5) {
            navigate('/dashboard/csr/deals');
        }
        else if (role === 0) {
            navigate('/dashboard/admin/deals');
        }
        else if (role === 1) {
            navigate('/dashboard/agent/deals');
        }
        else if (role === 6) {
            navigate('/dashboard/marketingagent/deals');
        }
    };
    useEffect(() => {
        // Set agent names
        setAgentNames(
            [...new Set(deals.map((agent) => `${agent.agent.firstName} ${agent.agent.lastName}`))]
        );
        deals.forEach(deal => {
            console.log(deal.deal.propertyName, deal.property.propertyId);
        });

        const names = [];
        const ids = [];

        deals.forEach(deal => {
            names.push(deal.deal.propertyName);
            ids.push(deal.property?.propertyId);
        });

        // Set both states
        setPropertyNames(names);
        setPropertyId(ids);
        console.log(PropertyNames);
        console.log(PropertyId);

    }, [deals]);

    const deleteAssignedAgent = async () => {
        const body = {
            dealId: dealId
        };
        console.log("Fcdfs");
        try {
            await _put("/admin/deleteDeal", body, "Transaction Deleted Successfully", "Error Deleting an Transaction");


            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error assigning agents:", error);
        }
    };

    const [soldStatus, setsoldStatus] = useState("Not Sold");
    const [soldCost, setSoldCost] = useState(null);
    const filteredAgents = deals.filter((agent) => {
        const nameSearch1 = nameSearchQuery1 ? nameSearchQuery1.toLowerCase() : '';
        const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : '';
        const isPropertyIdSearch = /\d/.test(nameSearch2);

        const fullName1 = agent.agent.firstName && agent.agent.lastName
            ? `${agent.agent.firstName} ${agent.agent.lastName}`.toLowerCase()
            : '';

        const nameMatch1 = fullName1.includes(nameSearch1) ||
            (agent.agent.firstName && agent.agent.firstName.toLowerCase().includes(nameSearch1)) ||
            (agent.agent.lastName && agent.agent.lastName.toLowerCase().includes(nameSearch1));


        const nameMatch2 = isPropertyIdSearch
            ? (() => {

                return agent.property.propertyId && agent.property.propertyId.toString().toLowerCase().includes(nameSearch2);
            })()
            : (() => {

                return agent.deal.propertyName && agent.deal.propertyName.toLowerCase().includes(nameSearch2);
            })();

        console.log('nameMatch2 result:', nameMatch2);

        const locationSearch = locationSearchQuery ? locationSearchQuery.toLowerCase() : ''; // Default to empty string if null or undefined

        const locationMatch = (() => {
            if (!locationSearch || locationSearch.trim() === "") {
                return true;
            }
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


        const statusMatch =
            role === 0
                ? agent.deal.sellingStatus.includes(selectedStatus)
                : role === 5
                    ? Number(agent.deal.interestIn) === Number(selectedStatus)
                    : true;
        const statusMatch1 = role === 0 && agent.deal.dealStatus.includes(selectedStatus1);

        console.log("statusMatch1", statusMatch1);
        if (selectedStatus === "All") {
            return locationMatch && nameMatch1 && nameMatch2;
        }

        return locationMatch && nameMatch1 && nameMatch2 && statusMatch;
    });
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    };


    const handleShowInterest = async (dealId) => {
        const body = {
            dealingId: dealId,
            interestedIn: "1",
        };

        try {
            await _put("deal/changeInterest", body, "Updates Successfully", "Failed to Update");
            deals = location.state?.deals || [];

        } catch (error) {
            console.error("Error assigning agents:", error);
        }
    };
    const columns = [
        {
            title: "Property Name",
            dataIndex: "propertyName",
            key: "propertyName",
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
                        {record.deal.propertyName}
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
            title: "Property Id",
            dataIndex: "propertyId",
            key: "propertyId",
            align:"center",
            render: (text, record) => {
                console.log(record); // Log the full record to the console
                return (
                    <span>
                        {record.property?.propertyId ? record.property.propertyId : "No Property ID"}
                    </span>
                );
            },

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
            title: 'Property Location',
            dataIndex: 'location',
            key: 'location',
            align:"center",
            render: (text, record) => {

                const district = (() => {
                    if (record.deal.propertyType === "Agricultural land") {
                        return record.property.address?.district; // If it's agricultural land
                    } else if (record.deal.propertyType === "Commercial") {
                        return record.property.propertyDetails?.landDetails?.address?.district; // If it's commercial land
                    } else if (record.deal.propertyType === "Layout") {
                        return record.property.layoutDetails?.address?.district; // If it's layout
                    }
                    return null;
                })();


                if (!district) {
                    return <span>No district available</span>;
                }

                return (
                    <span>
                        <EnvironmentOutlined style={{ marginRight: '8px' }} />
                        {district}
                    </span>
                );
            },

            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
            }),

        },
        {
            title: 'Agent',
            dataIndex: 'agentName',
            key: 'agentName',
            align:"center",
            render: (text, record) => (
                <span>
                    <UserOutlined style={{ marginRight: '8px' }} />
                    {record.deal.interestIn === "1"
                        ? `${record.agent.firstName} ${record.agent.lastName}`
                        : 'Not Assigned'}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center" },
            }),

        },

        {
            title: 'Agent Mobile',
            dataIndex: 'agentPhone',
            key: 'agentPhone',
            align:"center",
            render: (text, record) => (
                <span>
                    <FaWhatsapp style={{ marginRight: '8px' }} />
                    {record.deal.interestIn === "1"
                        ? `${formatPhoneNumber(record.agent.phoneNumber)}`
                        : 'Not Assigned'}
                </span>
            ),
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center" },
            }),

        },
        ...(role === 5 ? [
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                align:"center",
                render: (text, record) => {
                    const interestIn = Number(record.deal.interestIn);
                    const status = interestIn === 1 ? 'Interested' :
                        interestIn === 2 ? '' :
                            '';

                    return (
                        <span>
                            {status}
                            {(interestIn === 2 || interestIn === 0) && (
                                <button
                                    style={{
                                        padding: "3px 10px",
                                        background: "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        transition: "background 0.3s ease",
                                        marginLeft: "3%",
                                    }}
                                    onClick={() => handleShowInterest(record.deal._id)} // Use record to access the unique deal ID
                                >
                                    Shown Interest
                                </button>
                            )}

                        </span>
                    );

                },
                onHeaderCell: () => ({
                    style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center" },
                }),

            }
        ] : []),
        ...(role === 0 ? [
            {
                title: 'Deal Status',
                dataIndex: 'dealStatus',
                key: 'dealStatus',
                align:"center",
                render: (text, record) => (
                    <span>
                        {record.deal.dealStatus ? record.deal.dealStatus === "closed" ? "Closed" : "Open" : "N/A"}
                    </span>
                ),
                onHeaderCell: () => ({
                    style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
                }),

            },
            {
                title: 'Selling Status',
                dataIndex: 'sellingStatus',
                key: 'sellingStatus',
                align:"center",
                render: (text, record) => (
                    <span>
                        {record.deal.sellingStatus ? record.deal.sellingStatus === "unSold" ? "Unsold" : "Sold" : "N/A"}
                    </span>
                ),
                onHeaderCell: () => ({
                    style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
                }),

            },
            {
                title: 'Sold Cost',
                dataIndex: 'amount',
                key: 'amount',
                align:"center",
                render: (text, record) => (
                    <span>
                        {record.deal.amount ? record.deal.amount : "N/A"}
                    </span>
                ),
                onHeaderCell: () => ({
                    style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center" },
                }),

            }
        ] : []),
        {
            title: 'Actions',
            key: 'actions',
            align:"center",
            render: (text, deal) => {
                const menu = (
                    <Menu>
                        <Menu.Item
                            onClick={() => handleAddActivityModal(deal.deal._id, deal.agent._id)}
                            style={{ backgroundColor: '#cce7ff', color: '#000' }}
                        >
                            Add Activity
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => handleActivities(deal)}
                            style={{ backgroundColor: '#cce7ff', color: '#000' }}
                        >
                            View Activities
                        </Menu.Item>

                        <Menu.Item
                            onClick={() => handleMore(deal)}
                            style={{ backgroundColor: '#e0e0e0', color: '#000' }}
                        >
                            Property Details
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button shape="circle" icon={<MoreOutlined />} />
                        </Dropdown>
                        {role === 0 && (
                            <Button
                                icon={<DeleteOutlined />}
                                type="link"
                                danger
                                onClick={() => handleDelete(deal.deal._id)}
                            />)}
                    </div>

                );
            },
            onHeaderCell: () => ({
                style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",textAlign:"center"},
            }),

        },
    ];
    const handleAddActivityModal = (dealId, agentId) => {
        setIsAddActivityModalOpen(true);
        setDealId(dealId);
        setAgentId(agentId);
    }
    const handleComments = (comments) => {
        setComments(comments);
        setIsCommentModal(true);
    }
    const handleCancel = () => {
        setIsModalVisible(false);
        setIsDeleteModalOpen(false);
        setSelectedProperty(null);
        setIsAddActivityModalOpen(false);
    };

    const handleMore = (deal) => {
        console.log(deal.property);
        console.log(selectedProperty);
        setSelectedProperty(deal.property);
        setIsModalVisible(true);
    };
    const handleCloseModal = () => {

        setIsCommentModal(false);
        setIsActivityModalOpen(false);
        setActivites(null);

    };
    const [filterDate, setFilterDate] = useState(null);


    // Memoize the paginated activities






    // Filtered Activities
    const filteredActivities = useMemo(() => {
        if (!activities) return []; // Return an empty array if activities is null

        let filtered = [...activities];
        console.log(activities);

        if (filterDate) {
            const date = new Date(filterDate.value);

            const formattedFilterDate = new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(date);

            filtered = filtered.filter(activity => {
                const formattedActivityDate = moment(activity.updatedAt).format("DD MMMM YYYY");
                console.log("Formatted Filter Date: ", formattedFilterDate);
                console.log("Formatted Activity Meeting Date: ", formattedActivityDate);
                return formattedActivityDate === formattedFilterDate;
            });
        }
        console.log(filtered);

        return filtered;
    }, [filterDate, activities]);

    const paginatedActivities = useMemo(() => {
        if (!activities) return []; // Return an empty array if activities is null

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return filteredActivities.slice(startIndex, endIndex);
    }, [filteredActivities, currentPage, pageSize]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };


    const handleActivities = async (deal) => {

        setDealId(deal.deal._id);
        setAgentId(deal.agent._id);
        setIsActivityModalOpen(true);
        try {
            const response = await _get(`/activity/activities?agentId=${deal.agent._id}&dealingId=${deal.deal._id}`);
            console.log(response.data.data);
            setActivites(response.data.data);

        } catch (error) {
            console.error('Error fetching deals:', error);

        }
    };
    const csrId = localStorage.getItem("userId");
    console.log(csrId);
    const handleAddActivity = async () => {
        try {

            const values = await form.validateFields();
            console.log(values.comment);

            const formattedData = {
                csrId: csrId,
                dealingId: dealId,
                agentId: agentId,
                location: values.location,
                startDate: values.date.clone().hour(values.startTime.hour()).minute(values.startTime.minute()).toISOString(),
                endDate: values.date.clone().hour(values.endTime.hour()).minute(values.endTime.minute()).toISOString(),
                comment: values.comment,
                activityType: values.activityType,
            };


            const res = await _post(
                "/activity/add",
                formattedData,
                " Activity Added",
                "Error Adding Activity"
            );

            if (res.status === 200 || res.status === 201) {
                setIsActivityModalOpen(false);

                form.resetFields();
            }
        } catch (error) {
            console.error("Error in scheduling meeting:", error);
        }
    };
    if (loading) {
        return <Spin
            size="large" style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // This centers the loader
            }} />;
    }

    const Activitycolumns = [
        {
            title: "Date",
            dataIndex: "updatedAt",
            key: "updatedAt",
            align: "center",

            render: (text, record) => (
                <span style={{ color: "#0d416b" }}>
                    {moment(record.updatedAt).format("MMMM Do YYYY, h:mm a")}
                </span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "30%",
                    textAlign:"center"
                },
            }),
        },
        {
            title: "Activity By",
            dataIndex: "activityByName",
            key: "activityByName",
            align: "center",

            render: (text, record) => (
                <span style={{ color: "#0d416b" }}>{record.activityByName}</span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "23%",
                    textAlign:"center"
                },
            }),
        },

        {
            title: "Type",
            dataIndex: "activityType",
            key: "activityType",
            align: "center",

            render: (text, record) => (
                <span style={{ color: "#0d416b" }}>{record.activityType}</span>
            ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "20%",
                    textAlign:"center"
                },
            }),
        },

        {
            title: "Description",
            dataIndex: "comment",
            key: "comment",
            align: "center",

            render: (text, record) => {
                console.log(record); // Log the record here
                return (
                    <div>
                        {" "}
                        {expandedComment === record.key
                            ? record.comment
                            : record.comment.slice(0, 20) +
                            (record.comment.length > 20 ? "..." : "")}
                        {record.comment.length > 20 && (
                            <span
                                style={{ cursor: "pointer", color: "blue" }}
                                onClick={() => handleToggle(record.key)} // Use record.key to toggle
                            >
                                &nbsp;[
                                {expandedComment === record.key ? "Show Less" : "Show More"}]
                            </span>
                        )}
                    </div>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign:"center"
                },
            }),
        },
    ];

    const dataSource = paginatedActivities.map((activity) => ({
        key: activity._id,
        updatedAt: activity.updatedAt,
        activityByName: activity.activityByName,
        activityType: activity.activityType,
        comment: activity.comment,
    }));

    return (
        <div>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                }}
            >

                <Row style={{ margin: "0px 0px 10px 0px" }} gutter={16}>
                    <Col xs={24} sm={12} md={1}>
                        <button
                            onClick={handleBackToCustomers}
                            style={{
                                padding: '6px 10px',
                                backgroundColor: '#0D416B',
                                color: 'white',
                                // marginLeft: "-50%",
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            <FaArrowLeft />
                        </button>
                    </Col>
                    <Col xs={24} sm={12} md={5}>
                        <Select
                            showSearch
                            placeholder="Search by Agent name"
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}

                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            value={nameSearchQuery1 || undefined}
                            allowClear
                            onChange={(value) => {
                                console.log(value);
                                setNameSearchQuery1(value || null);
                            }}
                            onSearch={(value) => {
                                setNameSearchQuery1(value || null);
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
                    <Col xs={24} sm={12} md={5}>
                        <Input
                            placeholder="Search by Property Name or ID"
                            allowClear
                            onChange={(e) => setNameSearchQuery2(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}

                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>



                    <Col xs={24} sm={12} md={5}>
                        <Input
                            placeholder="Search by Location"
                            value={locationSearchQuery}
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}

                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>

                    {role === 0 && (
                        <>
                            <Col xs={24} sm={12} md={3}>
                                {console.log("dhhdd")}
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
                                    <Option value="unSold">UnSold</Option>

                                </Select>
                            </Col>

                        </>
                    )}
                    {role === 5 && (
                        <Col xs={24} sm={12} md={3}>
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
                                <Option value="1">Interested</Option>
                                <Option value="2">Not Interested</Option>
                                <Option value="0">Pending</Option>
                            </Select>
                        </Col>)}
                </Row>

            </Card>
            <Row style={{ marginTop: "20px" }}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Table
                        dataSource={filteredAgents}
                        columns={columns}
                        rowKey={(deal) => deal.id}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: "max-content" }}
                        style={{ marginTop: "20px" }}
                        locale={{
                            emptyText: 'No Deals found',
                        }}
                    />

                </Col>
            </Row>

            {console.log(selectedProperty)}
            {selectedProperty && (
                <ShowModal
                    selectedProperty={selectedProperty}
                    isModalVisible={isModalVisible}
                    handleCancel={handleCancel}
                />
            )}
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
                        <Button
                            onClick={() => handleAddActivityModal(dealId, agentId)}
                            style={{ backgroundColor: '#0D416B', color: 'white', fontWeight: "bold" }}
                        >
                            Add Activity
                        </Button>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Table
                        columns={Activitycolumns}
                        dataSource={dataSource}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: 'red' }}>
                                    No activities found on this date
                                </div>
                            ),
                        }}
                        style={{ width: '100%' }}
                    />
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
                visible={isCommentModal}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <Card
                    title={<div style={{ backgroundColor: "#0d416b", color: "white", padding: "10px" }}>Comments</div>}
                    headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                >
                    {comments}
                </Card>
            </Modal>
            <Modal
                open={isAddActivityModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical">
                    {/* Date Selection */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[{ required: true, message: 'Please select a date!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Select Date"   disabledDate={(current) => current && current < moment().startOf('day')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="location"
                                label="Location"
                                rules={[{ required: true, message: 'Please input this Field!' }]}
                            >
                                <Input.TextArea rows={2} placeholder="Enter Meeting Location " />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Time Selection */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="startTime"
                                label="Start Time"
                                rules={[{ required: true, message: 'Please select the start time!' }]}
                            >
                                <TimePicker style={{ width: '100%' }} use12Hours format="h:mm a" placeholder="Select Start Time" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="endTime"
                                label="End Time"
                                rules={[
                                    { required: true, message: 'Please select the end time!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const startTime = getFieldValue('startTime');
                                            if (startTime && value && value.isBefore(startTime)) {
                                                return Promise.reject('End time must be after start time!');
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <TimePicker style={{ width: '100%' }} use12Hours format="h:mm a" placeholder="Select End Time" />
                            </Form.Item>
                        </Col>


                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="activityType"
                                label="Activity Type"
                                rules={[
                                    { required: true, message: 'Please select an activity type!' },
                                ]}
                            >
                                <Select placeholder="Select Activity Type" style={{ width: '100%' }}>
                                    <Option value="On Call">On Call</Option>
                                    <Option value="oneToOne">One to One</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="comment"
                                label="Activity Description"
                                rules={[
                                    { required: true, message: 'Please provide feedback!' },
                                    { min: 10, message: 'Feedback must be at least 10 characters!' },
                                    { max: 200, message: 'Feedback cannot exceed 200 characters!' },
                                ]}
                            >
                                <Input.TextArea
                                    rows={2}
                                    maxLength={300}
                                    placeholder="Enter feedback"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Buttons */}
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button onClick={handleCancel} style={{ marginRight: '8px' }}>Cancel</Button>
                        <Button type="primary" onClick={handleAddActivity}>Add</Button>
                    </div>
                </Form>

            </Modal>
            <Modal
                title={<div style={{ textAlign: "center" }}>Are You Sure You want to delete this Transaction</div>}
                open={isDeleteModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={1000}
                style={{
                    marginLeft: "17%",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Button type="primary" style={{ marginRight: "10px" }} onClick={deleteAssignedAgent}>Yes</Button>
                    <Button type="primary">No</Button>
                </div>
            </Modal>
        </div>

    );
};

export default DealDetailsPage;


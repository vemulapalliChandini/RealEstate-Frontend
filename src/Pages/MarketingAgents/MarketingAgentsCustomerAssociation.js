import React, { useState, useEffect, useMemo } from "react";

import { useParams, useLocation, useNavigate } from "react-router-dom";

import {
    Table,
    Input,
    Empty,
    Spin,
    Row,
    Col,
    Card,
    Dropdown,
    Menu,
    Button,
    Modal,
    Form,
    DatePicker,
    TimePicker,
    Select,
    Pagination,
} from "antd";

import { _get, _post } from "../../Service/apiClient";

import { FaWhatsapp } from "react-icons/fa";

import {
    DeleteOutlined,
    EllipsisOutlined,
    MoreOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ShowModal from "../Agent/ShowModal";
import { FaArrowLeft } from "react-icons/fa";
import { border } from "@chakra-ui/react";
const { Option } = Select;

const MarketingAgentsCustomerAssociation = () => {
    const { customerId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchProperty, setSearchProperty] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [searchAgent, setSearchAgent] = useState("");

    const [modalVisible, setModalVisible] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(4);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [dealId, setDealId] = useState(null);
    const [agentId, setAgentId] = useState(null);
    const [activities, setActivites] = useState(null);

    const customerName = location.state?.customerName;
    const [form] = Form.useForm();
    const [expandedComment, setExpandedComment] = useState(null); // To track which comment is expanded

    const handleToggle = (id) => {
        console.log(id);
        setExpandedComment(expandedComment === id ? null : id);
        console.log(expandedComment);
    };
    const csrId = localStorage.getItem("userId");
    const handleAddActivity = async () => {
        try {
            const values = await form.validateFields();
            console.log(values.comment);

            const formattedData = {
                csrId: csrId,
                dealingId: dealId,
                agentId: agentId,
                location: values.location,
                startDate: values.date
                    .clone()
                    .hour(values.startTime.hour())
                    .minute(values.startTime.minute())
                    .toISOString(),
                endDate: values.date
                    .clone()
                    .hour(values.endTime.hour())
                    .minute(values.endTime.minute())
                    .toISOString(),
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
                handleActivities();
                form.resetFields();
            }
        } catch (error) {
            console.error("Error in scheduling meeting:", error);
        }
    };
    const filteredActivities = useMemo(() => {
        // Ensure `activities` is an array, or default to an empty array
        const safeActivities = activities || [];
        console.log("Original Activities:", safeActivities);

        let filtered = [...safeActivities];

        if (filterDate) {
            const date = new Date(filterDate.value);

            const formattedFilterDate = new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }).format(date);

            filtered = filtered.filter((activity) => {
                const formattedActivityDate = moment(activity.updatedAt).format(
                    "DD MMMM YYYY"
                );
                console.log("Formatted Filter Date:", formattedFilterDate);
                console.log("Formatted Activity Meeting Date:", formattedActivityDate);
                return formattedActivityDate === formattedFilterDate;
            });
        }

        console.log("Filtered Activities:", filtered);
        return filtered;
    }, [activities, filterDate]);
    const [activityType, setActivityType] = useState("");

    // Handler function to update state on selection
    const handleActivityTypeChange = (value) => {
        setActivityType(value);
        console.log("Selected Activity Type:", value); // Optional: For debugging
    };
    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = number.toString().replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return number;
    };

    const paginatedActivities = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return filteredActivities.slice(startIndex, endIndex);
    }, [filteredActivities, currentPage, pageSize]);
    const handleCancel = () => {
        setIsModalVisible(false);

        setIsAddActivityModalOpen(false);
    };
    const dataSource = paginatedActivities.map((activity) => ({
        key: activity._id,
        updatedAt: activity.updatedAt,
        activityByName: activity.activityByName,
        activityType: activity.activityType,
        comment: activity.comment,
    }));

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
                },
            }),
        },
    ];

    const handleCloseModal = () => {
        setIsActivityModalOpen(false);
    };
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchCustomerProperties = async () => {
            try {
                const response = await _get(`/deal/getCustomerDeals/${customerId}`);
                const dealsData = response.data;

                console.log(dealsData);
                setDeals(dealsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer deals:", error);
                setLoading(false);
            }
        };

        fetchCustomerProperties();
    }, [customerId]);

    if (loading) {
        return (
            <Spin size="large" style={{ display: "block", margin: "20% auto" }} />
        );
    }
    const handleBackToCustomers = () => {
        navigate("/dashboard/marketingagent/marketingagentsdeals");
    };
    const handleAddActivityModal = (dealId, agentId) => {
        console.log("dhdhd");
        console.log(dealId);
        console.log(agentId);
        setIsAddActivityModalOpen(true);
        setDealId(dealId);
        setAgentId(agentId);
    };
    const handleActivities = async (deal) => {
        setDealId(deal.deal._id);
        setAgentId(deal.agent._id);
        setIsActivityModalOpen(true);

        try {
            const response = await _get(
                `/activity/activities?agentId=${deal.agent._id}&dealingId=${deal.deal._id}`
            );
            console.log(response.data.data);

            setActivites(response.data.data);
        } catch (error) {
            console.error("Error fetching deals:", error);
        }
    };

    const columns = [
        {
            title: "Property Name",
            dataIndex: "propertyName",
            key: "propertyName",
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },

        {
            title: "Property Type",
            dataIndex: "propertyType",
            key: "propertyType",
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },

        {
            title: "Agent Name",
            dataIndex: "agentName",
            key: "agentName",
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                },
            }),
        },

        {
            title: "Agent Info",
            dataIndex: "agentInfo",
            key: "agentInfo",
            align: "center",
            render: (text) => (
                <>
                    <FaWhatsapp style={{ marginRight: "5px", color: "#0d416b" }} />
                    {formatPhoneNumber(text)}
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
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item
                            onClick={() => {
                                console.log("Record for Add Activity:", record);
                                handleAddActivityModal(record.deal._id, record.agent._id);
                            }}
                            style={{ backgroundColor: "#cce7ff", color: "#000" }}
                        >
                            Add Activity
                        </Menu.Item>

                        <Menu.Item
                            onClick={() => handleActivities(record)}
                            style={{ backgroundColor: "#cce7ff", color: "#000" }}
                        >
                            View Activities
                        </Menu.Item>

                        <Menu.Item
                            onClick={() => handleMoreClick(record)}
                            style={{ backgroundColor: "#e0e0e0", color: "#000" }}
                        >
                            Property Details
                        </Menu.Item>
                    </Menu>
                );

                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Button shape="circle" icon={<MoreOutlined />} />
                        </Dropdown>
                    </div>
                );
            },
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

    const tableData = deals.map((deal) => {
        const {
            deal: { propertyName, propertyType },
            agent: { firstName, lastName, phoneNumber },
        } = deal;
        return {
            key: deal.deal._id,
            properties: deal.property,
            propertyName,
            propertyType,
            agentName: `${firstName} ${lastName}`,
            agentInfo: ` ${phoneNumber}`,
            agent: deal.agent,
            deal: deal.deal,
        };
    });

    // Filter the table data based on search inputs
    const filteredData = tableData.filter(
        (deal) =>
            deal.propertyName.toLowerCase().includes(searchProperty.toLowerCase()) &&
            (deal.agentName.toLowerCase().includes(searchAgent.toLowerCase()) ||
                deal.agentInfo.includes(searchAgent))
    );

    const handleMoreClick = (record) => {
        setSelectedCustomer(record.properties);
        setIsModalVisible(true);
    };
    const handleModalClose = () => {
        setModalVisible(false); // Close the modal
        setIsModalVisible(false);
        setSelectedDeal(null); // Reset the selected deal
    };

    return (
        <div style={{ padding: "20px" }}>
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",
                    marginBottom: "2%",
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={1} sm={1} md={1} lg={1}>
                        <button
                            onClick={handleBackToCustomers}
                            style={{
                                padding: "6px 10px",
                                backgroundColor: "#0D416B",
                                color: "white",

                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            <FaArrowLeft />
                        </button>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={5}>
                        <Input
                            placeholder=" Property Name"
                            value={searchProperty}
                            onChange={(e) => setSearchProperty(e.target.value)}
                            // style={{ width: 200, marginRight: "10px" }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <Input
                            placeholder=" Agent Name or Phone"
                            value={searchAgent}
                            onChange={(e) => setSearchAgent(e.target.value)}
                            // style={{ width: 200 }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>
                </Row>
            </Card>
            {filteredData.length === 0 ? (
                <Empty description="No results found" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={true}
                    bordered={false}
                    size="middle"
                />
            )}

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
                                rules={[{ required: true, message: "Please select a date!" }]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    placeholder="Select Date"
                                      disabledDate={(current) => current && current < moment().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="activityType"
                                label="Activity Type"
                                rules={[
                                    { required: true, message: 'Please select an activity type!' },
                                ]}
                            >
                                <Select
                                    placeholder="Select Activity Type"
                                    style={{ width: "100%" }}
                                    onChange={handleActivityTypeChange} // Set the onChange handler
                                >
                                    <Option value="On Call">On Call</Option>
                                    <Option value="One To One">One to One</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Time Selection */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="startTime"
                                label="Start Time"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select the start time!",
                                    },
                                ]}
                            >
                                <TimePicker
                                    style={{ width: "100%" }}
                                    use12Hours
                                    format="h:mm a"
                                    placeholder="Select Start Time"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="endTime"
                                label="End Time"
                                rules={[
                                    { required: true, message: "Please select the end time!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const startTime = getFieldValue("startTime");
                                            if (startTime && value && value.isBefore(startTime)) {
                                                return Promise.reject(
                                                    "End time must be after start time!"
                                                );
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <TimePicker
                                    style={{ width: "100%" }}
                                    use12Hours
                                    format="h:mm a"
                                    placeholder="Select End Time"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        {activityType === "One To One" && (
                            <Col span={12}>
                                <Form.Item
                                    name="location"
                                    label="Location"
                                    rules={[
                                        { required: true, message: "Please input this Field!" },
                                    ]}
                                >
                                    <Input.TextArea
                                        rows={2}
                                        placeholder="Enter Meeting Location "
                                    />
                                </Form.Item>
                            </Col>
                        )}

                        <Col span={activityType === "One To One" ? 12 : 24}>
                            <Form.Item
                                name="comment"
                                label="Activity Description"
                                rules={[
                                    { required: true, message: "Please provide feedback!" },
                                    {
                                        min: 10,
                                        message: "Feedback must be at least 10 characters!",
                                    },
                                    {
                                        max: 200,
                                        message: "Feedback cannot exceed 200 characters!",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={2}
                                    maxLength={300}
                                    placeholder="Enter feedback"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Buttons */}
                    <div style={{ textAlign: "right", marginTop: "20px" }}>
                        <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleAddActivity}>
                            Add
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/*
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


</Modal>   */}

            {/*  new code from here... */}

            <Modal
                visible={isActivityModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                {/* Customer Name */}

                {/*  new code from here.. */}
                <Row
                    gutter={16}
                    style={{
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {/* Customer Name */}
                    <Col span={8}>
                        <div
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#0D416B",
                            }}
                        >
                            {customerName}
                        </div>
                    </Col>

                    {/* Date Picker */}
                    <Col span={8} style={{ textAlign: "center" }}>
                        <DatePicker
                            showToday={true}
                            placeholder="Search by Date"
                            style={{ width: "80%", marginLeft: "-40%" }}
                            allowClear
                            onChange={(value) => {
                                setFilterDate(value ? { value } : null);
                            }}
                              disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </Col>

                    {/* Add Activity Button */}
                    <Col span={8} style={{ textAlign: "right", marginLeft: "-2%" }}>
                        <Button
                            onClick={() => handleAddActivityModal(dealId, agentId)}
                            style={{
                                backgroundColor: "#0D416B",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Add Activity
                        </Button>
                    </Col>
                </Row>

                {/* Activities Table */}
                <Row>
                    <Table
                        columns={Activitycolumns}
                        dataSource={dataSource} // This should contain all records initially
                        pagination={false}
                        bordered={false}
                        locale={{
                            emptyText: (
                                <div
                                    style={{
                                        textAlign: "center",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: "red",
                                    }}
                                >
                                    No activities found
                                </div>
                            ),
                        }}
                        style={{ width: "100%" }}
                    />
                </Row>

                {/* Pagination */}
                <Row>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                        }}
                    >
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredActivities.length}
                            onChange={onPageChange}
                        />
                    </div>
                </Row>
            </Modal>

            {/*  end */}

            {isModalVisible && (
                <ShowModal
                    selectedProperty={selectedCustomer}
                    isModalVisible={isModalVisible}
                    handleCancel={handleModalClose}
                />
            )}
            {modalVisible && selectedDeal && (
                <ShowModal
                    selectedProperty={selectedDeal}
                    isModalVisible={modalVisible}
                    handleCancel={handleModalClose}
                />
            )}
        </div>
    );
};

export default MarketingAgentsCustomerAssociation;
import React, { useState, useEffect } from "react";
import {
    Tabs,
    Card,
    List,
    Badge,
    Input,
    Empty,
    Row,
    Col,
    Skeleton,
    Pagination,
   
    Modal,
    Form,
    Calendar,
    Button,
    TimePicker,
    Tooltip,

} from "antd";
import moment from "moment";
import { _get, _post } from "../../Service/apiClient";
import { useNavigate } from "react-router-dom";
import {
    SearchOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    UserOutlined,
    PlusCircleFilled
} from "@ant-design/icons";

import { FaHandsHelping } from "react-icons/fa";

import ShowModal from "../Agent/ShowModal";
import { toast } from "react-toastify";
import AddDeal from "../CSR/AddDeal";

const { TabPane } = Tabs;

const AgentAssociation = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(null);
   
    //    new code from here..
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [details] = useState([]);

    const [form] = Form.useForm();
    const [isDateSelect, setIsDateSelect] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [calendarForm] = Form.useForm();

    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [meetingDetails] = useState({
        dealingId: '',
        agentId: '',

        propertyId: '',
        propertyName: '',
        customerMail: '',
        customerId: ''
    });

    const itemsPerPage = 8;

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


    const dateCellRender = (value) => {
        // Return an empty render, so only the dates are shown in the calendar.
        return null;
    };


    const handleCloseModal = () => {

        setIsAddModalOpen(false);
    };
    const handleCalendarOk = async () => {
        try {
            await calendarForm.validateFields();
            const formattedStartTime = `${selectedDate} ${calendarForm
                .getFieldValue("meetingStartTime")
                .format("HH:mm:ss")}`;
            const formattedEndTime = `${selectedDate} ${calendarForm
                .getFieldValue("meetingEndTime")
                .format("HH:mm:ss")}`;
            const dataToSend = {
                ...calendarForm.getFieldsValue(),
                meetingStartTime: formattedStartTime,
                meetingEndTime: formattedEndTime,
                ...meetingDetails,
                ScheduleBy: meetingDetails.agentId,
            };

            console.log("Scheduled Meeting:", dataToSend);

            const res = await _post(
                "/meeting/schedule",
                dataToSend,
                "Meeting Scheduled Successfully",
                "Error Scheduling Meeting"
            );

            if (res.status === 200 || res.status === 201) {
                calendarForm.resetFields();
                setIsCalendarModalOpen(false);
                setIsDateSelect(false);
            }
        } catch (error) {
            console.error("Error in scheduling meeting:", error);
        }
    };

    const handleCancel = () => {
        // setIsActivityModalOpen(false);
        setIsCalendarModalOpen(false);
        setIsDateSelect(false);
        // setIsDealModalOpen(false);
        setSelectedDate(null);
        // setIsPropertyView(false);
        form.resetFields();
    };

    const handleStartTimeChange = (time) => {
        if (time) {

            const combinedDateTime = moment(`${selectedDate} ${time.format("HH:mm")}`).toISOString();


            console.log("Combined DateTime:", combinedDateTime);


            setSelectedStartTime(combinedDateTime);
        }
    };

    const handleEndTimeChange = async (time) => {
        if (time) {
            const combinedDateTime = moment(`${selectedDate} ${time.format("HH:mm")}`).toISOString();

            console.log("Combined End DateTime:", combinedDateTime);


            // setSelectedEndTime(combinedDateTime);

            console.log(meetingDetails.customerMail);
            const requestData = {
                customerMail: details.email,
                meetingStartTime: selectedStartTime,
                meetingEndTime: combinedDateTime,
            };

            try {

                const res = await _get(
                    `/meeting/checkAvailability?customerMail=${meetingDetails.customerMail}&meetingStartTime=${selectedStartTime}&meetingEndTime=${combinedDateTime}`,
                    requestData,
                );
                if (res.data.available === false) {
                    toast.error("Customer not available at this time Please select another time")
                }
            } catch (error) {
                console.log(error.response.data.error);
                toast.error(error.response.data.error);
            }
        }
    };


   

    const onDateSelect = (date) => {
        setSelectedDate(date.format("YYYY-MM-DD"));
        setIsCalendarModalOpen(false);
        setIsDateSelect(true);
    };


    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await _get('/meeting/getAllScheduledMeetings');
                console.log(response.data.data);
                // setMeetings(response.data.data);
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };
        fetchMeetings();
    }, []);



    const handleModalClose = () => {
        setIsModalVisible(false);
    };


    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const customerResponse = await _get("/deal/getDeals");
                const customersData = customerResponse.data;
                console.log(customersData);
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
                                    agentId: deal.agent._id,
                                    customerId: deal.customer._id,
                                    propertyName: deal.deal.propertyName,
                                    propertyId: deal.deal.propertyId
                                },
                            ];
                        })
                    ).values(),
                ].filter((customer) => customer !== null);

                setCustomers(customerList);
                console.log(customerList);
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
    const handleAddClick = async () => {
        setIsAddModalOpen(true);
    }
    return (
        <div>
            <Tabs defaultActiveKey="1" onChange={() => setSearchText("")}>
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
                        <Row>
                            <Col xs={24} sm={12} md={8} lg={5}>
                                <Input
                                    placeholder="Search by customer name"
                                    value={searchText}
                                    onChange={(e) => handleSearch(e, "1")}
                                    style={{
                                        width: "100%",
                                        height: "36px",
                                    }}
                                    prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                                />

                            </Col>
                            <Col xs={24} sm={12} md={8} lg={5} style={{ marginLeft: "20%" }}>

                                <Button onClick={handleAddClick} style={{ backgroundColor: "#0D416B", color: "white", marginLeft: "100%" }}>
                                    <PlusCircleFilled /> Add Deal
                                </Button>

                            </Col>
                        </Row>
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
                            grid={{ gutter: 16, xs: 1, // 1 column on extra small screens
                                sm: 2, // 2 columns on small screens
                                md: 3, // 3 columns on medium screens
                                lg: 3, // 4 columns on large screens
                                xl: 4 }}
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
                                            <Tooltip title={`${customer.totalDeals} deals for ${customer.name}`}>
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
                                                    <FaHandsHelping
                                                        style={{
                                                            marginTop: "-10%",
                                                            marginLeft: "-80%",
                                                            color: "#050505",
                                                        }}
                                                    />
                                                </Badge>
                                            </Tooltip>
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
                                        {/*  for spacing we need to consider */}
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
                                                        fontSize: "14px",
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

                                        <Row style={{ marginLeft: "30%" }}>
                                            <Col span={12}>
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
                                                       
                                                        cursor: "pointer",
                                                        fontWeight: "bold",
                                                        padding: "5px 10px",
                                                        borderRadius: "12px",
                                                    }}
                                                >
                                                    View More
                                                </button>
                                            </Col>

                                        </Row>
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
                        <Row>
                            <Col xs={24} sm={12} md={8} lg={5}>
                                <Input
                                    placeholder="Search by property name"
                                    value={searchText}
                                    onChange={(e) => handleSearch(e, "2")}
                                    style={{
                                        width: "100%",
                                        height: "36px",
                                    }}
                                    prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={5} style={{ marginLeft: "20%" }}>

                                <Button onClick={handleAddClick} style={{ backgroundColor: "#0D416B", color: "white", marginLeft: "100%" }}>
                                    <PlusCircleFilled /> Add Deal
                                </Button>

                            </Col>
                        </Row>
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
                            grid={{ gutter: 16, xs: 1, // 1 column on extra small screens
                                sm: 2, // 2 columns on small screens
                                md: 3, // 3 columns on medium screens
                                lg: 3, // 4 columns on large screens
                                xl: 4  }}
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
                                                   <Tooltip title={`${property.customerCount} deals for ${property.name}`}>
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
                                                </Tooltip>
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
                                                        fontSize: "14px",
                                                        color: "#4A5568",
                                                        marginLeft: "-20%",
                                                        fontWeight: "bold",

                                                        listStyleType: "none",
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
                                                    // backgroundColor: "#007bff",
                                                    backgroundColor: "#0d416b",
                                                    color: "#fff",
                                                    border: "none",
                                                 

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
            </Tabs>
            {
                isModalVisible && (
                    <ShowModal
                        selectedProperty={selectedCustomer}
                        isModalVisible={isModalVisible}
                        handleCancel={handleModalClose}
                    />
                )
            }
            <Modal
                open={isCalendarModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
                style={{ marginRight: "25%" }}
            >
                <Row gutter={16}>
                    <Col span={23}>
                        <Card
                            title="Schedule"
                            headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                            style={{ width: "99%" }}
                        >
                            <Calendar
                                fullscreen={false}
                                onSelect={onDateSelect}
                                cellRender={dateCellRender}
                                style={{ marginBottom: "20px" }}
                                // Disable previous dates
                                disabledDate={(current) => {
                                    return current && current < new Date().setHours(0, 0, 0, 0);
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Modal>
            <Modal
                open={isDateSelect}
                onCancel={handleCancel}
                footer={null}
                width={600}
                style={{ marginRight: "25%" }}
            >
                <Form form={calendarForm} layout="vertical">
                    <p>{`Selected Date: ${selectedDate}`}</p>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="meetingStartTime"
                                label="Start Time"
                                rules={[{ required: true, message: "Please select a time!" }]}
                            >
                                <TimePicker
                                    placeholder="Select Start Time"
                                    use12Hours
                                    format="h:mm a"
                                    style={{ width: "100%" }}
                                    onChange={handleStartTimeChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="meetingEndTime"
                                label="Meeting End Time"
                                rules={[{ required: true, message: "Please select a time!" }]}
                            >
                                <TimePicker
                                    placeholder="Select End Time"
                                    use12Hours
                                    format="h:mm a"
                                    style={{ width: "100%" }}
                                    onChange={handleEndTimeChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="location"
                                label="Location"
                                rules={[
                                    { required: true, message: "Please input this Field!" },
                                ]}
                            >
                                <Input.TextArea rows={2} placeholder="Enter Location to meet" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="meetingInfo"
                                label="Meeting Info"
                                rules={[
                                    { required: true, message: "Please Input This Field!" },
                                ]}
                            >
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Give some details about the meeting"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: "right" }}>
                        <Button
                            onClick={() => {
                                setIsDateSelect(false);
                                setIsCalendarModalOpen(true);
                                setSelectedDate(null);
                            }}
                            style={{ marginRight: "8px" }}
                        >
                            Back
                        </Button>
                        <Button type="primary" onClick={handleCalendarOk}>
                            Schedule
                        </Button>
                    </div>
                </Form>
            </Modal>
            <Modal
                visible={isAddModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <AddDeal />
            </Modal>
        </div >
    );
};

export default AgentAssociation;
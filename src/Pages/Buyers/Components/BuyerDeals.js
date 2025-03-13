import React, { useState, useEffect } from "react";
import { Calendar, Modal, Form, Input, Button, Row, Col, TimePicker, Card, Radio, Pagination, DatePicker, Select, Skeleton } from "antd";
import moment from "moment";
import { FaWhatsapp } from "react-icons/fa";
import { _get, _post, _put } from "../../../Service/apiClient";
import { UserOutlined, HomeOutlined, EnvironmentOutlined, MailOutlined, AppstoreOutlined, MoneyCollectOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";

import "react-toastify/dist/ReactToastify.css"; // Import the styles
import ShowModal from "../../Agent/ShowModal";
import AddDeal from "../../CSR/AddDeal";
const { Option } = Select;
const BuyerDeals = ({ data }) => {
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [form] = Form.useForm();
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [details] = useState([]);
    const [dealId,] = useState(null);
    const [agentId] = useState(null);
    const [isSold, setIsSold] = useState(false);
    const [isDateSelect, setIsDateSelect] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
      const [activities] = useState([]);
    const [isPropertyView, setIsPropertyView] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState([]);
    const [isViewActivities, setIsViewActivities] = useState(null);
    const [nameSearchQuery, setNameSearchQuery] = useState("");
    const [nameSearchQuery2, setNameSearchQuery2] = useState("");
    const [locationSearchQuery, setLocationSearchQuery] = useState("");

    const [AgentNames, setAgentNames] = useState([]);
    const [PropertyNames, setPropertyNames] = useState([]);
    const [role, setRole] = useState(parseInt(localStorage.getItem("role")));
    const [isAddModalOPen, setIsAddModalOpen] = useState(false);
    const [activityType, setActivityType] = useState("");

    // Handler function to update state on selection
    const handleActivityTypeChange = (value) => {
        setActivityType(value);
        console.log("Selected Activity Type:", value); // Optional: For debugging
    };
   
    useEffect(() => {
        const role = localStorage.getItem("role");
        setRole(Number(role));


    }, [localStorage.getItem("role")]);
   
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2);

    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);

    
    useEffect(() => {
        console.log("role:", role);
      
        const fetchDeals = async () => {
          setLoading(true);
          try {
            const apiEndpoint = role === 3 ? "/deal/getAgentDealings" : "/deal/getAgentDealings2/buyer";
            console.log("API Endpoint:", apiEndpoint);
      
            const response = await _get(apiEndpoint);
            console.log("Response Data:", response.data.data);
      
            setDeals(response.data.data);
            setAgentNames(
              [...new Set(response.data.data.map((agent) => `${agent.agentData.profilePicture} ${agent.agentData.firstName} ${agent.agentData.lastName}`))]
            );
      
            setPropertyNames(
              [...new Set(response.data.data.map((agent) => agent.dealDetails.propertyName))]
            );
      
          } catch (error) {
            console.error("Error fetching deals:", error);
          } finally {
            setLoading(false);
          }
        };
      
        if (role !== undefined) {
          fetchDeals();
        }
      }, [role]);
      

    const filteredAgents = deals.filter((agent) => {

        const nameSearch = nameSearchQuery ? nameSearchQuery.toLowerCase() : '';

        const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : '';
        const fullName = `${agent.agentData.firstName} ${agent.agentData.lastName}`.toLowerCase();
        // const fullName1 = `${agent.agent.firstName} ${agent.agent.lastName}`.toLowerCase();

        const nameMatch =
            fullName.includes(nameSearch) ||
            agent.agentData.firstName.toLowerCase().includes(nameSearch) ||
            agent.agentData.lastName.toLowerCase().includes(nameSearch);
        console.log(nameMatch);
        // const nameMatch1 =
        //   fullName1.includes(nameSearch1) ||
        //   agent.agent.firstName.toLowerCase().includes(nameSearch1) ||
        //   agent.agent.lastName.toLowerCase().includes(nameSearch1);

        const nameMatch2 =

            agent.dealDetails.propertyName.toLowerCase().includes(nameSearch2);

        const locationSearch = locationSearchQuery.toLowerCase();

        const locationMatch = (() => {
            if (agent.property?.propertyType === "Agricultural land" || agent.property?.propertyType === "Residential") {

                return (
                    (agent.property.address?.district && agent.property.address?.district.toLowerCase().includes(locationSearch)) ||
                    (agent.property.address?.mandal && agent.property.address?.mandal.toLowerCase().includes(locationSearch)) ||
                    (agent.property.address?.village && agent.property.address?.village.toLowerCase().includes(locationSearch))
                );
            } else if (agent.property?.propertyType === "Commercial") {
                return (

                    (agent.property?.landDetails?.address?.district && agent.property.landDetails.address.district.toLowerCase().includes(locationSearch)) ||
                    (agent.property?.landDetails?.address?.mandal && agent.property.landDetails.address.mandal.toLowerCase().includes(locationSearch)) ||
                    (agent.property?.landDetails?.address?.village && agent.property.landDetails.address.village.toLowerCase().includes(locationSearch))
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





        return nameMatch && locationMatch && nameMatch2;
    });

    const [currentPage1, setCurrentPage1] = useState(1);
    const cardsPerPage = 6;

    const indexOfLastCard = currentPage1 * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;

    const currentCards = filteredAgents.slice(indexOfFirstCard, indexOfLastCard);

    const handlePageChange = (page) => {
        setCurrentPage1(page);
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
    };
    const currentActivities = activities.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );




    const handleRadioChange = (e) => {
        setIsSold(e.target.value === 'sold');
    };

    const onDateSelect = (date) => {
        setSelectedDate(date.format("YYYY-MM-DD"));
        setIsCalendarModalOpen(false);
        setIsDateSelect(true);

    };
    const handleViewMore = (dealId) => {
        console.log(dealId);
        const deal = deals.find(d => d._id === dealId);
        setSelectedDeal(deal);
        setIsModalVisible(true);
    };


    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setIsModalVisible(false);
        setSelectedDeal(null);
        setIsViewActivities(false);
    };
    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);

    };

    const handleDealOk = async () => {
        try {

            const values = await form.validateFields();
            console.log('Deal Closed:', values);

            const dataToSend = {

                ...values,
                dealId: dealId
            };


            const res = await _put(
                "/deal/closeDeal",
                dataToSend,
                "Deal Closed",
                "Error Closing the Deal"
            );


            if (res.status === 200 || res.status === 201) {
                setIsDealModalOpen(false);
                setIsClosed((prevState) => ({
                    ...prevState,
                    [dealId]: true, // Mark the specific deal as closed
                }));
                form.resetFields();
            }
        } catch (error) {
            console.error("Error in scheduling meeting:", error);
        }
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
                startDate: values.date.clone().hour(values.startTime.hour()).minute(values.startTime.minute()).toISOString(),
                endDate: values.date.clone().hour(values.endTime.hour()).minute(values.endTime.minute()).toISOString(),
                comment: values.comment,
            };


            const res = await _post(
                "/activity/add",
                formattedData,
                "Add Activity",
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




    const handleCancel = () => {
        setIsActivityModalOpen(false);
        setIsCalendarModalOpen(false);
        setIsDateSelect(false);
        setIsDealModalOpen(false);
        setSelectedDate(null);
        setIsPropertyView(false);
        form.resetFields();
    };


    const handlePropertyView = () => {
        setIsPropertyView(true);



        setSelectedProperty(selectedDeal.property);

    };


    const dateCellRender = (value) => {
        // Return an empty render, so only the dates are shown in the calendar.
        return null;
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




    return (
        <>
           
            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",
                    marginBottom: "2%",

                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6} lg={5}>
                        <Select
                            showSearch
                            placeholder="Search by Agent name"
                            style={{
                                width: "100%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            value={nameSearchQuery || undefined}
                            allowClear
                            onChange={(value) => {
                                console.log(value);
                                setNameSearchQuery(value || null);
                            }}
                            onSearch={(value) => {
                                setNameSearchQuery(value || null);
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

                    <Col xs={24} sm={12} md={6} lg={5}>
                        <Select
                            showSearch
                            placeholder="Search by Property name"
                            style={{
                                width: "100%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            value={nameSearchQuery2 || undefined}
                            allowClear
                            onChange={(value) => {
                                console.log(value);
                                setNameSearchQuery2(value || null);
                            }}
                            onSearch={(value) => {
                                setNameSearchQuery2(value || null);
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
                    <Col xs={24} sm={12} md={5} lg={5}>
                        <Input
                            placeholder="Search by Location"
                            value={locationSearchQuery}
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
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
                                        marginTop: "2%",
                                        backgroundColor: "#f0f0f0",

                                    }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <Row gutter={[16, 16]}>
                {currentCards.map((response, index) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={index}>
                        <Card
                            style={{
                                boxShadow:
                                    "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                                borderRadius: "8px",
                                transition: "box-shadow 0.3s ease",
                                backgroundColor: "rgba(159, 159, 167, 0.23)",
                                width: "80%",
                            }}
                            headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                            title={
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    {response.property?.propertyId && (
                                        <span style={{ marginLeft: "8px" }}>
                                            {response.dealDetails.propertyName}(
                                            {response.property.propertyId})
                                        </span>
                                    )}
                                </div>
                            }
                            bordered={false}
                            hoverable
                            extra={
                                <>
                                    <button
                                        style={{
                                            padding: "1px 10px",
                                            background: "#0d416b",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "background 0.3s ease",
                                            border: "1px solid white",
                                        }}
                                        onClick={() => handleViewMore(response._id)}
                                    >
                                        View More
                                    </button>
                                </>
                            }
                        >
                            {/* Card Content */}
                            {/* <h3>
<UserOutlined style={{ marginRight: "8px" }} />
{response.agentData.firstName} {response.agentData.lastName}
</h3> */}

                            <h3
                                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                            >
                                <img
                                    src={response.agentData.profilePicture}
                                    // alt={`${response.agentData.firstName} ${response.agentData.lastName}`}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "2px solid #ccc",
                                    }}
                                />
                                <span style={{ display: "flex", alignItems: "center" }}>
                                    {/* < style={{ marginRight: "8px" }} /> */}
                                    {response.agentData.firstName} {response.agentData.lastName}
                                </span>
                            </h3>
                            <p>
                                <FaWhatsapp style={{ marginRight: "8px" }} />
                                {formatPhoneNumber(response.agentData.phoneNumber)}
                            </p>
                            <p>
                                <HomeOutlined style={{ marginRight: "8px" }} />
                                {response.property?.propertyType}
                            </p>
                            <p>
                                <EnvironmentOutlined style={{ marginRight: "8px" }} />
                                {(() => {
                                    if (
                                        response.property?.propertyType === "Agricultural land" ||
                                        response.property?.propertyType === "Residential"
                                    ) {
                                        const district =
                                            response.property.address?.district || "No district";
                                        const state =
                                            response.property.address?.state || "No state";
                                        const mandal =
                                            response.property.address?.mandal || "No mandal";
                                        const village =
                                            response.property.address?.village || "No village";
                                        const pincode =
                                            response.property.address?.pinCode || "No pincode";

                                        return `${district}, ${state}, ${mandal}, ${village}, ${pincode}`;
                                    } else if (
                                        response.property?.propertyType === "Commercial"
                                    ) {
                                        const district =
                                            response.property.landDetails?.address?.district ||
                                            "No district";
                                        const state =
                                            response.property.landDetails?.address?.state ||
                                            "No state";
                                        const mandal =
                                            response.property.landDetails?.address?.mandal ||
                                            "No mandal";
                                        const village =
                                            response.property.landDetails?.address?.village ||
                                            "No village";
                                        const pincode =
                                            response.property.landDetails?.address?.pincode ||
                                            "No pincode";

                                        return `${district}, ${state}, ${mandal}, ${village}, ${pincode}`;
                                    } else if (response.property?.propertyType === "Layout") {
                                        const district =
                                            response.property.layoutDetails?.address?.district ||
                                            "No district";
                                        const state =
                                            response.property.layoutDetails?.address?.state ||
                                            "No state";
                                        const mandal =
                                            response.property.layoutDetails?.address?.mandal ||
                                            "No mandal";
                                        const village =
                                            response.property.layoutDetails?.address?.village ||
                                            "No village";
                                        const pincode =
                                            response.property.layoutDetails?.address?.pinCode ||
                                            "No Pincode";

                                        return `${district}, ${state}, ${mandal}, ${village}, ${pincode}`;
                                    } else {
                                        return "Property type not available";
                                    }
                                })()}
                            </p>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div style={{ float: "right", marginTop: "2%" }}>
                <Pagination
                    current={currentPage1}
                    total={filteredAgents.length}
                    pageSize={cardsPerPage}
                    onChange={handlePageChange}
                />
            </div>
            <Modal
                visible={isAddModalOPen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <AddDeal />
            </Modal>
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

            {/* Deal Modal */}
            <Modal open={isDealModalOpen} onCancel={handleCancel} footer={null}>
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="sellingStatus"
                                label="Sold"
                                rules={[
                                    { required: true, message: "Please select if sold!" },
                                ]}
                            >
                                <Radio.Group onChange={handleRadioChange}>
                                    <Radio value="sold">Yes</Radio>
                                    <Radio value="unSold">No</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        {isSold && (
                            <Col span={12}>
                                <Form.Item
                                    name="amount"
                                    label="Sold Cost"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input the sale cost!",
                                        },
                                        {
                                            pattern: /^[0-9]*$/,
                                            message: "Please enter only numbers!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter sold cost" />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Add Comments"
                                name="comments"
                                labelCol={{ span: 8.5 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Input.TextArea
                                    className="input-box"
                                    placeholder=" "
                                    maxLength={300}
                                    rows={2}
                                    cols={10}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleDealOk}>
                            Close Deal
                        </Button>
                    </div>
                </Form>
            </Modal>
            <Modal open={isActivityModalOpen} onCancel={handleCancel} footer={null}>
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
                                    {
                                        required: true,
                                        message: "Please select an activity type!",
                                    },
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
                                label="Feedback"
                                rules={[
                                    { required: true, message: "Please provide feedback!" },
                                    {
                                        max: 300,
                                        message: "Feedback cannot exceed 300 characters!",
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
            <Modal
                open={detailsModalOpen}
                onCancel={handleDetailsModalClose}
                footer={null}
            >
                <div>
                    <h3>{details.meetingTitle}</h3>
                    <p>
                        <strong>Property Name:</strong> {details.propertyName}
                    </p>
                    <p>
                        <strong>Meeting Info:</strong> {details.meetingInfo}
                    </p>
                    <p>
                        <strong>Start Time:</strong>{" "}
                        {new Date(details.meetingStartTime).toLocaleString()}
                    </p>
                    <p>
                        <strong>End Time:</strong>{" "}
                        {new Date(details.meetingEndTime).toLocaleString()}
                    </p>
                    <p>
                        <strong>Scheduled By:</strong> {details.scheduledBy}
                    </p>
                </div>

                <button
                    style={{
                        marginRight: "2%",
                        backgroundColor: "#0D416B",
                        color: "white",
                    }}
                >
                    Edit
                </button>
                <button
                    style={{ backgroundColor: "#0D416B", color: "white" }}
                    onClick={handleDetailsModalClose}
                >
                    Cancel
                </button>
            </Modal>
            <Modal
                visible={isViewActivities}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <Row gutter={16}>
                    {currentActivities.map((activity) => (
                        <Col span={24} key={activity.id}>
                            <div>
                                <span
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color: "#0d416b",
                                    }}
                                >
                                    •{" "}
                                </span>
                                <strong style={{ color: "#0d416b" }}>
                                    {moment(activity.meetingDate).format(
                                        "MMMM Do YYYY, h:mm a"
                                    )}
                                </strong>
                            </div>

                            <hr style={{ border: "1px solid #0d416b", margin: "10px 0" }} />

                            <div style={{ marginTop: "10px" }}>
                                <p>--- {activity.comment}</p>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Pagination */}
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={activities.length}
                    onChange={onPageChange}
                    style={{ textAlign: "center", marginTop: "20px", float: "right" }}
                />
            </Modal>
            <Modal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                {selectedDeal && (
                    <Row gutter={[16, 16]} style={{ marginTop: "2%" }}>
                        <Col span={12}>
                            <Card
                                title="Agent Details"
                                style={{
                                    boxShadow:
                                        "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "8px",
                                    transition: "box-shadow 0.3s ease",
                                }}
                                headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                                bordered
                            >
                                <p>
                                    <strong>
                                        <UserOutlined /> Name:
                                    </strong>{" "}
                                    {selectedDeal.agentData.firstName}{" "}
                                    {selectedDeal.agentData.lastName}
                                </p>
                                <p>
                                    <strong>
                                        <FaWhatsapp /> Phone:
                                    </strong>{" "}
                                    {formatPhoneNumber(selectedDeal.agentData.phoneNumber)}
                                </p>
                                <p>
                                    <strong>
                                        <MailOutlined /> Email:
                                    </strong>{" "}
                                    {selectedDeal.agentData.email}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> State:
                                    </strong>{" "}
                                    {selectedDeal.agentData.state}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> Country:
                                    </strong>{" "}
                                    {selectedDeal.agentData.country}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> district:
                                    </strong>{" "}
                                    {selectedDeal.agentData.district}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> Mandal:
                                    </strong>{" "}
                                    {selectedDeal.agentData.mandal}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> City:
                                    </strong>{" "}
                                    {selectedDeal.agentData.city}
                                </p>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                style={{
                                    boxShadow:
                                        "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "8px",
                                    transition: "box-shadow 0.3s ease",
                                }}
                                headStyle={{ backgroundColor: "#0d416b", color: "white" }}
                                title="Property Details"
                                bordered
                            >
                                <p>
                                    <strong>
                                        <AppstoreOutlined /> Size:
                                    </strong>
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails?.size
                                        : selectedDeal.property.landDetails?.size}
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails?.sizeUnit
                                        : selectedDeal.property.landDetails?.sizeUnit}
                                </p>

                                <p>
                                    <strong>
                                        <MoneyCollectOutlined /> Price:
                                    </strong>
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails?.totalPrice
                                        : selectedDeal.property.landDetails?.totalPrice}
                                </p>

                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> State:
                                    </strong>
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails.address.state
                                        : selectedDeal.property.address.state}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> Country:
                                    </strong>{" "}
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails.address.country
                                        : selectedDeal.property.address.country}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> district:
                                    </strong>{" "}
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails.address.district
                                        : selectedDeal.property.address.district}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> Mandal:
                                    </strong>{" "}
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails.address.mandal
                                        : selectedDeal.property.address.mandal}
                                </p>
                                <p>
                                    <strong>
                                        <EnvironmentOutlined /> City:
                                    </strong>{" "}
                                    {selectedDeal.propertyType === "Layout"
                                        ? selectedDeal.property.layoutDetails.address.village
                                        : selectedDeal.property.address.village}
                                </p>
                                <Button onClick={handlePropertyView}>
                                    <EyeOutlined /> View More
                                </Button>
                            </Card>
                        </Col>
                        {selectedProperty && (
                            <ShowModal
                                selectedProperty={selectedProperty}
                                isModalVisible={isPropertyView}
                                handleCancel={handleCancel}
                            />
                        )}
                    </Row>
                )}
            </Modal>
        </>
    );
};

export default BuyerDeals;
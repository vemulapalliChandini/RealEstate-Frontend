import React, { useState, useEffect, useMemo } from "react";
import { Table, Spin, Input, Empty, Card, Row, Col,Menu,Popover,Dropdown,Button, Form,Radio,Modal,DatePicker,TimePicker,Select,Pagination, Calendar} from "antd";
import { _get,_put,_post} from "../../Service/apiClient";
import { useParams, useNavigate } from "react-router-dom";

import { FaWhatsapp } from "react-icons/fa";

import { SearchOutlined,MoreOutlined } from "@ant-design/icons";
import { FaArrowLeft } from "react-icons/fa";
import moment from "moment";
import { toast } from "react-toastify";
const {Option}=Select;
const AgentPropertyAssociation = () => {
    const { propertyId } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCustomer, setSearchCustomer] = useState(""); // State for customer search
    const [searchAgent, setSearchAgent] = useState(""); // State for agent search
    const[isDealModalOpen,setIsDealModalOpen]=useState(false);
    const[isClosed,setIsClosed]=useState(false);
    const[dealId,setDealId]=useState(null);
    const[isAddActivityModalOpen,setIsAddActivityModalOpen]=useState(false);
    const[agentId,setAgentId]=useState(null);
    const[isActivityModalOpen,setIsActivityModalOpen]=useState(false);
    const[activities,setActivites]=useState(null);
    const[isSold,setIsSold]=useState(false);
    const[activityType,setActivityType]=useState(null);
    const[currentPage,setCurrentPage]=useState(1);
    const[filterDate,setFilterDate]=useState(null);
        const [calendarForm] = Form.useForm();
    const[expandedComment,setExpandedComment]=useState(null);
     const [isDateSelect, setIsDateSelect] = useState(false);
        const [selectedDate, setSelectedDate] = useState(null);
        const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
        const [meetingDetails, setMeetingDetails] = useState({
            dealingId: '',
            agentId: '',
    
            propertyId: '',
            propertyName: '',
            customerMail: '',
            customerId: ''
        });
        const [details] = useState([]);
       const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [pageSize]=useState(4);
    const handleBackToCustomers = () => {
        navigate("/dashboard/agent/agentdeals");
    };
    const handleActivityTypeChange = (value) => {
        setActivityType(value);
        console.log("Selected Activity Type:", value); // Optional: For debugging
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
    const handleToggle = (id) => {
        console.log(id);
        setExpandedComment(expandedComment === id ? null : id);
        console.log(expandedComment);
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
    const paginatedActivities = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return filteredActivities.slice(startIndex, endIndex);
    }, [filteredActivities, currentPage, pageSize]);
    const dataSource = paginatedActivities.map((activity) => ({
        key: activity._id,
        updatedAt: activity.updatedAt,
        activityByName: activity.activityByName,
        activityType: activity.activityType,
        comment: activity.comment,
    }));
    const onScheduleMeet = (
        dealingId,
        agentId,
        propertyId,
        propertyName,
        customerMail,
        customerId
    ) => {
      
        setIsCalendarModalOpen(true);
        // setSelectedCardId(dealingId);
        setMeetingDetails({
            dealingId,
            agentId,

            propertyId,
            propertyName,
            customerMail,
            customerId,
        });
        
       
    };
       
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
        const onDateSelect = (date) => {
            setSelectedDate(date.format("YYYY-MM-DD"));
            setIsCalendarModalOpen(false);
            setIsDateSelect(true);
        };
        const dateCellRender = (value) => {
            // Return an empty render, so only the dates are shown in the calendar.
            return null;
        };
    
    const handleDealOk = async () => {
            try {
    
                const values = await form.validateFields();
                console.log('Deal Closed:', values);
    
                const dataToSend = {
    
                    ...values,
                    dealId: dealId
                };
    
                console.log("close deal");
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
                console.error("Error in Closing Deal:", error);
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
    useEffect(() => {
        console.log("djdhjehdijehde");
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
    const handleRadioChange = (e) => {
        setIsSold(e.target.value === 'sold');
    };
    const handleCloseModal = () => {
        setIsActivityModalOpen(false);
    };
    const onPageChange = (page) => {
        setCurrentPage(page);
    };
    const handleCancel = () => {
        // setIsModalVisible(false);
        setIsDealModalOpen(false);
        setIsAddActivityModalOpen(false);
        setIsCalendarModalOpen(false);
        setIsDateSelect(false);
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
        setDealId(deal.dealId);
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
   
    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = number.toString().replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return number;
    };
    const StartDeal = async (dealId) => {
        const body = {
          dealId: dealId,
          dealStatus: "In Progress"
        }
        try {
          const res = await _put(
            "/deal/startDeal", body,
            "Deal Started",
            "Error Starting Deal"
          );
          console.log(res); // You can log or handle the response as needed
         
        } catch (error) {
          console.error(error); // Handle any errors here
        }
      };
      const onDealClose = (dealId) => {
        setIsDealModalOpen(true);
        setDealId(dealId);
        console.log(dealId);
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
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => {
                const menu = (
                    <Menu>
                      {/* Add Activity */}
                      <Menu.Item
                        onClick={() => {
                          console.log("Record for Add Activity:", record);
                          handleAddActivityModal(record.dealId, record.agent._id);
                        }}
                        style={{ backgroundColor: "#cce7ff", color: "#000" }}
                      >
                        Add Activity
                      </Menu.Item>
                  
                      {/* View Activities */}
                      <Menu.Item
                        onClick={() => handleActivities(record)}
                        style={{ backgroundColor: "#cce7ff", color: "#000" }}
                      >
                        View Activities
                      </Menu.Item>
                  
                      {/* Close Deal */}
                      <Menu.Item
                        onClick={() => {
                          if (record.dealStatus !== "closed" && !isClosed[record._id]) {
                            onDealClose(record._id);
                          }
                        }}
                        
                        disabled={record.dealStatus === "closed" || isClosed[record._id]}
                        style={{ backgroundColor: "#e0e0e0", color: "#000" }}
                      >
                        {record.dealStatus === "closed" ? (
                          <span>Closed</span>
                        ) : (
                          "Close Deal"
                        )}
                      </Menu.Item>
                  
                      {/* Start Deal */}
                      <Menu.Item
                        onClick={(e) => e.stopPropagation()} // Prevent menu click from propagating
                        style={{
                          padding: "0",
                          margin: "0",
                        }}
                      >
                        {console.log(record)}
                        <Popover
                          content={
                            <div style={{ textAlign: "center" }}>
                              <p>Are you sure you want to start the deal?</p>
                              <Button
                                type="primary"
                                onClick={() => StartDeal(record.deal._id)} // Confirmation button logic
                                style={{ marginRight: "8px" }}
                                disabled={record.dealStatus === "inProgress"} // Disable if already in progress
                              >
                                Yes
                              </Button>
                              <Button type="default">No</Button> {/* No button to close the popover */}
                            </div>
                          }
                          trigger="click"
                          placement="topRight"
                        >
                          <div
                            style={{
                              padding: "1px 10px",
                              backgroundColor: "#e0e0e0",
                              color: "black",
                              border: "none",
                              borderRadius: "5px",
                              cursor: record.dealStatus === "inProgress" ? "not-allowed" : "pointer",
                              transition: "background 0.3s ease",
                              opacity: record.dealStatus === "inProgress" ? 0.6 : 1,
                              textAlign: "center",
                            }}
                          >
                            {record.dealStatus === "inProgress" ? "Deal Started" : "Start Deal"}
                          </div>
                        </Popover>
                      </Menu.Item>
                  {console.log("sche",record)}
                      {/* Schedule Meet */}
                      <Menu.Item
                        onClick={() => {
                          onScheduleMeet(
                            record.dealId,
                            record.agent._id,
                            record.propertyId,
                            record.propertyName,
                            record.customer.email,
                            record.customer._id,
                          );
                        }}
                        style={{
                          backgroundColor: "#cce7ff",
                          color: "#000",
                        }}
                      >
                        Schedule Meet
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
                    <Col>
                        {/* Search input for customer */}
                        <Input
                            placeholder="Search by customer name or Phone"
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                            style={{
                                width: "100%",
                                height: "36px",
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
                                width: "100%",
                                height: "36px",
                            }}
                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                        />
                    </Col>
                </Row>
            </Card>
            <Modal
                open={isDealModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="sellingStatus"
                                label="Sold"
                                rules={[{ required: true, message: 'Please select if sold!' }]}
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
                                        { required: true, message: 'Please input the sale cost!' },
                                        { pattern: /^[0-9]*$/, message: 'Please enter only numbers!' }
                                    ]}
                                >
                                    <Input placeholder="Enter sold cost" />
                                </Form.Item>
                            </Col>)}
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
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={handleCancel} style={{ marginRight: '8px' }}>Cancel</Button>
                        <Button type="primary" onClick={handleDealOk}>Close Deal</Button>
                    </div>
                </Form>
            </Modal>
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
            <Modal
                open={isCalendarModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={800}
                style={{ marginRight: "25%" }}
            >
                {console.log("gdhdhd")}
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

export default AgentPropertyAssociation;
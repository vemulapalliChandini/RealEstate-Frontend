import React, { useState, useEffect, useMemo } from "react";
import { Badge, Calendar, Modal, Form, Input, Spin, Button, Row, Col, Table, TimePicker, Card, Radio, Empty, Pagination, DatePicker, Menu, message, Select, Skeleton, Popover } from "antd";
import moment from "moment";
import { FaWhatsapp } from "react-icons/fa";
import { _get, _post, _put } from "../../Service/apiClient";
import { UserOutlined, HomeOutlined, EnvironmentOutlined, MailOutlined, AppstoreOutlined, MoneyCollectOutlined, PlusCircleFilled, EyeOutlined, CommentOutlined, SearchOutlined } from "@ant-design/icons";
import "./ScheduleMeet.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles
import ShowModal from "./ShowModal";

import AddDeal from "../CSR/AddDeal";
const { Option } = Select;
const { Search } = Input;
const MyDeals = ({ data }) => {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);  // To store the selected card ID
  const [form] = Form.useForm();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [viewOption, setViewOption] = useState('today');
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [dealId, setDealId] = useState(null);
  const [agentId, setAgentId] = useState(null);
  const [isSold, setIsSold] = useState(false);
  const [isDateSelect, setIsDateSelect] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [activities, setActivites] = useState([]);
  const [isPropertyView, setIsPropertyView] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [isViewActivities, setIsViewActivities] = useState(null);
  const [nameSearchQuery, setNameSearchQuery] = useState("");

  const [nameSearchQuery2, setNameSearchQuery2] = useState("");

  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [CustomerNames, setCustomerNames] = useState([]);

  const [PropertyNames, setPropertyNames] = useState([]);
  const [role, setRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOPen, setIsAddModalOpen] = useState(false);
  const [expandedComment, setExpandedComment] = useState(null); // To track which comment is expanded

  const handleToggle = (id) => {
    console.log(id);
    setExpandedComment(expandedComment === id ? null : id);
    console.log(expandedComment);
  };
  const toggleMenu = (id) => {
    setActiveCardId((prevId) => (prevId === id ? null : id));
  };
  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(Number(role));


  }, [localStorage.getItem("role")]);
  const handleAddClick = async () => {
    setIsAddModalOpen(true);
  }
  const [filterDate, setFilterDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2);
  const [meetingDetails, setMeetingDetails] = useState({
    dealingId: '',
    agentId: '',

    propertyId: '',
    propertyName: '',
    customerMail: '',
    customerId: ''
  });
  const [calendarForm] = Form.useForm();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  useEffect(() => {

    fetchDeals();
  }, []);
  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await _get("/deal/getAgentDealings");
      console.log(response.data.data);
      setDeals(response.data.data);
      console.log(deals);
      setLoading(false);
      setCustomerNames(
        [...new Set(response.data.data.map((customer) => `${customer.customer.firstName} ${customer.customer.lastName}`))]
      );


      setPropertyNames(
        [...new Set(response.data.data.map((agent) => `${agent.propertyName}`))]

      )

      setLoading(false);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setLoading(false);
    }
  };
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];
    console.log(activities);

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
        console.log("Formatted Activity Meeting Date: ", formattedActivityDate);
        return formattedActivityDate === formattedFilterDate;
      });
    }
    console.log(filtered);


    return filtered;
  }, [filterDate, activities]);
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;


    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage, pageSize]);


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

  const dataSource = paginatedActivities.map((activity) => ({
    key: activity._id,
    updatedAt: activity.updatedAt,
    activityByName: activity.activityByName,
    activityType: activity.activityType,
    comment: activity.comment,
  }));
  const filteredAgents = deals.filter((agent) => {

    const nameSearch = nameSearchQuery ? nameSearchQuery.toLowerCase() : '';

    const nameSearch2 = nameSearchQuery2 ? nameSearchQuery2.toLowerCase() : "";
    const isPropertyIdSearch = /\d/.test(nameSearch2);
    const fullName = `${agent.customer.firstName} ${agent.customer.lastName}`.toLowerCase();
    // const fullName1 = `${agent.agent.firstName} ${agent.agent.lastName}`.toLowerCase();

    const nameMatch =
      fullName.includes(nameSearch) ||
      agent.customer.firstName.toLowerCase().includes(nameSearch) ||
      agent.customer.lastName.toLowerCase().includes(nameSearch);

    // const nameMatch1 =
    //   fullName1.includes(nameSearch1) ||
    //   agent.agent.firstName.toLowerCase().includes(nameSearch1) ||
    //   agent.agent.lastName.toLowerCase().includes(nameSearch1);
    console.log(nameSearch2);
    // console.log(agent.property.propertyId);
    const nameMatch2 = isPropertyIdSearch
      ? agent.property?.propertyId && agent.property?.propertyId.toString().toLowerCase().includes(nameSearch2)
      : agent.propertyName && agent.propertyName.toLowerCase().includes(nameSearch2);

    // Return true only if all filters match.

    const statusMatch =
      agent.dealStatus.toLowerCase().includes(selectedStatus);
    console.log(nameMatch2);
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
      return nameMatch && locationMatch && nameMatch2;
    }


    return nameMatch && locationMatch && statusMatch && (nameSearchQuery2 === "" || nameMatch2);

  });
  console.log(filteredAgents);
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


      setSelectedEndTime(combinedDateTime);

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
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await _get('/meeting/getAllScheduledMeetings');
        console.log(response.data.data);
        setMeetings(response.data.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };
    fetchMeetings();
  }, []);
  const handleRadioChange = (e) => {
    setIsSold(e.target.value === 'sold');
  };

  const onScheduleMeet = (dealingId, agentId, propertyId, propertyName, customerMail, customerId) => {
    setSelectedCardId(dealingId);
    setMeetingDetails({
      dealingId,
      agentId,

      propertyId,
      propertyName,
      customerMail,
      customerId
    });
    setIsCalendarModalOpen(true);
  };
  const onDateSelect = (date) => {
    setSelectedDate(date.format("YYYY-MM-DD"));
    setIsCalendarModalOpen(false);
    setIsDateSelect(true);

  };
  const handleViewMore = (dealId) => {

    const deal = deals.find(d => d._id === dealId);
    console.log(deal);
    setSelectedDeal(deal);
    setIsModalVisible(true);
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
      fetchDeals();
    } catch (error) {
      console.error(error); // Handle any errors here
    }
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
        fetchDeals();
        form.resetFields();
      }
    } catch (error) {
      console.error("Error in Closing Deal:", error);
    }
  };
  const [activityType, setActivityType] = useState("");

  // Handler function to update state on selection
  const handleActivityTypeChange = (value) => {
    setActivityType(value);
    console.log("Selected Activity Type:", value); // Optional: For debugging
  };
  const handleAddActivityModal = (dealId, agentId) => {
    setIsActivityModalOpen(true);
    setDealId(dealId);
    setAgentId(agentId);
  }
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
        activityType: values.activityType,
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


  const handleCalendarOk = async () => {
    try {
      await calendarForm.validateFields();
      const formattedStartTime = `${selectedDate} ${calendarForm.getFieldValue("meetingStartTime").format('HH:mm:ss')}`;
      const formattedEndTime = `${selectedDate} ${calendarForm.getFieldValue("meetingEndTime").format('HH:mm:ss')}`;
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
    setIsActivityModalOpen(false);
    setIsCalendarModalOpen(false);
    setIsDateSelect(false);
    setIsDealModalOpen(false);
    setSelectedDate(null);
    setIsPropertyView(false);
    form.resetFields();
  };

  const onDealClose = (dealId) => {
    setIsDealModalOpen(true);
    setDealId(dealId);
    console.log(dealId);
  };
  const AddActivity = (dealId, agentId) => {
    setIsActivityModalOpen(true);
    setDealId(dealId);
    setAgentId(agentId);
  };
  const handlePropertyView = () => {
    console.log(selectedDeal);

    setIsPropertyView(true);
    setSelectedProperty(selectedDeal.property);

  };

  const handleDateClick = (value, item) => {
    const selectedDate = new Date(value);
    const dateMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meetingStartTime);
      return meetingDate.toDateString() === selectedDate.toDateString();
    });

    setSelectedDateMeetings(dateMeetings);
    setSelectedDate(selectedDate.toDateString());
    setSelectedMeeting(dateMeetings.length > 0 ? dateMeetings[0] : null);
    setIsCalendarModalOpen(true);
    setIsDateSelect(false);
    setDetailsModalOpen(true);
    setDetails(item);
  };

  const dateCellRender = (value) => {
    // Return an empty render, so only the dates are shown in the calendar.
    return null;
  };


  const handleActivities = async (deal) => {
    setIsViewActivities(true);
    try {
      const response = await _get(`/activity/activities?agentId=${deal.agentId}&dealingId=${deal._id}`);
      console.log(response.data.data);

      setActivites(response.data.data);



    } catch (error) {
      console.error('Error fetching deals:', error);

    }
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
      <ToastContainer />
      <Card
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

          borderRadius: "8px",
          marginBottom: "2%"
        }}
      >

        <Row gutter={[16, 16]} >
          <Col xs={24} sm={12} md={6} lg={5}>

            <Select
              showSearch
              placeholder="Search by Customer name"
              style={{
                width: "100%"
                , height: "36px"
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
              {CustomerNames.map((name, index) => (
                <Option key={index} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8} lg={5}>
            <Input
              placeholder="Property Name / ID"
              allowClear
              onChange={(e) => {
                console.log(e.target.value); // Logs the value entered in the input field
                setNameSearchQuery2(e.target.value); // Updates the state with the new value
              }}

              style={{
                width: "100%"
                , height: "36px"
              }}
              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
            />

          </Col>
          <Col xs={24} sm={12} md={5} lg={5}>
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

          <Col xs={24} sm={12} md={6} lg={3}>
            <Select
              placeholder="Select an option"
              style={{
                width: "100%"
                , height: "36px"
              }}
              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
              value={selectedStatus}
              onChange={(value) => {
                console.log("Selected Value:", value);
                setSelectedStatus(value);
              }}
            >
              <Option value="All">All</Option>
              <Option value="closed">Closed Deals</Option>
              <Option value="open">Open Deals</Option>

            </Select>
          </Col>

          <Col span={4}>
            {role === 5 || role === 1 && (
              <Button onClick={handleAddClick} style={{ backgroundColor: "#0D416B", color: "white", marginLeft: "40%" }}>
                <PlusCircleFilled /> Add Deal
              </Button>
            )}
          </Col>


        </Row>
      </Card>
      {loading && (
        <Row
          className="cards-container"

          gutter={[24, 24]}
        >

          {[...Array(8)].map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
              <Card className="card-item" hoverable>
                <Skeleton
                  active
                  avatar={false}
                  paragraph={{ rows: 1, width: "100%" }}
                  title={{ width: "100%" }}
                  style={{
                    height: "200px", // Set a fixed height for the square shape
                    width: "100%",   // Ensure it takes up the full width of the card
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2%",
                    backgroundColor: "#f0f0f0", // Optional: for a background color
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Row gutter={[16, 16]}>
        {currentCards.map((response, index) => (
          <Col xs={24}
            sm={12}
            md={8}
            lg={8} key={index}>
            <Card
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                transition: "box-shadow 0.3s ease",
                backgroundColor: "rgba(159, 159, 167, 0.23)",
                height: "240px",
              }}

              headStyle={{ backgroundColor: "#0d416b", color: "white" }}
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      maxWidth: '10ch',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      fontWeight: 'bold',
                    }}
                  >
                    {response.propertyName}
                  </span>
                  {response.property?.propertyId && (
                    <span style={{ marginLeft: '8px' }}>
                      ({response.property.propertyId})
                    </span>
                  )}
                </div>
              }

              bordered={false}
              hoverable
              extra={
                <>
                  <Popover
                    content={
                      <div style={{ textAlign: "center" }}>
                        <p>Are you sure you want to start the deal?</p>
                        <Button
                          type="primary"
                          onClick={() => StartDeal(response._id)} // Confirmation button logic
                          style={{ marginRight: "8px" }}
                          disabled={response.dealStatus === "inProgress"} // Disable if already in progress
                        >
                          Yes
                        </Button>
                        <Button type="default">No</Button> {/* No button to close the popover */}
                      </div>
                    }
                    trigger="click"
                    placement="topRight"
                  >
                    <button
                      style={{
                        padding: "1px 10px",
                        background:
                          response.dealStatus === "inProgress"
                            ? "gray"
                            : "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                        color: response.dealStatus === "inProgress" ? "white" : "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: response.dealStatus === "inProgress" ? "not-allowed" : "pointer",
                        marginRight: "10px",
                        transition: "background 0.3s ease",
                        opacity: response.dealStatus === "inProgress" ? 0.6 : 1,
                      }}
                      disabled={response.dealStatus === "inProgress"}
                    >
                      {response.dealStatus === "inProgress" ? "Deal Started" : "Start Deal"}
                    </button>
                  </Popover>

                  <button
                    style={{
                      padding: "1px 10px",
                      background: "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onClick={() => handleViewMore(response._id)}
                  >
                    View More
                  </button>
                </>
              }
            >
              {/* Card Content */}
              <h3>
                <UserOutlined style={{ marginRight: "8px" }} />
                {response.customer.firstName} {response.customer.lastName}
              </h3>
              <p>
                <FaWhatsapp style={{ marginRight: "8px" }} />
                {formatPhoneNumber(response.customer.phoneNumber)}

              </p>
              <p>
                <HomeOutlined style={{ marginRight: "8px" }} />
                {response.propertyType}
              </p>
              <p>
                <EnvironmentOutlined style={{ marginRight: "8px" }} />
                {(() => {
                  if (response.property?.propertyType === "Agricultural land" || response.property?.propertyType === "Residential") {
                    const district = response.property.address?.district || "No district";
                    const state = response.property.address?.state || "No state";
                    const mandal = response.property.address?.mandal || "No mandal";
                    const village = response.property.address?.village || "No village";

                    return `${district}, ${state}, ${mandal}, ${village}`;
                  } else if (response.property?.propertyType === "Commercial") {
                    const district = response.property.propertyDetails?.landDetails?.address?.district || "No district";
                    const state = response.property.propertyDetails?.landDetails?.address?.state || "No state";
                    const mandal = response.property.propertyDetails?.landDetails?.address?.mandal || "No mandal";
                    const village = response.property.propertyDetails?.landDetails?.address?.village || "No village";

                    return `${district}, ${state}, ${mandal}, ${village}`;
                  } else if (response.property?.propertyType === "Layout") {
                    const district = response.property.layoutDetails?.address?.district || "No district";
                    const state = response.property.layoutDetails?.address?.state || "No state";
                    const mandal = response.property.layoutDetails?.address?.mandal || "No mandal";
                    const village = response.property.layoutDetails?.address?.village || "No village";

                    return `${district}, ${state}, ${mandal}, ${village}`;
                  } else {
                    return "Property type not available";
                  }
                })()}
              </p>


              {/* Buttons */}

              <button
                style={{
                  padding: "3px 10px",
                  background: "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                  marginRight: "2%",
                }}
                onClick={() =>
                  onScheduleMeet(
                    response._id,
                    response.agentId,
                    response.propertyId,
                    response.propertyName,
                    response.customer.email,
                    response.customerId
                  )
                }
              >
                Schedule Meet
              </button>

              <button
                style={{
                  padding: "3px 10px",
                  background:
                    response.dealStatus === "closed"
                      ? "gray"
                      : "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                  color: response.dealStatus === "closed" ? "white" : "white",

                  border: "none",
                  borderRadius: "5px",
                  cursor: response.dealStatus === "closed" ? "not-allowed" : "pointer", // Disable pointer if closed
                  transition: "background 0.3s ease",
                  marginRight: "2%",
                }}
                onClick={() => {
                  if (response.dealStatus !== "closed" && !isClosed[response._id]) {
                    onDealClose(response._id);
                  }
                }}
                disabled={response.dealStatus === "closed" || isClosed[response._id]}
              >
                {response.dealStatus === "closed" ? (
                  <span>Closed</span>
                ) : (
                  "Close Deal"
                )}
              </button>

              <button
                style={{
                  padding: "3px 10px",
                  background: "linear-gradient(135deg, rgb(98, 83, 225), rgb(4, 190, 254))",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onClick={() => toggleMenu(response._id)}
              >
                Activities
              </button>

              {/* Popup */}
              {activeCardId === response._id && (
                <div
                  style={{
                    position: "absolute",
                    top: "156px", // Adjust position relative to the button
                    left: "60%", // Adjust horizontal alignment
                    background: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "5px",
                    padding: "10px",
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => AddActivity(response._id, response.agentId)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "5px 10px",
                      backgroundColor: "#e0e0e0",
                      color: "#000",
                      border: "none",
                      borderRadius: "5px",
                      textAlign: "left",
                      marginBottom: "5px",
                    }}
                  >
                    Add Activity
                  </button>
                  <button
                    onClick={() => handleActivities(response)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "5px 10px",
                      backgroundColor: "#cce7ff",
                      color: "#000",
                      border: "none",
                      borderRadius: "5px",
                      textAlign: "left",
                    }}
                  >
                    View Activity
                  </button>
                </div>
              )}

            </Card>
          </Col>

        ))}

      </Row>
      <Row style={{ float: "right", marginTop: "2%" }}>
        <Pagination
          current={currentPage1}
          total={filteredAgents.length}
          pageSize={cardsPerPage}
          onChange={handlePageChange}
        />
      </Row>
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
            <Card title="Schedule" headStyle={{ backgroundColor: '#0d416b', color: 'white' }} style={{ width: "99%" }}>
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
                rules={[{ required: true, message: 'Please input this Field!' }]}
              >
                <Input.TextArea rows={2} placeholder="Enter Location to meet" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="meetingInfo"
                label="Meeting Info"
                rules={[{ required: true, message: "Please Input This Field!" }]}
              >
                <Input.TextArea rows={2} placeholder="Give some details about the meeting" />
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
      {/* Deal Modal */}
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
        open={isActivityModalOpen}
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
                <DatePicker style={{ width: '100%' }} placeholder="Select Date" disabledDate={(current) => current && current < moment().startOf('day')} />
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
                rules={[{ required: true, message: 'Please select the start time!' }]}
              >
                <TimePicker style={{ width: '100%' }} use12Hours format="h:mm a" placeholder="Select Start Time" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: 'Please select the end time!' }]}
              >
                <TimePicker style={{ width: '100%' }} use12Hours format="h:mm a" placeholder="Select End Time" />
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
                  { required: true, message: 'Please provide feedback!' },
                  { max: 300, message: 'Feedback cannot exceed 300 characters!' },
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
        open={detailsModalOpen}
        onCancel={handleDetailsModalClose}
        footer={null}
      >


        <div >
          <h3>{details.meetingTitle}</h3>
          <p><strong>Property Name:</strong> {details.propertyName}</p>
          <p><strong>Meeting Info:</strong> {details.meetingInfo}</p>
          <p><strong>Start Time:</strong> {new Date(details.meetingStartTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(details.meetingEndTime).toLocaleString()}</p>
          <p><strong>Scheduled By:</strong> {details.scheduledBy}</p>
        </div>

        <button style={{ marginRight: "2%", backgroundColor: "#0D416B", color: "white" }}>Edit</button>
        <button style={{ backgroundColor: "#0D416B", color: "white" }} onClick={handleDetailsModalClose}>Cancel</button>
      </Modal>
      <Modal
        visible={isViewActivities}
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
              <Card title="Customer Details" style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                transition: "box-shadow 0.3s ease"

              }} headStyle={{ backgroundColor: '#0d416b', color: 'white' }} bordered>
                <p><strong><UserOutlined /> Name:</strong> {selectedDeal.customer.firstName} {selectedDeal.customer.lastName}</p>
                <p><strong> <FaWhatsapp style={{ marginRight: "5px" }} /> Phone:</strong>  {formatPhoneNumber(selectedDeal.customer.phoneNumber)}</p>
                <p><strong><MailOutlined /> Email:</strong> {selectedDeal.customer.email}</p>
                <p><strong><EnvironmentOutlined /> State:</strong> {selectedDeal.customer.state}</p>
                <p><strong><EnvironmentOutlined /> Country:</strong> {selectedDeal.customer.country}</p>
                <p><strong><EnvironmentOutlined /> district:</strong> {selectedDeal.customer.district}</p>
                <p><strong><EnvironmentOutlined /> Mandal:</strong> {selectedDeal.customer.mandal}</p>
                <p><strong><EnvironmentOutlined /> City:</strong> {selectedDeal.customer.city}</p>
                <p><strong><CommentOutlined /> Comments:</strong> {selectedDeal.comments}</p>
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                transition: "box-shadow 0.3s ease"
              }} headStyle={{ backgroundColor: '#0d416b', color: 'white' }} title="Property Details" bordered>
                <p><strong><HomeOutlined /> Property Name:</strong> {selectedDeal.propertyName}</p>

                <p>
                  <strong>
                    <AppstoreOutlined className="GlobalOutlined" /> Size:
                  </strong>{" "}
                  {selectedDeal.property.propertyType === "Layout"
                    ? selectedDeal.property.layoutDetails?.size
                    : selectedDeal.property.propertyType === "Commercial"
                      ? // Check for size in sell, rent, or lease for Commercial properties
                      selectedDeal.property.propertyDetails.landDetails.sell?.plotSize ||
                      selectedDeal.property.propertyDetails.landDetails.rent?.plotSize ||
                      selectedDeal.property.propertyDetails.landDetails.lease?.plotSize ||
                      "Size not available" // Fallback if none are available
                      : selectedDeal.property.landDetails?.size}{" "}
                  {selectedDeal.property.propertyType === "Layout"
                    ? selectedDeal.property.layoutDetails?.sizeUnit
                    : selectedDeal.property.propertyType === "Commercial"
                      ? // Use the sizeUnit from the first available category
                      selectedDeal.property.propertyDetails.landDetails.sell?.sizeUnit ||
                      selectedDeal.property.propertyDetails.landDetails.rent?.sizeUnit ||
                      selectedDeal.property.propertyDetails.landDetails.lease?.sizeUnit ||
                      ""
                      : selectedDeal.property.landDetails?.sizeUnit}
                </p>

                <p>
                  <strong><MoneyCollectOutlined /> Price:</strong>
                  {selectedDeal.property.propertyType === 'Layout'
                    ? selectedDeal.property.layoutDetails?.totalPrice
                    : selectedDeal.property.propertyType === "Commercial"
                      ?
                      selectedDeal.property.propertyDetails.landDetails.sell?.totalAmount ||
                      selectedDeal.property.propertyDetails.landDetails.rent?.totalAmount ||
                      selectedDeal.property.propertyDetails.landDetails.lease?.totalAmount ||
                      "Size not available" // Fallback if none are availabl
                      : selectedDeal.property.landDetails?.totalPrice}
                </p>

                <p><strong><EnvironmentOutlined /> State:</strong>{selectedDeal.property.propertyType === 'Layout' ? selectedDeal.property.layoutDetails.address.state : selectedDeal.property.propertyType === 'Commercial' ? selectedDeal.property.propertyDetails.landDetails.address.state : selectedDeal.property.address.state}</p>
                <p><strong><EnvironmentOutlined /> Country:</strong> {selectedDeal.property.propertyType === 'Layout' ? selectedDeal.property.layoutDetails.address.country : selectedDeal.property.propertyType === 'Commercial' ? selectedDeal.property.propertyDetails.landDetails.address.country : selectedDeal.property.address.country}</p>
                <p><strong><EnvironmentOutlined /> district:</strong> {selectedDeal.property.propertyType === 'Layout' ? selectedDeal.property.layoutDetails.address.district : selectedDeal.property.propertyType === 'Commercial' ? selectedDeal.property.propertyDetails.landDetails.address.district : selectedDeal.property.address.district}</p>
                <p><strong><EnvironmentOutlined /> Mandal:</strong> {selectedDeal.property.propertyType === 'Layout' ? selectedDeal.property.layoutDetails.address.mandal : selectedDeal.property.propertyType === 'Commercial' ? selectedDeal.property.propertyDetails.landDetails.address.mandal : selectedDeal.property.address.mandal}</p>
                <p><strong><EnvironmentOutlined /> City:</strong> {selectedDeal.property.propertyType === 'Layout' ? selectedDeal.property.layoutDetails.address.village : selectedDeal.property.propertyType === 'Commercial' ? selectedDeal.property.propertyDetails.landDetails.address.village : selectedDeal.property.address.village}</p>
                <Button onClick={handlePropertyView}><EyeOutlined /> View More</Button>
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

export default MyDeals;


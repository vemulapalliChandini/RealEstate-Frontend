import React, { useEffect, useState } from 'react';
import { Calendar, Modal, Badge, Card, Select, Row, Col, Empty, Pagination, Collapse } from 'antd';
import axios from 'axios';
import { ScheduleOutlined } from '@ant-design/icons';
import { _get } from "../../Service/apiClient";
const { Option } = Select;
const { Panel } = Collapse;

function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [viewOption, setViewOption] = useState('today');
    const [selectedDateMeetings, setSelectedDateMeetings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewMoreModalVisible, setViewMoreModalVisible] = useState(false);
    const [viewAllMeetings, setViewAllMeetings] = useState([]);
    const [meetingDetailsModalVisible, setMeetingDetailsModalVisible] = useState(false);
    const [remainingMeetings, setRemainingMeetings] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [meetingsPerPage] = useState(2);
    // Fetch data from the API
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

    const filterMeetings = () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of this week
        const endOfWeek = new Date(today.setDate(today.getDate() + 6 - today.getDay())); // End of this week

        if (viewOption === 'today') {
            return meetings.filter(meeting => {
                const meetingDate = new Date(meeting.meetingStartTime);
                return meetingDate.toDateString() === new Date().toDateString();
            });
        } else if (viewOption === 'thisWeek') {
            return meetings.filter(meeting => {
                const meetingDate = new Date(meeting.meetingStartTime);
                return meetingDate >= startOfWeek && meetingDate <= endOfWeek;
            });
        }
        return meetings;
    };
    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    const currentMeetings = filterMeetings().slice(
        (currentPage - 1) * meetingsPerPage,
        currentPage * meetingsPerPage
    );
    const handleDateClick = (value) => {
        const selectedDate = new Date(value);
        const dateMeetings = meetings.filter(meeting => {
            const meetingDate = new Date(meeting.meetingStartTime);
            return meetingDate.toDateString() === selectedDate.toDateString();
        });

        setSelectedDateMeetings(dateMeetings);
        setSelectedDate(selectedDate.toDateString());
        setSelectedMeeting(dateMeetings.length > 0 ? dateMeetings[0] : null);
    };

    const dateCellRender = (value) => {
        const selectedDate = new Date(value);
        const listData = meetings.filter(meeting => {
            const meetingDate = new Date(meeting.meetingStartTime);
            return meetingDate.toDateString() === selectedDate.toDateString();
        });
        const displayedProperty = listData.length > 0 ? listData[0].propertyName : null;
        const remainingMeetings = listData.length > 1 ? listData.length - 1 : 0;
        setRemainingMeetings(remainingMeetings);
        return (
            <div className="events" style={{ padding: 0, margin: 0 }}>
                {displayedProperty && (
                    <div
                        key={selectedDate.toDateString()}
                        onClick={() => {
                            if (listData.length === 1) {

                                setViewAllMeetings(listData);
                                setMeetingDetailsModalVisible(true);
                            } else {

                                setViewAllMeetings(listData);
                                setViewMoreModalVisible(true);
                            }
                        }}
                        style={{ marginBottom: '8px', cursor: 'pointer' }}
                    >
                        <Badge
                            status="processing"
                            text={`${displayedProperty.slice(0, 5)}${displayedProperty.length > 5 ? '...' : ''}`}
                        />
                        {remainingMeetings > 0 && <span>... ({remainingMeetings} more)</span>}
                    </div>
                )}
            </div>
        );


    };

    const handleViewMoreModalClose = () => {
        setViewMoreModalVisible(false);
        console.log(remainingMeetings);
        setRemainingMeetings(remainingMeetings);
    };

    const handleMeetingDetailsModalClose = () => {
        setMeetingDetailsModalVisible(false);
    };

    const handleViewMeetingDetails = (meeting) => {
        setSelectedMeeting(meeting);
        // setMeetingDetailsModalVisible(true);
        // setViewMoreModalVisible(false);
    };

    return (
        <div>
            <Row gutter={16}>
                {/* Calendar Card */}
                <Col xs={24} md={16} lg={16}>
                    <Card
                        title={
                            <div
                                style={{
                                    textAlign: 'center',


                                }}
                            >
                                Calendar
                            </div>
                        }
                        style={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        headStyle={{
                            backgroundColor: '#0D416B',
                            color: "white"
                        }}

                    >
                        <Calendar
                            fullscreen={false}
                            cellRender={dateCellRender}
                            onSelect={handleDateClick} // Trigger modal on date click
                            style={{ marginBottom: '20px' }}
                        />
                    </Card>

                </Col>


                <Col xs={24} md={16} lg={8}>

                    <Card
                        title={<div style={{ textAlign: 'center' }}>View Scheduled Meetings</div>}
                        style={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                        headStyle={{
                            backgroundColor: '#0D416B',
                            color: "white",
                        }}
                    >

                        <Collapse accordion={true} defaultActiveKey={['today']} onChange={(key) => setViewOption(key[0])}>
                            <Panel header="Today" key="today"
                            >

                                <div style={{ marginTop: '20px' }}>
                                    {currentMeetings.length === 0 ? (
                                        <Empty
                                            image={<ScheduleOutlined />}
                                            description="No meetings found"
                                        />
                                    ) : (
                                        currentMeetings.map(meeting => (
                                            <Card key={meeting._id} title={meeting.meetingTitle}>
                                                <p>{meeting.propertyName}</p>
                                                <p>{new Date(meeting.meetingStartTime).toLocaleString()}</p>
                                            </Card>
                                        ))
                                    )}
                                </div>
                                {/* Pagination for "Today" */}
                                {filterMeetings().length > meetingsPerPage && (
                                    <Pagination
                                        current={currentPage}
                                        pageSize={meetingsPerPage}
                                        total={filterMeetings().length}
                                        onChange={handlePaginationChange}
                                        style={{ marginTop: '20px', textAlign: 'center' }}
                                    />
                                )}
                            </Panel>

                            <Panel header="This Week" key="thisWeek"
                            >

                                <div style={{ marginTop: '20px' }}>
                                    {currentMeetings.length === 0 ? (
                                        <Empty
                                            image={<ScheduleOutlined />}
                                            description="No meetings found"
                                        />
                                    ) : (
                                        currentMeetings.map(meeting => (
                                            <Card key={meeting._id} title={meeting.meetingTitle}>
                                                <p>{meeting.propertyName}</p>
                                                <p>{new Date(meeting.meetingStartTime).toLocaleString()}</p>
                                            </Card>
                                        ))
                                    )}
                                </div>
                                {/* Pagination for "This Week" */}
                                {filterMeetings().length > meetingsPerPage && (
                                    <Pagination
                                        current={currentPage}
                                        pageSize={meetingsPerPage}
                                        total={filterMeetings().length}
                                        onChange={handlePaginationChange}
                                        style={{ marginTop: '20px', textAlign: 'center' }}
                                    />
                                )}
                            </Panel>
                        </Collapse>
                    </Card>
                </Col>
            </Row>

            {/* View More Modal */}
            <Modal
                title={`All Meetings List ${selectedDate}`}
                visible={viewMoreModalVisible}
                onCancel={handleViewMoreModalClose}
                footer={null}
                width={600}
            >

                <div style={{ maxHeight: "70vh", overflowY: "auto" }}> {/* Apply scroll here */}
                    <Collapse
                        accordion
                        activeKey={selectedMeeting ? selectedMeeting._id : viewAllMeetings[0]?._id} // Set the first panel as default if no meeting is selected
                    >
                        {viewAllMeetings.map((meeting) => (
                            <Panel
                                header={meeting.propertyName}
                                key={meeting._id}
                                onClick={() => handleViewMeetingDetails(meeting)}
                            >
                                {selectedMeeting && selectedMeeting._id === meeting._id && (
                                    <div>
                                        <h3>{meeting.meetingTitle}</h3>
                                        <p><strong>Property Name : </strong> {meeting.propertyName}</p>
                                        <p><strong>Meeting Info : </strong> {meeting.meetingInfo}</p>
                                        <p><strong>Start Time : </strong> {new Date(meeting.meetingStartTime).toLocaleString()}</p>
                                        <p><strong>End Time : </strong> {new Date(meeting.meetingEndTime).toLocaleString()}</p>
                                        <p><strong>Scheduled By : </strong> {meeting.scheduledByName}</p>
                                        <p><strong>Customer Name : </strong> {meeting.customerName}</p>
                                    </div>
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </Modal>


        </div>
    );
}

export default Meetings;

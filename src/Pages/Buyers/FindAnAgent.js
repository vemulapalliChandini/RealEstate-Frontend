import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Empty,
    Button,
    Input,
    Modal,
    Pagination,
    Spin,
    Form
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { _get } from "../../Service/apiClient";
import { SearchOutlined } from "@mui/icons-material";

const FindAnAgent = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const [currentPage, setCurrentPage] = useState(1); // For pagination
    const [pageSize, setPageSize] = useState(9); // Number of cards per page

    const [searchText, setSearchText] = useState(""); // Search text state
    const [form] = Form.useForm();

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleFormSubmit = (values) => {
        console.log("Form values:", values);
        setIsModalVisible(false);
        form.resetFields();
    };

    // Fetch data based on search text
    const fetchData = async (text = "") => {
        setLoading(true);
        try {
            const response = await _get(`/findAnAgent?text=${text}`);
            setAgents(response.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleContactAgentClick = (agent) => {
        setSelectedAgent(agent);
        setIsModalVisible(true);
    };
    // Automatically fetch data when searchText changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData(searchText); // Fetch data when searchText is updated
        }, 500); // Add a delay of 500ms for debouncing

        return () => clearTimeout(timeoutId); // Clean up the timeout on component unmount
    }, [searchText]); // Trigger fetchData when searchText changes

    useEffect(() => {
        fetchData(); // Initial data fetch without search
    }, []);

    // Paginated data
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAgents = agents.slice(startIndex, startIndex + pageSize);

    return (
        <>
        <Row gutter={[16, 16]}>
                    {/* Left Column: Image with Text Overlay */}
                    <Col xs={24} md={24}>
                      <div style={{ position: "relative", width: "100%", height: "350px" }}>
                        {/* Image */}
                        <img
                          src="https://aceable-illuminati.s3.amazonaws.com/uploads/sites/2/2019/03/GettyImages-932275488.jpg"
                          alt="Dream Home"
                          style={{
                            width: "100%",
                            height: "490px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            marginTop: "-5%",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "-55px",
                            left: 0,
                            width: "100%",
                            height: "500px",
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // Black color with opacity
                            borderRadius: "10px",
                            marginTop: "-2%",
                          }}
                        />
                        {/* Overlay Text */}
                        {/* <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "27%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgb(0,0,0,0.5)",
                            color: "#FFFFFF",
                            textAlign: "center",
                            padding: "10px 20px",
                            borderRadius: "10px",
                          }}
                        >

                            <Input
                                value={searchText}
                                onChange={handleSearchChange}
                                placeholder="Search by Location or Agent Name"
                                style={{ width: "310px", height: "42px" }}
                                prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            />
                        
                        </div> */}
                      </div>
                    </Col>
                  </Row>
        <div style={{ marginTop: "30px" }}>
             
            
            <Card
                hoverable
                style={{
                    width: "70%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    marginTop: "-100px",
                    marginLeft:"17%",
                    backgroundColor: "rgb(248, 250, 255)" // Fix: Enclose in quotes
                }}
            >
               
                <h2 style={{ color: "#0D416B", marginLeft: "34%" }}>
                    Buy or sell with confidence!
                </h2>
                <h3 style={{ textAlign: "center", color: "#0D416B" }}>
                    Our expert agents provide personalized service, helping buyers find the right property and sellers market their homes effectively.
                </h3>


           
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input
                                value={searchText}
                                onChange={handleSearchChange}
                                placeholder="Search by Location or Agent Name"
                                style={{ width: "30%", height: "42px",marginLeft:"32%"}}
                                prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
                            />
                        </Col>
                    </Row>
           
            </Card>
            {loading && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spin
                        size="large"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)", // This centers the loader
                        }}
                    />
                </div>
            )}

            {/* Agent Cards */}
            <Row gutter={[24, 24]} style={{ padding: "20px" }}>
                {paginatedAgents.length > 0 ? (
                    paginatedAgents.map((agent) => (
                        <Col xs={24} sm={12} md={8} key={agent._id}>
                            <Card
                                hoverable
                                style={{
                                    width: "100%",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    padding: "10px",
                                    height:"230px"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.02)"; // Slight zoom effect on hover
                                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"; // Elevated shadow on hover
                                    e.currentTarget.style.backgroundColor = "rgb(222, 228, 244)";
                                }}

                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)"; // Reset zoom effect
                                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Reset shadow
                                    e.currentTarget.style.backgroundColor = "rgb(255, 255, 255)";
                                }}

                                cover={
                                    <>
                                        <Button
                                            style={{
                                                width: "20%",
                                                float: "right",
                                                backgroundColor: "#0D416B",
                                                color: "white",
                                                marginLeft: "30%",
                                            }}
                                            onClick={() => handleContactAgentClick(agent)}
                                        >
                                            Contact
                                        </Button>
                                        <Row style={{ display: "flex", alignItems: "center", marginBottom: "-10%" }}>
                                            <Col span={8}>
                                                <img
                                                    alt={agent.name}
                                                    src={agent.profilePicture || "default-agent-photo.jpg"}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        borderRadius: "100px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <h1 style={{ fontWeight: "bold", fontSize: "18px" }}>
                                                    {`${agent.firstName} ${agent.lastName}`}
                                                </h1>
                                                <p style={{
                                                    marginBottom: "5px",
                                                    fontSize: "14px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                }}>
                                                    <FontAwesomeIcon
                                                        icon={faEnvelope}
                                                        style={{ marginRight: "5px", color: "#0D416B" }}
                                                    />
                                                    {agent.email}
                                                </p>

                                                <p style={{ marginBottom: "5px", fontSize: "14px" }}>
                                                    <FontAwesomeIcon
                                                        icon={faPhoneAlt}
                                                        style={{ marginRight: "5px", color: "#0D416B" }}
                                                    />
                                                    {agent.phoneNumber}
                                                </p>
                                                <p style={{ marginBottom: "5px", fontSize: "14px" }}>
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                        style={{ marginRight: "5px", color: "#0D416B" }}
                                                    />
                                                    {`${agent.city} , ${agent.mandal} , ${agent.district}`}
                                                </p>
                                            </Col>
                                            <p style={{ marginLeft: "30%", fontSize: "18px" }}>
                                                {agent.soldPropertiesCount
                                                    ? `${agent.soldPropertiesCount} Properties sold till now`
                                                    : "0 Properties sold till now"}
                                            </p>
                                        </Row>
                                    </>
                                }
                            ></Card>
                        </Col>
                    ))
                ) : (
                    <Col span={24} style={{ textAlign: "center" }}>
                        <Empty description="No Agents Found" />
                    </Col>
                )}
            </Row>

            {/* Pagination */}
            <div style={{ float: "right", marginTop: "20px" }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={agents.length}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showSizeChanger
                    pageSizeOptions={["6", "12", "24"]}
                />
            </div>

            {/* Modal for Contacting Agent */}
            <Modal
                title={`Contact ${selectedAgent?.firstName} ${selectedAgent?.lastName}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={400}
            >
                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phoneNumber"
                        rules={[{ required: true, message: "Please input your phone number!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Message" name="message">
                        <Input.TextArea rows={4} placeholder="Your message (optional)" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{
                                backgroundColor: "#0D416B",
                                color: "white",
                                width: "50%",
                                marginLeft: "20%",
                            }}
                            htmlType="submit"
                        >
                            Send Message
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
        </>
    );
};

export default FindAnAgent;

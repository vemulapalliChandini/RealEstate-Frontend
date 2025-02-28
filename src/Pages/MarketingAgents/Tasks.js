

import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Progress,
    Button,
    message,
    Input,
} from "antd";
import {
    FaWhatsapp,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaTelegram,
} from "react-icons/fa";
import { MdLocalPrintshop } from "react-icons/md";

const { Title, Text } = Typography;

const Tasks = () => {
    const [tasks, setTasks] = useState([
        {
            taskName: "WhatsApp",
            requiredPosts: 10,
            progress: 60,
            platform: <FaWhatsapp size={24} color="#25D366" />,
            completedPosts: 6,
        },
        {
            taskName: "Facebook",
            requiredPosts: 15,
            progress: 40,
            platform: <FaFacebook size={24} color="#1877F2" />,
            completedPosts: 6,
        },

        {
            taskName: "Telegram",
            requiredPosts: 8,
            progress: 70,
            platform: <FaTelegram size={24} color="#0088CC" />,
            completedPosts: 6,
        },
        {
            taskName: "Instagram",
            requiredPosts: 14,
            progress: 50,
            platform: <FaInstagram size={24} color="#E4405F" />,
            completedPosts: 7,
        },

        {
            taskName: "Twitter",
            requiredPosts: 12,
            progress: 30,
            platform: <FaTwitter size={24} color="#1DA1F2" />,
            completedPosts: 4,
        },
        {
            taskName: "Pamphlet Distribution",
            requiredPosts: 100,
            progress: 80,
            platform: <MdLocalPrintshop size={24} color="#FF8C00" />,
            completedPosts: 80,
        },
        {
            taskName: "Conduct Virtual Property Tour",
            requiredPosts: 5,
            progress: 20,
            platform: <span>🎥</span>,
            completedPosts: 1,
        },
        {
            taskName: "Cold Calling/Lead Generation",
            requiredPosts: 30,
            progress: 45,
            platform: <span>📞</span>,
            completedPosts: 13,
        },
        {
            taskName: "Email Marketing Campaign",
            requiredPosts: 20,
            progress: 35,
            platform: <span>📧</span>,
            completedPosts: 7,
        },
        {
            taskName: "Referral Program Management",
            requiredPosts: 25,
            progress: 50,
            platform: <span>🔗</span>,
            completedPosts: 12,
        },
    ]);

    const handlePostCountChange = (e, index) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            const updatedTasks = [...tasks];
            updatedTasks[index].completedPosts = value;
            updatedTasks[index].progress =
                (value / updatedTasks[index].requiredPosts) * 100;
            setTasks(updatedTasks);
        }
    };

    useEffect(() => {
        // Logic to fetch tasks from the backend API could go here
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Row gutter={[16, 16]} justify="start">
                {tasks.map((task, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            style={{
                                //   borderRadius: "15px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                                padding: "15px",
                                height: "270px",
                                backdropFilter: "blur(20px)",
                                // backgroundColor: "rgba(255, 255, 255, 0.2)",
                                // backgroundColor: "rgba(173, 216, 230, 0.3)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                backgroundColor: "rgba(159, 159, 167, 0.23)",

                                border: "1px solid rgba(82, 108, 130)", // Border with slight transparency
                            }}
                        >
                            <div style={{ marginBottom: "10px" }}>
                                <h3>
                                    {task.platform} {task.taskName}
                                </h3>
                            </div>
                            <Text strong>Required Posts: {task.requiredPosts}</Text>
                            <div style={{ marginBottom: "10px" }}>
                                <Text>
                                    Completed Posts:{" "}
                                    <Input
                                        type="number"
                                        value={task.completedPosts}
                                        onChange={(e) => handlePostCountChange(e, index)}
                                        style={{ width: "80px", marginLeft: "10px" }}
                                    />
                                </Text>
                            </div>
                            <Progress
                                percent={task.progress}
                                status="active"
                                style={{
                                    marginBottom: "20px",
                                }}
                            />

                            <div style={{ marginBottom: "10px" }}>
                                <Text strong>Progress: {task.progress.toFixed(0)}%</Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};


export default Tasks;
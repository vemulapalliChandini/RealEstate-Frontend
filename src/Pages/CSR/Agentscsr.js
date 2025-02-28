

import React, { useEffect, useState } from "react";
import { _get } from "../../Service/apiClient";
import {
  Table,
  Avatar,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Spin,
  Dropdown,
  Menu,
  Card,
  Button,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Add this import for navigation

const { Option } = Select;
const { Search } = Input;
export default function Agentscsr() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [agentNames, setAgentNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate


  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const cleaned = number.toString().replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return number;
  };


  useEffect(() => {
    const fetchAgents = async () => {

      const id = localStorage.getItem("userId");

      try {
        setLoading(true);
        const response = await _get(`/csr/getAssignedAgents/${id}`);
        if (response && response.data) {
          setAgents(response.data);
          setAgentNames(
            response.data.map((agent) => `${agent.firstName} ${agent.lastName}`)

          );
          setLoading(false);
          console.log("Agents fetched successfully:", response.data);
        } else {
          console.log("No data received from the API.");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching agents: ", error);
      }
    };
    fetchAgents();
  }, []);

  const handleAvatarClick = (agent) => {
    setSelectedAgent(agent);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedAgent(null);
  };



  const handleMenuClick = (e, agent) => {
    if (e.key === "property") {
      navigate(`property/${agent._id}`);
    } else if (e.key === "customer") {
      navigate(`customer/${agent._id}`);
    }
  };



  const columns = [
    {
      title: "Profile",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (text, record) => (
        <Avatar
          src={text}
          size={40}
          style={{ cursor: "pointer" }}
          onClick={() => handleAvatarClick(record)}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
    },
    {
      title: "AgentID",
      key: "accountId",
      render: (_, record) => record.accountId,
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
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      align: "center",
      render: (text, record) => `${record.firstName} ${record.lastName}`,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (text) => (
        <>
          <MailOutlined style={{ marginRight: "5px", color: "#0d416b" }} />
          {text}
        </>
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        },
      }),
    },

    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
          textAlign: "center",
        },
      }),
    },

    {
      title: "District",
      dataIndex: "district",
      key: "district",
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

    {
      title: "Mandal",
      dataIndex: "mandal",
      key: "mandal",
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
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => handleMenuClick(e, record)}>
              <Menu.Item key="property">Properties</Menu.Item>
              <Menu.Item key="customer">Customers</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
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

  const filteredAgents = agents.filter((agent) => {
    const nameMatch = nameSearchQuery
      ? `${agent.firstName} ${agent.lastName}`
        .toLowerCase()
        .includes(nameSearchQuery.toLowerCase())
      : true;

    const locationMatch = locationSearchQuery
      ? (agent.district &&
        agent.district
          .toLowerCase()
          .includes(locationSearchQuery.toLowerCase())) ||
      (agent.mandal &&
        agent.mandal
          .toLowerCase()
          .includes(locationSearchQuery.toLowerCase())) ||
      (agent.village &&
        agent.village
          .toLowerCase()
          .includes(locationSearchQuery.toLowerCase()))
      : true;

    return nameMatch && locationMatch;
  });

  return (
    <div>
      <Card
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

          borderRadius: "8px",

        }}
      >

        <Row gutter={[16, 16]} >
          <Col xs={24} sm={12} md={5} lg={5}>
            <Select
              showSearch
              placeholder="select agent name"
              style={{
                width: "100%"
                , height: "36px"
              }}

              value={nameSearchQuery || undefined}
              onChange={(value) => setNameSearchQuery(value)}
              onSearch={(value) => setNameSearchQuery(value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              allowClear
              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
            >
              {agentNames.map((name, index) => (
                <Option key={index} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Input
              placeholder="Search by Location"
              allowClear
              onChange={(e) => setNameSearchQuery(e.target.value)}

              style={{
                width: "100%"
                , height: "36px"
              }}


              prefix={<SearchOutlined style={{ color: "#082d4a" }} />}
            />
          </Col>

        </Row>
      </Card>
      <Row style={{ marginTop: "20px" }}>
        {loading ? (
          <Col xs={24} style={{ position: "relative", height: "400px" }}>
            <Spin
              size="large"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Col>
        ) : (
          <Col xs={24}>
            <Table
              dataSource={filteredAgents}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
              style={{ marginTop: "20px" }}
            />
          </Col>
        )}
      </Row>

      {selectedAgent && (
        <Modal
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={500}
          style={{
            top: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedAgent?.profilePicture}
              alt={`${selectedAgent?.firstName} ${selectedAgent?.lastName}`}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                borderRadius: "10px",
                marginTop: "20px",
                border: "2px solid #ffffff",
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

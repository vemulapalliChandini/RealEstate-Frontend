import React, { useEffect, useState } from "react";
import {
  Input,
  Table,
  Spin,

  Card,
  Row,
  Col
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import { _get } from "../../Service/apiClient";
import { FaWhatsapp } from "react-icons/fa";
import { PhoneOutlined } from "@mui/icons-material";

export default function SurveyData() {
  const [buyer, setBuyer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
    const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredBuyers, setFilteredBuyers] = useState([]);

  useEffect(() => {
    fetchbuyers();
  }, []);

  useEffect(() => {
    setFilteredBuyers(buyer);
  }, [buyer]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };
  const fetchbuyers = async () => {
    setLoading(true);
    try {
      const response = await _get("/customer/getSurveyData");
      console.log(response.data);
      setBuyer(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error Fetching data", error);
    }
  };

  const filterBuyers = () => {
    const filtered = buyer.filter((b) => {
      const matchesName = `${b.firstName} ${b.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesLocation = `${b.city}, ${b.state}, ${b.country}`
        .toLowerCase()
        .includes(searchLocation.toLowerCase());
      return matchesName && matchesLocation;
    });
    setFilteredBuyers(filtered);
  };

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
    filterBuyers();
  };

  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
    filterBuyers();
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
  const formatPrice = (price) => {
    if (price == null) {
      return "N/A"; // Return 'N/A' or any other default value for invalid prices
    }

    if (price >= 1_00_00_000) {
      return (price / 1_00_00_000).toFixed(1) + "Cr"; // Convert to Crores
    } else if (price >= 1_00_000) {
      return (price / 1_00_000).toFixed(1) + "L"; // Convert to Lakhs
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1) + "k"; // Convert to Thousands
    } else {
      return price.toString(); // Display as is for smaller values
    }
  };


  const columns = [

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align:"center",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center", // Ensures header text is centered
        },
      }),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center", // Ensures header text is centered
        },
      }),
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhoneOutlined style={{ marginRight: 8 }} />
          <span>{formatPhoneNumber(text)}</span>
        </div>
      ),
      
    },
    {
        title: "Whatsapp Number",
        dataIndex: "whatsAppNumber",
        key: "whatsAppNumber",
        align: "center",
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#0D416B",
            color: "white",
            fontWeight: "bold",
            textAlign: "center", // Ensures header text is centered
          },
        }),
        render: (_, record) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaWhatsapp style={{ marginRight: 8 }} />
              <span>{record.whatsAppNumber ? formatPhoneNumber(record.whatsAppNumber):formatPhoneNumber(record.phoneNumber)}</span>
            </div>
          ),
      },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center", // Ensures header text is centered
        },
      }),
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MailOutlined style={{ marginRight: 8 }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
        title: "Budget",
        dataIndex: "budget",
        key: "budget",
        align: "center",
        render: (_, record) => (record.budget ? formatPrice(record.budget) : "N/A"), // Corrected render function
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#0D416B",
            color: "white",
            fontWeight: "bold",
            textAlign: "center", // Ensures header text is centered
          },
        }),
      },      
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align:"center",
      render: (_, record) =>
        `${record.village}, ${record.mandal}, ${record.district}`,
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          textAlign: "center", // Ensures header text is centered
        },
      }),
    },
   
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  const tableData = filteredBuyers.map((b, index) => ({
    key: index,
    ...b,
  }));

  return (
    <div>
       <Card
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          marginBottom: "2%",
        }}
      >
        <Row gutter={[16, 16]}>
          
          <Col span={5}>
        <Input
          placeholder="Search by Name"
          value={searchName}
          onChange={handleNameChange}
          style={{  marginRight: "8px" }}
        />
        </Col>
        <Col span={5}>
        <Input
          placeholder="Search by Location"
          value={searchLocation}
          onChange={handleLocationChange}
          style={{ width: "200px" }}
        />
         </Col>
      </Row>
      </Card>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredBuyers.length,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  );
}

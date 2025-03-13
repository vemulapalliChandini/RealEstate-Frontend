
import React, { useState, useEffect } from "react";

import { _get, _put } from "../../Service/apiClient";

import {
    Table,
    message,
    Select,
    Input,
    Button,
    DatePicker,
    Empty,
    Card,
    Row,
    Col
} from "antd";

import moment from "moment";
import { SearchOutlined } from "@mui/icons-material";
import { FaWhatsapp } from "react-icons/fa";

const { Option } = Select;
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };
const AssignedCustomers = () => {

    const [customers, setCustomers] = useState([]);


    const [properties, setProperties] = useState([]);

    const [selectedDate, setSelectedDate] = useState(moment());

    const [loading, setLoading] = useState(false);


    const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering

    const [rescheduleDate, setRescheduleDate] = useState({});

    const userId = localStorage.getItem("userId");

    const role = localStorage.getItem("role");

    const [selectedProperties, setSelectedProperties] = useState({});

    useEffect(() => {
        const storedSelectedProperties =
            JSON.parse(localStorage.getItem("selectedProperties")) || {};
        setSelectedProperties(storedSelectedProperties);
    }, []);

    useEffect(() => {
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const customerResponse = await _get(
                    `/marketingAgent/getAssignedCustomers/${userId}/${role}?assignedDate=${date}`
                );
    
                if (
                    customerResponse.status === 204 ||
                    !customerResponse?.data?.data?.length
                ) {
                    message.warning("No customers assigned.");
                    setCustomers([]);
                } else {
                    setCustomers(customerResponse.data.data);
                }
    
                const propertyResponse = await _get(
                    `/marketingAgent/assignedProperty/${userId}/${role}?assignedDate=${date}`
                );
    
                console.log(propertyResponse);
                if (
                    propertyResponse.status === 200 &&
                    propertyResponse?.data?.data?.length
                ) {
                    const propertyList = propertyResponse.data.data.map((property) => ({
                        id: property.propertyId,
                        name: property.landTitle,
                        agentName: property.agentName,
                        agentId: property.agentId,
                        propertyType: property.propertyType,
                    }));
                    setProperties(propertyList);
                } else {
                    setProperties([]);
                    message.warning("No properties available for the selected date.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setCustomers([]);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData(selectedDate.format("YYYY-MM-DD"));
    }, [selectedDate,role,userId]);
    

    const handlePropertyChange = async (selectedPropertyNames, email) => {
        try {
            const selectedProperties = properties.filter((property) =>
                selectedPropertyNames.includes(property.name)
            );

            setCustomers((prev) =>
                prev.map((customer) =>
                    customer.email === email
                        ? {
                            ...customer,
                            properties: selectedProperties,
                        }
                        : customer
                )
            );
            const updatedSelectedProperties = {
                ...selectedProperties,
                [email]: selectedPropertyNames,
            };

            setSelectedProperties(updatedSelectedProperties);
            localStorage.setItem(
                "selectedProperties",
                JSON.stringify(updatedSelectedProperties)
            );
        } catch (error) {
            console.error("Error fetching agent details:", error);
            message.error("An error occurred while fetching agent details.");
        }
    };

    const handleChange = (value, email, field) => {
        setCustomers((prev) =>
            prev.map((customer) =>
                customer.email === email ? { ...customer, [field]: value } : customer
            )
        );
    };

    const handleSubmit = async (record) => {
        const {
            assignmentId,
            customerId,
            status,
            description,
            properties,
            reschedule,
        } = record;

        if (!assignmentId || !customerId) {
            message.error("Assignment ID or Customer ID is missing.");
            return;
        }

        console.log(properties);

        try {
            const response = await _put(
                "/marketingAgent/updateCustomerStatus",
                {
                    assignmentId,
                    customerId,
                    status,
                    description,

                    property: properties.map((property) => ({
                        landTitle: property.name,
                        propertyId: property.id,
                        propertyType: property.propertyType,
                    })),
                    size: "1500 sqft",
                    price: "500000",
                    location: "Downtown",
                    reschedule,
                }
            );

            console.log(response.data);

            if (response.status === 200) {
                setCustomers((prev) =>
                    prev.map((customer) =>
                        customer.customerId === customerId
                            ? {
                                ...customer,
                                status,
                                description,
                                properties,
                                reschedule,
                            }
                            : customer
                    )
                );

                console.log(customers);
            } else {
                message.error("Failed to update data.");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            message.error("An error occurred while updating data.");
        }
    };

    const handleRescheduleDateChange = (date, email) => {
        setRescheduleDate((prev) => ({
            ...prev,
            [email]: date,
        }));
    };
    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery)
    );
    const columns = [
        
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            align:"center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    width: "10%",
                    textAlign:"center"
                },
            }),

        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 50,
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    width:"15%",
                },
            }),
            render: (phone) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 
                    <FaWhatsapp /><span style={{marginLeft:"5px"}}>{formatPhoneNumber(phone)}</span>
                </div>
            )
        },
        


        {
            title: "Property Name",
            key: "property",
            align:"center",
            render: (text, record) => {
                const selectedValues = selectedProperties[record.email] || [];
                return Number(role) === 6 ? (
                    <div>
                        <Select
                            mode="multiple"
                            showSearch
                            allowClear={false}
                            value={selectedValues}
                            className="ant-select"
                            style={{ width: "150px" }}
                            onChange={(values) => handlePropertyChange(values, record.email)}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            placeholder="Select properties"
                        >
                            {properties.map((property) => (
                                <Option key={property.id} value={property.name}>
                                    {property.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                ) : record.property?.length > 0 ? (
                    <Select
                        style={{ width: "150px" }}
                        placeholder="Select property"
                        value={record.property[0]?.landTitle || undefined}
                        onChange={(value) => console.log("Selected Property:", value)}
                    >
                        {record.property.map((property) => (
                            <Select.Option
                                key={property.propertyId}
                                value={property.landTitle}
                            >
                                {property.landTitle}
                            </Select.Option>
                        ))}
                    </Select>
                ) : (
                    <span>No Properties available</span>
                );
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign:"center",
                },
            }),

        },


        {
            title: "Status",
            key: "status",
            align:"center",
            render: (text, record) =>
                Number(role) === 6 ? (
                    <div>
                        <Select
                            value={record.status || "Select status"}
                            onChange={(value) => handleChange(value, record.email, "status")}
                            style={{ width: "110px" }}
                        >
                            <Option value="Select status" disabled>
                                Select status
                            </Option>
                            <Option value="Interested">Interested</Option>
                            <Option value="Not Interested">Not Interested</Option>
                            <Option value="Pending">Pending</Option>
                            <Option value="Reschedule">Reschedule</Option>
                        </Select>
                    </div>
                ) : (
                    <span>{record.status || "No status available"}</span>
                ),
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign:"center",
                },
            }),

        },


        {
            title: "Description",
            key: "description",
            align: "center",
            render: (text, record) => {
                if (Number(role) === 6) {
                    return (
                        <Input.TextArea
                            value={record.description || ""}
                            onChange={(e) =>
                                handleChange(e.target.value, record.email, "description")
                            }
                            placeholder="Enter details"
                            rows={3}
                        />
                    );
                } else {
                    return (
                        <div>
                            {record.description ? (
                                <p>{record.description}</p>
                            ) : (
                                <p>No description available</p>
                            )}
                        </div>
                    );
                }
            },
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#0D416B",
                    color: "white",
                    fontWeight: "bold",
                    textAlign:"center",
                },
            }),

        },






        ...(filteredCustomers.some((customer) => customer.status === "Reschedule")
            ? [
                {
                    title: "Reschedule Date",
                    key: "rescheduleDate",
                    render: (text, record) => {
                        if (record.status === "Reschedule") {
                            return (
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    value={rescheduleDate[record.email] || null}
                                    onChange={(date) =>
                                        handleRescheduleDateChange(date, record.email)
                                    }
                                    style={{ width: "150px", textAlign: "center" }}
                                    placeholder="Select date & time"
                                      disabledDate={(current) => current && current < moment().startOf('day')}
                                />
                            );
                        }
                        return null;
                    },
                    onHeaderCell: () => ({
                        style: {
                            backgroundColor: "#0D416B",
                            color: "white",
                            fontWeight: "bold",
                        },
                    }),

                },
            ]
            : []),


        ...(Number(role) === 6
            ? [
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <Button
                           
                            size="small"
                            style={{ padding: "4px 8px", fontSize: "12px",backgroundColor:"#0D416B",color:"white" }}
                            onClick={() => handleSubmit(record)}
                        >
                            Submit
                        </Button>
                    ),
                    onHeaderCell: () => ({
                        style: {
                            backgroundColor: "#0D416B",
                            color: "white",
                            fontWeight: "bold",
                        },
                    }),

                },
            ]
            : []),
    ];


    return (
        <div style={{ padding: "20px" }}>

            <Card
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

                    borderRadius: "8px",

                }}
            >
                <Row gutter={[16, 16]}>
                    <Col>
                        <DatePicker
                            onChange={(date) => setSelectedDate(date)}
                            style={{ width: "200px", height: "38px" }}
                            placeholder="Select a date"
                            format="YYYY-MM-DD"
                              disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </Col>
                    <Col>
                        <Input
                            placeholder="Search by name or phone no"
                            value={searchQuery}

                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%"
                                , height: "36px"
                            }}

                            prefix={<SearchOutlined style={{ color: "#082d4a" }} />}

                        />
                    </Col>
                </Row>
            </Card>

            {/*  for search.... */}


            {
                filteredCustomers.length === 0 ? (
                    <Empty description="No customers available" style={{ color: "#0D416B", marginTop: "2%" }} />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredCustomers}
                        rowKey="customerId"
                        loading={loading}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                )
            }
        </div >
    );
};

export default AssignedCustomers;



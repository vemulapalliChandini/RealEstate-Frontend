
import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Radio,
    Input,
    Row,
    Col,
    Typography,
    Divider,
    Modal
} from "antd";
import { toast } from "react-toastify";
import { _put } from "../../../Service/apiClient";


import { jwtDecode } from "jwt-decode";
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

const { Title, Text } = Typography;

const Payment = ({isModalVisible,handleCancel}) => {
    const [selectedPlan, setSelectedPlan] = useState("Basic");
    const [billingCycle, setBillingCycle] = useState("Monthly");




    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
    });



    const pricing = {
        Basic: { monthly: 199, yearly: 199 * 12 },
        Standard: { monthly: 499, yearly: 499 * 12 },
        Premium: { monthly: 999, yearly: 999 * 12 },
    };







    // const GST_RATE = 18;

    // const Offer_Price = 10;



    // const calculateTotalCost = () => {

    //   const basePrice =
    //     billingCycle === "Monthly"
    //       ? pricing[selectedPlan].monthly
    //       : pricing[selectedPlan].yearly;
    //   const gstAmount = (basePrice * GST_RATE) / 100;
    //   return basePrice + gstAmount;
    // };







    //  new code from here.....





    const GST_RATE = 18;
    const OFFER_DISCOUNT_RATE = 10;




    const calculateTotalCost = () => {
        const basePrice =
            billingCycle === "Monthly"
                ? pricing[selectedPlan].monthly
                : pricing[selectedPlan].yearly;



        const discountedPrice =
            billingCycle === "Yearly"
                ? basePrice - (basePrice * OFFER_DISCOUNT_RATE) / 100
                : basePrice;

        const gstAmount = (discountedPrice * GST_RATE) / 100;

        const totalCost = discountedPrice + gstAmount;

        return totalCost;
    };








    console.log(
        `The total cost, including GST and offer discount (if applicable), is: ${calculateTotalCost()}`
    );

















    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const name = `${decoded.user.firstName} ${decoded.user.lastName}`;
                const email = decoded.user.email;
                const phoneNumber = decoded.user.phoneNumber;
                console.log(email);
                console.log(name);
                console.log(phoneNumber);

                setFormData({
                    name,
                    email,
                    contact: phoneNumber,
                });

                localStorage.setItem("role", decoded.user.role);
                localStorage.setItem("name", name);
                localStorage.setItem("email", email);
                localStorage.setItem("userId", decoded.user.userId);
                localStorage.setItem("type", "Agriculture");
                localStorage.setItem("mtype", "Agriculture");
                localStorage.setItem("phoneNumber", phoneNumber);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);


    const handlePayment = async () => {
        const totalAmount = calculateTotalCost().toFixed(2) * 100;

        const options = {
            key: "rzp_test_2OyfmpKkWZJRIP",
            amount: totalAmount,
            currency: "INR",
            name: "Real Estate",
            description: `${selectedPlan} Plan - ${billingCycle}`,
            image:
                "https://cdn-icons-png.freepik.com/256/6805/6805891.png?ga=GA1.1.786688213.1732196452&semt=ais_hybrid",
            handler: async function (response) {

                alert(
                    "Payment successful. Payment ID: " + response.razorpay_payment_id
                );
                toast.success("Payment completed successfully!");

                const currentDate = new Date();
                const formattedStartDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1
                    }/${currentDate.getFullYear()}`;
                const formattedEndDate =
                    billingCycle === "Monthly"
                        ? `${currentDate.getDate()}/${currentDate.getMonth() + 2
                        }/${currentDate.getFullYear()}`
                        : `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear() + 1
                        }`;




                const requestBody = {
                    planType: selectedPlan,
                    planDuration: billingCycle.toLowerCase(),
                    planStartDate: formattedStartDate,
                    planEndDate: formattedEndDate,
                    amount: calculateTotalCost().toFixed(2),
                };

                try {
                    await _put(
                        `/users/updateSubscription`,
                        requestBody,
                        "Subscription updated successfully!",
                        "Failed to update subscription. Please try again."
                    );
                } catch (error) {
                    console.error("Error while updating subscription:", error);
                }
            },


            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.contact,
            },


            notes: {
                address: "Vzm",
            },
            theme: {
                color: "#0d416b",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };




    return (
       <Modal visible={isModalVisible} onCancel={handleCancel} footer={null} width="730px">
                <Row >
                    <Col xs={24} sm={20} md={24} lg={24}>
                        
                            <Title level={5}>Choose a Plan</Title>
                            <Radio.Group
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                                style={{ marginBottom: "20px", display: "block" }}
                            >
                                <Radio value="Basic">Basic - ₹199/month</Radio>
                                <Radio value="Standard">Standard - ₹499/month</Radio>
                                <Radio value="Premium">Premium - ₹999/month</Radio>
                            </Radio.Group>

                            <Divider />

                            <Title level={5}>Billing Cycle</Title>
                            <Radio.Group
                                value={billingCycle}
                                onChange={(e) => setBillingCycle(e.target.value)}
                                style={{ marginBottom: "20px", display: "block" }}
                            >
                                <Radio value="Monthly">Monthly</Radio>
                                <Radio value="Yearly">Yearly</Radio>
                            </Radio.Group>

                            <Divider />

                            <Card
                                style={{
                                    borderRadius: "8px",
                                    padding: "20px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                    background: "rgba(211, 211, 211, 0.9)",
                                    marginBottom: "20px",
                                }}
                            >
                                <Title level={5} style={{ textAlign: "center", marginBottom: "20px" }}>
                                    Customer Details
                                </Title>

                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Input
                                            placeholder="Enter Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            style={{ borderRadius: "8px", padding: "12px" }}
                                            status={!formData.name ? "error" : ""}
                                            maxLength={50}
                                        />
                                        {!formData.name && (
                                            <Text type="danger" style={{ fontSize: "12px" }}>
                                                Name is required.
                                            </Text>
                                        )}
                                    </Col>

                                    <Col span={8}>
                                        <Input
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            style={{ borderRadius: "8px", padding: "12px" }}
                                            status={
                                                formData.email && !/^[a-zA-Z0-9._-]+@gmail\.com$/.test(formData.email)
                                                    ? "error"
                                                    : ""
                                            }
                                        />
                                        {formData.email && !/^[a-zA-Z0-9._-]+@gmail\.com$/.test(formData.email) && (
                                            <Text type="danger" style={{ fontSize: "12px" }}>
                                                Please enter a valid Gmail address.
                                            </Text>
                                        )}
                                    </Col>

                                    <Col span={8}>
                                        <Input
                                            placeholder="Contact (10-digit number)"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            style={{ borderRadius: "8px", padding: "12px" }}
                                            status={
                                                formData.contact && !/^\d{10}$/.test(formData.contact) ? "error" : ""
                                            }
                                            maxLength={10}
                                        />
                                        {formData.contact && !/^\d{10}$/.test(formData.contact) && (
                                            <Text type="danger" style={{ fontSize: "12px" }}>
                                                Please enter a valid 10-digit contact number.
                                            </Text>
                                        )}
                                    </Col>
                                </Row>
                            </Card>

                            <Divider />

                            <Title level={5}>Summary</Title>
                            <Row gutter={24} justify="space-between">
                                <Col span={7}>
                                    <Text strong>
                                        {selectedPlan} ({billingCycle})
                                    </Text>
                                </Col>
                                <Col span={7}>
                                    <Text>🏷️ Base Price: ₹{billingCycle === "Monthly" ? pricing[selectedPlan].monthly : pricing[selectedPlan].yearly}</Text>
                                </Col>
                                {billingCycle === "Yearly" && (
                                    <Col span={7}>
                                        <Text>🎉 Offer Price (10% off): ₹{((pricing[selectedPlan].yearly * 90) / 100).toFixed(2)}</Text>
                                    </Col>
                                )}
                                <Col span={7}>
                                    <Text>
                                        📊 GST ({GST_RATE}%): ₹{(pricing[selectedPlan][billingCycle.toLowerCase()] * (GST_RATE / 100)).toFixed(2)}
                                    </Text>
                                </Col>
                            </Row>

                            <Row justify="center" style={{ marginTop: "20px" }}>
                                <Col>
                                    <Text strong style={{ fontSize: "20px" }}>
                                        Total Price: ₹{calculateTotalCost().toFixed(2)}
                                    </Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Button
                                type="primary"
                                block
                                size="large"
                                onClick={handlePayment}
                                style={{ borderRadius: "8px", background: "#0d416b", borderColor: "#0d416b" }}
                            >
                                Proceed to Pay
                            </Button>
                        
                    </Col>
                </Row>
            </Modal>

    );
};

export default Payment;
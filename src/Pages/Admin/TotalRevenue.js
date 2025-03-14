// import React from "react";
// import { Card, Col, Row, Statistic, Divider } from "antd";

// import { useNavigate } from "react-router-dom";




// import {
//   ArrowLeftOutlined,
// } from "@ant-design/icons";



// const TotalRevenue = () => {


//     const navigate = useNavigate();


//   const revenueData = [
//     {
//       title: "Property Sales Revenue",
//       description:
//         "Income from selling residential, commercial, or agricultural properties.",
//       example: "",
//       amount: 1200000,
//     },
//     {
//       title: "Rental Income",
//       description:
//         "Monthly or yearly income generated from leasing properties to tenants.",
//       example: "",
//       amount: 300000,
//     },
//     {
//       title: "Commission Revenue",
//       description:
//         "Fees earned by agents or brokers for facilitating sales or leases.",
//       example: "",
//       amount: 50000,
//     },
//     {
//       title: "Property Management Fees",
//       description: "Charges for managing properties on behalf of owners.",
//       example: "",
//       amount: 100000,
//     },
//     {
//       title: "Consultation or Service Fees",
//       description: "Charges for advisory or additional services.",
//       example: "",
//       amount: 80000,
//     },
//     {
//       title: "Interest Revenue",
//       description:
//         "Interest collected on financing services offered.",
//       example: "",
//       amount: 20000,
//     },
//     {
//       title: "Advertising or Listing Fees",
//       description: "",
//       example: "",
//       amount: 15000,
//     },
//     {
//       title: "virtual Tour",
//       description: "",
//       example: "",
//       amount: 15000,
//     },
//     {
//       title: "paid promotions",
//       description: "",
//       example: "",
//       amount: 15000,
//     },
//   ];



//   const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);

//   return (
//     <div
//       style={{
//         padding: "20px",

//         background: "black",

//         minHeight: "100vh",
//       }}
//     >


//       <div
//         onClick={() => navigate(-1)}
//         style={{
//           cursor: "pointer",
//                 }}
//       >
//         <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
//       </div>





//       <h1 style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}>
//         Total Revenue Breakdown
//       </h1>
//       <Row gutter={[16, 16]} justify="center">
//         {revenueData.map((item, index) => (
//           <Col xs={24} sm={12} md={8} key={index}>
//             <Card
//               hoverable
//               style={{
//                 backdropFilter: "blur(10px)",
//                 background: "rgba(255, 255, 255, 0.15)",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
//                 color: "#fff",
//                 textAlign: "center",
//               }}
//             >
//               <h3 style={{ color: "#fff" }}>{item.title}</h3>
//               <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
//                 {item.description}
//               </p>
//               <p
//                 style={{
//                   fontStyle: "italic",
//                   color: "rgba(255, 255, 255, 0.6)",
//                 }}
//               >
//                 {item.example}
//               </p>
//               <Statistic
//                 value={item.amount}
//                 prefix="₹"
//                 valueStyle={{ color: "#3f8600", fontSize: "20px" }}
//               />
//             </Card>
//           </Col>
//         ))}
//       </Row>
//       <Divider style={{ borderColor: "rgba(255, 255, 255, 0.3)" }} />
//       <Card
//         hoverable
//         style={{
//           backdropFilter: "blur(10px)",
//           background: "rgba(0, 0, 0, 0.6)", // Darker background for the total revenue card
//           borderRadius: "10px",
//           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)", // Shadow effect
//           color: "#fff",
//           textAlign: "center",
//           marginTop: "20px",
//         }}
//       >
//         <h2 style={{ color: "#fff" }}>Total Revenue</h2>
//         <Statistic
//           value={totalRevenue}
//           prefix="₹"
//           valueStyle={{
//             color: "#52c41a",
//             fontSize: "24px",
//             fontWeight: "bold",
//           }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default TotalRevenue;

























//  new code from here....





import React from "react";
import { Card, Col, Row, Statistic, Divider } from "antd";


const TotalRevenue = () => {

  const revenueData = [
    {
      title: "Property Sales Revenue",
      description:
        "Income from selling residential, commercial, or agricultural properties.",
      example: "",
      amount: 1200000,
    },
    {
      title: "Rental Income",
      description:
        "Monthly or yearly income generated from leasing properties to tenants.",
      example: "",
      amount: 300000,
    },
    {
      title: "Commission Revenue",
      description:
        "Fees earned by agents or brokers for facilitating sales or leases.",
      example: "",
      amount: 50000,
    },
    {
      title: "Property Management Fees",
      description: "Charges for managing properties on behalf of owners.",
      example: "",
      amount: 100000,
    },
    {
      title: "Consultation or Service Fees",
      description: "Charges for advisory or additional services.",
      example: "",
      amount: 80000,
    },
    {
      title: "Interest Revenue",
      description: "Interest collected on financing services offered.",
      example: "",
      amount: 20000,
    },
    {
      title: "Advertising or Listing Fees",
      description: "Income from property listings or advertisements.",
      example: "",
      amount: 15000,
    },
    {
      title: "Virtual Tour",
      description: "Income from hosting virtual property tours.",
      example: "",
      amount: 15000,
    },
    {
      title: "Paid Promotions",
      description: "Revenue from promoting third-party services.",
      example: "",
      amount: 15000,
    },
  ];

  const investmentData = [
    {
      title: "Site Maintenance",
      description:
        "Costs for hosting, domain renewal, security, and performance optimization.",
      amount: 50000,
    },
    {
      title: "Website Advertisement",
      description:
        "Expenses for SEO, PPC ads, social media campaigns, and email marketing.",
      amount: 100000,
    },
    {
      title: "Technology and Features",
      description:
        "Investments in UI/UX design, mobile responsiveness, and advanced features like AI-based recommendations.",
      amount: 120000,
    },
    {
      title: "Content Creation",
      description:
        "Costs for professional photography, videos, and marketing content.",
      amount: 70000,
    },
    {
      title: "Customer Relationship Management",
      description: "Expenses for CRM tools and customer support teams.",
      amount: 80000,
    },
    {
      title: "Brand Building",
      description:
        "Costs for PR, logo design, branding, and gathering customer reviews.",
      amount: 60000,
    },
    {
      title: "Legal and Compliance",
      description:
        "Costs for data protection compliance, terms drafting, and cybersecurity insurance.",
      amount: 40000,
    },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const totalInvestment = investmentData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div
      style={{
        padding: "20px",
        
        minHeight: "100vh",
      }}
    >


      <h1 style={{ textAlign: "center", color: "black", marginBottom: "20px" }}>
        Total Revenue and Investment Breakdown
      </h1>

      <Row gutter={[16, 16]} justify="center">
        {revenueData.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                color: "black",
                textAlign: "center",
              }}
            >
              <h3 style={{  color: "black" }}>{item.title}</h3>
              <p style={{  color: "black" }}>
                {item.description}
              </p>
              <Statistic
                value={item.amount}
                prefix="₹"
                valueStyle={{  color: "black", fontSize: "20px" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider style={{ borderColor: "rgba(255, 255, 255, 0.3)" }} />

      <Card
        hoverable
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(159, 159, 167, 0.23)" ,
          borderRadius: "10px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
         color: "black",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <h2 style={{  color: "black" }}>Total Revenue</h2>
        <Statistic
          value={totalRevenue}
          prefix="₹"
          valueStyle={{
            color: "black",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        />
      </Card>

      <Divider style={{ borderColor: "rgba(255, 255, 255, 0.3)" }} />

      <h2 style={{ textAlign: "center", color: "black", marginBottom: "20px" }}>
        Investment Breakdown
      </h2>

      <Row gutter={[16, 16]} justify="center">
        {investmentData.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
                color: "black",
                textAlign: "center",
              }}
            >
              <h3 style={{ color: "black"}}>{item.title}</h3>
              <p style={{  color: "black" }}>
                {item.description}
              </p>
              <Statistic
                value={item.amount}
                prefix="₹"
                valueStyle={{  color: "black", fontSize: "20px" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider style={{ borderColor: "rgba(255, 255, 255, 0.3)" }} />

      <Card
        hoverable
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(159, 159, 167, 0.23)" ,
          borderRadius: "10px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
          color: "black",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <h2 style={{  color: "black" }}>Total Investment</h2>
        <Statistic
          value={totalInvestment}
          prefix="₹"
          valueStyle={{
           color: "black",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        />
      </Card>
    </div>
  );
};

export default TotalRevenue;


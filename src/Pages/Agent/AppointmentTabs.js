import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AppointmentTabs = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activeTab = location.pathname.includes("sellerRequests")
    ? "seller"
    : "buyer";

  return (
    <div
      className="tabs"
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "10px",
      }}
    >
      <Link
        to="/dashboard/agent/appointments/buyerRequests"
        style={{
          textDecoration: "none",
          color: activeTab === "buyer" ? "white" : "#888",
          fontWeight: activeTab === "buyer" ? "bold" : "normal",
          padding: "10px 20px",
          fontSize: "15px",
          backgroundColor:
            activeTab === "buyer"
              ? "#0D416B" 
              : "linear-gradient(to right, #f0f0f0, #f0f0f0)", 
          borderRadius: "5px",
        }}
      >
        {t("dashboard.Buyer Requests")}
      </Link>
      <Link
        to="/dashboard/agent/appointments/sellerRequests"
        style={{
          textDecoration: "none",
          color: activeTab === "seller" ? "white" : "#888",
          fontWeight: activeTab === "seller" ? "bold" : "normal",
          padding: "10px 20px",
          fontSize: "15px",
          backgroundColor:
            activeTab === "seller"
              ? "#0D416B"
              : "linear-gradient(to right, #f0f0f0, #f0f0f0)", 
          borderRadius: "5px",
        }}
      >
        {t("dashboard.Seller Requests")}
      </Link>
    </div>
  );
};

export default AppointmentTabs;

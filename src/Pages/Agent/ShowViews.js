import { Avatar, Modal, Spin, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { _get } from "../../Service/apiClient";
import { ClockCircleOutlined } from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";

const ShowViews = ({ viewProp, viewsModal, setViewsModal }) => {
  const [activeTab] = useState("buyerViews");
  const [totalBuyerViews, setTotalBuyerViews] = useState(null);
  useEffect(() => {
    showBuyersViews();
    showBuyersBookings();
  }, [activeTab, viewProp]);



  const showBuyersBookings = async () => {
    try {
      const response = await _get(
        `booking/reqsCountFromABuyer/${viewProp._id}`
      );
    } catch (error) {
      console.error("Error fetching buyer views:", error);
      setTotalBuyerViews([]);
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
  const showBuyersViews = async () => {
    try {
      const response = await _get(`views/viewsFromABuyer/${viewProp._id}`);
      console.log(response.data);
      setTotalBuyerViews(response.data);
    } catch (error) {
      console.error("Error fetching buyer views:", error);
      setTotalBuyerViews([]);
    }
  };

  const buyerColumns = [
    {
      title: "Profile",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (_, record) => (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
          }}

        >
          <Avatar
            src={record.profilePicture} // Access profile picture from the 'csr' object inside the record
            size={40}
            style={{
              borderRadius: "50%",
              border: "2px solid #ffffff",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      ),
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
    {
      title: "Viewer Name",
      dataIndex: "buyerName",
      key: "buyerName",
      align: "center",
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "phone",
      render: (_, record) => (
        <div
        

        >
          <FaWhatsapp />{formatPhoneNumber(record.phone)}
        </div>
      ),
      align: "center",
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold",width:"20%" },
      }),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
     
      align: "center",
      onHeaderCell: () => ({
        style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
      }),
    },
  ];

  const buyerBookings = [
    {
      title: "Buyer Name",
      dataIndex: "buyerName",
      key: "buyerName",
      align: "center",
    },
    {
      title: "Bookings Count",
      dataIndex: "bookingsCount",
      key: "bookingsCount",
      render: (bookingsCount, record) => (
        <span>
          {bookingsCount}

          <Tooltip
            placement="right"
            title={
              new Date(record.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }) ===
                new Date(record.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }) ? (
                <>
                  <strong>Recent Booking:</strong> <br></br>
                  {new Date(record.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </>
              ) : (
                <>
                  <strong>First Booking:</strong> <br></br>
                  {new Date(record.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                  <br />
                  {bookingsCount > 1 && (
                    <>
                      <strong>Recent Booking:</strong> <br></br>
                      {new Date(record.updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </>
                  )}
                </>
              )
            }
          >
            <ClockCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      align: "center",
    },
  ];

  return (
    <Modal
      title={
        <div className="PropertyStyle">
          <span>
            {viewProp.propertyType === "Agricultural land" &&
              viewProp.landDetails.title.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
            {viewProp.propertyType === "Commercial" &&
              viewProp.propertyTitle.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
            {viewProp.propertyType === "Layout" &&
              viewProp.layoutDetails.layoutTitle.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
            {viewProp.propertyType === "Residential" &&
              viewProp.propertyDetails.apartmentName.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}
          </span>
        </div>
      }
      open={viewsModal}
      onCancel={() => {
        setViewsModal(!viewsModal);
      }}
      width={800}
      footer={null}
      style={{
        marginTop: "-3%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >

      </div>
     
          {totalBuyerViews === null ? (
            <div
              style={{ textAlign: "center", padding: "20px", width: "100%" }}
              className="content-container"
            >
              <Spin size="large" style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // This centers the loader
              }} />
              <p>Loading...</p>
            </div>
          ) : totalBuyerViews.length > 0 ? (
            <Table
              columns={buyerColumns}
              dataSource={totalBuyerViews}
              pagination={totalBuyerViews.length > 5 ? { pageSize: 5 } : false}
              rowKey={(record) => record.buyerName}
            />
          ) : (
            <h3>No buyers viewed this property yet.</h3>
          )}
       
    
    </Modal>
  );
};

export default ShowViews;

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Empty,
  Modal,
  Pagination,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { _get } from "../../Service/apiClient";
import { useTranslation } from "react-i18next";
import EstateDetails from "../Eclient/EstateDetails";


const MyEstates = () => {
  const { t } = useTranslation();
  const [estates, setEstates] = useState(null);
  const [curEstate, setCurEstate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const targetCardRef = useRef(null);

  const fetchEstates = useCallback(async () => {
    try {
      const response = await _get("emAgent/getAgentEstates");
      console.log(response.data);
      setEstates(response.data);
      const newPaginatedData = response.data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      setPaginatedData(newPaginatedData);
    } catch (error) {
      console.error("Error fetching estates:", error);
    }
  }, [currentPage, pageSize]);
  
  useEffect(() => {
    fetchEstates();
  }, [fetchEstates]);
  

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (targetCardRef.current) {
      targetCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {estates === null ? (
        <div
          style={{ textAlign: "center", padding: "20px" }}
          className="content-container"
        >
          <Spin size="large"                style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // This centers the loader
    }}/>
          <p>{t("dashboard.l1")}</p>
        </div>
      ) : estates.length === 0 ? (
        <Col
          span={24}
          style={{ textAlign: "center" }}
          className="content-container"
        >
          <Empty description="No Estates found, Please select other filters" />
        </Col>
      ) : (
        <div ref={targetCardRef}>
          <Row gutter={[16, 16]}>
            {paginatedData.map((property, index) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={8}
                xxl={6}
                key={index}
                style={{ marginBottom: "16px" }}
              >
                <Card
                  hoverable
                  style={{
                    width: "97%",
                    padding: "5px",
                    margin: 0,
                    boxShadow: "#c3e3f7 0px 5px 10px",
                    border: "1px solid #979ba1",
                  }}
                  onClick={() => {
                    setShowModal(!showModal);
                    setCurEstate(property);
                  }}
                  bodyStyle={{ padding: 10 }}
                >
                  <Row
                    gutter={[16, 16]}
                    style={{ margin: 0 }}
                    justify="center"
                    align="middle"
                  >
                    <Col span={24} style={{ padding: 0 }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "0px",
                          background: "rgba(240, 220, 247, 0.9)",
                          color: "rgb(13,65,107)",
                          fontWeight: "bold",
                          padding: "5px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        {property.landDetails.landTitle}
                      </div>
                      <img
                        alt={property.landDetails.landTitle}
                        src={property.landDetails.uploadPics[0]}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Col>
                  </Row>

                  <Row style={{ marginTop: "10px" }}>
                    <Col
                      span={12}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <AppstoreOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {property.landDetails.size}{" "}
                        <small>{property.landDetails.sizeUnit}</small>
                      </span>
                    </Col>
                    <Col
                      span={12}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <AreaChartOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {property.landDetails.surveyNo}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={12}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <UserOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {property.landDetails?.landType !== "None"
                          ? property.buildingDetails?.buildingType
                          : "Empty land"}
                      </span>
                    </Col>
                    <Col
                      span={12}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <EnvironmentOutlined
                        style={{
                          fontSize: "15px",
                          color: "#0d416b",
                          width: "15px",
                        }}
                      />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {property.address.village}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={16} style={{ textAlign: "center", alignItems:"center", }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                          gap:"5px"
                        }}
                      >
                        Services Requested: {property.serviceReq.join(", ")}
                      </span>
                    </Col>

                    <Col span={8}>
                      <Button
                        style={{
                          background:
                            "linear-gradient(135deg, #f0dcf7, #04befe)",
                          color: "black",
                          border: "none",
                          borderRadius: "7px",
                          marginTop: "4%",
                          float: "right",
                          marginRight: "9%",
                          height: "30px",
                        }}
                        onClick={() => {
                          setShowModal(!showModal);
                          setCurEstate(property);
                        }}
                      >
                        More...
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
            {showModal && (
              <Modal
                title={
                  <div className="PropertyStyle">
                    <span>
                      {curEstate.landDetails.landTitle?.replace(
                        /\b\w/g,
                        (char) => char.toUpperCase()
                      )}
                    </span>
                  </div>
                }
                open={showModal}
                onCancel={() => setShowModal(!showModal)}
                width={700}
                style={{ marginTop: "-5%" }}
                footer={null}
              >
                <EstateDetails curEstate={curEstate} />
              </Modal>
            )}
          </Row>
          {estates.length > 6 && (
            <Row align="middle" style={{ margin: "20px 0" }}>
              <Col>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={estates.length}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  pageSizeOptions={["6", "12", "18"]}
                />
              </Col>
            </Row>
          )}
        </div>
      )}
    </>
  );
};

export default MyEstates;

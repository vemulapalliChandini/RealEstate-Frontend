import React from "react";
import {
  Card,
  Row,
  Col,
  Grid,
  Divider,
  Carousel,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  AppstoreOutlined,
  PhoneOutlined,
  AreaChartOutlined,
    MoneyCollectOutlined,
  HomeOutlined,
  MailOutlined,
  ClockCircleOutlined,
  ApartmentOutlined,
  BarsOutlined,
  GlobalOutlined,
  BankOutlined,
  BorderOuterOutlined,
  NumberOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faSign } from "@fortawesome/free-solid-svg-icons";

const { useBreakpoint } = Grid;

const EstateDetails = ({ curEstate }) => {
  const screens = useBreakpoint();
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  return (
    <div>
      {/* <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div> */}
      <Row gutter={16}>
        <Col span={24}>
          {curEstate.landDetails.uploadPics.length > 1 ? (
            <Carousel arrows autoplay>
              {curEstate.landDetails.uploadPics.map((pic, index) => (
                <div key={index}>
                  <img
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                    }}
                    alt={`property-${index}`}
                    src={pic}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div>
              <img
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                }}
                alt={`property`}
                src={curEstate.landDetails.uploadPics[0]}
              />
            </div>
          )}
        </Col>
        <Col span={24} style={{ marginTop: "20px" }}>
          <span>
            {curEstate.landDetails.loan && (
              <>
                <strong>Loan Description: </strong>{" "}
                {curEstate.landDetails.loanDesc}
              </>
            )}
          </span>
        </Col>
        <Col span={24}>
          <span>
            {curEstate.serviceReq && curEstate.serviceReq.length > 0 && (
              <>
                <strong>Services Required: </strong>
                {curEstate.serviceReq
                  .map(
                    (service) =>
                      service.charAt(0).toUpperCase() +
                      service.slice(1).toLowerCase()
                  )
                  .join(", ")}
              </>
            )}
          </span>
        </Col>
      </Row>
      <Divider />
      <Row
        gutter={[16, 16]}
        style={{ marginTop: "20px" }}
        className="modalComm"
      >
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <Card
            className="getComm"
            title={<>Owner Details</>}
            style={{
              margin: 0,
              padding: 10,
              height: !screens.xs ? "170px" : "150px",
            }}
          >
            <UserOutlined />{" "}
            <span>
              <strong>Name:</strong> {curEstate.ownerDetails.name}
            </span>
            <br></br>
            <PhoneOutlined />{" "}
            <span>
              <strong>Contact:</strong>  {formatPhoneNumber(curEstate.ownerDetails.phoneNumber)}
            </span>
            {curEstate.ownerDetails.email && (
              <>
                <br></br>
                <MailOutlined />{" "}
                <span>
                  <strong>Email:</strong> {curEstate.ownerDetails.email}
                </span>
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <Card
            className="getComm"
            title={<>Land Details</>}
            style={{
              margin: 0,
              padding: 10,
              height: !screens.xs ? "170px" : "150px",
            }}
          >
            <HomeOutlined />{" "}
            <span>
              <strong>Type:</strong>{" "}
              {curEstate.landDetails?.landType !== "None"
                ? curEstate.landDetails?.landType
                : "Empty land"}
            </span>
            <br></br>
            <AppstoreOutlined />{" "}
            <span>
              <strong>Size:</strong> {curEstate.landDetails.size}{" "}
              <small> {curEstate.landDetails.sizeUnit}</small>
            </span>
            <br></br>
            <MoneyCollectOutlined />{" "}
            <span>
              <strong>Market Value:</strong> ₹{curEstate.landDetails.marketValue}
            </span>
            <br></br>
            <AreaChartOutlined />{" "}
            <span>
              <strong>Survey Number:</strong> {curEstate.landDetails.surveyNo}
            </span>
          </Card>
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        style={{ marginTop: "20px" }}
        className="modalComm"
      >
        {curEstate.landDetails.landType === "Building" && (
          <>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Card
                className="getComm"
                title={<>Building Details</>}
                style={{
                  margin: 0,
                  padding: 10,
                  height: !screens.xs ? "170px" : "150px",
                }}
              >
                <HomeOutlined />{" "}
                <span>
                  <strong>Type:</strong>{" "}
                  {curEstate.buildingDetails.buildingType}
                </span>
                <br></br>
                <FontAwesomeIcon icon={faDoorOpen} />{" "}
                <span>
                  <strong>Facing:</strong> {curEstate.buildingDetails.facing}
                </span>
                <br></br>
                <ClockCircleOutlined />{" "}
                <span>
                  <strong>Age:</strong> {curEstate.buildingDetails.propertyAge}{" "}
                  <small>months</small>
                </span>
              </Card>
            </Col>
            {curEstate.buildingDetails.buildingType === "Residence" && (
              <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <Card
                  className="getComm"
                  title={<>Residence Details</>}
                  style={{
                    margin: 0,
                    padding: 10,
                    height: !screens.xs ? "170px" : "150px",
                  }}
                >
                  <FontAwesomeIcon icon={faSign} />{" "}
                  <span>
                    <strong>Door No:</strong> {curEstate.residence.doorNo}
                  </span>
                  <br></br>
                  <DatabaseOutlined />{" "}
                  <span>
                    <strong>No of Floors:</strong>{" "}
                    {curEstate.residence.floorCount}
                  </span>
                  <br></br>
                  <HomeOutlined />{" "}
                  <span>
                    <strong>Type:</strong> {curEstate.residence.bedRoomType}
                    BHK
                  </span>
                </Card>
              </Col>
            )}
            {curEstate.buildingDetails.buildingType === "Apartment" && (
              <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <Card
                  className="getComm"
                  title={<>Apartment Details</>}
                  style={{
                    margin: 0,
                    padding: 10,
                    height: !screens.xs ? "170px" : "150px",
                  }}
                >
                  <BarsOutlined />{" "}
                  <span>
                    <strong>No of Floors:</strong>{" "}
                    {curEstate.apartment.floorCount}
                  </span>
                  <br></br>
                  <ApartmentOutlined />{" "}
                  <span>
                    <strong>Houses:</strong> {curEstate.apartment.houseCount}{" "}
                    <small>/floor</small>
                  </span>
                </Card>
              </Col>
            )}
          </>
        )}
      </Row>
      <Row
        gutter={[16, 16]}
        style={{ marginTop: "20px" }}
        className="modalComm"
      >
        <Col span={24}>
          <Card
            className="getComm"
            title={<>Address</>}
            style={{ margin: 0, padding: 10, height: "93%" }}
          >
            {curEstate.address.pinCode &&
              curEstate.address.pinCode !== "000000" && (
                <span>
                  <>
                    <NumberOutlined /> <strong>Pincode:</strong>{" "}
                    {curEstate.address.pinCode}
                  </>
                </span>
              )}
            <HomeOutlined
              style={{
                marginLeft:
                  curEstate.address.pinCode &&
                  curEstate.address.pinCode !== "000000" &&
                  "2%",
              }}
            />{" "}
            <span>
              <strong>Village:</strong> {curEstate.address.village}
            </span>
            <BorderOuterOutlined
              style={{
                marginLeft: "2%",
              }}
            />{" "}
            <span>
              <strong>Mandal:</strong> {curEstate.address.mandal}
            </span>
            {curEstate.address.pinCode &&
              curEstate.address.pinCode !== "000000" && <br></br>}
            <EnvironmentOutlined
              style={{
                marginLeft:
                  !(
                    curEstate.address.pinCode &&
                    curEstate.address.pinCode !== "000000"
                  ) && "2%",
              }}
            />{" "}
            <span>
              <strong>District:</strong> {curEstate.address.district}
            </span>
            {!(
              curEstate.address.pinCode &&
              curEstate.address.pinCode !== "000000"
            ) && <br></br>}
            <BankOutlined
              style={{
                marginLeft:
                  curEstate.address.pinCode &&
                  curEstate.address.pinCode !== "000000" &&
                  "2%",
              }}
            />{" "}
            <span>
              <strong>State:</strong> {curEstate.address.state}
            </span>
            <GlobalOutlined
              style={{
                marginLeft: "2%",
              }}
            />{" "}
            <span>
              <strong>Country:</strong> {curEstate.address.country}
            </span>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            className="getComm"
            title={<>Amenities</>}
            style={{ margin: 0, padding: 10, height: "93%" }}
          >
            <ThunderboltOutlined />{" "}
            <span>
              <strong>Electricity: </strong>
              {curEstate.amenities.electricity ? "Yes" : "No"}
            </span>
            {/* <br></br> */}
            <ExperimentOutlined
              style={{
                marginLeft: "2%",
              }}
            />{" "}
            <span>
              <strong>Water Facility: </strong>
              {curEstate.amenities.waterFacility ? "Yes" : "No"}
            </span>
            {/* <br></br> */}
            <CompassOutlined
              style={{
                marginLeft: "2%",
              }}
            />{" "}
            <span>
              <strong>Ground Water Level:</strong>{" "}
              {curEstate.amenities.groundWaterLevel}
            </span>
            {curEstate.landDetails.landType === "Building" && (
              <>
                <br></br>
                <DatabaseOutlined />{" "}
                <span>
                  <strong>CCTV: </strong>
                  {curEstate.amenities.ccTv ? "Yes" : "No"}
                </span>
                {/* <br></br> */}
                <DatabaseOutlined
                  style={{
                    marginLeft: "2%",
                  }}
                />{" "}
                <span>
                  <strong>Watch Man: </strong>
                  {curEstate.amenities.watchMan ? "Yes" : "No"}
                </span>
                {/* <br></br> */}
                <DatabaseOutlined
                  style={{
                    marginLeft: "2%",
                  }}
                />{" "}
                <span>
                  <strong>Lift: </strong>
                  {curEstate.amenities.lift ? "Yes" : "No"}
                </span>
                {curEstate.buildingDetails.buildingType === "Residence" && (
                  <>
                    {/* <br></br> */}
                    <DatabaseOutlined
                      style={{
                        marginLeft: "2%",
                      }}
                    />{" "}
                    <span>
                      <strong>Parking: </strong>
                      {curEstate.amenities.parking ? "Yes" : "No"}
                    </span>
                  </>
                )}
                {curEstate.buildingDetails.buildingType === "Apartment" && (
                  <>
                    {/* <br></br> */}
                    <DatabaseOutlined
                      style={{
                        marginLeft: "2%",
                      }}
                    />{" "}
                    <span>
                      <strong>Power BackUp: </strong>
                      {curEstate.amenities.powerBackup ? "Yes" : "No"}
                    </span>
                    <br></br>
                    <DatabaseOutlined />{" "}
                    <span>
                      <strong>Rain water Storage: </strong>
                      {curEstate.amenities.rainWaterStorage ? "Yes" : "No"}
                    </span>
                    {/* <br></br> */}
                    <DatabaseOutlined
                      style={{
                        marginLeft: "2%",
                      }}
                    />{" "}
                    <span>
                      <strong>swimming Pool: </strong>
                      {curEstate.amenities.swimmingPool ? "Yes" : "No"}
                    </span>
                  </>
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EstateDetails;

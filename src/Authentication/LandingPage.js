import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  Card,
  Input,
  Row,
  Col,
  Button,
  Carousel,
  Grid,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import LoginPage from "./LoginPage";
import HeaderWithTabs from "./HeaderWithTabs";


import NewFooter from "./NewFooter";
import NewHeader from "./NewHeader";
import "./Styles/LandingPage.css";
import "./Styles/FooterStyle.css";
import { Empty } from "antd";
import { _get } from "../Service/apiClient";
import Options from "./Options";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faRuler } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import img1 from "../images/landing1.jpeg";
import img2 from "../images/landing2.jpeg";
import img3 from "../images/landing5.jpeg";
import img4 from "../images/landing8.jpeg";

const { Search } = Input;
const { Meta } = Card;
const { Content } = Layout;
const { useBreakpoint } = Grid;



const LandingPage = () => {
  const screens = useBreakpoint();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  const [searchQuery, setSearchQuery] = useState("");
  const [landDetails, setLandDetails] = useState([]);
  const [defaultLandDetails, setDefaultLandDetails] = useState([]);

  // const [activeTab, setActiveTab] = useState(null);


  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);

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









  const rowRef = useRef(null);
  const categories = [
    t("landing.agricultural"),
    t("landing.commercial"),
    t("landing.layout"),
    t("landing.residential"),
    t("landing.estateManagement"),
  ];
  const [imageUrls, setImageUrls] = useState([img1, img2, img3, img4]);
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [categories.length]);
  const fetchData = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
  localStorage.removeItem("agentrole");
    localStorage.removeItem("language");
    localStorage.setItem("form", false);
    localStorage.removeItem("type");
    localStorage.removeItem("mtype");
    await _get("/getallprops")
      .then((response) => {
        setLandDetails(response.data);
        setDefaultLandDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleSearch = (value) => {
    if (rowRef.current && searchQuery != "") {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    filterImages(searchQuery);
  };

  const filterImages = (query) => {
    if (query.trim() === "") {
      setLandDetails(defaultLandDetails);
    } else {
      const filtered = defaultLandDetails.filter((item) =>
        item.district.toLowerCase().includes(query.toLowerCase())
      );
      setLandDetails(filtered);
    }
  };

  const handleLoginClose = () => {
    setIsLoginVisible(false);
  };
 
  return (
    <>
      {/* <NewHeader
        setIsLoginVisible={setIsLoginVisible}
        isLoginVisible={isLoginVisible}
      /> */}
   
        <LoginPage
          visible={isLoginVisible}
          handleLoginClose={handleLoginClose}
        />

        {/* <Content
          style={{
            marginTop: "30px",
          }}
        > */}

          {/* ffff */}
          <div className="background">

            <Carousel autoplay dots={false} infinite={true}>
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    style={{
                      width: "100%",
                      height: screens.xs ? "330px" : "450px",
                      objectFit: "cover",
                      filter: index === 1 ? "grayscale(40%)" : "none", // Apply grayscale to the first image
                    }}
                  />
                </div>
              ))}
            </Carousel>;
            {/* chcek1 */}
            {/* Conditional Rendering for "Find Your Dream Property" */}
            <div
              style={{
                position: "relative",
                top: "-70%",
                margin: "0 auto",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <HeaderWithTabs setIsVisible={setIsVisible} />

              {/* <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: "20px",
                  maxWidth: screens.xs ? "230px" : "450px",
                  margin: "0 auto",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    marginLeft: "8%",
                    fontSize: screens.xs ? "0.6rem" : "1.1rem",
                  }}
                >
                  <h1
                    id="typing-text"
                    className="typing-animation color-animation"
                  >
                    {t("landing.findYourDreamProperty")}
                  </h1>
                </div>
                <div className="searchbar">
                  <Search
                    style={{
                      width: "70%",
                    }}
                    placeholder={t("landing.searchPlaceholder")}
                    allowClear
                    icon={SearchOutlined}
                    size="large"
                    className="landingSearch"
                    value={searchQuery}
                    onSearch={handleSearch}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                  />
                </div>
              </div>  */}















            </div>
            {isVisible && (
              <div
                style={{
                  position: "relative",
                  top: "-65%",
                  margin: "0 auto",
                  textAlign: "center",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "20px",
                    maxWidth: screens.xs ? "230px" : "450px",
                    margin: "0 auto",
                    borderRadius: "10px",
                  }}
                >
                  <h1
                    id="typing-text"
                    className="typing-animation color-animation"
                  >
                    {t("landing.findYourDreamProperty")}
                  </h1>
                  <div className="searchbar">
                    <Search
                      style={{
                        width: "70%",
                      }}
                      placeholder={t("landing.searchPlaceholder")}
                      allowClear
                      icon={SearchOutlined}
                      size="large"
                      className="landingSearch"
                      value={searchQuery}
                      onSearch={handleSearch}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}


            {/* chcek1 */}

            <div
              className="options"
              style={{
                position: "relative",
                top: "-60%",
                // left: "31%",
                left: "26%",
                margin: "0 auto",
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <button
                className="single-option-button option-button"
                onClick={() => setIsLoginVisible(true)}
              >
                {categories[activeCategory]}
              </button>

              <div className="multi-option-buttons">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="option-button"
                    onClick={() => setIsLoginVisible(true)}
                    style={{
                      border: "1px solid gray",
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      color: "black",
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* <h1>hello </h1> */}
          <Options />

          {/* <Ads /> */}

          <Row
            ref={rowRef}
            className="cards-container"
            style={{ marginTop: "6%", padding: "20px" }}
            gutter={[24, 24]}
          >
            {landDetails.length > 0 ? (
              landDetails.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                  <Card
                    key={item._id}
                    hoverable
                    className="card-item"
                    cover={
                      <div
                        className="image-container"
                        style={{ position: "relative" }}
                      >
                        <img
                          alt={item.title}
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0]
                              : item.propertyType.includes("Agricultural")
                                ? "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582181/agricultural_b1cmq0.png"
                                : "https://res.cloudinary.com/ds1qogjpk/image/upload/v1735582521/commercial_qqcdbt.png"
                          }
                          style={{
                            height: "164px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          onClick={() => {
                            setIsLoginVisible(true);
                          }}
                        />

                        {/* <div
className="price-tag"
style={{
position: "absolute",
top: "10px",
left: "12px",
right: "40px",
backgroundColor: "#329da8",
color: "white",
padding: "5px 16px",
borderRadius: "5px",
}}
>
₹{formatNumberWithCommas(item.price)}
</div> */}


                        <div
                          className="price-tag"

                        >
                          <div style={{
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            backgroundColor: "#329da8",
                            color: "white",
                            padding: "5px 16px",
                            borderRadius: "5px",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                          }}>
                            {item.title}
                          </div>
                          <div style={{
                            position: "absolute",
                            top: "0px",
                            left: "270px",
                            backgroundColor: "#329da8",
                            color: "white",
                            padding: "5px 16px",
                            borderRadius: "5px",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                          }}>
                            ₹{formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <Meta
                      description={
                        <div>

                          <Row gutter={[16, 16]}>
                            <Col span={12}>
                              <p>
                                <FontAwesomeIcon
                                  icon={faRuler}
                                  style={{
                                    marginRight: "5px",
                                    color: "#007bff",
                                  }}
                                />
                                <strong>{item.size}</strong>{" "}
                                {item.title.includes("Land")
                                  ? "acre"
                                  : "sq. ft"}
                              </p>
                            </Col>
                            <Col span={12}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faMapMarkerAlt}
                                  style={{
                                    marginRight: "10px",
                                    color: "#007bff",
                                  }}
                                />
                                <strong
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100px",
                                    display: "inline-block",
                                  }}
                                >
                                  {item.district}
                                </strong>
                              </span>
                            </Col>
                          </Row>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: "centre" }}>
                <Empty description={t("landing.noPropertiesFound")} />
              </Col>
            )}
          </Row>

          {landDetails.length > 12 && (
            <div>
              <Button
                style={{
                  margin: "0 1% 1% 0",
                  fontWeight: "bold",
                  float: "right",
                  background: "linear-gradient(135deg, #007BFF, #00AEEF)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onClick={() => setIsLoginVisible(true)}
              >
                {" "}
                {t("landing.showMore")}
              </Button>
            </div>
          )}
        {/* </Content>
      </Layout>
      <NewFooter /> */}
    </>
  );
};

export default LandingPage;
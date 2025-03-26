import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Button,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import LoginPage from "./LoginPage";
import NewFooter from "./NewFooter";
import "./Styles/LandingPageEx.css";
import "./Styles/FooterStyle.css";
import { Empty } from "antd";
import { _get } from "../Service/apiClient";
import Options from "./Options";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faMapMarkerAlt, faRuler } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import img1 from "../images/srikakulam.jpeg";
import img2 from "../images/image.jpeg";
import img3 from "../images/residential.jpeg";
import img4 from "../images/vizianagaram.jpeg";
const { Search } = Input;

const LandingPageEx = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [landDetails, setLandDetails] = useState([]);
  const [defaultLandDetails, setDefaultLandDetails] = useState([]);
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  let isVisible=true;
  const formatPrice = (price) => {
    if (price == null) {
      return "N/A";
    }
    if (price >= 1_00_00_000) {
      return (price / 1_00_00_000).toFixed(1) + "Cr";
    } else if (price >= 1_00_000) {
      return (price / 1_00_000).toFixed(1) + "L"; 
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1) + "k"; 
    } else {
      return price.toString(); 
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
    localStorage.removeItem("agentrole");
    localStorage.removeItem("role");
    localStorage.removeItem("language");
    localStorage.setItem("form", false);
    localStorage.removeItem("type");
    localStorage.removeItem("mtype");
    localStorage.removeItem("isLoading");
    await _get(`/getallprops?offset=1`)
      .then((response) => {
        setLandDetails(response.data);
        setDefaultLandDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleSearch = () => {
    if (rowRef.current && searchQuery !== "") {
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
      <LoginPage
        visible={isLoginVisible}
        handleLoginClose={handleLoginClose}
      />
      <div
      className="lbackground-image"
      >
                <div
          className="lbackground-overlay"
        ></div>
    <div className="relative-container">
  {isVisible && (
    <div className="overlay-box">
      <h1 id="typing-text" className="typing-heading typing-animation color-animation">
        {t("landing.findYourDreamProperty")}
      </h1>
      <div className="searchbar">
        <Search
          className="landingSearch"
          placeholder={t("landing.searchPlaceholder")}
          allowClear
          icon={SearchOutlined}
          size="large"
          value={searchQuery}
          onSearch={handleSearch}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )}
</div>

<div className="options-container">
  <div className="options-wrapper">
    <button
      className="single-option-button"
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
        >
          {category}
        </button>
      ))}
    </div>
  </div>
</div>

      </div>
      <Card style={{ position: "relative", borderRadius: "8px", marginBottom: "10%" }}>
                <div style={{ position: "relative", height: "300px" }}>
          <img
            alt="Card background"
            src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738848138/Screenshot_from_2025-02-06_18-51-17_wnrfce.png" 
            style={{
              width: "50%",
              height: "100%",
              marginLeft: "50%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%", 
              height: "100%",
              backgroundColor: "rgb(221 190 144 / 70%)", 
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%", 
              height: "100%",
              fontSize: "30px",
              marginLeft: "10%",
              marginTop: "1%",

            }}
          ><b>Explore Our Services</b></div>
        </div>
        <Card
          style={{
            position: "absolute",
            top: "81%",
            left: "124px",
            width: "80%",
            right: 0,
            transform: "translateY(-50%)", 
            borderRadius: "8px",
            backgroundColor: "white",
            padding: "16px",
            height: "307px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Row gutter={[16, 16]}>
                        <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 1"
                      src="https://static.99acres.com/universalhp/img/hp_commercial_buy.webp" 
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: "5px" }}>
                      <h4><b> Commercial Property</b></h4>
                      <p>Shops,Offices,Factories</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 2"
                      src="https://static.99acres.com/universalhp/img/hp_plot_land.webp" 
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: "16px" }}>
                      <h4><b>Plots</b></h4>
                      <p>Residential PLots</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 3"
                     src={img2}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: "16px" }}>
                      <h4><b>Agricultural Land</b></h4>
                      <p>Farming and Cultivation</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 4"
                      src={img3}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: "16px" }}>
                      <h4><b>Residential Flats</b></h4>
                      <p>Flats,Individual Houses and Villas</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 5"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTbTNYM5Cs2PlgZ-i9Qw_3OGBYlPhiQB3SeA&s"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: "16px" }}>
                      <h4><b>Rent/Lease</b></h4>
                      <p>Shops,Living</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Card>
      <Options />
      <Card style={{ position: "relative", borderRadius: "8px", marginBottom: "10%",marginTop:"7%" }}>
        <div style={{ position: "relative", height: "300px" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%", 
              height: "100%",
              backgroundColor: "rgb(221 190 144 / 70%)", 
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 30,
              width: "50%",
              height: "100%",
              fontSize: "30px",
              marginLeft: "2%",
              marginTop: "6%",

            }}
          ><b> Find Your Dream Property</b> <p style={{ fontSize: "18px", color: "black", marginTop: "10px", marginRight: "27%" }}>
          Find your dream home with our expert real estate agents. Discover properties that perfectly match your lifestyle and budget!
        </p></div>
        </div>
        <Card
          style={{
            position: "absolute",
            top: "71%",
            left: "70%",
            width: "50%", 
            height: "400px", 
            transform: "translate(-50%, -50%)", 
            borderRadius: "12px",
            backgroundColor: "white",
            padding: "0", 
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <img
            alt="Card"
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
            style={{
              width: "100%",
              height: "100%",
              maxHeight:"349px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
            onClick={() => {
              setIsLoginVisible(true);
            }}
          />
        </Card>
      </Card>
      <h1 style={{ marginTop: "3%", marginLeft: "1%" }}><b>Recomended Projects</b></h1>
      <Row
        ref={rowRef}
        className="cards-container"
        style={{ marginTop: "2%", padding: "20px" }}
        gutter={[24, 24]}
      >
        {landDetails.length > 0 ? (
          landDetails.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
           <div style={{ position: "relative", display: "inline-block" }}>
              <img
    src="https://static.99acres.com/universalapp/img/Shortlist.png"
    alt="Shortlist"
    style={{
      position: "absolute",
      top: "8px",
      right: "8px",
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      padding: "4px",
      zIndex: 10, 
    }}
    onClick={() => setIsLoginVisible(true)}
  />
  <Card
    key={item._id}
    hoverable
    className="card-item"
    style={{
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "#e0ecf3",
      boxShadow: "0 16px 16px rgba(0, 0, 0, 0.1)",
      position: "relative",
    }}
  >
    <Row gutter={[16, 16]}>
      <Col span={10}>
        <div style={{ height: "100%", position: "relative" }}>
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
              height: "130px",
              width: "130px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            onClick={() => setIsLoginVisible(true)}
          />
        </div>
      </Col>
      <Col span={14}>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, color: "black" }}> <b>{item.title}</b></h3>
          </div>

          <Row gutter={[16, 16]} style={{ marginBottom: "8px" }}>
            <Col span={24}>
              <p style={{ margin: 0, color: "black" }}>
                <FontAwesomeIcon
                  icon={faRuler}
                  style={{ marginRight: "5px", color: "#0d416b" }}
                />
                {item.size} {item.sizeUnit}-<span style={{ color: "black" }}>
                  ₹{formatPrice(item.price)}
                </span>
              </p>
            </Col>
          </Row>
          <Col span={24}>
            <span style={{ display: "flex", alignItems: "center", color: "black" }}>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{ marginRight: "10px", color: "#0d416b" }}
              />
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "120px",
                  display: "inline-block",
                }}
              >
                {item.district}
              </span>
            </span>
          </Col>
        </div>
      </Col>
    </Row>
    <div style={{ marginTop: "16px", borderTop: "1px solid rgba(39, 38, 38, 0.2)", paddingTop: "8px" }}>
      <p style={{ margin: 0, display: "flex", alignItems: "center", color: "black", fontSize: "17px" }}>
        <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "8px", color: "#0d416b" }} />
        Get preferred options
      </p>
    </div>
  </Card>
</div>
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
      <Card style={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", width: "80%", marginLeft: "9%", marginTop: "3%", backgroundColor: "#e0ecf3", height: "390px" }}>
        <Row gutter={[16, 16]}>
                    <Col span={12}>
            <h1 style={{ marginBottom: "16px", fontSize: "35px" }}><b>Register to post your property for </b><span style={{ backgroundColor: "green", color: "white", padding: "2px 6px", borderRadius: "4px" }}>FREE</span></h1>
            <h1>10K+ Listings</h1>
            <Button style={{ marginBottom: "16px", backgroundColor: "rgb(33, 101, 155)", color: "white" }}>Post Your Property Here</Button>

            <p style={{ fontSize: "14px", color: "#555" }}>
              Or post your property through WhatsApp
              <span style={{ marginLeft: "8px" }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  style={{ width: "20px", verticalAlign: "middle" }}
                />
                <span style={{ marginLeft: "4px", fontWeight: "bold" }}>+91 98765 43210</span>
              </span>
            </p>
          </Col>
          <Col span={12}>
            <img
              src="https://daganghalal.blob.core.windows.net/28193/Product/1000x1000__realestate-1642669654151.jpg" 
              alt="Property"
              style={{ width: "59%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
            />
          </Col>
        </Row>
      </Card>
      <h1 style={{ marginTop: "5%", marginLeft: "5%" }}><b>Apartments , Villas and more...</b></h1>
      <Row style={{ marginLeft: "5%" }}>
        <Col span={8} style={{ position: "relative" }}>
          <img
            alt="Card 2"
            src="https://i.pinimg.com/736x/a1/34/19/a134196d984c1e5e0ae14655d1b8d266.jpg"
            style={{
              width: "70%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Independent House/Villa
          </div>
        </Col>
        <Col span={8} style={{ position: "relative" }}>
          <img
            alt="Card 2"
            src="https://api.makemyhouse.com/public/Media/rimage/1024/designers_project/1583579237_37.jpg?watermark=false"
            style={{
              width: "70%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Residential Apartment
          </div>
        </Col>
        <Col span={8} style={{ position: "relative" }}>
          <img
            alt="Card 2"
            src="https://static.99acres.com/universalhp/img/d_hp_property_type_4.webp"
            style={{
              width: "70%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Independent Builder/Floor
          </div>
        </Col>
      </Row>
      <h1 style={{ marginTop: "5%", marginLeft: "5%" }}><b>Explore Real Estate in Popular Indian Cities</b></h1>
      <Row style={{ marginLeft: "5%" }}>
        <Col span={4}>
          <img
            alt="Card 1"
            src="https://www.telugubulletin.com/wp-content/uploads/2021/07/vizag-beach.jpg" // Replace with your image URL
            style={{
              width: "80%",
              height: "80%",
              objectFit: "cover",
              marginLeft: "5%",
              marginBottom: "2%",
            }}
          />
        </Col>
        <Col span={3} style={{ marginTop: "2%" }}>
          <h3><b>Visakhapatnam</b></h3>
        </Col>
        <Col span={4}>
          <img
            alt="Card 1"
            src={img4} // Replace with your image URL
            style={{
              width: "80%",
              height: "80%",
              objectFit: "cover",
              marginLeft: "5%",
              marginBottom: "2%",
            }}
          />
        </Col>
        <Col span={3} style={{ marginTop: "2%" }}>
          <h3><b>Vizianagaram</b></h3>
        </Col>
        <Col span={4}>
          <img
            alt="Card 1"
           src={img1}
            style={{
              width: "60%",
              height: "80%",
              objectFit: "cover",
              marginLeft: "5%",
              marginBottom: "2%",
            }}
          />
        </Col>
        <Col span={3} style={{ marginTop: "2%" }}>
          <h3><b>Srikakulam</b></h3>
        </Col>
      </Row>
      <NewFooter />
    </>
  );
};

export default LandingPageEx;

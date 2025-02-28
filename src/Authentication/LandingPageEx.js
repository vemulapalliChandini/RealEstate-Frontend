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
  Divider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import LoginPage from "./LoginPage";
import HeaderWithTabs from "./HeaderWithTabs";

import NewFooter from "./NewFooter";
import NewHeader from "./NewHeader";
import "./Styles/LandingPageEx.css";
import "./Styles/FooterStyle.css";
import { Empty } from "antd";
import { _get } from "../Service/apiClient";
import Options from "./Options";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faMapMarkerAlt, faRuler } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import img1 from "../images/landing1.jpeg";
import img2 from "../images/landing2.jpeg";
import img3 from "../images/landing5.jpeg";
import img4 from "../images/landing8.jpeg";
import RealEstate from "./RealEstate";

const { Search } = Input;
const { Meta } = Card;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const LandingPageEx = () => {
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

      <LoginPage
        visible={isLoginVisible}
        handleLoginClose={handleLoginClose}
      />
      <div
        style={{
          backgroundImage: "url('https://res.cloudinary.com/ds1qogjpk/image/upload/v1738754839/ai-generative-3d-modern-luxury-r_gjcg0h.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "-10%",
          height: "65vh", // Ensure it covers the full height of the viewport
          position: "relative", // To stack elements correctly
        }}
      >
        {/* Black overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Black overlay with opacity
            zIndex: 1, // Place overlay beneath content
          }}
        ></div>

        {/* Content section that should be visible on top of the overlay */}
        <div
          style={{
            position: "relative",
            top: "28%", // Adjust to place the content properly on the screen
            textAlign: "center",
            zIndex: 2, // Ensure content is above the overlay
            color: "white", // Text color for visibility
          }}
        >
          {isVisible && (
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                padding: "40px",
                maxWidth: screens.xs ? "230px" : "545px",

                marginTop: "7%",
                marginLeft: "35%",
                borderRadius: "10px",
                zIndex: 2, // Ensure content is above overlay
                flex: 1
              }}
            >
              <h1
                id="typing-text"
                className="typing-animation color-animation"
                style={{
                  color: "white", // Highlighted text color
                  fontSize: "33px",
                  fontWeight: "bold",
                  marginLeft: "2%",
                  marginBottom:"5%"
                }}
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
          )}

        </div>

        {/* The Explore button */}
        <div
          className="options"
          style={{
            position: "relative",
            top: "46%", // Adjust to position button properly
            left: "26%",
            margin: "0 auto",
            textAlign: "center",
            zIndex: 2, // Ensure content is above overlay
          }}
        >
          <div
            className="options"
            style={{
              position: "relative",
              top: "-60%",
              // left: "31%",
              left: "-15%",
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
                    border: "1px solid white",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          {/* <div style={{ marginTop: "-8%" }}>
      <RealEstate />
    </div> */}
        </div>
      </div>
      {/* <Ads /> */}
      <Card style={{ position: "relative", borderRadius: "8px", marginBottom: "10%" }}>
        {/* Background Image Card */}
        <div style={{ position: "relative", height: "300px" }}>
          <img
            alt="Card background"
            src="https://res.cloudinary.com/ds1qogjpk/image/upload/v1738848138/Screenshot_from_2025-02-06_18-51-17_wnrfce.png" // Replace with your image URL
            style={{
              width: "50%",
              height: "100%",
              marginLeft: "50%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          {/* Left Side Color Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%", // Takes half of the width
              height: "100%",
              backgroundColor: "rgb(221 190 144 / 70%)", // Set desired color
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%", // Takes half of the width
              height: "100%",
              fontSize: "30px",
              marginLeft: "10%",
              marginTop: "1%",

            }}
          ><b>Explore Our Services</b></div>
        </div>

        {/* Card content on top */}
        <Card
          style={{
            position: "absolute",
            top: "81%",
            left: "124px",
            width: "80%",
            right: 0,
            transform: "translateY(-50%)", // Centers the card vertically
            borderRadius: "8px",
            backgroundColor: "white",
            padding: "16px",
            height: "307px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Optional shadow for depth
          }}
        >

          {/* Row for cards */}
          <Row gutter={[16, 16]}>
            {/* Card 1 */}
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 1"
                      src="https://static.99acres.com/universalhp/img/hp_commercial_buy.webp" // Replace with your image URL
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

            {/* Card 2 */}
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 2"
                      src="https://static.99acres.com/universalhp/img/hp_plot_land.webp" // Replace with your image URL
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

            {/* Card 3 */}
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 3"
                      src="data:image/jpeg;base64,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" // Replace with your image URL
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

          {/* Row for second set of cards */}
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            {/* Card 4 */}
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 4"
                      src="data:image/jpeg;base64,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" // Replace with your image URL
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

            {/* Card 5 */}
            <Col span={8}>
              <Card
                hoverable
                style={{ borderRadius: "8px", overflow: "hidden", height: "110px" }}
              >
                <Row>
                  <Col span={12}>
                    <img
                      alt="Card 5"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTbTNYM5Cs2PlgZ-i9Qw_3OGBYlPhiQB3SeA&s" // Replace with your image URL
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
        {/* Background Image Card */}
        <div style={{ position: "relative", height: "300px" }}>

          {/* Left Side Color Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%", // Takes half of the width
              height: "100%",
              backgroundColor: "rgb(221 190 144 / 70%)", // Set desired color
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 30,
              width: "50%", // Takes half of the width
              height: "100%",
              fontSize: "30px",
              marginLeft: "2%",
              marginTop: "6%",

            }}
          ><b> Find Your Dream Property</b> <p style={{ fontSize: "18px", color: "black", marginTop: "10px", marginRight: "27%" }}>
          Find your dream home with our expert real estate agents. Discover properties that perfectly match your lifestyle and budget!
        </p></div>
        </div>

        {/* Card content on top */}
        <Card
          style={{
            position: "absolute",
            top: "71%",
            left: "70%",
            width: "50%", // Increased card width
            height: "400px", // Increased card height
            transform: "translate(-50%, -50%)", // Center both vertically and horizontally
            borderRadius: "12px",
            backgroundColor: "white",
            padding: "0", // Removed padding for a flush image fit
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            padding:"0px" // Slightly larger shadow for better depth
          }}
        >
          <img
            alt="Card"
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" // Replace with your image URL
            style={{
              width: "100%",
              height: "100%",
              maxHeight:"349px",
              objectFit: "cover", // Ensures the image covers the card without distortion
              borderRadius: "12px", // Same border radius as the card for a seamless look
            }}
            onClick={() => {
              setIsLoginVisible(true);
            }}
          />
        </Card>

      </Card>

      {/*  animations  */}





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
  {/* Shortlist Icon */}
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
      zIndex: 10, // Ensures it's above the card
    }}
    onClick={() => setIsLoginVisible(true)}
  />

  {/* Card Component */}
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
      {/* Left Column - Image */}
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

      {/* Right Column - Details */}
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

          {/* Card Footer */}
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
          {/* Left Column */}
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

          {/* Right Column */}
          <Col span={12}>
            <img
              src="https://daganghalal.blob.core.windows.net/28193/Product/1000x1000__realestate-1642669654151.jpg" // Replace with your image URL
              alt="Property Image"
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
            src="https://www.holidify.com/images/bgImages/VIZIANAGARAM.jpg" // Replace with your image URL
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
            src="data:image/jpeg;base64,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" // Replace with your image URL
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

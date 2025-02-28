
import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Dropdown,
  Input,
  Select,
  Slider,
  InputNumber,
  Grid,
  Modal,
  Button,
  Space,
  Card,
  Spin,
} from "antd";

import {
  PlusCircleOutlined,
  ShopOutlined,
  BorderInnerOutlined,
  BorderlessTableOutlined,
  HomeOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import Agriculture from "./Agricultural/Agriculture";
import AddProperty from "./Agricultural/AddProperty";
import LayoutForm from "./Layout/LayoutForm";
import ResidentialForm from "./Residential/ResidentialForm";
import CommercialForm from "./Commericial/CommercialForm";
import GetCommercial from "./Commericial/GetCommercial";
import GetLayout from "./Layout/GetLayout";
import Residential from "./Residential/Residential";
import { _get } from "../../Service/apiClient";

import { useTranslation } from "react-i18next";
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function SearchPage() {
  const screens = useBreakpoint();
  const [filterModal, setFilterModal] = useState(false);
  const { t, i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState(
    localStorage.getItem("mtype")
  );
  const [showData, setShowData] = useState(localStorage.getItem("mtype"));
  const [checkedValues, setCheckedValues] = useState("All");
  const [checkedTypes, setCheckedTypes] = useState("All");
  const [checkedHouseType, setCheckedValuesHouseType] = useState(["All"]);
  const [searchText, setSearchText] = useState("");
  const [villageList, setVillageList] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [sliderVisible, setSliderVisible] = useState(true);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(1000000);
  const [nameSearchQuery2, setNameSearchQuery2] = useState("");
  const [sliderRange, setSliderRange] = useState([0, Infinity]);
  const priceOptions = [
    { label: `${t("dashboard.all")}`, range: [0, Infinity] },
    { label: "0 - 500,000", range: [0, 500000] },
    { label: "500,000 - 1,000,000", range: [0, 1000000] },
    { label: "1,000,000 - 2,000,000", range: [0, 2000000] },
    { label: "2,000,000 - 4,000,000", range: [0, 4000000] },
    { label: "4,000,000 - 6,000,000", range: [0, 6000000] },
    { label: "6,000,000 - 8,000,000", range: [0, 8000000] },
    { label: "8,000,000 - 10,000,000", range: [0, 10000000] },
  ];
  const [sliderVisible1, setSliderVisible1] = useState(true);
  const [sizeRange, setSizeRange] = useState([0, Infinity]);
  const [inputValue1, setInputValue1] = useState([0, Infinity]);
  const [maxPriceFromAPI1, setMaxPriceFromAPI1] = useState();
  const [minsize, setMinSize] = useState(0);
  const [maxsize, setMaxSize] = useState(100000);
  const [maxsizefromAPIvalue, setMaxSizeAPIvalue] = useState(100000);
  const [sliderRangesize, setSliderRangesize] = useState([0, 100000]);
  const [showFormType, setShowFormType] = useState(null);
  const [checkedFeatureTypes, setCheckedFeatureTypes] = useState("All");
  const [purposeType,setPurposeType]=useState("All");
  const sizeOptions = [
    { label: `${t("dashboard.all")}`, range: [0, Infinity] },
    { label: "0 - 1,000", range: [0, 1000] },
    { label: "0 - 2,000", range: [0, 2000] },
    { label: "0 - 4,000", range: [0, 4000] },
    { label: "0 - 6,000", range: [0, 6000] },
    { label: "0 - 8,000", range: [0, 8000] },
    { label: "0 - 10,000", range: [0, 10000] },
  ];
   const [isLoading, setIsLoading] = useState(localStorage.getItem("isLoading") === "false");
    useEffect(() => {
       const checkLocalStorage = setInterval(() => {
         const localIsLoading = localStorage.getItem("isLoading") === "true";
         if (localIsLoading !== isLoading) {
           setIsLoading(localIsLoading);
         }
       }, 500); 
   
       return () => clearInterval(checkLocalStorage); // Cleanup on unmount
     }, [isLoading]);
  const [filters1, setFilters1] = useState({
    checkedValues: "All",
    searchText: searchText,
    priceRange: priceRange,
    sizeRange: sizeRange,
    checkedTypes: "All",
    checkedFeatureTypes: "All",
    checkedHouseType: "All",
    purposeType:"All",
  });
  const onCheckboxChange2 = (values) => {
    setCheckedFeatureTypes(values);

  };
  const handleButtonClick = (type) => {
    setShowFormType(type);
  };
  
  useEffect(() => {
    setSelectedType(localStorage.getItem("mtype"));
    setShowData(localStorage.getItem("mtype"));
    fetchVillages();
    setSliderVisible(true);
    setSliderVisible1(true);
    setAddressDetails({
      district: "",
      mandal: "",
      village: "",
    });
    maxsizefromAPI();
    fetchMaxPrice();
    setFilters1({
      checkedValues: "All",
      checkedFeatureTypes: "All",
      searchText: "all",
      priceRange: [0, Infinity],
      sizeRange: [0, Infinity],
      checkedTypes: "All",
      checkedHouseType: "All",
      purposeType:"All",
    });
    setSearchText("");
    function hideError(e) {
      if (
        e.message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    }

    window.addEventListener("error", hideError);
    return () => {
      window.addEventListener("error", hideError);
    };
  }, [showData]);


  const maxsizefromAPI = async () => {
    if (showData == "Agriculture") {
      try {
        const first = checkedValues.includes("sold") ? "sold" : "@";
        const second = checkedValues.includes("unSold") ? "unsold" : "@";
        const response = await _get(
          `property/maxSizeForAllProps/agricultural/@/@/@/@/@/${first}/${second}`
        );
        const data = await response.data.maxSize;

        setMaxSize(data);
        setMaxSizeAPIvalue(data);
        setSliderRangesize([0, data]);
        setSizeRange([0, data]);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    } else if (showData == "Commercial") {
      try {
        const first = checkedValues.includes("sold") ? "sold" : "@";
        const second = checkedValues.includes("unSold") ? "unsold" : "@";
        const response = await _get(
          `property/maxSizeForAllProps/commercial/@/@/@/@/@/${first}/${second}`
        );
        const data = await response.data.maxSize;

        setMaxSize(data);
        setMaxSizeAPIvalue(data);
        setSliderRangesize([0, data]);
        setSizeRange([0, data]);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    } else if (showData == "Layout") {
      try {
        const first = checkedValues.includes("sold") ? "sold" : "@";
        const second = checkedValues.includes("unSold") ? "unsold" : "@";
        const response = await _get(
          `property/maxSizeForAllProps/layout/@/@/@/@/@/${first}/${second}`
        );
        const data = await response.data.maxSize;

        setMaxSize(data);
        setMaxSizeAPIvalue(data);
        setSliderRangesize([0, data]);
        setSizeRange([0, data]);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    }
    if (showData == "Residential") {
      try {
        const first = checkedValues.includes("sold") ? "sold" : "@";
        const second = checkedValues.includes("unSold") ? "unsold" : "@";
        const response = await _get(
          `property/maxSizeForAllProps/residential/@/@/@/@/@/${first}/${second}`
        );
        const data = await response.data.maxSize;

        setMaxSize(data);
        setMaxSizeAPIvalue(data);
        setSliderRangesize([0, data]);
        setSizeRange([0, data]);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    }
  };
  const handleMinSizeChange = (value) => {
    const newRange1 = [value, maxsize];
    setMinSize(value);
    setSizeRange([value, maxsize]);
    setSliderRangesize(newRange1);
  };
  const handleMaxSizeChange = (value) => {
    const newRange1 = [minsize, value];
    setMaxSize(value);
    setSizeRange([minsize, value]);
    setSliderRangesize(newRange1);
  };
  const handleSliderChange1 = (value) => {
    setMinSize(value[0]);
    setMaxSize(value[1]);
    setSizeRange(value);
    setInputValue1(value);
  };
  const fetchVillages = async () => {
    try {
      const response = await _get("/location/getallvillages");
      const data = await response.data;
      const uniqueVillages = [...new Set(data)];
      setVillageList(uniqueVillages);
      setFilteredVillages(uniqueVillages);
    } catch (error) {
      console.error("Error fetching village data:", error);
    }
  };
  const handleTypeChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("mtype", type);
    setShowData(type);
  };

  const fetchMaxPrice = async () => {
    try {
      if (showData == "Agriculture") {
        const aresponse = await _get(
          "/property/maxPriceForAllProps/agricultural/@/@/@/@/@"
        );
        const amaxPriceFromAPI = aresponse.data.maxPrice;
        setMaxPriceFromAPI1(amaxPriceFromAPI);
        setMaxPrice(amaxPriceFromAPI);
        setSliderRange([0, amaxPriceFromAPI]);
      } else if (showData == "Layout") {
        const lresponse = await _get(
          "/property/maxPriceForAllProps/layout/@/@/@/@/@"
        );
        const lmaxPriceFromAPI = lresponse.data.maxPrice;
        setMaxPrice(lmaxPriceFromAPI);
        setMaxPriceFromAPI1(lmaxPriceFromAPI);
        setSliderRange([0, lmaxPriceFromAPI]);
      } else if (showData == "Residential") {
        const housetype = ["@", "@"];

        if (checkedHouseType.includes("Flat")) {
          housetype[0] = "flat";
        }
        if (checkedHouseType.includes("House")) {
          housetype[1] = "house";
        }
        const rresponse = await _get(
          `/property/maxPriceForAllProps/residential/@/@/@/${housetype[0]}/${housetype[1]}`
        );
        const rmaxPriceFromAPI = rresponse.data.maxPrice;
        setMaxPrice(rmaxPriceFromAPI);
        setMaxPriceFromAPI1(rmaxPriceFromAPI);
        setSliderRange([0, rmaxPriceFromAPI]);
      } else if (showData == "Commercial") {
        const data = checkedTypes;

        const types = ["@", "@", "@"];

        if (checkedTypes.includes("sell")) {
          types[0] = "sell";
        }
        if (checkedTypes.includes("rent")) {
          types[1] = "rent";
        }
        if (checkedTypes.includes("lease")) {
          types[2] = "lease";
        }
        const cresponse = await _get(
          `property/maxPriceForAllProps/commercial/${types[0]}/${types[1]}/${types[2]}/@/@`
        );
        const cmaxPriceFromAPI = await cresponse.data.maxPrice;
        setMaxPrice(cmaxPriceFromAPI);
        setMaxPriceFromAPI1(cmaxPriceFromAPI);
        setSliderRange([0, cmaxPriceFromAPI]);
      }
    } catch (error) {
      console.error("Error fetching max price:", error);
    }
  };
  const handleSliderChange = (value) => {
    setMaxPrice(value);
    setSliderRange(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };
  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    setSliderRange([minprice, value]);
  };
  const handleMinPriceChange = (value) => {
    setMinPrice(value);
    setSliderVisible(true);
    setSliderRange([value, maxprice]);
  };

  const onCheckboxChange = (values) => {
    setCheckedValues(values);
  };

  const onCheckboxChange1 = (values) => {
    setCheckedTypes(values);
  };

  const onCheckboxChangeHouseType = (value) => {
    setCheckedValuesHouseType(value);
  };

  const [addressDetails, setAddressDetails] = useState({
    country: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });

  const clearingFilters = () => {

    window.location.reload();
    localStorage.removeItem("isLoading");
  };
  const onPurposeChange = (value) => {
    setPurposeType(value);

  };
  const onVillageChange = (event) => {
    setSearchText(event.target.value);
  };
  const Search = () => {
    localStorage.setItem("isLoading", true);
    setIsLoading(true);
    const filters1 = {
      checkedValues: checkedValues,
      checkedFeatureTypes: checkedFeatureTypes,
      searchText: searchText,
      priceRange: sliderRange,
      sizeRange: sizeRange,
      checkedTypes: checkedTypes,
      checkedHouseType: checkedHouseType,
      propertyName: nameSearchQuery2,
      purposeType:purposeType,
    };

    setFilters1(filters1);
    setTimeout(() => {
      localStorage.setItem("isLoading", "false");
      setIsLoading(false);
    }, 3000);
  };
  return (
    <>
      {!showFormType ? (
        screens.xs ? (
          <>
            <Col xl={5} xs={24} sm={12} md={20} lg={6} xxl={5}>
              <Select
                defaultValue={showData}
                onChange={(value) => {
                  setShowData(value);
                  localStorage.setItem("mtype", value);
                }}
                style={{
                  width: "75%",
                  borderRadius: "5px",
                  margin: "0% 5% 0% 5%",
                  color: showData ? "white" : "#888",
                }}
                dropdownStyle={{
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Option value="Agriculture">{t("landing.agricultural")}</Option>
                <Option value="Commercial">{t("landing.commercial")}</Option>
                <Option value="Layout">{t("landing.layout")}</Option>
                <Option value="Residential">{t("landing.residential")}</Option>
              </Select>
            </Col>
            <Button
              type="primary"
              onClick={() => {
                setFilterModal(!filterModal);
              }}
              style={{ marginTop: "2%" }}
            >
              Choose Filters
            </Button>
            <Modal
              title="Select Filters"
              visible={filterModal}
              onOk={() => {
                setFilterModal(!filterModal);
              }}
              onCancel={() => {
                setFilterModal(!filterModal);
              }}
              okText={"Ok"}
              cancelText={"Close"}
            >
              <Row className="property-details" gutter={[0, 16]}>
                <Col
                  xl={
                    showData === "Agriculture" || showData === "Layout" ? 4 : 8
                  }
                  xs={24}
                  sm={12}
                  md={6}
                  lg={8}
                  xxl={6}
                  style={{ marginLeft: "2%" }}
                >
                  {showData === "Agriculture" && (
                    <Select
                      placeholder="Sold/Unsold"
                      onChange={onCheckboxChange}
                      style={{ width: "80%" }}
                    >
                      <Option value="All">{t("dashboard.all")}</Option>
                      <Option value="Sold">{t("dashboard.sold")}</Option>
                      <Option value="Unsold">{t("dashboard.unSold")}</Option>
                    </Select>
                  )}
                  {showData === "Layout" && (
                    <Select
                      placeholder="Sold/unSold"
                      onChange={onCheckboxChange}
                      style={{ width: "80%" }}
                    >
                      <Option value="All">{t("dashboard.all")}</Option>
                      <Option value="Sold">{t("dashboard.sold")}</Option>
                      <Option value="Unsold">{t("dashboard.unSold")}</Option>
                    </Select>
                  )}
                  {showData === "Commercial" && (
                    <>
                      <Row>
                        <Col xl={8} xs={24} sm={12} md={8} lg={8} xxl={8}>
                          <Select
                            placeholder="Sold/Unsold"
                            onChange={onCheckboxChange}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Sold">{t("dashboard.sold")}</Option>
                            <Option value="Unsold">
                              {t("dashboard.unSold")}
                            </Option>
                          </Select>
                        </Col>
                        <Col xl={8} xs={24} sm={12} md={8} lg={8} xxl={8}>
                          <Select
                            placeholder="Sell/Rent/Lease"
                            onChange={onCheckboxChange1}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Sell">{t("dashboard.sell")}</Option>
                            <Option value="Rent">{t("dashboard.rent")}</Option>
                            <Option value="Lease">
                              {t("dashboard.lease")}
                            </Option>
                          </Select>
                        </Col>
                        <Col xl={8} xs={24} sm={12} md={8} lg={8} xxl={8}>
                          <Select
                            placeholder="Purpose"
                            onChange={onCheckboxChange2}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">Multi-use</Option>
                            <Option value="Retail">Retail</Option>
                            <Option value="Industrial">Industrial</Option>
                            <Option value="Hospitality">Hospitality</Option>
                            <Option value="Social Activities">Social Activities</Option>
                          </Select>
                        </Col>
                      </Row>
                    </>
                  )}
                  {showData === "Residential" && (
                    <>
                      <Row style={{ marginLeft: "2%" }}>
                        <Col xl={8} xs={24} sm={12} md={12} lg={12} xxl={12}>

                          <Select

                            placeholder="Sold/unsold"
                            onChange={onCheckboxChange}
                            style={{ width: "80%", }}

                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Sold">{t("dashboard.sold")}</Option>
                            <Option value="Unsold">
                              {t("dashboard.unSold")}
                            </Option>
                          </Select>




                        </Col>
                        <Col xl={8} xs={24} sm={12} md={12} lg={12} xxl={12}>
                          <Select
                            placeholder="Flat/house/Apartment"
                            onChange={onCheckboxChangeHouseType}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Flat">{t("dashboard.flat")}</Option>
                            <Option value="House">
                              {t("dashboard.house")}
                            </Option>
                            <Option value="Apartment">Apartment</Option>
                          </Select>
                        </Col>
                        <Col xl={8} xs={24} sm={12} md={12} lg={12} xxl={12}>
                          <Select
                            placeholder="sell/rent/lease"
                            onChange={onPurposeChange}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="sell">sell</Option>
                            <Option value="rent">rent</Option>
                            <Option value="lease">lease</Option>
                          </Select>

                          </Col>
                      </Row>
                    </>
                  )}
                </Col>






                <Col xl={8} xs={24} sm={24} md={16} lg={12} xxl={6}>
                  <span className="dropdown-title">
                    {t("dashboard.Size Range")}
                    {showData === "Agriculture"
                      ? `(${t("dashboard.acre")})`
                      : "(sq. ft)"}
                  </span>

                  <InputNumber
                    placeholder="Min size"
                    value={minsize}
                    onChange={handleMinSizeChange}
                    style={{
                      width:
                        localStorage.getItem("language") === "en"
                          ? "30%"
                          : "20%",
                      height: "47%",
                    }}
                  />
                  <InputNumber
                    placeholder="Max size"
                    value={maxsize}
                    onChange={handleMaxSizeChange}
                    style={{
                      width:
                        localStorage.getItem("language") === "en"
                          ? "30%"
                          : "20%",
                      height: "47%",
                    }}
                  />
                  {sliderVisible1 && (
                    <Slider
                      range
                      step={1}
                      min={0}
                      max={maxsizefromAPIvalue}
                      value={sizeRange}
                      onChange={handleSliderChange1}
                      tooltip={{
                        formatter: (value) =>
                          `${value.toLocaleString()} ${showData === "Agriculture" ? "acre" : "sq. ft"
                          }`,
                      }}
                      trackStyle={{
                        height: 4,
                        backgroundColor: "#0D416B",
                      }}
                      handleStyle={{
                        height: 20,
                        width: 20,
                      }}
                      railStyle={{
                        height: 4,
                        backgroundColor: "#03a1fc",
                      }}
                      style={{
                        marginTop: "10px",
                        width: "80%",
                      }}
                    />
                  )}
                </Col>
                <Col xl={9} xs={24} sm={24} md={16} lg={16} xxl={9}>
                  <span className="dropdown-title">
                    {t("dashboard.Price Range")} <small>(₹)</small>
                  </span>
                  <InputNumber
                    min={0}
                    placeholder="Min Price"
                    value={minprice}
                    onChange={handleMinPriceChange}
                    style={{ width: "30%", height: "47%" }}
                  />
                  <InputNumber
                    min={0}
                    placeholder="Max Price"
                    value={maxprice}
                    onChange={handleMaxPriceChange}
                    style={{ width: "40%", height: "47%" }}
                  />

                  {sliderVisible && (
                    <Slider
                      range
                      step={100}
                      min={0}
                      max={maxPriceFromAPI1}
                      value={sliderRange}
                      onChange={handleSliderChange}
                      tooltip={{
                        formatter: (value) => `${value.toLocaleString()} INR`,
                      }}
                      trackStyle={{ height: 4, backgroundColor: "#0D416B" }}
                      handleStyle={{ height: 20, width: 20 }}
                      railStyle={{ height: 4, backgroundColor: "#03a1fc" }}
                    />
                  )}
                </Col>
                <Col xl={5} xs={12} sm={12} md={6} lg={6} xxl={6}>
                  <Input
                    type="text"
                    value={searchText}
                    onChange={onVillageChange}
                    placeholder="Enter Location"
                    style={{ width: "80%" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={5}>
                  <Input
                    placeholder="Property Name / ID"
                    allowClear
                    onChange={(e) => {
                      console.log(e.target.value); // Logs the value entered in the input field
                      setNameSearchQuery2(e.target.value); // Updates the state with the new value
                    }}

                  />

                </Col>
                <Col xl={2} xs={6} sm={12} md={6} lg={6} xxl={6}>
                  <Button
                    type="primary"
                    onClick={() => {
                      clearingFilters();
                    }}
                  >
                    Reset
                  </Button>
                </Col>
                <Col xl={3} xs={6} sm={12} md={6} lg={6} xxl={6}>
                  <Button
                    type="primary"
                    onClick={() => {
                      Search();
                    }}
                  >
                    Search
                  </Button>
                </Col>
                <Col xl={4} xs={24} sm={12} md={6} lg={8} xxl={4}>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          icon: (
                            <BorderlessTableOutlined
                              style={{ color: "#0d416b" }}
                            />
                          ),
                          key: "Agriculture",
                          label: `${t("landing.agricultural")}`,
                          onClick: () => handleButtonClick("agriculture"),
                        },
                        {
                          icon: <ShopOutlined style={{ color: "#0d416b" }} />,
                          key: "Commercial",
                          label: `${t("landing.commercial")}`,
                          onClick: () => handleButtonClick("commercial"),
                        },
                        {
                          icon: (
                            <BorderInnerOutlined style={{ color: "#0d416b" }} />
                          ),
                          key: "Layout",
                          label: `${t("landing.layout")}`,
                          onClick: () => handleButtonClick("layout"),
                        },
                        {
                          icon: <HomeOutlined style={{ color: "#0d416b" }} />,
                          key: "Residential",
                          label: `${t("landing.residential")}`,
                          onClick: () => handleButtonClick("residential"),
                        },
                      ],
                    }}
                  >
                    <Space>
                      <PlusCircleOutlined
                        style={{
                          fontSize: "20px",
                          color: "#0d416b",
                          padding: "5px",
                        }}
                      />
                      <span style={{ marginLeft: "-5%" }}>
                        {t("dashboard.addproperty")}
                      </span>
                    </Space>
                  </Dropdown>
                </Col>
              </Row>
            </Modal>
            {showData === "Agriculture" && (
              <Agriculture path={"getfields"} filters1={filters1} />
            )}
            {showData === "Commercial" && (
              <GetCommercial path={"getcommercial"} filters1={filters1} />
            )}
            {showData === "Layout" && (
              <GetLayout path={"getlayouts"} filters1={filters1} />
            )}
            {showData === "Residential" && (
              <Residential path={"getting"} filters1={filters1} />
            )}
          </>
        ) : (
          <>
            <Card
              style={{
                border: "1px solid lightgray",
                backgroundColor: "#f0f8ff",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                marginBottom: "20px",
              }}
            >
              <Row gutter={[8, 16]}>
                {screens.md ? (
                  <>
                    <Col xl={5} xs={24} sm={12} md={6} lg={6} xxl={5}>
                      <Select
                        defaultValue={showData}
                        onChange={(value) => {
                          setShowData(value);
                          localStorage.setItem("mtype", value);
                        }}
                        style={{
                          width: "75%",
                          borderRadius: "5px",
                          margin: "0% 5% 0% 5%",
                          color: showData ? "white" : "#888",
                        }}
                        dropdownStyle={{
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        <Option value="Agriculture">
                          {t("landing.agricultural")}
                        </Option>
                        <Option value="Commercial">
                          {t("landing.commercial")}
                        </Option>
                        <Option value="Layout">{t("landing.layout")}</Option>
                        <Option value="Residential">
                          {t("landing.residential")}
                        </Option>
                      </Select>
                    </Col>
                  </>
                ) : (
                  <Select
                    value={selectedType}
                    onChange={handleTypeChange}
                    style={{ width: "100%" }}
                    className="custom-select"
                    placeholder={t("landing.selectType")}
                  >
                    <Option value="Agriculture">
                      {t("landing.agricultural")}
                    </Option>
                    <Option value="Commercial">
                      {t("landing.commercial")}
                    </Option>
                    <Option value="Layout">{t("landing.layout")}</Option>
                    <Option value="Residential">
                      {t("landing.residential")}
                    </Option>
                  </Select>
                )}

                <Col xl={3} xs={24} sm={12} md={4} lg={6} xxl={6}>
                  <Input
                    type="text"
                    value={searchText}
                    onChange={onVillageChange}
                    placeholder="Enter Location"
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6}>
                  <Input
                    placeholder="Property Name / ID"
                    allowClear
                    onChange={(e) => {
                      console.log(e.target.value); // Logs the value entered in the input field
                      setNameSearchQuery2(e.target.value); // Updates the state with the new value
                    }}

                  />

                </Col>
               
                  {showData === "Agriculture" && (
                    <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6}>
                    <Select
                      placeholder="Sold/Unsold"
                      onChange={onCheckboxChange}
                      style={{ width: "80%" }}
                    >
                      <Option value="All">{t("dashboard.all")}</Option>
                      <Option value="Sold">{t("dashboard.sold")}</Option>
                      <Option value="Unsold">{t("dashboard.unSold")}</Option>
                    </Select>
                    </Col>
                  )}
                  {showData === "Layout" && (
                       <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6}>
                    <Select
                      placeholder="Sold/unSold"
                      onChange={onCheckboxChange}
                      style={{ width: "80%" }}
                    >
                      <Option value="All">{t("dashboard.all")}</Option>
                      <Option value="Sold">{t("dashboard.sold")}</Option>
                      <Option value="Unsold">{t("dashboard.unSold")}</Option>
                    </Select>
                    </Col>
                  )}
                  {showData === "Commercial" && (
                    <>
             
                        <Col xl={4} xs={24} sm={12} md={4} lg={8} xxl={8}>
                          <Select
                            placeholder="Sold/Unsold"
                            onChange={onCheckboxChange}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Sold">{t("dashboard.sold")}</Option>
                            <Option value="Unsold">
                              {t("dashboard.unSold")}
                            </Option>
                          </Select>
                        </Col>
                        <Col xl={4} xs={24} sm={12} md={4} lg={8} xxl={8}>
                          <Select
                            placeholder="Sell/Rent/Lease"
                            onChange={onCheckboxChange1}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Sell">{t("dashboard.sell")}</Option>
                            <Option value="Rent">{t("dashboard.rent")}</Option>
                            <Option value="Lease">
                              {t("dashboard.lease")}
                            </Option>
                          </Select>
                        </Col>
                        <Col xl={4} xs={24} sm={12} md={4} lg={8} xxl={8}>
                          <Select
                            placeholder="Purpose"
                            onChange={onCheckboxChange2}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">Multi-use</Option>
                            <Option value="Retail">Retail</Option>
                            <Option value="Industrial">Industrial</Option>
                            <Option value="Hospitality">Hospitality</Option>
                            <Option value="Social Activities">Social Activities</Option>
                          </Select>
                        </Col>
                      
                    </>
                  )}



                  {showData === "Residential" && (
                    <>
                  
                        <Col xl={4} xs={24} sm={12} md={4} lg={12} xxl={12}>
                          <Select
                            placeholder="Sold/unsold"
                            onChange={onCheckboxChange}
                            style={{ width: "80%", }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Sold">{t("dashboard.sold")}</Option>
                            <Option value="Unsold">
                              {t("dashboard.unSold")}
                            </Option>
                          </Select>
                        </Col>
                        <Col xl={4} xs={24} sm={12} md={4} lg={12} xxl={12}>
                          <Select
                            placeholder="Flat/house/Apartment"
                            onChange={onCheckboxChangeHouseType}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="Flat">{t("dashboard.flat")}</Option>
                            <Option value="House">
                              {t("dashboard.house")}
                            </Option>
                            <Option value="Apartment">Apartment</Option>
                          </Select>
                        </Col>
                        <Col xl={4} xs={24} sm={12} md={4} lg={12} xxl={12}>
                          <Select
                            placeholder="sell/rent/lease"
                            onChange={onPurposeChange}
                            style={{ width: "80%" }}
                          >
                            <Option value="All">{t("dashboard.all")}</Option>
                            <Option value="sell">sell</Option>
                            <Option value="rent">rent</Option>
                            <Option value="lease">lease</Option>
                          </Select>

                          </Col>
                   
                    </>
                  )}
               
              </Row>
              <Row gutter={[8, 16]} style={{ marginTop: "3%" }}>
                <Col xl={8} xs={24} sm={12} md={6} lg={8} xxl={6}>
                  <span
                    className="dropdown-title"
                    style={{
                      width:
                        localStorage.getItem("language") === "te"
                          ? "10%"
                          : "auto",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {t("dashboard.Size Range")}
                    {showData === "Agriculture"
                      ? `(${t("dashboard.acre")})`
                      : "(sq. ft)"}
                  </span>

                  <InputNumber
                    placeholder="Min size"
                    value={minsize}
                    onChange={handleMinSizeChange}
                    style={{
                      width:
                        localStorage.getItem("language") === "en"
                          ? "40%"
                          : "30%",
                      height: "47%",
                      marginRight: "10px",
                    }}
                  />
                  <InputNumber
                    placeholder="Max size"
                    value={maxsize}
                    onChange={handleMaxSizeChange}
                    style={{
                      width:
                        localStorage.getItem("language") === "en"
                          ? "50%"
                          : "34%",
                      height: "47%",
                    }}
                  />
                  {sliderVisible1 && (
                    <Slider
                      range
                      step={1}
                      min={0}
                      max={maxsizefromAPIvalue}
                      value={sizeRange}
                      onChange={handleSliderChange1}
                      tooltip={{
                        formatter: (value) =>
                          `${value.toLocaleString()} ${showData === "Agriculture" ? "acre" : "sq.ft"
                          }`,
                      }}
                      trackStyle={{
                        height: 4,
                        backgroundColor: "#0D416B",
                      }}
                      handleStyle={{
                        height: 20,
                        width: 20,
                      }}
                      railStyle={{
                        height: 4,
                        backgroundColor: "#03a1fc",
                      }}
                      style={{
                        marginTop: "10px",
                        width: "80%",
                      }}
                    />
                  )}
                </Col>
                <Col xl={8} xs={24} sm={12} md={6} lg={6} xxl={6}>
                  <span className="dropdown-title">
                    {t("dashboard.Price Range")} <small>(₹)</small>
                  </span>
                  <InputNumber
                    min={0}
                    placeholder="Min Price"
                    value={minprice}
                    onChange={handleMinPriceChange}
                    style={{ width: "30%", height: "47%", marginRight: "2%" }}
                  />
                  <InputNumber
                    min={0}
                    placeholder="Max Price"
                    value={maxprice}
                    onChange={handleMaxPriceChange}
                    style={{ width: "40%", height: "47%" }}
                  />

                  {sliderVisible && (
                    <Slider
                      range
                      step={100}
                      min={0}
                      max={maxPriceFromAPI1}
                      value={sliderRange}
                      onChange={handleSliderChange}
                      tooltip={{
                        formatter: (value) => `${value.toLocaleString()} INR`,
                      }}
                      trackStyle={{ height: 4, backgroundColor: "#0D416B" }}
                      handleStyle={{ height: 20, width: 20 }}
                      railStyle={{ height: 4, backgroundColor: "#03a1fc" }}
                      style={{ marginTop: "5px", width: "80%" }}
                    />
                  )}
                </Col>

                <Col xl={2} xs={24} sm={12} md={6} lg={6} xxl={6}>
                  <Button
                    type="primary"
                    onClick={() => {
                      clearingFilters();
                    }}
                  >
                    Reset
                  </Button>
                </Col>
                <Col xl={3} xs={24} sm={12} md={6} lg={6} xxl={6}>
                    <Button type="primary" onClick={Search} disabled={isLoading}>
                      {isLoading ? <Spin size="small" /> : "Search"}
                    </Button>
                  </Col>
                <Col xl={4} xs={24} sm={12} md={6} lg={8} xxl={4}>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          icon: (
                            <BorderlessTableOutlined
                              style={{ color: "#0d416b" }}
                            />
                          ),
                          key: "Agriculture",
                          label: `${t("landing.agricultural")}`,
                          onClick: () => handleButtonClick("agriculture"),
                        },
                        {
                          icon: <ShopOutlined style={{ color: "#0d416b" }} />,
                          key: "Commercial",
                          label: `${t("landing.commercial")}`,
                          onClick: () => handleButtonClick("commercial"),
                        },
                        {
                          icon: (
                            <BorderInnerOutlined style={{ color: "#0d416b" }} />
                          ),
                          key: "Layout",
                          label: `${t("landing.layout")}`,
                          onClick: () => handleButtonClick("layout"),
                        },
                        {
                          icon: <HomeOutlined style={{ color: "#0d416b" }} />,
                          key: "Residential",
                          label: `${t("landing.residential")}`,
                          onClick: () => handleButtonClick("residential"),
                        },
                      ],
                    }}
                  >
                    <Space>
                      <PlusCircleOutlined
                        style={{
                          fontSize: "20px",
                          color: "#0d416b",
                          padding: "5px",
                        }}
                      />
                      <span style={{ marginLeft: "-5%" }}>
                        {t("dashboard.addproperty")}
                      </span>
                    </Space>
                  </Dropdown>
                </Col>
              </Row>
            </Card>
            {showData === "Agriculture" && (
              <Agriculture path={"getfields"} filters1={filters1} />
            )}
            {showData === "Commercial" && (
              <GetCommercial path={"getcommercial"} filters1={filters1} />
            )}
            {showData === "Layout" && (
              <GetLayout path={"getlayouts"} filters1={filters1} />
            )}
            {showData === "Residential" && (
              <Residential path={"getting"} filters1={filters1} />
            )}
          </>
        )
      ) : (
        <div>
          <CloseOutlined
            style={{
              fontSize: "20px",
              color: "red",
              border: "1px solid black",
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              float: "right",
              marginTop: "15px",
              marginRight: "40px",
            }}
            onClick={() => setShowFormType(null)}
          />
          {showFormType === "commercial" && (
            <CommercialForm setShowFormType={setShowFormType} />
          )}
          {showFormType === "agriculture" && (
            <AddProperty setShowFormType={setShowFormType} />
          )}
          {showFormType === "layout" && (
            <LayoutForm setShowFormType={setShowFormType} />
          )}
          {showFormType === "residential" && (
            <ResidentialForm setShowFormType={setShowFormType} />
          )}
        </div>
      )}
    </>
  );
}
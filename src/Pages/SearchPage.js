// import React, { useEffect, useState } from "react";
// import {
//   Layout,
//   Row,
//   Col,
//   Dropdown,
//   Menu,
//   Input,
//   Checkbox,
//   Select,
//   Slider,
//   Switch,
//   InputNumber,
//   Grid,
//   Modal,
//   Button,
// } from "antd";
// import "./SearchPage.css";
// import EstatelyImage from "../images/landingpageupdate.jpg";
// import Agriculture from "./Agent/Agricultural/Agriculture";
// import GetCommercial from "./Agent/Commericial/GetCommercial";
// import GetLayout from "./Agent/Layout/GetLayout";
// import Residential from "./Agent/Residential/Residential";
// import { jwtDecode } from "jwt-decode";
// import BuyersCommercial from "./Buyers/Components/BuyersCommercial";
// import BuyersAgriculture from "./Buyers/Components/BuyersAgriculture";
// import BuyersLayout from "./Buyers/Components/BuyersLayout";
// import BuyersResidential from "./Buyers/Components/BuyersResidential";
// import { _get } from "../Service/apiClient";
// import { useTranslation } from "react-i18next";

// const { Search } = Input;
// const { Option } = Select;
// const { useBreakpoint } = Grid;

// export default function SearchPage() {
//   const screens = useBreakpoint();
//   const [filterModal, setFilterModal] = useState(false);
//   const { t, i18n } = useTranslation();
//   const [selectedType, setSelectedType] = useState(
//     localStorage.getItem("type")
//   );
//   const [showData, setShowData] = useState(localStorage.getItem("type"));
//   const [checkedValues, setCheckedValues] = useState(["unSold"]);
//   const [checkedTypes, setCheckedTypes] = useState(["sell", "rent", "lease"]);
//   const [checkedHouseType, setCheckedValuesHouseType] = useState([
//     "Flat",
//     "House",
//   ]);
//   const [searchText, setSearchText] = useState(null);
//   const [villageList, setVillageList] = useState([]);
//   const [filteredVillages, setFilteredVillages] = useState([]);
//   const [hasTyped, setHasTyped] = useState(false);
//   const [selectedRange, setSelectedRange] = useState(null);
//   const [sliderVisible, setSliderVisible] = useState(true);
//   const [priceRange, setPriceRange] = useState([0, Infinity]);
//   const [inputValue, setInputValue] = useState([0, Infinity]);
//   const [minprice, setMinPrice] = useState(0);
//   const [maxprice, setMaxPrice] = useState(1000000);
//   const [sliderRange, setSliderRange] = useState([0, Infinity]);
//   const priceOptions = [
//     { label: `${t("dashboard.all")}`, range: [0, Infinity] },
//     { label: "0 - 500,000", range: [0, 500000] },
//     { label: "500,000 - 1,000,000", range: [0, 1000000] },
//     { label: "1,000,000 - 2,000,000", range: [0, 2000000] },
//     { label: "2,000,000 - 4,000,000", range: [0, 4000000] },
//     { label: "4,000,000 - 6,000,000", range: [0, 6000000] },
//     { label: "6,000,000 - 8,000,000", range: [0, 8000000] },
//     { label: "8,000,000 - 10,000,000", range: [0, 10000000] },
//   ];
//   const [selectedRange1, setSelectedRange1] = useState(null);
//   const [sliderVisible1, setSliderVisible1] = useState(false);
//   const [sizeRange, setSizeRange] = useState([0, Infinity]);
//   const [inputValue1, setInputValue1] = useState([0, Infinity]);
//   const [maxPriceFromAPI1, setMaxPriceFromAPI1] = useState();
//   const sizeOptions = [
//     { label: `${t("dashboard.all")}`, range: [0, Infinity] },
//     { label: "0 - 1,000", range: [0, 1000] },
//     { label: "0 - 2,000", range: [0, 2000] },
//     { label: "0 - 4,000", range: [0, 4000] },
//     { label: "0 - 6,000", range: [0, 6000] },
//     { label: "0 - 8,000", range: [0, 8000] },
//     { label: "0 - 10,000", range: [0, 10000] },
//   ];
//   const [filters, setFilters] = useState({
//     checkedValues: checkedValues,
//     searchText: searchText,
//     priceRange: priceRange,
//     sizeRange: sizeRange,
//     checkedTypes: ["sell", "rent", "lease"],
//     checkedHouseType: ["Flat", "House"],
//   });
//   const token = localStorage.getItem("token");
//   const decoded = jwtDecode(token);
//   const role = decoded.user.role;

//   useEffect(() => {
//     setSelectedType(localStorage.getItem("type"));
//     setShowData(localStorage.getItem("type"));
//     fetchVillages();
//     setSliderVisible(true);
//     setSliderVisible1(false);
//     setAddressDetails({
//       district: "",
//       mandal: "",
//       village: "",
//     });

//     fetchMaxPrice();
//     setFilters({
//       checkedValues: ["unSold"],
//       searchText: null,
//       priceRange: [0, Infinity],
//       sizeRange: [0, Infinity],
//       checkedTypes: ["sell", "rent", "lease"],
//       checkedHouseType: ["Flat", "House"],
//     });
//     function hideError(e) {
//       if (
//         e.message ===
//         "ResizeObserver loop completed with undelivered notifications."
//       ) {
//         const resizeObserverErrDiv = document.getElementById(
//           "webpack-dev-server-client-overlay-div"
//         );
//         const resizeObserverErr = document.getElementById(
//           "webpack-dev-server-client-overlay"
//         );
//         if (resizeObserverErr) {
//           resizeObserverErr.setAttribute("style", "display: none");
//         }
//         if (resizeObserverErrDiv) {
//           resizeObserverErrDiv.setAttribute("style", "display: none");
//         }
//       }
//     }

//     window.addEventListener("error", hideError);
//     return () => {
//       window.addEventListener("error", hideError);
//     };
//   }, [showData]);
//   const fetchVillages = async () => {
//     try {
//       const response = await _get("/location/getallvillages");
//       const data = await response.data;
//       const uniqueVillages = [...new Set(data)];
//       setVillageList(uniqueVillages);
//       setFilteredVillages(uniqueVillages);
//     } catch (error) {
//       console.error("Error fetching village data:", error);
//     }
//   };
//   const handleTypeChange = (type) => {
//     setSelectedType(type);
//     localStorage.setItem("type", type);
//     setShowData(type);
//   };

//   const fetchMaxPrice = async () => {
//     try {
//       if (showData == "Agriculture") {
//         const aresponse = await _get(
//           "/property/maxPrice/agricultural/@/@/@/@/@"
//         );
//         const amaxPriceFromAPI = aresponse.data.maxPrice;
//         setMaxPriceFromAPI1(amaxPriceFromAPI);
//         setMaxPrice(amaxPriceFromAPI);
//         setSliderRange([0, amaxPriceFromAPI]);
//       } else if (showData == "Layout") {
//         const lresponse = await _get("/property/maxPrice/layout/@/@/@/@/@");
//         const lmaxPriceFromAPI = lresponse.data.maxPrice;
//         setMaxPrice(lmaxPriceFromAPI);
//         setMaxPriceFromAPI1(lmaxPriceFromAPI);
//         setSliderRange([0, lmaxPriceFromAPI]);
//       } else if (showData == "Residential") {
//         const housetype = ["@", "@"];

//         if (checkedHouseType.includes("Flat")) {
//           housetype[0] = "flat";
//         }
//         if (checkedHouseType.includes("House")) {
//           housetype[1] = "house";
//         }
//         const rresponse = await _get(
//           `/property/maxPrice/residential/@/@/@/${housetype[0]}/${housetype[1]}`
//         );
//         const rmaxPriceFromAPI = rresponse.data.maxPrice;
//         setMaxPrice(rmaxPriceFromAPI);
//         setMaxPriceFromAPI1(rmaxPriceFromAPI);
//         setSliderRange([0, rmaxPriceFromAPI]);
//       } else if (showData == "Commercial") {
//         const data = checkedTypes;

//         const types = ["@", "@", "@"];

//         if (checkedTypes.includes("sell")) {
//           types[0] = "sell";
//         }
//         if (checkedTypes.includes("rent")) {
//           types[1] = "rent";
//         }
//         if (checkedTypes.includes("lease")) {
//           types[2] = "lease";
//         }
//         const cresponse = await _get(
//           `property/maxPrice/commercial/${types[0]}/${types[1]}/${types[2]}/@/@`
//         );
//         const cmaxPriceFromAPI = await cresponse.data.maxPrice;
//         setMaxPrice(cmaxPriceFromAPI);
//         setMaxPriceFromAPI1(cmaxPriceFromAPI);
//         setSliderRange([0, cmaxPriceFromAPI]);
//       }
//     } catch (error) {
//       console.error("Error fetching max price:", error);
//     }
//   };

//   const onCheckboxChange = (checked) => {
//     const newCheckedValues = checked ? ["sold"] : ["unSold"];
//     setCheckedValues(newCheckedValues);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       checkedValues: newCheckedValues,
//     }));
//   };

//   const options1 = [
//     { label: `${t("dashboard.sell")}`, value: "sell" },
//     { label: `${t("dashboard.rent")}`, value: "rent" },
//     { label: `${t("dashboard.lease")}`, value: "lease" },
//   ];

//   const onCheckboxChange1 = (checkedTypes) => {
//     setCheckedTypes(checkedTypes);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       checkedTypes: checkedTypes,
//     }));
//   };

//   const optionsHouseType = [
//     { label: `${t("dashboard.flat")}`, value: "Flat" },
//     { label: `${t("dashboard.house")}`, value: "House" },
//   ];

//   const onCheckboxChangeHouseType = (types) => {
//     setCheckedValuesHouseType(types);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       checkedHouseType: types,
//     }));
//   };

//   const handleRangeSelect = (value) => {
//     const selected = priceOptions.find((option) => option.label === value);
//     if (value === "All") {
//       setSliderVisible(false);
//     } else {
//       setSelectedRange(selected.range);
//       setPriceRange(selected.range);
//       setSliderVisible(true);
//     }
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       priceRange: selected.range,
//     }));
//   };

//   const AgrisizeOptions = [
//     { label: `${t("dashboard.all")}`, range: [0, Infinity] },
//     { label: "0 - 5", range: [0, 5] },
//     { label: "0 - 10", range: [0, 10] },
//     { label: "0 - 15", range: [0, 15] },
//     { label: "0 - 20", range: [0, 20] },
//     { label: "0 - 25", range: [0, 25] },
//     { label: "0 - 30", range: [0, 30] },
//     { label: "0- 35", range: [0, 35] },
//     { label: "0- 40", range: [0, 40] },
//     { label: "0- 45", range: [0, 45] },
//     { label: "0- 50", range: [0, 50] },
//   ];
//   const handleSizeSelect = (value) => {
//     const selected =
//       showData === "Agriculture"
//         ? AgrisizeOptions.find((option) => option.label === value)
//         : sizeOptions.find((option) => option.label === value);
//     if (value === "All") {
//       setSliderVisible1(false);
//     } else {
//       setSelectedRange1(selected.range);
//       setSizeRange(selected.range);
//       setSliderVisible1(true);
//     }
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       sizeRange: selected.range,
//     }));
//   };

//   const handleSliderChange1 = (value) => {
//     setSizeRange(value);
//     setInputValue1(value);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       sizeRange: value,
//     }));
//   };

//   const [mandals, setMandals] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(false);
//   const [selectedMandal, setSelectedMandal] = useState(false);
//   const [villages, setVillages] = useState([]);
//   const [addressDetails, setAddressDetails] = useState({
//     country: "",
//     state: "",
//     district: "",
//     mandal: "",
//     village: "",
//   });
//   const [mandalList, setMandalList] = useState([]);
//   const [hasPincode, setHasPincode] = useState("no");
//   const handleDistrictChange = async (value) => {
//     setSelectedDistrict(value);
//     setAddressDetails((prev) => ({ ...prev, district: value }));

//     setSelectedDistrict(true);

//     try {
//       const response = await _get(`/location/getmandals/${value}`);

//       const mandalList = response.data.mandals;

//       setMandals(mandalList);

//       setAddressDetails((prev) => ({
//         ...prev,
//         mandal: mandalList || [],
//       }));
//       setSelectedMandal(mandalList[0]);

//       const response1 = await _get(
//         `/location/getvillagesbymandal/${mandalList[0]}`
//       );
//       const villageList = response1.data || [];
//       setVillages(villageList);
//       setAddressDetails((prev) => ({
//         ...prev,
//         village: villageList[0] || villages[0],
//       }));
//     } catch (error) {
//       console.error("Error fetching villages:", error);
//     }
//   };

//   const handleSearchMandalChange = async (value) => {
//     const response = await _get(
//       `/location/getmandals/${addressDetails.district}`
//     );

//     const mandalList = response.data.mandals;
//     setSearchText(value);
//     setHasTyped(value.length > 0);

//     const filtered = mandalList.filter((mandal) =>
//       mandal.toLowerCase().startsWith(value.toLowerCase())
//     );

//     const uniqueFilteredMandals = [...new Set(filtered)];

//     setMandals(uniqueFilteredMandals);

//     if (
//       hasTyped &&
//       searchText !== null &&
//       searchText !== "" &&
//       searchText !== undefined &&
//       uniqueFilteredMandals.length !== 0
//     ) {
//       setFilters((prevFilters) => ({
//         ...prevFilters,
//         searchText: value,
//       }));
//     }
//   };

//   const handleSearchChange = async (value) => {
//     const response1 = await _get(
//       `/location/getvillagesbymandal/${selectedMandal}`
//     );
//     const villageList = response1.data;

//     setSearchText(value);
//     setHasTyped(value.length > 0);
//     const filtered = villageList.filter((village) =>
//       village.toLowerCase().startsWith(value.toLowerCase())
//     );

//     const uniqueFilteredVillages = [...new Set(filtered)];

//     setVillages(uniqueFilteredVillages);
//     if (
//       hasTyped &&
//       searchText !== null &&
//       searchText !== "" &&
//       searchText !== undefined &&
//       uniqueFilteredVillages.length !== 0
//     ) {
//       setFilters((prevFilters) => ({
//         ...prevFilters,
//         searchText: value,
//       }));
//     }
//   };
//   const handleClear = () => {
//     setVillages(villageList);
//   };
//   const handleClear1 = () => {
//     setMandals(mandalList);
//     handleDistrictChange(addressDetails.district);
//   };
//   const handleVillageChange = (value) => {
//     setAddressDetails((prev) => ({ ...prev, village: value }));
//     setSearchText(value);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       searchText: value,
//     }));
//   };
//   const handleMandalChange = async (value) => {
//     setAddressDetails((prev) => ({ ...prev, mandal: value }));
//     setSearchText(value);
//     setSelectedMandal(value);
//     let response = "";
//     if (value !== undefined) {
//       response = await _get(`/location/getvillagesbymandal/${value}`);
//     }

//     const villageList = response.data || [];
//     setVillages(villageList);

//     setAddressDetails((prev) => ({
//       ...prev,
//       village: villageList[0] || "",
//     }));
//   };
//   const handleSliderChange = (value) => {
//     setMaxPrice(value);
//     setSliderRange(value);
//     setMinPrice(value[0]);
//     setMaxPrice(value[1]);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       priceRange: value,
//     }));
//   };
//   const handleMinPriceChange = (value) => {
//     if (value === null || value === undefined) {
//       const newRange = [value, Math.max(value, maxprice)];
//       setMinPrice(value);
//       setSliderVisible(true);
//       setSliderRange(newRange);
//       setFilters((prevFilters) => ({
//         ...prevFilters,
//         priceRange: newRange,
//       }));
//     }
//   };

//   const handleMaxPriceChange = (value) => {
//     if (value != null || value != undefined) {
//       const newRange = [Math.min(minprice, value), value];
//       setMaxPriceFromAPI1(value);
//       setMaxPrice(value);
//       setSliderRange(newRange);
//       setFilters((prevFilters) => ({
//         ...prevFilters,
//         priceRange: newRange,
//       }));
//     }
//   };

//   return (
//     <>
//       <div className="landview-container">
//         <div className="relative">
//           <div>
//             <img
//               src={EstatelyImage}
//               alt="Estately"
//               className="landview-image"
//             />
//           </div>
//         </div>

//         <div className="landview-options">
//           <div className="option-buttons">
//             {screens.md ? (
//               <>
//                 <button
//                   className={`option-button ${
//                     selectedType === "Agriculture" ? "selected" : ""
//                   }`}
//                   onClick={() => handleTypeChange("Agriculture")}
//                 >
//                   {t("landing.agricultural")}
//                 </button>
//                 <button
//                   className={`option-button ${
//                     selectedType === "Commercial" ? "selected" : ""
//                   }`}
//                   onClick={() => handleTypeChange("Commercial")}
//                 >
//                   {t("landing.commercial")}
//                 </button>
//                 <button
//                   className={`option-button ${
//                     selectedType === "Layout" ? "selected" : ""
//                   }`}
//                   onClick={() => handleTypeChange("Layout")}
//                 >
//                   {t("landing.layout")}
//                 </button>
//                 <button
//                   className={`option-button ${
//                     selectedType === "Residential" ? "selected" : ""
//                   }`}
//                   onClick={() => handleTypeChange("Residential")}
//                 >
//                   {t("landing.residential")}
//                 </button>
//               </>
//             ) : (
//               <Select
//                 value={selectedType}
//                 onChange={handleTypeChange}
//                 style={{ width: screens.md ? "100%" : "60%" }}
//                 className="custom-select"
//                 placeholder={t("landing.selectType")}
//               >
//                 <Option value="Agriculture">{t("landing.agricultural")}</Option>
//                 <Option value="Commercial">{t("landing.commercial")}</Option>
//                 <Option value="Layout">{t("landing.layout")}</Option>
//                 <Option value="Residential">{t("landing.residential")}</Option>
//               </Select>
//             )}
//           </div>
//           {screens.xs ? (
//             <>
//               <Button
//                 type="primary"
//                 onClick={() => {
//                   setFilterModal(!filterModal);
//                 }}
//                 style={{ marginTop: "2%" }}
//               >
//                 Choose Filters
//               </Button>

//               <Modal
//                 title="Select Filters"
//                 visible={filterModal}
//                 onOk={() => {
//                   setFilterModal(!filterModal);
//                 }}
//                 onCancel={() => {
//                   setFilterModal(!filterModal);
//                 }}
//               >
//                 <Row className="property-details" gutter={[0, 16]}>
//                   {role === 1 ? (
//                     <Col xl={7} xs={24} sm={24} md={24} lg={12} xxl={6}>
//                       <span className="dropdown-title">
//                         {t("dashboard.Property Status")}
//                       </span>
//                       <Switch
//                         checked={filters.checkedValues.includes("sold")}
//                         onChange={onCheckboxChange}
//                         checkedChildren={t("dashboard.sold")}
//                         unCheckedChildren={t("dashboard.unSold")}
//                         size="small"
//                       />
//                       <br></br>
//                       {showData === "Commercial" && (
//                         <Checkbox.Group
//                           options={options1}
//                           onChange={onCheckboxChange1}
//                           value={checkedTypes}
//                         />
//                       )}
//                       {showData === "Residential" && (
//                         <Checkbox.Group
//                           options={optionsHouseType}
//                           onChange={onCheckboxChangeHouseType}
//                           value={checkedHouseType}
//                         />
//                       )}
//                     </Col>
//                   ) : (
//                     (showData === "Commercial" ||
//                       showData === "Residential") && (
//                       <Col xl={7} xs={24} sm={24} md={24} lg={12} xxl={6}>
//                         <span className="dropdown-title">
//                           {t("dashboard.Property Status")}
//                         </span>
//                         {showData === "Commercial" && (
//                           <Checkbox.Group
//                             options={options1}
//                             onChange={onCheckboxChange1}
//                             value={checkedTypes}
//                           />
//                         )}
//                         {showData === "Residential" && (
//                           <>
//                             <Checkbox.Group
//                               options={optionsHouseType}
//                               onChange={onCheckboxChangeHouseType}
//                               value={checkedHouseType}
//                             />
//                           </>
//                         )}
//                       </Col>
//                     )
//                   )}

//                   <Col xl={8} xs={24} sm={24} md={16} lg={12} xxl={6}>
//                     <span className="dropdown-title">
//                       {t("dashboard.Size Range")}
//                       {showData === "Agriculture"
//                         ? `(${t("dashboard.acre")})`
//                         : `(${t("dashboard.sqft")})`}
//                     </span>
//                     <Select
//                       style={{ width: "60%" }}
//                       placeholder="Select Size Range"
//                       onChange={handleSizeSelect}
//                       value={
//                         (showData === "Agriculture"
//                           ? AgrisizeOptions
//                           : sizeOptions
//                         ).find(
//                           (option) =>
//                             option.range[0] === filters.sizeRange[0] &&
//                             option.range[1] === filters.sizeRange[1]
//                         )?.label || "All"
//                       }
//                       defaultValue="All"
//                     >
//                       {(showData === "Agriculture"
//                         ? AgrisizeOptions
//                         : sizeOptions
//                       ).map((option) => (
//                         <Option key={option.label} value={option.label}>
//                           {option.label}
//                         </Option>
//                       ))}
//                     </Select>
//                     {sliderVisible1 && (
//                       <Slider
//                         range
//                         step={1}
//                         min={selectedRange1[0]}
//                         max={selectedRange1[1]}
//                         value={sizeRange}
//                         onChange={handleSliderChange1}
//                         tooltip={{
//                           formatter: (value) => `${value.toLocaleString()} INR`,
//                         }}
//                         trackStyle={{
//                           height: 4,
//                           backgroundColor: "#0D416B",
//                         }}
//                         handleStyle={{
//                           height: 20,
//                           width: 20,
//                         }}
//                         railStyle={{
//                           height: 4,
//                           backgroundColor: "#03a1fc",
//                         }}
//                       />
//                     )}
//                   </Col>
//                   <Col xl={9} xs={24} sm={24} md={16} lg={16} xxl={9}>
//                     <span className="dropdown-title">
//                       {t("dashboard.Price Range")} <small>(₹)</small>
//                     </span>
//                     <InputNumber
//                       min={0}
//                       placeholder="Min Price"
//                       value={minprice}
//                       onChange={handleMinPriceChange}
//                       style={{ width: "30%", height: "55%" }}
//                     />
//                     <InputNumber
//                       min={0}
//                       placeholder="Max Price"
//                       value={maxprice}
//                       onChange={handleMaxPriceChange}
//                       style={{ width: "40%", height: "55%" }}
//                     />

//                     {sliderVisible && (
//                       <Slider
//                         range
//                         step={100}
//                         min={0}
//                         max={maxPriceFromAPI1}
//                         value={sliderRange}
//                         onChange={handleSliderChange}
//                         tooltip={{
//                           formatter: (value) => `${value.toLocaleString()} INR`,
//                         }}
//                         trackStyle={{ height: 4, backgroundColor: "#0D416B" }}
//                         handleStyle={{ height: 20, width: 20 }}
//                         railStyle={{ height: 4, backgroundColor: "#03a1fc" }}
//                       />
//                     )}
//                   </Col>
//                   <Col span={24}>
//                     <span className="dropdown-title">
//                       {t("dashboard.Location")}
//                     </span>
//                     <Select
//                       placeholder={t("registration.Select District")}
//                       value={addressDetails.district || undefined}
//                       onChange={
//                         hasPincode === "yes"
//                           ? (value) =>
//                               setAddressDetails((prev) => ({
//                                 ...prev,
//                                 district: value,
//                               }))
//                           : (value) => handleDistrictChange(value)
//                       }
//                       style={{
//                         width: "25%",
//                         marginRight: "2%",
//                       }}
//                     >
//                       <Option value="Visakhapatnam">
//                         {t("registration.Visakhapatnam")}
//                       </Option>
//                       <Option value="Vizianagaram">
//                         {t("registration.Vizianagaram")}
//                       </Option>
//                       <Option value="Srikakulam">
//                         {t("registration.Srikakulam")}
//                       </Option>
//                     </Select>
//                     <Select
//                       showSearch
//                       placeholder={t("registration.Select Mandal")}
//                       style={{
//                         width: "25%",
//                         marginRight: "2%",
//                       }}
//                       onChange={handleMandalChange}
//                       value={addressDetails.mandal || undefined}
//                       filterOption={false}
//                       allowClear
//                       onClear={handleClear1}
//                       onSearch={handleSearchMandalChange}
//                       notFoundContent={
//                         mandals.length === 0
//                           ? t("registration.Select District First")
//                           : null
//                       }
//                     >
//                       {mandals.map((mandal) => (
//                         <Option key={mandal} value={mandal}>
//                           {mandal}
//                         </Option>
//                       ))}
//                     </Select>
//                     <Select
//                       showSearch
//                       placeholder={t("registration.Select Village")}
//                       style={{
//                         width: "25%",
//                         marginRight: "2%",
//                       }}
//                       onChange={handleVillageChange}
//                       value={addressDetails.village || undefined}
//                       filterOption={false}
//                       allowClear
//                       onClear={handleClear}
//                       onSearch={handleSearchChange}
//                       notFoundContent={
//                         villages.length === 0
//                           ? t("registration.Select Mandal First")
//                           : null
//                       }
//                     >
//                       {villages.map((village) => (
//                         <Option key={village} value={village}>
//                           {village}
//                         </Option>
//                       ))}
//                     </Select>
//                   </Col>
//                 </Row>
//               </Modal>
//             </>
//           ) : (
//             <Row className="property-details" gutter={[0, 16]}>
//               {role === 1 ? (
//                 <Col xl={7} xs={24} sm={24} md={24} lg={12} xxl={6}>
//                   <span className="dropdown-title">
//                     {t("dashboard.Property Status")}
//                   </span>
//                   <Switch
//                     checked={filters.checkedValues.includes("sold")}
//                     onChange={onCheckboxChange}
//                     checkedChildren={t("dashboard.sold")}
//                     unCheckedChildren={t("dashboard.unSold")}
//                     size="small"
//                   />
//                   <br></br>
//                   {showData === "Commercial" && (
//                     <Checkbox.Group
//                       options={options1}
//                       onChange={onCheckboxChange1}
//                       value={checkedTypes}
//                     />
//                   )}
//                   {showData === "Residential" && (
//                     <Checkbox.Group
//                       options={optionsHouseType}
//                       onChange={onCheckboxChangeHouseType}
//                       value={checkedHouseType}
//                     />
//                   )}
//                 </Col>
//               ) : (
//                 (showData === "Commercial" || showData === "Residential") && (
//                   <Col xl={7} xs={24} sm={24} md={24} lg={12} xxl={6}>
//                     <span className="dropdown-title">
//                       {t("dashboard.Property Status")}
//                     </span>
//                     {showData === "Commercial" && (
//                       <Checkbox.Group
//                         options={options1}
//                         onChange={onCheckboxChange1}
//                         value={checkedTypes}
//                       />
//                     )}
//                     {showData === "Residential" && (
//                       <>
//                         <Checkbox.Group
//                           options={optionsHouseType}
//                           onChange={onCheckboxChangeHouseType}
//                           value={checkedHouseType}
//                         />
//                       </>
//                     )}
//                   </Col>
//                 )
//               )}

//               <Col xl={8} xs={24} sm={24} md={16} lg={12} xxl={6}>
//                 <span className="dropdown-title">
//                   {t("dashboard.Size Range")}
//                   {showData === "Agriculture"
//                     ? `(${t("dashboard.acre")})`
//                     : `(${t("dashboard.sqft")})`}
//                 </span>
//                 <Select
//                   style={{ width: "60%" }}
//                   placeholder="Select Size Range"
//                   onChange={handleSizeSelect}
//                   value={
//                     (showData === "Agriculture"
//                       ? AgrisizeOptions
//                       : sizeOptions
//                     ).find(
//                       (option) =>
//                         option.range[0] === filters.sizeRange[0] &&
//                         option.range[1] === filters.sizeRange[1]
//                     )?.label || "All"
//                   }
//                   defaultValue="All"
//                 >
//                   {(showData === "Agriculture"
//                     ? AgrisizeOptions
//                     : sizeOptions
//                   ).map((option) => (
//                     <Option key={option.label} value={option.label}>
//                       {option.label}
//                     </Option>
//                   ))}
//                 </Select>
//                 {sliderVisible1 && (
//                   <Slider
//                     range
//                     step={1}
//                     min={selectedRange1[0]}
//                     max={selectedRange1[1]}
//                     value={sizeRange}
//                     onChange={handleSliderChange1}
//                     tooltip={{
//                       formatter: (value) => `${value.toLocaleString()} INR`,
//                     }}
//                     trackStyle={{
//                       height: 4,
//                       backgroundColor: "#0D416B",
//                     }}
//                     handleStyle={{
//                       height: 20,
//                       width: 20,
//                     }}
//                     railStyle={{
//                       height: 4,
//                       backgroundColor: "#03a1fc",
//                     }}
//                     style={{
//                       marginTop: "10px",
//                       width: "80%",
//                     }}
//                   />
//                 )}
//               </Col>
//               <Col xl={9} xs={24} sm={24} md={16} lg={16} xxl={9}>
//                 <span className="dropdown-title">
//                   {t("dashboard.Price Range")} <small>(₹)</small>
//                 </span>
//                 <InputNumber
//                   min={0}
//                   placeholder="Min Price"
//                   value={minprice}
//                   onChange={handleMinPriceChange}
//                   style={{ width: "30%", height: "55%" }}
//                 />
//                 <InputNumber
//                   min={0}
//                   placeholder="Max Price"
//                   value={maxprice}
//                   onChange={handleMaxPriceChange}
//                   style={{ width: "40%", height: "55%" }}
//                 />

//                 {sliderVisible && (
//                   <Slider
//                     range
//                     step={100}
//                     min={0}
//                     max={maxPriceFromAPI1}
//                     value={sliderRange}
//                     onChange={handleSliderChange}
//                     tooltip={{
//                       formatter: (value) => `${value.toLocaleString()} INR`,
//                     }}
//                     trackStyle={{ height: 4, backgroundColor: "#0D416B" }}
//                     handleStyle={{ height: 20, width: 20 }}
//                     railStyle={{ height: 4, backgroundColor: "#03a1fc" }}
//                     style={{ marginTop: "5px", width: "80%" }}
//                   />
//                 )}
//               </Col>
//               <Col span={24}>
//                 <span className="dropdown-title">
//                   {t("dashboard.Location")}
//                 </span>
//                 <Select
//                   placeholder={t("registration.Select District")}
//                   value={addressDetails.district || undefined}
//                   onChange={
//                     hasPincode === "yes"
//                       ? (value) =>
//                           setAddressDetails((prev) => ({
//                             ...prev,
//                             district: value,
//                           }))
//                       : (value) => handleDistrictChange(value)
//                   }
//                   style={{
//                     width: "25%",
//                     marginRight: "2%",
//                   }}
//                 >
//                   <Option value="Visakhapatnam">
//                     {t("registration.Visakhapatnam")}
//                   </Option>
//                   <Option value="Vizianagaram">
//                     {t("registration.Vizianagaram")}
//                   </Option>
//                   <Option value="Srikakulam">
//                     {t("registration.Srikakulam")}
//                   </Option>
//                 </Select>
//                 <Select
//                   showSearch
//                   placeholder={t("registration.Select Mandal")}
//                   style={{
//                     width: "25%",
//                     marginRight: "2%",
//                   }}
//                   onChange={handleMandalChange}
//                   value={addressDetails.mandal || undefined}
//                   filterOption={false}
//                   allowClear
//                   onClear={handleClear1}
//                   onSearch={handleSearchMandalChange}
//                   notFoundContent={
//                     mandals.length === 0
//                       ? t("registration.Select District First")
//                       : null
//                   }
//                 >
//                   {mandals.map((mandal) => (
//                     <Option key={mandal} value={mandal}>
//                       {mandal}
//                     </Option>
//                   ))}
//                 </Select>
//                 <Select
//                   showSearch
//                   placeholder={t("registration.Select Village")}
//                   style={{
//                     width: "25%",
//                     marginRight: "2%",
//                   }}
//                   onChange={handleVillageChange}
//                   value={addressDetails.village || undefined}
//                   filterOption={false}
//                   allowClear
//                   onClear={handleClear}
//                   onSearch={handleSearchChange}
//                   notFoundContent={
//                     villages.length === 0
//                       ? t("registration.Select Mandal First")
//                       : null
//                   }
//                 >
//                   {villages.map((village) => (
//                     <Option key={village} value={village}>
//                       {village}
//                     </Option>
//                   ))}
//                 </Select>
//                 {/* <Button type="primary" onClick={()=>{
//                   console.log(filters);
//                 }}>Filter</Button> */}
//               </Col>
//             </Row>
//           )}
//         </div>
//       </div>

//       {showData === "Agriculture" &&
//         (role === 1 ? (
//           <Agriculture path={"getallfields"} filters={filters} />
//         ) : (
//           <BuyersAgriculture filters={filters} />
//         ))}
//       {showData === "Commercial" &&
//         (role === 1 ? (
//           <GetCommercial path={"getallcommercials"} filters={filters} />
//         ) : (
//           <BuyersCommercial filters={filters} />
//         ))}
//       {showData === "Layout" &&
//         (role === 1 ? (
//           <GetLayout path={"getalllayouts"} filters={filters} />
//         ) : (
//           <BuyersLayout filters={filters} />
//         ))}
//       {showData === "Residential" &&
//         (role === 1 ? (
//           <Residential path={"getallresidentials"} filters={filters} />
//         ) : (
//           <BuyersResidential filters={filters} />
//         ))}
//     </>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
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
  Space,
  Button,
  Spin,
  Card
} from "antd";
import {
  PlusCircleOutlined,
  ShopOutlined,
  BorderInnerOutlined,
  BorderlessTableOutlined,
  HomeOutlined,
  CloseOutlined,
  FilterFilled,
} from "@ant-design/icons";
import "./SearchPage.css";
import Agriculture from "./Agent/Agricultural/Agriculture";
import GetCommercial from "./Agent/Commericial/GetCommercial";
import GetLayout from "./Agent/Layout/GetLayout";
import AddProperty from "./Agent/Agricultural/AddProperty";
import LayoutForm from "./Agent/Layout/LayoutForm";
import CommercialForm from "./Agent/Commericial/CommercialForm";
import ResidentialForm from "./Agent/Residential/ResidentialForm";
import Residential from "./Agent/Residential/Residential";
import { jwtDecode } from "jwt-decode";
import BuyersCommercial from "./Buyers/Components/BuyersCommercial";
import BuyersAgriculture from "./Buyers/Components/BuyersAgriculture";
import BuyersLayout from "./Buyers/Components/BuyersLayout";
import BuyersResidential from "./Buyers/Components/BuyersResidential";
import { _get } from "../Service/apiClient";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function SearchPage() {
  const screens = useBreakpoint();
  const [filterModal, setFilterModal] = useState(false);
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(
    localStorage.getItem("type")

  );
  // const [isLoading,setIsLoading]=useState(false);
  const [agentrole, setAgentRole] = useState(() => {
    return parseInt(localStorage.getItem("agentrole")) || null; // Initialize from localStorage
  });
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("agentrole");
      setAgentRole(updatedRole ? parseInt(updatedRole) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange); // Cleanup listener on unmount
    };
  }, []);
  const cardRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowCard(""); // Close the card
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showData, setShowData] = useState(localStorage.getItem("type"));
  const [showCard, setShowCard] = useState(null);;
  const [checkedValues, setCheckedValues] = useState("All");
  const [checkedTypes, setCheckedTypes] = useState("All");
  const [checkedHouseType] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [sliderVisible, setSliderVisible] = useState(true);
  const [priceRange] = useState([0, Infinity]);
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(1000000);
  const [sliderRange, setSliderRange] = useState([0, Infinity]);
  const [distanceMedicine, setDistanceMedicine] = useState("");
  const [distanceEducation, setDistanceEducation] = useState("");
  
  const [sliderVisible1, setSliderVisible1] = useState(true);
  const [sizeRange, setSizeRange] = useState([0, Infinity]);
  const [maxPriceFromAPI1, setMaxPriceFromAPI1] = useState();
  const [minsize, setMinSize] = useState(0);
  const [showFormType, setShowFormType] = useState(null);
  const [maxsize, setMaxSize] = useState("");
  const [nameSearchQuery2, setNameSearchQuery2] = useState("");
  const [maxsizefromAPIvalue, setMaxSizeAPIvalue] = useState(100000);
  const [checkedFeatureTypes, setCheckedFeatureTypes] = useState("All");
  const [purposeType, setPurposeType] = useState("All");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptions1, setSelectedOptions1] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [selectedOptions3, setSelectedOptions3] = useState([]);
  const [propertyName, setPropertyName] = useState("");
  const [distanceFromRoad, setDistanceFromRoad] = useState("");
  const [layoutDistanceFromRoad, setLayoutDistanceFromRoad] = useState("");
  const [selectedBhks, setSelectedBhks] = useState([]);
  const [selectedFacing, setSelectedFacing] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedLayoutAmenities, setSelectedLayoutAmenities] = useState([]);
  const [selectedCommercialAmenities, setSelectedCommercialAmenities] = useState([]);
  const [CommercialDistanceFromRoad, setCommercialDistanceFromRoad] = useState("");
  const [agricultureDistanceFromRoad, setAgricultureDistanceFromRoad] = useState("");
  const [selectedRERAAmenities, setSelectedRERAAmenities] = useState([]);
  const [selectedAgricultureAmenities, setselectedAgricultureAmenities] = useState([]);
  const [selectedAgricultureLand, setselectedAgricultureLand] = useState([]);
  const [selectedLitigation,setSelectedLitigation]=useState(false);
 
  const [filters, setFilters] = useState({
    checkedValues: checkedValues,
    searchText: searchText,
    distanceFromRoad: distanceFromRoad,
    propertyType: selectedOptions1,
    lookingFor: selectedOptions,
    distanceMedicine: distanceMedicine,
    distanceEducation: distanceEducation,
    BHKS: selectedBhks,
    furnished: selectedStatuses,
    amenities: selectedAmenities,
    layoutAmenities: selectedLayoutAmenities,
    RERA: selectedRERAAmenities,
    layoutDistanceFromRoad: layoutDistanceFromRoad,
    CommercialDistanceFromRoad: CommercialDistanceFromRoad,
    commercialAmenities: selectedCommercialAmenities,
    agricultureDistanceFromRoad:agricultureDistanceFromRoad,
    litigation:selectedLitigation,
    agricultureAmenities:selectedAgricultureAmenities,
    landType:selectedAgricultureLand,
    commercialUsage: selectedOptions3,
    commercialPurpose: selectedOptions2,
    minPrice: minprice,
    maxPrice: maxprice,
    minSize: minsize,
    maxSize: maxsize,
    propertyFacing: selectedFacing,
    priceRange: priceRange,
    sizeRange: sizeRange,
    checkedTypes: "All",
    checkedFeatureTypes: "All",
    propertyName: propertyName,
    checkedHouseType: "All",
    purposeType: "All",
  });
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = decoded.user.role;
  const handleButtonClick = (type) => {
    console.log(type);
    setShowFormType(type);
  };


  const handleAmenityClick = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  const handleLayoutAmenityClick = (amenity) => {
    if (selectedLayoutAmenities.includes(amenity)) {
      setSelectedLayoutAmenities(selectedLayoutAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedLayoutAmenities([...selectedLayoutAmenities, amenity]);
    }
  };
  const handleAgricultureAmenityClick = (amenity) => {
    if (selectedAgricultureAmenities.includes(amenity)) {
      setselectedAgricultureAmenities(selectedAgricultureAmenities.filter((item) => item !== amenity));
    } else {
      setselectedAgricultureAmenities([...selectedAgricultureAmenities, amenity]);
    }
  };
  const handleAgricultureLandClick = (amenity) => {
    if (selectedAgricultureLand === amenity) {
      setselectedAgricultureLand("");  // Deselect if the same item is clicked again
    } else {
      setselectedAgricultureLand(amenity);  // Set the new selected item
    }
  };
  const handleAgricultureLitigationClick = (amenity) => {
    if (selectedLitigation === amenity) {
      setSelectedLitigation("");  // Deselect if the same item is clicked again
    } else {
      setSelectedLitigation(amenity);  // Set the new selected item
    }
  };
  
  const handleCommercialAmenityClick = (amenity) => {
    if (selectedCommercialAmenities.includes(amenity)) {
      setSelectedCommercialAmenities(selectedCommercialAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedCommercialAmenities([...selectedCommercialAmenities, amenity]);
    }
  };
  const handleLayoutRERAClick = (amenity) => {
    if (selectedRERAAmenities.includes(amenity)) {
      setSelectedRERAAmenities(selectedRERAAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedRERAAmenities([...selectedRERAAmenities, amenity]);
    }
  };


  const handleOptionClick1 = (option) => {
    setSelectedOptions1(selectedOptions1 === option ? null : option);
  };

  const handleOptionClick = (option) => {
    setSelectedOptions(selectedOptions === option ? null : option);
  };
  const handleOptionClick2 = (option) => {
    setSelectedOptions2(selectedOptions2 === option ? null : option);
  };
  const handleOptionClick3 = (option) => {
    setSelectedOptions3((prevSelected) => {
      let updatedSelection;
      if (prevSelected.includes(option)) {
        updatedSelection = prevSelected.filter((item) => item !== option); // Remove option if already selected
      } else {
        updatedSelection = [...prevSelected, option]; // Add option to the selection
      }
      return updatedSelection;
    });
  };


  const handleFacingClick = (option) => {
    setSelectedFacing(selectedFacing === option ? null : option);
  };
  useEffect(() => {
    const maxsizefromAPI = async () => {
      try {
        let first = checkedValues.includes("sold") ? "sold" : "@";
        let second = checkedValues.includes("unSold") ? "unsold" : "@";
        let type = showData.toLowerCase(); // Convert to lowercase for consistency
        if(type === "agriculture"){
          type="agricultural"
        }
        const response = await _get(`property/maxSizeForAllProps/${type}/@/@/@/@/@/${first}/${second}`);
        const data = response.data.maxSize;
  
        console.log(data);
        setMaxSize(data);
        setMaxSizeAPIvalue(data);
        setSizeRange([0, data]);
      } catch (error) {
        console.error("Error fetching max size:", error);
      }
    };
  
    const fetchMaxPrice = async () => {
      try {
        let url = `/property/maxPriceForAllProps/${showData.toLowerCase()}/@/@/@/@/@`;
        
        if (showData === "Residential") {
          const housetype = ["@", "@"];
          if (checkedHouseType.includes("Flat")) housetype[0] = "flat";
          if (checkedHouseType.includes("House")) housetype[1] = "house";
          url = `/property/maxPriceForAllProps/residential/@/@/@/${housetype[0]}/${housetype[1]}`;
        } else if (showData === "Commercial") {
          const types = ["@", "@", "@"];
          if (checkedTypes.includes("sell")) types[0] = "sell";
          if (checkedTypes.includes("rent")) types[1] = "rent";
          if (checkedTypes.includes("lease")) types[2] = "lease";
          url = `/property/maxPriceForAllProps/commercial/${types[0]}/${types[1]}/${types[2]}/@/@`;
        }
  
        const response = await _get(url);
        const maxPriceFromAPI = response.data.maxPrice;
        
        setMaxPrice(maxPriceFromAPI);
        setMaxPriceFromAPI1(maxPriceFromAPI);
      } catch (error) {
        console.error("Error fetching max price:", error);
      }
    };
  
    setSelectedType(localStorage.getItem("type"));
    setShowData(localStorage.getItem("type"));
    setSliderVisible(true);
    setSliderVisible1(true);
    maxsizefromAPI();
    fetchMaxPrice();
    setFilters({
      checkedValues: "All",
      searchText: "",
      distanceFromRoad: "",
      propertyType: "",
      lookingFor: "",
      BHKS: "",
      furnished: "",
      distanceMedicine: "",
      distanceEducation: "",
      amenities: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      agricultureDistanceFromRoad: "",
      litigation: "",
      agricultureAmenities: "",
      landType: "",
      layoutAmenities: "",
      CommercialDistanceFromRoad: "",
      commercialAmenities: "",
      commercialUsage: "",
      commercialPurpose: "",
      layoutDistanceFromRoad: "",
      RERA: "",
      propertyFacing: "",
      priceRange: [0, Infinity],
      sizeRange: [0, Infinity],
      checkedTypes: "All",
      checkedFeatureTypes: "All",
      checkedHouseType: "All",
      propertyName: "",
      purposeType: "All",
    });
  
    setSearchText("");
  
    function hideError(e) {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        document.getElementById("webpack-dev-server-client-overlay")?.setAttribute("style", "display: none");
        document.getElementById("webpack-dev-server-client-overlay-div")?.setAttribute("style", "display: none");
      }
    }
  
    window.addEventListener("error", hideError);
    return () => {
      window.removeEventListener("error", hideError);
    };
  }, [showData, checkedValues, checkedHouseType, checkedTypes]); 
  
  const [isLoading, setIsLoading] = useState(localStorage.getItem("isLoading") === "false");

  useEffect(() => {
    const checkLocalStorage = setInterval(() => {
      const localIsLoading = localStorage.getItem("isLoading") === "true";
      if (localIsLoading !== isLoading) {
        setIsLoading(localIsLoading);
      }
    }, 500); // Check every 500ms

    return () => clearInterval(checkLocalStorage); // Cleanup on unmount
  }, [isLoading]);
  
  const handleMinSizeChange = (value) => {
    setMinSize(value);
    setSizeRange([value, maxsize]);
  };
  const handleMaxSizeChange = (value) => {
    setMaxSize(value);
    setSizeRange([minsize, value]);
  };
  const handleSliderChange1 = (value) => {
    setMinSize(value[0]);
    setMaxSize(value[1]);
    setSizeRange(value);
   
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("type", type);
    setShowData(type);
  };


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
  const onCheckboxChange = (values) => {
        setCheckedValues(values);
    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   checkedValues: newCheckedValues,
    // }));
  };
  const onCheckboxChange1 = (values) => {
    setCheckedTypes(values);

  };
  const onCheckboxChange2 = (values) => {
    setCheckedFeatureTypes(values);

  };

  const onPurposeChange = (value) => {
    setPurposeType(value);

  };


 
  const handleSliderChange = (value) => {
    setMaxPrice(value);
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
   
  };
  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
   
  };
  const handleMinPriceChange = (value) => {
    setMinPrice(value);
    setSliderVisible(true);
    setSliderRange([value, maxprice]);
   
  };
  const onVillageChange = (event) => {
    setSearchText(event.target.value);
  }

  const clearingFilters = () => {
    console.log("data");
 
    window.location.reload();
    setPropertyName("");
    setDistanceFromRoad("");
    setSelectedLayoutAmenities("");
    setSelectedRERAAmenities("");
    setNameSearchQuery2("");
    setSearchText("");
    setSelectedOptions2("");
    setSelectedOptions3("");
    setCommercialDistanceFromRoad("");
    setSelectedCommercialAmenities("");
                  
    setSelectedOptions1("");
    setSelectedOptions("");
    setSelectedBhks([]);
    setSelectedStatuses([]);
    setSelectedFacing("");

    localStorage.removeItem("isLoading");
  };
  const clearingFilters1 = () => {
       setPropertyName("");
    setDistanceFromRoad("");
    setSelectedLayoutAmenities("");
    setSelectedRERAAmenities("");
    setNameSearchQuery2("");
    setSearchText("");
    setAgricultureDistanceFromRoad("");
    setSelectedLitigation("");
    setselectedAgricultureLand("");
    setselectedAgricultureAmenities("");     
    setSelectedOptions1("");
    setSelectedOptions("");
    setSelectedBhks([]);
    setSelectedStatuses([]);
    setSelectedFacing("");
    localStorage.removeItem("isLoading");
  };
  const Search = async () => {
    localStorage.setItem("isLoading", true);
    setIsLoading(true);
    const filters = {
      checkedValues: checkedValues,
      searchText: searchText,
      distanceFromRoad: distanceFromRoad,
      propertyType: selectedOptions1,
      lookingFor: selectedOptions,
      distanceMedicine: distanceMedicine,
      distanceEducation: distanceEducation,
      BHKS: selectedBhks,
      furnished: selectedStatuses,
      amenities: selectedAmenities,
      minPrice: minprice,
      maxPrice: maxprice,
      minSize: minsize,
      maxSize: maxsize,
      propertyFacing: selectedFacing,
      priceRange: sliderRange,
      sizeRange: sizeRange,
      checkedTypes: checkedTypes,
      agricultureDistanceFromRoad:agricultureDistanceFromRoad,
      litigation:selectedLitigation,
      agricultureAmenities:selectedAgricultureAmenities,
      landType:selectedAgricultureLand,
      layoutAmenities: selectedLayoutAmenities,
      layoutDistanceFromRoad: layoutDistanceFromRoad,
      RERA: selectedRERAAmenities,
      CommercialDistanceFromRoad: CommercialDistanceFromRoad,
      commercialAmenities: selectedCommercialAmenities,
      commercialUsage: selectedOptions3,
      commercialPurpose: selectedOptions2,
      checkedFeatureTypes: checkedFeatureTypes,
      checkedHouseType: checkedHouseType,
      propertyName: nameSearchQuery2,
      purposeType: purposeType,
    };

    setFilters(filters);

    setTimeout(() => {
      localStorage.setItem("isLoading", "false");
      setIsLoading(false);
    }, 3000);
  };

  const handleBhkClick = (bhk) => {
    setSelectedBhks(selectedBhks.includes(bhk) ? [] : [bhk]);
  };



  const handleStatusClick = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((item) => item !== status)); // Remove from selected
    } else {
      setSelectedStatuses([...selectedStatuses, status]); // Add to selected
    }
  };
  return (
    <>
      {!showFormType ? (
        <div className="landview-container">
          <div className="relative">
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?cs=srgb&dl=pexels-binyaminmellish-1396122.jpg&fm=jpg"
                alt="Estately"
                className="landview-image"
                style={{ width: '110%', height: '300px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'black',
                  opacity: 0.4,
                  zIndex: 0,
                  marginTop: "-4%",
                  marginLeft: "-1%",
                  marginRight: "-1%",
                }}
              ></div>
            </div>
          </div>

          {/* </div> */}


          <div className="landview-options">
            <div className="option-buttons">
              {screens.md ? (
                <>
                  <button
                    className={`option-button ${selectedType === "Agriculture" ? "selected" : ""
                      }`}
                    onClick={() => handleTypeChange("Agriculture")}
                  >
                    {t("landing.agricultural")}
                  </button >
                  <button
                    className={`option-button ${selectedType === "Commercial" ? "selected" : ""
                      }`}
                    onClick={() => handleTypeChange("Commercial")}
                  >
                    {t("landing.commercial")}
                  </button>
                  <button
                    className={`option-button ${selectedType === "Layout" ? "selected" : ""
                      }`}
                    onClick={() => handleTypeChange("Layout")}
                  >
                    {t("landing.layout")}
                  </button>



                  <button
                    className={`option-button ${selectedType === "Residential" ? "selected" : ""}`}
                    onClick={() => handleTypeChange("Residential")}
                  >
                    {t("landing.residential")}
                  </button>



                </>
              ) : (
                <Select
                  value={selectedType}
                  onChange={handleTypeChange}
                  style={{ width: "100%" }}
                  className="custom-select"
                  placeholder={t("landing.selectType")}
                >
                  <Option value="Agriculture">{t("landing.agricultural")}</Option>
                  <Option value="Commercial">{t("landing.commercial")}</Option>
                  <Option value="Layout">{t("landing.layout")}</Option>
                  <Option value="Residential">{t("landing.residential")}</Option>
                </Select>
              )}
            </div>
            {screens.xs ? (
              <>
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
                    {role === 1 && (agentrole === 0 || agentrole ===12) ? (
                      <Col xl={showData === "Agriculture" || showData === "Layout" ? 6 : 12}
                        xs={24} sm={12} md={6} lg={8} xxl={6} style={{ marginLeft: "2%" }}>
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


                              <Select
                                placeholder="Sold/Unsold"
                                onChange={onCheckboxChange}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Sold">{t("dashboard.sold")}</Option>
                                <Option value="Unsold">{t("dashboard.unSold")}</Option>
                              </Select>
                            </Row>
                            <Row style={{ marginTop: "3%" }}>
                              <Select
                                placeholder="Sell/Rent/Lease"
                                onChange={onCheckboxChange1}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Sell">{t("dashboard.sell")}</Option>
                                <Option value="Rent">{t("dashboard.rent")}</Option>
                                <Option value="Lease">{t("dashboard.lease")}</Option>
                              </Select>

                            </Row>
                            <Row style={{ marginTop: "3%" }}>
                              <Select
                                placeholder="Purpose"
                                onChange={onCheckboxChange2}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">Multi-use</Option>
                                <Option value="Sell">Retail</Option>
                                <Option value="Rent">Industrial</Option>
                                <Option value="Lease">Hospitality</Option>
                                <Option value="Social Activities">Social Activities</Option>
                              </Select>

                            </Row>
                          </>
                        )}
                        {showData === "Residential" && (
                          <>
                            <Row>

                              <Select
                                placeholder="Sold/unsold"
                                onChange={onCheckboxChange}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Sold">{t("dashboard.sold")}</Option>
                                <Option value="Unsold">{t("dashboard.unSold")}</Option>
                              </Select>
                            </Row>
                            {/* <Row style={{ marginTop: "3%" }}>
                              <Select
                                placeholder="Flat/house/Apartment"
                                onChange={onCheckboxChangeHouseType}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Flat">{t("dashboard.flat")}</Option>
                                <Option value="House">{t("dashboard.house")}</Option>
                                <Option value="Apartment">Apartment</Option>
                              </Select>

                            </Row> */}
                            <Row style={{ marginTop: "3%" }}>
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

                            </Row>
                          </>
                        )}


                      </Col>
                    ) : (
                      (showData === "Commercial" ||
                        showData === "Residential") && (
                        <Col xl={7} xs={24} sm={24} md={24} lg={12} xxl={6}>
                          <span className="dropdown-title">
                            {t("dashboard.Property Status")}
                          </span>
                          {showData === "Commercial" && (
                            <>
                              <Select
                                placeholder="Sell/Rent/Lease"
                                onChange={onCheckboxChange1}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Sell">{t("dashboard.sell")}</Option>
                                <Option value="Rent">{t("dashboard.rent")}</Option>
                                <Option value="Lease">{t("dashboard.lease")}</Option>
                              </Select>

                              <Row style={{ marginTop: "3%" }}>
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
                              </Row>
                            </>
                          )}

                          {showData === "Residential" && (
                            <>
                              {/* <Select
                                placeholder="Flat/House/Apartment"
                                onChange={onCheckboxChangeHouseType}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Flat">{t("dashboard.flat")}</Option>
                                <Option value="House">{t("dashboard.house")}</Option>
                                <Option value="Apartment">Apartment</Option>
                              </Select> */}

                              <Row style={{ marginTop: "3%" }}>
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

                              </Row>
                            </>
                          )}
                        </Col>
                      )
                    )}


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
                        style={{ width: localStorage.getItem("language") === "en" ? "30%" : "20%", height: "47%" }}
                      />
                      <InputNumber
                        placeholder="Max size"
                        value={maxsize}
                        onChange={handleMaxSizeChange}
                        style={{ width: localStorage.getItem("language") === "en" ? "30%" : "20%", height: "47%" }}
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
                              `${value.toLocaleString()} ${showData === "Agriculture" ? "acre" : "sq.ft"}`,
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
                        value={formatPrice(minprice)}
                        onChange={handleMinPriceChange}
                        style={{ width: "30%", height: "47%" }}
                      />
                      <InputNumber
                        min={0}
                        placeholder="Max Price"
                        value={formatPrice(maxprice)} // Format the max price here
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
                            formatter: (value) => formatPrice(value), // Use formatPrice to format the value
                          }}
                          trackStyle={{ height: 4, backgroundColor: "#0D416B" }}
                          handleStyle={{ height: 20, width: 20 }}
                          railStyle={{ height: 4, backgroundColor: "#03a1fc" }}
                        />
                      )}

                    </Col>

                    <Col xl={5} xs={12} sm={12} md={6} lg={6} xxl={6}>
                      <Input type="text" value={searchText} onChange={onVillageChange} placeholder="Enter Location" style={{ width: "80%" }} />
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
                    <Col xl={3} xs={6} sm={12} md={6} lg={6} xxl={6} style={{ marginLeft: "2%" }}>
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
              </>
            ) : (
              <div className="property-details">
                <Row gutter={[0, 16]}>

                  <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6}>
                    <Input type="text" value={searchText} onChange={onVillageChange} placeholder="Enter Location" style={{ width: "80%" }} />
                  </Col>
                  <Col xs={24} sm={12} md={4} lg={4} xl={4}>
                    <Input
                      placeholder="Property Name / ID"
                      allowClear
                      onChange={(e) => {
                        console.log(e.target.value);
                        setNameSearchQuery2(e.target.value);
                      }}

                    />

                  </Col>
                  {role === 1 && (agentrole === 0 || agentrole ===12) ? (
                    <>

                      {showData === "Agriculture" && (
                        <Col xs={24} sm={12} md={4} lg={4} xl={4} style={{ marginLeft: "3%" }}>
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
                        <Col xs={24} sm={12} md={4} lg={4} xl={4} style={{ marginLeft: "3%" }}>
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

                          <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6} style={{ marginLeft: "2%" }}>

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
                          <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6}>
                            <Select
                              placeholder="Sell/Rent/Lease"
                              onChange={onCheckboxChange1}
                              style={{ width: "80%" }}
                            >
                              <Option value="All">{t("dashboard.all")}</Option>
                              <Option value="Sell">{t("dashboard.sell")}</Option>
                              <Option value="Rent">{t("dashboard.rent")}</Option>
                              <Option value="Lease">{t("dashboard.lease")}</Option>
                            </Select>
                          </Col>
                          <Col xl={4} xs={24} sm={12} md={4} lg={6} xxl={6}>
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

                          <Col xl={4} xs={24} sm={12} md={3} lg={8} xxl={8} style={{ marginLeft: "1%" }}>
                            <Select
                              placeholder="Sold/unsold"
                              onChange={onCheckboxChange}
                              style={{ width: "80%" }}
                            >
                              <Option value="All">{t("dashboard.all")}</Option>
                              <Option value="Sold">{t("dashboard.sold")}</Option>
                              <Option value="Unsold">{t("dashboard.unSold")}</Option>
                            </Select>
                          </Col>
                          {/* <Col xl={4} xs={24} sm={12} md={3} lg={8} xxl={8} style={{ marginLeft: "1%" }}>
                            <Button icon={<FilterOutlined />} style={{ marginLeft: 8 }}>
                              Filter
                            </Button>
                          </Col> */}
                          {/* <Col xl={5} xs={24} sm={12} md={5} lg={8} xxl={8}>
                            <Select
                              placeholder="Flat/house/Apartment"
                              onChange={onCheckboxChangeHouseType}
                              style={{ width: "80%" }}
                            >
                              <Option value="All">{t("dashboard.all")}</Option>
                              <Option value="Flat">{t("dashboard.flat")}</Option>
                              <Option value="House">{t("dashboard.house")}</Option>
                              <Option value="Apartment">Apartment</Option>
                            </Select>
                          </Col> */}
                          <Col xl={4} xs={24} sm={12} md={4} lg={8} xxl={8}>
                            <Select
                              placeholder="Sell/Rent/Lease"
                              onChange={onPurposeChange}
                              style={{ width: "80%" }}
                            >
                              <Option value="All">{t("dashboard.all")}</Option>
                              <Option value="sell">Sell</Option>
                              <Option value="rent">Rent</Option>
                              <Option value="lease">Lease</Option>
                            </Select>

                          </Col>

                        </>
                      )}




                      <Col xl={2} xs={24} sm={12} md={6} lg={8} xxl={4}>
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
                    </>
                  ) : (
                    (showData === "Commercial" || showData === "Residential" || showData === "Layout" || showData === "Agriculture") && (
                      <>
                        {showData === "Commercial" && (
                          <>
                            <Col xl={4} xs={24} sm={12} md={3} lg={8} xxl={8} style={{ marginLeft: "1%" }}>
                              <div
                                onMouseEnter={() => {
                                  setShowCard("Commercial");
                                }}
                                onMouseLeave={(e) => {
                                  const cardElement = document.getElementById("filterCard");
                                  if (cardElement && !cardElement.contains(e.relatedTarget)) {
                                    setShowCard("");
                                  }
                                }}
                              >
                                <Button icon={<FilterFilled />} style={{ marginLeft: 8 }}>
                                  More Filters
                                </Button>
                              </div>
                            </Col>
                            {showCard === "Commercial" && (
                              <Card
                                id="filterCard"
                                title={t("Filter Options")}
                                bordered
                                style={{
                                  width: 600,
                                  position: "absolute",
                                  zIndex: 100,
                                  marginLeft: "30%",
                                  top: "120px", // Adjusted to avoid overlapping with the button
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
                                  borderRadius: "8px",
                                }}
                                onMouseLeave={() => setShowCard("")}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                  <div>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>Distance from Road (in Kms):</label>
                                    <Input
                                      placeholder="Enter distance from road"
                                      value={CommercialDistanceFromRoad}
                                      onChange={(e) => setCommercialDistanceFromRoad(e.target.value)}
                                      style={{ width: "30%", marginTop: "5px", marginBottom: "10px" }}
                                    />
                                  </div>
                                  {/* Other filter items */}
                                </div>



                                <div className="filter-item" style={{ marginBottom: "20px" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Amenities</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {[
                                      "Parking",
                                      "Security",
                                      "PowerBackUp",
                                      "Road Faced",
                                    ].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleCommercialAmenityClick(amenity)}
                                        style={{
                                          backgroundColor: selectedCommercialAmenities.includes(amenity) ? "rgb(56 150 225)" : "white",
                                          color: selectedCommercialAmenities.includes(amenity) ? "white" : "black",
                                          border: selectedCommercialAmenities.includes(amenity) ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedCommercialAmenities.includes(amenity) && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <div className="filter-item" style={{ flex: 1 }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px", display: "block" }}>
                                    Looking For:
                                  </label>
                                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    {["Sell", "Rent", "Lease"].map((option) => (
                                      <Button
                                        key={option}
                                        onClick={() => handleOptionClick2(option)}
                                        style={{
                                          backgroundColor: selectedOptions2 === option ? "rgb(56 150 225)" : "white",
                                          color: selectedOptions2 === option ? "white" : "black",
                                          border: selectedOptions2 === option ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedOptions2 === option && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div className="filter-item" style={{ flex: 1, marginTop: "2%" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px", display: "block" }}>
                                    Usage:
                                  </label>
                                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    {["Retail", "Industrial", "Hospitality", "SocialActivities", "Other"].map((option) => (
                                      <Button
                                        key={option}
                                        onClick={() => handleOptionClick3(option)}
                                        style={{
                                          backgroundColor: selectedOptions3.includes(option) ? "rgb(56 150 225)" : "white",
                                          color: selectedOptions3.includes(option) ? "white" : "black",
                                          border: selectedOptions3.includes(option) ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedOptions3.includes(option) && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <Row gutter={[16, 16]} style={{ marginTop: "2%" }}>
                                  <Col xl={4} xs={24} sm={12} md={6} lg={6} xxl={6}>
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        clearingFilters1();
                                      }}
                                    >
                                      Reset
                                    </Button>
                                  </Col>
                                  <Col xl={3} xs={24} sm={12} md={6} lg={6} xxl={6} style={{ marginLeft: "2%" }}>
                                    <Button type="primary" onClick={Search} disabled={isLoading}>
                                      {isLoading ? <Spin size="small" /> : "Search"}
                                    </Button>
                                  </Col>
                                </Row>
                              </Card>
                            )}
                            {/* <Col xl={5} xs={24} sm={24} md={5} lg={12} xxl={6} style={{ marginLeft: "3%" }}>
                              <Select
                                placeholder="Sell/Rent/Lease"
                                onChange={onCheckboxChange1}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Sell">{t("dashboard.sell")}</Option>
                                <Option value="Rent">{t("dashboard.rent")}</Option>
                                <Option value="Lease">{t("dashboard.lease")}</Option>
                              </Select>
                            </Col>

                            <Col xl={5} xs={24} sm={24} md={5} lg={12} xxl={6}>
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
                            </Col> */}
                          </>
                        )}
                        {showData === "Agriculture" && (
                          <>
                            <Col xl={4} xs={24} sm={12} md={3} lg={8} xxl={8} style={{ marginLeft: "1%" }}>
                              <div
                                onMouseEnter={() => {
                                  setShowCard("Agriculture");
                                }}
                                onMouseLeave={(e) => {
                                  const cardElement = document.getElementById("filterCard");
                                  if (cardElement && !cardElement.contains(e.relatedTarget)) {
                                    setShowCard("");
                                  }
                                }}
                              >
                                <Button icon={<FilterFilled />} style={{ marginLeft: 8 }}>
                                  More Filters
                                </Button>
                              </div>
                            </Col>
                            {showCard === "Agriculture" && (
                              <Card
                                id="filterCard"
                                title={t("Filter Options")}
                                bordered
                                style={{
                                  width: 500,
                                  position: "absolute",
                                  zIndex: 100,
                                  marginLeft: "30%",
                                  top: "120px", // Adjusted to avoid overlapping with the button
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
                                  borderRadius: "8px",
                                }}
                                onMouseLeave={() => setShowCard("")}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                  <div>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>Distance from Road (in Kms):</label>
                                    <Input
                                      placeholder="Enter distance from road"
                                      value={agricultureDistanceFromRoad}
                                      onChange={(e) => setAgricultureDistanceFromRoad(e.target.value)}
                                      style={{ width: "30%", marginTop: "5px", marginBottom: "10px" }}
                                    />
                                  </div>
                                  {/* Other filter items */}
                                </div>



                                <div className="filter-item" style={{ marginBottom: "20px" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Amenities</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {[
                                      "Bore Facility",
                                      "Electricity Facility",
                                      "Storage Facility",
                                    ].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleAgricultureAmenityClick(amenity)}
                                        style={{
                                          backgroundColor: selectedAgricultureAmenities.includes(amenity) ? "rgb(56 150 225)" : "white",
                                          color: selectedAgricultureAmenities.includes(amenity) ? "white" : "black",
                                          border: selectedAgricultureAmenities.includes(amenity) ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedAgricultureAmenities.includes(amenity) && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div className="filter-item" style={{ marginBottom: "20px" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Type of Land</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {["Dry Land", "Wet Land", "Converted Land"].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleAgricultureLandClick(amenity)}
                                        style={{
                                          backgroundColor: selectedAgricultureLand === amenity ? "rgb(56 150 225)" : "white",
                                          color: selectedAgricultureLand === amenity ? "white" : "black",
                                          border: selectedAgricultureLand === amenity ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedAgricultureLand === amenity && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                   <div className="filter-item" style={{ marginBottom: "20px",marginTop:"20px" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Land is having Litigation</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {["true", "false"].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleAgricultureLitigationClick(amenity)}
                                        style={{
                                          backgroundColor: selectedLitigation === amenity ? "rgb(56 150 225)" : "white",
                                          color: selectedLitigation === amenity ? "white" : "black",
                                          border: selectedLitigation === amenity ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedLitigation === amenity && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                         </div>
                         
                                <Row gutter={[16, 16]} >
                                  <Col xl={4} xs={24} sm={12} md={6} lg={6} xxl={6}>
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        clearingFilters1();
                                      }}
                                    >
                                      Reset
                                    </Button>
                                  </Col>
                                  <Col xl={3} xs={24} sm={12} md={6} lg={6} xxl={6} style={{ marginLeft: "2%" }}>
                                    <Button type="primary" onClick={Search} disabled={isLoading}>
                                      {isLoading ? <Spin size="small" /> : "Search"}
                                    </Button>
                                  </Col>
                                </Row>
                              </Card>
                            )}
                          </>
                        )}
                        {showData === "Layout" && (
                          <>
                            <Col xl={4} xs={24} sm={12} md={3} lg={8} xxl={8} style={{ marginLeft: "1%" }}>
                              <div
                                onMouseEnter={() => {
                                  setShowCard("Layout");
                                }}
                                onMouseLeave={(e) => {
                                  const cardElement = document.getElementById("filterCard");
                                  if (cardElement && !cardElement.contains(e.relatedTarget)) {
                                    setShowCard("");
                                  }
                                }}
                              >
                                <Button icon={<FilterFilled />} style={{ marginLeft: 8 }}>
                                  More Filters
                                </Button>
                              </div>
                            </Col>
                            {showCard === "Layout" && (
                              <Card
                                id="filterCard"
                                title={t("Filter Options")}
                                bordered
                                style={{
                                  width: 800,
                                  position: "absolute",
                                  zIndex: 100,
                                  marginLeft: "30%",
                                  top: "120px", // Adjusted to avoid overlapping with the button
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
                                  borderRadius: "8px",
                                }}
                                onMouseLeave={() => setShowCard("")}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                  <div>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>Distance from Road (in Kms):</label>
                                    <Input
                                      placeholder="Enter distance from road"
                                      value={layoutDistanceFromRoad}
                                      onChange={(e) => setLayoutDistanceFromRoad(e.target.value)}
                                      style={{ width: "30%", marginTop: "5px", marginBottom: "10px" }}
                                    />
                                  </div>
                                  {/* Other filter items */}
                                </div>



                                <div className="filter-item" style={{ marginBottom: "20px" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Amenities</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {[
                                      "UnderGround Water",
                                      "Drainage System",
                                      "Play Zone",
                                      "Swimming Poll",
                                      "Convention Hall",

                                    ].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleLayoutAmenityClick(amenity)}
                                        style={{
                                          backgroundColor: selectedLayoutAmenities.includes(amenity) ? "rgb(56 150 225)" : "white",
                                          color: selectedLayoutAmenities.includes(amenity) ? "white" : "black",
                                          border: selectedLayoutAmenities.includes(amenity) ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedLayoutAmenities.includes(amenity) && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div className="filter-item" style={{ marginBottom: "20px" }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Permissions</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {[
                                      "RERA Registered",
                                      "DTCP Approved",
                                      "TLP Approved",
                                      "FLP Approved",


                                    ].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleLayoutRERAClick(amenity)}
                                        style={{
                                          backgroundColor: selectedRERAAmenities.includes(amenity) ? "rgb(56 150 225)" : "white",
                                          color: selectedRERAAmenities.includes(amenity) ? "white" : "black",
                                          border: selectedRERAAmenities.includes(amenity) ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedRERAAmenities.includes(amenity) && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <Row gutter={[16, 16]} >
                                  <Col xl={2} xs={24} sm={12} md={6} lg={6} xxl={6}>
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        clearingFilters1();
                                      }}
                                    >
                                      Reset
                                    </Button>
                                  </Col>
                                  <Col xl={3} xs={24} sm={12} md={6} lg={6} xxl={6} style={{ marginLeft: "2%" }}>
                                    <Button type="primary" onClick={Search} disabled={isLoading}>
                                      {isLoading ? <Spin size="small" /> : "Search"}
                                    </Button>
                                  </Col>
                                </Row>
                              </Card>
                            )}
                          </>
                        )}
                        {showData === "Residential" && (
                          <>
                            <Col xl={4} xs={24} sm={12} md={3} lg={8} xxl={8} style={{ marginLeft: "1%" }}>
                              <div
                                onMouseEnter={() => {
                                  setShowCard("Residential");
                                }}
                                onMouseLeave={(e) => {
                                  const cardElement = document.getElementById("filterCard");
                                  if (cardElement && !cardElement.contains(e.relatedTarget)) {
                                    setShowCard("");
                                  }
                                }}
                              >
                                <Button icon={<FilterFilled />} style={{ marginLeft: 8 }}>
                                  More Filters
                                </Button>
                              </div>
                            </Col>

                            {showCard === "Residential" && (
                              <Card
                                id="filterCard"
                                title={t("Filter Options")}
                                bordered
                                style={{
                                  width: 800,
                                  position: "absolute",
                                  zIndex: 100,
                                  marginLeft: "30%",
                                  top: "120px", // Adjusted to avoid overlapping with the button
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)",
                                  borderRadius: "8px",
                                }}
                                onMouseLeave={() => setShowCard("")}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                  <div>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>Distance from Road (in Kms):</label>
                                    <Input
                                      placeholder="Enter distance from road"
                                      value={distanceFromRoad}
                                      onChange={(e) => setDistanceFromRoad(e.target.value)}
                                      style={{ width: "30%", marginTop: "5px", marginBottom: "10px" }}
                                    />
                                  </div>
                                  {/* Other filter items */}
                                </div>
                                <div className="filter-container" style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
                                  {/* Select Property Type */}
                                  <div className="filter-item" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px", display: "block" }}>
                                      Select Property Type:
                                    </label>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                      {["Flat", "Apartment", "House"].map((option) => (
                                        <Button
                                          key={option}
                                          onClick={() => handleOptionClick1(option)}
                                          style={{
                                            backgroundColor: selectedOptions1 === option ? "rgb(56 150 225)" : "white",
                                            color: selectedOptions1 === option ? "white" : "black",
                                            border: selectedOptions1 === option ? "none" : "1px solid black",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {selectedOptions1 === option && <CheckOutlined style={{ marginRight: 5 }} />}
                                          {option}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Looking For */}
                                  <div className="filter-item" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px", display: "block" }}>
                                      Looking For:
                                    </label>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                      {["Sell", "Rent", "Lease"].map((option) => (
                                        <Button
                                          key={option}
                                          onClick={() => handleOptionClick(option)}
                                          style={{
                                            backgroundColor: selectedOptions === option ? "rgb(56 150 225)" : "white",
                                            color: selectedOptions === option ? "white" : "black",
                                            border: selectedOptions === option ? "none" : "1px solid black",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {selectedOptions === option && <CheckOutlined style={{ marginRight: 5 }} />}
                                          {option}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                                <div className="filter-container" style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
                                  {/* No. of Bedrooms */}
                                  <div className="filter-item" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>{t("No. of Bedrooms")}</label>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                      {["1BHK", "2BHK", "3BHK", "4BHK"].map((bhk) => (
                                        <Button
                                          key={bhk}
                                          onClick={() => handleBhkClick(bhk)}
                                          style={{
                                            backgroundColor: selectedBhks.includes(bhk) ? "rgb(56 150 225)" : "white",
                                            color: selectedBhks.includes(bhk) ? "white" : "black",
                                            border: selectedBhks.includes(bhk) ? "none" : "1px solid black",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {selectedBhks.includes(bhk) && <CheckOutlined style={{ marginRight: 5 }} />}
                                          {bhk}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Furnishing Status */}
                                  <div className="filter-item" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>{t("Furnishing Status")}</label>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                      {["Furnished", "Semi-Furnished", "Unfurnished"].map((status) => (
                                        <Button
                                          key={status}
                                          onClick={() => handleStatusClick(status)}
                                          style={{
                                            backgroundColor: selectedStatuses.includes(status) ? "rgb(56 150 225)" : "white",
                                            color: selectedStatuses.includes(status) ? "white" : "black",
                                            border: selectedStatuses.includes(status) ? "none" : "1px solid black",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {selectedStatuses.includes(status) && <CheckOutlined style={{ marginRight: 5 }} />}
                                          {status}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-item" style={{ flex: 1 }}>
                                  <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px", display: "block" }}>
                                    Property Facing:
                                  </label>
                                  <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "10px" }}>
                                    {["East", "West", "North", "South"].map((option) => (
                                      <Button
                                        key={option}
                                        onClick={() => handleFacingClick(option)}
                                        style={{
                                          backgroundColor: selectedFacing === option ? "rgb(56 150 225)" : "white",
                                          color: selectedFacing === option ? "white" : "black",
                                          border: selectedFacing === option ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedFacing === option && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div className="filter-item">
                                  <label style={{ fontWeight: "bold", fontSize: "16px" }}>Amenities</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {[
                                      "Parking",
                                      "Power BackUp",
                                      "Park",
                                      "Swimming",
                                      "Lift",
                                      "Gym",
                                      "Security"
                                    ].map((amenity) => (
                                      <Button
                                        key={amenity}
                                        onClick={() => handleAmenityClick(amenity)}
                                        style={{
                                          backgroundColor: selectedAmenities.includes(amenity) ? "rgb(56 150 225)" : "white",
                                          color: selectedAmenities.includes(amenity) ? "white" : "black",
                                          border: selectedAmenities.includes(amenity) ? "none" : "1px solid black",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {selectedAmenities.includes(amenity) && <CheckOutlined style={{ marginRight: 5 }} />}
                                        {amenity}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div className="filter-item" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", marginTop: "20px" }}>
                                  {/* Property Name/ID */}
                                  <div style={{ flex: 1 }}>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>Distance to Medical Facilities (in Kms):</label>
                                    <Input
                                      placeholder="Enter Distance from Medical Facilities"
                                      value={distanceMedicine}
                                      onChange={(e) => setDistanceMedicine(e.target.value)}
                                      style={{ width: "70%", marginTop: "5px", marginBottom: "10px" }}
                                    />
                                  </div>

                                  {/* Distance from Road */}
                                  <div style={{ flex: 1 }}>
                                    <label style={{ fontWeight: "bold", fontSize: "16px" }}>Distance to Educational Facilities (in Kms) : </label>
                                    <Input
                                      placeholder="Enter distance from Educational Facilities "
                                      value={distanceEducation}
                                      onChange={(e) => setDistanceEducation(e.target.value)}
                                      style={{ width: "70%", marginTop: "5px", marginBottom: "10px" }}
                                    />
                                  </div>
                                </div>
                                <Row gutter={[16, 16]}>
                                  <Col xl={2} xs={24} sm={12} md={6} lg={6} xxl={6}>
                                    <Button
                                      type="primary"
                                      onClick={() => {
                                        clearingFilters1();
                                      }}
                                    >
                                      Reset
                                    </Button>
                                  </Col>
                                  <Col xl={3} xs={24} sm={12} md={6} lg={6} xxl={6} style={{ marginLeft: "2%" }}>
                                    <Button type="primary" onClick={Search} disabled={isLoading}>
                                      {isLoading ? <Spin size="small" /> : "Search"}
                                    </Button>
                                  </Col>
                                </Row>
                              </Card>
                            )}


                            {/* <Col xl={5} xs={24} sm={24} md={5} lg={12} xxl={6} style={{ marginLeft: "3%" }}>
                              <Select
                                placeholder="Flat/House/Apartment"
                                onChange={onCheckboxChangeHouseType}
                                style={{ width: "80%" }}
                              >
                                <Option value="All">{t("dashboard.all")}</Option>
                                <Option value="Flat">{t("dashboard.flat")}</Option>
                                <Option value="House">{t("dashboard.house")}</Option>
                                <Option value="Apartment">Apartment</Option>
                              </Select>
                            </Col> */}
                            {/* <Col xl={5} xs={24} sm={24} md={5} lg={12} xxl={6} >
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

                            </Col> */}
                          </>
                        )}
                      </>
                    )
                  )}
                </Row>
                <Row gutter={[8, 16]} style={{ marginTop: "3%" }}>
                  <Col xl={9} xs={24} sm={24} md={16} lg={12} xxl={6}>
                    <span className="dropdown-title" style={{
                      width: localStorage.getItem("language") === "te" ? "10%" : "auto",
                      wordBreak: "break-word", // Break words if they are too long
                      whiteSpace: "normal"
                    }}>
                      {t("dashboard.Size Range")}
                      {showData === "Agriculture"
                        ? `(${t("dashboard.acre")})`
                        : "(sq. ft)"}
                    </span>

                    <InputNumber
                      placeholder="Min size"
                      value={minsize}
                      onChange={handleMinSizeChange}
                      style={{ width: localStorage.getItem("language") === "en" ? "30%" : "30%", height: "47%", marginRight: "10px" }}
                    />
                    <InputNumber
                      placeholder="Max size"
                      value={maxsize}
                      onChange={handleMaxSizeChange}
                      style={{ width: localStorage.getItem("language") === "en" ? "30%" : "34%", height: "47%" }}
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
                          formatter: (value) => `${value.toLocaleString()} ${showData === "Agriculture" ? "acre" : "sq.ft"}`,

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
                      style={{ width: "30%", height: "47%", marginRight: "10px" }}
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



                </Row>
              </div>
            )}
          </div>
          {console.log("djdjdj", filters)}
          {
            showData === "Agriculture" && (
              agentrole === 11 ? (
                <BuyersAgriculture filters={filters} />
              ) : agentrole === 12 ? (
                <Agriculture path={"getallfields"} filters={filters} />
              ) : (
                <BuyersAgriculture filters={filters} />
              )
            )
          }

          {
            showData === "Commercial" && (
              agentrole === 11 ? (
                <BuyersCommercial filters={filters} />
              ) : agentrole === 12 ? (
                <GetCommercial path={"getallcommercials"} filters={filters} />
              ) : (
                <BuyersCommercial filters={filters} />
              )
            )
          }

          {showData === "Layout" &&
            (
              agentrole === 11 ? (
                <BuyersLayout filters={filters} />
              ) : agentrole === 12 ? (
                <GetLayout path={"getalllayouts"} filters={filters} />
              ) : (
                <BuyersLayout filters={filters} />
              )
            )
          }
          {showData === "Residential" &&
            (
              agentrole === 11 ? (
                <BuyersResidential filters={filters} />
              ) : agentrole === 12 ? (
                <Residential path={"getallresidentials"} filters={filters} />
              ) : (
                <BuyersResidential filters={filters} />
              )
            )
          }
        </div>
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
          {showFormType === "commercial" && <CommercialForm setShowFormType={setShowFormType} />}
          {showFormType === "agriculture" && <AddProperty setShowFormType={setShowFormType} />}
          {showFormType === "layout" && <LayoutForm setShowFormType={setShowFormType} />}
          {showFormType === "residential" && <ResidentialForm setShowFormType={setShowFormType} />}
        </div>
      )}


    </>
  );
}
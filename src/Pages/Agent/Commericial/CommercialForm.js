import React, { useState, useEffect, useRef,useCallback } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,

  Radio,
  Checkbox,
  Row,
  Col,
  Switch,
  Select,

  Tooltip,
  Collapse,
  Grid,
  Progress,
  Modal,
  message,
  Popconfirm,
  Tag,
} from "antd";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,

} from "react-leaflet";

import L from "leaflet";



import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import "leaflet/dist/leaflet.css";


import { Option } from "antd/es/mentions";
import { DeleteOutlined, EnvironmentOutlined, InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import "./Arrow.css";
import { useTranslation } from "react-i18next";
import { _post, _get } from "../../../Service/apiClient";
import Upload from "../Upload";
import CurrentLocation from "../currentLocation";
import { FaArrowLeft } from "react-icons/fa";
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const { Panel } = Collapse;
const { useBreakpoint } = Grid;
const CommercialForm = ({ setShowFormType }) => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const [componentVariant, setComponentVariant] = useState("filled");
  const [ltype, setLtype] = useState(null);
  const [priceunit, setPriceUnit] = useState("sq. ft");
  const [amount, setAmount] = useState(0);
  const [time1, setTime1] = useState(0);
  const [time2, setTime2] = useState(0);
  const [unit, setUnit] = useState("sq. ft");
  const [showDis, setShowDis] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [plotSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [landMark, setlandMark] = useState("");
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherDetails, setOtherDetails] = useState("");
  const confirm = () => {

    setIsCurrentLocation(true);
    setIsModalVisible(true);
  };
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const handleBackToCustomers = () => {
    setShowFormType(null); // Hide form and show cards
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !skills.includes(inputValue)) {
      setSkills([...skills, inputValue]);
    }
    setInputValue("");
  };

  const handleRemoveSkill = (removedSkill) => {
    setSkills(skills.filter((skill) => skill !== removedSkill));
  };
  const cancel = () => {

    setIsCurrentLocation(false);
    setIsModalVisible(true);
  };

  const handleCheckboxChange = (checkedValues) => {
    setSelectedOptions(checkedValues);
    if (!checkedValues.includes("Others")) {
      setOtherDetails(""); // Clear the other details when "Others" is unchecked
    }
  };

  const fileInputRef = useRef(null);
  const [userRole, setUserRole] = useState(null);
  const updateCoordinates = (lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  };
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(parseInt(role, 10)); // Convert to number if stored as a string
    }
  }, []);


  const [agentEmails, setAgentEmails] = useState([]);
  const csrId = localStorage.getItem("userId");
  const fetchAgentEmails = useCallback(async () => {
    try {
      const response = await _get(`/csr/getAssignedAgents/${csrId}`);
      console.log("Agent Emails:", response.data);
      setAgentEmails(response.data || []);
    } catch (error) {
      console.error("Error fetching agent emails:", error);
    }
  }, [csrId]); 
  
  useEffect(() => {
    fetchAgentEmails();
  }, [fetchAgentEmails]);

  //  for map...

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [latitude, setLatitude] = useState(""); // State for Latitude
  const [longitude, setLongitude] = useState(""); // State for Longitude
  const [selectedLocation, setSelectedLocation] = useState([20.5937, 78.9629]); // Default Location for Marker



  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const handleLandMark = (e) => {
    setlandMark(e.target.value); // Update state on input change
  };



  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/1483/1483336.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const LocationMarker = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setLatitude(lat);
        setLongitude(lng);
        setSelectedLocation([lat, lng]);
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation} icon={customIcon} />
    ) : null;
  };

  const conversionFactors = {
    acres: 43560, // 1 acre = 43,560 square feet
    "sq. ft": 1, // 1 square foot = 1 square foot
    "sq.yards": 9, // 1 square yard = 9 square feet
    "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
    cents: 435.6, // 1 cent = 435.6 square feet
  };
  const handlePriceUnitChange = (value) => {
    setPriceUnit(value);
  };
  const handlePriceChange = (data) => {
    // setPricePerAcre(data);
    // setPrice(form.getFieldValue("price"));
  
    // if (type == "sq. ft") {
    //   settotalInAcres(price * landmeasure);
    // } else {
    //   settotalInAcres(
    //     (form.getFieldValue("size1") *
    //       form.getFieldValue("price") *
    //       conversionFactors[form.getFieldValue("landsizeunit")]) /
    //     form.getFieldValue("size")
    //   );
    // }
  };

  const handleUnitChange = (value) => {
    console.log("hiiii");
    console.log(form.getFieldValue("landsizeunit"));

    // setType(form.getFieldValue("landsizeunit"));

    setUnit(value);
    // const conversionFactors = {
    //   acres: 43560,
    //   "sq. ft": 1,
    //   "sq.yards": 9,
    //   "sq.m": 10.764,
    //   cents: 435.6,
    // };
    // if (type == "sq.ft") {
    //   settotalInAcres(price * landmeasure);
    // } else {
    //   if (price && type && landmeasure)
    //     settotalInAcres(
    //       (form.getFieldValue("size1") *
    //         form.getFieldValue("price") *
    //         conversionFactors[form.getFieldValue("landsizeunit")]) /
    //       form.getFieldValue("size")
    //     );
    // }
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleSizeChange = (data) => {
  
    // if (type == "acres") {
    //   settotalInAcres(price * landmeasure);
    // } else {
    //   if (type == "acres") {
    //     settotalInAcres(price * landmeasure);
    //   } else {
    //     settotalInAcres(
    //       (form.getFieldValue("size1") *
    //         form.getFieldValue("price") *
    //         conversionFactors[form.getFieldValue("landsizeunit")]) /
    //       form.getFieldValue("size")
    //     );
    //   }
    // }
  };

  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const options = [
    {
      label: (
        <span>
          Retail
          <Tooltip
            placement="top"
            overlayStyle={{ maxWidth: "500px" }}
            title={
              <>
                <p>
                  <strong>Retail Properties include :</strong>
                </p>
                <ul>
                  <li>
                    <strong>Shops</strong>{" "}
                  </li>
                  <li>
                    <strong>Malls</strong>{" "}
                  </li>
                  <li>
                    <strong>Storefronts</strong>
                  </li>
                </ul>
              </>
            }
          >
            <InfoCircleOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
          </Tooltip>
        </span>
      ),
      value: "Retail",
    },
    {
      label: (
        <span>
          Industrial
          <Tooltip
            placement="top"
            overlayStyle={{ maxWidth: "500px" }}
            // title=" warehouses, factories, and manufacturing facilities."
            title={
              <>
                <p>
                  <strong>Industrial properties include :</strong>
                </p>
                <ul>
                  {/* shops, malls, and storefronts." */}
                  <li>
                    <strong>Warehouses</strong>{" "}
                  </li>
                  <li>
                    <strong>Factories</strong>{" "}
                  </li>
                  <li>
                    <strong>Manufacturing Facilities</strong>
                  </li>
                </ul>
              </>
            }
          >
            <InfoCircleOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
          </Tooltip>
        </span>
      ),
      value: "Industrial",
    },
    {
      label: (
        <span>
          Hospitality
          <Tooltip
            title={
              <>
                <p>
                  <strong>Hospitality properties include :</strong>
                </p>
                <ul>
                  <li>
                    <strong>Hotels</strong>{" "}
                  </li>
                  <li>
                    <strong>Resorts</strong>{" "}
                  </li>
                  {/* <li><strong>Manufacturing Facilities</strong></li> */}
                </ul>
              </>
            }
          >
            <InfoCircleOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
          </Tooltip>
        </span>
      ),
      value: "Hospitality",
    },
    {
      label: (
        <span>
          Social Activities
          <Tooltip
            placement="top"
            overlayStyle={{ maxWidth: "500px" }}
            title={
              <>
                <p>
                  <strong>Social Activities properties include:</strong>
                </p>
                <ul>
                  <li>
                    <strong>Event Spaces</strong>{" "}
                  </li>
                  <li>
                    <strong>Community Centers</strong>{" "}
                  </li>
                  <li>
                    <strong>Recreational Areas</strong>
                  </li>
                </ul>
              </>
            }
          >
            <InfoCircleOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
          </Tooltip>
        </span>
      ),
      value: "Social Activities",
    },
    {
      label: (
        <span>
          Others
          <Tooltip
            placement="top"
            overlayStyle={{ maxWidth: "500px" }}
            title={
              <>
                <p>
                  <strong>If you have Any extra things add here</strong>
                </p>

              </>
            }
          >
            <InfoCircleOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
          </Tooltip>
        </span>
      ),
      value: "Others",
    },
  ];
  const panelKeys = {
    userId: "agentDetails",
    ownerName: "ownerDetails",
    ownerContact: "ownerDetails",
    propertyTitle: "landDetails",
    leasePrice: "landDetails",
    landPurpose: "landDetails",
    landUsage: "landDetails",
    duration: "landDetails",
    plotSize: "landDetails",
    price: "landDetails",
    rent: "landDetails",
    district: "Address",
    mandal: "Address",
    village: "Address",
    landMark: "Address",
  };
  const validateFieldsManually = (values) => {
    const errors = {};

    if (!values.ownerName) errors.ownerName = "Owner name is required";
    if (!values.ownerContact) errors.ownerContact = "Phone number is required";
    if (!values.propertyTitle)
      errors.propertyTitle = "Property Title is required";

    if (ltype === "sell") {
      if (!values.size1) errors.size1 = "Plot size is required for selling";
      if (!values.price) errors.price = "Price is required for selling";
    } else if (ltype === "rent") {
      if (!values.size2) errors.size2 = "Plot size is required for rent";
      if (!values.rent) errors.rent = "Rent is required for renting";
      if (!values.duration)
        errors.duration = "Number of months is required for renting";
    } else if (ltype === "lease") {
      if (!values.size3) errors.size3 = "Plot size is required for leasing";
      if (!values.leasePrice) errors.leasePrice = "Lease price is required";
      if (!values.duration1)
        errors.duration = "Number of years is required for leasing";
    }

    if (!values.district && !addressDetails.district)
      errors.district = "District is required";
    if (!values.mandal && !addressDetails.mandal)
      errors.mandal = "Mandal is required";
    if (!values.village && !addressDetails.village)
      errors.village = "Village is required";

    return errors;
  };
  const onFormVariantChange = ({ variant }) => {
    setComponentVariant(variant);
  };

  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };
 
  const [addressDetails, setAddressDetails] = useState({
    district: "",
    mandal: "",
    village: "",
  });
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [villages, setVillages] = useState([]);
  const [pincode, setPincode] = useState(null);
  const handlevillageChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, village: value }));
  };

  const handleDistrictChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, district: [value] }));
    console.log(value);
    setSelectedDistrict(true);
    setSelectedMandal(true);
    try {
      const response = await _get(`/location/getmandals/${value}`);
      console.log("hi");
      console.log(response.data);
      const mandalList = response.data.mandals || [];
      setMandals(mandalList);
      setAddressDetails((prev) => ({
        ...prev,
        mandal: mandalList[0] || mandals[0],
      }));
      console.log(mandals[0]);

      const response1 = await _get(
        `/location/getvillagesbymandal/${mandalList[0]}`
      );
      console.log(response1.data);
      const villageList = response1.data || [];
      setVillages(villageList);

      setAddressDetails((prev) => ({
        ...prev,
        village: villageList[0] || villages[0],
      }));
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };
  const handlePincodeChange = async (e) => {
    setAddressDetails({
      district: "",
      mandal: "",
      village: "",
    });
    const pincodeValue = e.target.value;
    if (pincodeValue === "") {
      setAddressDetails({
        district: "",
        mandal: "",
        village: "",
      });
      setMandals([]);
      setVillages([]);
    }
    setPincode(pincodeValue);

    if (pincodeValue.length === 6) {
      try {
        const response = await _get(
          `/location/getlocationbypincode/${pincodeValue}/@/@`
        );
        const districtList = response.data.districts;
        const mandalList = response.data.mandals || [];
        const villageList = response.data.villages || [];
        let mandalValue;
        if (mandalList.length === 1) {
          mandalValue = mandalList[0];
        } else {
          mandalValue = mandalList.length > 1 ? mandalList[0] : [];
        }
        setAddressDetails({
          district: districtList,
          mandal: mandalValue,
          village: villageList[0] || "",
        });

        setMandals(mandalList);
        setVillages(villageList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const handleMandalChange1 = async (value) => {
    console.log(value);
    setAddressDetails((prev) => ({ ...prev, mandal: value }));

    setSelectedMandal(true);
    try {
      const response = await _get(`/location/getvillagesbymandal/${value}`);
      const villageList = response.data || [];
      setVillages(villageList);

      setAddressDetails((prev) => ({
        ...prev,
        village: villageList[0] || "",
      }));
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };
  const handleMandalChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, mandal: [value] }));

    try {
      const response = await _get(
        `/location/getlocationbypincode/${pincode}/${addressDetails.district}/${value}`
      );

      const villageList = response.data.villages || [];
      setVillages(villageList);

      setAddressDetails((prev) => ({
        ...prev,
        village: villageList[0] || "",
      }));
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };
  const formatPrice = (price) => {
    if (price == null || isNaN(price)) {
      return "N/A"; // Handle invalid prices
    }

    if (price >= 1_00_00_000) {
      return (price / 1_00_00_000).toFixed(1) + " Cr"; // Convert to Crores
    } else if (price >= 1_00_000) {
      return (price / 1_00_000).toFixed(1) + " L"; // Convert to Lakhs
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1) + " K"; // Convert to Thousands
    } else {
      return price.toLocaleString(); // Format small numbers with commas
    }
  };

  const selling = () => (
    <>
      <Row gutter={16} style={{ marginBottom: "-20px" }}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item
            label={
              <span>
                Plot Size
                <Tooltip title="Enter the total plot size of the property.">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
            }
            labelCol={{
              xs: { span: 9 },
              sm: { span: 8 },
              md: { span: 10 },
              xl: { span: 10 },
            }}
            wrapperCol={{
              xs: { span: 16 },
              sm: { span: 16 },
              md: { span: 20 },
              xl: { span: 16 },
            }}
            rules={[
              {
                required: true,
                message: "Please enter a Plot Size",
              },
              {
                validator: (_, value) => {
                  if (value && value.toString().length > 7) {
                    return Promise.reject(new Error("Please enter a number with up to 5 digits"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Group compact>
              <Form.Item name="size1" noStyle>
                <InputNumber
                  step={0.1}
                  type="number"
                  placeholder="0.1 acres to 1000 acres"
                  onChange={(value) => {
                    if (value < 0) {
                      value = 0;
                    }
                    handleSizeChange(value);
                  }}
                  style={{ width: "50%" }}
                  min={0}
                />
              </Form.Item>
              <Form.Item name="landsizeunit1" noStyle>
                <Select
                  defaultValue="sq .ft"
                  style={{ width: "50%" }}
                  onChange={handleUnitChange}
                >
                  <Option value="sq. ft">sq. Ft</Option>
                  <Option value="acres">acres</Option>

                  <Option value="sq.yards">sq.yards</Option>
                  <Option value="sq.m">sq.m</Option>
                  <Option value="cents">cents</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Form.Item label="Price">
            <Input.Group compact>
              <Form.Item
                noStyle

                step={0.1}
                label="Price"
                name="price"
                labelCol={{ xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 12 } }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a Price",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.toString().length > 10) {
                        return Promise.reject(new Error("Please enter a number with up to 10 digits"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="per sq. ft"
                  style={{ width: "50%" }}
                  min={0}
                  max={1000000}
                  onChange={(value) => {
                    console.log("Price value:", value);
                    handlePriceChange(value);
                  }}
                />
              </Form.Item>
              <Form.Item name="pricesizeunit1" noStyle>
                <Select
                  defaultValue="sq. ft"
                  style={{ width: "50%" }}
                  onChange={handlePriceUnitChange}
                >
                  <Option value="sq. ft">/sq. ft</Option>
                  <Option value="acres">/acre</Option>

                  <Option value="sq.yards">/sq.Yards</Option>
                  <Option value="sq.m">/sq.m</Option>
                  <Option value="cents">/cents</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Form.Item
            label={
              <span>
                Total Amount
                <Tooltip title="This is the calculated total cost based on the plot size and price per square foot.">
                  <InfoCircleOutlined
                    style={{ marginLeft: 400, cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
            }
            name="totalAmount"
            labelCol={{
              xs: { span: 10 },
              sm: { span: 10 },
              md: { span: 6.5 },
              xl: { span: 8 },
            }}
            wrapperCol={{
              xs: { span: 16 },
              sm: { span: 16 },
              md: { span: 24 },
              xl: { span: 16 },
            }}
          >
            <>
              ₹{" "}
              {form.getFieldValue("price") && form.getFieldValue("size1")
                ? formatPrice(
                  priceunit === unit
                    ? form.getFieldValue("price") * form.getFieldValue("size1")
                    : Math.ceil(
                      (form.getFieldValue("size1") *
                        conversionFactors[unit] *
                        form.getFieldValue("price")) /
                      conversionFactors[priceunit]
                    )
                )
                : "0"}
            </>
          </Form.Item>
        </Col>

      </Row>
    </>
  );

  const rent = () => (
    <>
      <Row gutter={16} style={{ marginBottom: "-18px" }}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Form.Item
            label={
              <span>
                Plot Size
                <Tooltip
                  placement="rightTop"
                  title={
                    <div>
                      <p>
                        <strong>Enter the plot size for the property.</strong>
                      </p>
                      <p>
                        <strong>1 acre = 43,560 square feet.</strong>
                      </p>
                    </div>
                  }
                >
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
            }
            name="plotSize"
            rules={[{ required: true, message: "Please enter plot size!" }]}
            labelCol={{
              xs: { span: 10 },
              sm: { span: 8 },
              md: { span: 8 },
              xl: { span: 8 },
            }}
            wrapperCol={{
              xs: { span: 16 },
              sm: { span: 16 },
              md: { span: 16 },
              xl: { span: 16 },
            }}
          >
            <Input.Group compact>
              <Form.Item name="size2" noStyle>
                <InputNumber
                  type="number"
                  min={0}
                  placeholder="Enter plot size"
                  style={{ width: "100px" }}
                  value={plotSize}
                />
              </Form.Item>
              <Form.Item name="landsizeunit2" noStyle>
                <Select defaultValue="sq. ft" style={{ width: "80px" }}>
                  <Option value="sq. ft.">sq.ft</Option>
                  <Option value="acres">acres</Option>
                  <Option value="sq.yards">sq.yards</Option>
                  <Option value="sq.m">sq.m</Option>
                  <Option value="cents">cents</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Form.Item
            label={
              <span>
                Rent
                <Tooltip title="Enter the rental amount per month for the property.">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
            }

            name="rent"
            labelCol={{
              xs: { span: 10 },
              sm: { span: 8 },
              md: { span: 6 },
              xl: { span: 8 },
            }}
            wrapperCol={{
              xs: { span: 16 },
              sm: { span: 16 },
              md: { span: 16 },
              xl: { span: 16 },
            }}
            rules={[
              { required: true, message: "Please enter rent!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || Number(value) >= 100) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Rent must be greater than or equal to 100")
                  );
                },
              }),
            ]}
          >
            <Input
              type="number"
              placeholder="per month"
              style={{ width: "80%" }}
              value={amount}
              onChange={(e) => {
                let numericValue = Number(e.target.value);

                if (numericValue < 0) {
                  numericValue = 0;
                }

                console.log("Rent value:", numericValue);
                setAmount(numericValue);
              }}
              min={0}
              addonAfter="/month"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Form.Item
            label={
              <span>
                No of Months
                <Tooltip title="Enter the number of months for which the rent is applicable.">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
            }
            name="duration"
            labelCol={{
              xs: { span: 10 },
              sm: { span: 12 },
              md: { span: 10 },
              xl: { span: 12 },
            }}
            wrapperCol={{
              xs: { span: 12 },
              sm: { span: 12 },
              md: { span: 12 },
              xl: { span: 12 },
            }}
            rules={[
              {
                required: true,
                message: "Please enter No of Months",
              },
              {
                validator: (_, value) => {
                  if (value && value.toString().length > 3) {
                    return Promise.reject(new Error("Please enter a number with up to 3 digits"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              placeholder="months"
              min={1}
              style={{ width: "80%" }}
              value={time1}
              onChange={(e) => {
                setTime1(e.target.value);
                // setTotalAmount1(calculateTotalAmount(amount, e.target.value));
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Form.Item
            label={
              <span>
                Total Amount
                <Tooltip title="This is the calculated total cost based on the plot size and price per square foot.">
                  <InfoCircleOutlined
                    style={{ marginLeft: 8, cursor: "pointer" }}
                  />
                </Tooltip>
              </span>
            }
            name="totalAmount"
            labelCol={{
              xs: { span: 10 },
              sm: { span: 10 },
              md: { span: 6.5 },
              xl: { span: 8 },
            }}
            wrapperCol={{
              xs: { span: 16 },
              sm: { span: 16 },
              md: { span: 24 },
              xl: { span: 16 },
            }}
          >
            {form.getFieldValue("rent") && form.getFieldValue("duration")
              ? form.getFieldValue("rent") * form.getFieldValue("duration")
              : ""}
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const lease = () => (
    <>
      <Col xs={24} sm={12} md={12} lg={8} xl={8}>
        <Form.Item
          label={
            <span>
              Plot Size
              <Tooltip title="Enter the total plot size of the property in square feet (sq. ft).">
                <InfoCircleOutlined
                  style={{ marginLeft: 8, cursor: "pointer" }}
                />
              </Tooltip>
            </span>
          }
          name="plotSize"
          labelCol={{
            xs: { span: 10 },
            sm: { span: 8 },
            md: { span: 8 },
            xl: { span: 8 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
            md: { span: 24 },
            xl: { span: 16 },
          }}
          rules={[{ required: true, message: "Please enter plot size!" }]}
        >
          <Input.Group compact>
            <Form.Item name="size3" noStyle>
              <InputNumber
                type="number"
                min={1}
                placeholder="Enter size"
                style={{ width: "50%" }}
                value={amount}
                onChange={handleAmountChange}
              />
            </Form.Item>
            <Form.Item name="landsizeunit3" noStyle>
              <Select
                value={unit}
                style={{ width: "50%" }}
                onChange={handleUnitChange}
              >
                <Option value="acres">acres</Option>
                <Option value="sq. ft">sq.ft</Option>
                <Option value="sq.yards">sq.yards</Option>
                <Option value="sq.m">sq.m</Option>
                <Option value="cents">cents</Option>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Col>

      <Col xs={24} sm={12} md={12} lg={8} xl={8}>
        <Form.Item
          label={
            <span>
              Lease
              <Tooltip title="Enter the lease price per year for the property.">
                <InfoCircleOutlined
                  style={{ marginLeft: 8, cursor: "pointer" }}
                />
              </Tooltip>
            </span>
          }
          name="leasePrice"
          labelCol={{
            xs: { span: 10 },
            sm: { span: 8 },
            md: { span: 7 },
            xl: { span: 8 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
            md: { span: 24 },
            xl: { span: 16 },
          }}
          rules={[
            { required: true, message: "Please enter lease price!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || Number(value) >= 100) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Lease amount must be greater than or equal to 100")
                );
              },
            }),
          ]}
        >
          <Input
            type="number"
            placeholder="per year"
            style={{ width: "80%" }}
            value={amount}
            onChange={(e) => {
              let numericValue = Number(e.target.value);
              if (numericValue < 0) {
                numericValue = 0;
              }

              console.log("Rent value:", numericValue);
              setAmount(numericValue);
            }}
            min={0}
            addonAfter="/year"
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12} md={12} lg={8} xl={8}>
        <Form.Item
          label={
            <span>
              No of Years
              <Tooltip title="Enter the number of years for which the lease is applicable.">
                <InfoCircleOutlined
                  style={{ marginLeft: 8, cursor: "pointer" }}
                />
              </Tooltip>
            </span>
          }
          name="duration1"
          labelCol={{
            xs: { span: 10 },
            sm: { span: 8 },
            md: { span: 11 },
            xl: { span: 8 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
            md: { span: 12 },
            xl: { span: 16 },
          }}
          rules={[{ required: true, message: "Please enter number of years!" }]}
        >
          <Input
            type="number"
            placeholder="years"
            min={1}
            style={{ width: "80%" }}
            value={time2}
            onChange={(e) => {
              setTime2(e.target.value);
              // setTotalAmount2(calculateTotalAmount(amount, e.target.value));
            }}
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12} md={12} lg={8} xl={8}>
        <Form.Item
          label={
            <span>
              Total Amount
              <Tooltip title="This is the calculated total cost based on the plot size and price per square foot.">
                <InfoCircleOutlined
                  style={{ marginLeft: 8, cursor: "pointer" }}
                />
              </Tooltip>
            </span>
          }
          name="totalAmount"
          labelCol={{
            xs: { span: 10 },
            sm: { span: 10 },
            md: { span: 6.5 },
            xl: { span: 8 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
            md: { span: 24 },
            xl: { span: 16 },
          }}
        >
          {form.getFieldValue("leasePrice") && form.getFieldValue("duration1")
            ? form.getFieldValue("leasePrice") * form.getFieldValue("duration1")
            : "0"}
        </Form.Item>
      </Col>
      {/* </Row> */}
    </>
  );

  const [videoUrl, setvideoUrl] = useState(null);
  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file) {
      const fileType = file.type;


      if (fileType.startsWith('image/')) {

        setIsUploading(true);
        setUploadProgress(0);

        const url = await Upload(file, (progress) => {
          setUploadProgress(progress);
        }, "image");

        console.log(url);
        setImageUrls((prevUrls) => [...prevUrls, url]);
        setIsUploading(false);
      } else if (fileType.startsWith('video/')) {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 10) {
          message.error("Video size exceeds the 10MB limit. Please upload a smaller file.")
          return;
        }
        setIsUploading(true);
        setUploadProgress(0);


        const url = await Upload(file, (progress) => {
          setUploadProgress(progress);
        }, "video");

        console.log(url);
        setvideoUrl(url);
        setIsUploading(false);
      } else {
        console.log("Uploaded file is neither an image nor a video.");
      }
    }


  };
  const deletingVideo = () => {
    console.log("dhdh");
    setvideoUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onFinish = async () => {
    console.log("hi");
    const values = form.getFieldsValue();
    console.log(values);
    const validationErrors = validateFieldsManually(values);
    console.log(validationErrors);
    console.log(Object.keys(validationErrors));
    if (Object.keys(validationErrors).length > 0) {
      console.log("hii");
      const panelsWithErrors = new Set(
        Object.keys(validationErrors).map((field) => panelKeys[field])
      );
      console.log(panelsWithErrors);

      const errorsToSet = Object.entries(validationErrors).map(
        ([field, error]) => ({
          name: field,
          errors: [error],
        })
      );
      form.setFields(errorsToSet); // Set form fields with errors
      // setActiveTab([...panelsWithErrors]);
      // setHasErrors(true);
    }

    // Only continue if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      console.log("hello");


      const agentDetails = {
        userId: values.userId,
      };


      const owner = {
        ownerName: values.ownerName.replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ),
        ownerContact: values.ownerContact,
        ownerEmail: values.ownerEmail || "",
        isLegalDispute: values.isLegalDispute || false,
        disputeDesc: values.disputeDesc,
      };

      let landDetails = {
        sell: {},
        rent: {},
        lease: {},
        address: {
          country: "India",
          state: "Andhra Pradesh",
          district: addressDetails.district[0],
          mandal: addressDetails.mandal,
          village: addressDetails.village,
          pinCode: pincode === null || pincode === "" ? "000000" : pincode,

          latitude: latitude ? latitude.toString() : "",
          longitude: longitude ? longitude.toString() : "",
          landMark: landMark?.toString() || "",
        },

        description: values.description,
      };

      let dummy = {
        landPurpose: values.landPurpose,
        landUsage: values.landUsage,
        sizeUnit: values.landsizeunit,
      };

      if (values.landPurpose === "Sell") {
        console.log("hii", values.price * values.size1);
        console.log(form.getFieldValue("size1"));

        console.log(form.getFieldValue("price"));
        dummy = {
          ...dummy,
          price: values.price / conversionFactors[values.landsizeunit1],
          totalAmount: Number(
            Math.ceil(
              (form.getFieldValue("size1") *
                conversionFactors[unit] *
                form.getFieldValue("price")) /
              conversionFactors[priceunit]
            )
          ),
          sizeUnit: values.landsizeunit1,
          priceUnit: values.pricesizeunit1,
          plotSize: values.size1 * conversionFactors[values.landsizeunit1],
        };
        delete dummy.landPurpose;
        landDetails.sell = dummy;
      } else if (values.landPurpose === "Rent") {
        dummy = {
          ...dummy,
          sizeUnit: values.landsizeunit2,
          plotSize: values.size2 * conversionFactors[values.landsizeunit2],
          rent: values.rent,
          noOfMonths: values.duration,

          totalAmount: values.rent * values.duration,
        };
        delete dummy.landPurpose;
        landDetails.rent = dummy;
      } else if (values.landPurpose === "Lease") {
        dummy = {
          ...dummy,
          sizeUnit: values.landsizeunit3,
          plotSize: values.size3 * conversionFactors[values.landsizeunit3],
          leasePrice: values.leasePrice,
          duration: values.duration1,
          totalAmount: values.leasePrice * values.duration1,
        };
        delete dummy.landPurpose;
        landDetails.lease = dummy;
      }

      const amenities = {
        isElectricity: values.isElectricity,
        isParkingFacility: values.isParkingFacility,
        security:values.security,
        powerBackup:values.powerBackup,
        isRoadFace: values.isRoadFace,
        distanceFromRoad: values.distanceFromRoad,
        roadType: values.roadType,
      };

      const uploadPics = imageUrls.map((imageUrl) => imageUrl);
      const videos = [videoUrl];
      const propertyDetails = {
        agentDetails,
        owner,
        landDetails,
        amenities,
        uploadPics,
        videos,
      };

      console.log(propertyDetails);
      const finalObject = {
        propertyType: "Commercial",
        propertyTitle: values.propertyTitle.replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ),
        rating: 0,
        propertyDetails,
      };
      setLoading(true);
      try {
        const response = await _post(
          "/commercials/postcommercial",
          finalObject,
          "Property Added Successfully",
          "Submission Failed"
        );
        if (response.status === 200 || response.status === 201) {
          form.resetFields();
          setLoading(false);
          if (values.userId === undefined) {
            setShowFormType(null);
          }

          localStorage.setItem("form", false);
          form.resetFields();
          setvideoUrl(null);

        } else {
        }
      } catch (error) {
        console.error("Error during submission:", error);

        console.log(propertyDetails.landDetails.address);
      }
    }
  };
  return (
    <Form
      form={form}
      name="propertyDetails"
      // onFinish={onFinish}
      {...formItemLayout}
      onValuesChange={onFormVariantChange}
      variant={componentVariant}
      style={{
        padding: "3%",
        maxWidth: "auto",
        borderRadius: "1%",
      }}
      initialValues={{
        variant: componentVariant,
        state: "Andhra Pradesh",
        country: "India",
        landsizeunit1: "sq. ft",
        landsizeunit2: "sq. ft",
        landsizeunit3: "sq. ft",
      }}
    >

      <h1 className="custom-container"> {userRole === 5 && (
        <button
          onClick={handleBackToCustomers}
          style={{
            marginTop: "10px",
            fontSize: "20px",
            backgroundColor: '#0D416B',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            float: "left",
            // marginBottom:"5px",
          }}
        > <FaArrowLeft style={{ marginTop: "5px" }} /></button>)}Commercial Property details</h1>
      <Collapse
        // accordion={!hasErrors}
        // activeKey={activeTab}
        accordion={false}
        defaultActiveKey={[
          "agentDetails",
          "ownerDetails",
          "landDetails",
          "Address",
          "Amenities",
          "uploadPhotos",
        ]}
        // onChange={setActiveTab}
      >
        {/* agent details..... */}

        {/* <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Agent Details
            </span>
          }
          key="agentDetails"
        >
          <Col xs={24} sm={12} md={8} xl={8}>
            <Form.Item
              label="Agent ID"
              name="userId"
              rules={[
                { required: true, message: "Please enter Agent ID!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
              labelCol={{ xs: { span: 8 } }}
              wrapperCol={{ xs: { span: 16 } }}
            >
              <Input
                style={{
                  width: "80%",
                  backgroundColor: "transparent",
                  border: "1px solid lightgray",
                }}
              />
            </Form.Item>
          </Col>
        </Panel> */}

        {userRole === 5 && (
          <Panel
            style={{ backgroundColor: "rgb(13,65,107)" }}
            header={
              <span style={{ fontWeight: "bold", color: "white" }}>
                Agent Details
              </span>
            }
            key="agentDetails"
          >
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item
                label="Agent Email"
                name="userId"
                rules={[
                  { required: true, message: "Please select an Agent Email!" },
                ]}
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Select
                  placeholder="Select an Agent Email"
                  style={{
                    width: "80%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgray",
                  }}
                  options={agentEmails.map((email) => ({
                    value: email.email,
                    label: email.email,
                  }))}
                />
              </Form.Item>
            </Col>

          </Panel>
        )}

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Owner Details
            </span>
          }
          key="ownerDetails"
        >
          <>
            <Row gutter={[16, 16]}>
              {/* First Row: Name, Contact No, and Email */}
              <Col xs={24} sm={8} xl={6}>
                <Form.Item
                  label="Name"
                  name="ownerName"
                  labelCol={{ xs: { span: 5 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  rules={[
                    { required: true, message: "Please enter Owner Name!" },
                    {
                      pattern: /^[A-Za-z\s]+$/,
                      message:
                        "Owner Name can only contain letters and spaces!",
                    },
                    {
                      max: 32,
                      message: "Owner Name cannot exceed 32 characters!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Name"
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "1px solid lightgray",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8} xl={6}>
                <Form.Item
                  label="Contact No"
                  name="ownerContact"
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  rules={[
                    { required: true, message: "Please enter contact number!" },
                    {
                      validator: (_, value) => {
                        const startPattern = /^[6-9]/;
                        const fullPattern = /^[6-9]\d{9}$/;

                        if (!value) {
                          return Promise.resolve();
                        }
                        if (value && /[^0-9]/.test(value)) {
                          return Promise.reject(
                            new Error("Only numeric values are allowed!")
                          );
                        }
                        if (!startPattern.test(value)) {
                          return Promise.reject(
                            new Error(
                              "Contact number must start with 6, 7, 8, or 9!"
                            )
                          );
                        }
                        if (!fullPattern.test(value)) {
                          return Promise.reject(
                            new Error(
                              "Contact number must be digits of length 10!"
                            )
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="Contact Number"
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "1px solid lightgray",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8} xl={6}>
                <Form.Item
                  label="Email"
                  name="ownerEmail"
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  rules={[
                    {
                      type: "email",
                      message: "The input is not a valid E-mail!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Email"
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "1px solid lightgray",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8} xl={6}>
                <Form.Item

                  label="Any Disputes?"
                  name="isLegalDispute"
                  labelCol={{ xs: { span: 9 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  valuePropName="checked"
                  onClick={() => {
                    setShowDis(!showDis);
                  }}
                >
                  <Switch defaultChecked={false} size="small" />
                </Form.Item>
              </Col>

              {showDis && (
                <Col xs={24} sm={24} xl={24}>
                  <Form.Item

                    label="Dispute Description"
                    name="disputeDesc"
                    labelCol={{ xs: { span: 3 } }}
                    wrapperCol={{ xs: { span: 16 } }}
                    rules={[
                      {
                        required: true,
                        message: "Please provide description about dispute!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={2}
                      maxLength={300}
                      placeholder="Enter dispute description (maximum 300 characters)"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>


          </>
        </Panel>

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Property Details
            </span>
          }
          key="landDetails"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <Form.Item
                label="Property Title"
                name="propertyTitle"
                rules={[
                  {
                    required: true,
                    message: "Please provide any title!",
                  },
                ]}
                labelCol={{
                  xs: { span: 9 },
                  sm: { span: 8 },
                  md: { span: 8 },
                  xl: { span: 9 },
                }}
                wrapperCol={{
                  xs: { span: 16 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  xl: { span: 16 },
                }}
              >
                <Input
                  placeholder="Enter property title"
                  type="text"
                  className="custom-input"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12} xl={8}>
              <Form.Item
                label={
                  <span>
                    Please select one
                    <Tooltip
                      placement="rightTop"
                      overlayStyle={{ maxWidth: "500px" }}
                      title={
                        <>
                          <p>
                            <strong>Property Transaction Types:</strong>
                          </p>
                          <ul>
                            <li>
                              <strong>Sell:</strong> Transfer ownership.
                            </li>
                            <li>
                              <strong>Rent:</strong> Temporary use for payments.
                            </li>
                            <li>
                              <strong>Lease:</strong> Long-term agreement.
                            </li>
                          </ul>
                        </>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="landPurpose"
                labelCol={{ span: 10 }} // Adjust label width
                wrapperCol={{ span: 24 }} // Adjust radio group width
                rules={[
                  {
                    required: true,
                    message: "Please select at least one option!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Sell" onClick={() => setLtype("sell")}>
                    {" "}
                    Sell{" "}
                  </Radio>
                  <Radio value="Rent" onClick={() => setLtype("rent")}>
                    {" "}
                    Rent{" "}
                  </Radio>
                  <Radio value="Lease" onClick={() => setLtype("lease")}>
                    {" "}
                    Lease{" "}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {ltype === "sell" ? (
              selling()
            ) : ltype === "rent" ? (
              rent()
            ) : ltype === "lease" ? (
              lease()
            ) : (
              <></>
            )}
            <Col xs={24} sm={24} md={12} lg={16} xl={10}>
              <Form.Item
                label="Can be used for"
                name="landUsage"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one option!",
                  },
                ]}
                className="landusage"
                labelCol={{
                  xs: { span: 24 },
                  sm: { span: 5 },
                  md: { span: 6 },
                  xl: { span: 6 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 24 },
                  md: { span: 24 },
                  xl: { span: 24 },
                }}
              >
                <Checkbox.Group
                  options={options}
                  value={selectedOptions}
                  onChange={handleCheckboxChange}
                />
              </Form.Item>

              {/* Conditionally render text box if "Others" is selected */}
              {selectedOptions.includes("Others") && (
                <Form.Item
                  label="Other Details"
                  name="otherDetails"
                  rules={[{ required: true, message: "Please specify the details" }]}
                >
                  <Input
                    placeholder="Please specify"
                    value={otherDetails}
                    onChange={(e) => setOtherDetails(e.target.value)}
                  />
                </Form.Item>
              )}
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}  >
              <Form.Item
                label={
                  <>
                    Description
                    <Tooltip
                      placement="rightTop"
                      title="Provide a brief overview of the property's features."
                    >
                      <InfoCircleOutlined style={{ marginLeft: 5 }} />
                    </Tooltip>
                  </>
                }
                name="description"
                labelCol={{
                  xs: { span: 9 },
                  sm: { span: 8 },
                  md: { span: 8 },
                  xl: { span: 2 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 24 },
                  md: { span: 20 },
                  xl: { span: 24 },
                }}
              >
                <Input.TextArea
                  placeholder="Enter property description(maximum 300 characters)"
                  rows={2}
                  maxLength={300}
                  className="custom-textarea"
                />
              </Form.Item>
            </Col>

          </Row>
        </Panel>

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Location
            </span>
          }
          key="Address"
        >
          <Row>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                label="Country"
                name="country"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Input
                  type="text"
                  style={{
                    width: "100%",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "white",
                  }}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                label="State"
                name="state"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Input
                  type="text"
                  style={{
                    width: "100%",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "white",
                  }}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                label="Pincode"
                name="pinCode"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
                rules={[
                  {
                    pattern: /^[0-9]{6}$/,

                    message: `${t(
                      "registration.Only 6 digit code is allowed"
                    )}`,
                  },
                ]}
              >
                <Input onChange={handlePincodeChange} placeholder=" " />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                style={{ marginBottom: pincode ? "10px" : "0px" }}
                name="district"
                label="District"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
                rules={[
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: `${t("registration.No digits allowed")}`,
                  },
                ]}
              >
                {pincode == null || pincode === "" ? (
                  <div>
                    {" "}
                    <Select
                      placeholder={t("registration.Select District")}
                      value={addressDetails.district || undefined}
                      onChange={(value) => handleDistrictChange(value)}
                      className="floating-label"
                    >
                      <Option value="Visakhapatnam">
                        {t("registration.Visakhapatnam")}
                      </Option>
                      <Option value="Vizianagaram">
                        {t("registration.Vizianagaram")}
                      </Option>
                      <Option value="Srikakulam">
                        {t("registration.Srikakulam")}
                      </Option>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Input
                      placeholder={t("registration.Select District")}
                      className="input-box"
                      value={addressDetails.district}
                      readOnly
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                label="Mandal"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                {pincode !== null || pincode !== "" ? (
                  <div>
                    {mandals.length === 1 ? (
                      <div>
                        {" "}
                        <Input
                          className="input-box"
                          value={addressDetails.mandal}
                          readOnly
                        />
                      </div>
                    ) : (
                      <div>
                        <Select
                          placeholder={
                            selectedDistrict
                              ? t("registration.Select Mandal")
                              : t("registration.Select District First")
                          }
                          value={addressDetails.mandal || null}
                          onChange={(value) => handleMandalChange1(value)}
                        >
                          {mandals.map((mandal) => (
                            <Option key={mandal} value={mandal}>
                              {mandal}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {mandals.length === 1 ? (
                      <Input
                        className="input-box"
                        value={mandals[0]}
                        readOnly
                      />
                    ) : (
                      <Select
                        placeholder={
                          selectedDistrict
                            ? t("registration.Select Mandal")
                            : t("registration.Select District First")
                        }
                        value={addressDetails.mandal || null}
                        onChange={
                          pincode != null
                            ? (value) =>
                              setAddressDetails((prev) => ({
                                ...prev,
                                mandal: value,
                              }))
                            : (value) => handleMandalChange(value)
                        }
                        className="select-custom"
                      >
                        {mandals.length === 0 && selectedDistrict && (
                          <Option disabled>
                            {t("registration.No data available")}
                          </Option>
                        )}

                        {mandals.map((mandal) => (
                          <Option key={mandal} value={mandal}>
                            {mandal}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                label="Village"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                {pincode === null || pincode === "" ? (
                  <div>
                    {" "}
                    {villages.length === 1 ? (
                      <div>
                        {" "}
                        <Input
                          className="input-box"
                          value={addressDetails.village}
                          readOnly
                        />
                      </div>
                    ) : (
                      <div>
                        <Select
                          placeholder={
                            selectedMandal
                              ? t("registration.Select Village")
                              : t("registration.Select Mandal First")
                          }
                          value={addressDetails.village || undefined}
                          onChange={(value) =>
                            setAddressDetails((prev) => ({
                              ...prev,
                              village: value,
                            }))
                          }
                        >
                          {villages.map((village) => (
                            <Option key={village} value={village}>
                              {village}
                            </Option>
                          ))}
                        </Select>{" "}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="floating-label">
                    {villages.length === 1 ? (
                      <div className="floating-label">
                        {" "}
                        <Input
                          className="input-box"
                          value={villages[0]}
                          readOnly
                        />
                      </div>
                    ) : (
                      <div className="floating-label">
                        {" "}
                        <Select
                          style={{
                            height: "37px",
                          }}
                          placeholder={
                            selectedMandal
                              ? t("registration.Select Village")
                              : t("registration.Select Mandal First")
                          }
                          value={addressDetails.village || undefined}
                          onChange={
                            pincode !== null || pincode !== ""
                              ? (value) =>
                                setAddressDetails((prev) => ({
                                  ...prev,
                                  village: value,
                                }))
                              : (value) => handlevillageChange(value)
                          }
                        >
                          {villages.map((village) => (
                            <Option key={village} value={village}>
                              {village}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item
                label="Landmark"
                name="landmark"
                labelCol={{ xs: { span: 7 } }}
                wrapperCol={{ xs: { span: 24 } }}
                rules={[
                  {
                    required: true,
                    message: "LandMark is Mandatory",
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: "Please enter a valid landmark with only letters and spaces.",
                  },
                ]}
              >
                <Input
                  type="text"
                  value={landMark}
                  onChange={handleLandMark}
                  placeholder="Enter the landmark"
                  style={{
                    width: "90%",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "white",
                  }}
                />
              </Form.Item>
            </Col>

            {/* Modal with the map */}
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <Form.Item
                label={
                  <>
                    <span style={{ color: "red" }}>* </span> Choose Location:
                  </>
                }
                style={{ marginBottom: "40px", }}
                labelCol={{ xs: { span: 10 } }}

              >

                <Popconfirm
                  title="Choose Current Location"

                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  {" "}

                  <EnvironmentOutlined style={{ fontSize: '24px', color: '#0D416B', marginRight: '50px' }} />

                  {/* #1890ff */}
                </Popconfirm>


              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
              <Form.Item
                label="Latitude"
                labelCol={{ xs: { span: 5 } }}
                wrapperCol={{ xs: { span: 16 } }}
                style={{

                  marginBottom: "20px",
                  width: "100%",
                }}
              >
                <Input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Enter Latitude"
                  type="number"
                  readOnly
                />
              </Form.Item>
            </Col>

            {/*  Longitude from here... */}
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
              <Form.Item
                label="Longitude"
                labelCol={{ xs: { span: 6 } }}
                wrapperCol={{ xs: { span: 16 } }}
                style={{

                  marginBottom: "-10px",
                  width: "100%",
                }}
              >
                <Input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Enter Longitude"
                  type="number"
                  readOnly
                />
              </Form.Item>


              {/* current location updatecpooradates */}
            </Col>

            {isCurrentLocation ? (
              <CurrentLocation onCoordinatesFetched={updateCoordinates} />
            ) : (
              <Modal
                title={<span style={{ fontSize: "20px" }}>Map</span>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width="60%"  // Adjust modal width
                bodyStyle={{ padding: 0 }} // Remove any padding inside the modal body
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '400px',  // Set a specific height for the container
                }}>
                  <MapContainer
                    center={[latitude || 20.5937, longitude || 78.9629]}
                    zoom={5}
                    style={{
                      width: '100%',
                      height: '100%' // Make sure the map fills the container
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </Modal>
            )}
          </Row>
        </Panel>

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Amenities
            </span>
          }
          key="Amenities"
        >
          <Row gutter={16} style={{ marginBottom: "-18px" }}>
            <Col
              xs={24}
              lg={8}
              sm={12}
              md={12}
              xl={6}

            >
              <Form.Item
                label={
                  <>
                    Type of Electricity{" "}
                    <Tooltip
                      placement="rightBottom"
                      title={
                        <div>
                          <p>
                            <strong>Choose the type of electricity supply available for the property:</strong>
                          </p>
                          <ul>
                            <li>
                              <strong>Domestic:</strong> Electricity used for household purposes such as lighting, heating, and appliances.
                            </li>
                            <li>
                              <strong>Industrial:</strong> High voltage electricity typically used in factories or manufacturing units for heavy machinery.
                            </li>
                            <li>
                              <strong>Commercial:</strong> Electricity used in business establishments such as offices, shops, and malls.
                            </li>
                            <li>
                              <strong>Residential:</strong> Electricity supplied to residential complexes or multi-family housing units.
                            </li>
                            <li>
                              <strong>None:</strong> Indicates that no electricity supply is available for the property.
                            </li>
                          </ul>
                        </div>
                      }
                    >
                      <InfoCircleOutlined style={{ marginLeft: 2 }} />
                    </Tooltip>
                  </>
                }
                name="electricity"
                rules={[
                  { required: true, message: "Please select a Electricity type!" },
                ]}
                labelCol={{
                  xs: { span: 12 },
                  sm: { span: 8.5 },
                  xl: { span: 12 },
                  lg: { span: 16 },
                }}
                wrapperCol={{
                  xs: { span: 8 },
                  sm: { span: 24 },
                  xl: { span: 20 },
                  lg: { span: 24 },
                }}
                className="road"
              >
                <Select placeholder="Select Type of Electricity">
                  <Option value="domestic">Domestic</Option>
                  <Option value="industrial">Industrial</Option>
                  <Option value="commercial">Commercial</Option>
                  <Option value="residential">Residential</Option>
                  <Option value="none">None</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              style={{ marginBottom: "-20px" }}
            >
              <Form.Item
                label={
                  <span>
                    Parking
                    <Tooltip
                      placement="rightTop"
                      overlayStyle={{ maxWidth: "500px" }}
                      title={
                        <>
                          <strong>
                            If your property has any Parking Facility, toggle yes
                          </strong>
                          <p>
                            <strong>Other wise Ignore </strong>
                          </p>
                        </>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="isParkingFacility"
                labelCol={{
                  xs: { span: 10 },
                  sm: { span: 10 },
                  md: { span: 12 },
                  xl: { span: 10 },
                }}
                wrapperCol={{
                  xs: { span: 16 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  xl: { span: 16 },
                }}
                valuePropName="checked"
              >
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              style={{ marginBottom: "-20px" }}
            >
              <Form.Item
                label={
                  <span>
                    Security
                    <Tooltip
                      placement="rightTop"
                      overlayStyle={{ maxWidth: "500px" }}
                      title={
                        <>
                          <strong>
                            If your property has any security Facility, toggle yes
                          </strong>
                          <p>
                            <strong>Other wise Ignore </strong>
                          </p>
                        </>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="security"
                labelCol={{
                  xs: { span: 10 },
                  sm: { span: 10 },
                  md: { span: 12 },
                  xl: { span: 10 },
                }}
                wrapperCol={{
                  xs: { span: 16 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  xl: { span: 16 },
                }}
                valuePropName="checked"
              >
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              style={{ marginBottom: "-20px" }}
            >
              <Form.Item
                label={
                  <span>
                    Power Backup
                    <Tooltip
                      placement="rightTop"
                      overlayStyle={{ maxWidth: "500px" }}
                      title={
                        <>
                          <strong>
                            If your property has any Parking Facility, toggle yes
                          </strong>
                          <p>
                            <strong>Other wise Ignore </strong>
                          </p>
                        </>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="powerBackup"
                labelCol={{
                  xs: { span: 10 },
                  sm: { span: 10 },
                  md: { span: 12 },
                  xl: { span: 10 },
                }}
                wrapperCol={{
                  xs: { span: 16 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  xl: { span: 16 },
                }}
                valuePropName="checked"
              >
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              style={{ marginBottom: "-20px" }}
            >
              <Form.Item
                label={
                  <span>
                    Road Faced
                    <Tooltip
                      placement="rightTop"
                      overlayStyle={{ maxWidth: "500px" }}
                      title={
                        <>
                          <strong>
                            If your property Is facing the Road,toggle yes
                          </strong>
                          <p>
                            <strong>Other wise Ignore </strong>
                          </p>
                        </>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, cursor: "pointer" }}
                      />
                    </Tooltip>
                  </span>
                }
                name="isRoadFace"
                labelCol={{
                  xs: { span: 10 },
                  sm: { span: 10 },
                  md: { span: 12 },
                  xl: { span: 10 },
                }}
                wrapperCol={{
                  xs: { span: 16 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  xl: { span: 16 },
                }}
                valuePropName="checked"
              >
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>

            <Col

              xs={24}
              lg={6}
              sm={12}
              md={12}
              xl={6}

            >
              <Form.Item
                label={
                  <>
                    Road Proximity{" "}
                    <Tooltip
                      placement="rightbottom"
                      title={
                        <div>
                          <p>
                            <strong>
                              Enter the Distance to Nearest Road in kilometers
                            </strong>
                          </p>
                        </div>
                      }
                    >
                      <InfoCircleOutlined style={{ marginLeft: 2 }} />
                    </Tooltip>
                  </>
                }
                name="distanceFromRoad"

                labelCol={{
                  xs: { span: 12 },
                  sm: { span: 8.5 },
                  xl: { span: 10 },
                  lg: { span: 10 },
                }}

                className="road"
              >
                <Input
                  type="number"
                  placeholder="Enter distance in Kms"
                  addonAfter="/km"
                  style={{ width: "90%" }}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              lg={10}
              sm={12}
              md={12}
              xl={6}

            >
              <Form.Item
                label={
                  <>
                    Near By Type of Road
                    <Tooltip
                      placement="rightBottom"
                      title={
                        <div>
                          <p>
                            <strong>
                              Select the type of road closest to the property.
                            </strong>
                          </p>
                        </div>
                      }
                    >
                      <InfoCircleOutlined style={{ marginLeft: 2 }} />
                    </Tooltip>
                  </>
                }
                name="roadType"
                rules={[
                  { required: true, message: "Please select a road type!" },
                ]}
                labelCol={{
                  xs: { span: 12 },
                  sm: { span: 14 },
                  xl: { span: 14 },
                  lg: { span: 16 },
                }}
                wrapperCol={{
                  xs: { span: 8 },
                  sm: { span: 24 },
                  xl: { span: 24 },
                  lg: { span: 24 },
                }}
                className="road"
              >
                <Select placeholder="Select road proximity">
                  <Option value="rnb"> R&B</Option>
                  <Option value="highway"> Highway</Option>
                  <Option value="panchayat"> Panchayat</Option>
                  <Option value="village"> Village</Option>
                  <Option value="none">None</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={18} sm={24} md={24} xl={24}
              style={{ marginBottom: "2%" }}>
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  closable
                  onClose={() => handleRemoveSkill(skill)}
                  style={{ marginBottom: "5px" }}
                >
                  {skill}
                </Tag>
              ))}
              <div
                style={{
                  display: "flex",
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  Add Extra Amenities:
                </span>
                <Input.TextArea
                  type="text"
                  name="extraAmenities"
                  placeholder="Add Extra Amenities"
                  value={inputValue}
                  onChange={handleInputChange}
                  onPressEnter={handleInputConfirm}
                  rows={2}
                  style={{ width: "1000px" }}
                />
              </div>
            </Col>
          </Row>
        </Panel>


        <Panel
          style={{ backgroundColor: "rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Upload Photos/Video
            </span>
          }
          key="uploadPhotos"
        >
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                rowGap: "40px",
                columnGap: "80px",
                maxHeight: "200px",
                overflowY: "auto",
                padding: "10px",
              }}
            >
              {imageUrls
                .slice()
                .reverse()
                .map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "25%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Uploaded ${imageUrls.length - 1 - index}`}
                      style={{
                        width: "45%",
                        height: screens.xs ? "40px" : "50px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <DeleteOutlined
                      style={{
                        color: "red",
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        deletingImage(imageUrls.length - 1 - index);
                      }}
                    />
                  </div>
                ))}
            </div>
            {console.log("Video URL:", videoUrl)}
            {videoUrl && (
              <>
                {console.log("Video URL:", videoUrl)}
                <div
                  style={{
                    position: "relative",
                    display: "flex",

                  }}
                >
                  <video
                    src={videoUrl}
                    controls
                    alt="Video Not Found"
                    style={{
                      width: "50%",
                      height: screens.xs ? "80px" : "120px", // Adjust for video height
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <DeleteOutlined
                    style={{
                      color: "red",
                      position: "absolute",
                      top: "5px",
                      right: "500px", // Position the delete icon near the top-right of the video
                      cursor: "pointer",
                      zIndex: 1, // Ensure it appears above the video
                    }}
                    onClick={() => {
                      deletingVideo();
                    }}
                  />
                </div>
              </>
            )}
            {isUploading && (
              <>
                <Progress
                  percent={uploadProgress}
                  status={uploadProgress < 100 ? "active" : "success"}
                  style={{
                    marginTop: "10px",
                    width: "200px",
                    alignItems: "center",
                  }}
                />
                <span>Please wait, Image is uploading...</span>
              </>
            )}

            <Row gutter={16} style={{ marginTop: "10px" }}>
              <Col span={12}>
                <label htmlFor="upload-input">
                  <input
                    id="upload-input"
                    type="file"
                    onChange={handleImageUpload1}
                    accept="image/jpeg, image/png, image/jpg, image/gif,video/mp4, video/mkv, video/avi, video/webm"
                    style={{
                      width: "1px",
                      height: "1px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("upload-input").click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <UploadOutlined /> Upload Image / Video
                  </button>
                  <Tooltip
                    title={
                      <>
                        <strong>Allowed Formats:</strong>
                        <ul style={{ paddingLeft: 20 }}>
                          <li>JPEG</li>
                          <li>PNG</li>
                          <li>JPG</li>
                          <li>GIF</li>
                          <li>mp4</li>
                        </ul>
                      </>
                    }
                  >
                    <InfoCircleOutlined
                      style={{ marginLeft: 8, cursor: "pointer" }}
                    />
                  </Tooltip>
                </label>
              </Col>


            </Row>
          </>
        </Panel>
      </Collapse>
      <div style={{ marginTop: "2%", display: "flex", gap: "20px", float: "right", marginRight: "120px" }}>
        <div>
          <Form.Item>
            <Button

              onClick={onFinish}
              style={{
                backgroundColor: "#0D416B", color: "white", marginLeft: "20%"
              }}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </div>
        <div>
          <Form.Item>
            <Button

              onClick={() => setShowFormType(null)}
              style={{
                backgroundColor: "lightgray"
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default CommercialForm;
import React, { useState, useRef, useEffect } from "react";

import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Collapse,
  Grid,
  Progress,
} from "antd";
import "../Agent/Agricultural/AgriculturalStyles/AddProperty.css";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { _post, _get } from "../../Service/apiClient";
import Upload from "../Agent/Upload";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Panel } = Collapse;

function AddEstate() {
  const { t, i18n } = useTranslation();
  const screens = useBreakpoint();
  const [activeTab, setActiveTab] = useState(["ownerDetails"]);
  const [hasErrors, setHasErrors] = useState(false);
  const fileInputRef = useRef(null);
  const [showDis, setShowDis] = useState(false);
  const [form] = Form.useForm();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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
  const navigate = useNavigate();
  const [isFirstInteraction, setIsFirstInteraction] = useState(false);
  const [estType, setEstType] = useState(null);
  const [resType, setResType] = useState(null);
  const [furType, setFurType] = useState("none");
  const [imageUrls, setImageUrls] = useState([]);
  useEffect(() => {
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
  }, []);
  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const url = await Upload(file, (progress) => {
      setUploadProgress(progress);
    });

    setImageUrls((prevUrls) => [...prevUrls, url]);
    setIsUploading(false);
  };

  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPics = [];
  imageUrls.forEach((imageUrl) => {
    uploadPics.push(imageUrl);
  });

  const panelKeys = {
    serviceReq: "ownerDetails",
    name: "ownerDetails",
    phoneNumber: "ownerDetails",
    landTitle: "landDetails",
    landType: "landDetails",
    loanAvailed: "landDetails",
    loanDesc: "landDetails",
    surveyNo: "landDetails",
    sizeUnit: "landDetails",
    size: "landDetails",
    marketValue: "landDetails",
    facing: "buildingDetails",
    propertyAge: "buildingDetails",
    buildingType: "buildingDetails",
    doorNo: "buildingDetails",
    bedRoomType: "buildingDetails",
    furnished: "buildingDetails",
    houseCount: "buildingDetails",
    pinCode: "Address",
    country: "Address",
    state: "Address",
    district: "Address",
    mandal: "Address",
    village: "Address",
  };
  const validateFieldsManually = (values) => {
    const errors = {};
    if (!values.estType) {
      errors.estType = "Estate type is required";
    }
      if (!values.landType) {
        errors.landType = "Land type is required";
      }
      if (!values.price) {
        errors.price = "Price is required";
      }
      if (!values.size) {
        errors.size = "Size is required";
      }
      if (!values.sizeUnit) {
        errors.sizeUnit = "Size Unit is required";
      }
      if (!values.landName) {
        errors.landName = "Land Name is required";
      }
      if (!values.surveyNo) {
        errors.surveyNo = "Survey Number is required";
      }
      if (!values.district && !addressDetails.district)
        errors.district = "District is required";
      if (!values.mandal && !addressDetails.mandal)
        errors.mandal = "Mandal is required";
      if (!values.village && !addressDetails.village)
        errors.village = "Village is required";
    
    return errors;
  };
  const handlevillageChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, village: value }));
  };
  const handleDistrictChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, district: [value] }));
    setSelectedDistrict(true);
    setSelectedMandal(true);
    try {
      const response = await _get(`/location/getmandals/${value}`);
      const mandalList = response.data.mandals || [];
      setMandals(mandalList);
      setAddressDetails((prev) => ({
        ...prev,
        mandal: mandalList[0] || mandals[0],
      }));

      const response1 = await _get(
        `/location/getvillagesbymandal/${mandalList[0]}`
      );
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

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const validationErrors = validateFieldsManually(values);
    if (Object.keys(validationErrors).length > 0) {
      const panelsWithErrors = new Set(
        Object.keys(validationErrors).map((field) => panelKeys[field])
      );

      const errorsToSet = Object.entries(validationErrors).map(
        ([field, error]) => ({
          name: field,
          errors: [error],
        })
      );

      form.setFields(errorsToSet);
      setActiveTab([...panelsWithErrors]);
      setHasErrors(true);
    }
    const address = {
      country: "India",
      state: "Andhra Pradesh",
      district: addressDetails.district[0],
      mandal: addressDetails.mandal,
      village: addressDetails.village,
      pinCode: pincode === null || pincode === "" ? "000000" : pincode,
    };

    const ownerDetails = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
    };
    const landDetails = {
      landTitle: values.landTitle,
      landType: values.landType,
      loanAvailed:
        values.loanAvailed === undefined ? false : values.loanAvailed,
      loanDesc: values.loanDesc === undefined ? "" : values.loanDesc,
      surveyNo: values.surveyNo,
      size: values.size,
      sizeUnit: values.sizeUnit,
      marketValue: values.marketValue,
      uploadPics: uploadPics,
      uploadDocs: "None",
    };
    const buildingDetails = {
      facing: values.facing,
      propertyAge: values.propertyAge,
      buildingType: values.buildingType,
    };
    const residence = {
      doorNo: values.doorNo,
      floorCount: values.floorCount,
      bedRoomType: values.bedRoomType,
      furnished: values.furnished,
      washrooms: values.washrooms,
      beds: values.beds,
    };
    const apartment = {
      floorCount: values.floorCount,
      houseCount: values.houseCount,
    };
    const amenities = {
      groundWaterLevel:
        values.groundWaterLevel === undefined ? "0" : values.groundWaterLevel,
      electricity:
        values.electricity === undefined ? false : values.electricity,
      waterFacility:
        values.waterFacility === undefined ? false : values.waterFacility,
      parking: values.parking === undefined ? false : values.parking,
      lift: values.lift === undefined ? false : values.lift,
      watchMan: values.watchMan === undefined ? false : values.watchMan,
      ccTv: values.ccTv === undefined ? false : values.ccTv,
      powerBackup:
        values.powerBackup === undefined ? false : values.powerBackup,
      swimmingPool:
        values.swimmingPool === undefined ? false : values.swimmingPool,
      rainWaterStorage:
        values.rainWaterStorage === undefined ? false : values.rainWaterStorage,
    };

    const requestBody = {
      serviceReq: values.serviceReq,
      ownerDetails,
      landDetails,
      address,
      amenities,
      ...(resType === "residence" && { residence }),
      ...(resType === "apartment" && { apartment }),
      ...(estType === "building" && { buildingDetails }),
    };
    try {
      const response = await _post(
        "/estate/insert",
        requestBody,
        "Estate Added Successfully",
        "Estate Not Added!"
      );
      if (response.status === 200 || response.status === 201) {
        navigate("/dashboard/eClient");
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [componentVariant, setComponentVariant] = useState("filled");
  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onFormVariantChange = ({ variant }) => {
    setComponentVariant(variant);
  };

  const handlePanelChange = (key) => {
    setActiveTab(key);
    if (isFirstInteraction) {
      setIsFirstInteraction(false);
    }
  };

  return (
    <>
    <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
      </div>
    <Form
      form={form}
      name="sectionedForm"
      {...formItemLayout}
      onValuesChange={onFormVariantChange}
      variant={componentVariant}
      style={{
        padding: "3%",
        maxWidth: "auto",
      }}
      initialValues={{
        variant: componentVariant,
        state: "Andhra Pradesh",
        country: "India",
      }}
    >
      {screens.xs ? (
        <h2
          className="custom-container"
          style={{ fontSize: "20px", marginTop: "1%" }}
        >
          Estate details
        </h2>
      ) : (
        <h1 className="custom-container">Estate details</h1>
      )}
      <Collapse
        accordion={isFirstInteraction && !hasErrors}
        activeKey={activeTab}
        onChange={handlePanelChange}
      >
        <Panel
          style={{ backgroundColor: "rgba(157,218,240)" }}
          header={<span style={{ fontWeight: "bold" }}>Owner Details</span>}
          key="agentDetails"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Name"
                name="name"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
              
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
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="ID"
                name="ID"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
              
              >
                <Input
                  placeholder="ID"
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgray",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Location"
                name="Location"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
              
              >
                <Input
                  placeholder="Location"
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgray",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Contact No"
                name="phoneNumber"
                labelCol={{
                  xs: { span: 8 },
                  sm: { span: 14 },
                  md: { span: 13 },
                  lg: { span: 10 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  lg: { span: 16 },
                }}
               
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
            
          </Row>
        </Panel>
        <Panel
          style={{ backgroundColor: "rgba(157,218,240)" }}
          header={<span style={{ fontWeight: "bold" }}>Owner Details</span>}
          key="ownerDetails"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Name"
                name="name"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
                rules={[
                  { required: true, message: "Please enter Owner Name!" },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: "Owner Name can only contain letters and spaces!",
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
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Contact No"
                name="phoneNumber"
                labelCol={{
                  xs: { span: 8 },
                  sm: { span: 14 },
                  md: { span: 13 },
                  lg: { span: 10 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 16 },
                  md: { span: 14 },
                  lg: { span: 16 },
                }}
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
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
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
            <Col xl={8} xs={24} sm={12} md={8} lg={8}>
              {" "}
              <Form.Item
                labelCol={{ xs: { span: 10 } }}
                wrapperCol={{ xs: { span: 16 } }}
                label="Loan Availed?"
                name="loanAvailed"
                valuePropName="checked"
                onClick={() => {
                  setShowDis(!showDis);
                }}
                style={{ margin: 0 }}
              >
                <Switch defaultChecked={false} size="small" />
              </Form.Item>
            </Col>
            {showDis && (
              <Col xl={8} xs={24} sm={12} md={12}>
                <Form.Item
                  label="Loan Description"
                  name="loanDesc"
                  labelCol={{ xs: { span: 12 }, md: { span: 10 } }}
                  wrapperCol={{ xs: { span: 24 }, md: { span: 16 } }}
                  rules={[
                    {
                      required: true,
                      message: "Please provide description about dispute!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    cols={10}
                    maxLength={300}
                    placeholder="Enter dispute description(maximum 300 characters)"
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item
                label="Services"
                name="serviceReq"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
                rules={[
                  {
                    required: true,
                    message: "Please select atleast one option",
                  },
                ]}
              >
                <Select
                  className="select-custom"
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="services required"
                >
                  <Option value="sell">Selling</Option>
                  <Option value="rent">Rent</Option>
                  <Option value="maintenance">Maintenance</Option>
                  <Option value="repair">Repair</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel
          style={{ backgroundColor: "rgba(157,218,240)" }}
          header={<span style={{ fontWeight: "bold" }}>Land Details</span>}
          key="landDetails"
        >
          <Row style={{ marginBottom: "-20px" }}>
            <Col span={8} xs={24} lg={8} sm={12} md={12}>
              <Form.Item
                label="Name"
                name="landTitle"
                rules={[
                  { required: true, message: "Please input Land Name" },
                  {
                    pattern: /^[A-Za-z' ]+$/,
                    message: "Name should contain only alphabets",
                  },
                ]}
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Input
                  placeholder="Enter Land Name"
                  className="input-box"
                  style={{
                    width: "80%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} lg={8} sm={12} md={12}>
              <Form.Item
                label="Survey No"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
                name="surveyNo"
                rules={[
                  {
                    required: true,
                    message: "Please input Survey No",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Survey Number"
                  className="input-box"
                  style={{
                    width: "80%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} lg={8} sm={12} md={12}>
              <Form.Item
                label="Land Type"
                name="landType"
                rules={[
                  { required: true, message: "Please select a land type!" },
                ]}
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Select
                  style={{
                    width: "80%",
                  }}
                  className="select-custom"
                  placeholder="Select estate type"
                  onChange={(value) => {
                    setEstType(value);
                  }}
                >
                  <Option value="none">Empty Land</Option>
                  <Option value="building">Land with Building</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} xs={24} lg={8} sm={12} md={12}>
              <Form.Item
                label="Size Units"
                name="sizeUnit"
                rules={[{ required: true, message: "Please enter price" }]}
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Select
                  placeholder="Select price units"
                  style={{ width: "80%" }}
                  className="select-custom"
                >
                  <Option value="acres">Acres</Option>
                  <Option value="sq. ft">Sq.Ft.</Option>
                  <Option value="sq.yards">Sq.Yards</Option>
                  <Option value="sq.m">Sq.M</Option>
                  <Option value="cents">Cents</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} xs={24} lg={8} sm={12} md={12}>
              <Form.Item
                label="Size "
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
                name="size"
                rules={[{ required: true, message: "0.1 acres to 1000 acres" }]}
              >
                <InputNumber
                  type="number"
                  className="input-box"
                  placeholder="Enter size of land"
                  style={{ width: "80%" }}
                  step={1}
                />
              </Form.Item>
            </Col>
            <Col span={8} xs={24} lg={8} sm={12} md={12}>
              <Form.Item
                label="Market Value"
                name="marketValue"
                rules={[
                  { required: true, message: "Please enter price" },
                  {
                    type: "number",
                    min: 100,
                    message: "Price must be greater than 100",
                  },
                ]}
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <InputNumber
                  type="number"
                  className="input-box"
                  placeholder="Enter price"
                  style={{ width: "80%" }}
                  step={1}
                />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        {estType === "building" && (
          <Panel
            style={{ backgroundColor: "rgba(157,218,240)" }}
            header={
              <span style={{ fontWeight: "bold" }}>Building Details</span>
            }
            key="buildingDetails"
          >
            <Row gutter={[16, 0]}>
              <Col span={8} xs={24} lg={8} sm={12} md={12}>
                <Form.Item
                  label="Facing"
                  name="facing"
                  rules={[
                    {
                      required: true,
                      message: "Please select a property facing!",
                    },
                  ]}
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                >
                  <Select
                    style={{
                      width: "80%",
                    }}
                    className="select-custom"
                    placeholder="Select property facing"
                  >
                    <Option value="east">East</Option>
                    <Option value="west">west</Option>
                    <Option value="south">South</Option>
                    <Option value="north">North</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} xs={24} lg={8} sm={12} md={12}>
                <Form.Item
                  label="Age"
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  name="propertyAge"
                  rules={[
                    { required: true, message: "please input property age" },
                  ]}
                >
                  <InputNumber
                  addonAfter="months"
                    type="number"
                    className="input-box"
                    placeholder="Enter age"
                    style={{ width: "80%" }}
                    step={1}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} lg={8} sm={12} md={12}>
                <Form.Item
                  label="Type"
                  name="buildingType"
                  rules={[
                    {
                      required: true,
                      message: "Please select a property type!",
                    },
                  ]}
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                >
                  <Select
                    style={{
                      width: "80%",
                    }}
                    className="select-custom"
                    placeholder="Select property type"
                    onChange={(value) => {
                      setResType(value);
                    }}
                  >
                    <Option value="residence">Residence</Option>
                    <Option value="apartment">Apartment</Option>
                  </Select>
                </Form.Item>
              </Col>
              {resType === "residence" && (
                <>
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="Door No"
                      labelCol={{ xs: { span: 8 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                      name="doorNo"
                      rules={[
                        {
                          required: true,
                          message: "Please input Door No",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter Door Number"
                        className="input-box"
                        style={{
                          width: "80%",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="Floor Count"
                      labelCol={{ xs: { span: 8 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                      name="floorCount"
                    >
                      <InputNumber
                        type="number"
                        className="input-box"
                        placeholder="Enter no.of floors"
                        style={{ width: "80%" }}
                        step={1}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="Flat Type"
                      name="bedRoomType"
                      labelCol={{ xs: { span: 8 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                      rules={[
                        {
                          required: true,
                          message: "Please choose atleast one",
                        },
                      ]}
                    >
                      <Select
                        style={{
                          width: "80%",
                        }}
                        className="select-custom"
                        placeholder="Select type"
                      >
                        <Option value="1">1BHK</Option>
                        <Option value="2">2BHK</Option>
                        <Option value="3">3BHK</Option>
                        <Option value="4">4BHK</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="Furnished"
                      name="furnished"
                      rules={[
                        {
                          required: true,
                          message: "Please select furniture status!",
                        },
                      ]}
                      labelCol={{ xs: { span: 8 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                    >
                      <Select
                        style={{
                          width: "80%",
                        }}
                        className="select-custom"
                        placeholder="Select status"
                        onChange={(value) => {
                          setFurType(value);
                        }}
                      >
                        <Option value="none">None</Option>
                        <Option value="Semi-furnished">Semi-furnished</Option>
                        <Option value="Fully Furnished">Fully Furnished</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {furType !== "none" && (
                    <Col span={8} xs={24} lg={8} sm={12} md={12}>
                      <Form.Item
                        label="Beds Count"
                        labelCol={{ xs: { span: 8 } }}
                        wrapperCol={{ xs: { span: 16 } }}
                        name="beds"
                      >
                        <InputNumber
                          type="number"
                          className="input-box"
                          placeholder="Enter no.of beds"
                          style={{ width: "80%" }}
                          step={1}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="Washroom Count"
                      labelCol={{ xs: { span: 9 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                      name="washrooms"
                    >
                      <InputNumber
                        type="number"
                        className="input-box"
                        placeholder="Enter no.of washrooms"
                        style={{ width: "80%" }}
                        step={1}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              {resType === "apartment" && (
                <>
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="Floor Count"
                      labelCol={{ xs: { span: 8 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                      name="floorCount"
                      rules={[
                        {
                          required: true,
                          message: "Please input floor count",
                        },
                      ]}
                    >
                      <InputNumber
                        type="number"
                        placeholder="Enter floor count"
                        className="input-box"
                        style={{
                          width: "80%",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} xs={24} lg={8} sm={12} md={12}>
                    <Form.Item
                      label="No of Flats"
                      labelCol={{ xs: { span: 8 } }}
                      wrapperCol={{ xs: { span: 16 } }}
                      name="houseCount"
                      rules={[
                        {
                          required: true,
                          message: "Please Input house count",
                        },
                      ]}
                    >
                      <InputNumber
                        type="number"
                        placeholder="Enter house count"
                        className="input-box"
                        addonAfter="/floor"
                        style={{
                          width: "80%",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </Panel>
        )}

        <Panel
          style={{ backgroundColor: "rgba(157,218,240)" }}
          header={<span style={{ fontWeight: "bold" }}>Amenities</span>}
          key="Amenities"
        >
          <Row gutter={16}>
            <Col
              span={6}
              xs={24}
              lg={6}
              sm={12}
              md={12}
              style={{ marginBottom: "-20px" }}
            >
              <Form.Item
                label="Electricity Facility"
                name="electricity"
                labelCol={{
                  xs: { span: 12 },
                  sm: { span: 8.5 },
                  xl: { span: 16 },
                  lg: { span: 18 },
                }}
                wrapperCol={{
                  xs: { span: 8 },
                  sm: { span: 24 },
                  xl: { span: 24 },
                  lg: { span: 24 },
                }}
                valuePropName="checked"
              >
                <Switch defaultChecked={false} size="small" />
              </Form.Item>
            </Col>
            <Col
              span={6}
              xs={24}
              lg={6}
              sm={12}
              md={12}
              style={{ marginBottom: "-25px" }}
            >
              <Form.Item
                label="Water Facility"
                name="waterFacility"
                labelCol={{
                  xs: { span: 12 },
                  sm: { span: 8.5 },
                  xl: { span: 12 },
                  lg: { span: 16 },
                }}
                wrapperCol={{
                  xs: { span: 8 },
                  sm: { span: 24 },
                  xl: { span: 24 },
                  lg: { span: 24 },
                }}
                valuePropName="checked"
              >
                <Switch defaultChecked={false} size="small" />
              </Form.Item>
            </Col>
            <Col
              span={6}
              xs={24}
              lg={6}
              sm={12}
              md={12}
              style={{ marginBottom: "-25px" }}
            >
              <Form.Item
                label="Ground Water level"
                name="groundWaterLevel"
                labelCol={{
                  xs: { span: 12 },
                  sm: { span: 8.5 },
                  xl: { span: 14 },
                  lg: { span: 16 },
                }}
                wrapperCol={{
                  xs: { span: 8 },
                  sm: { span: 24 },
                  xl: { span: 24 },
                  lg: { span: 24 },
                }}
                valuePropName="checked"
              >
                <Select
                  style={{
                    width: "80%",
                  }}
                  className="select-custom"
                  placeholder="Select water level"
                >
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>
              </Form.Item>
            </Col>
            {estType === "building" && (
              <>
                <Col
                  span={6}
                  xs={24}
                  lg={6}
                  sm={12}
                  md={12}
                  style={{ marginBottom: "-20px" }}
                >
                  <Form.Item
                    label="Watchman"
                    name="watchMan"
                    labelCol={{
                      xs: { span: 12 },
                      sm: { span: 8.5 },
                      xl: { span: 16 },
                      lg: { span: 18 },
                    }}
                    wrapperCol={{
                      xs: { span: 8 },
                      sm: { span: 24 },
                      xl: { span: 24 },
                      lg: { span: 24 },
                    }}
                    valuePropName="checked"
                  >
                    <Switch defaultChecked={false} size="small" />
                  </Form.Item>
                </Col>
                <Col
                  span={6}
                  xs={24}
                  lg={6}
                  sm={12}
                  md={12}
                  style={{ marginBottom: "-20px" }}
                >
                  <Form.Item
                    label="CCTV"
                    name="ccTv"
                    labelCol={{
                      xs: { span: 12 },
                      sm: { span: 8.5 },
                      xl: { span: 16 },
                      lg: { span: 18 },
                    }}
                    wrapperCol={{
                      xs: { span: 8 },
                      sm: { span: 24 },
                      xl: { span: 24 },
                      lg: { span: 24 },
                    }}
                    valuePropName="checked"
                  >
                    <Switch defaultChecked={false} size="small" />
                  </Form.Item>
                </Col>
                <Col
                  span={6}
                  xs={24}
                  lg={6}
                  sm={12}
                  md={12}
                  style={{ marginBottom: "-20px" }}
                >
                  <Form.Item
                    label="Lift"
                    name="lift"
                    labelCol={{
                      xs: { span: 12 },
                      sm: { span: 8.5 },
                      xl: { span: 12 },
                      lg: { span: 8 },
                    }}
                    wrapperCol={{
                      xs: { span: 8 },
                      sm: { span: 24 },
                      xl: { span: 24 },
                      lg: { span: 24 },
                    }}
                    valuePropName="checked"
                  >
                    <Switch defaultChecked={false} size="small" />
                  </Form.Item>
                </Col>

                {resType === "residence" && (
                  <Col
                    span={6}
                    xs={24}
                    lg={6}
                    sm={12}
                    md={12}
                    style={{ marginBottom: "-20px" }}
                  >
                    <Form.Item
                      label="Parking"
                      name="parking"
                      labelCol={{
                        xs: { span: 12 },
                        sm: { span: 8.5 },
                        xl: { span: 12 },
                        lg: { span: 8 },
                      }}
                      wrapperCol={{
                        xs: { span: 8 },
                        sm: { span: 24 },
                        xl: { span: 24 },
                        lg: { span: 24 },
                      }}
                      valuePropName="checked"
                    >
                      <Switch defaultChecked={false} size="small" />
                    </Form.Item>
                  </Col>
                )}

                {resType === "apartment" && (
                  <>
                    <Col
                      span={6}
                      xs={24}
                      lg={6}
                      sm={12}
                      md={12}
                      style={{ marginBottom: "-20px" }}
                    >
                      <Form.Item
                        label="Basement Car Parking"
                        name="parking"
                        labelCol={{
                          xs: { span: 12 },
                          sm: { span: 8.5 },
                          xl: { span: 16 },
                          lg: { span: 18 },
                        }}
                        wrapperCol={{
                          xs: { span: 8 },
                          sm: { span: 24 },
                          xl: { span: 24 },
                          lg: { span: 24 },
                        }}
                        valuePropName="checked"
                      >
                        <Switch defaultChecked={false} size="small" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={6}
                      xs={24}
                      lg={6}
                      sm={12}
                      md={12}
                      style={{ marginBottom: "-20px" }}
                    >
                      <Form.Item
                        label="Swimming Pool"
                        name="swimmingPool"
                        labelCol={{
                          xs: { span: 12 },
                          sm: { span: 8.5 },
                          xl: { span: 16 },
                          lg: { span: 18 },
                        }}
                        wrapperCol={{
                          xs: { span: 8 },
                          sm: { span: 24 },
                          xl: { span: 24 },
                          lg: { span: 24 },
                        }}
                        valuePropName="checked"
                      >
                        <Switch defaultChecked={false} size="small" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={6}
                      xs={24}
                      lg={6}
                      sm={12}
                      md={12}
                      style={{ marginBottom: "-20px" }}
                    >
                      <Form.Item
                        label="Power BackUp"
                        name="powerBackup"
                        labelCol={{
                          xs: { span: 12 },
                          sm: { span: 8.5 },
                          xl: { span: 16 },
                          lg: { span: 18 },
                        }}
                        wrapperCol={{
                          xs: { span: 8 },
                          sm: { span: 24 },
                          xl: { span: 24 },
                          lg: { span: 24 },
                        }}
                        valuePropName="checked"
                      >
                        <Switch defaultChecked={false} size="small" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={6}
                      xs={24}
                      lg={6}
                      sm={12}
                      md={12}
                      style={{ marginBottom: "-20px" }}
                    >
                      <Form.Item
                        label="Rain Water Storage"
                        name="rainWaterStorage"
                        labelCol={{
                          xs: { span: 12 },
                          sm: { span: 8.5 },
                          xl: { span: 14 },
                          lg: { span: 18 },
                        }}
                        wrapperCol={{
                          xs: { span: 8 },
                          sm: { span: 24 },
                          xl: { span: 24 },
                          lg: { span: 24 },
                        }}
                        valuePropName="checked"
                      >
                        <Switch defaultChecked={false} size="small" />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </>
            )}
          </Row>
        </Panel>

        <Panel
          style={{ backgroundColor: "rgba(157,218,240)" }}
          header={<span style={{ fontWeight: "bold" }}>Address</span>}
          key="Address"
        >
          <Row style={{ marginBottom: "-20px" }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                label="Country"
                name="country"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Input
                  type="text"
                  className="input-box"
                  style={{
                    width: "80%",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "white",
                  }}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                label="State"
                name="state"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                <Input
                  type="text"
                  className="input-box"
                  style={{
                    width: "80%",
                    border: "1px solid #d9d9d9",
                    backgroundColor: "white",
                  }}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                label="Pincode"
                name="pinCode"
                labelCol={{ xs: { span: 8 } }}
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
                <Input
                  onChange={handlePincodeChange}
                  placeholder=" "
                  className="input-box"
                  style={{
                    width: "80%",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="district"
                label="District"
                labelCol={{ xs: { span: 8 } }}
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
                      style={{
                        width: "80%",
                      }}
                      placeholder={t("registration.Select District")}
                      value={addressDetails.district || undefined}
                      onChange={(value) => handleDistrictChange(value)}
                      className="select-custom"
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
                      style={{
                        width: "80%",
                      }}
                      placeholder={t("registration.Select District")}
                      className="input-box"
                      value={addressDetails.district}
                      readOnly
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                label="Mandal"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 16 } }}
              >
                {pincode !== null || pincode !== "" ? (
                  <div>
                    {mandals.length === 1 ? (
                      <div>
                        {" "}
                        <Input
                          style={{
                            width: "80%",
                          }}
                          className="input-box"
                          value={addressDetails.mandal}
                          readOnly
                        />
                      </div>
                    ) : (
                      <div>
                        <Select
                          style={{
                            width: "80%",
                          }}
                          placeholder={
                            selectedDistrict
                              ? t("registration.Select Mandal")
                              : t("registration.Select District First")
                          }
                          className="select-custom"
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
                        style={{
                          width: "80%",
                        }}
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
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                label="Village"
                labelCol={{ xs: { span: 8 } }}
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
                          style={{
                            width: "80%",
                          }}
                          className="select-custom"
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
                          style={{
                            width: "80%",
                          }}
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
                            width: "80%",
                          }}
                          placeholder={
                            selectedMandal
                              ? t("registration.Select Village")
                              : t("registration.Select Mandal First")
                          }
                          value={addressDetails.village || undefined}
                          onChange={
                            pincode != null || pincode != ""
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
          </Row>
        </Panel>

        <Panel
          style={{ backgroundColor: "rgba(157,218,240)" }}
          header={<span style={{ fontWeight: "bold" }}>Uploads</span>}
          key="uploadPhotos"
        >
          <>
            <Row>
              {imageUrls
                .slice()
                .reverse()
                .map((url, index) => (
                  <Col
                    xs={12}
                    sm={8}
                    md={6}
                    lg={6}
                    xl={4}
                    xxl={4}
                    style={{ marginBottom: "2%" }}
                  >
                    <div
                      key={index}
                      style={{
                        position: "relative",
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
                  </Col>
                ))}
            </Row>
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
              <Col span={24}>
                <label htmlFor="upload-input">
                  <input
                    id="upload-input"
                    type="file"
                    onChange={handleImageUpload1}
                    accept="image/jpeg, image/png, image/jpg, image/gif"
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
                    Upload Image
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

      <Form.Item>
        <Button
          type="primary"
          onClick={onFinish}
          style={{
            float: "right",
            marginRight: !screens.xs && "-50%",
            marginBottom: "-20%",
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
    </>
  );
}

export default AddEstate;

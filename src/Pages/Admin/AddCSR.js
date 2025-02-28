import React, { useState, useRef } from "react";
import { Option } from "antd/es/mentions";

import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
 
  Space,
  Tooltip,
  Card,
  Grid,
  Progress
} from "antd";
import {
  DeleteOutlined,
  InfoCircleOutlined,
 
  UploadOutlined,
} from "@ant-design/icons";
import { _get, _post } from "../../Service/apiClient";
import { useTranslation } from "react-i18next";
import "../../Authentication/Styles/FloatingLabel.css"
import Upload from "../Agent/Upload";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const { useBreakpoint } = Grid;
function AddCSR() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [addressDetails, setAddressDetails] = useState({
    district: "",
    mandal: "",
    village: "",
  });
 

  const [isUploading1, setIsUploading1] = useState(false);
  const [uploadProgress1, setUploadProgress1] = useState(0);
  const fileInputRef = useRef(null);
  const [imageUrl1, setImageUrl1] = useState(null);
  const [mandals, setMandals] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [villages, setVillages] = useState([]);
  const [pincode, setPincode] = useState(null);
  const [selectedMandal, setSelectedMandal] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [uploadStep, setUploadStep] = useState(1);
  const cropperRef = useRef(null);

  const handlevillageChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, village: value }));
  };
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    console.log(selectedRole);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading1(true);
    setUploadProgress1(0);

    try {
      const url = await Upload(file, (progress) => {
        setUploadProgress(progress);
      }, "image");

      setImageUrl1(url);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading1(false);
    }
  };
  const cropImage = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();

      if (!croppedCanvas) {
        console.error("Cropping failed. Canvas not available.");
        return;
      }

      setIsUploading1(true);
      setUploadProgress1(0);

      try {

        const croppedBlob = await new Promise((resolve) =>
          croppedCanvas.toBlob(resolve, "image/jpeg")
        );


        const url = await Upload(croppedBlob, (progress) => {
          setUploadProgress(progress);
        }, "image");


        setCroppedImage(url);
        setImageUrl1(null);
      } catch (error) {
        console.error("Image upload failed:", error);
      } finally {
        setIsUploading1(false);
      }
    }
  };
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await Upload(file, (progress) => {
        setUploadProgress(progress);
      }, "image");

      setImageUrls((prevUrls) => [...prevUrls, url]);


      if (uploadStep === 1) {
        setUploadStep(2);
      } else if (uploadStep === 2) {
        setUploadStep(1);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const isUploadDisabled = imageUrls.length >= 4;

  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const deleteImage1 = () => {
    setCroppedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const uploadPics = [];
  imageUrls.forEach((imageUrl) => {
    uploadPics.push(imageUrl);
  });

 
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
  const options = [
    {
      label: t("registration.Agent"),
      value: "agent",
    },
    {
      label: "CSR",
      value: "csr",
    },
    {
      label: "Marketing Agent",
      value: "marketingAgent",
    },

  ];
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

  const submitting = async (values) => {
    console.log(values);
    console.log(selectedRole);
    delete values.pinCode;
    console.log(addressDetails);
    let finalValues = {
      ...values,
      state: "Andhra Pradesh",
      country: "India",
      district:
        selectedRole === "agent"
          ? addressDetails?.district[0] || addressDetails?.district
          : values.district,
      mandal: selectedRole === "agent"
        ? addressDetails.mandal
        : values.mandal,
      village: selectedRole === "agent"
        ? addressDetails.village
        : values.village,
      identityProof: uploadPics,
      ...(croppedImage && { profilePicture: croppedImage }),
      // profilePicture: croppedImage ? croppedImage : "",
      role:
        values.role === "agent"
          ? "1"
          : values.role === "csr" ? "5" : "6",
      pinCode: pincode === null || pincode === "" ? "000000" : pincode,
    };
    console.log(finalValues);
    try {
      const res = await _post(
        "/users/createCSR",
        finalValues,
        "Registered Successfully",
        `Error Occured`
      );
      if (res.status === 201) {
        form.resetFields();
        setAddressDetails({
          district: "",
          mandal: "",
          village: "",
        });
        setImageUrls([]);
        setCroppedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

      }
    } catch (error) {
    }
  };


  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: "80vh" }}>
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              Add Agent / CSR /Marketing Agent
            </div>
          }
          style={{
            width: "800px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
          }}
        >
          <Form
            onFinish={submitting}
            form={form}
            initialValues={{
              state: "Andhra Pradesh",
              country: "India",
            }}
          >
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <Form.Item
                  name="firstName"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: `${t("registration.First name is required")}`,
                    },
                    {
                      pattern: /^[A-Za-z\s]+$/,
                      message: `${t(
                        "registration.Only alphabets are allowed"
                      )}`,
                    },
                  ]}
                >
                  <div className="floating-label">
                    <Input placeholder=" " maxLength={50} />
                    <label>
                      <span className="required">*</span>{" "}
                      {t("registration.First Name")}
                    </label>
                  </div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="lastName"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: `${t("registration.Last name is required")}`,
                    },
                    {
                      pattern: /^[A-Za-z\s]+$/,
                      message: `${t(
                        "registration.Only alphabets are allowed"
                      )}`,
                    },
                  ]}
                >
                  <div className="floating-label">
                    <Input placeholder=" " maxLength={50} />
                    <label>
                      <span className="required">*</span>{" "}
                      {t("registration.Last Name")}
                    </label>
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item
                  name="role"
                  className="role-form-item"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: `${t(
                        "registration.Please Select atleast one Role"
                      )}`,
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: "90%",
                      height: "37px",
                    }}
                    placeholder={
                      <span>
                        <span style={{ color: "red" }}>*</span>&nbsp; Select
                        Role
                      </span>
                    }
                    options={options}
                    optionRender={(option) => (
                      <Space>{option.data.label}</Space>
                    )}
                    onChange={handleRoleChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]} >
              <Col span={8}>
                <Form.Item
                  name="phoneNumber"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter contact number!",
                    },
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

                        return Promise.resolve(); // Valid number
                      },
                    },
                  ]}
                >
                  <div className="floating-label">
                    <Input maxLength={10} placeholder=" " />
                    <label>
                      <span className="required">*</span>{" "}
                      {t("registration.Phone Number")}
                    </label>
                  </div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: `${t(
                        "registration.Please input your email!"
                      )}`,
                    },
                    {
                      type: "email",
                      message: `${t(
                        "registration.The input is not a valid email!"
                      )}`,
                    },
                  ]}
                >
                  <div className="floating-label">
                    <Input placeholder=" " maxLength={100} />
                    <label>
                      <span className="required">*</span>{" "}
                      {t("registration.Email")}
                    </label>
                  </div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="country"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    maxLength={30}
                    type="text"
                    style={{
                      width: "100%",
                      height: "37px",
                      border: "1px solid #d9d9d9",
                      backgroundColor: "white",
                    }}
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 8]} >
              <Col span={8}>
                <Form.Item
                  name="state"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    maxLength={30}
                    type="text"
                    style={{
                      width: "100%",
                      height: "37px",
                      border: "1px solid #d9d9d9",
                      backgroundColor: "white",
                    }}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="pinCode"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      pattern: /^[0-9]{6}$/,
                      message: `${t(
                        "registration.Only 6 digit code is allowed"
                      )}`,
                    },
                  ]}
                >
                  <div className="floating-label">
                    <Input
                      type="number"
                      maxLength={6}
                      onChange={handlePincodeChange}
                      placeholder=" "
                      onKeyPress={(e) => {
                        // Prevent non-numeric input
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <label>{t("registration.Pincode")}</label>
                  </div>
                </Form.Item>
              </Col>

              <Col span={8}>
                {selectedRole === "agent" ? (
                  <Form.Item
                    style={{ marginBottom: pincode ? "10px" : "0px" }}
                    name="district"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
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
                            height: "37px",
                          }}
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
                          maxLength={30}
                          style={{
                            height: "37px",
                          }}
                          placeholder={t("registration.Select District")}
                          className="input-box"
                          value={addressDetails.district}
                          readOnly
                        />
                      </div>
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="district"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      { required: true, message: "This Field is Required" },
                      {
                        pattern: /^[A-Za-z\s]+$/,
                        message: `${t(
                          "registration.Only alphabets are allowed"
                        )}`,
                      },
                    ]}
                  >
                    <div className="floating-label">
                      <Input placeholder=" " maxLength={30} />
                      <label>
                        <span className="required">*</span> District
                      </label>
                    </div>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row gutter={[16, 8]} >
              <Col span={8}>
                {selectedRole === "agent" ? (
                  <Form.Item
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {pincode !== null || pincode !== "" ? (
                      <div>
                        {mandals.length === 1 ? (
                          <div>
                            {" "}
                            <Input
                              style={{
                                height: "37px",
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
                                height: "37px",
                              }}
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
                            maxLength={30}
                            className="input-box"
                            value={mandals[0]}
                            readOnly
                          />
                        ) : (
                          <Select
                            style={{
                              height: "37px",
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
                ) : (
                  <Form.Item
                    name="mandal"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      { required: true, message: "This Field is Required" },
                      {
                        pattern: /^[A-Za-z\s]+$/,
                        message: `${t(
                          "registration.Only alphabets are allowed"
                        )}`,
                      },
                    ]}
                  >
                    <div className="floating-label">
                      <Input placeholder=" " maxLength={30} />
                      <label>
                        <span className="required">*</span> Mandal
                      </label>
                    </div>
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                {selectedRole === "agent" ? (
                  <Form.Item
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    {pincode === null || pincode === "" ? (
                      <div>
                        {" "}
                        {villages.length === 1 ? (
                          <div>
                            {" "}
                            <Input
                              style={{
                                height: "37px",
                              }}
                              className="input-box"
                              value={addressDetails.village}
                              readOnly
                            />
                          </div>
                        ) : (
                          <div>
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
                              maxLength={30}
                              style={{
                                height: "37px",
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
                                height: "37px",
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
                ) : (
                  <Form.Item
                    name="village"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      { required: true, message: "This Field is Required" },
                      {
                        pattern: /^[A-Za-z\s]+$/,
                        message: `${t(
                          "registration.Only alphabets are allowed"
                        )}`,
                      },
                    ]}
                  >
                    <div className="floating-label">
                      <Input placeholder=" " maxLength={30} />
                      <label>
                        <span className="required">*</span> Village
                      </label>
                    </div>
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                <Form.Item
                  name="assignedMandal"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <div className="floating-label">
                    <Input placeholder=" " maxLength={30} />
                    <label>Assigned Mandal</label>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} align="top" >
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={8}
                xl={8}
              >
                <Form.Item
                  name="assignedDistrict"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "This Field is Required" },
                    {
                      pattern: /^[A-Za-z\s]+$/,
                      message: `${t(
                        "registration.Only alphabets are allowed"
                      )}`,
                    },
                  ]}
                >
                  <div className="floating-label">
                    <Input placeholder=" " maxLength={30} />
                    <label>
                      <span className="required">*</span> Assigned District
                    </label>
                  </div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <p style={{ marginRight: "10px" }}>
                  Proof of Identity
                  (Aadhar/PAN):
                </p>
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
                      <Button
                        onClick={() =>
                          document.getElementById("upload-input").click()
                        }
                        style={{ cursor: "pointer" }}
                        disabled={isUploadDisabled}
                      >
                        <UploadOutlined /> Upload
                      </Button>
                      <Tooltip
                        title={
                          <>
                            <strong>Allowed Formats:</strong>
                            <ul style={{ paddingLeft: 20 }}>
                              <li>
                                Upload Front and Back images of an identity
                              </li>
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

                {/* Display uploaded images */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    padding: "10px",
                    gap: "10px",
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
                            width: "80px",
                            height: "80px",
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
                          onClick={() =>
                            deletingImage(imageUrls.length - 1 - index)
                          }
                        />
                      </div>
                    ))}
                </div>

                {/* Display uploading progress */}
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


              </Col>

              <Col span={8}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ marginRight: "10px" }}>
                      Upload Profile Photo:
                    </p>
                    <label htmlFor="upload-input-2">
                      <input
                        id="upload-input-2"
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/jpeg, image/png, image/jpg, image/gif"
                        style={{ display: "none" }}
                      />
                      <Button
                        onClick={() =>
                          document.getElementById("upload-input-2").click()
                        }
                      >
                        <UploadOutlined /> Upload
                      </Button>
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
                  </div>
                  {imageUrl1 && !croppedImage && (
                    <div
                      style={{
                        position: "relative",
                        width: "200px",
                        height: "200px",
                        overflow: "hidden",
                        borderRadius: "8px",
                      }}
                    >
                      <Cropper
                        src={imageUrl1}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                        background={false}
                        autoCropArea={1}
                        viewMode={1}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          right: "10px",
                          cursor: "pointer",
                          backgroundColor: "white",
                          padding: "3px",
                          color: "green",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={cropImage}
                      >
                        done
                      </div>
                    </div>
                  )}

                  {croppedImage && (
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        style={{
                          width: "80px",
                          height: "80px",
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
                        onClick={deleteImage1}
                      />
                    </div>
                  )}
                </div>
                {isUploading1 && (
                  <>
                    <Progress
                      percent={uploadProgress1}
                      status={uploadProgress1 < 100 ? "active" : "success"}
                      style={{
                        marginTop: "10px",
                        width: "200px",
                        alignItems: "center",
                      }}
                    />
                    <span>Please wait, Image is uploading...</span>
                  </>
                )}
              </Col>
            </Row>

            <Row justify="center" style={{ marginTop: "3%" }}>
              <Col>
                <Form.Item style={{ margin: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ maxWidth: "200px" }}
                  >
                    {t("login.Register")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Row>
    </>
  );
}

export default AddCSR;
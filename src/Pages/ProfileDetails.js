import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  notification,
  Spin,
  Tooltip,
  Progress,
  Modal,
  Popover,
} from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { _get, _put } from "../Service/apiClient";
import Upload from "./Agent/Upload";
import { useTranslation } from "react-i18next";
import Webcam from "react-webcam";

const ProfileDetails = () => {
  const webcamRef = useRef(null);
  const [form] = Form.useForm();
  const defaultProfilePhoto =
    "https://res.cloudinary.com/ddv2y93jq/image/upload/v1726132403/zsafjroceoneetkmz5jq.webp";
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);
  const [web, setWebCam] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const { t, i18n } = useTranslation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [userTitle, setUserTitle] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    localStorage.setItem("form", false);
    _get(`/users/getprofile`)
      .then((response) => {
        const data = response.data;

        setData(data);
        console.log(data);
        const initial = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phoneNumber,
          email: data.email,
          state: data.state,
          country: data.country,
          district: data.district,
          pinCode:data.pinCode,
          mandal: data.mandal,
          city: data.city,
        };
        setInitialValues(initial);
        form.setFieldsValue(initial);
        setProfilePhoto(data.profilePicture || defaultProfilePhoto);
        setSelectedFileName(data.profilePicture != "" ? true : false);
        console.log(selectedFileName);
        const title = data.firstName + " " + data.lastName;
        setUserTitle(title);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [isEditing]);
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };
  const handleImageUpload1 = async (event) => {
    let file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    const url = await Upload(file, (progress) => {
      setUploadProgress(progress);
    }, "image");

    setHasChanges(true);
    setProfilePhoto(url);
    setIsUploading(false);
  };
  function capitalizeFirstLetter(string) {
    if (!string || typeof string !== "string") {
      return ""; // Return an empty string if input is not valid
    }
    return string
      .toLowerCase() // Ensure all letters are lowercase first
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  }

  const handleRemoveProfilePhoto = () => {
    setProfilePhoto(defaultProfilePhoto);
    setSelectedFileName("");
    setHasChanges(true);
  };

  const handleUpdate = async (values) => {
    const tokenData = localStorage.getItem(
      `token${localStorage.getItem("role")}`
    );
    const updatedData = {
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.newPassword,
      phoneNumber: values.phone,
      country: values.country,
      state: values.state,
      pinCode:values.pinCode,
      district: values.district,
      mandal: values.mandal,
      city: values.city,
      profilePicture: profilePhoto,
    };

    await _put("users/update", updatedData)
      .then(() => {
        setIsEditing(false);
        localStorage.removeItem("name");
        localStorage.setItem(
          "name",
          `${values.firstName + " " + values.lastName}`
        );
        setInitialValues(values);
        setHasChanges(false);
        console.log(updatedData);
      })
      .catch(() => { });
  };

  const handleClose = () => {
    setIsEditing(false);
    setHasChanges(false);
    setSelectedFileName("");
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setProfilePhoto(imageSrc);
      setWebCam(!web);
      setUploadProgress(0);
      setIsUploading(true);
      setUploadProgress(0);

      const url = await Upload(imageSrc, (progress) => {
        setUploadProgress(progress);
      });

      setProfilePhoto(url);
      setIsUploading(false);
      setHasChanges(true);
    }
  };

  const handleValuesChange = (_, allValues) => {
    const trimmedValues = Object.keys(allValues).reduce((acc, key) => {
      acc[key] =
        typeof allValues[key] === "string"
          ? allValues[key].trim()
          : allValues[key];
      return acc;
    }, {});

    const hasDifference = Object.keys(initialValues).some(
      (key) => initialValues[key] !== trimmedValues[key]
    );

    const passwordsMatch =
      trimmedValues.newPassword === trimmedValues.repeatNewPassword;
    const hasPasswordChange =
      trimmedValues.newPassword || trimmedValues.repeatNewPassword;

    setHasChanges(
      (hasDifference && !hasPasswordChange) ||
      (hasPasswordChange && passwordsMatch)
    );
  };

  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <>
      <Modal
        title="Capture Photo"
        visible={web}
        okText="Capture"
        onOk={() => {
          handleCapture();
        }}
        onCancel={() => setWebCam(!web)}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            width: "100%",
          }}
        />
      </Modal>
      {data === null ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the loader
          }} />
          <p>{t("profile.Loading")}</p>
        </div>
      ) : (
        <div className="container light-style flex-grow-1 container-p-y">
          <Card
            style={{ border: "1px solid black", width: "80vw" }}
            title={
              <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
                Profile
              </h3>
            }
          >
            <Row>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={6}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    name="profilePicture"
                    src={profilePhoto}
                    alt="User"
                    style={{
                      borderRadius: "50%",
                      width: "200px",
                      height: "182px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontWeight: "700",
                        marginTop: "16px",
                        fontSize: "1.5rem",
                        letterSpacing: "1px",
                        textAlign: "center",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        marginBottom: "-1px",
                      }}
                    >
                      {userTitle}
                    </h2>
                    <h4>
                      <b>
                        {localStorage.getItem("role") === "1"
                          ? t("registration.Agent")
                          : localStorage.getItem("role") === "4"
                            ? "Estate Client"
                            : localStorage.getItem("role") === "0"
                              ? "Admin"
                              : localStorage.getItem("role") === "2"
                                ? "Seller"
                                : localStorage.getItem("role") === "3"
                                  ? "Buyer"
                                  : localStorage.getItem("role") === "5"
                                    ? "CSR"
                                    : "Marketing Agent"}


                      </b>
                    </h4>
                  </div>
                </div>
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
                <div style={{ marginTop: "10px" }}>
                  {isEditing && (
                    <div style={{ marginLeft: "32%" }}>
                      <div
                        style={{
                          marginLeft: "-20px",
                          flex: "1",
                        }}
                      >
                        {selectedFileName}
                      </div>

                      <Button
                        icon={<UploadOutlined />}
                        style={{ marginRight: "10px", flex: "none" }}
                        onClick={() => {
                          document.querySelector('input[type="file"]').click();
                        }}
                      />
                      <Popover
                        content={
                          <div style={{ textAlign: "center" }}>
                            <p>Are you sure you want to delete this property?</p>
                            <Button
                              type="primary"
                              danger
                              onClick={handleRemoveProfilePhoto}
                              style={{ marginRight: "8px" }}
                            >
                              Yes
                            </Button>
                            <Button type="default">No</Button> {/* No button to close the popover */}
                          </div>
                        }
                        trigger="click"
                        placement="topRight"
                      >
                        <Button style={{ textAlign: "center" }}>
                          <DeleteOutlined style={{marginLeft:"5px"}}/> </Button>
                      </Popover>

                      <Button
                        icon={<CameraOutlined />}
                        style={{ marginLeft: "10px", flex: "none" }}
                        onClick={() => {
                          setWebCam(!web);
                        }}
                      />
                      <Input
                        type="file"
                        onChange={handleImageUpload1}
                        style={{
                          display: "none",
                        }}
                        accept="image/jpeg, image/png, image/jpg, image/gif"
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
                <div style={{ flex: "1", marginLeft: "5%" }}>
                  <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleUpdate}
                    onValuesChange={handleValuesChange}
                  >
                    {isEditing ? (
                      <>
                        <Row gutter={16}>
                          <Col span={9}>
                            <Form.Item
                              label={t("registration.First Name")}
                              name="firstName"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label={t("registration.Last Name")}
                              name="lastName"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label={t("registration.Email")}
                              name="email"
                            >
                              <Input disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label={t("registration.Phone Number")}
                              name="phone"
                              rules={[
                                {
                                  validator: (_, value) => {
                                    const startPattern = /^[6-9]/;
                                    const fullPattern = /^[6-9]\d{9}$/;

                                    if (!value) {
                                      return Promise.resolve();
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
                              <Input
                                disabled={!isEditing}
                                value={formatPhoneNumber(form.getFieldValue("phone"))}  // Format the phone number here
                              />
                            </Form.Item>
                          </Col>

                          <Col span={9}>
                            <Form.Item
                              label="State"
                              name="state"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label="Country"
                              name="country"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label="Pincode"
                              name="pinCode"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label="District"
                              name="district"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label="Mandal"
                              name="mandal"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label="Village"
                              name="city"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item
                              label={t("registration.Password")}
                              name="newPassword"
                              rules={[
                                {
                                  pattern:
                                    /^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Z][A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,14}$/,
                                  message: "please Enter Strong Password",
                                },
                              ]}
                            >
                              <Input.Password
                                onChange={(e) => setShowConfirmPassword(!!e.target.value)}
                                placeholder={t("profile.enterNewPass")}
                                onFocus={() => setTooltipVisible(true)}
                                onBlur={() => setTooltipVisible(false)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        {showConfirmPassword && (
                          <Row gutter={16} style={{ marginTop: "1rem" }}>

                            <Col span={9}>
                              <Form.Item
                                label={t("registration.Confirm Password")}
                                name="repeatNewPassword"
                                rules={[
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                      ) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          "The two passwords that you entered do not match!"
                                        )
                                      );
                                    },
                                  }),
                                ]}
                              >
                                <Input.Password
                                  placeholder={t("profile.reEnter")}
                                />
                              </Form.Item>
                            </Col>
                          </Row>)}
                      </>
                    ) : (
                      <>
                        <Row gutter={[16, 16]} style={{ marginTop: "25px" }}>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>{t("registration.First Name")} :</b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{capitalizeFirstLetter(form.getFieldValue("firstName"))}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>{t("registration.Last Name")} : </b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{capitalizeFirstLetter(form.getFieldValue("lastName"))}</p>
                            </p>
                          </Col>



                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>{t("registration.Phone Number")} : </b>

                            <p>
                              <p style={{ marginLeft: "5px" }}>{formatPhoneNumber(form.getFieldValue("phone"))}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>{t("registration.Email")} : </b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{form.getFieldValue("email")}</p>
                            </p>
                          </Col>
                        
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>Country : </b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{form.getFieldValue("country")}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>State : </b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{form.getFieldValue("state")}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>Pincode : </b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{form.getFieldValue("pinCode")}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>District :</b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{capitalizeFirstLetter(form.getFieldValue("district"))}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>Mandal :</b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{capitalizeFirstLetter(form.getFieldValue("mandal"))}</p>
                            </p>
                          </Col>
                          <Col
                            sm={12}
                            xs={24}
                            md={12}
                            lg={8}
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <b>Village :</b>
                            <p>
                              <p style={{ marginLeft: "5px" }}>{capitalizeFirstLetter(form.getFieldValue("city"))}</p>
                            </p>
                          </Col>
                        </Row>


                      </>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "20px",
                        marginRight: "40%",
                      }}
                    >
                      {isEditing ? (
                        <>
                          <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!hasChanges}
                            style={{ marginRight: "10px" }}
                          >
                            {t("profile.save")}
                          </Button>
                          <Button
                            onClick={handleClose}
                            style={{ marginRight: "10px" }}
                          >
                            {t("profile.cancel")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => setIsEditing(true)}
                        >
                          {t("profile.Edit Profile")}
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;

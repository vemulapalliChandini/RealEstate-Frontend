import React, { useState } from "react";
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
} from "antd";
import { _get, _post } from "../Service/apiClient";
import { useTranslation } from "react-i18next";
import "./Styles/FloatingLabel.css";

function Registration({ setIsLoginVisible }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [addressDetails, setAddressDetails] = useState({
    district: "",
    mandal: "",
    village: "",
  });
  const [mandals, setMandals] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [villages, setVillages] = useState([]);
  const [pincode, setPincode] = useState(null);
  const [selectedMandal, setSelectedMandal] = useState("");
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
  const options = [
    {
      label: "Seller Side Agent",
      value: "sellerSideAgent",
    },
    {
      label: "Buyer Side Agent",
      value: "buyerSideAgent",
    },
    {
      label: "Both Seller and Buyer Side",
      value: "agent",
    },
    {
      label: t("registration.Seller"),
      value: "seller",
    },
    {
      label: t("registration.Buyer"),
      value: "buyer",
    },
    {
      label: "Estate Client",
      value: "estateClient",
    },
  ];
  const submitting = async (values) => {
    delete values.confirmPassword;
    delete values.pinCode;
    let finalValues = {
      ...values,
      state: "Andhra Pradesh",
      country: "India",
      district: addressDetails.district[0],
      mandal: addressDetails.mandal,
      city: addressDetails.village,
      profilePicture:
        "https://res.cloudinary.com/ddv2y93jq/image/upload/v1726132403/zsafjroceoneetkmz5jq.webp",
      role:
        values.role === "agent"
          ? "1"
          : values.role === "seller"
          ? "2"
          : values.role === "estateClient"
          ? "4"
          : values.role === "csr"
          ? "5"
          :values.role === "sellerSideAgent"
          ? "11"
          :values.role === "buyerSideAgent"
          ?"12"
          :"3",
      pinCode: pincode === null || pincode === "" ? "000000" : pincode,
    };
    try {
      const res = await _post(
        "/create",
        finalValues,
        "Registered Successfully",
        `${t("registration.Email Already Exists")}`
      );
      if (res.status === 201) {
        form.resetFields();
        setAddressDetails({
          district: "",
          mandal: "",
          village: "",
        });
        setIsLoginVisible(true);
      }
    } catch (error) {}
  };
  const [tooltipVisible, setTooltipVisible] = useState(false);
  return (
    <>
      <Form
        onFinish={submitting}
        form={form}
        initialValues={{
          state: "Andhra Pradesh",
          country: "India",
        }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
                    <span style={{ color: "red" }}>*</span>&nbsp;
                    {t("registration.Select Your Role")}
                  </span>
                }
                options={options}
                optionRender={(option) => <Space>{option.data.label}</Space>}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
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
                  message: `${t("registration.Only alphabets are allowed")}`,
                },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label>
                  <span className="required">*</span>{" "}
                  {t("registration.First Name")}
                </label>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
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
                  message: `${t("registration.Only alphabets are allowed")}`,
                },
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " />
                <label>
                  <span className="required">*</span>{" "}
                  {t("registration.Last Name")}
                </label>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="phoneNumber"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                        new Error("Contact number must be digits of length 10!")
                      );
                    }

                    return Promise.resolve(); 
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="country"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="state"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="pinCode"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  pattern: /^[0-9]{6}$/,

                  message: `${t("registration.Only 6 digit code is allowed")}`,
                },
              ]}
            >
              <div className="floating-label">
                <Input onChange={handlePincodeChange} placeholder=" " />
                <label>{t("registration.Pincode")}</label>
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
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
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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
                    <Input className="input-box" value={mandals[0]} readOnly />
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
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="email"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: `${t("registration.Please input your email!")}`,
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
                <Input placeholder=" " />
                <label>
                  <span className="required">*</span> {t("registration.Email")}
                </label>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="password"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: `${t("registration.Password is required")}`,
                },
                {
                  pattern:
/^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};:'"\\|,.<>/?])[A-Z][A-Za-z\d!@#$%^&*()_+\-={};:'"\\|,.<>/?]{7,14}$/,
                  message: `${t(
                    "registration.Please enter a strong password"
                  )}`,
                },
              ]}
            >
              <div className="floating-label">
                <Tooltip
                  title={t("registration.sample")}
                  visible={tooltipVisible}
                >
                  <Input
                    placeholder=" "
                    type="password"
                    onFocus={() => setTooltipVisible(true)}
                    onBlur={() => setTooltipVisible(false)}
                  />
                </Tooltip>
                <label>
                  <span className="required">*</span>{" "}
                  {t("registration.Password")}
                </label>
              </div>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Form.Item
              name="confirmPassword"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: `${t("registration.Confirm password is required!")}`,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`${t("registration.Passwords do not match!")}`)
                    );
                  },
                }),
              ]}
            >
              <div className="floating-label">
                <Input placeholder=" " type="password" />
                <label>
                  <span className="required">*</span>{" "}
                  {t("registration.Confirm Password")}
                </label>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <p style={{ textAlign: "center", width: "100" }}>
              {t("registration.Already have an account?")}
              <span
                style={{
                  color: "#1890ff",
                  cursor: "pointer",
                  marginLeft: "1px",
                }}
                onClick={() => {
                  form.resetFields();
                  setIsLoginVisible(true);
                }}
              >
                {t("login.Login")}
              </span>
            </p>
          </Col>
        </Row>
        <Row justify="end">
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
    </>
  );
}

export default Registration;

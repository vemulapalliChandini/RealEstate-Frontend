// import React, { useEffect, useRef, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faKey, faPhone } from "@fortawesome/free-solid-svg-icons";
// import { Button, Col, Form, Input, Modal, Row, Switch } from "antd";
// import { useTranslation } from "react-i18next";
// import Registration from "./Registration";
// import { useNavigate } from "react-router-dom";
// import { _post, _get } from "../Service/apiClient";
// import { jwtDecode } from "jwt-decode";
// import "./Styles/FloatingLabel.css";

// const LoginPage = ({ visible, handleLoginClose }) => {
//   const [otpCheck, setOtpCheck] = useState("");
//   const [password, setPassword] = useState("");
//   const [count, setCount] = useState(120);
//   const [twillioOtp, setTwillioOtp] = useState(null);
//   const { t, i18n } = useTranslation();
//   const [form] = Form.useForm();
//   const [isLoginVisible, setIsLoginVisible] = useState(true);
//   const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
//   const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
//   const [newLanguage, setNewLanguage] = useState("");
//   const [inputValue, setInputValue] = useState("");
//   const [AfterValidation, setafterValidation] = useState("otp");
//   const [resendOTP, setResendOTP] = useState(false);
//   const [BeforeValidation, setBeforeValidation] = useState(false);
//   const [inputError, setInputError] = useState("");
//   const [beforesubmitbutton, setBeforeSubmitButton] = useState(true);
//   const [passwordDisable, setPasswordDisable] = useState(true);
//   const [otpButtonDisable, setOtpButtonDisable] = useState(true);
//   const [emailPasswordError, setPasswordError] = useState(""); 
//   const usernameRef = useRef(null);
//   useEffect(() => { 
//      if (usernameRef.current) {
//       usernameRef.current.focus(); 
//     }
//     if (count > 0) {
//       const timer = setInterval(() => {
//         setCount((prevCount) => prevCount - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else {
//       if (count === 0) {
//         setResendOTP(true);
//       }
//     }
//   }, [count]); 


//   const navigate = useNavigate();

//   const cleaninginputError = () => {
//     setInputError("");
//   };

//   const passwordVerifivation = () => {
//     let endpoint = "";

//     if (AfterValidation !== "otp") {
//       endpoint = _post(
//         "/login",
//         { email: inputValue, password: password },
//         `${t("login.Login Successful")}`,
//         `${t("login.Login Failed")}`
//       );
//     } else {
//       endpoint = _post(
//         "/verify",
//         { phoneNumber: inputValue, otp: otpCheck },
//         `${t("login.Login Successful")}`,
//         `${t("login.Login Failed")}`
//       );
//     }


//     endpoint
//       .then((res) => {
//         setResendOTP(false);
//         localStorage.setItem("token", res.data.token);
//         const decoded = jwtDecode(res.data.token);
//         const role = decoded.user.role;
//         const phoneNumber=decoded.user.phoneNumber;
//         const name = `${decoded.user.firstName} ${decoded.user.lastName}`;
//         localStorage.setItem("role", role);
//         localStorage.setItem("name", name);
//         localStorage.setItem("userId",decoded.user.userId)
//         localStorage.setItem("type", "Agriculture");
//         localStorage.setItem("mtype", "Agriculture");
//         localStorage.setItem("phoneNumber",phoneNumber);
//         localStorage.setItem("language", newLanguage);
//         form.resetFields();
//         handleLoginClose();
//         // navigate(
//         //   `/dashboard/${
//         //     role === 3
//         //       ? "buyer"
//         //       : role === 1
//         //       ? "agent"
//         //       : role === 4
//         //       ? "eClient"
//         //       : role === 0
//         //       ? "admin"
//         //       :"seller"
//         //   }`
//         // );
//         navigate(
//           `/dashboard/${
//             role === 3
//               ? "buyer"
//               : role === 1
//               ? "agent"
//               : role === 4
//               ? "eClient"
//               : role === 0
//               ? "admin"
//               : role === 5
//               ? "csr"
//               : "seller"
//           }`
//         );


//       })
//       .catch((error) => {
//         if (AfterValidation !== "otp") {
//           setPasswordError("InvalidPassword");
//         } else {
//           setPasswordError("Invalid OTP");
//           setResendOTP(true);
//           setOtpCheck("");
//         }
//       });
//   };

//   const validateInput = () => {
//     if (AfterValidation === "otp") {
//       setResendOTP(false);
//     }
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

//     const phoneRegex = /^\d{10}$/;

//     if (phoneRegex.test(inputValue)) {
//       _get(`verifyPhno/${inputValue}`)
//         .then((response) => {

//           if (response.status === 200) {
//             setBeforeValidation(true);
//             setafterValidation("otp");

//             setCount(120);
//           }
//           _post(
//             "/otp",
//             { phoneNumber: inputValue },
//             `${t("login.Otp Sent Successfully")}`,
//             `${t("login.Failed to send OTP")}`
//           )
//             .then((res) => {
//               setTwillioOtp(res.data.smsResponse.code);
//             })
//             .catch(() => {});
//         })
//         .catch((error) => {
//           console.error(error); 
//           setInputError("Phonenumber not registered");
//         });
//     } else if (emailRegex.test(inputValue)) {
//       _get(`verifyEmail/${inputValue}`)
//         .then((response) => {

//           if (response.status === 200) {
//             setBeforeValidation(true);
//             setafterValidation("password");

//           }
//         })
//         .catch((error) => {
//           console.error(error);
//           setInputError("email not registered");
//         });
//     } else {
//       if (inputValue.includes("@")) {
//         setInputError("Invalid email format");
//       } else {
//         setInputError("Invalid phone number format");
//       }
//     }
//   };

//   const showRegisterModal = () => {
//     setIsOtpButtonDisabled(false);
//     setIsLoginVisible(false);
//     setIsRegisterModalVisible(true);
//     form.resetFields();
//   };

//   const handleLoginCancel = () => {
//     setResendOTP(false);
//     setInputError("");
//     setPasswordDisable(true);
//     setPasswordError("");
//     setPassword("");
//     setResendOTP(false);
//     setBeforeValidation(false);
//     form.resetFields();
//     handleLoginClose();
//     setIsOtpButtonDisabled(false);
//   };

//   const handleRegisterCancel = () => {
//     form.resetFields();
//     setIsLoginVisible(true);
//     setIsRegisterModalVisible(false);
//     handleLoginClose();
//     setIsOtpButtonDisabled(false);
//   };
//   const changeLanguage = (checked) => {
//     let x = checked ? "te" : "en";
//     i18n.changeLanguage(x);
//     setNewLanguage(x);
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${minutes < 10 ? `0${minutes}` : minutes}:${
//       seconds < 10 ? `0${seconds}` : seconds
//     }`;
//   };

//   const resending = () => {
//     setOtpCheck("");
//     setPassword("");
//     setPasswordError("");
//     setOtpButtonDisable(true);
//     setInputError("");

//     form.resetFields();

//     setResendOTP(false);

//     _post(
//       "/otp",
//       { phoneNumber: inputValue },
//       `${t("login.Otp Sent Successfully")}`,
//       `${t("login.Failed to send OTP")}`
//     )
//       .then((res) => {
//       })
//       .catch(() => {});

//     setCount(120);
//   };

//   return (
//     <>
//       <Modal
//         style={{ marginTop: isLoginVisible ? "2%" : "-6.5%" }}
//         title={
//           isLoginVisible ? (
//             <p style={{ textAlign: "center" }}>{t("login.Login")}</p>
//           ) : (
//             <p style={{ textAlign: "center" }}>{t("login.Register")}</p>
//           )
//         }
//         width={isLoginVisible ? 380 : 800}
//         open={visible}
//         onCancel={isLoginVisible ? handleLoginCancel : handleRegisterCancel}
//         footer={null}
//       >
//         <div style={{ marginBottom: "5%" }}>
//           <span>
//             Switch to {i18n.language !== "te" ? "తెలుగు" : "English"}:{" "}
//           </span>
//           <Switch
//             checkedChildren="తెలుగు"
//             unCheckedChildren="English"
//             onChange={changeLanguage}
//             defaultChecked={i18n.language === "te"}
//             style={{ marginLeft: "2%" }}
//           />
//         </div>

//         {isLoginVisible ? (
//           <Row>
//             <Col xs={24}>
//               <Form
//                 form={form}
//                 name="basic"
//                 initialValues={{ remember: true }}
//                 style={{ maxWidth: "100%", margin: "0 auto" }}
//                 autoComplete="off"
//               >
//                 {!BeforeValidation ? (
//                   <>
//                     <Form.Item name="beforelogin">
//                       <Input    ref={usernameRef} 
//                         placeholder="Enter your Phone Number or Email"
//                         prefix={<FontAwesomeIcon icon={faUser} />}
//                         className="custom-input"
//                         onChange={(e) => {
//                           setBeforeSubmitButton(false);
//                           setInputValue(e.target.value);
//                           if (e.target.value === "") {
//                             cleaninginputError();
//                             setBeforeSubmitButton(true);
//                           }
//                         }}
//                       />
//                     </Form.Item>
//                     {inputError !== "" && (
//                       <p
//                         style={{
//                           color: "red",
//                           textAlign: "center",
//                           fontFamily: "sans-serif",
//                         }}
//                       >
//                         {inputError}
//                       </p>
//                     )}
//                     <p style={{ textAlign: "center" }}>
//                       {t("login.Don't have an account?")}{" "}
//                       <span
//                         style={{ color: "#1890ff", cursor: "pointer" }}
//                         onClick={showRegisterModal}
//                       >
//                         {t("login.Register")}
//                       </span>
//                     </p>

//                     <Form.Item
//                       style={{ textAlign: "center" }}
//                       name="beforesubmit"
//                     >
//                       <Button
//                         onClick={validateInput}
//                         disabled={beforesubmitbutton}
//                         type="primary"
//                         htmlType="submit"
//                         style={{ width: "50%" }}
//                       >
//                         {t("login.Submit")}
//                       </Button>
//                     </Form.Item>
//                   </>
//                 ) : AfterValidation === "otp" ? (
//                   <>
//                     <Form.Item name="logPhone">
//                       <Input  ref={usernameRef}
//                         onChange={(e) => {
//                           setOtpCheck(e.target.value);
//                           setOtpButtonDisable(false);
//                           if (e.target.value === "") {
//                             setPasswordError("");
//                           }
//                         }}
//                         placeholder="Enter OTP"
//                         prefix={<FontAwesomeIcon icon={faPhone} />}
//                         className="custom-input"
//                         value={otpCheck}
//                       />
//                       <Form.Item style={{ textAlign: "center" }}>
//                         {emailPasswordError !== "" ? (
//                           <p style={{ color: "red", textAlign: "center" }}>
//                             {emailPasswordError}
//                           </p>
//                         ) : (
//                           <p></p>
//                         )}

//                         {!resendOTP ? (
//                           <p style={{ textAlign: "center" }}>
//                             {formatTime(count)}
//                           </p>
//                         ) : (
//                           <Button
//                             type="primary" 
//                             onClick={resending}
//                             style={{ display: "block", margin: "0 auto" }}
//                           >
//                             Resend OTP
//                           </Button>
//                         )}
//                       </Form.Item>

//                       <Button
//                         onClick={passwordVerifivation}
//                         disabled={otpButtonDisable}
//                         type="primary"
//                         htmlType="submit"
//                         style={{ display: "block", margin: "0 auto" }} 
//                       >
//                         {t("login.Submit")}
//                       </Button>
//                     </Form.Item>
//                   </>
//                 ) : (
//                   <>
//                     <Form.Item name="logemail">
//                       <Input.Password  ref={usernameRef}
//                         value={password}
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                           setPasswordDisable(false);
//                           if (e.target.value === "") {
//                             setPasswordError("");
//                           }
//                         }}
//                         placeholder="enter password"
//                         prefix={<FontAwesomeIcon icon={faKey} />}
//                         className="custom-input"
//                       />
//                     </Form.Item>
//                     {emailPasswordError != "" ? (
//                       <p style={{ color: "red", textAlign: "center" }}>
//                         {emailPasswordError}
//                       </p>
//                     ) : (
//                       <p></p>
//                     )}
//                     <Form.Item
//                       style={{ textAlign: "center" }}
//                       name="emailsubmit"
//                     >
//                       <Button
//                         onClick={passwordVerifivation}
//                         disabled={passwordDisable}
//                         type="primary"
//                         htmlType="submit.."
//                         style={{ width: "50%" }}
//                       >
//                         {t("login.Submit")}
//                       </Button>
//                     </Form.Item>
//                   </>
//                 )}
//               </Form>
//             </Col>
//           </Row>
//         ) : (
//           <Registration
//             setIsLoginVisible={setIsLoginVisible}
//             setIsRegisterModalVisible={setIsRegisterModalVisible}
//           />
//         )}
//       </Modal>
//     </>
//   );
// };

// export default LoginPage;














import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Form, Input, Modal, Radio, Row, Switch } from "antd";
import { useTranslation } from "react-i18next";
import Registration from "./Registration";
import { useNavigate } from "react-router-dom";
import { _post, _get } from "../Service/apiClient";
import { jwtDecode } from "jwt-decode";
import "./Styles/FloatingLabel.css";
import { use } from "react";
import RoleSelection from "./RoleSelection";

const LoginPage = ({ visible, handleLoginClose }) => {
  const [otpCheck, setOtpCheck] = useState("");
  const [password, setPassword] = useState("");
  const [count, setCount] = useState(120);
  const [twillioOtp, setTwillioOtp] = useState(null);
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [AfterValidation, setafterValidation] = useState("otp");
  const [resendOTP, setResendOTP] = useState(false);
  const [BeforeValidation, setBeforeValidation] = useState(false);
  const [inputError, setInputError] = useState("");
  const [beforesubmitbutton, setBeforeSubmitButton] = useState(true);
  const [passwordDisable, setPasswordDisable] = useState(true);
  const [otpButtonDisable, setOtpButtonDisable] = useState(true);
  const [emailPasswordError, setPasswordError] = useState("");
  const usernameRef = useRef(null);
  const [isAgent, setIsAgent] = useState(false);
  useEffect(() => {
    console.log("awedwsdweklrdjweru3wer")
    console.log(role);
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      if (count === 0) {
        setResendOTP(true);
      }
    }

  }, [count]);
  let role = 0;
  useEffect(() => {

    console.log(isAgent);
  }, [role])

  const navigate = useNavigate();

  const cleaninginputError = () => {
    setInputError("");
  };

  const passwordVerifivation = () => {
    let endpoint = "";

    if (AfterValidation !== "otp") {
      endpoint = _post(
        "/login",
        { email: inputValue, password: password },
        `${t("login.Login Successful")}`,
        `${t("login.Login Failed")}`
      );
    } else {
      endpoint = _post(
        "/verify",
        { phoneNumber: inputValue, otp: otpCheck },
        `${t("login.Login Successful")}`,
        `${t("login.Login Failed")}`
      );
    }


    endpoint
      .then((res) => {
        setResendOTP(false);
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        role = decoded.user.role;
        if (Number(role) === 1) {
          setIsAgent(true);
        }
        console.log(role);
        const phoneNumber = decoded.user.phoneNumber;
        const profilePicture = decoded.user.profilePicture;
        const name = `${decoded.user.firstName} ${decoded.user.lastName}`;
        console.log(role);
        console.log(isAgent);

        localStorage.setItem("role", role);

        localStorage.setItem("agentrole", 0);
        localStorage.setItem("name", name);
        localStorage.setItem("userId", decoded.user.userId)
        localStorage.setItem("type", "Agriculture");
        localStorage.setItem("mtype", "Agriculture");
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("profile", profilePicture);
        localStorage.setItem("language", newLanguage);
        form.resetFields();
        if (role !== 1) {
          handleLoginClose();
        }
        // navigate(
        // `/dashboard/${
        // role === 3
        // ? "buyer"
        // : role === 1
        // ? "agent"
        // : role === 4
        // ? "eClient"
        // : role === 0
        // ? "admin"
        // :"seller"
        // }`
        // );
       

        if(role !=1){
          navigate(
            `/dashboard/${role === 3
              ? "buyer"
              : role === 1
                ? "agent"
                : role === 4
                  ? "eClient"
                  : role === 0
                    ? "admin"
                    : role === 6
                      ? "marketingagent"
                      : role === 5
                        ? "csr"
                        : "seller"
            }`
          );
        }else if(localStorage.getItem ("agentrole")===12){
          console.log("sihsiwh")
          navigate("/dashboard")
        }

      })
      .catch((error) => {
        if (AfterValidation !== "otp") {
          setPasswordError("InvalidPassword");
        } else {
          setPasswordError("Invalid OTP");
          setResendOTP(true);
          setOtpCheck("");
        }
      });
  };
  const [selectedAgentRole, setSelectedAgentRole] = useState(""); // State for storing selected role

  const handleSubmit = () => {
    
    if (selectedAgentRole) {
      localStorage.setItem("agentrole", selectedAgentRole); // Store the selected agent role in localStorage
   
    }
    if(selectedAgentRole === 11){
      localStorage.setItem("agentrole", 11);
      navigate("/dashboard/agent")
    }
    if(selectedAgentRole === 12){
      localStorage.setItem("agentrole", 12);
      navigate("/dashboard/agent");
    }
  };
  const validateInput = () => {
    if (AfterValidation === "otp") {
      setResendOTP(false);
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    const phoneRegex = /^\d{10}$/;

    if (phoneRegex.test(inputValue)) {
      _get(`verifyPhno/${inputValue}`)
        .then((response) => {

          if (response.status === 200) {
            setBeforeValidation(true);
            setafterValidation("otp");

            setCount(120);
          }
          _post(
            "/otp",
            { phoneNumber: inputValue },
            `${t("login.Otp Sent Successfully")}`,
            `${t("login.Failed to send OTP")}`
          )
            .then((res) => {
              setTwillioOtp(res.data.smsResponse.code);
            })
            .catch(() => { });
        })
        .catch((error) => {
          console.error(error);
          setInputError("Phonenumber not registered");
        });
    } else if (emailRegex.test(inputValue)) {
      _get(`verifyEmail/${inputValue}`)
        .then((response) => {

          if (response.status === 200) {
            setBeforeValidation(true);
            setafterValidation("password");

          }
        })
        .catch((error) => {
          console.error(error);
          setInputError("email not registered");
        });
    } else {
      if (inputValue.includes("@")) {
        setInputError("Invalid email format");
      } else {
        setInputError("Invalid phone number format");
      }
    }
  };

  const showRegisterModal = () => {
    setIsOtpButtonDisabled(false);
    setIsLoginVisible(false);
    setIsRegisterModalVisible(true);
    form.resetFields();
  };

  const handleLoginCancel = () => {
    setResendOTP(false);
    setInputError("");
    setPasswordDisable(true);
    setPasswordError("");
    setPassword("");
    setResendOTP(false);
    setBeforeValidation(false);
    form.resetFields();
    handleLoginClose();
    setIsOtpButtonDisabled(false);
  };

  const handleRegisterCancel = () => {
    form.resetFields();
    setIsLoginVisible(true);
    setIsRegisterModalVisible(false);
    handleLoginClose();
    setIsOtpButtonDisabled(false);
  };
  const changeLanguage = (checked) => {
    let x = checked ? "te" : "en";
    i18n.changeLanguage(x);
    setNewLanguage(x);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds
      }`;
  };

  const resending = () => {
    setOtpCheck("");
    setPassword("");
    setPasswordError("");
    setOtpButtonDisable(true);
    setInputError("");

    form.resetFields();

    setResendOTP(false);

    _post(
      "/otp",
      { phoneNumber: inputValue },
      `${t("login.Otp Sent Successfully")}`,
      `${t("login.Failed to send OTP")}`
    )
      .then((res) => {
      })
      .catch(() => { });

    setCount(120);
  };

  return (
    <>
      <Modal
        style={{ marginTop: isLoginVisible ? "2%" : "-6.5%" }}
        title={
          isLoginVisible ? (
            <p style={{ textAlign: "center" }}>{t("login.Login")}</p>
          ) : (
            <p style={{ textAlign: "center" }}>{t("login.Register")}</p>
          )
        }
        width={isLoginVisible ? 380 : 800}
        open={visible}
        onCancel={isLoginVisible ? handleLoginCancel : handleRegisterCancel}
        footer={null}
      >
        <div style={{ marginBottom: "5%" }}>
          <span>
            Switch to {i18n.language !== "te" ? "తెలుగు" : "English"}:{" "}
          </span>
          <Switch
            checkedChildren="తెలుగు"
            unCheckedChildren="English"
            onChange={changeLanguage}
            defaultChecked={i18n.language === "te"}
            style={{ marginLeft: "2%" }}
          />
        </div>


        {isLoginVisible ? (
          <Row>
            <Col xs={24}>
              <Form
                form={form}
                name="basic"
                initialValues={{ remember: true }}
                style={{ maxWidth: "100%", margin: "0 auto" }}
                autoComplete="off"
              >
                {!BeforeValidation ? (
                  <>
                    <Form.Item name="beforelogin">
                      <Input ref={usernameRef}
                        placeholder="Enter your Phone Number or Email"
                        prefix={<FontAwesomeIcon icon={faUser} />}
                        className="custom-input"
                        onChange={(e) => {
                          setBeforeSubmitButton(false);
                          setInputValue(e.target.value);
                          if (e.target.value === "") {
                            cleaninginputError();
                            setBeforeSubmitButton(true);
                          }
                        }}
                      />
                    </Form.Item>
                    {inputError !== "" && (
                      <p
                        style={{
                          color: "red",
                          textAlign: "center",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {inputError}
                      </p>
                    )}
                    <p style={{ textAlign: "center" }}>
                      {t("login.Don't have an account?")}{" "}
                      <span
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={showRegisterModal}
                      >
                        {t("login.Register")}
                      </span>
                    </p>

                    <Form.Item
                      style={{ textAlign: "center" }}
                      name="beforesubmit"
                    >
                      <Button
                        onClick={validateInput}
                        disabled={beforesubmitbutton}
                        type="primary"
                        htmlType="submit"
                        style={{ width: "50%" }}
                      >
                        {t("login.Submit")}
                      </Button>
                    </Form.Item>
                  </>
                ) : AfterValidation === "otp" ? (
                  <>
                    <Form.Item name="logPhone">
                      <Input ref={usernameRef}
                        onChange={(e) => {
                          setOtpCheck(e.target.value);
                          setOtpButtonDisable(false);
                          if (e.target.value === "") {
                            setPasswordError("");
                          }
                        }}
                        placeholder="Enter OTP"
                        prefix={<FontAwesomeIcon icon={faPhone} />}
                        className="custom-input"
                        value={otpCheck}
                      />
                      <Form.Item style={{ textAlign: "center" }}>
                        {emailPasswordError !== "" ? (
                          <p style={{ color: "red", textAlign: "center" }}>
                            {emailPasswordError}
                          </p>
                        ) : (
                          <p></p>
                        )}

                        {!resendOTP ? (
                          <p style={{ textAlign: "center" }}>
                            {formatTime(count)}
                          </p>
                        ) : (
                          <Button
                            type="primary"
                            onClick={resending}
                            style={{ display: "block", margin: "0 auto" }}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </Form.Item>

                      <Button
                        onClick={passwordVerifivation}
                        disabled={otpButtonDisable}
                        type="primary"
                        htmlType="submit"
                        style={{ display: "block", margin: "0 auto" }}
                      >
                        {t("login.Submit")}
                      </Button>
                    </Form.Item>
                  </>
                ) : !isAgent ? (
                  <>

                    <Form.Item name="logemail">
                      <Input.Password ref={usernameRef}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordDisable(false);
                          if (e.target.value === "") {
                            setPasswordError("");
                          }
                        }}
                        placeholder="enter password"
                        prefix={<FontAwesomeIcon icon={faKey} />}
                        className="custom-input"
                      />
                    </Form.Item>

                    {emailPasswordError != "" ? (
                      <p style={{ color: "red", textAlign: "center" }}>
                        {emailPasswordError}
                      </p>
                    ) : (
                      <p></p>
                    )}

                    <Form.Item
                      style={{ textAlign: "center" }}
                      name="emailsubmit"
                    >
                      <Button
                        onClick={passwordVerifivation}
                        disabled={passwordDisable}
                        type="primary"
                        htmlType="submit.."
                        style={{ width: "50%" }}
                      >
                        {t("login.Submit")}
                      </Button>
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item name="agentRole">
                      <Radio.Group
                        value={selectedAgentRole}
                        onChange={(e) => setSelectedAgentRole(e.target.value)} 
                       // Update the state with selected value
                       style={{marginLeft:"2%"}}
                      >
                        <Radio value={11}  >Buyer's Agent</Radio>
                        <Radio value={12}>Seller's Agent</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }} name="agentSubmit">
                      <Button
                        onClick={handleSubmit} // Handle the submit logic
                        type="primary"
                        htmlType="submit"
                        style={{ width: "50%" }}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </>



                )}
              </Form>
            </Col>
          </Row>
        ) : (
          <Registration
            setIsLoginVisible={setIsLoginVisible}
            setIsRegisterModalVisible={setIsRegisterModalVisible}
          />
        )}

      </Modal>
    </>
  );
};

export default LoginPage;

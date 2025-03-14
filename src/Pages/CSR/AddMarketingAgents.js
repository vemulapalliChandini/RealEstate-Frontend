import React, { useState, useRef } from "react";
import { Row, Col, Button,   Form, Space, Input,   Tooltip, Progress } from "antd";
import { useTranslation } from "react-i18next";
import { _post } from "../../Service/apiClient";
import {
    DeleteOutlined,
    InfoCircleOutlined,
 
} from "@ant-design/icons";
import Upload from "../Agent/Upload";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
function AddMarketingAgents({ onAddSuccess }) {
    const [imageUrls, setImageUrls] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [uploadStep, setUploadStep] = useState(1);
    const [imageUrl1, setImageUrl1] = useState(null);
    const [uploadProgress1, setUploadProgress1] = useState(0);
    const [isUploading1, setIsUploading1] = useState(false);
    // const [responseTrue, setResponseTrue] = useState(false);
    const fileInputRef = useRef(null);
    const cropperRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const deleteImage1 = () => {
        setCroppedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
    const uploadPics = [];
    imageUrls.forEach((imageUrl) => {
        uploadPics.push(imageUrl);
    });

    const deletingImage = (index) => {
        setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                    setUploadProgress1(progress);
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
    const onFinish = async (values) => {
        // const role = localStorage.getItem("role");
        const payload = {
            ...values,
            role: 6,
            identityProof: uploadPics,
            profilePicture: croppedImage ? croppedImage : "",
        };

        console.log(payload);
        setLoading(true);
        try {
            const res = await _post(
                "/users/createCSR",
                payload,
                "Registered Successfully",
                `Error Occured`
            );
            if (res.status === 201) {
                form.resetFields();
                onAddSuccess();
                setCroppedImage(null);
                console.log("hello");
                // setResponseTrue(true);
            }
        } catch (error) {
        }
        finally {
            setLoading(false); // Set loading to false after the response (or error)
        }
    };
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        console.log(file);
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
    const { t } = useTranslation();
    const [form] = Form.useForm();
    return (
        <div style={{ marginTop: "3%" }}>
            <Form form={form} 

            onFinish={onFinish}>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="firstName"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: `${t("registration.First name is required")}` },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                                {
                                    min: 3,
                                    max: 30,
                                    message: "First name must be between 2 and 50 characters",
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input placeholder=" " />
                                <label>
                                    <span className="required">*</span> {t("registration.First Name")}
                                </label>
                            </div>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>

                        <Form.Item
                            name="lastName"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true, message: `${t("registration.Last name is required")}`
                                },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                                {
                                    min: 3,
                                    max: 60,
                                    message: "Last name must be between 2 and 50 characters",
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input placeholder=" " />
                                <label>
                                    <span className="required">*</span> {t("registration.Last Name")}
                                </label>
                            </div>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
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
                                <Input

                                    maxLength={10}
                                    placeholder=" "
                                />
                                <label>
                                    <span className="required">*</span> {t("registration.Phone Number")}
                                </label>
                            </div>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>

                    <Col xs={24} sm={12} md={8} lg={8}>
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
                                    message: `${t("registration.The input is not a valid email!")}`
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

                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="country"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: `Country is Required` },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input placeholder=" " />
                                <label>
                                    <span className="required">*</span> Country
                                </label>
                            </div>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="state"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: `State is Required` },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input placeholder=" " />
                                <label>
                                    <span className="required">*</span> State
                                </label>
                            </div>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>




                    <Col xs={24} sm={12} md={8} lg={8}>
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
                                <Input placeholder=" " />
                                <label> <span className="required">*</span> {t("registration.Pincode")}</label>
                            </div>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="district"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: `District is Required` },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input
                                    placeholder=" "

                                />

                                <label>
                                    <span className="required">*</span> District
                                </label>
                            </div>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="mandal"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: `Mandal is Required` },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input placeholder=" " />
                                <label>
                                    <span className="required">*</span> Mandal
                                </label>
                            </div>
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>




                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item
                            name="village"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                { required: true, message: `Village is Required` },
                                {
                                    pattern: /^[A-Za-z\s]+$/,
                                    message: `${t("registration.Only alphabets are allowed")}`,
                                },
                            ]}
                        >
                            <div className="floating-label">
                                <Input placeholder=" " />
                                <label>
                                    <span className="required">*</span> Village
                                </label>
                            </div>
                        </Form.Item>
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
                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={8}
                        xl={6}
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

                </Row>
                <Row>
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
                                        Upload Image
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

                        <p style={{ marginTop: "20px", color: "#0d416b" }}>
                            Please upload Front side and Back side images of your
                            identity.
                        </p>
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
                                        Upload Image
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


                <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading} >
                                Submit
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Form>

        </div>

    )
}

export default AddMarketingAgents
import React, { useState } from "react";
import {
  Row,
  Col,
  Tooltip,
  Progress,
  Grid
} from "antd";
import "./Residential.css";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

import Upload from "../Upload";

const { useBreakpoint } = Grid;
export default function UploadPhotos({
  handleuploadPics,
}) {
  const screens = useBreakpoint();
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const url = await Upload(file, (progress) => {
      setUploadProgress(progress);
    });

    setImageUrls((prevUrls) => {
      const newUrls = [...prevUrls, url];
      handleuploadPics(newUrls);
      return newUrls;
    });
    setIsUploading(false);
  };
  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <>
      <Row >
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

      <Row gutter={16} style={{ marginTop: "10px", marginLeft: "3%" }}>
        <Col span={24}>
          <label htmlFor="upload-input">
            <input
              id="upload-input"
              type="file"
              onChange={handleImageUpload}
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
  );
}
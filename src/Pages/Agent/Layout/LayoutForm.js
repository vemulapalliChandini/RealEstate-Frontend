import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Card,
  Row,
  Col,
  Switch,
  Select,
  Carousel,
  Tooltip,
  Collapse,
  Progress,
  Tag,
  Grid,
  Modal,
  message,
  Popconfirm,
  Table,
} from "antd";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import {
  DeleteOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

import { _get } from "../../../Service/apiClient.js";
import Upload from "../Upload";
import { Option } from "antd/es/mentions";
import "./Arrow.css";
import { _post } from "../../../Service/apiClient";
import { useTranslation } from "react-i18next";
import CurrentLocation from "../currentLocation.js";
import { FaArrowLeft } from "react-icons/fa";
const { useBreakpoint } = Grid;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const { Panel } = Collapse;

const LayoutForm = ({ setShowFormType }) => {
  const screens = useBreakpoint();
  const { t, i18n } = useTranslation();
  const [componentVariant, setComponentVariant] = useState("filled");
  const [amount, setAmount] = useState(0);
  const [time, setTime] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [hasPincode, setHasPincode] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState(["ownerDetails"]);
  const [hasErrors, setHasErrors] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("acres");
  const [pricePerAcre, setPricePerAcre] = useState(0);
  const [size, setSize] = useState(0);
  const [unit, setUnit] = useState("sq. ft");
  const [totalinacres, settotalInAcres] = useState(0);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [landmeasure, setLandMeasure] = useState(0);
  const fileInputRef = useRef(null);
  const [landMark, setlandMark] = useState("");
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);

  //  clusters.....

  const [plots, setPlots] = useState([
    { plotNumber: "", size: "", unit: "sq. ft", price: "" }, // Initial empty plot
  ]);

  const [isModalVisibles, setIsModalVisibles] = useState(false);
  const [batchRange, setBatchRange] = useState([1, 1]);
  const [batchSize, setBatchSize] = useState(0);
  const [landUnit, setLandUnit] = useState("sq. ft");
  const [prices, setPrices] = useState(0);

  const [batchRanges, setBatchRanges] = useState([
    { start: 1, end: 1, size: 0, price: 0, unit: "sq. ft" }, // Initial range
  ]);

  const landMeasurementOptions = [
    "acres",
    "sq. ft",
    "sq. yards",
    "sq. m",
    "cents",
  ];

  //  Start...........

  const handlePlotChange = (index, field, value) => {
    const updatedPlots = [...plots];
    updatedPlots[index][field] = value;
    setPlots(updatedPlots);
  };

  const handleBatchAdd = () => {
    // Validate inputs
    const { start, end, size, price, unit } = batchRanges[batchRanges.length - 1];
    console.log(start);
    console.log(end);
    console.log(size);

    // Validate inputs before adding new plots
    if (start > end || size <= 0 || price <= 0) {
      message.error("Invalid range, size, or price.");
      return;
    }

    // Generate new plots based on the input range
    const newPlots = [];
    for (let i = start; i <= end; i++) {
      newPlots.push({ plotNumber: i, size, unit, price });
    }

    // Filter out the initial empty plot before updating the state
    setPlots((prevPlots) => [
      ...prevPlots.filter(plot => plot.plotNumber !== ""), // Remove empty plot
      ...newPlots
    ]);

    // Add a new input set for the next range
    setBatchRanges([
      ...batchRanges,
      { start: 1, end: 1, size: 0, price: 0, unit: "sq. ft" }, // New empty range
    ]);
  };

  const handleBatchAdd1 = () => {
    const { start, end, size, price, unit } = batchRanges[batchRanges.length - 1];
    console.log(start);
    console.log(end);
    console.log(size);

    // Generate the new plots based on the input range
    const newPlots = [];
    for (let i = start; i <= end; i++) {
      newPlots.push({ plotNumber: i, size, unit, price });
    }

    setPlots((prevPlots) => [
      ...prevPlots.filter(plot => plot.plotNumber !== ""), // Remove empty plot
      ...newPlots
    ]);

    // ✅ Corrected: Reset batchRanges with an array of objects, not numbers
    setBatchRanges([
      { start: 1, end: 1, size: 0, price: 0, unit: "sq. ft" }
    ]);

    setIsModalVisibles(false);

    console.log("plots", plots);
  };

  const handleRangeChange = (index, field, value) => {
    const newBatchRanges = [...batchRanges];

    // Ensure it's modifying an object, not a number
    if (typeof newBatchRanges[index] !== "object") {
      newBatchRanges[index] = { start: 1, end: 1, size: 0, price: 0, unit: "sq. ft" };
    }

    newBatchRanges[index][field] = value;
    setBatchRanges(newBatchRanges);
    console.log(newBatchRanges);
  };

  const handleAddCustomPlot = () => {
    setPlots([
      ...plots,
      { plotNumber: "", size: "", unit: "sq. ft", price: "" }, // Add new empty plot
    ]);
  };
  const columns = [
    {
      title: "Plot Number",
      dataIndex: "plotNumber",
      key: "plotNumber",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          value={record.plotNumber}
          onChange={(value) => handlePlotChange(index, "plotNumber", value)}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          width: "20%",
        },
      }),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
      render: (_, record, index) => (
        <>
          <InputNumber
            value={record.size}
            onChange={(value) => handlePlotChange(index, "size", value)}
            style={{ width: "40%" }}
          />
          <Select
            value={record.unit}
            onChange={(value) => handlePlotChange(index, "unit", value)}
            style={{ width: "55%", marginLeft: "5px" }}
          >
            {landMeasurementOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </>
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          width: "30%",
        },
      }),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          value={record.price}
          onChange={(value) => handlePlotChange(index, "price", value)}
          style={{ width: "50%" }}
        />
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#0D416B",
          color: "white",
          fontWeight: "bold",
          width: "30%",
        },
      }),
    },
  ];

  //  End.........

  const confirm = () => {
    setIsCurrentLocation(true);
    setIsModalVisible(true);
  };

  const cancel = () => {
    setIsCurrentLocation(false);
    setIsModalVisible(true);
  };
  //  getting role from the localstorage
  const [userRole, setUserRole] = useState(null);
  const [videoUrl, setvideoUrl] = useState(null);
  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file) {
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        setIsUploading(true);
        setUploadProgress(0);

        const url = await Upload(
          file,
          (progress) => {
            setUploadProgress(progress);
          },
          "image"
        );

        console.log(url);
        setImageUrls((prevUrls) => [...prevUrls, url]);
        setIsUploading(false);
      } else if (fileType.startsWith("video/")) {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 10) {
          message.error(
            "Video size exceeds the 10MB limit. Please upload a smaller file."
          );
          return;
        }
        setIsUploading(true);
        setUploadProgress(0);

        const url = await Upload(
          file,
          (progress) => {
            setUploadProgress(progress);
          },
          "video"
        );

        console.log(url);
        setvideoUrl(url);
        setIsUploading(false);
      } else {
        console.log("Uploaded file is neither an image nor a video.");
      }
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

  const deletingVideo = () => {
    console.log("dhdh");
    setvideoUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(parseInt(role, 10)); // Convert to number if stored as a string
    }
  }, []);

  const [agentEmails, setAgentEmails] = useState([]);
  const csrId = localStorage.getItem("userId");
  const fetchAgentEmails = async () => {
    try {
      const response = await _get(`/csr/getAssignedAgents/${csrId}`);
      console.log("Agent Emails:", response.data);
      setAgentEmails(response.data || []);
    } catch (error) {
      console.error("Error fetching agent emails:", error);
    }
  };
  const updateCoordinates = (lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  };

  useEffect(() => {
    fetchAgentEmails();
  }, []);

  //  for map...

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [latitude, setLatitude] = useState(""); // State for Latitude
  const [longitude, setLongitude] = useState(""); // State for Longitude
  const [selectedLocation, setSelectedLocation] = useState([20.5937, 78.9629]); // Default Location for Marker

  const [priceunit, setPriceUnit] = useState("sq. ft");
  const [loading, setLoading] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    country: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });

  const [imageUrls, setImageUrls] = useState([]);

  const showMapModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLatitudeChange = (e) => {
    setLatitude(e.target.value);
    if (e.target.value && longitude) {
      setSelectedLocation([e.target.value, longitude]);
    }
  };

  const handleLandMark = (e) => {
    setlandMark(e.target.value); // Update state on input change
  };

  const handleLongitudeChange = (e) => {
    setLongitude(e.target.value);
    if (latitude && e.target.value) {
      setSelectedLocation([latitude, e.target.value]);
    }
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

  const formatNumberWithCommas = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  const onFormVariantChange = ({ variant }) => {
    setComponentVariant(variant);
  };
  const handlePriceUnitChange = (value) => {
    setPriceUnit(value);
  };
  const handleSizeChange = (data) => {
    setLandMeasure(form.getFieldValue("size"));
    console.log(form.getFieldValue("size"));

    const conversionFactors = {
      acres: 43560, // 1 acre = 43,560 square feet
      "sq. ft": 1, // 1 square foot = 1 square foot
      "sq.yards": 9, // 1 square yard = 9 square feet
      "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
      cents: 435.6, // 1 cent = 435.6 square feet
    };

    if (type == "sq.ft") {
      settotalInAcres(price * landmeasure);
    } else {
      settotalInAcres(
        (form.getFieldValue("size") *
          form.getFieldValue("plotPrice") *
          conversionFactors[form.getFieldValue("landsizeunit")]) /
        form.getFieldValue("size")
      );
    }
  };
  const handlePriceChange = (data) => {
    const conversionFactors = {
      acres: 43560, // 1 acre = 43,560 square feet
      "sq. ft": 1, // 1 square foot = 1 square foot
      "sq.yards": 9, // 1 square yard = 9 square feet
      "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
      cents: 435.6, // 1 cent = 435.6 square feet
    };
    console.log(conversionFactors[unit]);
    console.log(conversionFactors[priceunit]);
    // setPricePerAcre(data);
    setPrice(form.getFieldValue("plotPrice"));

    if (type == "acres") {
      settotalInAcres(price * landmeasure);
    } else {
      settotalInAcres(
        (form.getFieldValue("size") *
          form.getFieldValue("plotPrice") *
          conversionFactors[form.getFieldValue("landsizeunit")]) /
        form.getFieldValue("size")
      );
    }
  };

  const calculateTotalAmount = (amount, time) => {
    return Math.round(amount * time);
  };

  const handleUnitChange = (value) => {
    console.log("hiiii");
    console.log(form.getFieldValue("landsizeunit"));

    setType(form.getFieldValue("landsizeunit"));

    setUnit(value); // Update unit based on selected value
    const conversionFactors = {
      acres: 43560, // 1 acre = 43,560 square feet
      "sq. ft": 1, // 1 square foot = 1 square foot
      "sq.yards": 9, // 1 square yard = 9 square feet
      "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
      cents: 435.6, // 1 cent = 435.6 square feet
    };
    console.log(conversionFactors[value]);
    if (type == "sq. ft") {
      settotalInAcres(price * landmeasure);
    } else {
      if (price && type && landmeasure)
        settotalInAcres(
          (form.getFieldValue("size") *
            form.getFieldValue("plotPrice") *
            conversionFactors[form.getFieldValue("landsizeunit")]) /
          form.getFieldValue("size")
        );
    }

    console.log(totalinacres);
  };

  const handleImageUpload = async (event) => {
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
  const handleDistrictChange = async (value) => {
    form.setFields([{ name: "district", errors: [] }]);
    form.setFields([{ name: "mandal", errors: [] }]);
    form.setFields([{ name: "village", errors: [] }]);
    setAddressDetails((prev) => ({ ...prev, district: value }));
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
    setAddressDetails((prev) => ({ ...prev, mandal: value }));

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

  const handlePincodeChange1 = () => {
    setHasPincode(!hasPincode);
    setPincode(null);
    setAddressDetails({
      district: "",
      mandal: "",
      village: "",
    });
    setMandals([]);
    setVillages([]);
  };

  const handlePincodeChange = async (e) => {
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
    addressDetails.pincode = pincodeValue;
    if (pincodeValue.length === 6) {
      try {
        const response = await _get(
          `/location/getlocationbypincode/${pincodeValue}/@/@`
        );
        const districtList = response.data.districts;
        const mandalList = response.data.mandals || [];

        let mandalValue;
        if (mandalList.length === 1) {
          mandalValue = mandalList[0];
        } else {
          mandalValue = mandalList.length > 1 ? mandalList[0] : [];
        }

        setAddressDetails({
          district: districtList,
          mandal: mandalValue,
        });

        setMandals(mandalList);
        const response1 = await _get(
          `/location/getlocationbypincode/${pincodeValue}/${districtList[0]}/${mandalList[0]}`
        );
        const villageList = response1.data.villages || [];
        setAddressDetails((prev) => ({
          ...prev,
          village: villageList[0] || villages[0],
        }));
        setVillages(villageList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handlevillageChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, village: value }));
  };
  const conversionFactors = {
    acres: 43560, // 1 acre = 43,560 square feet
    "sq. ft": 1, // 1 square foot = 1 square foot
    "sq.yards": 9, // 1 square yard = 9 square feet
    "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
    cents: 435.6, // 1 cent = 435.6 square feet
  };

  const panelKeys = {
    userId: "agentDetails",
    ownerName: "ownerDetails",
    ownerContact: "ownerDetails",
    layoutTitle: "landDetails",
    availablePlots: "landDetails",
    plotCount: "landDetails",
    plotPrice: "landDetails",

    plotSize: "landDetails",
    district: "Address",
    mandal: "Address",
    village: "Address",
    landMark: "Address",
  };
  const validateFieldsManually = (values) => {
    const errors = {};
    if (!values.ownerName) {
      errors.ownerName = "Owner name is required";
    }
    if (!values.ownerContact) {
      errors.ownerContact = "Phone number is required";
    }
    if (!values.layoutTitle) {
      errors.layoutTitle = "Layout Title is required";
    }
    if (!values.availablePlots) {
      errors.availablePlots = "Available Plots is required";
    }
    if (!values.plotCount) {
      errors.plotCount = "Plot Count is required";
    }
    if (!values.plotPrice) {
      errors.plotPrice = "Plot Price is required";
    }

    if (!values.plotSize) {
      errors.plotSize = "Plot Size  is required";
    }

    if (!values.district && !addressDetails.district)
      errors.district = "District is required";
    if (!values.mandal && !addressDetails.mandal)
      errors.mandal = "Mandal is required";
    if (!values.village && !addressDetails.village)
      errors.village = "Village is required";
    return errors;
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
      setActiveTab([...panelsWithErrors]);
      setHasErrors(true);
    }

    // Only continue if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      console.log("hello");

      //  agentsdetails...

      const agentDetails = {
        userId: values.userId,
      };

      const ownerDetails = {
        ownerName: values.ownerName.replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ),
        ownerContact: values.ownerContact,
        ownerEmail: values.ownerEmail === undefined ? "" : values.ownerEmail,
      };
      console.log(conversionFactors[values.landsizeunit]);
      console.log(values.plotSize);

      // let layoutDetails = {
      //   reraRegistered: values.reraRegistered || false,
      //   dtcpApproved: values.dtcpApproved || false,
      //   tlpApproved: values.tlpApproved || false,
      //   flpApproved: values.flpApproved || false,
      //   layoutTitle: values.layoutTitle,
      //   description: values.description === undefined ? "" : values.description,
      //   plotCount: values.plotCount,
      //   availablePlots: values.availablePlots,
      //   plotSize: values.plotSize * conversionFactors[values.landsizeunit],
      //   sizeUnit: values.landsizeunit || "sq. ft",
      //   priceUnit: values.pricesizeunit || "sq. ft",
      //   plotPrice: values.plotPrice / conversionFactors[values.landsizeunit],

      //   totalAmount: Math.ceil(
      //     (form.getFieldValue("plotSize") *
      //       conversionFactors[unit] *
      //       form.getFieldValue("plotPrice")) /
      //       conversionFactors[priceunit]
      //   ),
      //   address: {
      //     country: "India",
      //     state: "Andhra Pradesh",

      //     pinCode: pincode === "" ? "000000" : pincode,
      //     district: addressDetails.district[0],
      //     mandal: addressDetails.mandal,
      //     village: addressDetails.village,
      //     latitude: latitude ? latitude.toString() : "", // Convert to string
      //     longitude: longitude ? longitude.toString() : "", // Convert to string
      //     landMark: landMark?.toString() || "",
      //   },
      //   description: values.description,
      // };





      //  new code .....


      let layoutDetails = {
        reraRegistered: values.reraRegistered || false,
        dtcpApproved: values.dtcpApproved || false,
        tlpApproved: values.tlpApproved || false,
        flpApproved: values.flpApproved || false,
        layoutTitle: values.layoutTitle,
        description: values.description === undefined ? "" : values.description,
        plotCount: values.plotCount,
        availablePlots: values.availablePlots,
        plotSize: values.plotSize * conversionFactors[values.landsizeunit],
        sizeUnit: values.landsizeunit || "sq. ft",
        priceUnit: values.pricesizeunit || "sq. ft",
        plotPrice: values.plotPrice / conversionFactors[values.landsizeunit],

        totalAmount: Math.ceil(
          (form.getFieldValue("plotSize") *
            conversionFactors[unit] *
            form.getFieldValue("plotPrice")) /
          conversionFactors[priceunit]
        ),
        address: {
          country: "India",
          state: "Andhra Pradesh",

          pinCode: pincode === "" ? "000000" : pincode,
          district: addressDetails.district[0],
          mandal: addressDetails.mandal,
          village: addressDetails.village,
          latitude: latitude ? latitude.toString() : "",
          longitude: longitude ? longitude.toString() : "",
          landMark: landMark?.toString() || "",
        },
        description: values.description,



        plots: plots.map((plot) => ({
          plotId: plot.plotNumber,
          plotSize: plot.size,
          sizeUnit: plot.unit,
          plotAmount: plot.price,
        })),

      };

      const amenities = {
        underGroundWater:
          values.underGroundWater !== undefined
            ? values.underGroundWater
            : false,
        electricityFacility:
          values.electricityFacility !== undefined
            ? values.electricityFacility
            : false,
        distanceFromRoad: values.distanceFromRoad,
        roadType: values.roadType,
        drainageSystem:
          values.drainageSystem !== undefined ? values.drainageSystem : false,
        swimmingPool:
          values.swimmingPool !== undefined ? values.swimmingPool : false,
        gym: values.gym !== undefined ? values.gym : false,
        conventionHall:
          values.conventionHall !== undefined ? values.conventionHall : false,
        playZone: values.playZone !== undefined ? values.playZone : false,
        medical: values.medical !== null ? values.medical : 0,
        educational: values.educational !== null ? values.educational : 0,
        extraAmenities: skills,
      };

      const uploadPics = [];
      imageUrls.forEach((imageUrl) => {
        uploadPics.push(imageUrl);
      });
      const videos = [videoUrl];

      const finalObject = {
        propertyType: "Layout",
        rating: 0,
        ratingCount: 0,
        status: 0,
        ownerDetails,
        agentDetails,
        layoutDetails,
        amenities,
        uploadPics,
        videos,
      };
      setLoading(true);

      try {
        const response = await _post(
          "/layout/insert",
          finalObject,
          "Layout Added Successfully",
          "Submission Failed"
        );
        setLoading(false);
        console.log(values.userId);

        console.log(response.data);

        form.resetFields();
        setvideoUrl(null);

        if (values.userId === undefined) {
          setShowFormType(null);
        }
        localStorage.setItem("form", false);
      } catch (error) { }
    }
  };

  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const [isOwnerNameFocused, setIsOwnerNameFocused] = useState(false);
  const [isContactFocused, setIsContactFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleOwnerNameFocus = () => setIsOwnerNameFocused(true);
  const handleOwnerNameBlur = (e) => {
    if (e.target.value === "") setIsOwnerNameFocused(false);
  };

  const handleContactFocus = () => setIsContactFocused(true);
  const handleContactBlur = (e) => {
    if (e.target.value === "") setIsContactFocused(false);
  };

  const handleEmailFocus = () => setIsEmailFocused(true);
  const handleEmailBlur = (e) => {
    if (e.target.value === "") setIsEmailFocused(false);
  };
  const [form] = Form.useForm();
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleBackToCustomers = () => {
    setShowFormType(null); // Hide form and show cards
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
  const handlePanelChange = (key) => {
    setActiveTab(key);
    if (isFirstInteraction) {
      setIsFirstInteraction(false);
    }
  };

  return (
    <Form
      name="layoutDetails"
      // onFinish={onFinish}
      form={form}
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
        landsizeunit: "sq. ft",
        state: "Andhra Pradesh",
        country: "India",
        landsizeunit: "sq. ft",
        pricesizeunit: "sq. ft",
      }}
    >
      {screens.xs ? (
        <h2 className="custom-container" style={{ fontSize: "20px" }}>
          {userRole === 5 && (
            <button
              onClick={handleBackToCustomers}
              style={{
                marginTop: "3px",
                fontSize: "20px",
                backgroundColor: "#0D416B",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                float: "left",
                marginBottom: "5px",
              }}
            >
              {" "}
              <FaArrowLeft style={{ marginTop: "5px" }} />
            </button>
          )}
          Layout details
        </h2>
      ) : (
        <h1 className="custom-container">
          {userRole === 5 && (
            <button
              onClick={handleBackToCustomers}
              style={{
                marginTop: "3px",
                fontSize: "20px",
                backgroundColor: "#0D416B",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                float: "left",
                marginBottom: "5px",
              }}
            >
              {" "}
              <FaArrowLeft style={{ marginTop: "5px" }} />
            </button>
          )}{" "}
          Layout details
        </h1>
      )}
      <Collapse
        // accordion={isFirstInteraction && !hasErrors}
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
        onChange={handlePanelChange}
      >
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
                    width: "100%",
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6} xl={6}>
              <Form.Item
                label="Owner Name"
                name="ownerName"
                labelCol={11}
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
                    backgroundColor: "transparent",
                    border: "1px solid lightgray",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} xl={6}>
              <Form.Item
                label="Contact No"
                name="ownerContact"
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
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgray",
                  }}
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={12}
              md={6}
              xl={6}
              style={{ marginBottom: "-10px" }}
            >
              <Form.Item
                label="Email"
                name="ownerEmail"
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
          </Row>
        </Panel>

        {/* <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Layout Details
            </span>
          }
          key="landDetails"
        >
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-25px" }}
            >
              <span style={{ marginTop: 10, }}>
                RERA Registered?{" "}
                <Tooltip
                  title={
                    <>
                      <p>
                        <strong>
                          RERA (Real Estate Regulatory Authority):
                        </strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            Property should be Registered with the State RERA
                            Authority:
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Property has a unique RERA registration number.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Property should have Approved Documentation.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            {" "}
                            Property complies with RERA regulations.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Property details are available on the state's RERA
                            portal.
                          </strong>{" "}
                        </li>
                      </ul>
                    </>
                  }
                // overlayStyle={{ maxWidth: "300px" }}
                >
                  <InfoCircleOutlined style={{ marginRight: -10 }} />
                </Tooltip>
              </span>
              <Form.Item
                style={{ marginRight: 60 }}
                name="reraRegistered"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 20 }}
                  checkedChildren=""
                  unCheckedChildren=""
                  size="large"
                  defaultChecked={false}
                />

              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-25px" }}
            >
              <span style={{ marginTop: 10, }}>
                DTCP Approved?{" "}
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>
                          DTCP (Directorate of Town and Country Planning):
                        </strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            The layout is approved by the Directorate of Town
                            and Country Planning.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The land adheres to designated zoning and land use
                            regulations.:
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The layout plan should meet road, plot, and open
                            space standards.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Essential infrastructure like water, drainage, and
                            roads are should be as per DTCP guidelines.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The layout follows building regulations, including
                            FSI, setbacks, and height restrictions.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The land has a clear title and is free from legal
                            disputes
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            All necessary fees and documentation are submitted
                            to DTCP.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            {" "}
                            The approved layout is publicly notified and
                            available for verification.
                          </strong>
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginRight: "8px" }} />
                </Tooltip>
              </span>
              <Form.Item
                name="dtcpApproved"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 3 }}
                  checkedChildren=""
                  unCheckedChildren=""
                  size="large"
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-25px" }}
            >
              <span style={{ marginTop: 10, }}>
                TLP Approved?{" "}
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>TLP (Temporary Layout Permission):</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            Project has a TLP approval certificate from the town
                            planning authority.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout adheres to local zoning laws and land-use
                            regulations.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Layout includes approved infrastructure and
                            amenities.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Developer has proper legal documentation for land
                            ownership.
                          </strong>{" "}
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginRight: -10 }} />
                </Tooltip>{" "}
              </span>
              <Form.Item
                name="tlpApproved"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 24 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 20 }}
                  size="large"
                  checkedChildren=""
                  unCheckedChildren=""
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: 10, }}>
                FLP Approved?{" "}
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>FLP (Final Layout Plan):</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            Layout must be approved by local municipal or urban
                            development authorities.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout should adhere to relevant building codes and
                            safety standards.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Developer must provide official approval documents
                            and certificates.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout must align with the city or regional master
                            plan.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout requires necessary legal clearances,
                            including land title and environmental compliance.
                          </strong>
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 0 }} />
                </Tooltip>
              </span>
              <Form.Item
                style={{ marginLeft: -30 }}
                name="flpApproved"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 24 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 40 }}
                  size="large"
                  checkedChildren=""
                  unCheckedChildren=""
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40, }}
                label="Layout Title"
                name="layoutTitle"
                rules={[
                  {
                    required: true,
                    message: "Please provide any title!",
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message:
                      "Layout Title can only contain letters and spaces!",
                  },
                  {
                    max: 32,
                    message: "Layout Title cannot exceed 32 characters!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Layout Title"
                  style={{
                    width: "80%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40, }}
                label="Total Number of Plots"
                name="plotCount"
                labelCol={{ xl: { span: 13 }, xs: { span: 11 } }}
                rules={[
                  {
                    required: true,
                    message: "Please provide capability!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="number of plots"
                  min={1}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40 }}
                label="Available Plots"
                name="availablePlots"
                labelCol={{ xl: { span: 10 }, xs: { span: 11 } }}
                rules={[
                  {
                    required: true,
                    message: "Please provide available plots count!",
                  },
                  {
                    validator: (_, value) => {
                      const plotCount = form.getFieldValue("plotCount");
                      if (value > plotCount) {
                        return Promise.reject(
                          new Error("Available plots cannot exceed total plots!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="available plots"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>


            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40 }}

                label={
                  <>
                    <span style={{ color: "red", marginRight: 5 }}>*</span>
                    Plot Size
                    <Tooltip
                      placement="rightTop"
                      title={
                        <div>
                          <p>
                            <strong>
                              Enter the plot size in your chosen unit.
                            </strong>
                          </p>
                          <p>
                            <strong>1 acre = 43,560 square feet.</strong>
                          </p>
                        </div>
                      }
                    >
                      <InfoCircleOutlined style={{ marginLeft: 2 }} />
                    </Tooltip>
                  </>
                }
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 12 } }}
                rules={[{ required: true, message: "Please enter plot size!" }]}
              >
                <Input.Group compact>
                  <Form.Item name="plotSize" noStyle>
                    <InputNumber
                      step={0.1}
                      min={0}
                      placeholder="Enter size"
                      style={{ width: "55%" }}
                      value={amount}
                      onChange={handleSizeChange}
                    />
                  </Form.Item>
                  <Form.Item name="landsizeunit" noStyle>
                    <Select
                      style={{ width: "45%" }}
                      onChange={handleUnitChange}
                    >
                      <Option value="acres">acre</Option>
                      <Option value="sq. ft">sq. ft</Option>
                      <Option value="sq.yards">sq.yards</Option>
                      <Option value="sq.m">sq.m</Option>
                      <Option value="cents">cents</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>



            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item
                wrapperCol={{ xs: { span: 24 } }}
              >
                <Input.Group compact>

                  <Form.Item
                    label="Price"
                    name="plotPrice"
                    wrapperCol={{ xs: { span: 24 } }}
                    rules={[
                      { required: true, message: "Please enter price" },
                      {
                        type: "number",
                        min: 0,
                      },
                    ]}
                  >
                    <InputNumber
                      step={0.1}
                      placeholder="per sq. ft"
                      onKeyPress={(event) => { }}
                      onChange={(value) => {
                        if (value < 0) {
                          value = 0;
                        }
                        handlePriceChange(value);
                      }}
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item name="pricesizeunit" noStyle>
                    <Select
                      defaultValue="acres"
                      onChange={handlePriceUnitChange}
                    >
                      <Option value="acres">/acre</Option>
                      <Option value="sq. ft">/sq. ft</Option>
                      <Option value="sq.yards">/sq.yards</Option>
                      <Option value="sq.m">/sq.m</Option>
                      <Option value="cents">/cents</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item
                label="Total Amount"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
              >
                <>
                  ₹{" "}
                  {form.getFieldValue("plotPrice") && form.getFieldValue("plotSize")
                    ? formatPrice(
                      priceunit === unit
                        ? form.getFieldValue("plotPrice") * form.getFieldValue("plotSize")
                        : Math.ceil(
                          (form.getFieldValue("plotSize") *
                            conversionFactors[unit] *
                            form.getFieldValue("plotPrice")) /
                          conversionFactors[priceunit]
                        )
                    )
                    : "0"}
                </>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={16} lg={8} xl={11}>
              <Form.Item
                label="Layout Description"
                labelCol={{ xl: { span: 6 }, xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 24 } }}
                name="description"
              >
                <Input.TextArea
                  placeholder="Layout Description"
                  rows={2}
                  // cols={10}
                  maxLength={200}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>

          </Row>

        </Panel> */}

        {/*  start.... */}

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Layout Details
            </span>
          }
          key="landDetails"
        >
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-25px" }}
            >
              <span style={{ marginTop: 10 }}>
                RERA Registered?{" "}
                <Tooltip
                  title={
                    <>
                      <p>
                        <strong>
                          RERA (Real Estate Regulatory Authority):
                        </strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            Property should be Registered with the State RERA
                            Authority:
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Property has a unique RERA registration number.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Property should have Approved Documentation.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            {" "}
                            Property complies with RERA regulations.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Property details are available on the state's RERA
                            portal.
                          </strong>{" "}
                        </li>
                      </ul>
                    </>
                  }
                // overlayStyle={{ maxWidth: "300px" }}
                >
                  <InfoCircleOutlined style={{ marginRight: -10 }} />
                </Tooltip>
              </span>
              <Form.Item
                style={{ marginRight: 60 }}
                name="reraRegistered"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 20 }}
                  checkedChildren=""
                  unCheckedChildren=""
                  size="large"
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-25px" }}
            >
              <span style={{ marginTop: 10 }}>
                DTCP Approved?{" "}
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>
                          DTCP (Directorate of Town and Country Planning):
                        </strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            The layout is approved by the Directorate of Town
                            and Country Planning.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The land adheres to designated zoning and land use
                            regulations.:
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The layout plan should meet road, plot, and open
                            space standards.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Essential infrastructure like water, drainage, and
                            roads are should be as per DTCP guidelines.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The layout follows building regulations, including
                            FSI, setbacks, and height restrictions.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            The land has a clear title and is free from legal
                            disputes
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            All necessary fees and documentation are submitted
                            to DTCP.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            {" "}
                            The approved layout is publicly notified and
                            available for verification.
                          </strong>
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginRight: "8px" }} />
                </Tooltip>
              </span>
              <Form.Item
                name="dtcpApproved"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 3 }}
                  checkedChildren=""
                  unCheckedChildren=""
                  size="large"
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-25px" }}
            >
              <span style={{ marginTop: 10 }}>
                TLP Approved?{" "}
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>TLP (Temporary Layout Permission):</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            Project has a TLP approval certificate from the town
                            planning authority.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout adheres to local zoning laws and land-use
                            regulations.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Layout includes approved infrastructure and
                            amenities.
                          </strong>{" "}
                        </li>
                        <li>
                          <strong>
                            Developer has proper legal documentation for land
                            ownership.
                          </strong>{" "}
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginRight: -10 }} />
                </Tooltip>{" "}
              </span>
              <Form.Item
                name="tlpApproved"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 24 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 20 }}
                  size="large"
                  checkedChildren=""
                  unCheckedChildren=""
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={12}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: 10 }}>
                FLP Approved?{" "}
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>FLP (Final Layout Plan):</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>
                            Layout must be approved by local municipal or urban
                            development authorities.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout should adhere to relevant building codes and
                            safety standards.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Developer must provide official approval documents
                            and certificates.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout must align with the city or regional master
                            plan.
                          </strong>
                        </li>
                        <li>
                          <strong>
                            Layout requires necessary legal clearances,
                            including land title and environmental compliance.
                          </strong>
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 0 }} />
                </Tooltip>
              </span>
              <Form.Item
                style={{ marginLeft: -30 }}
                name="flpApproved"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 24 }}
                valuePropName="checked"
              >
                <Switch
                  style={{ marginTop: 10, marginLeft: 40 }}
                  size="large"
                  checkedChildren=""
                  unCheckedChildren=""
                  defaultChecked={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40 }}
                label="Layout Title"
                name="layoutTitle"
                rules={[
                  {
                    required: true,
                    message: "Please provide any title!",
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message:
                      "Layout Title can only contain letters and spaces!",
                  },
                  {
                    max: 32,
                    message: "Layout Title cannot exceed 32 characters!",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Layout Title"
                  style={{
                    width: "80%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40 }}
                label="Total Number of Plots"
                name="plotCount"
                labelCol={{ xl: { span: 13 }, xs: { span: 11 } }}
                rules={[
                  {
                    required: true,
                    message: "Please provide capability!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="number of plots"
                  min={1}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40 }}
                label="Available Plots"
                name="availablePlots"
                labelCol={{ xl: { span: 10 }, xs: { span: 11 } }}
                rules={[
                  {
                    required: true,
                    message: "Please provide available plots count!",
                  },
                  {
                    validator: (_, value) => {
                      const plotCount = form.getFieldValue("plotCount");
                      if (value > plotCount) {
                        return Promise.reject(
                          new Error(
                            "Available plots cannot exceed total plots!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="available plots"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item
                style={{ marginTop: 40 }}
                label={
                  <>
                    <span style={{ color: "red", marginRight: 5 }}>*</span>
                    Total Layout Size:
                    <Tooltip
                      placement="rightTop"
                      title={
                        <div>
                          <p>
                            <strong>
                              Enter the Layout size in your chosen unit.
                            </strong>
                          </p>
                          <p>
                            <strong>1 acre = 43,560 square feet.</strong>
                          </p>
                        </div>
                      }
                    >
                      <InfoCircleOutlined style={{ marginLeft: 2 }} />
                    </Tooltip>
                  </>
                }
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 12 } }}
                rules={[{ required: true, message: "Please enter plot size!" }]}
              >
                <Input.Group compact>
                  <Form.Item name="plotSize" noStyle>
                    <InputNumber
                      step={0.1}
                      min={0}
                      placeholder="Enter size"
                      style={{ width: "55%" }}
                      value={amount}
                      onChange={handleSizeChange}
                    />
                  </Form.Item>
                  <Form.Item name="landsizeunit" noStyle>
                    <Select
                      style={{ width: "45%" }}
                      onChange={handleUnitChange}
                    >
                      <Option value="acres">acre</Option>
                      <Option value="sq. ft">sq. ft</Option>
                      <Option value="sq.yards">sq.yards</Option>
                      <Option value="sq.m">sq.m</Option>
                      <Option value="cents">cents</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item wrapperCol={{ xs: { span: 24 } }}>
                <Input.Group compact>
                  <Form.Item
                    label="Total Layout Price"
                    name="plotPrice"
                    wrapperCol={{ xs: { span: 24 } }}
                    rules={[
                      { required: true, message: "Please enter price" },
                      {
                        type: "number",
                        min: 0,
                      },
                    ]}
                  >
                    <InputNumber
                      step={0.1}
                      placeholder="per sq. ft"
                      onKeyPress={(event) => { }}
                      onChange={(value) => {
                        if (value < 0) {
                          value = 0;
                        }
                        handlePriceChange(value);
                      }}
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item name="pricesizeunit" noStyle>
                    <Select
                      defaultValue="acres"
                      onChange={handlePriceUnitChange}
                    >
                      <Option value="acres">/acre</Option>
                      <Option value="sq. ft">/sq. ft</Option>
                      <Option value="sq.yards">/sq.yards</Option>
                      <Option value="sq.m">/sq.m</Option>
                      <Option value="cents">/cents</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Form.Item
                label="Total Amount"
                labelCol={{ xs: { span: 8 } }}
                wrapperCol={{ xs: { span: 24 } }}
              >
                <>
                  ₹{" "}
                  {form.getFieldValue("plotPrice") &&
                    form.getFieldValue("plotSize")
                    ? formatPrice(
                      priceunit === unit
                        ? form.getFieldValue("plotPrice") *
                        form.getFieldValue("plotSize")
                        : Math.ceil(
                          (form.getFieldValue("plotSize") *
                            conversionFactors[unit] *
                            form.getFieldValue("plotPrice")) /
                          conversionFactors[priceunit]
                        )
                    )
                    : "0"}
                </>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={16} lg={8} xl={11}>
              <Form.Item
                label="Layout Description"
                labelCol={{ xl: { span: 6 }, xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 24 } }}
                name="description"
              >
                <Input.TextArea
                  placeholder="Layout Description"
                  rows={2}
                  // cols={10}
                  maxLength={200}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={[16, 16]}> */}
          {/* <Col xs={24} sm={12} md={8} lg={6} xl={6}> */}
          <Form layout="vertical">
            <Form.Item>
              <Button
                style={{
                  backgroundColor: "#0d416b",
                  color: "white",
                }}
                onClick={() => setIsModalVisibles(true)}
              >
                + Add Plots
              </Button>
            </Form.Item>

            {/* Modal for Bulk Input */}
            <Modal
              title={
                <span
                  style={{
                    color: "#0d416b",
                    fontWeight: "bold",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Add Plots
                </span>
              }
              visible={isModalVisibles}
              onOk={handleBatchAdd1}
              onCancel={() => setIsModalVisibles(false)}
              okText="Add Plots"
              cancelText="Cancel"
              okButtonProps={{
                style: {
                  backgroundColor: "#0D416B",
                  color: "white",
                  border: "none",
                },
              }}
              cancelButtonProps={{
                style: {
                  backgroundColor: "white",
                  color: "#0D416B",
                  border: "1px solid #0D416B",
                },
              }}
              width={700}
            >
              <Form layout="vertical">
                <Collapse defaultActiveKey={['1']}>
               
                    <Collapse.Panel
                      header="Add Range of Plots"
                      key="1"
                     
                      
                    >

<Button
                          type="dashed"
                          onClick={handleBatchAdd}
                          style={{
                            backgroundColor: "white",
                            color: "black",
                            border: "2px solid black",
                            fontSize: "12px",
                          marginLeft:"75%",
                          }}
                        >
                          + Add New Range
                        </Button>
                      <div>
                        {batchRanges.map((range, index) => (
                          <div key={index} style={{ marginBottom: "20px" }}>
                            <Row gutter={[16, 16]}>
                              <Col span={8}>
                                <Form.Item label={<strong>Range of Plot Numbers</strong>}>
                                  <InputNumber
                                    min={1}
                                    placeholder="Start"
                                    value={range.start}
                                    onChange={(value) => handleRangeChange(index, "start", value)}
                                    style={{ width: "20%" }}
                                  />
                                  {" - "}
                                  <InputNumber
                                    min={1}
                                    placeholder="End"
                                    value={range.end}
                                    onChange={(value) => handleRangeChange(index, "end", value)}
                                    style={{ width: "20%" }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item label={<strong>Size</strong>}>
                                  <InputNumber
                                    min={1}
                                    placeholder="Enter size"
                                    value={range.size}
                                    onChange={(value) => handleRangeChange(index, "size", value)}
                                    style={{ width: "50%" }}
                                  />
                                  <Select
                                    value={range.unit}
                                    onChange={(value) => handleRangeChange(index, "unit", value)}
                                    style={{ width: "50%" }}
                                  >
                                    {landMeasurementOptions.map((option) => (
                                      <Select.Option key={option} value={option}>
                                        {option}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item label={<strong>Price</strong>}>
                                  <InputNumber
                                    min={1}
                                    placeholder="Enter price"
                                    value={range.price}
                                    onChange={(value) => handleRangeChange(index, "price", value)}
                                    style={{ width: "43%" }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                    </Collapse.Panel>



                    {/* Panel for Adding Individual Plots */}
                    <Collapse.Panel
                     header="Add Individual Plot"
                     key="2"
                     
                    >
                  
                        <Button
                              type="dashed"
                              onClick={handleAddCustomPlot}
                              style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "2px solid black",
                                marginBottom:"2%",
                                float:"right"
                              }}
                            >
                              + Add a New Plot
                            </Button>
                      
                      <Table
                        columns={[
                          {
                            title: "Plot Number",
                            dataIndex: "plotNumber",
                            render: (text, record, index) => (
                              <InputNumber
                                value={record.plotNumber}
                                key={`plotNumber-${index}`}
                                onChange={(value) => handlePlotChange(index, "plotNumber", value)}
                              // onBlur={() => forceUpdate()}
                              />
                            ),
                            onHeaderCell: () => ({
                              style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
                            }),
                          },
                          {
                            title: "Size",
                            dataIndex: "size",
                            render: (text, record, index) => (

                              <InputNumber
                                value={record.size}
                                key={`size-${index}`}
                                onChange={(value) => handlePlotChange(index, "size", value)}
                              />
                            ),
                            onHeaderCell: () => ({
                              style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
                            }),
                          },
                          {
                            title: "Unit",
                            dataIndex: "unit",
                            render: (text, record, index) => (
                              <Select
                                value={record.unit}
                                key={`unit-${index}`}
                                onChange={(value) => handlePlotChange(index, "unit", value)}
                              >
                                {landMeasurementOptions.map((option) => (
                                  <Select.Option key={option} value={option}>
                                    {option}
                                  </Select.Option>
                                ))}
                              </Select>
                            ),
                            onHeaderCell: () => ({
                              style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
                            }),
                          },
                          {
                            title: "Price",
                            dataIndex: "price",
                            render: (text, record, index) => (
                              <InputNumber
                                value={record.price}
                                key={`price-${index}`}
                                onChange={(value) => handlePlotChange(index, "price", value)}
                              />
                            ),
                            onHeaderCell: () => ({
                              style: { backgroundColor: "#0D416B", color: "white", fontWeight: "bold" },
                            }),
                          },
                        ]}


                        dataSource={plots}
                        rowKey={(record) => `${record.plotNumber}-${Math.random()}`}
                        pagination={false}
                        scroll={{ y: 300 }} // Add vertical scroll with a height of 300px
                        footer={() => (
                          <div
                            style={{
                              textAlign: "right", // Align the button to the right
                              marginTop: "10px", // Add some space from the table
                            }}
                          >
                            
                          </div>
                        )}
                      />
                    </Collapse.Panel>
                  </Collapse>

                  {/* Form to add Size and Price for batch */}

              </Form>


            </Modal>

          </Form>





          {/* </Col> */}
          {/* </Row> */}
        </Panel>

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>Location</span>
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
                    message:
                      "Please enter a valid landmark with only letters and spaces.",
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
                    <span style={{ color: "red" }}>*</span> Choose Location:
                  </>
                }
                style={{ marginBottom: "40px" }}
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
                  <EnvironmentOutlined
                    style={{
                      fontSize: "24px",
                      color: "#0D416B",
                      marginRight: "50px",
                    }}
                  />
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
                width="60%" // Adjust modal width
                bodyStyle={{ padding: 0 }} // Remove any padding inside the modal body
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px", // Set a specific height for the container
                  }}
                >
                  <MapContainer
                    center={[latitude || 20.5937, longitude || 78.9629]}
                    zoom={5}
                    style={{
                      width: "100%",
                      height: "100%", // Make sure the map fills the container
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
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              sm={10}
              lg={6}
              md={8}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Underground Water
                <Tooltip
                  placement="rightTop"
                  title={
                    <>
                      <p>
                        <strong>
                          Toggle this if Your property have any of these
                          Underground Facilities for Layout Properties
                        </strong>
                      </p>
                      <ul>
                        <li>
                          <strong>Water Supply Lines</strong>{" "}
                        </li>
                        <li>
                          <strong>Sewage and Drainage Systems</strong>{" "}
                        </li>
                        <li>
                          <strong>Electricity Cables</strong>
                        </li>
                        <li>
                          <strong>Gas Pipelines</strong>{" "}
                        </li>
                        <li>
                          <strong>Fiber Optic Cables</strong>{" "}
                        </li>
                        <li>
                          <strong>Irrigation Systems</strong>{" "}
                        </li>
                        <li>
                          <strong>Stormwater Management</strong>{" "}
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
              <Form.Item name="underGroundWater" valuePropName="checked">
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={10}
              lg={6}
              md={8}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Drainage System
                <Tooltip
                  placement="rightBottom"
                  title={
                    <>
                      <p>
                        <strong>
                          Toggle this if your property have any of these
                          Drainage Facilities.
                        </strong>
                      </p>
                      <ul>
                        <li>
                          <strong>Stormwater Drains</strong>
                        </li>
                        <li>
                          <strong>Surface Drains</strong>
                        </li>
                        <li>
                          <strong>Soak Pits</strong>
                        </li>
                        <li>
                          <strong>French Drains</strong>
                        </li>
                        <li>
                          <strong>Retention Ponds</strong>
                        </li>
                      </ul>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
              <Form.Item name="drainageSystem" valuePropName="checked">
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>

            <Col
              xs={12}
              sm={10}
              lg={6}
              md={8}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Swimming Pool
                <Tooltip
                  title={
                    <>
                      <p>
                        <strong>
                          Toggle Yes if there is swimmingPool in your layout.
                        </strong>
                      </p>
                      <p>
                        <strong>Other wise Ignore</strong>
                      </p>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
              <Form.Item name="swimmingPool" valuePropName="checked">
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              lg={8}
              sm={12}
              md={12}
              xl={6}
              style={{ marginLeft: "-3%" }}
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
                            <strong>
                              Choose the type of electricity supply available
                              for the property:
                            </strong>
                          </p>
                          <ul>
                            <li>
                              <strong>Domestic:</strong> Electricity used for
                              household purposes such as lighting, heating, and
                              appliances.
                            </li>
                            <li>
                              <strong>Industrial:</strong> High voltage
                              electricity typically used in factories or
                              manufacturing units for heavy machinery.
                            </li>
                            <li>
                              <strong>Commercial:</strong> Electricity used in
                              business establishments such as offices, shops,
                              and malls.
                            </li>
                            <li>
                              <strong>Residential:</strong> Electricity supplied
                              to residential complexes or multi-family housing
                              units.
                            </li>
                            <li>
                              <strong>None:</strong> Indicates that no
                              electricity supply is available for the property.
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
                  {
                    required: true,
                    message: "Please select a Electricity type!",
                  },
                ]}
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
              xs={12}
              sm={8}
              lg={6}
              md={8}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Play Zone
                <Tooltip
                  placement="rightBottom"
                  // overlayStyle={{ maxWidth: "500px" }}
                  title={
                    <>
                      <p>
                        <strong>
                          Toggle yes if there is playzone in your layout.
                        </strong>
                      </p>
                      <p>
                        <strong>Other wise Ignore</strong>
                      </p>
                    </>
                  }
                >
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </span>
              <Form.Item name="playZone" valuePropName="checked">
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>
            <Col
              xs={8}
              sm={8}
              lg={6}
              md={8}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Gym{" "}
                <Tooltip title="Toggle yes if there is playzone in your layout.">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
              <Form.Item name="gym" valuePropName="checked">
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>
            <Col
              xs={16}
              sm={8}
              lg={6}
              md={8}
              xl={6}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Convention Hall{" "}
                <Tooltip title="Toggle yes if there a Space for Hosting events, meetings, and community gatherings within the layout.">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
              <Form.Item name="conventionHall" valuePropName="checked">
                <Switch defaultChecked={false} size="large" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              lg={8}
              sm={12}
              md={12}
              xl={6}
              style={{ marginLeft: "-2%" }}
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
                  sm: { span: 12 },
                  xl: { span: 14 },
                  lg: { span: 8 },
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
                  <Option value="rnb">R&B</Option>
                  <Option value="highway">Highway</Option>
                  <Option value="panchayat">Panchayat</Option>
                  <Option value="village">Village</Option>
                  <Option value="none">None</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              xl={9}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Nearby Medical Facility:
                <Tooltip title="Please specify the distance to the nearest Medical facility in kilometers.">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
              <Form.Item name="medical">
                <Input
                  type="number"
                  min={1}
                  placeholder=""
                  style={{
                    width: "70%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
                <span style={{ marginLeft: 5, fontSize: 16 }}>km</span>
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={12}
              xl={10}
              style={{ display: "flex", marginBottom: "-20px" }}
            >
              <span style={{ marginTop: "5px", marginRight: "6px" }}>
                Nearby Educational Institution:
                <Tooltip title="Please specify the distance to the nearest educational facility in kilometers.">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
              <Form.Item name="educational">
                <Input
                  type="number"
                  min={1}
                  placeholder=""
                  style={{
                    width: "70%",
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
                <span style={{ marginLeft: 5, fontSize: 16 }}>km</span>
              </Form.Item>
            </Col>

            <Col
              xs={24}
              lg={6}
              sm={12}
              md={12}
              xl={5}
              style={{ marginLeft: "-5%" }}
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
                  xl: { span: 12 },
                  lg: { span: 18 },
                }}
                wrapperCol={{
                  xs: { span: 8 },
                  sm: { span: 24 },
                  xl: { span: 24 },
                  lg: { span: 24 },
                }}
                className="road"
              >
                <Input
                  type="number"
                  placeholder="Enter distance in Kms"
                  addonAfter="/km"
                  style={{ marginLeft: "2%" }}
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={23}
              xl={24}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                marginTop: "15px",
              }}
            >
              {/* Input Field for Extra Amenities */}
              <div
                style={{
                  display: "flex",
                  marginBottom: "10px", // Add space between input and tags
                }}
              >
                <span style={{ marginRight: "5px" }}>Add Extra Amenities:</span>
                <Input.TextArea
                  rows={2}
                  type="text"
                  name="extraAmenities"
                  placeholder="Add Extra Amenities"
                  value={inputValue}
                  onChange={handleInputChange}
                  onPressEnter={handleInputConfirm}
                  width="75%"
                />
              </div>

              <div style={{ marginTop: "auto" }}>
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
              </div>
            </Col>
          </Row>
        </Panel>

        {/*  new upload code */}

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
      <div
        style={{
          marginTop: "2%",
          display: "flex",
          gap: "20px",
          float: "right",
          marginRight: "120px",
        }}
      >
        <div>
          <Form.Item>
            <Button
              onClick={onFinish}
              style={{
                backgroundColor: "#0D416B",
                color: "white",
                marginLeft: "20%",
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
                backgroundColor: "lightgray",
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

export default LayoutForm;

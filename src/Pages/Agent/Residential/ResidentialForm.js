import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Collapse, Grid, Table } from "antd";

import Upload from "../Upload";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import OwnerDetails from "./OwnerDetails";

import UploadPhotos from "./UploadPhotos";


import Amenities from "./Amenities";

import { _post } from "../../../Service/apiClient";

import {
  Col,
  Input,
  Row,
  Select,
  Tooltip,
  InputNumber,
  Radio,
  Modal,
  message,
  Progress,
  Popconfirm,
} from "antd";
import { _get } from "../../../Service/apiClient";
import { InfoCircleOutlined, DeleteOutlined, EnvironmentOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import CurrentLocation from "../currentLocation";
import { FaArrowLeft } from "react-icons/fa";
import { faL } from "@fortawesome/free-solid-svg-icons";



const { Option } = Select;

const { useBreakpoint } = Grid;

const ResidentialForm = ({ setShowFormType }) => {
  const screens = useBreakpoint();
  const conversionFactors = {
    acres: 43560, // 1 acre = 43,560 square feet
    "sq. ft": 1, // 1 square foot = 1 square foot
    "sq.yards": 9, // 1 square yard = 9 square feet
    "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
    cents: 435.6, // 1 cent = 435.6 square feet
  };
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState("Flat");
  const [isModalVisibles, setIsModalVisibles] = useState(false);
  const [batchRange, setBatchRange] = useState([1, 1]);
  const [batchSize, setBatchSize] = useState(0);
  const [landUnit, setLandUnit] = useState("sq. ft");
  const [plots, setPlots] = useState([
    { plotNumber: "", size: "", unit: "sq. ft", price: "", bedroomCount: "", balconyCount: "", furnished: "", flatFacing: "",propertyLayout: ""}
  ]);
  const [ltype,setLtype]=useState("");
  
  const confirm = () => {

    setIsCurrentLocation(true);
    setIsModalVisible(true);
  };
  const landMeasurementOptions = [
 
    "sq. ft",
    "sq. yards",
    "sq. m",
 
  ];
  const columns = [
    {
      title: "Flat Number",
      dataIndex: "flatNumber",
      key: "flatNumber",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          value={record.flatNumber}
          onChange={(value) => handlePlotChange(index, "flatNumber", value)}
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
      dataIndex: "flatSize",
      key: "flatSize",
      align: "center",
      render: (_, record, index) => (
        <>
        <Row>
          <Col span={12}>
          <InputNumber
            value={record.flatSize}
            onChange={(value) => handlePlotChange(index, "flatSize", value)}
            style={{ width: "100%" }}
          /></Col>
              <Col span={12}>
          <Select
            value={record.flatSizeUnit}
            onChange={(value) => handlePlotChange(index, "flatSizeUnit", value)}
            style={{ width: "140%" }}
          >
            {landMeasurementOptions.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select></Col>
          </Row>
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
      title: "Bedroom Count",
      dataIndex: "bedroomCount",
      key: "bedroomCount",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          value={record.bedroomCount}
          onChange={(value) => handlePlotChange(index, "bedroomCount", value)}
          style={{ width: "100%" }}
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
    {
      title: "Floor Number",
      dataIndex: "floorNumber",
      key: "floorNumber",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          value={record.floorNumber}
          onChange={(value) => handlePlotChange(index, "floorNumber", value)}
          style={{ width: "100%" }}
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
    {
      title: "Balcony Count",
      dataIndex: "balconyCount",
      key: "balconyCount",
      align: "center",
      render: (_, record, index) => (
        <InputNumber
          value={record.balconyCount}
          onChange={(value) => handlePlotChange(index, "balconyCount", value)}
          style={{ width: "100%" }}
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
    {
      title: "Furnitured",
      dataIndex: "furnitured",
      key: "furnitured",
      align: "center",
      render: (_, record, index) => (
        <Select
          value={record.furnitured}
          onChange={(value) => handlePlotChange(index, "furnitured", value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Yes">Yes</Select.Option>
          <Select.Option value="No">No</Select.Option>
        </Select>
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
          style={{ width: "100%" }}
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
    {
      title: "Flat Facing",
      dataIndex: "flatFacing",
      key: "flatFacing",
      align: "center",
      render: (_, record, index) => (
        <Select
          value={record.flatFacing}
          onChange={(value) => handlePlotChange(index, "flatFacing", value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="North">North</Select.Option>
          <Select.Option value="South">South</Select.Option>
          <Select.Option value="East">East</Select.Option>
          <Select.Option value="West">West</Select.Option>
        </Select>
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
      title: "Property Layout",
      dataIndex: "propertyLayout",
      key: "propertyLayout",
      align: "center",
      render: (_, record, index) => (
        <Select
          value={record.flatFacing}
          onChange={(value) => handlePlotChange(index, "propertyLayout", value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="1BHK">1BHK</Select.Option>
          <Select.Option value="2BHK">2BHK</Select.Option>
          <Select.Option value="3BHK">3BHK</Select.Option>
          <Select.Option value="4BHK">4BHK</Select.Option>
        </Select>
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

  const handlePlotChange = (index, field, value) => {
    const updatedPlots = [...plots];
    updatedPlots[index][field] = value;
    console.log(updatedPlots);
    setPlots(updatedPlots);
  };
  const handleBatchAdd = () => {
    const [start, end] = batchRange;

    // if (start > end || batchSize <= 0 || price <= 0) {
    //   message.error("Invalid range, size, or price.");
    //   return;
    // }

    const newPlots = [];
    for (let i = start; i <= end; i++) {
      newPlots.push({ plotNumber: i, size: batchSize, unit: landUnit, price });
    }

    setPlots((prevPlots) => [...prevPlots, ...newPlots]);

    setBatchRange([1, 1]);
    setBatchSize(0);
    setPrice(0);
    setLandUnit("sq. ft");

    setIsModalVisibles(false);
  };
  const handleAddCustomPlot = () => {
    setPlots([
      ...plots,
      { plotNumber: "", size: "", unit: "sq. ft", price: "", bedroomCount: "", balconyCount: "", furnished: "", flatFacing: "",propertyLayout:"" },
    ]);
  };
  
  const cancel = () => {

    setIsCurrentLocation(false);
    setIsModalVisible(true);
  };

  const handleBackToCustomers = () => {
    setShowFormType(null); // Hide form and show cards
  };

  const fileInputRef = useRef(null);
  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSizeChange = (data) => {
    const conversionFactors = {
      acres: 43560, // 1 acre = 43,560 square feet
      "sq. ft": 1, // 1 square foot = 1 square foot
      "sq.yards": 9, // 1 square yard = 9 square feet
      "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
      cents: 435.6, // 1 cent = 435.6 square feet
    };

    setLandMeasure(data);
    if (type == "acres") {
      settotalInAcres(price * landmeasure);
    } else {
      settotalInAcres(
        landmeasure * conversionFactors[type] * landmeasure * price
      );
    }
  };

  const [latitude, setLatitude] = useState(""); // State for Latitude
  const [longitude, setLongitude] = useState(""); // State for Longitude
  const [selectedLocation, setSelectedLocation] = useState([20.5937, 78.9629]); // Default Location for Marker
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [landMark, setlandMark] = useState("");

  const [priceunit, setPriceUnit] = useState("sq. ft");
  const [unit, setUnit] = useState("sq. ft");


  // role getting form the local storage

  const [userRole, setUserRole] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [agentEmails, setAgentEmails] = useState([]);
  const csrId = localStorage.getItem("userId");
  const fetchAgentEmails = async () => {
    try {
      const response = await _get(
        `/csr/getAssignedAgents/${csrId}`
      );
      console.log("Agent Emails:", response.data);
      setAgentEmails(response.data || []);
    } catch (error) {
      console.error("Error fetching agent emails:", error);
    }
  };
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
  const updateCoordinates = (lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  };


  useEffect(() => {
    fetchAgentEmails();
  }, []);


  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(parseInt(role, 10)); // Convert to number if stored as a string
    }
  }, []);

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

  const handleUnitChange = (value) => {
    const conversionFactors = {
      acres: 43560, // 1 acre = 43,560 square feet
      "sq. ft": 1, // 1 square foot = 1 square foot
      "sq.yards": 9, // 1 square yard = 9 square feet
      "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
      cents: 435.6, // 1 cent = 435.6 square feet
    };
    console.log(form.getFieldValue("landsizeunit"));
    console.log(conversionFactors[type]);
    setType(value);

    setUnit(value); // Update unit based on selected value

    if (type == "acres") {
      settotalInAcres(price * landmeasure);
    } else {
      if (price && type && landmeasure) {
        settotalInAcres(
          landmeasure * conversionFactors[type] * landmeasure * price
        );
      }
    }

    console.log(totalinacres);
  };
  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
    console.log("Selected Property Type:", value); // Optional: For debugging
  };

  const handlePriceChange = (data) => {
    const conversionFactors = {
      acres: 43560, // 1 acre = 43,560 square feet
      "sq. ft": 1, // 1 square foot = 1 square foot
      "sq.yards": 9, // 1 square yard = 9 square feet
      "sq.m": 10.764, // 1 square meter ≈ 10.764 square feet
      cents: 435.6, // 1 cent = 435.6 square feet
    };
    console.log(
      "finalpoint",
      (form.getFieldValue("size") *
        conversionFactors[type] *
        form.getFieldValue("price")) /
      form.getFieldValue("size")
    );

    console.log(conversionFactors[type], "hiiiiiii");

    setPrice(form.getFieldValue("price"));

    if (type == "acres") {
      settotalInAcres(price * landmeasure);
    } else {
      settotalInAcres(
        landmeasure * conversionFactors[type] * landmeasure * price
      );
    }
  };

  const [flatSize, setFlatSize] = useState(0);
  const [size, setSize] = useState(0);
  const [totalinacres, settotalInAcres] = useState(0);
  const [landmeasure, setLandMeasure] = useState(0);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("sq.ft");

  const [imageUrls, setImageUrls] = useState([]);
  const [activeTab, setActiveTab] = useState(["ownerDetails"]);
  const [hasErrors, setHasErrors] = useState(false);
  const [extraAmmenitiesData, setExtraAmmenitiesData] = useState([]);
  const { Panel } = Collapse;
  const { t, i18n } = useTranslation();
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
  const handlePriceUnitChange = (value) => {
    setPriceUnit(value);
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
  const panelKeys = {
    ownerName: "ownerDetails",
    contact: "ownerDetails",
    propertyType: "landDetails",
    apartmentName: "landDetails",
    apartmentNumber: "landDetails",
    flatSize: "landDetails",
    flatCost: "landDetails",
    apartmentLayout: "landDetails",
    furnitured: "landDetails",
    flatFacing: "landDetails",
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
    if (!values.contact) {
      errors.contact = "Contact number is required";
    }
    if (!values.propertyType) {
      errors.propertyType = "Property type is required";
    }
    if (!values.apartmentName) {
      errors.apartmentName = "Apartment Name is required";
    }
    if (!values.apartmentNumber) {
      errors.apartmentNumber = "Apartment Number is required";
    }
    if (!values.size) {
      errors.size = "Flat Size type is required";
    }
    if (!values.price) {
      errors.price = "Flat Cost is required";
    }
    if (!values.apartmentLayout) {
      errors.apartmentLayout = "Apartment Layout is required";
    }
    if (!values.furnitured) {
      errors.furnitured = "Please Select One";
    }
    if (!values.flatFacing) {
      errors.flatFacing = "Please Select One";
    }

    if (!values.district && !addressDetails.district)
      errors.district = "District is required";
    if (!values.mandal && !addressDetails.mandal)
      errors.mandal = "Mandal is required";
    if (!values.village && !addressDetails.village)
      errors.village = "Village is required";

    return errors;
  };

  const handleuploadPics = (imageUrls1) => {
    setImageUrls(imageUrls1);
  };

  const onValuesChange = (changedValues) => {
    console.log("Changed Values:", changedValues); // Log the changed values
  };
  const [form] = Form.useForm();
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



    if (Object.keys(validationErrors).length === 0) {
      console.log("hello");
      let object = {
        propertyType: "Residential",
        rating: 0,
        ratingCount: 0,
        status: 0,

        agentDetails: {
          userId: values.userId,
        },

        owner: {
          ownerName: values.ownerName,
          ownerEmail: values.ownerEmail || "",
          contact: values.contact,
        },

        propertyDetails: {
          type: values.propertyType,
          apartmentName: values.apartmentName,
          flatNumber: values.apartmentNumber,
          apartmentLayout: values.apartmentLayout,
          flatSize: values.size * conversionFactors[values.landsizeunit],
          flatCost: values.price / conversionFactors[values.pricesizeunit],
          totalCost: Math.ceil(
              (form.getFieldValue("size") *
                  conversionFactors[unit] *
                  form.getFieldValue("price")) /
              conversionFactors[priceunit]
          ),
          propertyPurpose: ltype,
          flatFacing: values.flatFacing,
          furnitured: values.furnitured,
          propDesc: values.propDesc,
          sizeUnit: values.landsizeunit,
          priceUnit: values.pricesizeunit,
          flatCount: values.flatsCount,
          availableFlats: values.availableFlats,
          flat: plots.map((plot) => {
              const flatData = {
                  flatNumber: plot.flatNumber,
                  flatSize: plot.flatSize,
                  flatCost: plot.flatCost,
                  flatSizeUnit: plot.flatSizeUnit,
                  furnitured: plot.furnitured,
                  floorNumber: plot.floorNumber,
               
              };
    
              if (plot.flatFacing) {
                  flatData.flatFacing = plot.flatFacing;
              }
              if (plot.bedroomCount) {
                flatData.bedroomCount = plot.bedroomCount;
            }
            if (plot.balconyCount) {
              flatData.balconyCount = plot.balconyCount;
            }
            if (plot.propertyLayout) {
              flatData.propertyLayout = plot.propertyLayout;
            }
      
              return flatData;
          }) // <-- Added missing closing parenthesis
      },      

        amenities: {
          powerSupply: values.powerSupply || false,
          waterFacility: values.waterFacility || false,
          distanceFromRoad: values.distanceFromRoad || false,
          roadType: values.roadType || false,
          electricityFacility: values.electricityFacility || false,
          elevator: values.elevator || false,
          watchman: values.watchman || false,
          cctv: values.cctv || false,
          gymFacility: values.gymFacility || false,
          medical: values.medical || 0,
          educational: values.educational || 0,
          grocery: values.grocery || 0,
        },
        configurations: {
          bathroomCount: values.bathroomCount || 0,
          balconyCount: values.balconyCount || 0,
          floorNumber: values.floorNumber || 0,
          propertyAge: values.propertyAge || 0,
          maintenanceCost: values.maintenanceCost || 0,
          visitorParking: values.visitorParking || false,
          waterSource: values.waterSource || [],
          playZone: values.playZone || false,
        },
        propPhotos: imageUrls,
        videos: [videoUrl],
        address: {
          country: "India",
          state: "Andhra Pradesh",
          district: addressDetails.district[0],
          mandal: addressDetails.mandal,
          village: addressDetails.village,
          pinCode: pincode === null || pincode === "" ? "000000" : pincode,
          latitude: latitude ? latitude.toString() : "", // Convert to string
          longitude: longitude ? longitude.toString() : "", // Convert to string
          landMark: landMark?.toString() || "",
        },

      };

      console.log(object);
      setLoading(true);
      try {
        const response = await _post(
          "/residential/add",
          object,
          "Property Added Successfully",
          "Submission Failed"
        );
        setLoading(false);
        form.resetFields();

        if (values.userId === undefined) {
          setShowFormType(null);
        }
        localStorage.setItem("form", false);
        setvideoUrl(null);

      } catch (error) {
        console.error(
          "Error adding property:",
          error.response ? error.response.data : error.message
        );
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

  return (
    <Form
      onValuesChange={onValuesChange}
      form={form}
      style={{
        padding: "3%",
        maxWidth: "auto",
        borderRadius: "1%",
      }}
      initialValues={{
        state: "Andhra Pradesh",
        country: "India",
        landsizeunit: "sq. ft",
        pricesizeunit: "sq. ft",
      }}
    >
      {screens.xs ? (
        <h2
          style={{
            // marginTop: "2%",
            padding: "5px",
            paddingTop: "5px",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "white",
            color: "#0d416b",
            fontSize: "20px",
          }}
        >
          {userRole === 5 && (
            <button
              onClick={handleBackToCustomers}
              style={{
                marginTop: "3px",
                fontSize: "20px",
                backgroundColor: '#0D416B',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                float: "left",
                marginBottom: "5px",
              }}
            > <FaArrowLeft style={{ marginTop: "2px" }} /></button>)} Residential Property details
        </h2>
      ) : (
        <h1
          style={{
            marginTop: "-3%",
            padding: "5px",
            paddingTop: "5px",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "white",
            color: "#0d416b",
          }}
        >
          {userRole === 5 && (
            <button
              onClick={handleBackToCustomers}
              style={{
                marginTop: "3px",
                fontSize: "20px",
                backgroundColor: '#0D416B',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                float: "left",
                marginBottom: "5px",
              }}
            > <FaArrowLeft style={{ marginTop: "5px" }} /></button>)} Residential Property details
        </h1>
      )}
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
        onChange={setActiveTab}
      >
        {/* agent details.. */}



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
          <OwnerDetails />
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
          <Row gutter={[16, 0]}  >
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <Form.Item
                label={
                  <>
                    Property Type
                    <Tooltip
                      title={
                        <>
                          <p>
                            <strong>Choose among property type:</strong>
                          </p>
                          <ul>
                            <li>Apartment</li>
                            <li>Villa</li>
                            <li>House</li>
                          </ul>
                        </>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ marginLeft: 8, verticalAlign: "middle" }}
                      />
                    </Tooltip>
                  </>
                }
                labelCol={{ xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 24 } }}
                name="propertyType"
                rules={[
                  {
                    required: true,
                    message: "Property type is required",
                  },
                ]}
              >
                <Select
                  placeholder="Select property type"
                  style={{ width: "80%" }}
                  onChange={handlePropertyTypeChange}
                >
                  <Option value="Apartment">Apartment</Option>
                  <Option value="House">House</Option>
                  <Option value="Villa">Villa</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <Form.Item
                label="Property Name"
                name="apartmentName"
                rules={[
                  {
                    required: true,
                    message: "Property name is required",
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message:
                      "Property name can only contain alphabets and spaces",
                  },
                ]}
                labelCol={{ xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 24 } }}
              >
                <Input
                  style={{ width: "80%" }}
                  placeholder="Enter Property name"
                  onKeyPress={(event) => {
                    if (/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>

       
            {propertyType === "Apartment" && (
              <>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item
                    label="Total Flats Count"
                    name="flatsCount"
                    rules={[
                      { required: true, message: "Please enter a Flats Count" },
                      {
                        pattern: /^[A-Za-z0-9\s]+$/,
                        message:
                          "Flats Count can only contain letters and numbers",
                      },
                    ]}
                    labelCol={{ xs: { span: 11 } }}
                    wrapperCol={{ xs: { span: 24 } }}
                  >
                    <Input
                      placeholder="Enter Flats Count"
                      style={{ width: "80%" }}
                      onKeyPress={(event) => {
                        const regex = /^[A-Za-z0-9]+$/;
                        if (!regex.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item
                    label="Available Flats"
                    name="availableFlats"
                    rules={[
                      { required: true, message: "Please enter a Available Flats Count" },
                      {
                        pattern: /^[A-Za-z0-9\s]+$/,
                        message:
                          "Available Flats Count can only contain letters and numbers",
                      },
                    ]}
                    labelCol={{ xs: { span: 11 } }}
                    wrapperCol={{ xs: { span: 24 } }}
                  >
                    <Input
                      placeholder="Enter Available Flats Count"
                      style={{ width: "80%" }}
                      onKeyPress={(event) => {
                        const regex = /^[A-Za-z0-9]+$/;
                        if (!regex.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
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
                        <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <Form.Item
                label="Property Number"
                name="apartmentNumber"
                rules={[
                  { required: true, message: "Please enter a Property number" },
                  {
                    pattern: /^[A-Za-z0-9\s]+$/,
                    message:
                      "Property number can only contain letters and numbers",
                  },
                ]}
                labelCol={{ xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 24 } }}
              >
                <Input
                  placeholder="Enter Property number"
                  style={{ width: "80%" }}
                  onKeyPress={(event) => {
                    const regex = /^[A-Za-z0-9]+$/;
                    if (!regex.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <Form.Item
                style={{ marginLeft: -50 }}
                label={<span><span style={{ color: 'red' }}>*</span> Property Size</span>}
                labelCol={{ xs: { span: 11 } }}
                wrapperCol={{ xs: { span: 24 } }}
                rules={[{ required: true }]}
              >
                <Input.Group compact>
                  <Form.Item name="size" noStyle>
                    <InputNumber
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      min={0}
                      placeholder="Enter Property size"
                      style={{ width: "50%" }}
                      onChange={handleSizeChange}
                    />
                  </Form.Item>
                  <Form.Item name="landsizeunit" noStyle>
                    <Select
                      defaultValue="sq. ft"
                      style={{ width: "50%" }}
                      onChange={handleUnitChange}
                    >
                      <Select.Option value="acres">Acres</Select.Option>
                      <Select.Option value="sq. ft">sq.ft</Select.Option>
                      <Select.Option value="sq.yards">Sq.Yards</Select.Option>
                      <Select.Option value="sq.m">Sq.M</Select.Option>
                      <Select.Option value="cents">Cents</Select.Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>

            <Col span={8} xs={24} lg={8} sm={12} md={12} xl={6}>
              {/*  Price */}
              <Input.Group compact>
                <Form.Item
                  label="Price"
                  name="price"
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
                  labelCol={{ xs: { span: 9 }, sm: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 }, sm: { span: 24 } }}
                >
                  <InputNumber
                    step={0.1}
                    type="number"
                    placeholder="Enter price"
                    onChange={(value) => {
                      if (value < 0) {
                        value = 0;
                      }
                      handlePriceChange(value);
                    }}
                    style={{ width: "120px", backgroundColor: "white" }}
                    min={0}
                  // addonAfter={`/${unit}`}
                  />
                </Form.Item>
                <Form.Item name="pricesizeunit" noStyle>
                  <Select
                    defaultValue="acres"
                    style={{ width: "80px" }}
                    onChange={handlePriceUnitChange}
                  >
                    <Option value="acres">/acre</Option>
                    <Option value="sq. ft">/sq. ft</Option>
                    <Option value="sq.yards">/sq.yard</Option>
                    <Option value="sq.m">/sq.m</Option>
                    <Option value="cents">/cent</Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Col>

            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <Form.Item
                label="Property Cost"
                name="totalCost"
                labelCol={{ xs: { span: 10 } }}
                wrapperCol={{ xs: { span: 24 } }}
              >
                <>
                  ₹{" "}
                  {form.getFieldValue("price") && form.getFieldValue("size")
                    ? formatPrice(
                      priceunit === unit
                        ? form.getFieldValue("price") * form.getFieldValue("size")
                        : Math.ceil(
                          (form.getFieldValue("size") *
                            conversionFactors[unit] *
                            form.getFieldValue("price")) /
                          conversionFactors[priceunit]
                        )
                    )
                    : "0"}
                </>
              </Form.Item>
            </Col>

            {propertyType != "Apartment" && (
              <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                <Form.Item
                  label="Property Layout"
                  name="apartmentLayout"
                  rules={[{ required: true }]}
                  labelCol={{ xs: { span: 10 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                >
                  <Select placeholder="Select BHK type" style={{ width: "80%" }}>
                    <Option value="1BHK">1BHK</Option>
                    <Option value="2BHK">2BHK</Option>
                    <Option value="3BHK">3BHK</Option>
                    <Option value="4BHK">4BHK</Option>
                  </Select>
                </Form.Item>
              </Col>)}
            {propertyType != "Apartment" && (
              <>
                <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Form.Item
                    label={
                      <span>
                        Furniture
                        <Tooltip
                          placement="rightTop"
                          // overlayStyle={{ maxWidth: "600px" }}
                          title={
                            <>
                              <p>
                                <strong>Furnishing Options:</strong>
                              </p>
                              <ul>
                                <li>
                                  <strong>Unfurnished:</strong> No furniture or
                                  fittings are included.
                                </li>
                                <li>
                                  <strong>Semi Furnished:</strong> Includes basic
                                  furniture and some fittings, but not fully
                                  equipped.
                                </li>
                                <li>
                                  <strong>Fully Furnished:</strong> Includes all
                                  necessary furniture and fittings, ready to move
                                  in.
                                </li>
                              </ul>
                            </>
                          }
                        // overlayStyle={{ width: '300px' }}
                        >
                          <InfoCircleOutlined style={{ marginLeft: 8 }} />
                        </Tooltip>
                      </span>
                    }
                    name="furnitured"
                    rules={[{ required: true }]}
                    labelCol={{ xs: { span: 8 } }}
                    wrapperCol={{ xs: { span: 24 } }}
                  >
                    <Select placeholder="Select furniture" style={{ width: "100%" }}>
                      <Option value="Unfurnished">Unfurnished</Option>
                      <Option value="Fully Furnished">Fully Furnished</Option>
                      <Option value="Semi Furnished">Semi Furnished</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  style={{ marginBottom: screens.xs && "-10%" }}
                >
                  <Form.Item
                    label="Bathrooms Count"
                    name="bathroomCount"
                    labelCol={{ xs: { span: 12 } }}
                    wrapperCol={{ xs: { span: 24 } }}
                  >
                    <InputNumber
                      placeholder="Enter no of Bathrooms"
                      min={0}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid lightgrey",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  style={{ marginBottom: screens.xs && "-10%" }}
                >
                  <Form.Item
                    labelCol={{ xs: { span: 12 } }}
                    wrapperCol={{ xs: { span: 24 } }}
                    label="Balcony Count"
                    name="balconyCount"
                  >
                    <InputNumber
                      placeholder="Enter no of Balconies"
                      min={0}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid lightgrey",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  style={{ marginBottom: screens.xs && "-10%" }}
                >
                  <Form.Item
                    labelCol={{ xs: { span: 12 } }}
                    wrapperCol={{ xs: { span: 24 } }}
                    label="Floor Number"
                    name="floorNumber"
                  >
                    <InputNumber
                      placeholder="Please Enter floor number"
                      min={0}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid lightgrey",
                      }}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={6}
              style={{ marginBottom: screens.xs && "-10%" }}
            >
              <Form.Item
                labelCol={{ xs: { span: 12 } }}
                wrapperCol={{ xs: { span: 24 } }}
                label="Property Age"
                name="propertyAge"
              >
                <InputNumber
                  placeholder="Enter years"
                  min={1}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={6}
              style={{ marginBottom: screens.xs && "-10%" }}
            >
              <Form.Item
                labelCol={{ xs: { span: 12 } }}
                wrapperCol={{ xs: { span: 24 } }}
                label="Maintenance Cost"
                name="maintenanceCost"
              >
                <InputNumber
                  placeholder="Enter Maintenance Cost"
                  min={1}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid lightgrey",
                  }}
                />
              </Form.Item>
            </Col>
            {propertyType != "Apartment" && (

              <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                <Form.Item
                  label="Property Facing"
                  name="flatFacing"
                  rules={[{ required: true, message: "Property Facing is required" }]}
                  labelCol={{ xs: { span: 12 } }}
                  wrapperCol={{ xs: { span: 24 } }}
                >
                  <Select
                    placeholder="Select Property Facing"
                    style={{ width: "100%" }}
                  >
                    <Select.Option value="North">North</Select.Option>
                    <Select.Option value="South">South</Select.Option>
                    <Select.Option value="East">East</Select.Option>
                    <Select.Option value="West">West</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            )}


            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ marginBottom: screens.xs && "-5%" }}
            >
              <Form.Item label="Property Description" name="propDesc">
                <Input.TextArea
                  rows={2}
                  cols={13}
                  style={{ width: "100%" }}
                  maxLength={300}
                  placeholder="Enter property description(maximum 300 characters)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form layout="vertical">
            {propertyType === "Apartment" && (
              <Form.Item>
                <Button
                  style={{
                    backgroundColor: "#0d416b",
                    color: "white",
                  }}
                  onClick={() => setIsModalVisibles(true)}
                >
                  + Add Flats
                </Button>
              </Form.Item>)}

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
      Add Flats
    </span>
  }
  visible={isModalVisibles}
  onOk={handleBatchAdd}
  onCancel={() => setIsModalVisibles(false)}
  okText="Add Flats"
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
  width={1200}
  style={{ marginLeft: "15%" }}
>
  <Form layout="vertical"></Form>
  <Button
          type="dashed"
          onClick={handleAddCustomPlot}
          style={{
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            float:"right",
            marginBottom:"2%"
          }}
        >
          + Add a New Flat
        </Button>
  <Table
    columns={columns}
    dataSource={plots}
    rowKey={(record, index) => `${record.plotNumber || index}-${Math.random()}`}
    pagination={false}
    scroll={{ y: 300 }} // Add vertical scroll with a height of 300px
    
  />
</Modal>
          </Form>

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
                    <span style={{ color: "red" }}>*</span> Choose Location:
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
          <Amenities setExtraAmmenitiesData={setExtraAmmenitiesData} />
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
                    <UploadOutlined />Upload Image / Video
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


export default ResidentialForm;
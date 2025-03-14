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
  Tag,
  Modal,
  message,
  Popconfirm,
} from "antd";
import "./AgriculturalStyles/AddProperty.css";

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

import {
  DeleteOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { _post, _get } from "../../../Service/apiClient";
import Upload from "../Upload";
import { useTranslation } from "react-i18next";
import CurrentLocation from "../currentLocation";
import { FaArrowLeft, FaMicrophone } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";


const { useBreakpoint } = Grid;
const { Option } = Select;
const API_KEY = "AIzaSyCRouoqOUlbhszsbloBTJa7cR4hOZvFYi4";
function AddProperty({ setShowFormType }) {
  const screens = useBreakpoint();
  const { t } = useTranslation();

  const [landMark, setlandMark] = useState("");

  //  for map...

  const [isModalVisible, setIsModalVisible] = useState(false);


  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);

  const [villages, setVillages] = useState([]);
  const [pincode, setPincode] = useState("");
  const [selectedValues] = useState([]);

  const [isLitigation, setIsLitigation] = useState(false);
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [unit, setUnit] = useState("acres");
  const [priceunit, setPriceUnit] = useState("acres");

  const [latitude, setLatitude] = useState(""); // State for Latitude
  const [longitude, setLongitude] = useState(""); // State for Longitude
  const [selectedLocation, setSelectedLocation] = useState([20.5937, 78.9629]); // Default Location for Marker


  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  //  const nameofagent=localStorage.getItem("agentName");

  const [userRole, setUserRole] = useState(null);

  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirm = () => {

    setIsCurrentLocation(true);
    setIsModalVisible(true);
  };
  const handleBackToCustomers = () => {
    setShowFormType(null); // Hide form and show cards
  };
  const cancel = () => {

    setIsCurrentLocation(false);
    setIsModalVisible(true);
  };
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [cloudinaryURL, setCloudinaryURL] = useState(null);
  //   const [uploadProgress, setUploadProgress] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  //   const [form] = Form.useForm();
  const [isProcessing, setIsProcessing] = useState(false);

  // const handleSpeechInput = async () => {
  //     setIsProcessing(true);

  //     try {
  //         const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  //         recognition.lang = "en-US";
  //         recognition.continuous = false;
  //         recognition.interimResults = false;

  //         recognition.onresult = async (event) => {
  //             const speechText = event.results[0][0].transcript;
  //             setTranscript(speechText);
  //             await processWithGemini(speechText);
  //         };

  //         recognition.onend = () => setIsProcessing(false);
  //         recognition.start();
  //     } catch (error) {
  //         console.error("Speech recognition error:", error);
  //         message.error("Speech recognition failed!");
  //         setIsProcessing(false);
  //     }
  // };
  // const cloudinaryUrl = "https://res.cloudinary.com/ds1qogjpk/video/upload/v1740149427/blob_nrppae.webm"; // e.g., "https://res.cloudinary.com/your-cloud-name/video/upload/v1620000000/yourfile.wav"
  // const cloudinaryUrl = "https://res.cloudinary.com/ds1qogjpk/video/upload/v1740149427/blob_nrppae.webm";


  const handleSpeechInput = async () => {
    setIsProcessing(true);

    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US"; // This can also be adjusted to support Telugu if needed.
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = async (event) => {
        const speechText = event.results[0][0].transcript;
        // setTranscript(speechText);
        await processWithGemini(speechText);
      };

      recognition.onend = () => setIsProcessing(false);
      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      message.error("Speech recognition failed!");
      setIsProcessing(false);
    }
  };

  const processWithGemini = async (text) => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // The prompt now clearly distinguishes keywords for boreWell and storageFacility.
      const prompt = `Extract details from the given sentence and map them to the correct form fields.
  The sentence may be in English or Telugu. If the sentence is in Telugu, convert any names, numbers, or details to their English equivalents.
  
  Sentence: "${text}"
  
  Identify and extract the following details:
  
  1. **First Name**: Extract the first name. (Example: if the sentence says "my name is Chandini" or "నా పేరు చందిని", return "Chandini".)
  2. **Last Name**: Extract the last name.
  3. **Contact No**: Detect a 10-digit phone number If the phone number is spoken in Telugu (e.g., using words like "okati" for 1, "rendu" for 2, "moodu" for 3, etc.), convert those words into their corresponding numeric digits..
  4. **Any Disputes?**: Identify if the text mentions any disputes (yes/no).
     - If words like "dispute", "conflict", "legal issue", "వివాదం", or "కేసు" appear, return "Yes".
     - Otherwise, return "No".
  
  5. **Land Details**:
     - **Land Type**: Identify if the land type is "dry land", "wet land", or "converted land".
   - **title**: Extract the title of the land. Look for phrases such as "name of the land", "land name is", "land title", "property name", "title of the property", "plot name", or any sentence that indicates how the land is referred to (e.g., "my land is called...", "this land is named...", "the land is known as..."). Return the extracted title accordingly.

     - **Survey No**: Extract the survey number.
     - **Size**: Extract land size (e.g., "5 acres", "10 sq ft").
     - **Price**: Extract price details.
     - **Total Price**: Compute the total price if multiple units are mentioned.
   - **Description**: Extract any description of the land. If the description is provided in Telugu (for example, "pantalu baga panduthayi"), convert it to its English equivalent before returning.

  
  6. **Location**:
     - **Country**: Identify the country (Default: India).
     - **State**: Extract the state name.
     - **Pincode**: Extract the PIN code.
     - **District**: Extract the district.
     - **Mandal**: Extract the Mandal if available.
     - **Village**: Extract the village name.
     - **Landmark**: Identify a landmark.
  
  7. **Geolocation**:
     - **Latitude** and **Longitude**: Extract coordinates if mentioned.
  
  8. **Amenities**:
     - **Type of Electricity**: Identify the type of electricity available. (Electricity type can be Domestic, Industrial, Commercial, Residential, or None.)
     - **boreWell**: Extract bore facility details (Yes/No).  
         - Consider only keywords like "bore facility", "borewell", "water facility", or their Telugu equivalents.
         - If any of these appear, return "Yes". Otherwise, return "No".
     - **Storage Facility**: Extract storage facility information (Yes/No).  
         - Consider only keywords like "storage facility", "warehouse", "godown", "shed", or "storehouse".
         - If any of these appear, return "Yes". Otherwise, return "No".
     - **Road Proximity**: Identify road proximity in km.
     - **Road Type**: Extract the type of road near the land.

Possible values include: "R&B", "HighWay", "Village", "Panchayat", or "None".
If the text contains phrases like "near the village", "close to the village", or similar expressions, return "Village".
Similarly, if it mentions "highway", "R&B", or "panchayat", return the corresponding value.
If no road type is clearly mentioned, return "None".
  
  9. **Media Upload**:
     - Identify if an image/video upload is mentioned.
  
  Return the output in valid JSON format without markdown formatting. Do not include backticks or 'json' tags.
  
  Example output:
  {
    "firstName": "Chandini",
    "lastName": "",
    "phoneNumber": "9876543210",
    "disputes": "Yes",
    "landDetails": {
      "landType": "Dry Land",
      "title": "Greenfield",
      "surveyNumber": "1234A",
      "size": "5 Acres",
      "price": "50000",
      "totalPrice": "250000",
      "propertyDesc": "Agricultural land with water access"
    },
    "location": {
      "country": "India",
      "state": "Andhra Pradesh",
      "pincode": "500001",
      "district": "Krishna",
      "mandal": "Vijayawada",
      "village": "Gannavaram",
      "landmark": "Near Bus Stand"
    },
    "geolocation": {
      "latitude": "16.5062",
      "longitude": "80.6480"
    },
    "amenities": {
      "electricity": "Domestic",
       "roadProximity": "1.5 km",
      "roadType": "HighWay"
      "boreWell": "Yes",
      "storageFacility": "Yes",
     
    }
  }`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      responseText = responseText.replace(/```json|```/g, "").trim();

      const extractedData = JSON.parse(responseText);

      const hasDisputes = extractedData.disputes?.toLowerCase() === "yes";
      setIsLitigation(hasDisputes);
      form.setFieldsValue({ litigation: hasDisputes });

      // setisBoreFacility(hasBoreFacility);

      form.setFieldsValue({
        firstName: extractedData.firstName,
        lastName: extractedData.lastName,
        phoneNumber: extractedData.phoneNumber,
        landType: extractedData.landDetails?.landType,
        title: extractedData.landDetails?.title,
        surveyNumber: extractedData.landDetails?.surveyNumber,
        size: extractedData.landDetails?.size,
        price: extractedData.landDetails?.price,
        totalPrice: extractedData.landDetails?.totalPrice,
        propertyDesc: extractedData.landDetails?.propertyDesc,
        country: extractedData.location?.country,
        state: extractedData.location?.state,
        pincode: extractedData.location?.pincode,
        district: extractedData.location?.district,
        mandal: extractedData.location?.mandal,
        village: extractedData.location?.village,
        landmark: extractedData.location?.landmark,
        latitude: extractedData.geolocation?.latitude,
        longitude: extractedData.geolocation?.longitude,
        electricity: extractedData.amenities?.electricity,
        roadProximity: extractedData.amenities?.roadProximity,
        roadType: extractedData.amenities?.roadType,
        boreWell: extractedData.amenities?.boreWell?.toLowerCase() === "yes" ? "Yes" : "No",
        storageFacility: extractedData.amenities?.storageFacility?.toLowerCase() === "yes" ? "Yes" : "No",
       
      });

    } catch (error) {
      console.error("Gemini API error:", error);
      message.error("Failed to process speech with AI!");
    }
  };
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      const uploadedURL = await Upload(audioBlob, setUploadProgress);
      console.log("Uploaded Cloudinary URL:", uploadedURL);
      setCloudinaryURL(uploadedURL);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    setAudioURL(null);
    setCloudinaryURL(null);
    setUploadProgress(0);
    form.resetFields();
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(parseInt(role, 10));
    }
    console.log(videoUrl);
  }, []);



  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const updateCoordinates = (lat, long) => {
    setLatitude(lat);
    setLongitude(long);
  };



  const handleLandMark = (e) => {
    setlandMark(e.target.value);
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
    acres: 1, // 1 acre is 1 acre
    "sq. ft": 43560, // 1 sq.ft. to acres
    "sq.yards": 4840, // 1 sq.yard to acres
    "sq.m": 4047, // 1 sq.m to acres
    cents: 100, // 1 cent to acres
  };
  const handleLitigation = (checked) => {
    setIsLitigation(checked);
    form.setFieldsValue({ litigation: checked });
  };

  const handleBoreChange = (checked) => {
    // setisBoreFacility(checked);
    form.setFieldsValue({ boreWell: checked });
  };

  const handleUnitChange = (value) => {
    // setType(form.getFieldValue("landsizeunit"));

    setUnit(value);
    
    
  };
  const handlePriceUnitChange = (value) => {
    setPriceUnit(value);
  };

  const handleSizeChange = (data) => {
    // setLandMeasure(form.getFieldValue("size"));

  
   
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
  const handlevillageChange = async (value) => {
    setAddressDetails((prev) => ({ ...prev, village: value }));
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

  // const handleLandTypeChange = (value) => {
  //   setSelectedLandType(value);

  //   if (value === "converted") {
  //     setHeadingLabel("Is this Land converted from any other Form?");
  //   } else {
  //   }
  // };
  const [addressDetails, setAddressDetails] = useState({
    country: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
  });

  const [imageUrls, setImageUrls] = useState([]);

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
  const deletingImage = (index) => {
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePriceChange = (data) => {
    // setPrice(form.getFieldValue("price"));
    // const conversionFactors = {
    //   acres: 1, // 1 acre is 1 acre
    //   "sq. ft": 43560, // 1 sq.ft. to acres
    //   "sq.yards": 4840, // 1 sq.yard to acres
    //   "sq.m": 4047, // 1 sq.m to acre
    //   cents: 100, // 1 cent to acres
    // };
    // if (type == "acres") {
    //   settotalInAcres(price * landmeasure);
    // } else {
    //   settotalInAcres(
    //     (form.getFieldValue("size") *
    //       form.getFieldValue("price") *
    //       conversionFactors[form.getFieldValue("landsizeunit")]) /
    //     form.getFieldValue("size")
    //   );
    // }
  };

  const address = {
    country: "India",
    state: "Andhra Pradesh",
    district: addressDetails.district[0],
    mandal: addressDetails.mandal,
    village: addressDetails.village,
    pinCode: pincode === null || pincode === "" ? "000000" : pincode,
    latitude,
    longitude,
    landMark,
  };

  const uploadPics = [];
  imageUrls.forEach((imageUrl) => {
    uploadPics.push(imageUrl);
  });

  

  const validateFieldsManually = (values) => {
    const errors = {};
    if (isLitigation && values.litigationDesc === "") {
      errors.litigationDesc = "Litigation Description is Required";
    }
    if (!values.ownerName) {
      errors.ownerName = "Owner name is required";
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
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

    if (!values.title) {
      errors.title = "LandName is required";
    }
    if (!values.surveyNumber) {
      errors.surveyNumber = "Survey Number is required";
    }
    if (!values.district && !addressDetails.district)
      errors.district = "District is required";
    if (!values.mandal && !addressDetails.mandal)
      errors.mandal = "Mandal is required";
    if (!values.village && !addressDetails.village)
      errors.village = "Village is required";

    return errors;
  };


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


  useEffect(() => {
    fetchAgentEmails();
  }, []);

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const validationErrors = validateFieldsManually(values);
    if (Object.keys(validationErrors).length > 0) {
    

      const errorsToSet = Object.entries(validationErrors).map(
        ([field, error]) => ({
          name: field,
          errors: [error],
        })
      );

      form.setFields(errorsToSet);
      // setActiveTab([...panelsWithErrors]);
      // setHasErrors(true);
    }

    const agentDetails = {
      userId: values.userId,
    };
    console.log(`${values.firstName}`);
    console.log(`${values.lastName}`);
    const name = `${values.firstName} ${values.lastName}`
    console.log(name);
    const ownerDetails = {
      ownerName: name,
      phoneNumber: values.phoneNumber,
    };

    const landDetails = {
      title: values.title,
      surveyNumber: values.surveyNumber,
      size: values.size / conversionFactors[values.landsizeunit],
      sizeUnit: values.landsizeunit || "acres",
      priceUnit: values.pricesizeunit || "acres",
      price: values.price * conversionFactors[values.pricesizeunit],
      totalPrice:
        priceunit === unit
          ? form.getFieldValue("price") * form.getFieldValue("size")
          : Math.ceil(
            (form.getFieldValue("size") / conversionFactors[unit]) *
            form.getFieldValue("price") *
            conversionFactors[priceunit]
          ),
      landType: values.landType,
      crops: selectedValues,
      litigation: isLitigation ? true : false,
      litigationDesc: values.litigationDesc,
      images: uploadPics,
      videos: videoUrl ? [videoUrl] : [],
      propertyDesc:
        values.propertyDesc === undefined ? "" : values.propertyDesc,
    };
    const amenities = {
      boreWell: values.boreWell === undefined ? false : values.boreWell,
      electricity:
        values.electricity === undefined ? false : values.electricity,
      distanceFromRoad: values.distanceFromRoad,
      storageFacility:
        values.storageFacility === undefined ? false : values.storageFacility,
      extraAmenities: skills,
      roadType: values.roadType === undefined ? false : values.roadType,
    };

    const requestBody = {
      //  agentsDetails
      agentDetails,
      ownerDetails,
      landDetails,
      address: {
        ...address,

        latitude: latitude.toString(),
        longitude: longitude.toString(),
        landMark: landMark?.toString() || "",

      },
      amenities,
    };

    setLoading(true);
    try {
      console.log(
        "Request body being sent:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await _post(
        "/fields/insert",
        requestBody,
        "Property Added Successfully"
      );
      setLoading(false);
      if (response.status === 200 || response.status === 201) {
        console.log(
          "lat is cmg or not -->",
          JSON.stringify(requestBody, null, 2)
        );
        console.log(values.userId);
        if (values.userId === undefined) {
          console.log("shshshs");
          setShowFormType(null);
        }

        localStorage.setItem("form", false);
        form.resetFields();
        setvideoUrl(null);

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

  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");

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
  const handlePanelChange = (key) => {
    // setActiveTab(key);
    if (isFirstInteraction) {
      setIsFirstInteraction(false);
    }
  };

  return (
    <>
  <Col span={9}>
  {/* <div>
      <Button
        onClick={handleSpeakerClick}
        type="primary"
        style={{ backgroundColor: "#0D4164", fontWeight: "bold" }}
      >
        <FaVolumeUp style={{ marginRight: 8 }} /> {cloudinaryUrl ? "Play Audio" : "Upload .WAV & Play Audio"}
      </Button>
      <input
        type="file"
        accept=".wav"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {mediaSrc && (
        // Use a video element to play the WebM file.
        // If you want to hide the video portion, you can set style={{ display: "none" }}
        <video
          id="media-player"
          src={mediaSrc}
          controls
          style={{ marginTop: 10, width: "100%" }}
        >
          Your browser does not support the video element.
        </video>
      )}
    </div> */}
  <Button
    type={isProcessing ? "danger" : "primary"}
    onClick={handleSpeechInput}
    block
    style={{
      width: "50%",
      backgroundColor: "#0D4164",
      fontWeight: "bold",
      marginLeft: "80%"
    }}
  >
    {isProcessing ? "Listening..." : <>
      <FaMicrophone style={{ marginRight: 8,marginTop:2 }} /> Fill the form using Microphone
    </>}
  </Button>
</Col>

    <Form
      form={form}
      name="sectionedForm"
      {...formItemLayout}
      // layout="vertical"
      onValuesChange={onFormVariantChange}
      variant={componentVariant}
      style={{
        padding: "3%",
        maxWidth: "auto",
        borderRadius: "1%",
        address,
      }}
      initialValues={{
        variant: componentVariant,
        state: "Andhra Pradesh",
        country: "India",
        landsizeunit: "acres",
        pricesizeunit: "acres",
      }}
    >

      {screens.xs ? (
        <>

          <h2
            className="custom-container"
            style={{ fontSize: '20px', marginTop: '1%', textAlign: 'center', flex: 1 }}
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
              ><FaArrowLeft style={{ marginTop: "5px" }} /> </button>)}Agriculture Land details
          </h2>
        </>
      ) : (
        <>

          <h1 className="custom-container" style={{ textAlign: 'center', flex: 1 }}>
            {userRole === 5 && (<button
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
            >
              <FaArrowLeft style={{ marginTop: "5px" }} />
            </button>)}Agriculture Land details
          </h1>
        </>
      )}



      <Collapse
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
        {/*  agents details */}


        {/* displaying the CSR role 5 */}


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
            <Row style={{ marginTop: "2%" }}>
              <Col xs={24} sm={12} md={8} xl={6}>
                <Form.Item
                  label="First Name"
                  name="firstName"
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
              <Col xs={24} sm={12} md={8} xl={6}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
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
              <Col xl={6} xs={24} sm={12} md={8}>
                <Form.Item
                  label={<>Contact No </>}
                  name="phoneNumber"
                  labelCol={{ xs: { span: 7 } }}
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

                        return Promise.resolve(); // Valid number
                      },
                    },
                  ]}
                >
                  <Input
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    style={{
                      width: "80%",
                      backgroundColor: "transparent",
                      border: "1px solid lightgray",
                      marginLeft: screens.md && "4%",
                    }}
                  />
                </Form.Item>
              </Col>




              <Col xl={6} xs={24} sm={12} md={8}>
                {" "}
                <Form.Item
                  labelCol={{ xs: { span: 10 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  label={
                    <>
                      <span
                        style={{
                          marginRight: screens.md && !screens.lg && "-2%",
                        }}
                      >
                        Any Disputes?
                      </span>
                      <Tooltip
                        placement="rightTop"
                        // overlayStyle={{ maxWidth: "500px" }}
                        title={
                          <>
                            <p>
                              <strong>If you have any disputes like :</strong>
                            </p>
                            <ul>
                              <li>
                                <strong>Boundary Disputes:</strong>{" "}
                              </li>
                              <li>
                                <strong>Title and Ownership Issues:</strong>
                              </li>
                              <li>
                                <strong>Zoning Conflicts:</strong>
                              </li>
                              <li>
                                <strong>Unauthorized Land Use:</strong>
                              </li>
                              <li>
                                <strong>Fraudulent Transactions:</strong>
                              </li>
                            </ul>
                            <p>
                              If yes, toggle the dispute option, otherwise you
                              can ignore this.
                            </p>
                          </>
                        }
                      >
                        <InfoCircleOutlined />
                      </Tooltip>
                    </>
                  }
                  name="litigation"
                  valuePropName="checked"
                  style={{ margin: 0 }}
                >
                  <Switch
                    onChange={handleLitigation}
                    defaultChecked={false}
                    style={{
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {isLitigation && (
              <Row gutter={16}>
                <Col xl={24} xs={24} sm={24} md={24}>
                  <Form.Item
                    label="Describe about your dispute?"
                    name="litigationDesc"
                    labelCol={{ span: 8.5 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: { isLitigation },
                      },
                    ]}
                  >
                    <Input.TextArea
                      className="input-box"
                      placeholder="Describe about your dispute"
                      minLength={20}
                      maxLength={300}
                      rows={2}
                      cols={20}
                      style={{ width: screens.xs ? "100%" : "90%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        </Panel>

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Land Details
            </span>
          }
          key="landDetails"
        >
          <>
            <Row>
              <Col span={8} xs={24} lg={8} sm={8} xl={6} md={8} >
                <Form.Item
                  label={
                    <>
                      Land Type{" "}
                      <Tooltip
                        placement="rightTop"
                        // overlayStyle={{ maxWidth: "500px" }}
                        title={
                          <div>
                            <strong>Choose from Land Types Available:</strong>

                            <ul>
                              <li>
                                <strong>Dry Land</strong>
                              </li>
                              <li>
                                <strong>Wet Land</strong>
                              </li>
                              <li>
                                <strong>Converted Land</strong>
                              </li>
                            </ul>
                          </div>
                        }
                      >
                        <InfoCircleOutlined style={{ paddingLeft: 5 }} />
                      </Tooltip>
                    </>
                  }
                  name="landType"
                  rules={[
                    { required: true, message: "Please select a land type!" },
                  ]}
                  labelCol={{ xs: { span: 9 } }}
                  wrapperCol={{ xs: { span: 14 } }}
                >
                  <Select
                    className="select-custom"
                    placeholder="Select land type"
                    // onChange={handleLandTypeChange}
                  >
                    <Option value="dryland">Dry land</Option>
                    <Option value="wetland">Wet land</Option>
                    <Option value="converted">Converted Land</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} xs={24} lg={8} sm={12} md={12} xl={6}>
                <Form.Item
                  label="Land Name"
                  name="title"
                  rules={[
                    { required: true, message: "Please input Land Name" },
                    {
                      pattern: /^[A-Za-z' ]+$/,
                      message: "Name should contain only alphabets",
                    },
                  ]}
                  labelCol={{ xs: { span: 10 }, sm: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 }, sm: { span: 16 } }}
                >
                  <Input
                    className="input-box"
                    style={{
                      width: "80%",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={8} xs={24} lg={8} xl={6} sm={12} md={12}>
                <Form.Item
                  label={
                    <>
                      Survey No
                      <Tooltip
                        placement="rightTop"
                        title={
                          <div>
                            <p>
                              <strong>Survey Number Format:</strong>a
                              three-digit number, followed by a hyphen, then one
                              digit, one alphabet character, and one digit.
                              <p></p>
                              <strong>Example : 123-4g6</strong>.
                            </p>

                            <p></p>
                          </div>
                        }
                      >
                        <InfoCircleOutlined style={{ marginLeft: "5px" }} />
                      </Tooltip>
                    </>
                  }
                  labelCol={{ xs: { span: 9 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                  name="surveyNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input Survey No",
                    },
                  ]}
                >
                  <Input
                    className="input-box"
                    style={{
                      width: "80%",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={8} xs={24} lg={8} xl={6} sm={12} md={12}>
                <Input.Group compact>
                  <Form.Item
                    label={
                      <>
                        Land Size
                        <Tooltip
                          placement="rightTop"
                          title={
                            <div>
                              <p>
                                <strong>Enter the land size in acres.</strong>
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
                    name="size"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the land size",
                      },
                      {
                        validator: (_, value) => {
                          // If value is empty, let the required rule handle it.
                          if (value === undefined || value === null || value === "") {
                            return Promise.resolve();
                          }
                          // Regular expression to allow only numerics and decimals.
                          const reg = /^[0-9]+(\.[0-9]+)?$/;
                          if (!reg.test(value.toString())) {
                            return Promise.reject(new Error("Only numerics and decimals are allowed"));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    labelCol={{ xs: { span: 10 }, sm: { span: 8 } }}
                    wrapperCol={{ xs: { span: 16 }, sm: { span: 24 } }}
                  >
                    <Form.Item name="size" noStyle>
                      <InputNumber
                        step={0.1}
                        placeholder="0.1 acres to 1000 acres"
                        onChange={handleSizeChange}
                        style={{ width: "60%" }}
                        min={0}
                        max={99999}
                      />
                    </Form.Item>
                    <Form.Item name="landsizeunit" noStyle>
                      <Select
                        defaultValue="acres"
                        style={{ width: "40%" }}
                        onChange={handleUnitChange}
                      >
                        <Option value="acres">Acres</Option>
                        <Option value="sq. ft">Sq. Ft</Option>
                        <Option value="sq.yards">Sq.Yards</Option>
                        <Option value="sq.m">Sq.M</Option>
                        <Option value="cents">Cents</Option>
                      </Select>
                    </Form.Item>
                  </Form.Item>
                </Input.Group>
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
              {/*  Total Price */}

              <Col span={8} xs={24} lg={8} sm={12} md={12} xl={6}>
                <Form.Item
                  label="Total Price"
                  labelCol={{ xs: { span: 8 } }}
                  wrapperCol={{ xs: { span: 16 } }}
                >
                  <>
                    ₹{" "}
                    {form.getFieldValue("price") && form.getFieldValue("size")
                      ? formatPrice(
                        priceunit === unit
                          ? form.getFieldValue("price") * form.getFieldValue("size")
                          : Math.ceil(
                            (form.getFieldValue("size") / conversionFactors[unit]) *
                            form.getFieldValue("price") *
                            conversionFactors[priceunit]
                          )
                      )
                      : "0"}
                  </>
                </Form.Item>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Form.Item
                  label={
                    <>
                      Description
                      <Tooltip
                        placement="leftBottom"
                        title={
                          <div>
                            <strong>
                              <p>
                                If your property has any special features, please specify them here.
                              </p>
                            </strong>
                          </div>
                        }
                      >
                        <InfoCircleOutlined
                          style={{ marginLeft: 3, verticalAlign: "middle" }}
                        />
                      </Tooltip>
                    </>
                  }
                  name="propertyDesc"
                  labelCol={{ xs: { span: 4 } }}
                  wrapperCol={24}
                >
                  <Input.TextArea
                    className="input-box"
                    placeholder="Please provide details about the land"
                    maxLength={300}
                    rows={2}
                  />
                </Form.Item>
              </Col>

            </Row>

          </>
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

        {/*  new code from here for maps.....*/}

        <Panel
          style={{ backgroundColor: " rgb(13,65,107)" }}
          header={
            <span style={{ fontWeight: "bold", color: "white" }}>
              Amenities
            </span>
          }
          key="Amenities"
        >
          <>
            <Row gutter={16}>
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
                span={6}
                xs={24}
                lg={5}
                sm={12}
                md={5}
                xl={5}

                style={{ marginBottom: "-25px" }}
              >
                <Form.Item
                  label={
                    <>
                      Bore Facility{" "}
                      <Tooltip
                        placement="rightbottom"
                        title={
                          <div>
                            <p>
                              <strong>
                                Confirm if there is a Bore Facility by toggling
                                'Yes'.
                              </strong>
                            </p>
                            <p>
                              <strong>
                                Types of Bore Facilities for Agricultural
                                Fields:
                              </strong>
                            </p>
                            <ul>
                              <li>
                                <strong>Tube Wells</strong>
                              </li>
                              <li>
                                <strong>Open Wells</strong>
                              </li>
                              <li>
                                <strong>Bore Wells</strong>
                              </li>
                              <li>
                                <strong>Solar Bore Pumps</strong>
                              </li>
                            </ul>
                          </div>
                        }
                      >
                        <InfoCircleOutlined style={{ marginLeft: 2 }} />
                      </Tooltip>
                    </>
                  }
                  name="boreWell"
                  labelCol={{
                    xs: { span: 12 },
                    sm: { span: 8.5 },
                    xl: { span: 10 },
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
                  <Switch onChange={handleBoreChange} defaultChecked={false} size="large" />
                </Form.Item>
              </Col>

              <Col

                xs={24}
                lg={6}
                sm={12}
                md={12}
                xl={6}

                style={{ marginBottom: "-25px" }}
              >
                <Form.Item
                  label={
                    <>
                      Storage Facility{" "}
                      <Tooltip
                        placement="rightbottom"
                        title={
                          <div>
                            <p>
                              <strong>
                                Confirm if there is a Storage Facility by
                                toggling 'Yes'.
                              </strong>
                            </p>
                            <p>
                              <strong>
                                Types of Storage Facilities for Agriculture:
                              </strong>
                            </p>
                            <ul>
                              <li>
                                <strong>Warehouses</strong>
                              </li>
                              <li>
                                <strong>Cold Storage</strong>
                              </li>
                              <li>
                                <strong>Silos</strong>
                              </li>
                              <li>
                                <strong>Godowns</strong>
                              </li>
                              <li>
                                <strong>Refrigerated Containers</strong>
                              </li>
                            </ul>
                          </div>
                        }
                      >
                        <InfoCircleOutlined style={{ marginLeft: 2 }} />
                      </Tooltip>
                    </>
                  }
                  name="storageFacility"
                  labelCol={{
                    xs: { span: 12 },
                    sm: { span: 8.5 },
                    xl: { span: 10 },
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
                              <strong>Enter the Distance to Nearest Road in kilometers</strong>
                            </p>
                          </div>
                        }
                      >
                        <InfoCircleOutlined style={{ marginLeft: 2 }} />
                      </Tooltip>
                    </>
                  }
                  name="distanceFromRoad"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a size",
                    },

                    {
                      validator: (_, value) => {
                        if (value && value.toString().length > 2) {
                          return Promise.reject(new Error("Please enter a number with up to 2 digits"));
                        }
                        return Promise.resolve();
                      },
                    },
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
                    xl: { span: 24 },
                    lg: { span: 24 },
                  }}
                  className="road"
                >
                  <Input
                    type="number"
                    placeholder="Enter distance in Kms"
                    addonAfter="/km"
                  />
                </Form.Item>

              </Col>

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
                    <Option value="highway">Highway</Option>
                    <Option value="panchayat">Panchayat</Option>
                    <Option value="village">Village</Option>
                    <Option value="none">None</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={18} sm={24} md={24} xl={17}
              >
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
          </>
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

              <Row justify="center" align="middle" style={{ marginBottom: "4%" }}>
                <Col>
                  <Button onClick={isRecording ? stopRecording : startRecording} className={`px-6 py-3 rounded-lg font-medium ${isRecording ? "bg-red-500" : "bg-blue-500"} text-white transition`}>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                </Col>
              </Row>
              {audioURL && (
                <div className="mt-10">
                  <audio controls src={audioURL} className="w-full"></audio>
                  {/* <a href={audioURL} download={`${form.getFieldValue("userName") || "recording"}.wav`} className="block text-blue-600 underline text-center mt-2">Download Recording</a> */}
                </div>
              )}
              {(audioURL || cloudinaryURL) && (
                <Button onClick={clearRecording} className="mt-5 w-full px-4 py-2 bg-gray-500 text-white rounded-lg" style={{ marginLeft: "70%" }}>
                  Clear Recording
                </Button>
              )}
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
                backgroundColor: "#0D416B",
                color: "white",
                marginLeft: "20%",
              }}
              loading={loading} // Add loading state to the button
            >
              submit{/* Optional: Display spinner inside the button */}
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
    </Form >
    </>
  );
}

export default AddProperty;
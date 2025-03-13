import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Card,
  Row,
  Col,
  Tooltip,
  Empty,
  Pagination,
  Skeleton,
  Button,
  Modal,
  Form, Input
} from "antd";
import {
  InfoCircleOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faSeedling,
  faTag,
  faRuler,
} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {  _get, _put } from "../../../Service/apiClient";
import Meta from "antd/es/card/Meta";
import { toast } from "react-toastify";

const BuyersAgriculture = ({ filters }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isAuctoonViewModalVisible, setIsAuctionViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const targetCardRef = useRef(null);
  const [agentrole, setAgentRole] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  useEffect(() => {
    const storedRole = localStorage.getItem("agentrole");
    if (storedRole) {
      setAgentRole(parseInt(storedRole));  // Parse and store the agent role
    }
  }, [localStorage.getItem("agentrole")]);
  const [form] = Form.useForm();
  const [remainingTime, setRemainingTime] = useState('');
  const [backendMoney, setBackendMoney] = useState(0);
  const [requiredBid, setRequiredBid] = useState(0);
  const [enteredMoney, setEnteredMoney] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reservationAmount, setReservationAmount] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    console.log("called");
    if (selectedProperty) {
      const startDate = moment(selectedProperty?.auctionData?.[0]?.startDate);
      const endDate = moment(selectedProperty?.auctionData?.[0]?.endDate);
      const now = moment();

      const amount = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        : selectedProperty?.auctionData?.[0]?.mount;
      const initialBid = selectedProperty?.auctionData?.[0]?.buyers?.length > 0
        ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
        : selectedProperty?.auctionData?.[0]?.amount;
   
      setReservationAmount(initialBid);
      setBackendMoney(amount);
      setRequiredBid(initialBid);
      if (now.isBefore(startDate)) {
        setRemainingTime("Auction Not Yet Started");
      } else if (now.isBetween(startDate, endDate)) {
        setRemainingTime(calculateCountdown(endDate)); // Start countdown
      } else {
        setRemainingTime("Auction Ended");
      }
      const interval = setInterval(() => {
        const currentTime = moment();

        if (currentTime.isBefore(startDate)) {
          setRemainingTime("Auction Not Yet Started");
        } else if (currentTime.isBetween(startDate, endDate)) {
          setRemainingTime(calculateCountdown(endDate));
        } else {
          setRemainingTime("Auction Ended");
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedProperty]);
  const calculateCountdown = (endTime) => {
    const now = moment();
    const durationToEnd = moment.duration(endTime.diff(now));

    return `${durationToEnd.days()} Days ${durationToEnd.hours()} Hours ${durationToEnd.minutes()} Minutes`;
  };
  const handleMoneyChange = (e) => {
    const value = e.target.value;
    setEnteredMoney(value);
    if (parseFloat(value) > backendMoney) {
      setIsSubmitDisabled(false);
    } else if (parseFloat(value) > requiredBid) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        bidAmount: values.bidAmount,
        buyerName: localStorage.getItem("name"),
        buyerId: localStorage.getItem("userId"),
      };

      console.log("Payload:", payload);


      if (window.Razorpay) {
        const razorpayKeyId = "rzp_test_2OyfmpKkWZJRIP";
        const options = {
          key: razorpayKeyId,
          amount: (payload.bidAmount) * 100, // Razorpay accepts the amount in paise
          currency: "INR",
          name: "Auction Payment",
          description: "Payment for auction bid",
          handler: async function (response) {
            const requestData = {
              bidAmount: payload.bidAmount,
              buyerName: payload.buyerName,
              buyerId: payload.buyerId,
              transactionId: response.razorpay_payment_id,
              reservationAmount: payload.bidAmount,
            };

            console.log(requestData);
            try {
              const apiResponse = await _put(
                `auction/bid/${selectedProperty.auctionData._id}`,
                requestData,
                "Bid placed and payment successful!",
                "Failed to place bid or payment failed."
              );

              if (apiResponse?.status === 200 || apiResponse?.status === 201) {
                // Handle successful submission
                form.resetFields();
                setIsAuctionViewModalVisible(false);
              } else {
                console.log("Error submitting bid or payment");
              }
            } catch (error) {
              console.log("Error submitting bid and payment:", error);
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        // Open Razorpay payment gateway
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Razorpay script not loaded.");
        toast.error("Error: Razorpay script failed to load");
      }
    } catch (error) {
      console.log("Error in form submission:", error);
    }
  };
  const handleAcceptTerms = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleConfirmAndProceed = () => {
    if (isChecked) {
      setShowConfirmationModal(false);
      handleSubmit(); // Open Razorpay modal
    }
  };

  const handleCancel = () => {

    setIsAuctionViewModalVisible(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    if (filters) {
      { console.log("useeffect called") }
      fetchData();
    }
  }, []);
  useEffect(() => {
    console.log("filters", filters)
    applyFilters(filters);
  }, [filters]);
  const fetchData = async () => {
    try {
      const response = await _get(`/fields/getallfields`);
      const productsData = response.data.data;
      const initialWishlist = productsData
        .filter((item) => item.wishStatus === 1)
        .map((item) => item._id);
      setWishlist(initialWishlist);

      setData(response.data.data);
      setFilteredData(response.data.data);

      // applyFilters(filters, response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const formatPrice = (price) => {
    if (price >= 1_00_00_000) {
      return (price / 1_00_00_000).toFixed(1) + "Cr"; // Convert to Crores
    } else if (price >= 1_00_000) {
      return (price / 1_00_000).toFixed(1) + "L"; // Convert to Lakhs
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1) + "k"; // Convert to Thousands
    } else {
      return price.toString(); // Display as is for smaller values
    }
  };
  let data2;
  const fetchLocation = async () => {
    try {
      const type = localStorage.getItem("type");
      let searchText = "";
      if (filters !== undefined) {
        searchText = filters.searchText;
      }
      if (searchText === null) {
        searchText = "all"
      }
      const response = await _get(`/property/location/${type}/${searchText}`);
      data2 = response.data;
    }
    catch (error) {
      setFilteredData("");
    }
  };
  const applyFilters = async (filters) => {
    let filtered = [];
    let backendFilteredData = [];
    const amenityMapping = {
      "Electricity Facility": "Electricity Facility",
      "Bore Facility": "Bore Facility",
      "Storage Facility": "Storage Facility",

    };

    let amenitiesJson = "";
    if (filters.agricultureAmenities && filters.agricultureAmenities.length > 0) {
      const amenitiesObject = {};
      Object.keys(amenityMapping).forEach((amenity) => {
        amenitiesObject[amenityMapping[amenity]] = filters.agricultureAmenities.includes(amenity) ? "true" : "false";
      });
      amenitiesJson = JSON.stringify(amenitiesObject);
    }

    try {
      if (!filters.searchText && !filters.priceRange && !filters.sizeRange) {
        // Backend filtering

        const response = await _get(`/filterRoutes/agriSearch?litigation=${filters.litigation}&amenities=${amenitiesJson}&landType=${filters.landType}&location&minPrice&maxPrice&road=${filters.agricultureDistanceFromRoad}`);
        if (response.data && response.data.data.length > 0) {
          backendFilteredData = response.data.data;
        } else {
          console.warn("No data found for the selected filters.");
        }
      } else {
        // If searchText, priceRange, or sizeRange is present, perform backend fetch first and then apply frontend filters
        const response = await _get(`/filterRoutes/agriSearch?litigation=${filters.litigation}&amenities=${amenitiesJson}&landType=${filters.landType}&location&minPrice&maxPrice&road=${filters.agricultureDistanceFromRoad}`);
        backendFilteredData = response.data?.data || [];
      }

      filtered = backendFilteredData;

      // Frontend filtering
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase();
        if (searchText !== "" && searchText !== "all") {
          await fetchLocation();
          filtered = data2;
        }
      }
      console.log("hllp", filters.propertyName)
      let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
      const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
      if (nameSearch2 !== "") {
        filtered = filtered.filter((property) => {
          const nameMatch2 = isPropertyIdSearch
            ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
            : property.landDetails.title && property.landDetails.title.toLowerCase().includes(nameSearch2);

          return nameMatch2;
        });
      }

      if (filters.priceRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.landDetails.totalPrice) >= filters.priceRange[0] &&
            Number(property.landDetails.totalPrice) <= filters.priceRange[1]
        );
      }

      if (filters.sizeRange) {
        filtered = filtered.filter(
          (property) =>
            Number(property.landDetails.size) >= filters.sizeRange[0] &&
            Number(property.landDetails.size) <= filters.sizeRange[1]
        );
      }

      setFilteredData(filtered);
      console.log("Final Filtered Products:", filtered);

    } catch (error) {
      console.error("Error fetching products:", error);
      setFilteredData([]);
    }
  };
  // const applyFilters = async (filters, data) => {
  //   console.log("data", data);
  //   const searchText = filters.searchText;
  //   if (searchText != "" && searchText != "all") {
  //     await fetchLocation();
  //     data = data2;
  //   }
  //   console.log("filtered1", data);
  //   let filtered = data;
  //   console.log("filtered1", filtered);
  //   if (filters.priceRange) {
  //     filtered = filtered.filter(
  //       (property) =>
  //         Number(property.landDetails.totalPrice) >= filters.priceRange[0] &&
  //         Number(property.landDetails.totalPrice) <= filters.priceRange[1]
  //     );
  //   }
  //   if (filters.sizeRange) {
  //     filtered = filtered.filter(
  //       (property) =>
  //         Number(property.landDetails.size) >= filters.sizeRange[0] &&
  //         Number(property.landDetails.size) <= filters.sizeRange[1]
  //     );
  //   }
  //   let nameSearch2 = filters.propertyName ? filters.propertyName.toLowerCase() : "";
  //   const isPropertyIdSearch = /\d/.test(nameSearch2); // Matches property ID or property name
  //   if (nameSearch2 !== "") {
  //     filtered = filtered.filter((property) => {
  //       const nameMatch2 = isPropertyIdSearch
  //         ? property.propertyId && property.propertyId.toString().toLowerCase().includes(nameSearch2)
  //         : property.landDetails.title && property.landDetails.title.toLowerCase().includes(nameSearch2);

  //       return nameMatch2;
  //     });
  //   }
  //   console.log("filtered2", filtered);
  //   setFilteredData(filtered);
  //   localStorage.setItem("isLoading", false);
  // };
  const handleCardClick = (property) => {
    if (agentrole === 11) {
      navigate(`/dashboard/agent/agriculture/details/${property._id}`);
    } else {
      navigate(`/dashboard/buyer/agriculture/details/${property._id}`);
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState("6");
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (targetCardRef.current) {
      targetCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  { console.log("filtered", filteredData) };
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredData, currentPage, pageSize]);
  const handleViewAuction = (property) => {
    setSelectedProperty(property);
    setIsAuctionViewModalVisible(true);
  };

  return (
    <div style={{ padding: "0px 20px" }} ref={targetCardRef}>
      {
        data === null && (
          <Row
            className="cards-container"

            gutter={[24, 24]}
          >

            {[...Array(8)].map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
                <Card className="card-item" hoverable>
                  <Skeleton
                    active
                    avatar={false}
                    paragraph={{ rows: 1, width: "100%" }}
                    title={{ width: "100%" }}
                    style={{
                      height: "200px", // Set a fixed height for the square shape
                      width: "100%",   // Ensure it takes up the full width of the card


                      marginTop: "2%",
                      backgroundColor: "#f0f0f0", // Optional: for a background color
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )
      }
      <Row gutter={[24, 24]} justify="start">
        {data !== null && (
          data.length !== 0 ? (
            <>
              {filteredData.length === 0 ? (
                <Col
                  span={24}
                  style={{ textAlign: "centre" }}
                  className="content-container"
                >
                  <Empty description="No properties found, Please select other filters" />
                </Col>
              ) : (

                <>
                  {console.log("auct", paginatedData)}
                  {paginatedData.map((item) => (

                    <Col
                      key={item._id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={8}
                      xxl={6}
                    >
                      {console.log("auction", item.auctionStatus)}
                      <Card
                        hoverable
                        className="card-item"

                        cover={
                          <div style={{ position: "relative" }}>
                            {/* <img
                              src={item.landDetails.images[0]}
                              alt="field"
                              style={{
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                                width: "100%",
                                height: 170,
                                objectFit: "cover",
                                borderBottom: "none",
                              }}
                            /> */}
                            {item.landDetails.images.length === 0 ? (
                              <img
                                alt="property"
                                src={
                                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADgCAMAAADCMfHtAAAAk1BMVEX///8jHyAAAAAhHR4jHh8gHB0hHyAgHh/8/PwdGRr4+PgbGBkbFxj29vbx8fHn5+cXFBXl5eWioqLa2trPz8+0tLQQDA7e3t6urq67u7vCwsLOzs6zs7N6enqYmJiLi4s9OzxnZ2crKSqamppVU1SDg4M1MzRHRkZcXFxra2uHh4dDQUIpJyhNTExxcXEIAAVYV1jFl9WnAAAgAElEQVR4nNVdC5eyvK7GcBdERK2KA95Rxwv+/193khakRXTUcd5vn6y1v/3OjELTpsmTS1NN+3MKRtPJeJacd6ds2SI6ZtvL4jyLhnG/2/779/8hOb14lWzdEIAxFvquqbcKMl0vxN/lkHvZ/ns4CP7rob5B3Xi2XiJrIWfLaN0j3fQZgDc/R/3/R8sZDJMDQOiZlnWXM4Us3fRyMC+rgfNfj/0Jms6IO7f1cOWuZEif0Wk19+Puf83BI2rHZya4e4K5gkWVWxs37Tbq/deMNJMTn20I9fvMPEsug1P0v6d7RrPlR9jjpJs5LOL/qT05WQMzP8SeIMuHZfq/spBBGsKzmuUVMhmcB/81c0ijhLFCOj/MIVIIp/i/5u/8zO4zbDR4fshyliPhfxDheKat/2wuLfe/5bGH/P0wRIQsaOWYf9idk9kqGhNF6SbZXzL+h9D9af+6cPiveAwSCO1HQwuRhfki/Zp2O03fd4JR/DVbzAHy0HvM4+m/2I/t9AF/hkeWOxk/hTWd0XizxeV074u7C4t/jgKGR3ZPseghsO1s+pqqD6bpiT3Y0yHMGgXhr2i0huaxGEYI9nn4HrbsTpIjsDtM2mw5+TAXD2gGvqoGi+W0QgiT6W+wiDP9vgf9LBMW/wiVT5escZZNgPMntN40gfoMFuRD9IHn/0TOpllAfdiOP4WyOl8n8M3bfW7ZsP5zjdOf5zfYxcJNku8/q9D7e9awI41WGH599D03tALvBp1ZNmPfo4+/qjsLWQPq0WH/h+EO5wK34qkzSP9GkXfSJo/FCJf9P3kdasiB7t+8Tmcs/TtHzknZrVZDrPpHCifKbyYUzcP33zpxwTeEN6Jqw/kvZjWp6VDjH4Gp3kJ4n+rOP3x4Yh0tWOc3M5ln/wb0T7P8Rq36xw9vxl4W1m2EB+ln3/GAUrjRACZ8FMRNWV1QdLj8S7TfW99ocf2T+iaGuo7x8n+Bn2SKoO5D2jD71MMnUNNmNpv/+6Bt78Bqw7Bg85lHj0H1dA39U09+kb5vRAmSTzw3whVUtIzH/qu4yTR0a/oOzr9/alQTUTtHU/RfhaODbR3i5L9mcQyWIqP6ZwTjXXKS2oRbvx3PEOQcoIEO2r/WoXVa1cyG/TulMFGQmmWb8F+HoHEz1j1w+H73UQ4+TJ0uL/y8G/g6jerw4325GtUEIpz/b+RnEUIqm1F/F8AFS3Wu2PafRizvEroBWzWZYMN7IZStMlNWePrfSVm2ayya5jvO1Fl1l9j64+P8BTkndfq9+evylSqb0GIn7X+q3gVZtGUe2f7VJ6g6+X9KRAW11U1ECvWlIXYUr9ry3xCCv6bOXN2LL2qbky+HRd3W/0rNgEyBrbgatvfKNpopm1CH/80Snp7i1tn+7vmvqljGgunfjfJXNFVZfB7btJemwuD4L0f5C3LQ81HklD0LKs9Kejd/G9gi9SbRbPM9iyajv9HF34rR9g/PfStWXLDwfUs/OIcAoR8iAcDuTzbzWgkz5k8FONuKijKP76rR3kVJ5up/A4o6x3K0XO7gGTndyIGC97XMkNVLbeBPUkYDBZq4TyCTgbJ5YfXmi1c3cbGW/zfxj1TZVE/o07nsMr29CcdNicbwb3DDSRYW+8eXKKE1M3zT5Z02MIjz+zflIl2ldoP9EHwLmGxD4c2ceWCroRTT9X3UeeHL+P85Gsrz+ZM3nEhqxvIXb75SKCvLosptK8zheDp/J5mpW28+7ydayCbDe2gUq8gMVZXDm/vGKTW4YegMFsOu1hsnJ8uyvdN5Np5+3k3pyotoPNwMC1nNvI3WgnJj2CxMO1p3tgTmc6apyJSK8T+tciKZRX15/4MDWc1423ffFxR5MBNSR+vvIKwZDi9ffjpesH1yaS7yUN6MX2lXKQ2zkdZdNNTYWp/3VhQrbi7vmf2pvITsF/aZZtTKd20tChX+9EJ6zePHYz6J/KK7Zn8t1cvZ7Bd7JQkNskvBSQU2era0UPsYxrtW6AF15Rqxe4som2mLvQjXFLEb51Z4wefVou/GMqZXGPlfwLdUzhDf2Yk7KVFu2q/JUVd5ZB/so1NPPNKL+2Qp4U8Mv+NJ8qJnTR8ZSSGBl/36SMlJdY4wTRuAW3jWDuyvilQiyRk2GnNk8l61X0UfJ9Uzuuxn0FQGDt1g8Wdl99JONNzT7d878i58dQn7M1UvRVlzGbH3l6kBaRGNJmd0JY3JfIAKmh9+VJXXrJlBBIK/Cfr8QI4lqdPwRps5WbVRrVfLgYKhKhRRo/MkWPzDQhVlkW6sXSwNyrRfBMfRl+KUTW+1aEWw48vdj9L006GpQHYUbzbaXnJA2IvVVO1oL1vP4N6RieLp84BiALAgTkdf4+HnAo2ysvRquibIK9VnwYuefdRTlPPaVw4w18lCpywA7sWNWwAsB9h/CKb2FG2pht3kneO/aJGdfU9ObFCI5hGDZkaaiLD3uQB1Rgjbz9gQGbTUJPEkAaxXgf/XJIIKAXVsOijxYCOGC82Zh1t1Vj3YfEJWJ7I2UXCNnMUxjy8+dqvtpMDBilsl+6aiWJ7bEaC2VvQCAuH5BypZHE+SHsX9iyQ9G76oZ8YbDaSATkbSwKzh3ROFbIzIHMW6HnB0P+E0fku6RhHTg4RanwqMV+RAbypBzcDzTQbfTnB3EfOJtvDB0Ra3FbHDX3PYl6rUZGGUIznmk/mbklYnbSYPLTnOZ91acEghxFOWi3tkWT+f+ZGiucyz5DeVNJYmnL32lgC92a2y7ELpdMGsl4aXLwhGgMaqlqPmk/uBs2mpFPCVfFxZyb6Y0U6g3QW4dSYDWJ4azzDrzBkzd611b8TYPO3h19nYvmz2rji/LZ0ucl8T0j66s2No8jcd/NvNEQLi8Ij4CZ2betEcn/MUfr0X57JKKdGnHKhir/mna0C9ca9aJ02Xtxy6F40Z5lyZ7JJy9Jt/W98puzXXZ6WVirVeiyEivGy3rbtbd1xB8LzcH37SQ+cYGjg0WnoefEP+uzSjvFxh6autq/pw/W6osYkCM9yjJ3F32ruHQtsw/6us+GerKEQOO70GDlveXFvk3q8i4u1jJaZlULsjgQv/pcLwhKGQblh+d0jCZriwaZOWExxOLj4p8qDRSWZnbcu2vwJwC7/CNUXmRVrX18IXA6Coasu9H9Qhv9qGLcldCRmBe6Js3LYaVS1EzvF30UbZ9BUwSXKNrZdsRWZ6a9KYD5JwM3SP+C69BmOPXBWEZ23ZyKEN/dHvbMZI8r8LvXmultVsjDPeIfQN8Akpe6h+Y3HAu+cVikbPtrQn9KWi1iXyMlRQ7BfaxpGmzuOFYE5WgY/whZwobSTERfOnELNU9iLeD93FPcyToP2Zv8kekYRf3MzR1KBDeKP3nbvW4xxSfgB1yRMZjvhGcbJodq/xC8Rt6zdh41V1VNLm4QrZgDRYw3sOP37NQCFYhe7855eub9bLXI/veR+m6cTwaiRFIjn/wuVL9tPgNsiW3DHna69lILQ9uU+UybSb8Mv4TkyVxzr3+fvJjaB4G60kj4tKNVBGg3s/Zo05Gh4xhAEK6ROKb9DAoX/O7obkYBrA+wlarYgMG60iMCxtzCa9P7VnTQXUW48vecSeKeYaNgnkg+5JqNJTeKEetka7Sq255F4cJYeqIYARnI8NW4KvCvohJ1c//oxA7gvkHcpT7RdZdkmHGSZiNk/isCk3e0obkNzeoy4cexR594m5fplDNCZDeLeaR3qdYYSBEm5otGyX+FYOu+ge4Lcj1IfPuFu3xuInQsM8fzFgVJGiTEdKkqFRRafp7KbuRMTmIEYr8Iy9b/B279DVqkB/8vbZya6Uu8ThxVX+W29Um/Gxc6MuLzwuCVMUeHjCEeg8y6FfKgnD3GrZuzVZbQnDsIm8R3Sv6fMBjDa1xRXBXAPwu/UESDMdn2wbCVXgFibDt4GNKXE4Lt02oqbUMFKWBjXVLWqn7NPCezJ+vPipNV9B+aD8oGFmgWe96ShuqwlF87CpXn7HDUqW2lkNEInohJ5ZtvFcoHr1pDKFQIyGHg9f6bsFqRKoR8R1rji8zQxz+iKXTYHX3MUTu7kB5zXQ5FkOScAKvWAvu+9a/UQy+XttV/HLmjPQPdhoO3aRfsPXnXNoPrUNnzUX5lxKgln5+PzmcSRJLtFcryuZvXdaYR7izpPD0RWHTwYf4/upqIoMclilXLR9HLypayTdgjp5XumdewUKCcTayZMMcMXhk/miyWMO3dB33ZZuhGclUZ1/HV4K/V1JLh7KNB60FaKf3/ESvmCvTcCeX982KznU/edqGh5z6C42yeJkM8DtIA/OPYzfy7jJrudRk96U34mooysTaEeXXWtheBbUMAwB3Z+gx1Jqzs9pzNvwT1U3BIbeW7hGecgzHGoH3IQrVhVQi8ggcvhsoqr5dELFoh8C7KY3n3QXyTOQ6QMcztiBPOfrkZDSozWePejzBDC1fThM659k0VtpjNc5HJDHvfCvR2hKf+R+uXGNus/YQ9uD71p2308O74jpUC5ZeopDDVhCNs0qTEZZIuY9G0xxHnTQlXmEUzuTIay+PMMbHH7lModHiUNJl7aDbreCMQlDTGPpFJHmPxcwofQ52k1L6XSC4Oqr3An/cnKRyglgC8k+o7YOd5I2dRwcVa8YFf272xuJH/Fd3V7XKX4fSPawtdSyysUPF5PBqNcdDabx5OtrMoyiFJ1DMoMxxeYJq7nCZBSP4C7HVxyPv+JpPIzo4oZIm9K3VhH+ejqNo82ZB+sKQ15YJYVBc7dYz20AyH3XNP1a3NEMKcIw283t5eHyHQ0H/dE0Si5HsA7ndDwdTCer826H/+wHQX98nuNzLpFsVOfaQfI0ZoNJtJrNqO/2MO6PRgFOU5/CJW3PPYqMnzgzKzSeyBfP8LOTyXiV0qUNq0jDLw0mabLOsnWyivtiyjcVokanSz29m80GjhYM4tVml2W1tS6aeUeTfpcurBlvtiFYl9kQH4sMJVmYJcMRSUp3vDgid8sNHcmRsqQIKyWp8Hf9HlnwNg4xmp3X8yzb7pIxrdrCQ6VGB/dECrWT08rzBGR3tk+S9Euw0oeuc8Y3rTfDQSBENxgMHaUwEMHnTCletEPIvouwk3KooGXCvDBQ7UG0yACs85j3mA4m3weA4yYW89efzSFncPwWd5yMpSoPxKWSp+EtJun5ktFU7DbRZCBd5DMBxIxcNl2evKEcoEgiy3uwe1hoo6i8F8fpjzdrE2CO/5Za5pLYfavWw3JD8PbjAL00iXUXstIA73BM61Q00G7HG5LF3bhA5f1NBmHIyvK/YLyU+0H4Z9l7skPrlKwmowqJBShvC9oIHduEXo/HP3jIkfviijXG2ehYUeEPF1uChWGYU7hFtnIcJexvzIfpoxbbVrFbD7acv/YKl3c87ot39aM1cgf7STH53XQJoefBIaJBd6c4R8yU9Xa40b4Vmb2qre4UF4CgIkBGU3f20XukpLXBsx2Uo64SVUH8jW9wtudNn7pybw4h5KFL1yDNz7wv+1cVDBIngpytXKdhif05whcY5fqtuanvzaRzuv1ZBjii3aRYAmdyAWbrLC+Wr+Owk4U/HzJpPldySZsok+r0hzMuqqjdlot0KpRwDCbrCBXKuzMsTYNxW9GJv7eM47kd9JkWzOkeHd0Mgc03cRneOUt9SPJA60+1zrLeXI40c2FUfFjzaZjs8mvVNGePwXxVPpOOxLktM/dm4jfxaBhlbotgQ6bEab7koj1UxFt+ARX+b5fGUvzJOZosLaoLSNlEuYBsY2SIubQlzrAaJxyy+rjpk4kcvJpX+5COWSb41V5u1/vndTWuSj3Ykd7pfx/BL5s/Ogdgnnyjx2BBPYbN3I7EgsZOO9wjsMwPfc2RYm35RIb9hgHMp+4Ah+Trxrn+DnWvLZKpFObuMFxT/PUFJ+NM/9iA1T4OtCRHMYpqsVw59+Qt6DR12K41tWjxsoKlqYewx2+PVqg+TFOEh7pn2rjgVbeyTA6AIMGE5RWjxOHX1jdcLtMyRsQ9IeWFDPwEbL9jNUzZjWcU7O9TlikVu4ecYd9kGsUVFyKNPQMYxvib43lyG3SVC1tZqnVQwX4r1TZXDhnbdIVAmi0jtLispuS8fWXj8rmd6EgnqpC/IgnRPp6nzpa5LdjyqZVLdaCnyWWS7k6RLa3dj84ZgzwTkmYvi+kgT1GYjXax6VPwEDzMEOzdsIfTINtxNDH9bMVFJFEVKnQ0OxnEyVL0uNbzNT0szpiN37kapSC1qGOzjuvXFkmxjrbPYXlE7VTEPCR/m9yhtqdsyys5/dXuiEjK1FEOacdFzIKhaKJo4l46+lJsClEKDAZ3fKmuXBFJZfKdcrQHGaLpYbu9RKEPTV4IL1paj3ZgGlZ4Ddd0Zh63doxFV1E5xAixzFZ4LDeppDz54WqpzvMaThxFu5Cf3XXxjcmELww6iOahQF8o3VlYpaRiMPy1dpk3sOdoo6WMUxSHqyufnzWPTlCe50ONQALXPUNoS6GEdsovh8DNlJSy0t05GyCUBrsry1KojR9D2nvqz90v3NXInWHirlyvKqWBKp/thY5HO7qturr0Qcet2W8uDh2rbQ49Jeo8lXIoKPWF32njEqE09a63vNi8vNNZ5cwySEDLNikO8mlnkzy0XCm1MqivmQRTjXBACC/UDQMNmrWfVLvK4SVQraLG2Fxq6ytDgacbaCN3TYmUzrmmMWvhR6ku291y6GPZNstnjjbYQ3gt+SfVNrE4GG7ly8rt3+67Y4YrxLLrQsSDnqTBePhQdvmtopF9iAYtvgmjHcxWOVwIFmXUxjmFiEcGo6Z2sJNjHZ3VgmdSkYa/4C4L8vcdtMcHiT/huR4INVgezCQx7wOkyGC+q8Y6gnn9ZEW9DNJAFFy/aKS/Kao2+EvxP2x4Lsf6jQ41zv/iNis9ONECKnZdVxdaijsZ4YqiXf4yHU0WrNYZxd8It8OGk2xquyiADJ9ZHYjrTMaJclyWbIPSxALnqLxoxCkNx+Ab9Tdtn45ncym1aCNuCs3JBwmTPnchJHImJ/DqVzzaoZoFkGA/VTzsPHe3WgB49SJ3qmceM9uTt/p3pK2WZ9+qeqqSs86YpLhbJq+JUvq1eLvKYBMycQbfLulv0dDsOyyH7J42xWpQatC0cVsqNQD9hN10w6czzltlCR1pcvUWryPzw6ZiMBrpFL336wJO24gxjlHuW9JdEAtYdHtK65KiyEDK1LRkIXIstJYL0ClcAnOSwVF1msE+WVz26WiPFc5QC1VyHUSIIm/vgkIlryQbe6pTNWtsalNQTgUH0gJGbDJAX8Cy2bbq2zyBEFL5cEyp1+RAupSxa2vRMiAW0AsqEe+uEgGfC0CHrwL0tpWTMz37t/2FaE7gIO/U/mKm1Gigulzfv7kLRahz/fZoguAazpxzRb2hNLKj8jWhK5QC/tLmx2fW1awMRXaUVcIhNc4QhZocW3qnKRTB4h5CSr8pcmgypRigj177VI5ZeCftti76SmrouQt7J2I8yiAdukXAeFN7VYhkWzo/a/KeHHQfkYfgcwIHR1Mqoso9y9Un0ommPZ9kHBI6X9ubLh+C3NxLJUA+2IFr4pxI6X3cxumDsHGlqHuoAD1mDpY8plX+Nth024hPlqpDdk3b72QD0ueBAVu0pzmxWu8s3mKfP8YjWMqnXV+OwW6jR+rlTWJmIXg4jKXHINb0uYEPqiknhNxcNFznMIZFJwlNtmwpjamPkI5vbm67FhkoJ4QzcQsR9ZBLcNnZTmXx6ibweDfvXxQmcxgHSd5wONayEdguN/L+653FQRM0cVJmGJ/WdABDmvjy+86c2QQ8DTe8PhYFNAnZknaQchXWFV4ozzZFrDnpDwZ0zDPM1fKFq77jea9vwhnmIcxSnBe+tJUv74YsB3ZZ9eUp6szKbi7o3Er1Z7gcSdMJm+vfhSpodzraCIWC3u9JW9MaoZrnC5OcJCV+Pa3k1Gafx2gybvADZqqVntfjDOHmKt8m6hH9evbX5fcegrs+r266JUbVxXGINtZ+aXzQr6gPosahgB8DAHu35qwsZU8WARWPipoHuY5d8u/2sn+jH3tBbzQqcg4R6Gwhj7O0LVzGl/KobJcuZYbtbhbFvSZPeLKs7JI719r59TQtGsPhIyG92ulZbvNLL0OpKW7/NJ3kHgmEzpSUhZTd/JIzCTYoPY4Ops3koo+2KRaRjKkjNS3UPbZNonhUfNcZ1WvkRmvZTPpi4xUcohBeHgip1QpLhi4u+jcW25ZDjLtoPCDxWqHo9yErU6nyIOBLW4hMPu3LXgWZQEXdlGdfoqohFE8HH4rndUbxKpnvati9863cokJnpSr0wY3ho5to9ZZDZznn88NBx3Gy03WEk7CtbT1RV4Aeq5xCVo5WyEe561lEqpKWWWwLl5ZsUaWiDN5AoDdJF4ecJLVeYPBl1/d6X9tXhYhfdztpFBxSZGAEnkf2wA7XlZDFsC3n3EPjfZYbJ8iuqFIBUSsCcsjKy4IquvlQoA9dA5sjZd7uYgPUrdR1YV7PTCOoo4Cp1IfABse5In4dJHlvJELevXYsMKPSJrQP+UaEBmwKq8mbWalPVQ501itXOVRjldEQxY2IYOlAAmzOLm89FWzFKjG7XrPizG7dIXctyWX4rcQb73C4h0NGJ/3ZWpb/AGyIuB9NwFxeqdqBZhn03hwv4BIk9f5a0SJSts1EWY3pNOFQCzLa6i0fvuuhgSn1qqm3kUBNPLly+IOeaYnEbCIAoVJ+5vB4nUlom6PIuTSTudrpSnZcbrtwZp5yu1KHYoowQP0OEW5Fuj1rtORDFC54tzTy+H/thDToTZ8MnJ8iImZQjEeEKB5weKAIGs98XeQVjLd9tBK6XZxJk+qdUfXVa2Jl7utBM/LjDEOE2IOhiGHD4OKxZAS6y6bagO/GkCPhdiSBjdhr1CDU/aMIlhqk4/uB9XAR6agkzohtherZxB5AcVyEe2+7KttjePJaE8nZIfOm6V8ElkHhJvxnQuJN9d2DbbgcIQRG8MMjhjYsaO3H8nWIm0ZPkSvy65yS7Yege3xUZEsckqtF7TTKxzv7DkmX+BqX0b4c17upTVVaJt52jNtxKEjuYp/KP3BHQz+C8cXP0Y4kVLnvMlribpUdwpEs7hV7hUkFu/FlEey04NAQFkClIDg88TrjcC7NXhcQ1xTRSJ0jcxmambfHQOZyt7Z58csyLaEF/MQn1zbkMqKY4jPjDUMV259T++/8RGIf7eQtfH7UOaI0gKQmMxd9dWfTEIFiCe9NSghz7bmZ/PQ+MDrfKQwI6QjFg244HBMpBqO0aNNySQZc85Gc0oXNMecwAtvEf7p0GTE9MDgpWvhB2AXVwqmYUVTyfFujNepfFAcaUW4Sc+Hh0UTLYz3ZG0dblSfCmzN5kEhpx9ZwsMJRGgiLRUTFOCznIkLjx/NNFEqfEoddMPOIWzUvJAwTq4cWOncv2TbM5TWlaDBHFJ7z7i39jYWooWxx/hVE4PJR5WNCn5Wd7lA+BFBJpRGxxfec0omjsWT9W9Z6EJ9IZ6Jqjstr8vhsFkzgisJoFurHDuWlGY8RJrW9fd9ZMLzzFUCyFc6MSGhBQvPenUSz2Sya9LROZJdbkzd7qfzoDmlO6v5vAW1E0R1CBmzNh6a6siYyuOD14dTGAYiRd+jqoELNUrp0MDfZKqJit8QhCRWSXWnh5K5ypPhK0eVAzzvX7qo2y6v8ZXeyCFl5zwodBFlI89fjfbRQzi2LTzstrlLUeOdcxV4xSYhUxp2QINKkiGhxZSyClighDF0uRuvELVH/KOahO7jzOIUocij+igohlmbWBZiv9+fFKQOQgi6ICTryDghsE6FNGSIQlb1y95LWnZrNeqDEgj4u05q24IkvzRhsQ7TjQ7Xlrj3jiK4aZ/ALhIEZ1cvdGwnVZ7EN0WXVLvLQcKtTZ2xXxUE3x1bwO2xfCLrJezAoVQFXW1An6WSicE2ztWlQnCYtYhp0LQTfiaSYCcnZLR5GjEAEhEeJpOzun0Dwz+UfafoP3q1nyNtkSyfO6tb7C9Ue5TK5fuezqhTE3S277dd75aE7zzJSkwksSd9Q8Sefn275SR4KmYFohB4oB0CcrCGwT8XhNElCwrhOf2BUytlWvZ1OcSOCWA8d7amj2jr3fo/nm9ZNOmyEzb/kVlcTgkxqquSQdydMgXxP5P+g2qAGZWp7VKqDmlFoF54oD9gj715wqPhLbBdL3tatpbi/hLfl2P71Ps7OPCTIRrcP0rCIQ0T0NonsEArzeqjL0i2mOSbpZNrvliPCtZnUOqo3ka10epiCjz52GcUWW04JpT1YQjWfRyqsQkk9EG7+yaWkOo7QyDKb0r7kgnI9t7g1sosb4L1PJ73r8roLtGzBT95v3Xx3Eea7eVnYxddL3fIPDxCrq60EOqZCm+Ayc4CBkxdk9PckFBV86W0aP9DirJZF9MOc6n/ECuDoZiklXn8oAq9hTLlXHy/ibSsXFfxwG4AaEFIyPqmATbjrLiSl6ABROCEA06Tavrjhro9uNNDiC9RiUDioQKhP6HS5HnxgOQWHNVcnqaSfL6GS1/6pPUuZhxJfERqkpBMjAXcyF7q0hlmXgMNMuL1dL288YbubaL2ZVwqrQRYAcVqhgxipRc35SUyVDu6d0ajrXOGSSSOK5XoW68fWpF9KdUgVuQhQPYTcrA8hHwe4hvMx/tQuLls4Send4JItT6nQq86ejTVnOJecBkppcZ0t4pnDSOs8PveldBtF04tCVD6MFGmgCLnd+vEk1tpTlpzv2lWsBXPijYr1tCzcoXrR5/uAHEX+iRRk2fgC16XOguWQ0kAbbUKxI6lrSZHI5GpwCusGK6WQbgnx6HBgDoZulAya5BFfQmVNfj52OlJqmISrnOKwrIRqZHkBDhwp/8HR7YJrWN5ET6yZ5qTnCbfnVMVDX44B/bwelcNC7hoP0s4AAArASURBVPJLUopaZzICI2biCt1tcyLGsCxHNlPr8HmZjdoY/am715T27eLalhj16A43de/IY98WG0DoksB3xCJv3Wvwqr2AMBdzXLbmwW0Wwp5wwmoLl+qeLZRS5+ASwgkeNR6+dm1AD3EZyw2DdM/hhVryEj7V9OVoy6iXEIQDNvqk16KATqcTbbi3NADa6lSZWFaa7aQp1gsWIzoUJgq3B0F1UztySPiWWt5uvRqLRst0PT/0RE6weG1oow/p9EEvPoyAPJATx8az9+bStFQcGj6sO985S+vmrtMmRIrD7pj2tQvPulYyKgBlwigbDFnUFmV+xdpsOQrUj20UPes6SnQWCNll68U52ZNhvzZ4pPgjW/bH5akmXLCLej7j2UtHZnntMvUwXsTxeDXbbGZpNIlHV2a7kcPFuphmp8Zgy10KzSYky6SzaVWCAvcM6Ry63KeK9OFi24uIn6zoj5NDi3RTrI3PSdQXgTUT0i0XTAORxkbZwCZ7+mD0oabbdPPIS/cZJ1TXy8VqWrLpHCAswo+Lm/Bv0VJRRDIprCZNOk7LlCwlQienCFeYYImSumC4sIFxE0NbfTTqTTe7oiQ9LEpmeNRdoleazd0WDYT7aLZb5rz82jBM080hPKUF5BnshTQmFDdWySq0Nw8CsUip7cYfuxsLPKpq5R66CdmYY4B4EVZVOYTrF3C8jLtqtynzoA7TeqVRmdo2nrujpHC0bvydQe4XZa24XbJvweSgzb9EqUP10mzLZtwsBpZuXI8bFCSOlkxOBFSj3DCYzSWhvTpy9sqpoNBQhlsdRuoRv3CmOqA/30em0O4mBOEWpwG64x2Q8Ua+bSqVmZc19FPrezgYDcZKMrtlFygKFw+HKpC98N5t1mnz+RltYpQaUxSOBjPI9aLGU/CIOJb3RgnHOxXFe6rj8mJPIudo3pgoncGZS2PwtYNrU1c3D8XVD1dLNNgq0pPzP6AZczOlLMtd44+7AnI6dkbcOhG72cqistZ0/fP5Tg87weCrt/z1mX1rhe0QdkL/d1dZmZdHQWScR+eKvWcgfTkU53oiQJQ2ldrSIkiYhT5sJ1yM+dEXdLZuIx9hiso9XB/MY3bztysZ4estNMYNLyMerxmP6QKKBiCWzryVg9b3Miz+KEMpXTQNadOJjAFc47Z0kMvipw7mRUlYcOsw88X50ubn1dpvWfr9cIf7zpXMm2YoxWFDIOQyvZbJ2nD8Iie5Nb5h0SqSsZuQ9QKIGcJ/P9QBXTHhmhtoImj1h6UKk8iimuV+e3omgbmP7Az9vZ5Sl8aAp004eACJeCT6RTTvqHZQ1U8jxNEnodGkS16LK/P6gOq8NwPmwSJhk6QXFB1MQ0optZsWED2U3ZCWn4/k0aUZ77Vzb9cP5RZPiwnmX2HqZAuFUjJhrSPIc8Xb1pJHKOJZmZtPtEmWdtBFcNpOn47SGIYVHpDBfnaTPTQZnCLUUilF2O8zR6y/3Qa86zWxSFAfEbOXlenYyQGKw3fcSOuCocCzylLo4jqJlBmUQ+P6aMKOfGIMgzM4hBr0NuikIYnJ5LglDfwwy/+Lm10GTVuf6k55FAP5SwRimRzlo7e2wDGdzmhWDBzKdI6VL8609m27qB2zPEKuqXquBsF+KKAETh6KdvQ4BnCv2fZT1BiZR6yPnjbPQp3LWFVU3Y1rwvGayu+KG94Fy1QVhJqDvrES7oHrM0o6nOW3WLj59kKseaTOTygDcl9MLfZcm6N7NLlVqIZ/4BwecfITnOA1ZzJIoPAf5pTPL3W3syUWiwtIKabGSyR4uQoa19P3bKR1TrJLicajuP9xKCKR6ASe3PtSilL+y3v4hg02A0Y95JBOIyR9DV3jPXdaBvMc0W/IjdvQ+iqKADpU2yWy0BSssPgmjdDW+nDmU9M+yMd0ryCHlLRQRCmB2bschvNfXzTYcEFcOOO5JwpE0aiNkAdQqLoLdgTR2ntEmajeLhSoCUinCmEeQeEq45ChuMesM7+KNy5qYYOcwgjxl0XBg2Bj+I6lv2Wx/lj9OMxbOnHo8BIOxG3CLYi51u7boc1jaikHw7SXRS0rYlMez4lxAng4vS0xqPuwKaDtOIMKFYfjuwXgBjL4gRtNnZvzuqQtaQPQw0WJhoUmoiwvJQDa4sf2N0VxwYYVXae1fci16prxA76jU7cz98VQUWjLQ5NflqLB2dfdSJxFe/Ajl0U17cUirLW5oo3yjGN54NBCFo8enboJlmZxcjTiMKELGW3cFBKtWEHLLBE96RfVq0H0cy+ZXFUK/5piaAC9tD7tKtTFilOqvUo1UpkWqXIUAigOWdPazah0o7ODfFTeqM2yIosXz28sMMSHJhegpZb1/poonlLnkTJT1RYJeaEcV6T78pcW3YpEDvDcExaxHWoUcKSEzjx0L2dx9XN14KsL9S4E1LTt5kIaTvbb7U2babQM6xWUBqyDa6m2z5X2DPgGm8GVQ3Ex7gSKWgOer+1QE3qX+tCJmZoLrRrEZUxO5VCNUJdkwYuXNv1IwZaV54Gu5IWlT2rSfiPH1+Rp8fJ0M32cl0rUrvjuWtdg3rVsNSLM2tCJPlzUo8Xia39wTzuqkPoyFuJjifvMV1wh8SX5EkFl/nkKgUXKVTRoIspBe6HYgaMTEJRfNSiV23AKWk77T+76TBu9/lbpvcSFxvVIqcoWBqc7YJZkmbclHxY7iBjuijxcVM5P9sjMT5++2LugGJqzYNza9a+xGZ7el3AC3bwr9+m8NouwqUsAqZ0LnzsEdI/gS0V/eA9msM1Fv0SV3PNITglZKKld2pTlL9gGkcHVC694L0YaAxdag7RR88UlVzJahuX9xRasaAbm7e2G6M8lSkDfcP2ptq/qZHABj+WwKgNT6JhZ6RxSQvJx5QnOrQXb929NeIpii4mArsKmHdZGRl0kT1e14S60TRFoqM6RCGjqXK1ni7yVnxoOm0rDgb+hzl6I36OLOHkF/jjwzFLZQr9f2OciW2QVKxjM5cPO/YdFCxYi/OOf6NA6TVh4R6nKHNp0FqOsvkNdJESylFFLHMIeHZWaya8HV+7xyOJHLrp8gjrnhm4CteFQQja9+pY29It4W3k+k4ceBrkrGTvDT4L0bskmuS+/u83rJZpm8IOY8jVJr0UW/r6oUKUvGXzLUZeEWjGUfpu1uFL44rWFv6Y0f3yOh1OelAlFEdrvlBE2EJXvP87RlVxY/LEKvaXuuR7jvCVLOspM8anioKC4CWhQX8E7RJl9tR3DP6P+5cftWBFl+svzCSbV1vfvHBi6JReWf2rjH9H09DSPunU6lcdywkVyXtymYZqJUt//FX+cx3XjRZWNS3Etvjfc0PevzXx+4G85/kcW4j6PF/jZPL5H6P1nv79A9wPUT4D9qHReJzuEyy9v7PwcdajLofHovvEXyUIv0/x+72KEv6LpmcFzLa1/JttkcGlov/hfU/C1ztnz5uMuIXvz6H9r+SrqjteQN/fgeUw8cE7BRx/ZS/8h/HyDguHZA+brlrorf/K1KJzlhQCL8T8HZ+9QP9odea9ddZHuk276ObB1Ov3f23t3yRmNk4MFuDFNvaH0qCDL1nUvRObm52jwgTTZP6egP5wtlh4v26SGGWa1Zq4fijrO424zHvxRbPBfUbs7iL9W3+fFer4UDC7n691+k45juSf6n9H/AeEQ9GdNoAigAAAAAElFTkSuQmCC"
                                }
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ) : (
                              <img
                                alt="property"
                                src={item.landDetails.images[0]}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            )}

                            <div
                              style={{
                                position: "absolute",
                                top: "1px",
                                left: "0px",
                                backgroundColor: "#ffc107",
                                color: "#000",
                                padding: "5px 10px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTag}
                                style={{ marginRight: "5px" }}
                              />
                              ₹{formatPrice(item.landDetails.totalPrice)}

                            </div>

                            {item.auctionStatus && item.auctionStatus.toLowerCase() === "active" && (

                              <Button
                                style={{
                                  position: "absolute",
                                  top: "1px",
                                  right: "0px",
                                  backgroundColor: "#ffc107",
                                  color: "#000",
                                  padding: "5px 10px",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                onClick={(e) => handleViewAuction(item, e)}
                              >
                                Participate in Auction
                              </Button>
                            )}


                          </div>
                        }
                        style={{ backgroundColor: "rgba(159, 159, 167, 0.23)" }}
                      >


                        <Meta
                          title={item.title}
                          description={
                            <>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "black",
                                  }}
                                >
                                  <b> <span style={{ marginLeft: "3px" }}> {item.landDetails.title} ({item.propertyId})</span> </b>
                                </p>

                                <p
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "black",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    style={{ marginRight: "8px" }}
                                  />
                                  {item.address.district}
                                </p>
                              </div>
                              {console.log("item", item)}
                              <Row
                                gutter={[16, 0]}
                                style={{ marginTop: "20px" }}
                              >
                                <Col
                                  span={8}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faSeedling}
                                    style={{ color: "#0d416b", marginRight: "1%" }}
                                  />

                                  <span
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: "100%",
                                      display: "block",
                                      textAlign: "center",
                                      color: "black"
                                    }}
                                  >
                                    {item.landDetails.landType.toLowerCase() === "wetland"
                                      ? "WetLand"
                                      : "DryLand"}

                                  </span>
                                </Col>

                                <Col
                                  span={8}
                                  style={{
                                    alignItems: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faRuler}
                                    style={{ color: "#0d416b", marginRight: "1%" }}
                                  />

                                  <span
                                    style={{


                                      maxWidth: "100%",

                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    {item.landDetails.size}
                                    <small> {item.landDetails.sizeUnit}</small>
                                  </span>
                                </Col>

                                <Col
                                  span={8}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <button
                                    style={{
                                      background: "#0D416B",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "7px",
                                      marginTop: "4%",
                                      marginBottom: "4%",
                                      width: "100px",
                                      float: "right",
                                    }}
                                    onClick={() => handleCardClick(item)}
                                  >
                                    View More
                                  </button>
                                </Col>

                              </Row>

                            </>
                          }

                        />
                      </Card>

                    </Col>
                  ))}
                  {filteredData.length > 6 && (
                    <Col span={24} style={{ marginLeft: "60%" }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        showSizeChanger
                        pageSizeOptions={["6", "12", "18", "24"]}
                      />
                    </Col>
                  )}
                </>
              )}
            </>
          ) : (
            <h2>{t("dashboard.e1")}</h2>
          )
        )}
      </Row >
      <Modal
        title="Auction Details"
        visible={isAuctoonViewModalVisible}
        onCancel={handleCancel}
        onOk={() => setShowConfirmationModal(true)}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ disabled: isSubmitDisabled }}  // Disable submit button if auction is not active
      >
        <Form form={form} layout="horizontal">
          {/* Countdown Display */}
          <div style={{ fontWeight: 'bold', color: 'red', marginBottom: "2%", marginLeft: "24%" }}>
            Ends In {remainingTime ? remainingTime : 'Auction Ended'}
          </div>

          {/* Property Start Date */}
          <Row gutter={[16, 16]} style={{ marginBottom: "5%" }}>
            <Col span={12}><b>Start Date:</b> {selectedProperty?.auctionData?.[0]?.startDate ? moment(selectedProperty?.auctionData.startDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}><b>End Date:</b> {selectedProperty?.auctionData?.[0]?.endDate ? moment(selectedProperty?.auctionData.endDate).format('YYYY-MM-DD ') : 'N/A'}</Col>
            <Col span={12}>
              <b>Basic Bid Amount: ₹</b>
              {selectedProperty?.auctionData?.[0]?.amount}
            </Col>
           
            <Col span={12}>
            <b>Auction Type : </b> {selectedProperty?.auctionData?.[0]?.auctionType}
            </Col>
            {selectedProperty?.auctionData?.[0]?.auctionType === "public" && (
            <Col span={12}>
              <b>Current Bid Amount: ₹</b>
              {selectedProperty?.auctionData?.[0]?.buyers?.length > 0
                ? selectedProperty?.auctionData?.[0]?.buyers[0].bidAmount
                :selectedProperty?.auctionData?.[0]?.amount}
            </Col>)}
          </Row>

          {/* Enter Bid Money */}
          {console.log(backendMoney)}
          {remainingTime !== "Auction Ended" && remainingTime !== "Auction Not Yet Started" && (
            <Form.Item
              label={<span><span style={{ color: 'red' }}>*</span> Enter Bid Money</span>}
              name="bidAmount"
              rules={[

                {
                  validator: async (_, value) => {
                    if (!value) {
                      return Promise.reject('Please enter a valid bid amount');
                    }

                    if (value > requiredBid) {
                      return Promise.reject(`New Bid amount should be a greater than ₹${requiredBid}`);
                    }

                    if (!/^\d+0$/.test(value)) {
                      return Promise.reject('Bid amount should end in 00 (e.g., 1200, 5350, 8950)');
                    }
            
                  },
                },
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  type="number"
                  prefix="₹"
                  placeholder="Enter amount"
                  onChange={(e) => {
                    handleMoneyChange(e);
                    // Trigger validation whenever the input value changes
                    form.validateFields(['bidAmount']);
                  }}
                />
                <Tooltip
                  title={(
                    <div>
                      <p><strong>Bidding Rules:</strong></p>
                      <ul style={{ paddingLeft: '20px' }}>
                        <li>Minimum bid amount Should be ₹{requiredBid}.</li>
                        <li>Each bid should be higher than the last bid.</li>
                        <li>You need to pay the complete bid amount.</li>
                      </ul>
                      <p><strong>Refund Policy:</strong></p>
                      <p>If you don't win the auction, 10% of your bid amount will be deducted and remaining bid amount will be refunded to your account.</p>
                    </div>
                  )}
                >
                  <span style={{ marginLeft: '10px', cursor: 'pointer', color: '#0D416B' }}>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>

              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        title="Confirm Bidding Rules"
        visible={showConfirmationModal}
        onCancel={() => setShowConfirmationModal(false)}
        onOk={handleConfirmAndProceed}
        okText="Accept & Submit"
        cancelText="Cancel"
        okButtonProps={{ disabled: !isChecked }}
      >
        <p><strong>Bidding Rules:</strong></p>
        <ul>
          <li>Minimum bid amount should be ₹{requiredBid}.</li>
          <li>Each bid should be higher than the last bid.</li>
          <li>You need to pay the complete bid amount.</li>
        </ul>

        <p><strong>Refund Policy:</strong></p>
        <p>If you don't win the auction, 10% of your bid amount will be deducted, and the remaining amount will be refunded.</p>

        <div style={{ marginTop: "15px" }}>
          <input type="checkbox" id="acceptTerms" onChange={handleAcceptTerms} />
          <label htmlFor="acceptTerms" style={{ marginLeft: "10px" }}>
            I agree to the bidding terms & conditions.
          </label>
        </div>
      </Modal>


    </div >

  );
};
export default BuyersAgriculture;

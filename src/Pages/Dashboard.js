import React, { useEffect, useState,useCallback} from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
    AppstoreOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  BellOutlined,
  MoneyCollectOutlined,
  PlusOutlined
} from "@ant-design/icons";
import "./Dashboard.css";
import Confetti from 'react-confetti';
import {
  Dropdown,
  Button,
  Layout,
  Menu,
  theme,
  Switch,
  Grid,
  Breadcrumb,
  Badge,
  Spin
} from "antd";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { _get } from "../Service/apiClient";
import {
  MdEventAvailable,
  MdOutlineEventAvailable,
} from "react-icons/md";
import {
  FaBoxes,
 
} from "react-icons/fa";
import {  AiFillWarning } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import Notification from "./Buyers/Components/Notification";
import { useTranslation } from "react-i18next";
import { InterestsOutlined } from "@mui/icons-material";
import AuctionCards from "./Buyers/Components/AuctionCards";
import moment from "moment";
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const Dashboard = () => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isSellerAgent, setIsSellerAgent] = useState(false);
  const [winnerDetails, setWinnerDetails] = useState([]);


  const [showBalloons, setShowBalloons] = useState(true);
 
  const changeLanguage = (checked) => {
    const newLanguage = checked ? "te" : "en";
    i18n.changeLanguage(newLanguage);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBalloons(false);
    }, 10000); // Remove balloons after 5 seconds

    return () => clearTimeout(timer);
  }, []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Update the window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const notificationContent = (
    <Notification setNotificationCount={setNotificationCount} />
  );


  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { t, i18n } = useTranslation();
  const role = parseInt(localStorage.getItem("role"));
  const [isLoading, setIsLoading] = useState(false);
  const agentrole = parseInt(localStorage.getItem("agentrole"));
  const handleMenuClick = (event) => {
    navigate(event.key);
  };
  const handleMenuClickWithCollapse = (event) => {
    handleMenuClick(event);
    if (screens.xs || screens.sm) {
      setCollapsed(true);
    }
  };
  const [showAuctionCards, setShowAuctionCards] = useState(false);
  const [showNextDay, setShowNextDay] = useState(false);
  useEffect(() => {
    if (role === 3) {
      console.log("Role is 3, showing AuctionCards");
      setShowAuctionCards(true);
    } else {
      setShowAuctionCards(false);
    }
  }, [role]);

  const userId = localStorage.getItem("userId");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await _get(`/activity/getNotifications`);
      if (response && response.data) {
        const filteredNotifications = response.data.filter(
          (notification) => notification.receiverId === userId
        );
        setNotificationCount(filteredNotifications.length);
      } else {
        console.log("No data received from the API.");
        setNotificationCount(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationCount(0);
    }
  }, [userId]);

  // Fetch Recent Winner Data
  const fetchRecent = useCallback(async () => {
    try {
      const response = await _get(`/auction/getWinnerData`);
      if (response && response.data) {
        setWinnerDetails(response.data.data);
        if (response.data[0]?.auctionData?.endDate) {
          const endDate = response.data[0]?.auctionData?.endDate;
          const nextDay = moment(endDate).add(1, "days");
          const today = moment();

          if (today.isBefore(nextDay)) {
            setShowNextDay(true);
            console.log("✅ Showing balloons");
          } else {
            setShowNextDay(false);
            console.log("❌ Hiding balloons");
          }
        }
      } else {
        console.log("No data received from the API.");
        setNotificationCount(0);
      }
    } catch (error) {
      console.error("Error fetching winner data:", error);
      setNotificationCount(0);
    }
  }, []);

  useEffect(() => {
    if (agentrole === 12) {
      setIsSellerAgent(true);
    } else {
      setIsSellerAgent(false);
    }
    fetchNotifications();
    fetchRecent();
  }, [agentrole, fetchNotifications, fetchRecent]);
  const handleToggleChange = (checked) => {
    console.log("Current isSellerAgent:", isSellerAgent);
    setIsLoading(true);

    const newAgentRole = isSellerAgent ? 11 : 12;
    localStorage.setItem("agentrole", newAgentRole);
    navigate("/dashboard/agent")
    setIsSellerAgent((prev) => !prev); // Toggle the state

    window.location.reload();

    // Hide the loading screen after 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

 
  const handleProfileClick = () => {
    if (role === 1) navigate("/dashboard/agent/profile");
    if (role === 2) navigate("/dashboard/seller/profile");
    if (role === 3) navigate("/dashboard/buyer/profile");
    if (role === 4) navigate("/dashboard/eClient/profile");
    if (role === 0) navigate("/dashboard/admin/profile");
    if (role === 5) navigate("/dashboard/csr/profile");
    if (role === 6) navigate("/dashboard/marketingagent/profile");
  };

  const handleImageClick = () => {
    if (role === 1) {
      navigate("/dashboard/agent");
      setCollapsed(!screens.md ? true : false);
    }

    if (role === 2) {
      navigate("/dashboard/seller");
      setCollapsed(!screens.md ? true : false);
    }

    if (role === 3) {
      navigate("/dashboard/buyer");
      setCollapsed(!screens.md ? true : false);
    }
    if (role === 4) {
      navigate("/dashboard/eClient");
      setCollapsed(!screens.md ? true : false);
    }
    if (role === 0) {
      navigate("/dashboard/admin");
      setCollapsed(!screens.md ? true : false);
    }
    if (role === 5) {
      navigate("/dashboard/csr");
      setCollapsed(!screens.md ? true : false);
    }

    if (role === 6) {
      navigate("/dashboard/marketingagent");
      setCollapsed(!screens.md ? true : false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getMenuItems = () => {
    const agentMenu = [
      {
        key: "/dashboard/agent",
        icon: <HomeOutlined />,
        label: t("dashboard.Home"),
      },
      // Conditionally adding "Appointments" menu if agentrole is 12
      ...(agentrole === 12
        ? [
          {
            icon: <AppstoreOutlined />,
            key: "/dashboard/agent/appointments",
            label: t("dashboard.Appointments"),
            children: [
              {
                icon: <MdOutlineEventAvailable />,
                key: "/dashboard/agent/appointments/buyerRequests",
                label: t("dashboard.Buyer Requests"),
              },
              {
                icon: <MdOutlineEventAvailable />,
                key: "/dashboard/agent/appointments/estateRequests",
                label: t("dashboard.Estate Requests"),
              },
            ],
          },
          {
            key: "/dashboard/agent/Meetings",
            icon: <MdEventAvailable />,
            label: t("dashboard.Calendar"),
          },
          {
            key: "/dashboard/agent/agentdeals",
            icon: <FaHandshake />,
            label: t("dashboard.MyDeals"),
          },
          {
            key: "/dashboard/agent/Customers",
            icon: <UserOutlined />,
            label: t("dashboard.Customers"),
          },
          {
            key: "/dashboard/agent/myproperties",
            icon: <AppstoreOutlined />,
            label: t("dashboard.My Properties"),
          },
        ]
        : []),
      ...(agentrole === 11
        ? [

          {
            key: "/dashboard/agent/MyDealsBuyer",
            icon: <FaHandshake />,
            label:t("dashboard.MyDeals"),
          },

          {
            key: "/dashboard/agent/wishlist",
            icon: <InterestsOutlined />,
            label: t("dashboard.MyInterests"),
          },
          {
            key: "/dashboard/agent/agentappointment",
            icon: <MdEventAvailable />,
            label: `${t("dashboard.My Appointments")}`,
          },
          {
            key: "/dashboard/agent/financialAssistance",
            icon: <MoneyCollectOutlined />,
            label: `${t("dashboard.Financial Assistance")}`,
          },


          {
            icon: <MdEventAvailable />,
            key: "/dashboard/agent/Buyer",
            label: t("dashboard.Plans"),
          },
          {
            icon: <InterestsOutlined />,
            key: "/dashboard/agent/Reserved",
            label: t("dashboard.ReservedProperties"),
          },
        ]
        : []),

    ];

    const buyerMenu = [
      {
        key: "/dashboard/buyer",
        icon: <HomeOutlined />,
        label: t("Home"),
      },



      {
        key: "/dashboard/buyer/MyDealsBuyer",
        icon: <FaHandshake />,
        label: "My Deals",
      },

      {
        key: "/dashboard/buyer/wishlist",
        icon: <InterestsOutlined />,
        label: "My Interests",
      },
      {
        key: "/dashboard/buyer/agentappointment",
        icon: <MdEventAvailable />,
        label: `${t("dashboard.My Appointments")}`,
      },
      {
        key: "/dashboard/buyer/financialAssistance",
        icon: <MoneyCollectOutlined />,
        label: `${t("dashboard.Financial Assistance")}`,
      },


      {
        icon: <MdEventAvailable />,
        key: "/dashboard/buyer/Buyer",
        label: `Plans`,
      },
      {
        icon: <InterestsOutlined />,
        key: "/dashboard/buyer/Reserved",
        label: `Reserved Properties`,
      },
      {
        icon: <CalendarOutlined />,
        key: "/dashboard/buyer/Meetings",
        label: `Meetings`,
      },
    ];

    const sellerMenu = [
      {
        key: "/dashboard/seller",
        icon: <HomeOutlined />,
        label: `${t("Home")}`,
      },
      {
        key: "/dashboard/seller/agents",
        icon: <FaHandshake />,
        label: "Agents",
      },
      {
        key: "/dashboard/seller/addProperty",
        icon: <AppstoreOutlined />,
        label: "Add Property",
      },

    ];


    const eClientMenu = [
      {
        key: "/dashboard/eClient",
        icon: <HomeOutlined />,
        label: t("Home"),
      },
      {
        key: "/dashboard/eClient/findagents",
        icon: <FaHandshake />,
        label: "Find Agents",
      },
      {
        key: "/dashboard/eClient/agentRequests",
        icon: <FaHandshake />,
        label: "Requests",
      },
      {
        key: "/dashboard/eClient/addEstate",
        icon: <AppstoreOutlined />,
        label: "Add Estate",
      },

    ];


    const adminMenu = [
      {
        key: "/dashboard/admin",
        icon: <HomeOutlined />,
        label: t("Home"),
      },
      {
        key: "/dashboard/admin/Dashboards",
        icon: <FaHandshake />,
        label: "Dashboard",
      },
      {
        key: "/dashboard/admin/AddCSR",
        icon: <FaBoxes />,
        label: "Add Agent / CSR / Marketing Agent",
      },
      {
        key: "/dashboard/admin/GetCSR",
        icon: <UserOutlined />,
        label: "CSR",
      },
      {
        key: "/dashboard/admin/complaints",
        icon: <AiFillWarning />,
        label: "Complaints",

        children: [
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/complaints/AgentComplaints/1",
            label: "Agents",
          },
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/complaints/BuyerComplaints/3",
            label: "Buyer",
          },


          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/complaints/ClientComplaints/4",
            label: "Estate Clients",
          },
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/complaints/CsrComplaints/5",
            label: "CSR",
          },
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/complaints/MarketingAgentComplaints/6",
            label: "Marketing Agent",
          },
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/complaints/SellerComplaints/2",
            label: "Seller",
          },
        ],
      },
      {
        key: "/dashboard/admin/deals",
        icon: <FaHandshake />,
        label: "Deals",
      },
      {
        key: "/dashboard/admin/Properties",
        icon: <FaBoxes />,
        label: "Properties",
      },
      {
        key: "/dashboard/admin/users",
        icon: <UserOutlined />,
        label: "Users",

        children: [
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/users/agents",
            label: "Agents",
          },

          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/users/csr",
            label: "CSR",
          },

          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/users/buyers",
            label: "Buyer",
          },

          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/users/marketingagents",
            label: "Marketing Agents",
          },
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/users/estateclients",
            label: "Estate Clients",
          },
          {
            icon: <UserOutlined />,
            key: "/dashboard/admin/users/sellers",
            label: "Seller",
          },
        ],
      },
    ];
    const csrMenu = [
      {
        key: "/dashboard/csr",
        icon: <HomeOutlined />,
        label: "Home",
      },
      {
        key: "/dashboard/csr/AddProperties",
        icon: <AppstoreOutlined />,
        label: "Add Properties",
      },
      {
        icon: <FaHandshake />,
        key: "/dashboard/csr/Association",
        label: "Deals",
      },
      {
        key: "/dashboard/csr/Agentscsr",
        icon: <UserOutlined />,
        label: "Agents",
      },

      {
        key: "/dashboard/csr/MarketingAgents",
        icon: <UserOutlined />,
        label: "Marketing Agents",
      },

      {
        key: "/dashboard/csr/Customers",
        icon: <UserOutlined />,
        label: "Customers",
      },
      // {
      //   key: "/dashboard/csr/deals",
      //   icon: <FaHandshake />,
      //   label: "Customer Deals",
      // },
      {
        key: "/dashboard/csr/Promotions",
        icon: <AiFillWarning />,
        label: "Promotions",
      },
      {
        key: "/dashboard/csr/surveyData",
        icon: <UserOutlined />,
        label: "Survey Data",
      },
    ];
    const marketingagentMenu = [
      {
        key: "/dashboard/marketingagent",
        icon: <HomeOutlined />,
        label: t("Home"),
      },
      {
        key: "/dashboard/marketingagent/assignproperties",
        icon: <FaBoxes />,
        label: "Assign Properties",
      },
      {
        key: "/dashboard/marketingagent/customerfortoday",
        icon: <UserOutlined />,
        label: "Customer for Today",
      },
      {
        key: "/dashboard/marketingagent/Customers",
        icon: <UserOutlined />,
        label: "Customers",
      },
      {
        key: "/dashboard/marketingagent/marketingagentsdeals",
        icon: <FaHandshake />,
        label: "Deals",
      },

      {
        key: "/dashboard/marketingagent/tasks",
        icon: <CheckSquareOutlined />,
        label: "Tasks",
      },
      {
        key: "/dashboard/marketingagent/surveyForm",
        icon: <PlusOutlined />,
        label: "Survey Form",
      },
      {
        key: "/dashboard/marketingagent/surveyData",
        icon: <UserOutlined />,
        label: "Survey Data",
      },
    ];

    switch (role) {
      case 1:
        return agentMenu;
      case 2:
        return sellerMenu;
      case 3:
        return buyerMenu;
      case 4:
        return eClientMenu;
      case 0:
        return adminMenu;
      case 5:
        return csrMenu;
      case 6:
        return marketingagentMenu;
      default:
        return [];
    }
  };


  const getOpenRole = (role) => {
    if (role === 1) return ["agent"];
    if (role === 2) return ["seller"];
    if (role === 3) return ["buyer"];
    if (role === 4) return ["eClient"];
    if (role === 0) return ["admin"];
    if (role === 5) return ["csr"];
    if (role === 6) return ["marketingagent"];

    return [];
  };
  const breadcrumbNameMap = {
    // "/dashboard/agent": "Home",
    // "/dashboard": "Home/PostIssues",
    "/dashboard/agent": "Home",
    "/dashboard/agent/profile": "Profile",
    "/dashboard/agent/agentappointment": "Appointments",
    "/dashboard/agent/financialAssistance": "Financial Assistance",
    "/dashboard/agent/Reserved": "Reserved Properties",
    "/dashboard/agent/appointments/buyerRequests": t("Buyer Requests"),
    "/dashboard/agent/appointments/estateRequests": t("Estate Requests"),
    "/dashboard/agent/myproperties": "My Properties",
    "/dashboard/agent/estates": "Estates",
    "/dashboard/agent/PostIssuesAgent": "Issues",
    "/dashboard/agent/agentdeals": "My Deals",
    "/dashboard/agent/Customers": "Customers",
    "/dashboard/agent/Meetings": "Calendar",
    "/dashboard/agent/MyDealsBuyer": "My Deals",
    "/dashboard/agent/wishlist": "My Interests",
    "/dashboard/admin": "Home",
    "/dashboard/admin/Dashboards": "Dashboard",
    "/dashboard/admin/users": t("Users"),
    "/dashboard/admin/properties": t("Properties"),
    "/dashboard/admin/complaints": t("Complaints"),
    "/dashboard/admin/Properties": "Properties",

    "/dashboard/admin/GetCSR": "CSR Details",
    "/dashboard/admin/deals": "Deals",
    "/dashboard/admin/buyers": "Users/Buyers",
    "/dashboard/admin/sellers": "Users/Sellers",
    "/dashboard/admin/clients": "Users/Clients",
    "/dashboard/admin/agents": "Users/Agents",
    "/dashboard/admin/csr": "Users/CSR",
    "/dashboard/admin/marketingagent": "Users/Marketing Agent",
    "/dashboard/admin/complaints/AgentComplaints/1": "Agent Complaints",
    "/dashboard/admin/complaints/BuyerComplaints/3": "Buyer Complaints",
    "/dashboard/admin/complaints/SellerComplaints/2": "Seller Complaints",
    "/dashboard/admin/complaints/ClientComplaints/4": "Client Complaints",
    "/dashboard/admin/AddCSR": "Add Agent/CSR/Marketing Agent",
    "/dashboard/buyer": "Home",
    "/dashboard/buyer/agriculture/details": "Agriculture",
    "/dashboard/buyer/commercial/details": "Commercial",
    "/dashboard/buyer/layout/details": "Layout",
    "/dashboard/buyer/residential/details": "residential",
    "/dashboard/buyer/profile": "Profile",
    "/dashboard/buyer/agentappointment": "My Appointments",
    "/dashboard/buyer/wishlist": "My Interested Properties",
    "/dashboard/buyer/Meetings": "Meetings",
    "/dashboard/buyer/financialAssistance": "Financial Assistance",
    "/dashboard/buyer/issues": "Issues",
    "/dashboard/buyer/MyDeals": "My Deals",
    "/dashboard/buyer/Reserved": "Reserved Properties",
    "/dashboard/buyer/MyDealsBuyer": "My Deals",
    "/dashboard/marketingagent": "Home",
    "/dashboard/marketingagent/profile": "Profile",
    "/dashboard/marketingagent/customerfortoday": "Assigned Customers",
    "/dashboard/marketingagent/deals": "Deals",
    "/dashboard/marketingagent/assignproperties": "Assigned Properties",
    "/dashboard/marketingagent/tasks": "Tasks",
    "/dashboard/marketingagent/PostIssuesMarketingAgent": "Issues",
    "/dashboard/marketingagent/Customers": "Customers",
    "/dashboard/marketingagent/surveyForm": "SurveyForm",
    "/dashboard/csr": "Home",
    "/dashboard/csr/Properties": "Properties",
    "/dashboard/csr/Agentscsr": "Agents",
    "/dashboard/csr/Association": "Deals",
    "/dashboard/csr/Customers": "Customers",
    "/dashboard/csr/MarketingAgents": "Marketing Agents",
    "/dashboard/csr/Promotions": "Promotions",
    "/dashboard/csr/AddProperties": "Add Properties",
    "/dashboard/csr/profile": "Profile",
    "/dashboard/csr/customerfortoday": "Customer Status",
    "/dashboard/csr/assignedproperties": "Marketing Agents / Assigned Properties",
    "/dashboard/csr/assignedcustomer": "Marketing Agents / Assigned Customers",
    // Add more mappings as needed
    "/dashboard/seller": "Home",
    "/dashboard/seller/profile": "Profile",
    "/dashboard/seller/agents": "Agents",
    "/dashboard/seller/addProperty": "Add Property",
    "/dashboard/seller/PostIssuesSeller": "Issues",
  };

  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const breadcrumbItems = [
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      if (url.startsWith("/dashboard/csr/deals")) {
        if (url === "/dashboard/csr/deals") {
          return (
            <Breadcrumb.Item
              key={url}
              style={{
                fontWeight: location.pathname === url ? "bold" : "normal",
                color: "#0D416B",
              }}
            >
              {location.pathname === "/dashboard/csr/deals" ? (
                "Customers"
              ) : (
                <>
                  <Link to="/dashboard/csr/deals">Customers</Link> <span style={{ color: "#0D416B" }}> / Deals </span>  {/* Add "Deals" after Customers */}
                </>
              )}
            </Breadcrumb.Item>
          );
        }

      }
      if (url.startsWith("/dashboard/agent/agentdeals/customer")) {
        const customerId = url.split("/").pop(); // Extract the customer ID
        return (
          <Breadcrumb.Item
            key={url}
            style={{
              fontWeight: location.pathname === url ? "bold" : "normal",
              color: "#0D416B",
            }}
          >
            {location.pathname === url ? (
              `(${customerId})`
            ) : (
              <>

                <span style={{ color: "#0D416B" }}> / Customer Details</span>
              </>
            )}
          </Breadcrumb.Item>
        );
      }
      if (url.startsWith("/dashboard/csr/Association/property")) {
        const customerId = url.split("/").pop(); // Extract the customer ID
        return (
          <Breadcrumb.Item
            key={url}
            style={{
              fontWeight: location.pathname === url ? "bold" : "normal",
              color: "#0D416B",
            }}
          >
            {location.pathname === url ? (
              `(${customerId})`
            ) : (
              <>

                <span style={{ color: "#0D416B" }}> Property Details</span>
              </>
            )}
          </Breadcrumb.Item>
        );
      }
      if (url.startsWith("/dashboard/csr/Association/customer")) {
        const customerId = url.split("/").pop(); // Extract the customer ID
        return (
          <Breadcrumb.Item
            key={url}
            style={{
              fontWeight: location.pathname === url ? "bold" : "normal",
              color: "#0D416B",
            }}
          >
            {location.pathname === url ? (
              `(${customerId})`
            ) : (
              <>

                <span style={{ color: "#0D416B" }}> / Customer Details</span>
              </>
            )}
          </Breadcrumb.Item>
        );
      }
      if (url.startsWith("/dashboard/agent/agentdeals/property")) {
        const customerId = url.split("/").pop(); // Extract the customer ID
        return (
          <Breadcrumb.Item
            key={url}
            style={{
              fontWeight: location.pathname === url ? "bold" : "normal",
              color: "#0D416B",
            }}
          >
            {location.pathname === url ? (
              `(${customerId})`
            ) : (
              <>
                <Link to="/dashboard/agent/agentdeals">My Deals</Link>
                <span style={{ color: "#0D416B" }}> / Property Details</span>
              </>
            )}
          </Breadcrumb.Item>
        );
      }

      if (url.includes("/dashboard/buyer/agriculture/details") || url.includes("/dashboard/buyer/commercial/details") || url.includes("/dashboard/buyer/layout/details") || url.includes("/dashboard/buyer/residential/details")) {
        return (
          <Breadcrumb.Item
            key={url}
            style={{
              fontWeight: location.pathname === url ? "bold" : "normal",
              color: "#0D416B",
            }}
          >
            {location.pathname === url ? (
              `Details` // Display the ID here for clarity
            ) : (
              <>
                <Link to={`/dashboard/buyer/`}>
                  Home/buyer/property
                </Link>
              </>
            )}
          </Breadcrumb.Item>
        );
      }
      if (url.startsWith("/dashboard/csr/Agentscsr")) {
        if (url === "/dashboard/csr/Agentscsr") {
          return (
            <Breadcrumb.Item
              key={url}
              style={{
                fontWeight: location.pathname === url ? "bold" : "normal",
                color: "#0D416B",
              }}
            >
              {location.pathname === "/dashboard/csr/Agentscsr" ? (
                "Agents"
              ) : (
                <>
                  <>
                    <Link to="/dashboard/csr/Agentscsr">Agents</Link>
                    <span style={{ color: "#0D416B" }}> / </span>
                    {console.log("shshs", location.pathname)}
                    {location.pathname.includes("property") ? (
                      <span style={{ color: "#0D416B" }}>Properties</span>
                    ) : (
                      <span style={{ color: "#0D416B" }}>Customers</span>
                    )}
                  </>
                </>
              )}
            </Breadcrumb.Item>
          );
        }

      }
      // For non-dynamic routes, return the breadcrumb normally
      return (
        <Breadcrumb.Item key={url} style={{ fontWeight: location.pathname === url ? "bold" : "normal", color: "#0D416B" }}>
          {breadcrumbNameMap[url] && <Link to={url}>{breadcrumbNameMap[url]}</Link>}
        </Breadcrumb.Item>
      );
    }),
  ];

  return (
    <>
      <div>

        {showAuctionCards && <AuctionCards showModalOnLoad={true} />}
      </div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            height: "100%",
            position: "fixed",
            left: 0,
            backgroundColor: "#0d416b",
            transition: "width 3s ease-in-out",
            display: screens.md ? "block" : collapsed ? "none" : "block",
          }}
          width={200}
        >
          <div
            className="demo-logo-vertical"
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://res.cloudinary.com/ddv2y93jq/image/upload/v1725998565/d7mnilgqanfugkuhonrl.png"
              alt="logo"
              style={{
                width: collapsed ? "80px" : "200px",
                height: "64px",
              }}
              onClick={handleImageClick}
            />
          </div>

          <Menu
            onClick={screens.md ? handleMenuClick : handleMenuClickWithCollapse}
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={getMenuItems()}
            style={{ backgroundColor: "#0d416b" }}
            defaultOpenKeys={getOpenRole(role)}
          />
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed
              ? !screens.xl && !screens.xxl && !screens.lg && !screens.md
                ? 0
                : 80
              : 200,
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#0d416b",
              position: "fixed",
              top: 0,
              width: !screens.md
                ? "100%"
                : `calc(100% - ${collapsed ? 80 : 200}px)`,
              zIndex: 1000,
              alignItems: "center", // Ensures vertical alignment
            }}
          >
            {/* Left Section */}
            <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>

              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                  marginLeft: "-23%",
                  color: "white",
                }}
              />
              {/* Welcome Message */}
              <span style={{ color: "white", fontSize: "16px", fontWeight: "bold", marginLeft: "1rem" }}>
                <span >{t("dashboard.Welcome")} </span>
                <span>
                  {role === 1
                    ? `${localStorage.getItem("name")} (Agent)`
                    : role === 4
                      ? `${localStorage.getItem("name")} (Estate Client)`
                      : role === 0
                        ? `${localStorage.getItem("name")} (Admin)`
                        : role === 2
                          ? `${localStorage.getItem("name")} (Seller)`
                          : role === 6
                            ? `${localStorage.getItem("name")} (MarketingAgent)`
                            : role === 5
                              ? `${localStorage.getItem("name")} (CSR)`
                              : `${localStorage.getItem("name")} (Buyer)`}
                </span>
              </span>
            </div>
            {console.log("dhhd", winnerDetails[0]?.propertyName)}

            {(role === 3 || agentrole === 11) && winnerDetails[0]?.auctionData?.auctionWinner === userId && showNextDay && (
              <h2
                className="text-4xl font-bold text-green-600 animate-bounce text-center"
                style={{ color: "white" }}
              >
                🎉 You Won the Auction for {winnerDetails[0]?.propertyName} Land! 🎉
              </h2>
            )}

            {(role === 3 || agentrole === 11) && winnerDetails[0]?.auctionData.auctionWinner === userId && showBalloons && showNextDay && (
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="balloon"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {/* Confetti for the user winning */}
            {(role === 3 || agentrole === 11) && winnerDetails[0]?.auctionData?.auctionWinner === userId && showBalloons && showNextDay && (
              <Confetti
                width={windowWidth}
                height={windowHeight}
                numberOfPieces={200} // Number of confetti pieces
                gravity={0.2}
              />
            )}
            {/* Right Section */}
            <div style={{ display: "flex", alignItems: "center", marginRight: "50px" }}>
              {role === 1 && (
                <div style={{ display: "flex", alignItems: "center", marginRight: "50px" }}>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
                      {isSellerAgent ? t("dashboard.SwitchBuyersAgent") :  t("dashboard.SwitchSellersAgent")}
                    </span>
                    <Switch

                      onChange={handleToggleChange}
                      style={{
                        marginLeft: "10px",

                        borderColor: "white", // Ensure border is white
                      }}

                    />
                  </div>

                </div>
              )}
              {isLoading && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Reduced opacity
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999, // Make sure overlay is above all elements
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(255,255,255,0.7)",
                      padding: "20px",
                      borderRadius: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginLeft: "10%",

                    }}
                  >
                    <span style={{ marginTop: "20%" }}><Spin />Please wait while the {isSellerAgent ? "Sellers Properties" : "Buyers Properties"} are loading...</span>
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // marginTop: "22px",
                  marginRight:"5px"
                }}
              >
              
                  <Switch
                    checkedChildren="తెలుగు"
                    unCheckedChildren="English"
                    onChange={changeLanguage}
                  />
                
              </div>
              {/* Raise Issue Button */}
              {role !== 0 && (
                <Button
                  onClick={() => navigate("postIssuesAgent")}
                  style={{ backgroundColor: "#0D416B", color: "white", marginRight: "1rem" }}
                >
                  <AiFillWarning /> Raise an Issue
                </Button>
              )}


              {/* Notifications */}
              <Dropdown overlay={notificationContent} trigger={["click"]}>
                <Badge count={notificationCount} offset={[-29, -5]}>
                  <BellOutlined
                    style={{
                      fontSize: "20px",
                      color: "white",
                      marginRight: "1rem",
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Dropdown>

              {/* Profile Dropdown */}
              <Dropdown
                menu={{
                  items: [
                    {
                      icon: <UserSwitchOutlined />,
                      key: "profile",
                      label: t("dashboard.Profile"),
                      onClick: handleProfileClick,
                    },
                    {
                      icon: <LogoutOutlined />,
                      key: "logout",
                      label: t("dashboard.Logout"),
                      onClick: handleLogout,
                    },
                  ],
                }}
              >
                <img
                  src={localStorage.getItem("profile")}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              </Dropdown>
            </div>
          </Header>

          <Content
            className="content"
            style={{
              padding: "10px",
              background: colorBgContainer,
              backgroundColor: "#f7fafc",
            }}
          >
            <Breadcrumb style={{ margin: "16px 0" }}>{breadcrumbItems}</Breadcrumb>

            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;


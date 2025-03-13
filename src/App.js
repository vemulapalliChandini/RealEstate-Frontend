// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Outlet,
//   useLocation,
// } from "react-router-dom";
// import "./i18n";
// import { initializeAnalytics, logPageView } from "./analytics";

// import Residential from "./Pages/Agent/Residential/Residential";
// import Dashboard from "./Pages/Dashboard";
// import ProfileDetails from "./Pages/ProfileDetails";
// import BuyerRequests from "./Pages/Agent/BuyerRequests";
// import SellerRequests from "./Pages/Agent/SellerRequests";
// import LandingPage from "./Authentication/LandingPage";
// import FinancialAssistant from "./Pages/Buyers/Components/FinancialAssistant";
// import Wishlist from "./Pages/Buyers/Components/WishList";
// import SearchPage from "./Pages/SearchPage";
// import BuyersResidential from "./Pages/Buyers/Components/BuyersResidential";

// import BuyersResidentialDetails from "./Pages/Buyers/Components/BuyersResidentialDetails";

// // import BuyersResidentialDetails from "./Pages/Admin/BuyersResidentialDetails";

// import BuyersAgricultureDetails from "./Pages/Buyers/Components/BuyersAgricultureDetails";
// import GetCommercialDetail from "./Pages/Buyers/Components/BuyersCommercialDetails";
// import BuyersAgriculture from "./Pages/Buyers/Components/BuyersAgriculture";
// import GetCommercial from "./Pages/Agent/Commericial/GetCommercial";
// import MyProperties from "./Pages/Agent/MyProperties";
// import AgentAppointment from "./Pages/Buyers/Components/AgentAppointment";
// import BuyersLayoutDetails from "./Pages/Buyers/Components/BuyersLayoutDetails";
// import BuyersLayout from "./Pages/Buyers/Components/BuyersLayout";
// import PostIssues from "./Pages/Buyers/Components/PostIssues";
// // import PostIssuesAgent from "./Pages/Agent/PostIssuesAgent"
// import ProtectedRoute from "./Pages/ProtectedRoute";
// import Unauthorized from "./Pages/Unauthorized";
// import GetLayout from "./Pages/Agent/Layout/GetLayout";
// import Agriculture from "./Pages/Agent/Agricultural/Agriculture";
// import Chatbot from "./Pages/Chatbot";
// import Agents from "./Pages/Seller/Agents";
// import PropertyForms from "./Pages/Seller/PropertyForms";
// import AddEstate from "./Pages/Eclient/AddEstate";
// import EstateList from "./Pages/Eclient/EstateList";
// import EstateReq from "./Pages/Agent/EstateReq";
// import MyEstates from "./Pages/Agent/MyEstates";
// import PostIssuesAgent from "./Pages/Agent/PostIssuesAgent";
// import Requests from "./Pages/Eclient/Requests";
// import PostIssuesClient from "./Pages/Eclient/PostIssuesClient";
// import AdminDashboard from "./Pages/Admin/AdminDashboard";

// import EstateManagement from "./Pages/Admin/EstateManagement";

// import AdminHomePage from "./Pages/Admin/TotalRevenue";
// import AgentList from "./Pages/Admin/AgentList";
// import Complaints from "./Pages/Admin/Complaints";
// import Users from "./Pages/Admin/Users";
// import Clients from "./Pages/Admin/Clients";
// import SellerList from "./Pages/Admin/SellerList";
// import SellerHome from "./Pages/Seller/SellerHome";
// import PostIssuesSeller from "./Pages/Seller/PostIssuesSeller";
// import Properties from "./Pages/Admin/Properties";
// import BuyerList from "./Pages/Admin/BuyerList";
// import Dashboards from "./Pages/Admin/Dashboards";
// import TotalRevenue from "./Pages/Admin/TotalRevenue";


// import ClientComplaints from "./Pages/Admin/ClientComplaints";
// import ClientEachIssues from "./Pages/Admin/ClientEachIssues";
// import SellerComplaints from "./Pages/Admin/SellerComplaints";
// import SellerEachIssues from "./Pages/Admin/SellerEachIssues";
// import BuyerComplaints from "./Pages/Admin/BuyerComplaints";
// import BuyerEachIssues from "./Pages/Admin/BuyerEachIssues";
// import AgentComplaints from "./Pages/Admin/AgentComplaints";
// import AgentEachIssues from "./Pages/Admin/AgentEachIssues";
// import AssistRevenue from "./Pages/Admin/AssistRevenue";
// import FindAgents from "./Pages/Eclient/FindAgents";
// import Agentscsr from "./Pages/CSR/Agentscsr";
// import AddCSR from "./Pages/Admin/AddCSR";
// import ResetPassword from "./ResetPassword";
// import AddCustomer from "./Pages/CSR/AddCustomer";
// // import Customers from "./Pages/CSR/Customers";
// import GetCSR from "./Pages/Admin/GetCSR";
// import AddProperties from "./Pages/CSR/AddProperties";
// import AdminAgents from "./Pages/Admin/AdminAgents";
// import PropertiesCSR from "./Pages/CSR/PropertiesCSR";
// import MarketingAgent from "./Pages/CSR/MarketingAgents";
// import Promotions from "./Pages/CSR/Promotions";
// import AssignAgent from "./Pages/CSR/AssignAgent";
// // import ScheduleMeet from "./Pages/Agent/ScheduleMeet";
// import Meetings from "./Pages/Buyers/Meetings";
// import Deals from "./Pages/CSR/Deals";
// import DealStatus from "./Pages/Admin/DealStatus";
// import DealDetailsPage from "./Pages/CSR/DealDetailsPage";
// import MyDeals from "./Pages/Agent/MyDeals";
// import Customers from "./Pages/CSR/Customers";




// //  new code from here..

// // Marketing Agent People from here..
// import PropertiesAll from "./Pages/MarketingAgents/PropertiesAll";
// import Myarea from "./Pages/MarketingAgents/Myarea";
// // import AddEstate from "./Pages/Eclient/AddEstate";
// import CustomerForToday from "./Pages/MarketingAgents/CustomerForToday.js";
// import PostIssuesMarketingAgent from "./Pages/MarketingAgents/PostIssuesMarketingAgent.js";
// import Tasks from "./Pages/MarketingAgents/Tasks.js";
// import AssignedProperties from "./Pages/MarketingAgents/AssignedProperties.js";
// import CustomerDeals from "./Pages/MarketingAgents/CustomerDeals.js";



// function AppContent() {
//   const location = useLocation();

//   useEffect(() => {
//     initializeAnalytics();
//     logPageView(window.location.pathname);
//   }, []);


//   return (
//     <>
//       {location.pathname !== "/dashboard/agent/appointments/buyerRequests" &&
//         location.pathname !== "/dashboard/buyer/agentappointment" && (
//           <Chatbot />
//         )}

//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/resetPassword" element={<ResetPassword />} />

//         <Route path="/dashboard" element={<Dashboard />}>
//           <Route element={<ProtectedRoute role={1} />}>
//             <Route path="agent" element={<Outlet />}>
//               <Route index element={<SearchPage />} />
//               <Route path="profile" element={<ProfileDetails />} />
//               <Route path="myproperties" element={<MyProperties />} />
//               <Route path="estates" element={<MyEstates />} />
//               <Route path="MyDeals" element={<MyDeals />} />
//               <Route path="Meetings" element={<Meetings />} />
//               <Route path="appointments" element={<Outlet />}>
//                 <Route path="buyerRequests" element={<BuyerRequests />} />
//                 <Route path="sellerRequests" element={<SellerRequests />} />
//                 <Route path="estateRequests" element={<EstateReq />} />


//               </Route>
//               <Route path="PostIssuesAgent" element={<PostIssuesAgent />} />
//             </Route>
//           </Route>

//           <Route element={<ProtectedRoute role={3} />}>
//             <Route path="buyer" element={<Outlet />}>
//               <Route index element={<SearchPage />} />
//               <Route path="profile" element={<ProfileDetails />} />
//               <Route path="Meetings" element={<Meetings />} />
//               <Route path="agriculture" element={<Outlet />}>
//                 <Route index element={<BuyersAgriculture />} />
//                 <Route
//                   path="details/:id"
//                   element={<BuyersAgricultureDetails />}
//                 />
//               </Route>
//               <Route path="commercial" element={<Outlet />}>
//                 <Route index element={<GetCommercial />} />
//                 <Route path="details/:id" element={<GetCommercialDetail />} />
//               </Route>
//               <Route path="layout" element={<Outlet />}>
//                 <Route index element={<BuyersLayout />} />

//                 <Route path="details/:id" element={<BuyersLayoutDetails />} />
//               </Route>
//               <Route path="residential" element={<Outlet />}>
//                 <Route index element={<BuyersResidential />} />

//                 <Route
//                   path="details/:id"
//                   element={<BuyersResidentialDetails />}
//                 />
//               </Route>
//               <Route path="agentappointment" element={<AgentAppointment />} />
//               <Route
//                 path="financialAssistance"
//                 element={<FinancialAssistant />}
//               />
//               <Route path="wishlist" element={<Wishlist />} />

//               <Route path="issues" element={<PostIssues />} />{" "}
//             </Route>
//           </Route>

//           <Route element={<ProtectedRoute role={2} />}>
//             <Route path="seller" element={<Outlet />}>
//               <Route index element={<SellerHome />} />

//               <Route path="profile" element={<ProfileDetails />} />

//               <Route path="agents" element={<Agents />} />

//               <Route path="addProperty" element={<PropertyForms />} />
//               {/*  new */}
//               <Route path="PostIssuesSeller" element={<PostIssuesSeller />} />
//             </Route>
//           </Route>

//           <Route element={<ProtectedRoute role={4} />}>
//             <Route path="eClient" element={<Outlet />}>
//               <Route index element={<EstateList />} />


//               <Route path="findagents" element={<AgentList />} />
//               <Route path="profile" element={<ProfileDetails />} />

//               <Route path="agentRequests" element={<Requests />} />

//               <Route path="addEstate" element={<AddEstate />} />

//               <Route path="PostIssuesClient" element={<PostIssuesClient />} />
//             </Route>
//           </Route>

//           <Route element={<ProtectedRoute role={0} />}>
//             <Route path="admin" element={<Outlet />}>
//               <Route index element={<TotalRevenue />} />
//               <Route path="profile" element={<ProfileDetails />} />
//               <Route path="buyers" element={<BuyerList />} />
//               <Route path="agents" element={<AgentList />} />
//               Clients
//               <Route path="sellers" element={<SellerList />} />
//               <Route path="clients" element={<Clients />} />
//               <Route path="complaints" element={<Complaints />} />
//               <Route path="users" element={<Users />} />
//               <Route path="Properties" element={<Properties />} />
//               <Route path="GetCSR" element={<GetCSR />} />
//               <Route path="AdminAgents" element={<AdminAgents />} />
//               <Route path="deals" element={<Outlet />}>
//                 <Route index element={<Deals />} />
//                 <Route path=":customerId" element={<DealDetailsPage />} />
//               </Route>
//               <Route path="AddCSR" element={<AddCSR />} />
//               <Route path="dealStatus" element={<DealStatus />} />

//               <Route
//                 path="/dashboard/admin/residential/details/:id"
//                 element={<BuyersResidentialDetails />}
//               />
//               <Route
//                 path="/dashboard/admin/commercial/details/:id"
//                 element={<GetCommercialDetail />}
//               />
//               <Route
//                 path="/dashboard/admin/layout/details/:id"
//                 element={<BuyersLayoutDetails />}
//               />
//               <Route
//                 path="/dashboard/admin/agriculture/details/:id"
//                 element={<BuyersAgricultureDetails />}
//               />
//               <Route path="Dashboards" element={<Dashboards />} />
//               <Route path="admindashboard" element={<AdminDashboard />} />
//               <Route path="estate" element={<EstateManagement />} />
//               <Route path="assist" element={<AssistRevenue />} />
//               <Route
//                 path="complaints/ClientComplaints/:role"
//                 element={<ClientComplaints />}
//               />
//               <Route
//                 path="complaints/ClientComplaints/:role/ClientEachIssues/:userId"
//                 element={<ClientEachIssues />}
//               />
//               <Route
//                 path="complaints/SellerComplaints/:role"
//                 element={<SellerComplaints />}
//               />
//               <Route
//                 path="complaints/SellerComplaints/:role/SellerEachIssues/:userId"
//                 element={<SellerEachIssues />}
//               />
//               <Route
//                 path="complaints/BuyerComplaints/:role"
//                 element={<BuyerComplaints />}
//               />
//               <Route
//                 path="complaints/BuyerComplaints/:role/BuyerEachIssues/:userId"
//                 element={<BuyerEachIssues />}
//               />
//               <Route
//                 path="complaints/AgentComplaints/:role"
//                 element={<AgentComplaints />}
//               />
//               <Route
//                 path="complaints/AgentComplaints/:role/AgentEachIssues/:userId"
//                 element={<AgentEachIssues />}
//               />
//             </Route>
//           </Route>

//           <Route element={<ProtectedRoute role={5} />}>
//             <Route path="csr" element={<Outlet />}>
//               <Route index element={<PropertiesCSR />} />
//               <Route path="profile" element={<ProfileDetails />} />

//               CSR

//               <Route path="Properties" element={<PropertiesCSR />} />
//               <Route path="Agentscsr" element={<Agentscsr />} />
//               <Route path="AddCustomer" element={<AddCustomer />} />

//               <Route path="MarketingAgents" element={<MarketingAgent />} />
//               <Route path="Promotions" element={<Promotions />} />
//               <Route path="Customers" element={<Customers />} />
//               <Route path="AddProperties" element={<AddProperties />} />

//               <Route path="deals" element={<Outlet />}>
//                 <Route index element={<Deals />} />
//                 <Route path=":customerId" element={<DealDetailsPage />} />
//               </Route>
//             </Route>
//           </Route>
//         </Route>



//         {/*  new Marketing agent... */}

//         {/* Marketing Agents */}


//         <Route element={<ProtectedRoute role={6} />}>
//           <Route path="marketingagent" element={<Outlet />}>
//             <Route index element={<SearchPage />} />
//             <Route path="profile" element={<ProfileDetails />} />

//             <Route index element={<PropertiesAll />} />

//             <Route path="myarea" element={<Myarea />} />

//             <Route path="customerfortoday" element={<CustomerForToday />} />



//             <Route path="deals" element={<CustomerDeals />} />

//             <Route
//               path="PostIssuesMarketingAgent"
//               element={<PostIssuesMarketingAgent />}
//             />

//             <Route path="tasks" element={<Tasks />} />

//             <Route path="assignproperties" element={<AssignedProperties />} />



//           </Route>
//         </Route>

//         {/* </Route> */}


//         <Route path="/unauthorized" element={<Unauthorized />} />
//       </Routes >
//     </>
//   );
// }
// export default function App() {
//   return (
//     <Router>
//       <AppContent />

//       {/* <AdminDashboard/> */}
//     </Router>
//   );
// }







import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import "./i18n";

import { initializeAnalytics, logPageView } from "./analytics";
import Dashboard from "./Pages/Dashboard";
import ProfileDetails from "./Pages/ProfileDetails";
import BuyerRequests from "./Pages/Agent/BuyerRequests";
import SellerRequests from "./Pages/Agent/SellerRequests";
import LandingPageEx from "./Authentication/LandingPageEx";
import Buy from "./Authentication/Buy.js";
import Sell from "./Authentication/Sell.js";
import Help from "./Authentication/Help.js";
import NewHeader from "./Authentication/NewHeader.js";
import FinancialAssistant from "./Pages/Buyers/Components/FinancialAssistant";
import Wishlist from "./Pages/Buyers/Components/WishList";
import SearchPage from "./Pages/SearchPage";
import BuyersResidential from "./Pages/Buyers/Components/BuyersResidential";
import BuyersResidentialDetails from "./Pages/Buyers/Components/BuyersResidentialDetails";
import BuyersAgricultureDetails from "./Pages/Buyers/Components/BuyersAgricultureDetails";
import GetCommercialDetail from "./Pages/Buyers/Components/BuyersCommercialDetails";
import BuyersAgriculture from "./Pages/Buyers/Components/BuyersAgriculture";
import GetCommercial from "./Pages/Agent/Commericial/GetCommercial";
import MyProperties from "./Pages/Agent/MyProperties";
import AgentAppointment from "./Pages/Buyers/Components/AgentAppointment";
import BuyersLayoutDetails from "./Pages/Buyers/Components/BuyersLayoutDetails";
import BuyersLayout from "./Pages/Buyers/Components/BuyersLayout";
import PostIssues from "./Pages/Buyers/Components/PostIssues";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Unauthorized from "./Pages/Unauthorized";
import Chatbot from "./Pages/Chatbot";
import Agents from "./Pages/Seller/Agents";
import PropertyForms from "./Pages/Seller/PropertyForms";
import PropertiesAll from "./Pages/MarketingAgents/PropertiesAll";
import Myarea from "./Pages/MarketingAgents/Myarea";
import AddEstate from "./Pages/Eclient/AddEstate";
import CustomerForToday from "./Pages/MarketingAgents/CustomerForToday.js";
import EstateList from "./Pages/Eclient/EstateList";
import EstateReq from "./Pages/Agent/EstateReq";
import MyEstates from "./Pages/Agent/MyEstates";
import PostIssuesAgent from "./Pages/Agent/PostIssuesAgent";
import Requests from "./Pages/Eclient/Requests";
import PostIssuesClient from "./Pages/Eclient/PostIssuesClient";
import AdminDashboard from "./Pages/Admin/AdminDashboard";

import EstateManagement from "./Pages/Admin/EstateManagement";


import AdminHomePage from "./Pages/Admin/TotalRevenue";
import AgentList from "./Pages/Admin/AgentList";
import Complaints from "./Pages/Admin/Complaints";
import Users from "./Pages/Admin/Users";
import Clients from "./Pages/Admin/Clients";
import SellerList from "./Pages/Admin/SellerList";
import SellerHome from "./Pages/Seller/SellerHome";
import PostIssuesSeller from "./Pages/Seller/PostIssuesSeller";
import Properties from "./Pages/Admin/Properties";
import BuyerList from "./Pages/Admin/BuyerList";
import Dashboards from "./Pages/Admin/Dashboards";
import TotalRevenue from "./Pages/Admin/TotalRevenue";


import ClientComplaints from "./Pages/Admin/ClientComplaints";
import ClientEachIssues from "./Pages/Admin/ClientEachIssues";
import SellerComplaints from "./Pages/Admin/SellerComplaints";
import SellerEachIssues from "./Pages/Admin/SellerEachIssues";
import BuyerComplaints from "./Pages/Admin/BuyerComplaints";
import BuyerEachIssues from "./Pages/Admin/BuyerEachIssues";
import AgentComplaints from "./Pages/Admin/AgentComplaints";
import AgentEachIssues from "./Pages/Admin/AgentEachIssues";
import AssistRevenue from "./Pages/Admin/AssistRevenue";
import FindAgents from "./Pages/Eclient/FindAgents";
import Agentscsr from "./Pages/CSR/Agentscsr";
import AddCSR from "./Pages/Admin/AddCSR";
import ResetPassword from "./ResetPassword";
import AddCustomer from "./Pages/CSR/AddCustomer";
// import Customers from "./Pages/CSR/Customers";
import GetCSR from "./Pages/Admin/GetCSR";
import AddProperties from "./Pages/CSR/AddProperties";
import AdminAgents from "./Pages/Admin/AdminAgents";
import PropertiesCSR from "./Pages/CSR/PropertiesCSR";
import MarketingAgent from "./Pages/CSR/MarketingAgents";
import Promotions from "./Pages/CSR/Promotions";
import AssignAgent from "./Pages/CSR/AssignAgent";
// import ScheduleMeet from "./Pages/Agent/ScheduleMeet";
import Meetings from "./Pages/Buyers/Meetings";
import Deals from "./Pages/CSR/Deals";
import DealStatus from "./Pages/Admin/DealStatus";

import DealDetailsPage from "./Pages/CSR/DealDetailsPage";

import MyDeals from "./Pages/Agent/MyDeals";
import PostIssuesMarketingAgent from "./Pages/MarketingAgents/PostIssuesMarketingAgent.js";
import Tasks from "./Pages/MarketingAgents/Tasks.js";
import CustomerDeals from "./Pages/MarketingAgents/CustomerDeals.js";
import AssignedProperties from "./Pages/MarketingAgents/AssignedProperties.js";
import Customers from "./Pages/CSR/Customers.js";
import MarketingAgentsList from "./Pages/Admin/MarketingAgentsList.js";
import CSRList from "./Pages/Admin/CSRList.js";
import PropertyDetails from "./Pages/MarketingAgents/PropertyDetails.js";
import CustomerDetails from "./Pages/MarketingAgents/CustomerDetails.js";
import CustomerAssociation from "./Pages/CSR/CustomerAssociation.js";
import PropertyAssociation from "./Pages/CSR/PropertyAssociation.js";
import Association from "./Pages/CSR/Association.js";
import BuyerDeals from "./Pages/Buyers/Components/BuyerDeals.js";
import Plans from "./Pages/Buyers/Components/Plans.js";
import Payment from "./Pages/Buyers/Components/Payment.js";
import CsrComplaints from "./Pages/Admin/CsrComplaints.js";
import MarketingAgentComplaints from "./Pages/Admin/MarketingAgentComplaints.js";
import AgentPropertyAssociation from "./Pages/Agent/AgentPropertyAssociation.js";
import AgentCustomerAssociation from "./Pages/Agent/AgentCustomerAssociation.js";
import AgentAssociation from "./Pages/Agent/AgentAssociation.js";
import MarketingAgentsCustomerAssociation from "./Pages/MarketingAgents/MarketingAgentsCustomerAssociation.js";
import MarketingAgentsPropertyAssociation from "./Pages/MarketingAgents/MarketingAgentsPropertyAssociation.js";
import MarketingAgentsAssociation from "./Pages/MarketingAgents/MarketingAgentsAssociation.js";
import AssignedCustomers from "./Pages/MarketingAgents/CustomerForToday.js";
import AgentDecision from "./Pages/Agent/AgentDecision.js";
import SurveyForm from "./Pages/MarketingAgents/SurveyForm.js";
import SurveyData from "./Pages/MarketingAgents/SurveyData.js";
import ReservedProperties from "./Pages/Buyers/Components/ReservedProperties.js";
import FindAnAgent from "./Pages/Buyers/FindAnAgent.js";
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    initializeAnalytics();
    logPageView(window.location.pathname);
  }, []);
  const [agentrole, setAgentRole] = useState(null);
  // useEffect(() => {
  //   const storedRole = localStorage.getItem("agentrole");
  //   if (storedRole) {
  //     setAgentRole(parseInt(storedRole)); 
  //   }
  // }, [localStorage.getItem("agentrole")]);
   useEffect(() => {
      const handleStorageChange = () => {
        const updatedRole = localStorage.getItem("agentrole");
        setAgentRole(updatedRole ? parseInt(updatedRole) : null);
      };
  
      // Listen for changes in localStorage
      window.addEventListener("storage", handleStorageChange);
  
      return () => {
        window.removeEventListener("storage", handleStorageChange); // Cleanup listener on unmount
      };
    }, []);
  const findanagent = localStorage.getItem("findanagent");
  return (
    <>
      {console.log(agentrole)}
      {location.pathname !== "/dashboard/agent/appointments/buyerRequests" &&
        location.pathname !== "/dashboard/buyer/agentappointment" && (
          <Chatbot />
        )}

      <Routes>
        <Route path="/" element={<NewHeader />}>

          <Route index element={<LandingPageEx />} />
          <Route path="Buy" element={<Buy />} />
          <Route path="help" element={<Help />} />
          <Route path="sell" element={<Sell />} />
          <Route path="findanagent" element={<FindAnAgent />} />
         
        </Route>
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />}>

          <Route path="PostIssuesAgent" element={<PostIssuesAgent />} />
          <Route element={<ProtectedRoute role={1} />}>
            <Route path="agent" element={<Outlet />}>
              <Route
                index
                element={
                  agentrole === 0 ? (
                    <AgentDecision />
                  ) : agentrole === 12 ? (
                    <SearchPage />
                  ) : (
                    <SearchPage />
                  )
                }
              />
              <Route path="Reserved" element={<ReservedProperties />} />
              <Route path="profile" element={<ProfileDetails />} />
              <Route path="myproperties" element={<MyProperties />} />
              <Route path="estates" element={<MyEstates />} />
              <Route path="MyDeals" element={<MyDeals />} />
              <Route path="Meetings" element={<Meetings />} />
              <Route path="Customers" element={<Customers />} />
              <Route path="deals" element={<Outlet />}>
                <Route index element={<Deals />} />
                <Route path=":customerId" element={<DealDetailsPage />} />
              </Route>
              <Route path="agentdeals" element={<Outlet />}>
                <Route index element={<AgentAssociation />} />

                <Route
                  path="customer/:customerId"
                  element={<AgentCustomerAssociation />}
                />

                <Route
                  path="property/:propertyId"
                  element={<AgentPropertyAssociation />}
                />
              </Route>
              <Route path="Meetings" element={<Meetings />} />
              <Route path="MyDealsBuyer" element={<BuyerDeals />} />
              <Route path="Buyer" element={<Outlet />}>
                <Route index element={<Plans />} />
                <Route path="Payment" element={<Payment />} />
              </Route>
              <Route path="agriculture" element={<Outlet />}>
                <Route index element={<BuyersAgriculture />} />
                <Route
                  path="details/:id"
                  element={<BuyersAgricultureDetails />}
                />
              </Route>
              
              <Route path="commercial" element={<Outlet />}>
                <Route index element={<GetCommercial />} />
                <Route path="details/:id" element={<GetCommercialDetail />} />
              </Route>
              <Route path="layout" element={<Outlet />}>
                <Route index element={<BuyersLayout />} />

                <Route path="details/:id" element={<BuyersLayoutDetails />} />
              </Route>
              <Route path="residential" element={<Outlet />}>
                <Route index element={<BuyersResidential />} />

                <Route
                  path="details/:id"
                  element={<BuyersResidentialDetails />}
                />
              </Route>
              <Route path="agentappointment" element={<AgentAppointment />} />
              <Route
                path="financialAssistance"
                element={<FinancialAssistant />}
              />
              <Route path="wishlist" element={<Wishlist />} />
              {/* new */}
              <Route path="issues" element={<PostIssues />} />{" "}
              {/* <Route path="currentLocation" element={<CurrentLocation />} /> */}
              <Route path="appointments" element={<Outlet />}>
                <Route path="buyerRequests" element={<BuyerRequests />} />
                <Route path="sellerRequests" element={<SellerRequests />} />
                <Route path="estateRequests" element={<EstateReq />} />

                {/* new */}
              </Route>

            </Route>
          </Route>

          <Route element={<ProtectedRoute role={3} />}>
            <Route path="buyer" element={<Outlet />}>
              <Route index element={<SearchPage />} />
              <Route path="profile" element={<ProfileDetails />} />
              <Route path="Meetings" element={<Meetings />} />
              <Route path="MyDealsBuyer" element={<BuyerDeals />} />
              {/* <Route path="findanagent" element={<FindAnAgent />} /> */}
              <Route path="agriculture" element={<Outlet />}>
                <Route index element={<BuyersAgriculture />} />
                <Route
                  path="details/:id"
                  element={<BuyersAgricultureDetails />}
                />
              </Route>
              <Route path="Buyer" element={<Outlet />}>
                <Route index element={<Plans />} />
                <Route path="Payment" element={<Payment />} />
              </Route>
              <Route path="commercial" element={<Outlet />}>
                <Route index element={<GetCommercial />} />
                <Route path="details/:id" element={<GetCommercialDetail />} />
              </Route>
              <Route path="layout" element={<Outlet />}>
                <Route index element={<BuyersLayout />} />

                <Route path="details/:id" element={<BuyersLayoutDetails />} />
              </Route>
              <Route path="residential" element={<Outlet />}>
                <Route index element={<BuyersResidential />} />

                <Route
                  path="details/:id"
                  element={<BuyersResidentialDetails />}
                />
              </Route>
              <Route path="agentappointment" element={<AgentAppointment />} />
              <Route
                path="financialAssistance"
                element={<FinancialAssistant />}
              />
              <Route path="wishlist" element={<Wishlist />} />
              {/* new */}
              <Route path="Reserved" element={<ReservedProperties />} />
              <Route path="issues" element={<PostIssues />} />{" "}
            </Route>
          </Route>

          <Route element={<ProtectedRoute role={2} />}>
            <Route path="seller" element={<Outlet />}>
              <Route index element={<SellerHome />} />

              <Route path="profile" element={<ProfileDetails />} />

              <Route path="agents" element={<Agents />} />

              <Route path="addProperty" element={<PropertyForms />} />
              {/* new */}
              <Route path="PostIssuesSeller" element={<PostIssuesSeller />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role={4} />}>
            <Route path="eClient" element={<Outlet />}>
              <Route index element={<EstateList />} />

              {/* <Route path/> */}
              <Route path="findagents" element={<FindAgents />} />
              <Route path="profile" element={<ProfileDetails />} />

              <Route path="agentRequests" element={<Requests />} />

              <Route path="addEstate" element={<AddEstate />} />
              {/* new */}
              <Route path="PostIssuesClient" element={<PostIssuesClient />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role={0} />}>
            <Route path="admin" element={<Outlet />}>
              <Route index element={<TotalRevenue />} />
              <Route path="profile" element={<ProfileDetails />} />
              <Route path="buyers" element={<BuyerList />} />
              <Route path="agents" element={<AgentList />} />
              Clients
              <Route path="sellers" element={<SellerList />} />
              <Route path="clients" element={<Clients />} />
              <Route path="complaints" element={<Complaints />} />

              <Route path="complaints" element={<Outlet />}>
                <Route path="BuyerComplaints/3" element={<BuyerComplaints />} />
                <Route path="AgentComplaints/1" element={<AgentComplaints />} />
                <Route path="SellerComplaints/2" element={<SellerComplaints />} />
                <Route path="ClientComplaints/4" element={<ClientComplaints />} />
                <Route path="CsrComplaints/5" element={<CsrComplaints />} />
                <Route path="MarketingAgentComplaints/6" element={<MarketingAgentComplaints />} />
              </Route>
              <Route path="users" element={<Outlet />}>
                <Route path="buyers" element={<BuyerList />} />
                <Route path="agents" element={<AgentList />} />
                <Route path="agents" element={<AgentList />} />
                <Route path="sellers" element={<SellerList />} />
                <Route path="estateclients" element={<Clients />} />
                <Route path="csr" element={<CSRList />} />
                <Route
                  path="marketingagents"
                  element={<MarketingAgentsList />}
                />
              </Route>
              <Route path="Properties" element={<Properties />} />
              <Route path="GetCSR" element={<GetCSR />} />
              <Route path="AdminAgents" element={<AdminAgents />} />
              <Route path="marketingagent" element={<MarketingAgentsList />} />
              <Route path="csr" element={<CSRList />} />
              <Route path="deals" element={<Outlet />}>
                <Route index element={<Deals />} />
                <Route path=":customerId" element={<DealDetailsPage />} />
              </Route>
              <Route path="AddCSR" element={<AddCSR />} />
              <Route path="dealStatus" element={<DealStatus />} />
              <Route
                path="/dashboard/admin/residential/details/:id"
                element={<BuyersResidentialDetails />}
              />
              <Route
                path="/dashboard/admin/commercial/details/:id"
                element={<GetCommercialDetail />}
              />
              <Route
                path="/dashboard/admin/layout/details/:id"
                element={<BuyersLayoutDetails />}
              />
              <Route
                path="/dashboard/admin/agriculture/details/:id"
                element={<BuyersAgricultureDetails />}
              />
              <Route path="Dashboards" element={<Dashboards />} />
              <Route path="admindashboard" element={<AdminDashboard />} />
              <Route path="estate" element={<EstateManagement />} />
              <Route path="assist" element={<AssistRevenue />} />
              <Route
                path="complaints/ClientComplaints/:role"
                element={<ClientComplaints />}
              />
              <Route
                path="complaints/ClientComplaints/:role/ClientEachIssues/:userId"
                element={<ClientEachIssues />}
              />
              <Route
                path="complaints/SellerComplaints/:role"
                element={<SellerComplaints />}
              />
              <Route
                path="complaints/SellerComplaints/:role/SellerEachIssues/:userId"
                element={<SellerEachIssues />}
              />
              <Route
                path="complaints/BuyerComplaints/:role"
                element={<BuyerComplaints />}
              />
              <Route
                path="complaints/BuyerComplaints/:role/BuyerEachIssues/:userId"
                element={<BuyerEachIssues />}
              />
              <Route
                path="complaints/AgentComplaints/:role"
                element={<AgentComplaints />}
              />
              <Route
                path="complaints/AgentComplaints/:role/AgentEachIssues/:userId"
                element={<AgentEachIssues />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role={5} />}>
            <Route path="csr" element={<Outlet />}>
              <Route index element={<PropertiesCSR />} />
              <Route path="profile" element={<ProfileDetails />} />
              CSR
              <Route path="Properties" element={<PropertiesCSR />} />
              <Route path="Agentscsr" element={<Agentscsr />} />
              <Route path="AddCustomer" element={<AddCustomer />} />
              {/* <Route path="deals" element={<Deals />} /> */}
              <Route path="customerfortoday" element={<CustomerForToday />} />
              <Route path="MarketingAgents" element={<MarketingAgent />} />
              <Route path="Promotions" element={<Promotions />} />
              <Route path="Customers" element={<Customers />} />
              <Route path="AddProperties" element={<AddProperties />} />
              <Route path="surveyData" element={<SurveyData />} />
              <Route path="deals" element={<Outlet />}>
                <Route index element={<Deals />} />
                <Route path=":customerId" element={<DealDetailsPage />} />
              </Route>
              <Route path="Association" element={<Outlet />}>
                <Route index element={<Association
                />} />

                <Route
                  path="customer/:customerId"
                  element={<CustomerAssociation />}
                />

                <Route
                  path="property/:propertyId"
                  element={<PropertyAssociation />}
                />
              </Route>
              <Route
                path="assignedproperties"
                element={<AssignedProperties />}
              />
              <Route
                path="assignedcustomer"
                element={<AssignedCustomers />}
              />
              <Route path="Agentscsr" element={<Outlet />}>
                <Route index element={<Agentscsr />} />
                <Route path="property/:id" element={<PropertyDetails />} />
                <Route path="customer/:id" element={<CustomerDetails />} />
              </Route>
            </Route>
          </Route>

          {/* Marketing Agents */}

          <Route element={<ProtectedRoute role={6} />}>
            <Route path="marketingagent" element={<Outlet />}>
              <Route index element={<SearchPage />} />

              <Route path="profile" element={<ProfileDetails />} />

              <Route path="marketingagentsdeals" element={<Outlet />}>
                <Route index element={<MarketingAgentsAssociation />} />

                <Route
                  path="customer/:customerId"
                  element={<MarketingAgentsCustomerAssociation />}
                />

                <Route
                  path="property/:propertyId"
                  element={<MarketingAgentsPropertyAssociation />}
                />
              </Route>


              <Route index element={<PropertiesAll />} />

              <Route path="myarea" element={<Myarea />} />
              <Route path="Customers" element={<Customers />} />
              <Route path="customerfortoday" element={<CustomerForToday />} />
              <Route path="surveyForm" element={<SurveyForm />} />
              <Route path="surveyData" element={<SurveyData />} />
              <Route path="deals" element={<Outlet />}>
                <Route index element={<Deals />} />
                <Route path=":customerId" element={<DealDetailsPage />} />
              </Route>

              <Route
                path="PostIssuesMarketingAgent"
                element={<PostIssuesMarketingAgent />}
              />

              <Route path="tasks" element={<Tasks />} />

              <Route path="assignproperties" element={<AssignedProperties />} />



            </Route>
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}



export default function App() {

  return (
    <Router>
      <AppContent />

      {/* <AdminDashboard/> */}
    </Router>
  );
}









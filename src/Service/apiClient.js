import axios from "axios";
import { notification } from "antd";

const BASE_URL = "http://172.17.15.189:3000";
// const BASE_URL = " http://real-estate-back-end-s5bk-ooqntcx6c-pindu123s-projects.vercel.app/";

console.log(BASE_URL);
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



apiClient.interceptors.request.use(
  (config) => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      config.headers.Authorization = `Bearer ${tokenData}`;
    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);
let notificationQueue = [];
let isNotificationDisplayed = false;
let displayedNotifications = {};

const NOTIFICATION_DURATION = 3000;

const openNotification = (type, message, description) => {
  const notificationKey = `${type}-${message}-${description}`;

  const now = Date.now();
  if (
    displayedNotifications[notificationKey] &&
    now - displayedNotifications[notificationKey] < NOTIFICATION_DURATION
  ) {
    return;
  }

  notificationQueue.push({ type, message, description });

  displayedNotifications[notificationKey] = now;

  if (!isNotificationDisplayed) {
    displayNextNotification();
  }
};

const displayNextNotification = () => {
  if (notificationQueue.length > 0) {
    const { type, message, description } = notificationQueue.shift();
    isNotificationDisplayed = true;

    notification[type]({
      message: message,
      description: description,
      placement: "topRight",
      duration: 2,
      onClose: () => {
        isNotificationDisplayed = false;
        displayNextNotification();
      },
    });
  }
};

// const handleApiRequest = async (
//   method,
//   url,
//   data = {},
//   messageOnSuccess,
//   messageOnFail
// ) => {
//   try {
//     const response = await apiClient[method](url, data);
//     if (response.status === 200 || response.status === 201) {
//       openNotification(
//         "success",
//         messageOnSuccess || "Form Submitted Successfully"
//       );
//     }
//     return response;
//   } catch (error) {
//     console.error("Error:", error);

//     let errorMessage;

//     switch (error.response && error.response.status) {
//       case 400:
//         errorMessage = messageOnFail || "Failed to submit the Form!";
//         break;
//       case 401:
//         errorMessage = "Wrong Credentials. Please try again!";
//         break;
//       case 403:
//         errorMessage =
//           "Access Denied. You don't have permission to perform this action.";
//         break;
//       case 404:
//         errorMessage = "The Requested Resource was not found.";
//         break;
//       case 409:
//         const errordata = error.response.data;
//         if (errordata === "phone number exists") {
//           errorMessage = "Phone number already exists. Please try again.";
//         } else if (errordata === "email exists") {
//           errorMessage = "Email already exists. Please use a different email.";
//         }
//         break;
//       case 500:
//         errorMessage = "Internal Server Error. Please try again later.";
//         break;
//       default:
//         errorMessage =
//           "An unexpected error occurred. Connection Failed. Please try again later.";
//     }

//     if (errorMessage) {
//       openNotification("error", errorMessage);
//     }

//     return error;
//   }
// };

const handleApiRequest = async (
  method,
  url,
  data = {},
  messageOnSuccess,
  messageOnFail
) => {
  try {
    const response = await apiClient[method](url, data);

    if (url !== "bot/chat" && url !== "views/updateViewCount") {
      if (response.status === 200 || response.status === 201) {
        openNotification(
          "success",
          messageOnSuccess || "Form Submitted Successfully"
        );
      }
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    if (url === "/bot/chat" && url === "views/updateViewCount") {
      return error;  // Simply return the error, do not show any notification
    }

    let errorMessage;
    switch (error.response && error.response.status) {
    
      case 400:
        errorMessage = messageOnFail || "Failed to submit the Form!";
        break;
      case 401:
        errorMessage = "Wrong Credentials. Please try again!";
        break;
      case 403:
        errorMessage =
          "Access Denied. You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The Requested Resource was not found.";
        break;
      case 409:
        const errordata = error.response.data;
        console.log(errordata);
        if (errordata === "phone number exists") {
          errorMessage = "Phone number already exists. Please try again.";
        } else if (errordata === "email exists") {
          errorMessage = "Email already exists. Please use a different email.";
        } else{
          errorMessage=error.response.data.message;
        }
        break;
      case 500:
        errorMessage = "Internal Server Error. Please try again later.";
        break;
      default:
        errorMessage =
        error.response.data.message
    }
    console.log("error",error.response.data.message)
    if (errorMessage) {
      openNotification("error", errorMessage);
    }

    return error;
  }
};

const _get = (url, config = {}) => {
  return apiClient.get(url, config);
};

const _post = async (url, data = {}, messageOnSuccess, messageOnFail) => {
  return handleApiRequest("post", url, data, messageOnSuccess, messageOnFail);
};

const _put = async (url, data = {}, messageOnSuccess, messageOnFail) => {
  return handleApiRequest("put", url, data, messageOnSuccess, messageOnFail);
};

const _delete = (url, messageOnSuccess, messageOnFail) => {
  return handleApiRequest("delete", url, {}, messageOnSuccess, messageOnFail);
};

export { _delete, _post, _put, _get };

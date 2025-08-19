import ApiCalendar from 'react-google-calendar-api';

const config = {
  "clientId": "1042585022018-7u8v41lc1l08eribmid04kr9b5c472d2.apps.googleusercontent.com",
  "apiKey": "AIzaSyAK03U-Txd1gEAP26Iv_s-zVUB7OTShruI", // Replace with your API Key
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

const apiCalendar = new ApiCalendar(config);

export default apiCalendar;
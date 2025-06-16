import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getZoomToken = async () => {
  try {
    const tokenUrl = "https://zoom.us/oauth/token";
    const auth = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      tokenUrl,
      "grant_type=account_credentials&account_id=" +
        encodeURIComponent(process.env.ZOOM_ACCOUNT_ID),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching Zoom token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to retrieve Zoom API token");
  }
};

// ✅ Add the createZoomMeeting function
const createZoomMeeting = async (topic, startTime, duration) => {
  try {
    const token = await getZoomToken();
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic,
        type: 2, // Scheduled Meeting
        start_time: startTime, // Format: "YYYY-MM-DDTHH:MM:SSZ"
        duration,
        timezone: "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create Zoom meeting");
  }
};

// ✅ Export both functions
export { getZoomToken, createZoomMeeting };

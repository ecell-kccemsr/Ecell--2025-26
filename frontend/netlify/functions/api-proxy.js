const axios = require("axios");

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://kcecell-backend-api.onrender.com";

exports.handler = async function (event, context) {
  const path = event.path.replace("/.netlify/functions/api-proxy", "");
  const method = event.httpMethod.toLowerCase();
  const headers = event.headers;
  const queryParams = event.queryStringParameters || {};

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (method === "options") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  try {
    // Keep the /api prefix since backend expects it
    const url = `${BACKEND_URL}${path}`;

    console.log("API Proxy Debug:", {
      path,
      url,
      method: method.toUpperCase(),
    });

    const requestHeaders = { ...headers };
    delete requestHeaders.host;
    delete requestHeaders["x-forwarded-for"];
    delete requestHeaders["x-forwarded-proto"];
    delete requestHeaders["x-forwarded-port"];
    delete requestHeaders["x-country"];

    if (!requestHeaders["content-type"]) {
      requestHeaders["content-type"] = "application/json";
    }

    const requestOptions = {
      method,
      url,
      headers: requestHeaders,
      params: queryParams,
    };

    if (method !== "get" && method !== "head" && event.body) {
      requestOptions.data = JSON.parse(event.body);
    }

    const response = await axios(requestOptions);

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers["content-type"] || "application/json",
      },
      body:
        typeof response.data === "object"
          ? JSON.stringify(response.data)
          : response.data,
    };
  } catch (error) {
    console.error("API Proxy Error:", error);

    if (error.response) {
      return {
        statusCode: error.response.status,
        headers: corsHeaders,
        body: JSON.stringify(error.response.data),
      };
    }

    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error connecting to backend server",
        error: error.message,
      }),
    };
  }
};

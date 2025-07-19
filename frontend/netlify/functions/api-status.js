// netlify/functions/api-status.js
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Netlify Functions are working correctly",
      backend_url:
        process.env.BACKEND_API_URL ||
        "https://kcecell-backend-api.onrender.com",
      timestamp: new Date().toISOString(),
    }),
  };
};

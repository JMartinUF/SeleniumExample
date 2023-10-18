const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  SKYBOX_API_ENDPOINT: "https://skybox.vividseats.com/services/purchases",
  AIRTABLE_ENDPOINT: "https://api.airtable.com/v0/appZotdk5CLr00nqZ/Orders",
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  HEADERS: {
    "Content-Type": "application/json",
    "X-Account": process.env.ACCOUNT,
    "X-Api-Token": process.env.API_TOKEN,
    "X-Application-Token": process.env.APP_TOKEN,
  },
};

const fetch = require("node-fetch");
const { AIRTABLE_ENDPOINT, AIRTABLE_API_KEY } = require("./config.cjs");

async function postToAirtable(data) {
  const response = await fetch(AIRTABLE_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        "username": data.email,
        "Order Number": data.orderNumber, 
        "Event Name": data.eventName, 
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Airtable API responded with status ${response.status}`);
  }

  return await response.json();
}

module.exports = {
    postToAirtable,
  };
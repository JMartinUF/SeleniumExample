const fetch = require("node-fetch");
const { SKYBOX_API_ENDPOINT, HEADERS } = require("./config.cjs");

let seatNumberIncrement = 1;

async function postToSkyBox(extractedData) {
  const data = {
    vendorId: 1833400,
    accountId: 5326,
    // internalId: 0,
    lines: [
      {
        // id: 0,
        accountId: 5326,
        // targetId: 0,
        quantity: 1,
        description:
          extractedData.eventName +
          extractedData.eventDate +
          extractedData.section,
        amount: extractedData.price,
        lineType: "PURCHASE",
        lineItemType: "INVENTORY",
        // itemIds: [0],
        inventory: {
          // inHandDate: new Date().toISOString().split("T")[0],
          // id: 0,
          accountId: 5326,
          // eventId: 0,
          quantity: 1,
          notes: "string",
          section: extractedData.section,
          row: "PARKING",
          // secondRow: "string",
          lowSeat: 1,
          highSeat: 1,
          cost: extractedData.price, // ticket price
          taxedCost: 0,
          taxedCostAverage: 0,
          faceValue: null,
          tickets: [
            {
              id: 0,
              seatNumber: seatNumberIncrement,
              // fileName: "string",
              // barCode: "string",
              // inventoryId: 0,
              // invoiceLineId: 0,
              // purchaseLineId: 0,
              section: extractedData.section,
              row: "PARKING",
              notes:
                extractedData.purchaseEmail + extractedData.parkingPassNumber,
              cost: extractedData.price, // ticket price
              // faceValue: 0,
              // taxedCost: 0,
              sellPrice: extractedData.price,
              stockType: "MOBILE_TRANSFER",
              // eventId: 0,
              accountId: 5326,
              status: "AVAILABLE",
              // disclosures: ["string"],
              // attributes: ["string"],
              // createdDate: extractedData.formattedPurchaseDate,
              // createdBy: "string",
              // lastUpdate: "2023-10-03T21:30:32.134Z",
              // lastUpdateBy: "string",
              // dateCancelled: "2023-10-03T21:30:32.134Z",
              // cancelledByUserId: 0,
              // auditNote: "string",
            },
          ],
          ticketIds: [0],
          stockType: "MOBILE_TRANSFER",
          splitType: "DEFAULT",

          // listPrice: 0,
          // expectedValue: 0,
          publicNotes:
            extractedData.purchaseEmail + extractedData.parkingPassNumber,
          cost: extractedData.price,
          // attributes: ["string"],
          status: "AVAILABLE",
          // inHandDaysBeforeEvent: 0,
          // lastPriceUpdate: "2023-10-03T21:30:32.135Z",
          // createdDate: "2023-10-03T21:30:32.135Z",
          // createdBy: "string",
          // lastUpdate: "2023-10-03T21:30:32.135Z",
          // lastUpdateBy: "string",
          // lastDeltaUpdate: "2023-10-03T21:30:32.135Z",
          // version: 0,
          // tags: "string",
          seatType: "CONSECUTIVE",
          eventMapping: {
            eventName: extractedData.eventName,
            venueName: extractedData.venue,
            eventDate: extractedData.eventDate,
            valid: true,
          },
          // mappingId: 0,
          // exchangePosId: 0,
          broadcast: false,
          // zoneSeating: true,
          // electronicTransfer: true,
          // optOutAutoPrice: true,
          hideSeatNumbers: true,
          // vsrOption: "ALL",
          // replenishmentGroupId: 0,
          // replenishmentGroup: "string",
          // shownQuantity: 1,
          // ticketsMerged: true,
          // ticketsSplit: true,
          // auditNote: "string",
          // filesUploaded: false,
          // barCodesEntered: true,
          // instantTransfer: true,
        },
        // cancelled: true,
        // delete: true,
        // cancel: true,
        // fillLineId: 0,
        // inventoryIds: [0],
        // createdDate: "2023-10-03T21:30:32.136Z",
        // createdBy: "string",
        // lastUpdate: "2023-10-03T21:30:32.136Z",
        // lastUpdateBy: "string",
      },
    ],
    purchaseTerm: "NET0",
    paymentMethod: "AP",
    // paymentRef: "string",
    deliveryMethod: "MOBILE_DELIVERY",
    shippingAddressId: 1,
    billingAddressId: 1,
    taxAmount: 0,
    shippingAmount: 0,
    otherAmount: 0,
    // internalNotes: "string",
    // publicNotes: "string",
    // createdDate: "2023-10-03T21:30:32.136Z",
    // lastUpdate: "2023-10-03T21:30:32.136Z",
    // dueDate: "2023-10-03T21:30:32.136Z",
    // tags: "string",
    // createdBy: "string",
    // lastUpdateBy: "string",
    externalRef: extractedData.parkingPassNumber,
    paymentStatus: "UNPAID",
    // creditCardId: 0,
    // creditCardGroupId: 0,
    currencyCode: "USD",
    // payments: [
    //   {
    //     id: 0,
    //     accountId: 0,
    //     referenceNumber: "string",
    //     amount: 0,
    //     paymentDate: "2023-10-03T21:30:32.136Z",
    //     userId: 0,
    //     entityId: 0,
    //     paymentType: "INVOICE",
    //     paymentMethod: "CREDITCARD",
    //     purchaseId: 0,
    //   },
    // ],
    // notes: [
    //   {
    //     id: 0,
    //     userId: 0,
    //     accountId: 0,
    //     purchaseId: 0,
    //     date: "2023-10-03T21:30:32.136Z",
    //     text: "string",
    //     author: "string",
    //   },
    // ],
    received: false,
    // consignment: {
    //   id: 0,
    //   accountId: 1,
    //   purchaseId: 1,
    //   amount: 2,
    //   mode: "FIXED",
    //   completed: false,
    //   created: "2023-10-03T21:30:32.136Z",
    //   lines: [
    //     {
    //       id: 0,
    //       consignmentId: 0,
    //       accountId: 0,
    //       invoiceLineId: 1,
    //       open: false,
    //       originalUnitCost: 0,
    //       mode: "FIXED",
    //       consignmentValue: 0,
    //     },
    //   ],
    // },
    // cooperative: false,
    // status: " ",
    // airbill: "string",
    outstandingBalance: extractedData.price,
  };

  return fetch(SKYBOX_API_ENDPOINT, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        if (text.includes("A duplicate seat number already exists")) {
          seatNumberIncrement++;
          return postToSkyBox(extractedData);
        }
        throw new Error(
          `Failed with status: ${response.status}. Message: ${text}`
        );
      });
    }
    return response.json();
  });
}

module.exports = { postToSkyBox };
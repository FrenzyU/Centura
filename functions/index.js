const functions = require("firebase-functions");
const Alpaca = require("@alpacahq/alpaca-trade-api");

const alpaca = new Alpaca({
  keyId: "CK4Z84IQCS1XRME88SXP",
  secretKey: "T3J45uQfxghhT1lq11EynbPT58bCFM90BLRrzwJg",
  paper: true,
  usePolygon: false,
});

exports.getLatestPrice = functions.https.onRequest(async (req, res) => {
  try {
    const symbol = req.query.symbol;
    const data = await alpaca.getLastTrade({symbol: symbol});
    res.status(200).send(data.last);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

const QRCode = require("qrcode");
const customError = require("../helpers/customError");

// With async/await
exports.generatedQRCode = async (text) => {
  try {
    if (!text) {
      throw new customError(400, "text is required to generate qr code");
    }
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFffff",
      },
    });
    return qrDataUrl;
  } catch (err) {
    throw new customError(400, "Failed to generate qr code");
  }
};

const bwipjs = require("bwip-js");

exports.generatedBarCode = async (text) => {
  try {
    if (!text) {
      throw new customError(400, "text is required to generate bar code");
    }
    let svg = bwipjs.toSVG({
      bcid: "code128", // Barcode type
      text: text, // Text to encode
      height: 12, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Always good to set this
      textcolor: "ff0000", // Red text
    });
    return svg;
  } catch (err) {
    throw new customError(400, "Failed to generate barcode");
  }
};

const path = require("path");

const generateUniqueFileName = (file, prefix = "") => {
  // if (!prefix) throw new Error('Prefix is compulsory for generating file name');
  if (!file || !file.name)
    throw new Error("Valid file object with a name is required");

  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  letters += letters.toLowerCase();

  // Generate 1 to 10 random uppercase letters
  const charCount = Math.floor(Math.random() * 10) + 1;
  let charSeq = "";
  for (let i = 0; i < charCount; i++) {
    charSeq += letters[Math.floor(Math.random() * letters.length)];
  }

  // Generate a number between 1 and 10 digits
  const digitCount = Math.floor(Math.random() * 10) + 1;
  const numSeq = Math.floor(Math.random() * Math.pow(10, digitCount))
    .toString()
    .padStart(digitCount, "0");

  // Random number between 100000 and 999999
  const randomNum = Math.floor(Math.random() * 900000) + 100000;

  // Current timestamp in milliseconds
  const timestamp = Date.now();

  // Get file extension
  const extension = path.extname(file.name);

  // Combine all parts
  return `${prefix}${charSeq}${numSeq}_${randomNum}_${timestamp}${extension}`;
};

module.exports = { generateUniqueFileName };

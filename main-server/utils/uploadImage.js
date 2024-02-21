const { readFile, unlink } = require("fs/promises"); // Import readFile and unlink functions from fs/promises
const axios = require("axios");
const fd = new FormData();
const uploadToServer = async (localFilePath, fileName) => {
  try {
    if (!localFilePath) return null;

    const fileContent = await readFile(localFilePath);

    const response = await axios.post("http://localhost:4000/api/uploadImage", {
      imageData: fileContent,
      fileName: fileName,
    });
    console.log(response.data);
    await unlink(localFilePath);
    if (response.data.success) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.log(`error: `, error);

    await unlink(localFilePath);

    return null;
  }
};

module.exports = uploadToServer; // Export the uploadToServer function

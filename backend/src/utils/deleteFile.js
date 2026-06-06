const fs = require('fs');
const path = require('path');

/**
 * Delete a file from the uploads directory
 * @param {string} filePath - The path to the file (e.g., /uploads/image.jpg)
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  // Convert URL path to system path
  // If it starts with /uploads, we need to remove the leading slash or point to the right dir
  const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const fullPath = path.join(process.cwd(), relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${fullPath}`, err);
      } else {
        console.log(`Successfully deleted file: ${fullPath}`);
      }
    });
  } else {
    console.warn(`File not found, cannot delete: ${fullPath}`);
  }
};

module.exports = { deleteFile };

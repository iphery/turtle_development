import imageCompression from "browser-image-compression";

/**
 * Compresses an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - A promise that resolves with the compressed file
 */
export async function compressImage(file, options = {}) {
  const defaultOptions = {
    maxSizeMB: 0.5, // Default max file size is 1MB
    maxWidthOrHeight: 1920, // Default max width/height is 1920px
    useWebWorker: true,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);

    console.log(
      "Compression complete. Original size:",
      file.size / 1024 / 1024,
      "MB",
    );
    console.log("Compressed size:", compressedFile.size / 1024 / 1024, "MB");

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

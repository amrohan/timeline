export function generateUniqueFilename() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const filenameLength = 6; // Length of the random part of the filename
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in YYYYMMDD format
  let filename = currentDate;

  // Append random characters to the filename
  for (let i = 0; i < filenameLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    filename += characters[randomIndex];
  }

  return filename;
}

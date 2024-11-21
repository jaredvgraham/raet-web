import { del } from "@vercel/blob";

export async function deleteBlob(url: string) {
  try {
    await del([url], { token: process.env.BLOB_READ_WRITE_TOKEN }); // Pass the URL of the blob you want to delete
    console.log(`Blob deleted: ${url}`);
  } catch (error) {
    console.error("Error deleting blob:", error);
  }
}

// Shrinks large photos in the browser before they are uploaded.
// Phone photos are often 4-12 MB, which makes the public pages slow;
// a 1920px JPEG is plenty for every place the site shows an image.

const MAX_SIDE = 1920;
const SKIP_BELOW_BYTES = 500 * 1024;
const QUALITY = 0.85;

export async function shrinkImage(file: File): Promise<File> {
  // Animated / vector formats are left untouched.
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(
      1,
      MAX_SIDE / Math.max(bitmap.width, bitmap.height)
    );

    if (scale === 1 && file.size <= SKIP_BELOW_BYTES) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      bitmap.close();
      return file;
    }

    // JPEG has no transparency, so paint a white background first.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );

    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File(
      [blob],
      `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
      { type: "image/jpeg", lastModified: Date.now() }
    );
  } catch {
    // Unsupported format or old browser: upload the original.
    return file;
  }
}

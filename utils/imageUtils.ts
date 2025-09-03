
export function createThumbnail(
  base64Image: string,
  maxWidth: number = 128,
  maxHeight: number = 128,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get 2D context from canvas'));
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Use JPEG for better compression for photographic images
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = (error) => {
      console.error("Failed to load image for thumbnail generation", error);
      reject(new Error('Image could not be loaded for thumbnail creation.'));
    };
  });
}

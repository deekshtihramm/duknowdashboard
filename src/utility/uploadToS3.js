const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


export const uploadImageToS3 = async (image) => {
  try {
    let body, fileName;

    if (typeof image === "string" && image.startsWith("data:image")) {
      // base64 image
      const binary = atob(image.split(",")[1]);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
      body = array;
      fileName = `uploads/${Date.now()}.png`;
    } else if (image instanceof File) {
      // File object
      body = image;
      fileName = `uploads/${Date.now()}-${image.name}`;
    } else {
      return null;
    }

    const s3 = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: "duknow",
      Key: fileName,
      Body: body,
      ContentType: "image/png",
      ACL: "public-read",
    });

    await s3.send(command);
    return `https://duknow.s3.ap-south-1.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("S3 upload error:", err);
    return null;
  }
};

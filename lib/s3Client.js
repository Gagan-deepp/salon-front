import { S3Client } from "@aws-sdk/client-s3";


// Initialize S3Client with DigitalOcean Spaces config
export const s3Client = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_KEY_SECRET,
    },
});

export async function getUploadUrl(fileName, fileType) {

    console.log("Generating upload URL for:", fileName, fileType);

    const key = `invoice/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        ContentType: fileType,
        ACL: "public-read",
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return { url, key };
}
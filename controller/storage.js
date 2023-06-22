const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: 'AKIAXHDYJZWXYBA63MBY',
  secretAccessKey: '6UdT1GVNFDQqZ4/zfs9aN0OOP7ipZDe/xk8Kw4KA',
});

const s3 = new AWS.S3();

// Function to read a file from AWS S3
async function readFileFromS3(bucketName, fileName) {
  const params = { Bucket: bucketName, Key: fileName };
  try {
    const response = await s3.getObject(params).promise();
    return response.Body;
  } catch (error) {
    console.error('Error reading file from S3:', error);
    throw error;
  }
}

// Function to write a file to AWS S3
async function writeFileToS3(bucketName, fileName, fileContent) {
    
  const params = { Bucket: bucketName, Key: fileName, Body: fileContent };
  try {
    await s3.putObject(params).promise();
    console.log('File has been written to S3 successfully.');
  } catch (error) {
    console.error('Error writing file to S3:', error);
    throw error;
  }
}

module.exports = { readFileFromS3, writeFileToS3 };

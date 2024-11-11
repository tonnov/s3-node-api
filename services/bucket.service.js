import { readFile } from "node:fs/promises";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import Connect, { bucketName } from "../config/s3-connect.js";

export const getObjects = async () => {
  const client = Connect();
  const input = {
    Bucket: bucketName,
    MaxKeys: 50,
  };

  try {
    const command = new ListObjectsCommand(input);
    const response = await client.send(command);
    return response.Contents;
  } catch (caught) {
    if (caught instanceof S3ServiceException) {
      throw `${caught}`;
    } else {
      throw caught;
    }
  }
};

export const getObjectUrl = async (key) => {
  const client = Connect();
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const comm = new HeadObjectCommand(params);
    await client.send(comm);

    const command = new GetObjectCommand(params);

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return url;
  } catch (caught) {
    if (caught instanceof S3ServiceException) {
      throw `${key} ${caught.name}`;
    } else {
      throw caught;
    }
  }
};

export const getObject = async (key) => {
  const client = Connect();

  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    const { Body } = await client.send(new GetObjectCommand(params));

    const filePath = `./temp/${key}`;

    await new Promise((resolve, reject) => {
      Body.pipe(fs.createWriteStream(filePath))
        .on("error", (err) => reject(err))
        .on("close", () => resolve());
    });

    return;
  } catch (caught) {
    if (caught instanceof S3ServiceException) {
      throw `while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`;
    } else {
      throw caught;
    }
  }
};

export const uploadObject = async (key, filePath) => {
  const client = Connect();

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: await readFile(filePath),
    });
    const response = await client.send(command);

    return response;
  } catch (caught) {
    if (caught instanceof S3ServiceException) {
      throw `while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`;
    } else {
      throw caught;
    }
  }
};

export const deleteObject = async (key) => {
  const client = Connect();
  const params = { Bucket: bucketName, Key: key };

  try {
    const comm = new HeadObjectCommand(params);
    await client.send(comm);

    const command = new DeleteObjectCommand(params);

    const response = await client.send(command);
    return response;
  } catch (caught) {
    if (caught instanceof S3ServiceException) {
      throw `${key} ${caught.name}`;
    } else {
      throw caught;
    }
  }
};

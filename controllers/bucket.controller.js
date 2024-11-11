import {
  deleteObject,
  getObject,
  getObjects,
  getObjectUrl,
  uploadObject,
} from "../services/bucket.service.js";

export const objetosIndex = async (req, res) => {
  try {
    const objetos = await getObjects();
    res.status(200).json(objetos);
  } catch (error) {
    res.status(404).json({ Error: error });
  }
};

export const getFile = async (req, res) => {
  const { objeto } = req.body;
  try {
    await getObject(objeto);
    const { pathname: filePath } = new URL(
      `../temp/${objeto}`,
      import.meta.url
    );
    res.status(200).sendFile(filePath);
  } catch (err) {
    res.status(404).json({ Error: err });
  }
};

export const getFileUrl = async (req, res) => {
  const { objeto } = req.body;
  try {
    const resp = await getObjectUrl(objeto);
    res.status(200).json(resp);
  } catch (err) {
    res.status(404).json({ Error: err });
  }
};

export const uploadFile = async (req, res) => {
  console.log(req.file);
  const { originalname, path } = req.file;
  const fileName = originalname //rename file
    .trim()
    .replace(/\s/g, "-")
    .replace(/\(|\)/g, "");
  const ret = await uploadObject(fileName, path);
  res.status(200).json({ fileName, ETag: ret.ETag });
};

export const deleteFile = async (req, res) => {
  try {
    const { objeto } = req.body;
    const ret = await deleteObject(objeto);
    res.status(200).send(ret);
  } catch (err) {
    res.status(404).json({ Error: err });
  }
};

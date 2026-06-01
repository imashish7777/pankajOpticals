import { API_BASE_URL } from "../../../utilies/base_URL";
import axios from "axios";

const uploadImg = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/addimage`,
    data
  );
  return response.data;
};
const uploadImgtoproduct = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/addimagetoproduct`,
    data
  );
  return response.data;
};
const uploadthumtoproduct = async (data) => {
  const response = await axios({
    method: "post",

    url: `${API_BASE_URL}/admin/addthumnailtoproduct`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteImg = async (data) => {
  const response = await axios({
    method: "delete",
    url: `${API_BASE_URL}/admin/deleteimage`,
    data: data,
  });
  return response.data;
};

const removeimagefromproduct = async (data) => {
  const response = await axios({
    method: "put",
    url: `${API_BASE_URL}/admin/removeimagefromproduct`,
    data: data,
  });
  return response.data;
};
const removethumnailfromproduct = async (data) => {
  const response = await axios({
    method: "put",
    url: `${API_BASE_URL}/admin/removethumnailfromproduct`,
    data: data,
  });
  return response.data;
};

const uploadService = {
  uploadImg,
  deleteImg,
  removeimagefromproduct,
  removethumnailfromproduct,
  uploadImgtoproduct,
  uploadthumtoproduct,
};

export default uploadService;

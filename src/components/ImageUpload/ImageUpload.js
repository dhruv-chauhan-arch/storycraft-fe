import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import {
  ACCEPTED_FILE_TYPES,
  ATTACHMENT_MAX_SIZE,
  IMAGE_SIZE_ERROR,
  MAX_FILE_COUNT,
} from "./constants";
import PropTypes from "prop-types";
import axios from "axios";
import { useMantineTheme } from "@mantine/core";
import { get } from "lodash";
import styles from "./ImageUpload.module.scss";
import { notifications } from "@mantine/notifications";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../constants";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUpload = ({
  endPoint,
  fileUploaded,
  uploadType,
  labelName,
  isUploading,
  isDisabled,
  parentFileUrl,
  uid,
}) => {
  const theme = useMantineTheme();
  // eslint-disable-next-line no-unused-vars
  const [fileUploading, setFileUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (parentFileUrl) {
      setFileList([{ uid, url: parentFileUrl }]);
    }
  }, []);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const customRequest = async (options) => {
    setFileUploading(true);
    isUploading(true);
    const { file, onProgress, onSuccess, onError } = options;
    const fm = new FormData();
    fm.append(uploadType, file);

    try {
      const response = await axios.post(endPoint, fm, {
        headers: {},
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          onProgress({ percent });
        },
      });

      if (response.status === 200) {
        onSuccess(response, file);
        setUrlToImage(file);
        notifications.show({
          title: NOTIFICATION_MESSAGE.SUCCESS,
          message: NOTIFICATION_MESSAGE.UPLOAD_SUCCESS_DESC,
          icon: NOTIFICATION_ICON.SUCCESS,
        });
      } else {
        onError(NOTIFICATION_MESSAGE.UPLOAD_FAILED);
        notifications.show({
          title: NOTIFICATION_MESSAGE.UPLOAD_FAILED,
          message: NOTIFICATION_MESSAGE.UPLOAD_FAIL_DESC,
          icon: NOTIFICATION_ICON.ERROR,
        });
      }
      setFileUploading(false);
      isUploading(false);
      fileUploaded(response, fileList[0]);
    } catch (error) {
      setFileUploading(false);
      isUploading(false);
      onError(error);
      notifications.show({
        title: NOTIFICATION_MESSAGE.UPLOAD_FAILED,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    }
  };

  const setUrlToImage = (file) => {
    const { uid, name, size, type } = file;
    const reader = new FileReader();

    reader.onload = () => {
      const newObj = {
        uid,
        name,
        size,
        type,
        url: reader.result,
      };
      setFileList([newObj]);
    };

    reader.readAsDataURL(file);
  };
  const uploadButton = (
    <div
      style={
        theme?.colorScheme === "dark"
          ? {
              color: "white",
            }
          : {
              color: "black",
            }
      }
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const beforeFileUploadHandler = (file) => {
    const { size } = file;

    if (size > ATTACHMENT_MAX_SIZE) {
      notifications.show({
        title: NOTIFICATION_MESSAGE.UPLOAD_FAILED,
        message: IMAGE_SIZE_ERROR,
        icon: NOTIFICATION_ICON.ERROR,
      });
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <div className={styles.uploadContainer}>
      <label htmlFor={labelName}>{labelName}</label>
      <Upload
        id={labelName}
        customRequest={customRequest}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={(file, filesList) =>
          beforeFileUploadHandler(file, filesList)
        }
        maxCount={MAX_FILE_COUNT}
        className={
          theme.colorScheme === "dark"
            ? styles.darkUploadBtn
            : styles.lightUploadBtn
        }
        accept={`${ACCEPTED_FILE_TYPES.map((fileType) => fileType)}`}
        disabled={!!isDisabled}
      >
        {fileList.length >= MAX_FILE_COUNT ? null : uploadButton}
      </Upload>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};
export default ImageUpload;

ImageUpload.propTypes = {
  fileUploaded: PropTypes.any,
  endPoint: PropTypes.string,
  uploadType: PropTypes.string,
  labelName: PropTypes.string,
  isUploading: PropTypes.func,
  isDisabled: PropTypes.any,
  parentFileUrl: PropTypes.any,
  uid: PropTypes.any,
};

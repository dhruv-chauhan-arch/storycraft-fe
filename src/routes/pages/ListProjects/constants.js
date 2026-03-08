import React from "react";
import { API_PROJECT, API_STORY } from "../constants";

export const MODAL_DATA = {
  BUILD: {
    title: "Process data",
    content: () => (
      <>
        Do you want to process this data? <br />
        This process can take up to 1 minute, so check after some time or check
        the status buttons...
        <br />
      </>
    ),
    confirmButton: { text: "Let's do it", color: "green" },
    cancelButton: "No, don't",
    url: `${API_PROJECT}/build`,
    isDelete: false,
  },
  DELETE: {
    title: "Delete project",
    content: () => (
      <>
        Are you sure you want to delete your project? This action is destructive
        and you will not able to restore your data.
      </>
    ),
    confirmButton: { text: "Delete it", color: "red" },
    cancelButton: "Umm, Naah",
    url: `${API_PROJECT}`,
    isDelete: true,
  },
  STORY_DELETE: {
    title: "Delete story",
    content: () => (
      <>
        Are you sure you want to delete this story? This action is destructive
        and you will not able to restore your data.
      </>
    ),
    confirmButton: { text: "Just delete it", color: "red" },
    cancelButton: "No, don't",
    url: `${API_STORY}`,
    isDelete: true,
  },
};

export const PROJECT_STATUS = [
  { value: "", label: "All Status" },
  { value: "Uploaded", label: "Uploaded" },
  { value: "Processing", label: "Processing" },
  { value: "Completed", label: "Completed" },
  { value: "Failed", label: "Failed" },
];

export const PROJECT_STEP = {
  UPLOADED: "Uploaded",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};
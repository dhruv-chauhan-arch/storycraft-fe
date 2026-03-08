import React from "react";
import { IconMoodCrazyHappy, IconSquareRoundedX } from "@tabler/icons-react";

export const NOTIFICATION_ICON = {
  SUCCESS: <IconMoodCrazyHappy />,
  ERROR: <IconSquareRoundedX />,
};

export const NOTIFICATION_MESSAGE = {
  ADD_SUCCESS: "Added successfully",
  EDIT_SUCCESS: "Updated successfully",
  DELETE_SUCCESS: "Deleted successfully",
  PROCESS_SUCCESS: "Project's data processing has been started",
  UPLOAD_SUCCESS: "Upload successful",
  UPLOAD_SUCCESS_DESC: "The upload was successful.",
  UPLOAD_FAILED: "Upload failed",
  UPLOAD_FAIL_DESC: "There was an error during the upload.",
  ERROR: "Error!",
};

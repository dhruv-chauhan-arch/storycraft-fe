import { API_PROJECT } from "../constants";

export const IMAGE_UPLOADS = [
  {
    endPoint: `${API_PROJECT}/mind-map`,
    uploadType: "image",
    labelName: "Mind Map",
    keyName: "mindMapDesc",
    fileKeyName: "mindMap",
  },
  {
    endPoint: `${API_PROJECT}/action-map`,
    uploadType: "image",
    labelName: "Action Map",
    keyName: "actionMapDesc",
    fileKeyName: "actionMap",
  },
  {
    endPoint: `${API_PROJECT}/system-actor`,
    uploadType: "image",
    labelName: "System Actor",
    keyName: "systemActorDesc",
    fileKeyName: "systemActor",
  },
  {
    endPoint: `${API_PROJECT}/info-arch`,
    uploadType: "image",
    labelName: "Info Architecture",
    keyName: "infoArchitectureDesc",
    fileKeyName: "infoArchitecture",
  },
];

export const INITIAL_FORM_DATA = {
  projectName: "",
  description: "",
  userStory: "",
  mindMapDesc: null,
  actionMapDesc: null,
  systemActorDesc: null,
  infoArchitectureDesc: null,
};

import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Container,
  TextInput,
  Button,
  Textarea,
  Grid,
  Col,
  Center,
  Skeleton,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import axios from "axios";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import { IMAGE_UPLOADS, INITIAL_FORM_DATA } from "./constants.js";
import { get } from "lodash";
import styles from "./Home.module.scss";
import { API_PROJECT } from "../constants";
import { notifications } from "@mantine/notifications";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../../constants";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollIntoView: scrollProjectName, targetRef: projectNameRef } =
    useScrollIntoView({
      offset: 600,
    });
  const { scrollIntoView: scrollDescription, targetRef: descriptionRef } =
    useScrollIntoView({
      offset: 600,
    });
  const { scrollIntoView: scrollUserStory, targetRef: userStoryRef } =
    useScrollIntoView({
      offset: 600,
    });
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFileList, setEditFileList] = useState([]);

  const form = useForm({
    initialValues: INITIAL_FORM_DATA,
    validate: {
      projectName: (value) => {
        if (value.length === 0) {
          return "Please enter project name";
        }
        if (value.length < 2) {
          return "Project Name must have at least 2 letters";
        }
        if (value.length > 20) {
          return "Project Name must be less than 20 characters";
        }
        return null;
      },
      description: (value) => {
        if (value.length === 0) {
          return "Please enter project description";
        }
        return null;
      },
      userStory: (value) => {
        if (value.length === 0) {
          return "Please enter user story";
        }
      },
    },
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    setIsSubmitting(true);
    if (id) {
      const payload = {
        id,
        mindMap: get(formData, "mindMap"),
        actionMap: get(formData, "actionMap"),
        systemActor: get(formData, "systemActor"),
        infoArchitecture: get(formData, "infoArchitecture"),
        projectName: values.projectName,
        description: values.description,
        userStory: values.userStory,
        mindMapDesc: formData.mindMapDesc,
        actionMapDesc: formData.actionMapDesc,
        systemActorDesc: formData.systemActorDesc,
        infoArchitectureDesc: formData.infoArchitectureDesc,
      };
      try {
        const response = await axios.put(`${API_PROJECT}`, payload);
        notifications.show({
          title: NOTIFICATION_MESSAGE.EDIT_SUCCESS,
          message: get(response, "data.data.message"),
          icon: NOTIFICATION_ICON.SUCCESS,
        });
      } catch (error) {
        notifications.show({
          title: NOTIFICATION_MESSAGE.ERROR,
          message: get(error, "response.data.message"),
          icon: NOTIFICATION_ICON.ERROR,
        });
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    } else {
      const fm = new FormData();
      fm.append("projectName", values.projectName);
      fm.append("description", values.description);
      fm.append("userStory", values.userStory);

      fm.append("mindMapDesc", formData.mindMapDesc);
      fm.append("actionMapDesc", formData.actionMapDesc);
      fm.append("systemActorDesc", formData.systemActorDesc);
      fm.append("infoArchitectureDesc", formData.infoArchitectureDesc);
      fm.append("mindMap", get(formData, "mindMap.originFileObj"));
      fm.append("actionMap", get(formData, "actionMap.originFileObj"));
      fm.append("systemActor", get(formData, "systemActor.originFileObj"));
      fm.append(
        "infoArchitecture",
        get(formData, "infoArchitecture.originFileObj")
      );
      try {
        const response = await axios.post(`${API_PROJECT}`, fm);
        notifications.show({
          title: NOTIFICATION_MESSAGE.ADD_SUCCESS,
          message: get(response, "data.data.message"),
          icon: NOTIFICATION_ICON.SUCCESS,
        });
        form.setFieldValue("projectName", "");
        form.setFieldValue("description", "");
        form.setFieldValue("userStory", "");
        setFormData(INITIAL_FORM_DATA);
      } catch (error) {
        notifications.show({
          title: NOTIFICATION_MESSAGE.ERROR,
          message: get(error, "response.data.message"),
          icon: NOTIFICATION_ICON.ERROR,
        });
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    }
  };

  const fileUploaded = (data, file, keyName, fileKeyName) => {
    setFormData((prev) => ({
      ...prev,
      [keyName]: get(data, "data.data.caption_GPTS"),
      [fileKeyName]: file,
    }));
  };

  const isUploading = (res) => setLoading(res);

  if (form.errors.projectName) {
    scrollProjectName();
  }
  if (form.errors.description) {
    scrollDescription();
  }
  if (form.errors.userStory) {
    scrollUserStory();
  }
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const isView = searchParams.get("isView");

  useEffect(() => {
    if (id) {
      fetchProjectData(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProjectData = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await axios.get(
        `${API_PROJECT}/details?id=${encodeURIComponent(id)}`
      );
      form.setFieldValue(
        "projectName",
        get(response, "data.data.projectName", "")
      );
      form.setFieldValue(
        "description",
        get(response, "data.data.description", "")
      );
      form.setFieldValue("userStory", get(response, "data.data.userStory", ""));
      setFormData((prev) => ({
        ...prev,
        projectName: get(response, "data.data.projectName"),
        description: get(response, "data.data.description"),
        userStory: get(response, "data.data.userStory"),
        mindMapDesc: get(response, "data.data.mindMapDesc"),
        actionMapDesc: get(response, "data.data.actionMapDesc"),
        systemActorDesc: get(response, "data.data.systemActorDesc"),
        infoArchitectureDesc: get(response, "data.data.infoArchitectureDesc"),
        mindMap: get(response, "data.data.mindMap"),
        actionMap: get(response, "data.data.actionMap"),
        systemActor: get(response, "data.data.systemActor"),
        infoArchitecture: get(response, "data.data.infoArchitecture"),
      }));
      const newFileList = [];
      newFileList.push({ uid: 1, url: get(response, "data.data.mindMap") });
      newFileList.push({
        uid: 2,
        url: get(response, "data.data.actionMap"),
      });
      newFileList.push({
        uid: 3,
        url: get(response, "data.data.systemActor"),
      });
      newFileList.push({
        uid: 4,
        url: get(response, "data.data.infoArchitecture"),
      });
      setEditFileList(newFileList);
      setIsLoading(false);
    } catch (error) {
      notifications.show({
        title: NOTIFICATION_MESSAGE.ERROR,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="lg" className="fullHeight">
      <div className={styles.dashboardMainContainer}>
        <form
          onSubmit={form.onSubmit(handleFormSubmit)}
          className={`${styles.flex}`}
        >
          <Grid gutter="lg">
            <Col
              span={12}
              md={6}
              lg={6}
              className={`${styles.flex} ${
                Object.keys(form.errors).length > 0 && styles.lessGap
              }`}
            >
              {isLoading ? (
                <>
                  <label>Project Name</label>
                  <Skeleton height={40} count={3} />

                  <label>Description</label>
                  <Skeleton height={180} count={3} />

                  <label>User story</label>
                  <Skeleton height={335} count={3} />
                </>
              ) : (
                <>
                  <TextInput
                    label="Project Name"
                    placeholder="Enter Project Name..."
                    {...form.getInputProps("projectName")}
                    error={form.errors.projectName}
                    ref={projectNameRef}
                    withAsterisk
                    disabled={isView}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter Description..."
                    {...form.getInputProps("description")}
                    error={form.errors.description}
                    ref={descriptionRef}
                    withAsterisk
                    disabled={isView}
                  />
                  <Textarea
                    label="User Story"
                    withAsterisk
                    ref={userStoryRef}
                    placeholder="Enter User Story..."
                    {...form.getInputProps("userStory")}
                    className={styles.userStory}
                    disabled={isView}
                  />
                </>
              )}
            </Col>
            <Col span={12} md={6} lg={6}>
              {isLoading
                ? IMAGE_UPLOADS.map((upload, index) => (
                    <>
                      <label key={index}>{upload.labelName}</label>
                      <Skeleton
                        key={index}
                        height={150}
                        count={IMAGE_UPLOADS.length}
                        style={{ marginBottom: "10px" }}
                      />
                    </>
                  ))
                : IMAGE_UPLOADS.map((upload, index) => (
                    <div
                      style={{ pointerEvents: loading ? "none" : "unset" }}
                      key={index}
                    >
                      <ImageUpload
                        key={index}
                        endPoint={upload.endPoint}
                        fileUploaded={(response, file) => {
                          fileUploaded(
                            response,
                            file,
                            upload.keyName,
                            upload.fileKeyName
                          );
                        }}
                        uploadType={upload.uploadType}
                        labelName={upload.labelName}
                        isUploading={isUploading}
                        isDisabled={isView || id}
                        uid={index + 1}
                        parentFileUrl={editFileList[index]?.url}
                      />
                    </div>
                  ))}
            </Col>
          </Grid>
          <Center>
            {!isView && !isLoading && (
              <Button disabled={loading || isSubmitting} type="submit">
                {id ? "Edit Project" : "Add Project"}
              </Button>
            )}
          </Center>
        </form>
      </div>
    </Container>
  );
};

export default Home;

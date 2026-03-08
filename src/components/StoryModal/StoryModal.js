import {
  Modal,
  Paper,
  Textarea,
  useMantineTheme,
  Skeleton,
  Button,
  Center,
  Box,
  Flex,
  Text,
  ScrollArea,
} from "@mantine/core";
import styles from "./StoryModal.module.scss";
import { get } from "lodash";
import axios from "axios";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { notifications } from "@mantine/notifications";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../constants";
import { useForm } from "@mantine/form";
import { API_STORY } from "../../routes/pages/constants";

const StoryModal = ({ id, isModalOpen, onModalClose, isViewModal }) => {
  const theme = useMantineTheme();

  const [currentStory, setCurrentStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      acceptanceCriteria: "",
      negativeTestCase: "",
      positiveTestCase: "",
    },
    validate: {
      title: (value) => {
        if (value.length === 0) {
          return "Please enter title";
        }
        return null;
      },
      description: (value) => {
        if (value.length === 0) {
          return "Please enter description";
        }
        return null;
      },
      acceptanceCriteria: (value) => {
        if (value.length === 0) {
          return "Please enter acceptance criteria";
        }
        return null;
      },
      negativeTestCase: (value) => {
        if (value.length === 0) {
          return "Please enter negative test case";
        }
        return null;
      },
      positiveTestCase: (value) => {
        if (value.length === 0) {
          return "Please enter positive test case";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    fetchStory();
  }, []);

  const handleFormSubmit = async (values) => {
    const payload = {
      id,
      title: values.title,
      description: values.description,
      acceptanceCriteria: values.acceptanceCriteria,
      positiveTestCase: values.positiveTestCase,
      negativeTestCase: values.negativeTestCase,
      edgeCases: values.edgeCases,
    };
    try {
      const response = await axios.put(`${API_STORY}`, payload);
      if (response) {
        notifications.show({
          title: NOTIFICATION_MESSAGE.EDIT_SUCCESS,
          message: get(response, "data.data.message"),
          icon: NOTIFICATION_ICON.SUCCESS,
        });
        onModalClose();
      }
    } catch (error) {
      notifications.show({
        title: NOTIFICATION_MESSAGE.ERROR,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    }
  };

  const fetchStory = async () => {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await axios.get(`${API_STORY}/details?id=${id}`);
      setCurrentStory(data);
      form.setFieldValue("title", get(data, "title", ""));
      form.setFieldValue("description", get(data, "description", ""));
      form.setFieldValue(
        "acceptanceCriteria",
        get(data, "acceptanceCriteria", "")
      );
      form.setFieldValue("positiveTestCase", get(data, "positiveTestCase", ""));
      form.setFieldValue("negativeTestCase", get(data, "negativeTestCase", ""));
      form.setFieldValue("edgeCases", get(data, "edgeCases", ""));
    } catch (error) {
      notifications.show({
        title: "Error fetching story",
        message: get(error, "message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSkeletonLoader = () => (
    <div>
      <Paper>
        <Text component="h3">
          <Flex gap={10} align="center">
            <Text component="h3">Project name:</Text>
            <Skeleton height={30} width={"30%"} />
          </Flex>
        </Text>
        {[
          "Description:",
          "Acceptance Criteria:",
          "Positive Test Cases:",
          "Negative Test Cases:",
          "Edge Cases:",
        ].map((item) => (
          <div key={item}>
            <Text component="h3">{item}</Text>
            <Skeleton height={80} mt={10} />
          </div>
        ))}
      </Paper>
    </div>
  );

  const renderStoryData = () =>
    currentStory ? (
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <ScrollArea type="auto">
          <Paper>
            {isViewModal ? (
              <>
                <Text fw={500} mt={10} mr={10}>
                  <div className={styles.storyLabel}>Title</div>
                </Text>
                <Text size="sm" mt={10} ml={10} mr={10}>
                  {currentStory.title}
                </Text>
              </>
            ) : (
              <Textarea
                name="title"
                autosize
                placeholder="Enter title..."
                disabled={isViewModal}
                error={form.errors.title}
                {...form.getInputProps("title")}
                label="Title"
                withAsterisk
              />
            )}

            {isViewModal ? (
              <>
                <Text fw={500} mt={20} mr={10}>
                  <div className={styles.storyLabel}>Description</div>
                </Text>
                <Text size="sm" mt={10} ml={10} mr={10}>
                  {get(currentStory, "description", "-")}
                </Text>
              </>
            ) : (
              <Textarea
                mt={10}
                name="description"
                label="Description"
                autosize
                placeholder="Enter description..."
                disabled={isViewModal}
                style={{ whiteSpace: "pre-line" }}
                {...form.getInputProps("description")}
                withAsterisk
              />
            )}

            {isViewModal ? (
              <>
                <Text fw={500} mt={20} mr={10}>
                  <div className={styles.storyLabel}>Acceptance Criteria</div>
                </Text>
                <Text
                  size="sm"
                  mt={10}
                  ml={10}
                  mr={10}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {get(currentStory, "acceptanceCriteria", "-")}
                </Text>
              </>
            ) : (
              <Textarea
                mt={10}
                name="acceptanceCriteria"
                autosize
                placeholder="Enter your acceptance criteria..."
                disabled={isViewModal}
                {...form.getInputProps("acceptanceCriteria")}
                label="Acceptance Criteria"
                withAsterisk
              />
            )}

            {isViewModal ? (
              <>
                <Text fw={500} mt={20} mr={10}>
                  <div className={styles.storyLabel}>Positive Test Case</div>
                </Text>
                <Text
                  size="sm"
                  mt={10}
                  ml={10}
                  mr={10}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {get(currentStory, "positiveTestCase", "-")}
                </Text>
              </>
            ) : (
              <Textarea
                mt={10}
                name="positiveTestCase"
                autosize
                placeholder="Enter positive test cases..."
                disabled={isViewModal}
                {...form.getInputProps("positiveTestCase")}
                label="Positive Test Cases"
                withAsterisk
              />
            )}

            {isViewModal ? (
              <>
                <Text fw={500} mt={20} mr={10}>
                  <div className={styles.storyLabel}>Negative Test Case</div>
                </Text>
                <Text
                  size="sm"
                  mt={10}
                  ml={10}
                  mr={10}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {get(currentStory, "negativeTestCase", "-")}
                </Text>
              </>
            ) : (
              <Textarea
                mt={10}
                name="negativeTestCase"
                autosize
                placeholder="Enter negative test cases..."
                disabled={isViewModal}
                {...form.getInputProps("negativeTestCase")}
                label="Negative Test Cases"
                withAsterisk
              />
            )}

            {isViewModal ? (
              <>
                <Text fw={500} mt={20} mr={10}>
                  <div className={styles.storyLabel}>Edge Cases</div>
                </Text>
                <Text
                  size="sm"
                  mt={10}
                  ml={10}
                  mr={10}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {currentStory?.edgeCases?.length !== 0
                    ? get(currentStory, "edgeCases")
                    : "-"}
                </Text>
              </>
            ) : (
              <Textarea
                mt={10}
                name="edgeCases"
                autosize
                placeholder="Enter edge cases..."
                disabled={isViewModal}
                {...form.getInputProps("edgeCases")}
                label="Edge Cases"
              />
            )}

            {!isViewModal && (
              <Box>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="center"
                  gap="sm"
                  align="center"
                  mt={20}
                  mb={10}
                >
                  <Button variant="filled" size="sm" type="submit">
                    Update Story
                  </Button>
                </Flex>
              </Box>
            )}
          </Paper>
        </ScrollArea>
      </form>
    ) : (
      <Box>
        <Center>No Data Found</Center>
      </Box>
    );

  return (
    <Modal
      size="xl"
      title={isViewModal ? "View Story" : "Edit Story"}
      opened={isModalOpen}
      onClose={onModalClose}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      closeButtonProps={{ disabled: loading }}
      overlayProps={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
      className={styles.storyModalContainer}
    >
      {loading ? renderSkeletonLoader() : renderStoryData()}
    </Modal>
  );
};

export default StoryModal;

StoryModal.propTypes = {
  id: PropTypes.any,
  story: PropTypes.any,
  isModalOpen: PropTypes.any,
  onModalClose: PropTypes.any,
  isViewModal: PropTypes.bool,
};

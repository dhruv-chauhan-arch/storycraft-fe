import React, { useState } from "react";
import { Modal, Button, Text, Box, Flex, useMantineTheme } from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { get } from "lodash";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../constants";
import { MODAL_DATA } from "../../routes/pages/ListProjects/constants";
import PropTypes from "prop-types";

const CustomModal = ({ isOpen, onClose, id, onSucess, type }) => {
  const theme = useMantineTheme();

  const [isModalEditing, setIsModalEditing] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsModalEditing(true);
      if (type === "BUILD") {
        const response = await axios.post(`${MODAL_DATA[type].url}`, {
          id,
        });
        notifications.show({
          title: NOTIFICATION_MESSAGE.PROCESS_SUCCESS,
          message: get(response, "response.data.message"),
          icon: NOTIFICATION_ICON.SUCCESS,
        });
      } else {
        const response = await axios.delete(`${MODAL_DATA[type].url}`, {
          data: { id },
        });
        notifications.show({
          title: NOTIFICATION_MESSAGE.DELETE_SUCCESS,
          message: get(response, "response.data.message"),
          icon: NOTIFICATION_ICON.SUCCESS,
        });
      }
      onClose();
      onSucess();
    } catch (error) {
      notifications.show({
        title: NOTIFICATION_MESSAGE.ERROR,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    } finally {
      setIsModalEditing(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="md"
      centered
      closeOnClickOutside={!isModalEditing}
      closeOnEscape={isModalEditing}
      closeButtonProps={{ disabled: isModalEditing }}
      title={MODAL_DATA[type].title}
      overlayProps={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Modal.Body p={0}>
        <Text size="md">{MODAL_DATA[type].content()}</Text>
        <Box>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="end"
            gap="sm"
            align="center"
            mt={10}
          >
            <Button variant="light" disabled={isModalEditing} onClick={onClose}>
              {MODAL_DATA[type].cancelButton}
            </Button>
            <Button
              color={MODAL_DATA[type].confirmButton.color}
              loading={isModalEditing}
              onClick={handleConfirm}
            >
              {MODAL_DATA[type].confirmButton.text}
            </Button>
          </Flex>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;

CustomModal.propTypes = {
  id: PropTypes.any,
  isOpen: PropTypes.any,
  onClose: PropTypes.any,
  onSucess: PropTypes.any,
  type: PropTypes.any,
};

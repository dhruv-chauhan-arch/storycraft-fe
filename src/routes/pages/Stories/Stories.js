import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Text,
  ActionIcon,
  Tooltip,
  Pagination,
  Box,
  Flex,
  Skeleton,
  Select,
  MediaQuery,
} from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import StoryModal from "../../../components/StoryModal/StoryModal";
import { API_PROJECT, API_STORY } from "../constants";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../../constants";
import { get } from "lodash";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import CustomModal from "../../../components/CustomModal/CustomModal";
import { useLocation, useSearchParams } from "react-router-dom";
import dateformat from "dateformat";
import { TableLoader, truncateText } from "./helper";

const Stories = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramId = searchParams.get("id");

  const [pageParams, setPageParams] = useSearchParams({
    id: "",
    page: 1
  });
  const pageQueryParam = pageParams.get("page") || 1;

  const [storiesList, setStoriesList] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentModalId, setCurrentModalId] = useState(null);

  const [projectListLoader, setProjectListLoader] = useState(false);
  const [projectListId, setProjectListId] = useState(false);
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    fetchProjectList();
  }, []);

  const fetchProjectList = async () => {
    setProjectListLoader(true);
    try {
      const response = await axios.get(
        `${API_PROJECT}?all=true&status=Completed`
      );
      const currList = get(response, "data.data.docs").map((project) => ({
        value: project._id,
        label: project.projectName,
      }));
      setProjectListLoader(false);
      paramId
        ? setProjectListId(paramId)
        : setProjectListId(currList[0]?.value);
      setProjectList(currList);
      (paramId || currList.length > 0) && setLoading(true);
      currList.length > 0 &&
        fetchStoryList({
          pageNo: pageQueryParam,
          projectId: paramId || currList[0]?.value,
        });
    } catch (error) {
      setProjectListLoader(false);
      notifications.show({
        title: NOTIFICATION_MESSAGE.ERROR,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    }
  };

  const handleProjectChange = (currProjectId) => {
    setProjectListId(currProjectId);
    setLoading(true);
    setPageParams(
      (prev) => {
        prev.set("id", currProjectId);
        prev.set("page", 1);
        return prev;
      },
      { replace: true }
    );
    fetchStoryList({
      pageNo: 1,
      projectId: currProjectId || paramId,
    });
  };

  const fetchStoryList = async ({ pageNo, projectId }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_STORY}?page=${pageNo}&id=${projectId}`
      );
      setStoriesList(get(response, "data.data.docs"));
      setTotalPages(get(response, "data.data.totalPages"));
      setLoading(true);
    } catch (error) {
      notifications.show({
        title: NOTIFICATION_MESSAGE.ERROR,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNo) => {
    setPageParams(
      (prev) => {
        prev.set("page", pageNo);
        return prev;
      },
      { replace: true }
    );
    setLoading(true);
    fetchStoryList({ pageNo, projectId: projectListId });
  };

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setId(null);
    setEditModalOpen(false);
    setIsView(false);
  };

  const editStory = (id) => {
    setId(id);
    openEditModal();
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const onSucess = () => {
    fetchStoryList({ pageNo: pageQueryParam, projectId: projectListId });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setCurrentModalId(null);
  };

  const rows = storiesList.map((element) => (
    <tr key={element._id}>
      <td>{element?.key}</td>
      <td>{dateformat(element.updatedAt, "yyyy-mm-dd")}</td>
      <td>
        <Text size="sm" overflow="ellipsis">
          {truncateText(element.title)}
        </Text>
      </td>
      <td>
        <Flex gap={10} direction={{ base: "column", sm: "row" }}>
          <Tooltip label="View Story" position="top" withArrow>
            <ActionIcon
              variant="default"
              onClick={() => {
                setIsView(true);
                editStory(element._id);
              }}
            >
              <IconEye size="1rem" color="blue" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Story" position="top" withArrow>
            <ActionIcon
              variant="default"
              onClick={() => {
                setIsView(false);
                editStory(element._id);
              }}
            >
              <IconPencil size="1rem" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Story" position="top" withArrow>
            <ActionIcon
              variant="default"
              onClick={() => {
                setCurrentModalId(element._id);
                setModalType("STORY_DELETE");
                handleOpenModal();
              }}
            >
              <IconTrash size="1rem" color="red" />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </td>
    </tr>
  ));

  return (
    <Container size="lg">
      <Box>
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          gap="sm"
          mt={20}
          mb={20}
        >
          <h2>Stories of your project</h2>
          {projectListLoader ? (
            <Skeleton height={30} w={"50%"} />
          ) : (
            <MediaQuery
              smallerThan="sm"
              styles={{ width: "100%", marginBottom: "20px" }}
            >
              <Select
                label="Select Project"
                value={projectListId}
                onChange={handleProjectChange}
                w={"30%"}
                placeholder="Select Project"
                searchable
                nothingFound="Opps, No project found"
                data={projectList}
                disabled={loading}
              />
            </MediaQuery>
          )}
        </Flex>
      </Box>
      {storiesList.length === 0 && !loading ? (
        <Box
          sx={(theme) => ({
            display: "block",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            color:
              theme.colorScheme === "dark"
                ? theme.colors.blue[4]
                : theme.colors.blue[7],
            textAlign: "center",
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
        >
          {projectList.length > 0
            ? "Looks like you have no stories for this project. Please process data for this project."
            : "Looks like you have no project. Please add some project."}
        </Box>
      ) : (
        <>
          {loading ? (
            <TableLoader />
          ) : (
            <Table
              striped
              highlightOnHover
              withBorder
              withColumnBorders
              verticalSpacing="xs"
              fontSize="md"
            >
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Key</th>
                  <th style={{ width: "15%" }}>Modified At</th>
                  <th>Summary</th>
                  <th style={{ width: "15%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          )}
        </>
      )}
      {!loading && storiesList.length !== 0 && (
        <Box>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="center"
            gap="sm"
            align="center"
            m={30}
          >
            <Pagination
              value={Number(pageQueryParam)}
              onChange={handlePageChange}
              total={totalPages}
            />
          </Flex>
        </Box>
      )}
      {isEditModalOpen && (
        <StoryModal
          id={id}
          isModalOpen={isEditModalOpen}
          onModalClose={closeEditModal}
          isViewModal={isView}
        />
      )}
      {showModal && (
        <CustomModal
          isOpen={showModal}
          onClose={handleCloseModal}
          id={currentModalId}
          type={modalType}
          onSucess={onSucess}
        />
      )}
    </Container>
  );
};

export default Stories;

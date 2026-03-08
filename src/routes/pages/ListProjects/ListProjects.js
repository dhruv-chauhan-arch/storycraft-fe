import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  Container,
  Grid,
  Col,
  Button,
  ActionIcon,
  Tooltip,
  Pagination,
  Box,
  Flex,
  Input,
  Skeleton,
  Select,
  MediaQuery,
} from "@mantine/core";
import {
  IconTrash,
  IconEye,
  IconSearch,
  IconMoodCheck,
  IconBallpenFilled,
  IconDatabasePlus,
  IconFileAlert,
} from "@tabler/icons-react";
import styles from "./ListProjects.module.scss";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { get } from "lodash";
import { API_PROJECT, HOME, STORIES } from "../constants";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../../constants";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDebouncedState } from "@mantine/hooks";
import { IconLoader } from "@tabler/icons-react";
import CustomModal from "../../../components/CustomModal/CustomModal";
import { truncateText } from "../Stories/helper";
import { PROJECT_STATUS, PROJECT_STEP } from "./constants";

const CardSkeleton = () =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
    <Col span={12} md={6} lg={4} key={item}>
      <Card shadow="lg" withBorder radius="lg" className={styles.cardContainer}>
        <Flex
          direction="column"
          justify="center"
          gap="sm"
          align="center"
          h={150}
        >
          <Skeleton height={15} mt={6} radius="xl" />
          <Skeleton height={15} mt={6} radius="xl" />
          <Skeleton height={15} mt={6} radius="xl" />
          <Skeleton height={15} mt={6} radius="xl" />
        </Flex>
      </Card>
    </Col>
  ));

const ListProjects = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
    page: 1,
    status: "",
  });
  const searchQueryParams = searchParams.get("search");
  const pageQueryParam = searchParams.get("page");
  const statusQueryParam = searchParams.get("status");

  const [totalPages, setTotalPages] = useState(1);

  const [projectList, setProjectList] = useState([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useDebouncedState(
    searchQueryParams,
    800
  );
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentModalId, setCurrentModalId] = useState(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
    setCurrentModalId(null);
  };

  useEffect(() => {
    fetchProjectList({
      pageNo: pageQueryParam,
      search: searchQueryParams,
      status: statusQueryParam,
    });
    setIsTyping(false);
  }, [debouncedSearchValue]);

  const fetchProjectList = async ({ pageNo, search, status }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_PROJECT}?page=${pageNo}&search=${encodeURIComponent(
          search
        )}&status=${status}`
      );
      setProjectList(get(response, "data.data.docs"));
      setTotalPages(get(response, "data.data.totalPages"));
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
    setSearchParams(
      (prev) => {
        prev.set("page", pageNo);
        return prev;
      },
      { replace: true }
    );
    fetchProjectList({
      pageNo,
      search: searchQueryParams,
      status: statusQueryParam,
    });
  };

  const onSucess = () => {
    fetchProjectList({
      pageNo: pageQueryParam,
      search: searchQueryParams,
      status: statusQueryParam,
    });
  };

  const handleSearch = (searchValue) => {
    setSearchParams(
      (prev) => {
        prev.set("search", searchValue);
        prev.set("page", 1);
        return prev;
      },
      { replace: true }
    );
    setDebouncedSearchValue(searchValue);
  };

  const getProjectButton = (project) => {
    switch (project.status) {
      case PROJECT_STEP.UPLOADED:
        return (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<IconDatabasePlus />}
            onClick={() => {
              setCurrentModalId(project._id);
              setModalType("BUILD");
              handleOpenModal();
            }}
            color="orange"
          >
            Process Data
          </Button>
        );
      case PROJECT_STEP.PROCESSING:
        return (
          <Button variant="outline" size="sm" fullWidth loading>
            Processing data...
          </Button>
        );
      case PROJECT_STEP.COMPLETED:
        return (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<IconMoodCheck />}
            onClick={() => {
              navigate(`${STORIES}?id=${project._id}`);
            }}
            color="green"
          >
            View Stories
          </Button>
        );
      case PROJECT_STEP.FAILED:
        return (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            color="red"
            leftIcon={<IconFileAlert />}
          >
            Failed
          </Button>
        );
    }
  };

  return (
    <Container size="lg" className={styles.listProjectsContainer}>
      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="flex-end"
        gap="sm"
        align="center"
        mt={10}
        mb={30}
      >
        <MediaQuery
          smallerThan="sm"
          styles={{ width: "100%", marginBottom: "10px" }}
        >
          <Select
            value={statusQueryParam}
            onChange={(value) => {
              setSearchParams(
                (prev) => {
                  prev.set("status", value || "");
                  prev.set("page", 1);
                  return prev;
                },
                { replace: true }
              );
              fetchProjectList({
                pageNo: 1,
                search: searchQueryParams,
                status: value || "",
              });
            }}
            w={"25%"}
            radius="xl"
            placeholder="Select Project Status"
            nothingFound="Opps, No project with this status"
            data={PROJECT_STATUS}
            disabled={loading}
          />
        </MediaQuery>
        <MediaQuery smallerThan="sm" styles={{ width: "100%" }}>
          <Input
            disabled={loading}
            icon={<IconSearch size={18} />}
            placeholder="Search Project Name..."
            value={searchQueryParams}
            onChange={(event) => {
              setIsTyping(true);
              handleSearch(event.target.value);
            }}
            rightSection={isTyping && <IconLoader />}
            radius="xl"
            w={"32%"}
          />
        </MediaQuery>
      </Flex>
      <Grid gutter="lg">
        {loading ? (
          <CardSkeleton />
        ) : (
          projectList.length > 0 && (
            <>
              {projectList.map((project) => (
                <Col span={12} md={6} lg={4} key={project._id}>
                  <Card
                    shadow="lg"
                    withBorder
                    radius="lg"
                    className={styles.cardContainer}
                  >
                    <>
                      <div>
                        <div
                          className={styles.flex}
                          style={{
                            border: "1px solid",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                          }}
                        >
                          <Text size="xl" weight={700}>
                            {truncateText(project.projectName, 20)}
                          </Text>
                          <div className={styles.flex}>
                            <Tooltip
                              label="View Project"
                              position="top"
                              withArrow
                            >
                              <Link
                                to={`${HOME}?id=${project._id}&isView=true`}
                              >
                                <ActionIcon variant="default">
                                  <IconEye size="1rem" color="blue" />
                                </ActionIcon>
                              </Link>
                            </Tooltip>
                            <span
                              style={{
                                pointerEvents:
                                  project.status === PROJECT_STEP.PROCESSING || project.status === PROJECT_STEP.COMPLETED
                                    ? "none"
                                    : "",
                              }}
                            >
                              <Tooltip label="Edit Project" withArrow>
                                <Link to={`${HOME}?id=${project._id}`}>
                                  <ActionIcon
                                    variant="default"
                                    disabled={
                                      project.status === PROJECT_STEP.PROCESSING
                                    }
                                  >
                                    <IconBallpenFilled size="1rem" />
                                  </ActionIcon>
                                </Link>
                              </Tooltip>
                            </span>
                            <span
                              style={{
                                pointerEvents:
                                  project.status === PROJECT_STEP.PROCESSING || project.status === PROJECT_STEP.COMPLETED
                                    ? "none"
                                    : "",
                              }}
                            >
                              <Tooltip label="Delete Project" withArrow>
                                <ActionIcon
                                  disabled={
                                    project.status === PROJECT_STEP.PROCESSING
                                  }
                                  variant="default"
                                  onClick={() => {
                                    setCurrentModalId(project._id);
                                    setModalType("DELETE");
                                    handleOpenModal();
                                  }}
                                >
                                  <IconTrash size="1rem" color="red" />
                                </ActionIcon>
                              </Tooltip>
                            </span>
                          </div>
                        </div>
                        <Text size="sm" className={styles.textContainer}>
                          {project.description}
                        </Text>
                      </div>
                      {getProjectButton(project)}
                    </>
                  </Card>
                </Col>
              ))}
            </>
          )
        )}
      </Grid>
      {!loading && projectList.length === 0 && (
        <Box
          mt={20}
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
          No data
        </Box>
      )}
      {!loading && projectList.length !== 0 && (
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

export default ListProjects;

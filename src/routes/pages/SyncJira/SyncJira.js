import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Select,
  Skeleton,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import styles from "./SyncJira.module.scss";
import { useForm } from "@mantine/form";
import { get } from "lodash";
import axios from "axios";
import { API_JIRA, API_PROJECT, JIRA_LOGIN_LINK } from "../constants";
import { notifications } from "@mantine/notifications";
import { NOTIFICATION_ICON, NOTIFICATION_MESSAGE } from "../../../constants";
import successIcon from "../../../assets/SVGs/success.svg";

const getTilteContainer = () => (
  <Container>
    <Text align="center" className={styles.titleDiv}>
      <h1 className={styles.title}>Configure Jira Account</h1>
      <p>
        Provide your Jira account credentials to sync with the application. This
        will allow you to access and manage your Jira projects directly from
        within the application.
      </p>
      <hr className={styles.hrLine} />
      <p>
        If you don&apos;t have a Jira account, you can{" "}
        <a href={JIRA_LOGIN_LINK} target="_blank" rel="noreferrer">
          create one for free
        </a>
        .
      </p>
    </Text>
  </Container>
);

const SyncJiraLoader = () => (
  <>
    {getTilteContainer()}
    <Stepper active={0} breakpoint="sm" allowNextStepsSelect={false}>
      <Stepper.Step
        label="Configure Jira"
        description="Enter Credentials"
        loading
      >
        <Skeleton height={30} mt={10} />
        <Skeleton height={30} mt={10} />
        <Skeleton height={30} mt={10} />
      </Stepper.Step>
      <Stepper.Step
        label="Select Project"
        description="Select your project to export"
        loading
      ></Stepper.Step>
      <Stepper.Step
        label="Summary"
        description="View Summary"
        loading
      ></Stepper.Step>
    </Stepper>
  </>
);

const SyncJira = () => {
  const form = useForm({
    initialValues: {
      email: "",
      leadAccountId: "",
      apiToken: "",
    },
    validate: {
      email: (value) => {
        if (value.length === 0) {
          return "Please enter your jira email id";
        }
        if (
          !/^[A-Za-z0-9_+#*&?$!.-]+@[A-Za-z0-9_+#*&?$!.-]+\.[A-Za-z]{2,}$/.test(
            value
          )
        ) {
          return "Please enter a valid jira email id";
        }
        return null;
      },
      apiToken: (value) =>
        value.length === 0 ? "Please enter API token" : null,
      leadAccountId: (value) =>
        value.length === 0 ? "Please enter lead account ID" : null,
    },
  });
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState(null);
  const [projectListLoader, setProjectListLoader] = useState(false);
  const [projectListId, setProjectListId] = useState(false);
  const [projectName, setProjectName] = useState("");
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
      setProjectListId(currList[0]?.value);
      setProjectName(currList[0]?.label);
      setProjectList(currList);
      setProjectListLoader(false);
    } catch (error) {
      setProjectListLoader(false);
      notifications.show({
        title: NOTIFICATION_MESSAGE.ERROR,
        message: get(error, "response.data.message"),
        icon: NOTIFICATION_ICON.ERROR,
      });
    }
  };

  const submitSyncJira = async () => {
    setProjectListLoader(true);
    try {
      const response = await axios.post(`${API_JIRA}`, {
        email: formData.email,
        apiToken: formData.apiToken,
        leadAccountId: formData.leadAccountId,
        id: projectListId,
      });
      notifications.show({
        title: NOTIFICATION_MESSAGE.PROCESS_SUCCESS,
        message: get(response, "response.data.message"),
        icon: NOTIFICATION_ICON.SUCCESS,
      });
      setProjectListLoader(false);
      nextStep();
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
    projectList.forEach((project) => {
      if (project.value === currProjectId) {
        setProjectName(project.label);
      }
    });
  };

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleFormSubmit = (values) => {
    setFormData(values);
    nextStep();
  };

  const handleRestartSync = () => {
    setFormData(null);
    setActive(0);
  };

  return (
    <Container size="lg" className="fullHeight">
      <div className={styles.syncJiraMainContainer}>
        {projectListLoader ? (
          <SyncJiraLoader />
        ) : (
          <>
            {getTilteContainer()}
            <Stepper
              active={active}
              onStepClick={setActive}
              breakpoint="sm"
              allowNextStepsSelect={false}
            >
              <Stepper.Step
                label="Configure Jira"
                description="Enter Credentials"
                loading={projectListLoader}
                disabled={active === 3}
              >
                <Container size="xs">
                  <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <TextInput
                      label="Jira Email ID"
                      placeholder="Enter Jira Email ID..."
                      {...form.getInputProps("email")}
                      withAsterisk
                    />
                    <TextInput
                      label="Project Lead ID"
                      placeholder="Enter Account Lead ID..."
                      {...form.getInputProps("leadAccountId")}
                      withAsterisk
                    />
                    <TextInput
                      label="API token"
                      placeholder="Enter API token..."
                      {...form.getInputProps("apiToken")}
                      withAsterisk
                    />
                    <Group position="center" mt="xl">
                      <Button type="submit">Next step</Button>
                    </Group>
                  </form>
                </Container>
              </Stepper.Step>
              <Stepper.Step
                label="Select Project"
                description="Select your project to export"
                loading={projectListLoader}
                disabled={active === 3}
              >
                <Container size="xs">
                  <Select
                    label="Select Project"
                    value={projectListId}
                    onChange={handleProjectChange}
                    placeholder="Select Project"
                    searchable
                    nothingFound="Opps, No project found"
                    data={projectList}
                    disabled={false}
                  />
                  <Group position="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>
                      Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      type="submit"
                      disabled={!projectListId}
                    >
                      Next step
                    </Button>
                  </Group>
                </Container>
              </Stepper.Step>
              <Stepper.Step
                label="Summary"
                description="View Summary"
                loading={projectListLoader}
                disabled={active === 3}
              >
                <Container size="xs">
                  <Card shadow="xs" padding="xl" radius="md">
                    <Text align="center" weight={700} size="lg" mb={20}>
                      Summary
                    </Text>
                    <Container mb={20}>
                      <Text weight={500} size="md" mb={10}>
                        <span className={styles.formatStyle}>
                          Jira Email ID :{" "}
                        </span>
                        <span>{form.values.email}</span>
                      </Text>

                      <Text weight={500} size="md" mb={10}>
                        <span className={styles.formatStyle}>
                          Lead Account ID :{" "}
                        </span>
                        <span>{form.values.leadAccountId}</span>
                      </Text>

                      <Text weight={500} size="md" mb={10}>
                        <div>
                          <span className={styles.formatStyle}>
                            API token :{" "}
                          </span>
                          <span className={`g-word-wrap`}>
                            {form.values.apiToken}
                          </span>
                        </div>
                      </Text>

                      <Text weight={500} size="md" mb={10}>
                        <span className={styles.formatStyle}>Project : </span>
                        <span>{projectName}</span>
                      </Text>
                    </Container>

                    <Group position="center" mt={"2rem"}>
                      <Button variant="default" onClick={prevStep}>
                        Back
                      </Button>
                      <Button
                        color="blue"
                        onClick={submitSyncJira}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Group>
                  </Card>
                </Container>
              </Stepper.Step>
              <Stepper.Completed>
                <Flex align="center" direction="column" mt="20px">
                  <Image
                    src={successIcon}
                    alt="Success Icon"
                    style={{ width: "80px" }}
                    mb={"1rem"}
                  />
                  <Text weight={700} size="xl" mb={"1rem"}>
                    Sync Successful!
                  </Text>
                  <Text size="sm" color="#666" mb={"1rem"}>
                    Your Jira and project have been successfully synchronized.
                  </Text>
                  <Button color="teal" onClick={handleRestartSync}>
                    Export next project
                  </Button>
                </Flex>
              </Stepper.Completed>
            </Stepper>
          </>
        )}
      </div>
    </Container>
  );
};

export default SyncJira;

import React from "react";
import { Container, Button, Paper, Text } from "@mantine/core";

const UploadProject = () => {
  return (
    <Container size="lg">
      <Paper padding="lg">
        <Text size="xl" weight={700}>
          test
        </Text>
        <Text size="lg" style={{ marginTop: "10px" }}>
          System Actor:
        </Text>
        <Text size="lg">Action Map: </Text>
        <Text size="lg">Mind Map: </Text>
        <Text size="lg">Info Architecture: </Text>
        <Text size="lg">User Story: </Text>
        <Text size="lg">Description: </Text>
        <Button
          variant="outline"
          size="sm"
          style={{ marginTop: "20px" }}
          fullWidth
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Paper>
    </Container>
  );
};

export default UploadProject;

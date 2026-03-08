import React from "react";
import { Skeleton, Table, Text } from "@mantine/core";

export const TableLoader = () => (
  <Table
    striped
    highlightOnHover
    withBorder
    withColumnBorders
    verticalSpacing="md"
    fontSize="md"
    style={{ borderCollapse: "collapse", width: "100%" }}
  >
    <thead>
      <tr>
        <th style={{ minWidth: "100px" }}>
          <Skeleton height={20} />
        </th>
        <th style={{ minWidth: "120px" }}>
          <Skeleton height={20} />
        </th>
        <th>
          <Skeleton height={20} />
        </th>
        <th style={{ minWidth: "150px" }}>
          <Skeleton height={20} />
        </th>
      </tr>
    </thead>
    <tbody>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <tr key={item}>
          <td style={{ minWidth: "100px" }}>
            <Skeleton height={15} radius="xl" />
          </td>
          <td style={{ minWidth: "120px" }}>
            <Skeleton height={15} radius="xl" />
          </td>
          <td>
            <Text>
              <Skeleton w={400} height={15} radius="xl" />
            </Text>
          </td>
          <td>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <>
                <Skeleton w={30} height={15} radius="xl" />
                <Skeleton w={30} height={15} radius="xl" />
                <Skeleton w={30} height={15} radius="xl" />
              </>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export const truncateText = (text, maxLength = 200) => {
  if (text?.length <= maxLength) return text;
  return text?.slice(0, maxLength - 3) + "...";
};

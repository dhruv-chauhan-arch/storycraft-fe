import React, { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  MantineProvider,
  ColorSchemeProvider,
  NavLink,
  useMantineColorScheme,
  Group,
  Switch,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  IconSun,
  IconMoonStars,
  IconList,
  IconApiApp,
  IconBrandTabler,
  IconTrendingUp,
} from "@tabler/icons-react";
import PropTypes from "prop-types";
import "./AppWrapper.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HOME,
  LIST_PROJECTS,
  STORIES,
  SYNC_JIRA,
} from "../../routes/pages/constants";
import storyCraftIcon from "../../assets/SVGs/storyCraftIcon.svg";
import storyCraftPreLogo from "../../assets/SVGs/storyCraftPreLogo.svg";

export function AppWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [colorScheme, setColorScheme] = useState("dark");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications position="top-right" zIndex={2077} />
        <AppShell
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            <Navbar
              p="md"
              hiddenBreakpoint="sm"
              hidden={!opened}
              width={{ sm: 200, lg: 300 }}
            >
              <NavLink
                key={HOME}
                active={active === HOME}
                label={"Project"}
                description={"Project details"}
                icon={<IconBrandTabler stroke={1.5} />}
                onClick={() => {
                  navigate(HOME);
                  setOpened(false);
                }}
              />
              <NavLink
                key={LIST_PROJECTS}
                active={active === LIST_PROJECTS}
                label={"Your Projects"}
                description={"List of all projects"}
                icon={<IconList stroke={1.5} />}
                onClick={() => {
                  navigate(LIST_PROJECTS);
                  setOpened(false);
                }}
              />
              <NavLink
                key={STORIES}
                active={active === STORIES}
                label={"Your Stories"}
                description={"List of all stories"}
                icon={<IconApiApp stroke={1.5} />}
                onClick={() => {
                  navigate(STORIES);
                  setOpened(false);
                }}
              />
              <NavLink
                key={SYNC_JIRA}
                active={active === SYNC_JIRA}
                label={"Sync Jira"}
                description={"Export stories to Jira"}
                icon={<IconTrendingUp stroke={1.5} />}
                onClick={() => {
                  navigate(SYNC_JIRA);
                  setOpened(false);
                }}
              />
            </Navbar>
          }
          footer={
            <Footer height={60} p="md" className="footer">
              <img
                style={{ width: "45px" }}
                src={storyCraftIcon}
                alt="Story Craft Icon"
              />
              storyCraft © {new Date().getFullYear()}
            </Footer>
          }
          header={
            <Header height={{ base: 50, md: 70 }} p="md">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "space-between",
                  flexDirection: "row-reverse",
                }}
              >
                <SwitchToggle />
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                  />
                </MediaQuery>

                <Text size={"xl"} className="img-text">
                  <img
                    className="storyCraft-PreLogo"
                    src={storyCraftPreLogo}
                    alt="Story Logo"
                  />
                </Text>
              </div>
            </Header>
          }
        >
          {children}
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

function SwitchToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Group position="center" my={30}>
      <Switch
        checked={colorScheme === "dark"}
        onChange={() => toggleColorScheme()}
        size="lg"
        onLabel={<IconSun color={theme.white} size="1.25rem" stroke={1.5} />}
        offLabel={
          <IconMoonStars
            color={theme.colors.gray[6]}
            size="1.25rem"
            stroke={1.5}
          />
        }
      />
    </Group>
  );
}

AppWrapper.propTypes = {
  children: PropTypes.any,
};

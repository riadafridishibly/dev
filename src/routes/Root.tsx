import {
  AppShell,
  Text,
  Header,
  MediaQuery,
  Burger,
  Group,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSignature } from "@tabler/icons";
import React from "react";
import { Outlet } from "react-router-dom";
import { NavbarSimple } from "../components/Nav";

function Root() {
  const matches = useMediaQuery(`(max-width: 900px)`);
  const [opened, setOpened] = React.useState(false);
  return (
    <AppShell
      padding={matches ? 0 : "lg"}
      navbar={<NavbarSimple opened={opened} setOpened={setOpened} />}
      header={
        <Header height={{ base: 50, md: 50 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                // color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group>
              <IconSignature stroke={1.5} />
              <Text>Tiny Blog</Text>
            </Group>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
      {/* <Container fluid={true}></Container> */}
    </AppShell>
  );
}

export default Root;

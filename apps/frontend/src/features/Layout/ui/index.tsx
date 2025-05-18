import type { PropsWithChildren } from "react";
import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "./Navbar";

const Layout = (props: PropsWithChildren) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex style={{ height: "100%" }}>
          <Burger hiddenFrom="sm" onClick={toggle} opened={opened} size="sm" />
          <div
            style={{
              width: "var(--app-shell-navbar-width)",
              height: "100%",
            }}
          >
            <div>Logo</div>
          </div>
          <Flex
            id="header-portal"
            style={{
              padding: "12px",
              flex: 1,
              alignItems: "center",
            }}
          />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { useState } from "react";
import { NavLink, rem } from "@mantine/core";
import {
  IconBug,
  //IconChevronDown,
  IconHome,
  IconLogin,
  IconLogout,
  IconPasswordUser,
  IconUser,
  IconUserShield,
} from "@tabler/icons-react";
import { useUser } from "../contexts/UserProvider.js";

export const quizzerMenuItems = (padding = 0) => {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  const location = useLocation();

  const startPage = (
    <NavLink
      label={t("start-page")}
      leftSection={<IconHome style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/"}
      component={Link}
      to={"/"}
      p={padding}
    />
  );

  const profile = (
    <>
      {user ? (
        <NavLink
          label={t("profile")}
          leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
          active={location.pathname === "/user/" + user.id}
          component={Link}
          to={"/user/" + user.id}
          p={padding}
        />
      ) : null}
    </>
  );

  const administer = (
    <NavLink
      label={t("administer")}
      leftSection={<IconUserShield style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/admin"}
      component={Link}
      to={"/admin"}
      p={padding}
    />
  );

  const reportIssue = (
    <NavLink
      label={t("report-a-problem")}
      leftSection={<IconBug style={{ width: rem(14), height: rem(14) }} />}
      component="a"
      href="https://github.com/kernie66/react-quizzer/issues"
      target="_blank"
      rel="noreferrer"
      className="text-decoration-none"
      p={padding}
    />
  );

  const changePassword = (
    <NavLink
      label={t("change-password")}
      leftSection={<IconPasswordUser style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/password"}
      component={Link}
      to={"/password"}
      p={padding}
    />
  );

  const loginUser = (
    <NavLink
      label={t("login")}
      leftSection={<IconLogin style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/password"}
      component={Link}
      to={"/password"}
      p={padding}
    />
  );

  const logoutUser = (
    <NavLink
      label={t("logout")}
      leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
      onClick={logout}
      p={padding}
    />
  );

  return {
    startPage,
    profile,
    administer,
    reportIssue,
    changePassword,
    loginUser,
    logoutUser,
  };
};

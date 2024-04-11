import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { useState } from "react";
import { NavLink, rem } from "@mantine/core";
import {
  TbBug,
  //TbChevronDown,
  TbHome,
  TbLogin,
  TbLogout,
  TbPasswordUser,
  TbUser,
  TbUserShield,
} from "react-icons/tb";
import { useUser } from "../contexts/UserProvider.jsx";

export function quizzerMenuItems(padding, toggle) {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  const location = useLocation();

  const startPage = (
    <NavLink
      label={t("start-page")}
      leftSection={<TbHome style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/"}
      component={Link}
      to={"/"}
      onClick={toggle}
      p={padding}
    />
  );

  const profile = (
    <>
      {user ? (
        <NavLink
          label={t("profile")}
          leftSection={<TbUser style={{ width: rem(14), height: rem(14) }} />}
          active={location.pathname === "/user/" + user.id}
          component={Link}
          to={"/user/" + user.id}
          onClick={toggle}
          p={padding}
        />
      ) : null}
    </>
  );

  const administer = (
    <NavLink
      label={t("administer")}
      leftSection={<TbUserShield style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/admin"}
      component={Link}
      to={"/admin"}
      onClick={toggle}
      p={padding}
    />
  );

  const reportIssue = (
    <NavLink
      label={t("report-a-problem")}
      leftSection={<TbBug style={{ width: rem(14), height: rem(14) }} />}
      component="a"
      href="https://github.com/kernie66/react-quizzer/issues"
      target="_blank"
      rel="noreferrer"
      className="text-decoration-none"
      onClick={toggle}
      p={padding}
    />
  );

  const changePassword = (
    <NavLink
      label={t("change-password")}
      leftSection={<TbPasswordUser style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/password"}
      component={Link}
      to={"/password"}
      onClick={toggle}
      p={padding}
    />
  );

  const loginUser = (
    <NavLink
      label={t("login")}
      leftSection={<TbLogin style={{ width: rem(14), height: rem(14) }} />}
      active={location.pathname === "/login"}
      component={Link}
      to={"/login"}
      onClick={toggle}
      p={padding}
    />
  );

  const logoutUser = (
    <NavLink
      label={t("logout")}
      leftSection={<TbLogout style={{ width: rem(14), height: rem(14) }} />}
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
}

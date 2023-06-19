import { Container, Nav, Navbar, NavItem, NavLink } from "reactstrap";
import { NavLink as NLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  return (
    <Navbar sticky="top" color="secondary" light className="Sidebar">
      <Container fluid className="p-0">
        <Nav vertical pills className="Navigation">
          <NavItem>
            <NavLink tag={NLink} to="/">
              {t("Play quiz")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={NLink} to="/explore">
              {t("Create quiz")}
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

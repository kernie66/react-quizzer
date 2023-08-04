import { Container, Nav, Navbar, NavItem, NavLink } from "reactstrap";
import { NavLink as NLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faPenToSquare } from "@fortawesome/free-regular-svg-icons";

export default function Sidebar() {
  const { t } = useTranslation();
  return (
    <Navbar sticky="top" color="info" light className="Sidebar">
      <Container fluid className="p-0">
        <Nav vertical pills className="Navigation">
          <NavItem>
            <NavLink tag={NLink} to="/">
              <FontAwesomeIcon icon={faCirclePlay} beat size="xl" className="pe-1" />
              {t("Play quiz")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={NLink} to="/explore">
              <FontAwesomeIcon icon={faPenToSquare} size="xl" />
              {t("Create quiz")}
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
}

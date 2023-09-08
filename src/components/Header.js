import { Col, Navbar, NavbarBrand, Row } from "reactstrap";
import { Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import OnlineStatus from "./OnlineStatus.js";
import UserMenu from "./UserMenu.js";
import LanguageSwitcher from "./LanguageSwitcher.js";

export default function Header() {
  const { t } = useTranslation();

  return (
    <Navbar color="light" light fixed="top" className="Header border-bottom py-1">
      <Container>
        <Row className="d-flex">
          <Col className="me-auto">
            <NavbarBrand className="pt-0">{t("app-name")}</NavbarBrand>
          </Col>
          <Col className="d-none d-sm-block text-end">
            <OnlineStatus />
          </Col>
          <Col xs="3" sm="2" md="1" className="d-inline-flex mx-1 px-0 gx-0">
            <UserMenu />
            <LanguageSwitcher />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

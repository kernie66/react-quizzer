import { Col, Container, Row } from "reactstrap";
import FlashMessage from "./FlashMessage";
import Sidebar from "./Sidebar";

export default function Body({ sidebar, children }) {
  return (
    <Container className="p-0">
      <Row className="gx-2 ps-0 pe-2 Body">
        {sidebar && (
          <Col xs="auto">
            <Sidebar className="LeftSidebar" />
          </Col>
        )}
        <Col className="px-0">
          <Container className="align-self-start Content px-0">
            <FlashMessage />
            {children}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

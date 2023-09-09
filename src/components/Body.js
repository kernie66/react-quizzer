import { Col, Container, Row } from "reactstrap";
import FlashMessage from "./FlashMessage";
import Sidebar from "./Sidebar";

export default function Body({ sidebar, children }) {
  return (
    <Container className="p-0">
      <Row className="m-0 px-2 Body">
        {sidebar && (
          <Col xs="auto" className="d-none d-md-block">
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

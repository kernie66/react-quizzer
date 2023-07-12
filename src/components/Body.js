import { Col, Container, Row } from "reactstrap";
import FlashMessage from "./FlashMessage";
import Sidebar from "./Sidebar";

export default function Body({ sidebar, children }) {
  return (
    <Container className="bg-dark p-0">
      <Row className="gx-2 Body">
        {sidebar && (
          <Col xs="auto">
            <Sidebar className="LeftSidebar" />
          </Col>
        )}
        <Col>
          <Container className="align-self-start Content">
            <FlashMessage />
            {children}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

//import { Col, Container, Row } from "reactstrap";
import { Container } from "@mantine/core";
import Sidebar from "./Sidebar";

export default function Body({ sidebar, children }) {
  return (
    <Container fluid bg="blue.0" className="Body" p={0}>
      {sidebar && <Sidebar className="LeftSidebar" />}
      <Container fluid mx={{ base: 0, md: 16 }} px={0} className="Content">
        {children}
      </Container>
    </Container>
  );
}

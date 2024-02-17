import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center">
        <Col xl="1">
          <div className="copyright text-center text-xl-left text-muted">
            © {"2023 - "} {new Date().getFullYear()}{" "}
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;

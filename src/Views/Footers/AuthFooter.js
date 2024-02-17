// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {"2023 - "} {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://it-innovat.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  IT INNOV
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    All right reserved
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Contacts
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;

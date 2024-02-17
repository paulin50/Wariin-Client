import React from "react";

// reactstrap components
import { Card, Container, Row } from "reactstrap";

// core components
// import Header from "components/Headers/Header.js";
import NavBar from "../../Views/Headers/NavBar";
import TableClient from "../../view/components/TableClient";

const Clients = () => {
  return (
    <>
      <NavBar/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0 mb-5">
              <TableClient/>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Clients;

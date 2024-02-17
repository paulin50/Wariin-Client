import React from "react";

// reactstrap components
import { Card, Container, Row } from "reactstrap";

// core components
import TableDepense from "../../view/components/TableDepense";
import NavBar from "../../Views/Headers/NavBar";

const Depenses = () => {
  return (
    <>
      <NavBar/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <TableDepense/>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Depenses;

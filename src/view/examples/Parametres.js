import React from "react";

// reactstrap components
import { Card, Container, Row } from "reactstrap";

// core components
import NavBar from "../../Views/Headers/NavBar";
import Tabs from "./Tabs";

const Parametres = () => {
  return (
    <>
      {/* <Header /> */}
      <NavBar/>
      {/* Page content */}
      <Container className="mt--9 mb-5 br-8" fluid >
        <Row>
          <div className="col">
            <Card className="shadow" >
              <Tabs/>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Parametres;

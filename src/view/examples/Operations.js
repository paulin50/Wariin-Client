import React, { useContext } from 'react';

// reactstrap components
import { Card, Container, Row } from 'reactstrap';

// core components
import NavBar from 'components/Headers/NavBar';
import TableOperationDepense from 'views/components/TableOperationDepense';
import TableJournal from 'views/components/TableJournal';
import { AuthContext } from '../../../../context/AuthContext';
import TableOperationVente from 'views/components/TableOperationVente';

const Operations = () => {
  const { currentUser, famille, depense, vente } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <TableOperationDepense title={'Dépenses'} data={depense} />
            </Card>
            <Card className="shadow border-0 mt-4">
              <TableOperationVente title={'Ventes'} data={vente} />
            </Card>
            <Card className="shadow border-0  mt-4 mb-4">
              <TableJournal title={'Journal'} />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Operations;

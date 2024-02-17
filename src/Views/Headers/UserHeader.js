// reactstrap components
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

const UserHeader = () => {
  const { currentUser, article } = useContext(AuthContext);
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          height: '300px',
          backgroundImage:
            'url(https://media.istockphoto.com/id/1163012737/fr/photo/beau-client-amical-au-sourire-de-caisse-%C3%A0-la-caissi%C3%A8re-masculine-tandis-quil-scanne-des.jpg?s=612x612&w=0&k=20&c=QbpVnAV7FpZCOcSazrJN1TUcRfcd1EbdxHDr-5Y8meY=)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-4" />
        {/* Header container */}
        {/* <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white"></h1>
              <p className="text-white mt-0 mb-2">
                This is your profile page. You can see the progress you've made
                with your work and manage your projects or assigned tasks
              </p>
            </Col>
          </Row>
        </Container> */}
      </div>
    </>
  );
};

export default UserHeader;

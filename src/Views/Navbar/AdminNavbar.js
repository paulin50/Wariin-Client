import { Link, useHistory } from 'react-router-dom';
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from 'reactstrap';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminNavbar = props => {
  const { currentUser, user } = useContext(AuthContext);

  const history = useHistory();

  const handleSignout = async () => {
    console.log('logouuuuuuuuuuuuuuut');
    await signOut(auth);
    history.push('/');
    history.go(1);
    // window.history.pushState(null, null, window.location.href);
    // window.onpopstate = function (event) {
    //   window.history.go(1);
    // }
    localStorage.setItem('user', null);
    // window.location.href = '/login';
    history.push('/login');
    console.log('logouuuuuuuuuuuuuuut finishhhhhh');
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <span
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            // to="/"
          >
            {props.brandText}
          </span>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Rechercher" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      height={'100%'}
                      width={'100%'}
                      src={
                        user?.photoURL
                          ? user?.photoURL
                          : require('../../assets/img/theme/user.jpg')
                      }
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user?.nom} {user?.prenoms}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Bienvenue!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Mon profil</span>
                </DropdownItem>
                <DropdownItem to="/admin/parametres" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Paramètres</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  // onClick={(e) => e.handleSignout}
                  onClick={() => handleSignout()}
                >
                  <i className="ni ni-user-run" />
                  <span>Déconnexion</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;

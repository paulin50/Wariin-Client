import Index from "./view/Index.js";
import Profile from './view/examples/Profile.js';
import Depenses from './view/examples/Depenses';
import Parametres from './view/examples/Parametres';
import Dashboard from './view/examples/Dashboard';
import Clients from './view/examples/Clients';
import Rapports from './view/examples/Rapports';
import TabUsers from './view/examples/Tabs/TabUsers';
import Login from './Components/Login.jsx';
import Register from './view/examples/Register.js';

var routes = [
  {
    path: "/index",
    name: "Accueil",
    icon: "ni ni-shop text-success",
    component: Index,
    layout: "/admin"
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'ni ni-tv-2 text-success',
    component: Dashboard,
    layout: '/admin',
  },
  {
    path: '/clients',
    name: 'Clients',
    icon: 'ni ni-circle-08 text-success',
    component: Clients,
    layout: '/admin',
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateurs',
    icon: 'ni ni-circle-08 text-success',
    component: TabUsers,
    layout: '/admin',
  },
  // {
  //   path: "/depenses",
  //   name: "Mouvements",
  //   icon: "ni ni-chart-bar-32 text-success",
  //   component: Depenses,
  //   layout: "/admin"
  // },
  // {
  //   path: "/operations",
  //   name: "Rapports",
  //   icon: "ni ni-chart-pie-35 text-success",
  //   component: Rapports,
  //   layout: "/admin"
  // },
  {
    path: '/parametres',
    name: 'Paramètres',
    icon: 'ni ni-settings-gear-65 text-success',
    component: Parametres,
    layout: '/admin',
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-zoom-split-in text-black",
  //   component: Icons,
  //   layout: "/admin"
  // },
  {
    path: '/user-profile',
    name: 'Mon profile',
    icon: 'ni ni-single-02 text-success',
    component: Profile,
    layout: '/admin',
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
];

export default routes;

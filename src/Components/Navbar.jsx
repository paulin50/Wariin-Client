import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './Navbar.css'
import {FaBars} from 'react-icons/fa';
import {ImCross} from 'react-icons/im';

import logo from '../assets/images/logo.png'

const Navbar = () => {

    const [Mobile, setMobile] = useState(false);

    return (
        <nav className="navbar">
            {/* <div className="container"> */}
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>

                <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
                    <li><NavLink to='/home'>Acceuil</NavLink></li>
                    <li><NavLink to='/abonnement'>Abonnement</NavLink></li>
                    <li><NavLink to='/login'>Se Connecter</NavLink></li>
                </ul>
                <button className="mobile-menu-icon" onClick={()=>setMobile(!Mobile)}>
                    {Mobile ? <ImCross /> : <FaBars/>}
                </button>
            {/* </div> */}
        </nav>
    )
}

export default Navbar;
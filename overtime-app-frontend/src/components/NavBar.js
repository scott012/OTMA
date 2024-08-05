import React, { useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css'; // Ensure this line is present to include the CSS

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const navHeight = navRef.current.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <ul>
        {user && (
          <>
            <li>
              <Link to="/dashboard">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <Link to="/employees">Employees</Link>
            </li>
            <li>
              <Link to="/overtime-offers">Overtime Offers</Link>
            </li>
            {user.role === 'admin' && (
              <>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/create-overtime-offer">Create Overtime Offer</Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
            <li>
              Current User: {user.first_name} {user.last_name}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaAirbnb } from 'react-icons/fa';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <NavLink to="/" className="home-link">
          <FaAirbnb className="logo" />
          <span className="logo-text">AtoZBnB</span>
        </NavLink>

        <div className="nav-right">
          {isLoaded && sessionUser && (
           <NavLink to="/spots/new" className="create-spot-link">
           + Create a new Spot
         </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
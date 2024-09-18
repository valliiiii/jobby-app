import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const NavBar = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <>
      <div className="navbar-sm-container">
        <Link to="/" className="link-ele">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="navbar-website-logo"
          />
        </Link>
        <ul className="nav-items-icons-container">
          <li>
            <Link to="/" className="link-ele">
              <AiFillHome className="nav-item-icon" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="link-ele">
              <BsBriefcaseFill className="nav-item-icon" />
            </Link>
          </li>
          <li onClick={onClickLogout}>
            <FiLogOut className="nav-item-icon" />
          </li>
        </ul>
      </div>
      <div className="navbar-lg-container">
        <Link to="/" className="link-ele">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="navbar-website-logo"
          />
        </Link>
        <ul className="nav-items-container">
          <li className="nav-items-li-container">
            <Link to="/" className="link-ele-para">
              Home
            </Link>
          </li>
          <li className="nav-items-li-container">
            <Link to="/jobs" className="link-ele-para">
              Jobs
            </Link>
          </li>
        </ul>

        <button onClick={onClickLogout} type="button">
          Logout
        </button>
      </div>
    </>
  )
}
export default withRouter(NavBar)

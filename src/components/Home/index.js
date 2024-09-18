import {Link} from 'react-router-dom'
import NavBar from '../NavBar'
import './index.css'

const Home = () => (
  <>
    <NavBar />
    <div className="home-main-container">
      <div className="home-content-container">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="link-ele">
          <button type="button">Find Jobs</button>
        </Link>
      </div>
    </div>
  </>
)

export default Home

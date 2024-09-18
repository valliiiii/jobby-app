import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = ({jobObj}) => {
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobObj
  return (
    <li className="job-card-container">
      <Link to={`/jobs/${id}`} className="link-ele">
        <div className="logo-title-rating-container">
          <img src={companyLogoUrl} alt="job details company logo" />
          <div className="title-rating-container">
            <h1>{title}</h1>
            <div className="star-icon-rating-container">
              <FaStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-job-type-package-container">
          <div className="location-job-type-container">
            <div className="location-icon-and-para-container">
              <IoLocationSharp className="icon" />
              <p>{location}</p>
            </div>
            <div className="location-icon-and-para-container">
              <BsBriefcaseFill className="icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p className="package-para">{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <h1 className="description-heading">Description</h1>
        <p className="description-para">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard

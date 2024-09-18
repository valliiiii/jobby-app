import {FaStar} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import './index.css'

const SimilarJobCard = ({obj}) => {
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = obj

  return (
    <li className="similar-jobs-li-container">
      <div className="logo-title-rating-container">
        <img src={companyLogoUrl} alt="similar job company logo" />
        <div className="title-rating-container">
          <h1>{title}</h1>
          <div className="star-icon-rating-container">
            <FaStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="description-para">{jobDescription}</p>
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
    </li>
  )
}
export default SimilarJobCard

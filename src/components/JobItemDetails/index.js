import {Component} from 'react'
// import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import NavBar from '../NavBar'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      similarJobs: [],
      jobDetails: {},
    })
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedJobDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills,
        title: data.job_details.title,
      }

      const formattedSimilarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        similarJobs: formattedSimilarJobs,
        jobDetails: formattedJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccess = () => {
    const {similarJobs, jobDetails} = this.state

    const {
      companyWebsiteUrl,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobDetails

    const {description, imageUrl} = {
      description: lifeAtCompany.description,
      imageUrl: lifeAtCompany.image_url,
    }

    const formattedSkills = skills.map(each => ({
      skillsImageUrl: each.image_url,
      name: each.name,
    }))

    return (
      <>
        <div className="job-card-container">
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
          <div className="description-and-visit-container">
            <h1 className="description-heading">Description</h1>
            <a
              className="link-ele visit-link-container"
              href={companyWebsiteUrl}
            >
              <p className="visit-para">Visit</p>
              <FiExternalLink className="visit-link-icon" />
            </a>
          </div>
          <p className="description-para">{jobDescription}</p>
          <h1 className="description-heading">Skills</h1>
          <ul className="skills-ul-container">
            {formattedSkills.map(each => (
              <li key={each.name} className="skills-li-container">
                <img src={each.skillsImageUrl} alt={each.name} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="description-heading">Life at Company</h1>
          <div className="description-para-img-container">
            <p className="description-para">{description}</p>
            <img
              className="description-img"
              src={imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>

        <ul className="similar-jobs-ul-container">
          {similarJobs.map(each => (
            <SimilarJobCard key={each.id} obj={each} />
          ))}
        </ul>
      </>
    )
  }

  renderFailure = () => (
    <div className="job-item-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={() => this.getJobItemDetails()}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="job-item-details-main-container">
          {this.renderJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails

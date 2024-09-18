import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FiSearch} from 'react-icons/fi'
import NavBar from '../NavBar'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileData: '',
    profileDataApiStatus: apiStatusConstants.initial,
    filteredJobsApiStatus: apiStatusConstants.initial,
    employmentType: [],
    minimumPackage: '',
    search: '',
    jobsData: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getFilteredJobs()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getFilteredJobs = async () => {
    const {search, employmentType, minimumPackage} = this.state
    const joinedEmpType = employmentType.join(',')
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${joinedEmpType}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      this.setState({filteredJobsApiStatus: apiStatusConstants.inProgress})
      const data = await response.json()
      const formattedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        id: each.id,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsData: formattedData,
        filteredJobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({filteredJobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileData = async () => {
    this.setState({profileDataApiStatus: apiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: formattedProfileData,
        profileDataApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileDataApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileDataSuccess = () => {
    const {profileData} = this.state
    return (
      <div className="profile-container">
        <img src={profileData.profileImageUrl} alt="profile" />
        <h1>{profileData.name}</h1>
        <p>{profileData.shortBio}</p>
      </div>
    )
  }

  onClickProfileDataRetry = () => this.getProfileData()

  renderProfileDataFailure = () => (
    <div className="profile-retry-btn">
      <button
        onClick={this.onClickProfileDataRetry}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderFilteredJobsSuccess = () => {
    const {jobsData} = this.state
    return jobsData.length > 0 ? (
      <ul className="jobs-data-ul-container">
        {jobsData.map(each => (
          <JobCard key={each.id} jobObj={each} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  onClickFilteredJobRetry = () => this.getFilteredJobs()

  renderFilteredJobsFailure = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.onClickFilteredJobRetry}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileData = () => {
    const {profileDataApiStatus} = this.state
    switch (profileDataApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProfileDataSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileDataFailure()
      default:
        return null
    }
  }

  renderFilteredJobs = () => {
    const {filteredJobsApiStatus} = this.state
    switch (filteredJobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderFilteredJobsSuccess()
      case apiStatusConstants.failure:
        return this.renderFilteredJobsFailure()
      default:
        return null
    }
  }

  onChangeSalaryRange = event => {
    this.setState({minimumPackage: event.target.value}, this.getFilteredJobs)
  }

  onChangeEmploymentType = event => {
    const {id, checked} = event.target
    if (checked) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, id],
        }),
        this.getFilteredJobs,
      )
    } else {
      const {employmentType} = this.state
      const filterEmpType = employmentType.filter(each => each !== id)
      this.setState({employmentType: filterEmpType}, this.getFilteredJobs)
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    const {searchInput} = this.state
    this.setState({search: searchInput}, this.getFilteredJobs)
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <NavBar />
        <div className="jobs-main-container">
          <div className="profile-employment-salary-range-main-container">
            <div className="jobs-search-container search-bar-sm">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                aria-label="search-icon"
                className="search-icon-container"
                onClick={this.onClickSearch}
              >
                <FiSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileData()}
            <hr className="hr-line" />
            <div className="employment-type-main-container">
              <h1>Type of Employment</h1>
              <ul className="employment-type-ul-container">
                {employmentTypesList.map(each => (
                  <li
                    key={each.employmentTypeId}
                    className="employment-type-li-container"
                  >
                    <input
                      id={each.employmentTypeId}
                      onChange={this.onChangeEmploymentType}
                      type="checkbox"
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="hr-line" />
            <div className="employment-type-main-container">
              <h1>Salary Range</h1>
              <ul className="employment-type-ul-container">
                {salaryRangesList.map(each => (
                  <li
                    key={each.salaryRangeId}
                    className="employment-type-li-container"
                  >
                    <input
                      id={each.salaryRangeId}
                      type="radio"
                      value={each.salaryRangeId}
                      name="salary"
                      onChange={this.onChangeSalaryRange}
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="filtered-jobs-and-search-container">
            <div className="jobs-search-container search-bar-lg">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                aria-label="search-icon"
                className="search-icon-container"
                onClick={this.onClickSearch}
              >
                <FiSearch className="search-icon" />
              </button>
            </div>
            {this.renderFilteredJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs

import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errMsg: '', showSubmitErr: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errMsg: errorMsg, showSubmitErr: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitErr, errMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-container">
        <div className="login-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form onSubmit={this.onSubmitForm} className="form-container">
            <label className="label-ele" htmlFor="userName">
              USERNAME
            </label>
            <input
              id="userName"
              onChange={this.onChangeUsername}
              type="text"
              placeholder="Username"
              value={username}
            />
            <label className="label-ele" htmlFor="pw">
              PASSWORD
            </label>
            <input
              id="pw"
              onChange={this.onChangePassword}
              type="password"
              placeholder="Password"
              value={password}
            />
            <div className="login-btn-container">
              <button type="submit">Login</button>
            </div>
            {showSubmitErr && <p className="err-msg-para">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default Login

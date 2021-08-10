import React from 'react'
import fetch from 'cross-fetch'
import { Check } from 'react-feather'

import { logEvent } from '../utils/analytics'

import Button from './button'

const ColumnControl = 'inline-block relative w-full'
const ColumnClass = 'grid grid-cols-2 gap-4'
const Control = 'inline-block relative w-full mb-4'
const Input = 'inline-block relative w-full p-4 bg-gray-900 text-white'
const Label = 'inline-block relative w-full mb-4'

class Sales extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      submitted: false,
      firstname: '',
      lastname: '',
      website: '',
      message: '',
      country: '',
      title: '',
      email: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  encode(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&')
  }

  handleChange(e) {
    this.setState({ ...this.state, [e.target.name]: e.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    const form = event.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: this.encode({
        'form-name': form.getAttribute('name'),
        ...this.state
      })
    })
      .then(() => {
        const object = {
          category: 'Contact',
          action: 'Submitted Contact Form'
        }
        logEvent(object)
        this.setState({
          submitted: true,
          firstname: '',
          lastname: '',
          website: '',
          message: '',
          country: '',
          title: '',
          email: ''
        })
      })
      .catch(error => window.alert(error))
  }

  render() {
    const { submitted } = this.state

    return (
      <div className="inline-block relative w-full">
        <div className="block relative center m-auto">
          {submitted ? (
            <div className="inline-block relative w-full bg-green-900 p-12">
              <Check
                className="w-12 h-12 bg-green-500 rounded-full mb-8 mx-auto p-2"
                color="white"
              />
              <strong className="inline-block relative w-full text-white mb-4">
                We'll be in touch!
              </strong>
              <p className="inline-block relative w-full text-sm text-gray-400">
                We'll get back to you within 1-2 business days.
              </p>
            </div>
          ) : (
            <form
              data-netlify-honeypot="bot-field"
              data-netlify="true"
              className="inline-block relative w-full"
              onSubmit={this.handleSubmit}
              method="post"
              name="contact"
            >
              {/* HIDDEN FOR NETLIFY */}
              <input type="hidden" name="form-name" value="contact" />
              {/* FORM */}
              <div className={ColumnClass}>
                <div className={ColumnControl}>
                  {/* FNAME */}
                  <div className={Control}>
                    <label className={Label} htmlFor="name">
                      First name (required)
                    </label>
                    <input
                      placeholder="Your first name"
                      className={Input}
                      onChange={this.handleChange}
                      type="text"
                      name="firstname"
                      value={this.state.firstname}
                      required
                    />
                  </div>
                </div>
                <div className={ColumnControl}>
                  {/* LNAME */}
                  <div className={Control}>
                    <label className={Label} htmlFor="name">
                      Last name (required)
                    </label>
                    <input
                      placeholder="Your last name"
                      className={Input}
                      onChange={this.handleChange}
                      type="text"
                      name="lastname"
                      value={this.state.lastname}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={ColumnClass}>
                <div className={ColumnControl}>
                  {/* EMAIL */}
                  <div className={Control}>
                    <label className={Label} htmlFor="name">
                      Work email (required)
                    </label>
                    <input
                      placeholder="Your work email"
                      className={Input}
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={this.state.email}
                      required
                    />
                  </div>
                </div>
                <div className={ColumnControl}>
                  {/* WEB */}
                  <div className={Control}>
                    <label className={Label} htmlFor="name">
                      Company website (required)
                    </label>
                    <input
                      placeholder="Your company website"
                      className={Input}
                      onChange={this.handleChange}
                      type="text"
                      name="website"
                      value={this.state.website}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Country */}
              <div className={Control}>
                <label className={Label} htmlFor="name">
                  Country (required)
                </label>
                <input
                  placeholder="Your country where you work"
                  className={Input}
                  onChange={this.handleChange}
                  type="text"
                  name="country"
                  value={this.state.country}
                  required
                />
              </div>
              {/* JOB TITLE */}
              <div className={Control}>
                <label className={Label} htmlFor="name">
                  Job title (required)
                </label>
                <input
                  placeholder="Your job title"
                  className={Input}
                  onChange={this.handleChange}
                  type="text"
                  name="title"
                  value={this.state.title}
                  required
                />
              </div>
              {/* MESSAGE */}
              <div className={Control}>
                <label className={Label} htmlFor="name">
                  Add a message (optional)
                </label>
                <textarea
                  placeholder="Add a message (optional)"
                  className={Input}
                  onChange={this.handleChange}
                  name="message"
                  value={this.state.message}
                />
              </div>
              <Button outlined full text="Submit form" type="submit" />
            </form>
          )}
        </div>
      </div>
    )
  }
}

export default Sales

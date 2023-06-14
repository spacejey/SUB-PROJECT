import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

//B Bootstrap
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'


function Register() {

  // ! Location variables
  const navigate = useNavigate()

  // ! State
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [ registerError, setRegisterError ] = useState('')

  // ! Executions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setRegisterError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/users/auth/register/', { ...formFields, password_confirmation: formFields.passwordConfirmation })
      console.log(data)
      navigate('/login')
    } catch (err) {
      console.log(err)
      setRegisterError(err.message)
    }
  }


  return (
    <div className="login-register-form">
      <Form onSubmit={handleSubmit}>
        <div className='login-wrapper'>
          <h1 className='login-title'>Register</h1>
        </div>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>User name</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter user name"
            value={formFields.username}
            onChange={handleChange}
            className='form-control'
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formFields.email}
            onChange={handleChange}
            className='form-control'
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formFields.password}
            onChange={handleChange}
            className='form-control'
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPasswordConfirmation">
          <Form.Label>Password Confirmation</Form.Label>
          <Form.Control
            type="password"
            name="passwordConfirmation"
            placeholder="Password Confirmation"
            value={formFields.passwordConfirmation}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className='submit'>Submit</Button>
        {registerError && (
          <p className="text-danger text-center register-login-error">{registerError}</p>
        )}
      </Form>

    </div>
  )
}

export default Register
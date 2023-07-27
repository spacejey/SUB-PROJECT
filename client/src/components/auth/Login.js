import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

//Bootstrap
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Login = () => {


  // variables
  const navigate = useNavigate()

  // State
  const [ formFields, setFormFields ] = useState({
    email: '',
    password: '',
  })
  const [ loginError, setLoginError ] = useState('')

  // Excutions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setLoginError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/users/auth/login/', formFields)
      localStorage.setItem('SUB-PROJECT', data.token)
      console.log('data.token=>', data.token)
      navigate('/calendar')
    } catch (err) {
      console.log(err)
      setLoginError('Invalid Email or Password. Try again.')
    }
  }

  return (
    <div className="login-register-form">
      <Form onSubmit={handleSubmit}>
        <div className='login-wrapper'>
          <h1 className='login-title'>Login</h1>
        </div>
        <Form.Group>
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
          />
          <p className="text-muted">You dont have account? <a href="/register">Register</a></p>
        </Form.Group>
        <Button variant="primary" type="submit" className='submit'>Submit</Button>
      </Form>
      { loginError && 
      <div> {loginError} </div>}

    </div>
  )



}
export default Login
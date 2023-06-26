import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'


// Custom Components
import Error from '../common/Error'
import { removeToken, isAuthenticated } from '../../helpers/auth'

const NavBar = () => {
  const location = useLocation()

  useEffect(() => {
  }, [location])


  const handleLogout = () => {
    removeToken()
  }

  useEffect(() =>{
    console.log(location)
  }, [location])


  return (
    <>
      <Navbar bg="light" className="mb-3">
        <Container fluid>
          <Navbar.Brand href="/">HAHAHA</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Offcanvas placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {isAuthenticated() ? (
                  <>
                    <Nav.Link as={Link} to="/calendar">
                      My Calendar
                    </Nav.Link>
                    <Nav.Item as={Link} to="/" onClick={handleLogout}>
                      Logout
                    </Nav.Item>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                      Register
                    </Nav.Link>
                  </>
                )}
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar

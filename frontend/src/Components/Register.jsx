import React from 'react'
import { Row, Container, Form, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <Container className='my-2'>
      <Row className='d-flex justify-content-center'>
        <Col md={8} lg={6}>
          <h3 className='h3 mb-2 d-flex justify-content-center'>Register</h3>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label className='d-none'>First Name</Form.Label>
              <Form.Control type='text' placeholder='First Name'></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className='d-none'>Last Name</Form.Label>
              <Form.Control type='text' placeholder='Last Name'></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className='d-none'>Phone number</Form.Label>
              <Form.Control type='text' placeholder='Phone number'></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className='d-none'>Email address</Form.Label>
              <Form.Control type="email" placeholder="Email address" />

            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className='d-none'>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
              <Form.Label className='d-none'>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" />
            </Form.Group>

            <Container className='d-flex justify-content-evenly align-items-center'>
              <Button className='d-flex' variant="outline-primary" type="submit">Register</Button>

              <Link className='d-flex' to="/">Already have an account?</Link>

            </Container>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
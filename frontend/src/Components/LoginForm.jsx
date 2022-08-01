import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'



const LoginForm = ({ handleSubmit }) => {

    return (
        <Container className='my-5' >
            <Row className='d-flex justify-content-center'>
                <Col md={8} lg={6}>
                    <h3 className='d-flex justify-content-center'>Log in</h3>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group className="d-flex my-3 align-items-center justify-content-center" controlId="username">
                            <Form.Label className='d-none'>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" />
                        </Form.Group>

                        <Form.Group className="d-flex aling-items-center mb-3" controlId="password">
                            <Form.Label className='d-none'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Container className='d-flex justify-content-evenly align-items-center'>
                            <Button className='d-flex my-2' variant="outline-primary" type="submit">Log in</Button>

                            <Link className='d-flex' to="/register">Don't have an account?</Link>

                        </Container>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;
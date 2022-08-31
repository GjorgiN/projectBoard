import React, { useRef, useState } from 'react';
import { Modal, Button, Container, Form, InputGroup, ListGroup, Row, Col } from 'react-bootstrap';
import searchIcon from '../assets/searchIcon.svg'

const AddMember = () => {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');

    const handleClose = () => { setShow(false); setSearch('') };
    const handleShow = () => setShow(true);
    const handleSubmit = e => { 
        e.preventDefault();
        console.log(inputRef.current.value)
        inputRef.current.value = '';
        console.log(inputRef.current.value)
    };

    const inputRef = useRef();

    return (
        <>
            <Button autoFocus={false} className='p-1' variant="secondary" onClick={handleShow}>Add new member</Button>

            <Modal show={show} onHide={handleClose} size='lg' fullscreen="md-down">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Project Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <Form onSubmit={e => handleSubmit(e)} className='mb-3 w-75'>
                                    <InputGroup>
                                        <Form.Control
                                            ref={inputRef}
                                            placeholder="Search new project member"
                                            aria-label="Search new project member by name, email or username"
                                            aria-describedby="basic-addon2"
                                        // onChange={e => setSearch(e.target.value)}
                                        // value={search}
                                        />
                                        <Button type='submit' style={{ borderLeft: 'none' }} variant="outline-secondary" id="button-addon2">
                                            <img src={searchIcon} />
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </Col>
                        </Row>
                    </Container>

                    <ListGroup variant="flush">
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddMember;
import React, { useRef, useState } from 'react';
import { Modal, Button, Container, Form, InputGroup, ListGroup, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import searchIcon from '../assets/searchIcon.svg'

const AddMember = ({ project }) => {
    const [show, setShow] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);

    const handleClose = () => {
        setShow(false);
        setSearchUser('');
        setFoundUsers([]);
    };
    const handleShow = () => setShow(true);

    const handleAddNewUserToProject = e => {
        e.preventDefault();
    }

    const handleSubmit = e => {
        e.preventDefault();

        const searchQuery = inputRef.current.value;
        if (searchQuery === '') {
            setFoundUsers([]);
            return;
        }

        const token = localStorage.getItem('user')

        const config = {
            headers: {
                authorization: 'Bearer ' + token
            },
            url: 'http://localhost:8080/api/user/searchUser',
            params: {
                searchQuery
            },
            method: 'get'
        }


        axios(config)
            .then(res => {
                console.log(res.data);

                if (res.data.length === 0) {
                    setFoundUsers([]);
                    return;
                }

                setFoundUsers(res.data);


            })
            .catch(error => {
                console.log(error);
            })
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
                                        />
                                        <Button onFocus={e => e.target.style.boxShadow = 'none'} type='submit' variant="outline-secondary" id="button-addon2">
                                            <img height="20rem" src={searchIcon} />
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </Col>
                        </Row>
                    </Container>

                    <ListGroup variant="flush">
                        {foundUsers.map(user => <ListGroup.Item className='d-flex justify-content-between' key={user.id}>
                            <span>
                                <span>{`${user.firstName} ${user.lastName}`}</span>
                                <span style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
                                    {`<${user.email}>`}
                                </span>
                            </span>
                            <span onClick={e => handleAddNewUserToProject(e)} className='btn btn-sm btn-outline-secondary'>Add</span>
                        </ListGroup.Item>)}

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
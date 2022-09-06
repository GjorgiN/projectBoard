import React, { useRef, useState } from 'react';
import { Modal, Button, Container, Form, InputGroup, ListGroup, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import searchIcon from '../assets/searchIcon.svg'
import userAlreadyInProject from '../assets/userAlreadyInProject.svg'

const AddMember = ({ project, setProject, baseUrl }) => {
    const [show, setShow] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [inputOnFocus, setInputOnFocus] = useState(true);

    const handleClose = () => {
        setShow(false);
        setSearchUser('');
        setFoundUsers([]);
        setShowAlert(false);
    };
    const handleShow = () => setShow(true);

    const addNewUserToProject = (e, user) => {
        e.preventDefault();
        const url = `${baseUrl}/${project.id}/${user.username}`
        const config = {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('user')
            },
            url,
            method: 'post'
        }

        axios(config)
            .then(res => {
                console.log(res);
                const newProject = { ...project };
                newProject.members.push(user);
                setProject(newProject);
            })
            .catch(error => console.log(error));
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
                    setShowAlert(true);
                    return;
                }
                showAlert && setShowAlert(false);
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
                                <Form onSubmit={e => handleSubmit(e)} className='mb-2 w-75'>
                                    <InputGroup>
                                        <Form.Control
                                            autoFocus
                                            onFocus={e => e.target.style.boxShadow = 'none'}
                                            ref={inputRef}
                                            placeholder="Search new member"
                                            aria-label="Search new project member by name, email or username"
                                            aria-describedby="basic-addon2"
                                        />
                                        <Button onFocus={e => e.target.style.boxShadow = 'none'} style={{ border: '1px solid rgb(200,200,200)' }} type='submit' variant="light" id="button-addon2">
                                            <img height="20rem" src={searchIcon} />
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </Col>
                        </Row>
                        <Row className='justify-content-center mb-3'>
                            {
                                (foundUsers.length > 0 || showAlert) && <Button
                                    onClick={() => {
                                        setFoundUsers([]);
                                        inputRef.current.value = '';
                                        inputRef.current.focus();
                                        setShowAlert(false)
                                    }}
                                    style={{ width: 'fit-content' }} size='sm' variant='light'>
                                    Clear search</Button>
                            }
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                <ListGroup variant='flush'>
                                    {
                                        foundUsers.map(user => <ListGroup.Item className='d-flex align-items-center' key={user.id}>
                                            {[...project.owners].concat([...project.members]).find(pUser => pUser.id === user.id) ?
                                                <Alert className='py-0 px-2 m-0 me-2' variant='success'>
                                                    <img className='p-0 mx-0 my-1' height='24rem' width='26rem' src={userAlreadyInProject} />
                                                </Alert>
                                                :
                                                <span onClick={e => addNewUserToProject(e, user)} className=' btn btn-sm btn-outline-secondary me-2'>Add</span>
                                            }
                                            <span>
                                                <span className='mx-1'>{`${user.firstName} ${user.lastName}`}</span>
                                                <span style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>{`<${user.email}>`}</span>
                                            </span>
                                        </ListGroup.Item>)
                                    }
                                </ListGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='d-flex justify-content-center'>
                                {showAlert && <Alert className='py-1' variant='info'>No matches are found</Alert>}
                            </Col>
                        </Row>

                    </Container>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddMember;
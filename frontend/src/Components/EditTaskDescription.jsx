import axios from 'axios';
import React, { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const EditTaskDescription = ({ task, project, setProject, sectionId, baseUrl, doesTaskHasDescription, taskHasDescription, taskHasNotDescription, title }) => {

    const [show, setShow] = useState(false);
    const [newDescription, setNewDescription] = useState(task.description);
    const [showTextArea, setShowTextArea] = useState(false);
    const newDescriptionLength = newDescription ? newDescription.length : 0;

    const handleDescriptionSave = () => {

        const token = localStorage.getItem('user')
        const taskUpdates = {
            id: task.id,
            description: newDescription || '',

        }

        const config = {
            headers: {
                authorization: 'Bearer ' + token
            },
            url: baseUrl + '/' + project.id + '/' + sectionId + '/updatetask',
            data: taskUpdates,
            method: 'put'
        }


        axios(config)
            .then(res => {
                console.log(res);
                const newTask = { ...task, description: newDescription };
                const newTasks = { ...project.tasks };
                newTasks[task.id] = newTask;
                const newProject = { ...project, newTasks };
                setShowTextArea(false);
                setProject(newProject);
                task.description = newTask.description;


            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <>
            <img onClick={() => setShow(true)} className="me-1 btn btn-sm btn-outline-secondary my-0 p-0" height="25rem" src={doesTaskHasDescription ? taskHasDescription : taskHasNotDescription} />
            <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
                size='lg'
                fullscreen="sm-down"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        !showTextArea && <>
                            <div className='mb-0' style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>Description</div>
                            <p style={{ minHeight: '100px', minWidth: '100px', whiteSpace: 'pre-wrap' }} onClick={() => setShowTextArea(true)}>{newDescription || 'No description'}</p>
                        </>
                    }
                    {
                        showTextArea &&
                        <>

                            <FloatingLabel controlId="taskDescription" label="editDescription">
                                <Form.Control
                                    value={newDescription || ''}
                                    as="textarea"
                                    placeholder="Task Description"
                                    style={{ minHeight: '200px' }}
                                    autoFocus
                                    onFocus={e => e.target.setSelectionRange(newDescriptionLength, newDescriptionLength)}
                                    maxLength="250"
                                    onChange={e => setNewDescription(e.target.value)}
                                />
                            </FloatingLabel>
                        </>

                    }
                    <div style={newDescription && newDescription.length >= 250 ? { color: 'darkred' } : { color: 'inherit' }} className='mt-2 text-end'>{newDescription ? newDescription.length : 0} / 250</div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        !showTextArea &&
                        <span>
                            <Button className='me-1' onClick={() => { setShowTextArea(true) }} variant="primary">Edit</Button>
                            <Button variant="secondary" onClick={() => { setShow(false); }}>Close</Button>
                        </span>
                    }

                    {showTextArea &&
                        <span>
                            <Button className='me-1' onClick={() => handleDescriptionSave()} variant="success">Save</Button>
                            <Button onClick={() => { setShowTextArea(false); setNewDescription(task.description) }} variant="danger">Cancel</Button>
                        </span>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditTaskDescription 
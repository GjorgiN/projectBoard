import React, { useState } from 'react'
import axios from 'axios';
import trashCan from '../assets/trashCan.svg'
import downloadFile from '../assets/downloadFile.svg'
import { Popover, OverlayTrigger, Container, Row, Col, Form, Alert, Button } from 'react-bootstrap'

const Attachments = ({ noAttachment, hasAttachment, project, setProject, task, baseUrl }) => {
    const [attachments, setAttachments] = useState([...project.tasks[task.id].attachments]);
    const [areFilesAttached, setAreFilesAttached] = useState(attachments.length > 0);

    const handleFilesAttachment = e => {
        e.preventDefault();

        const files = e.target[0].files;

        if (files.length < 1) {
            console.log('choose a file, you moron!')
            return;
        };

        const formData = new FormData();
        for (const file of files) {
            formData.append('attachments', file);
        }

        const token = localStorage.getItem('user');

        const config = {
            method: 'post',
            url: `${baseUrl}/${project.id}/attachments`,
            headers: {
                authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
            params: {
                taskId: task.id,
            }
        }

        // console.log(formData);

        // formData.forEach(file => console.log(file));

        // in project.tasks.task.attachments[att1, att2] the attachments should be string of the name, not the file it self, for download another request to be made


        axios(config)
            .then(res => {
                console.log(res);
                const newProject = { ...project };

                for (const att of res.data) {
                    newProject.tasks[task.id].attachments.push({ id: att.id, title: att.title });
                }

                setProject(newProject);

            })
            .catch(err => console.log(err));

    }


    const popover = (
        <Popover style={{ minWidth: '23rem' }} id="attachments">
            <Popover.Header as="h3">Task's Attachments</Popover.Header>
            <Popover.Body>
                <Container className='m-0 p-0'>
                    <Row className='m-0 mb-3 p-0'>
                        <Col className='m-0 p-0'>
                            {areFilesAttached ?
                                attachments.map(attachment => <Alert key={attachment.id} className='p-1 m-0 mb-2 text-start' variant='secondary'>
                                    <Container className='m-0 p-0'>
                                        <Row className='align-items-center m-0 p-0'>
                                            <Col xs='8' className='m-0 p-0'>
                                                <span className='m-0 p-0'>{attachment.title}</span>
                                            </Col>
                                            <Col className='d-flex justify-content-end m-0 p-0'>
                                                <Button className='my-0 mx-1 p-1' size='sm' variant='outline-success'>
                                                    <img height='22rem' src={downloadFile} />
                                                </Button>
                                                <Button className='m-0 p-1' size='sm' variant='outline-danger'>
                                                    <img height='22rem' src={trashCan} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Alert>)
                                :
                                <Alert className='p-1 m-0 mb-2 text-center' variant='info'>The task does not have attachments</Alert>}
                        </Col>
                    </Row>
                    <Row className='m-0 p-0'>
                        <Col className='m-0 p-0'>
                            <Form onSubmit={e => handleFilesAttachment(e)}>
                                <Form.Group controlId="formFileMultiple" className="d-flex justify-content-end mb-1">
                                    <Container className='m-0 p-0'>
                                        <Row className='m-0 p-0'>
                                            <Col className='m-0 p-0'>
                                                <Form.Label className='ms-1'>Choose files to attach to this task</Form.Label>
                                                <Form.Control size='sm' type="file" multiple />
                                            </Col>
                                        </Row>
                                        <Row className='m-0 p-0'>
                                            <Col className='d-flex justify-content-end m-0 p-0'>
                                                <Button className='mt-2' variant="secondary" size="sm" type='submit'>Add files</Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Popover.Body>
        </Popover>
    )

    return (
        <OverlayTrigger rootClose trigger="click" placement="right-start" overlay={popover}>
            <img onMouseOver={e => e.target.style.cursor = 'pointer'} height="25rem" src={areFilesAttached ? hasAttachment : noAttachment} />
        </OverlayTrigger>
    )
}

export default Attachments
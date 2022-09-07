import React, { useState } from 'react'
import { Popover, OverlayTrigger, Container, Row, Col, Form, Alert, Button } from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';

const Attachments = ({ noAttachment, hasAttachment, project, setProject, task, baseUrl }) => {
    const attachments = [...project.tasks[task.id].attachments]
    const [areFilesAttached, setAreFilesAttached] = useState(attachments.length > 0);

    const handleFilesAttachment = e => {
        e.preventDefault();
        console.dir(e)
        const formData = new FormData();

        for (const file of e.target[0].files) {
            formData.append('files[]', file);
        }


        const token = localStorage.getItem('user');

        const config = {
            method: 'post',
            url: `${baseUrl}/${project.id}/${task.id}/attachments`,
            headers: {
                authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data',
            },
            formData,
        }

        formData.forEach(file => console.log(file));

        // in project.tasks.task.attachments[att1, att2] the attachments should be string of the name, not the file it self, for download another request to be made

        // axios(config)
        //     .then(res => {
        //         console.log(res);
        //         const newProject = {...project};
        //         for (const file of formData) {
        //             newProject.tasks[task.id].attachments.push(file);
        //         }
        //     })


    }


    const popover = (
        <Popover id="attachments">
            <Popover.Header as="h3">Task's Attachments</Popover.Header>
            <Popover.Body>
                <Container className='m-0 p-0'>
                    <Row className='m-0 mb-3 p-0'>
                        <Col className='m-0 p-0'>
                            {areFilesAttached ? attachments.map(attachment => attachment.title) : <Alert className='p-1 m-0 mb-2 text-center' variant='info'>The task does not have attachments</Alert>}
                        </Col>
                    </Row>
                    <Row className='m-0 p-0'>
                        <Col className='m-0 p-0'>
                            <Form onSubmit={e => handleFilesAttachment(e)}>
                                <Form.Group controlId="formFileMultiple" className="d-flex justify-content-end mb-1">
                                    <Container className='m-0 p-0'>
                                        <Row className='m-0 p-0'>
                                            <Col className='m-0 p-0'>
                                                <Form.Label className='d-none'>Choose files to be attached to this task</Form.Label>
                                                <Form.Control size='sm' type="file" multiple />
                                            </Col>
                                        </Row>
                                        <Row className='m-0 p-0'>
                                            <Col className='d-flex justify-content-end m-0 p-0'>
                                                <Button className='mt-2' variant="secondary" size="sm" type='submit'>Submit</Button>
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
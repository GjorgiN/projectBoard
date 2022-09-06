import { Alert, Button, ListGroup, OverlayTrigger, Popover, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
const AssignUser = ({ doesTaskIsAssigned, baseUrl, setDoesTaskIsAssigned, userIsAssigned, userNotAssigned, task, project, setProject }) => {

    const { owners, members } = project;
    const taskId = task.id;
    const allProjectUsers = owners.concat(members);

    const handleUserAssignment = (e, userId) => {
        const user = allProjectUsers.find(user => user.id === userId) || null;

        const params = {
            projectId: project.id,
            taskId,
            userId
        }

        const token = localStorage.getItem('user');

        const config = {
            method: 'put',
            url: `${baseUrl}/taskAssignUser`,
            headers: {
                authorization: 'Bearer ' + token
            },
            params,
        }

        axios(config)
            .then(res => {
                const newTasks = { ...project.tasks };
                newTasks[taskId].assignedUser = user;
                const newProject = { ...project, tasks: newTasks };
                setProject(newProject);

                setDoesTaskIsAssigned(user ? true : false);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const popover = (
        doesTaskIsAssigned ?
            <Popover style={{ borderRadius: '0.48rem 0.48rem 0 0', minWidth: '17.5rem' }} className='mb-0 p-0' id="assignUser">
                <Popover.Header className='p-1 m-0' as="h4">Task is assigned to</Popover.Header>
                <Popover.Body className='d-flex align-content-center m-0 p-0'>
                    <Container className='m-0 p-0'>
                        <Row className='m-0 p-0'>
                            <Col className='m-0 p-0' xs="9">
                                <Alert style={{ borderRadius: '0', borderColor: 'transparent' }} className='m-0 p-1' variant='primary'> {`${task.assignedUser.firstName} ${task.assignedUser.lastName} `}
                                </Alert>
                            </Col>
                            <Col xs="3" className='m-0 p-0'>
                                <Button onClick={e => handleUserAssignment(e, 0)} className='w-100' size='sm' variant='danger' style={{ borderColor: 'transparent', borderRadius: '0' }}>Remove</Button>
                            </Col>
                        </Row>

                        {allProjectUsers.length > 1 &&
                            <Row className='m-0 p-0'>
                                <Col className="m-0 p-0">
                                    <Alert style={{ border: 'none', borderTop: '1px solid #BBB', borderRadius: '0' }} className='m-0 pt-1 pb-0 ps-1 pe-0' variant='secondary'>Reassign to:</Alert>
                                    <ListGroup className='m-0 p-0'>
                                        {
                                            allProjectUsers
                                                .filter(user => user.id !== task.assignedUser.id)
                                                .map(user => {
                                                    return <ListGroup.Item style={{ border: 'none' }} className='m-0 p-0' onMouseOver={e => e.target.style.cursor = 'pointer'}
                                                        onClick={e => handleUserAssignment(e, user.id)} key={user.id}>
                                                        <Button className='m-0 p-0 py-1 w-100' style={{ border: 'none', borderRadius: '0' }} variant='success' size='sm'>{`${user.firstName} ${user.lastName}`}</Button>

                                                    </ListGroup.Item>
                                                })
                                        }
                                    </ListGroup>
                                </Col>
                            </Row>
                        }
                    </Container>
                </Popover.Body>
            </Popover>
            :
            <Popover style={{ borderRadius: '0.48rem 0.48rem 0 0' }} id="assignUser">
                <Popover.Header className='m-0 py-1 ps-1 pe-2' as="h3">Assign task to:</Popover.Header>
                <Popover.Body style={{ borderRadius: '0' }} className='m-0 p-0'>
                    <ListGroup className='m-0 p-0'>
                        {
                            allProjectUsers.map(user => {

                                return <ListGroup.Item style={{ border: 'none' }} className='m-0 p-0' onMouseOver={e => e.target.style.cursor = 'pointer'}
                                    onClick={e => handleUserAssignment(e, user.id)} key={user.id}>
                                    <Button className='m-0 mb-1 px-0 py-1 w-100' style={{ border: 'none', borderRadius: '0' }} variant='success' size='sm'>{`${user.firstName} ${user.lastName}`}</Button>

                                </ListGroup.Item>
                            })
                        }
                    </ListGroup>
                </Popover.Body>
            </Popover>
    )

    return <OverlayTrigger rootClose trigger="click" placement="right-start" overlay={popover}>
        <span style={{ whiteSpace: 'pre-wrap' }} className={"btn btn-sm btn-outline-secondary my-0 p-0 d-flex align-items-center"}>
            <img height="24rem" src={doesTaskIsAssigned ? userIsAssigned : userNotAssigned} />
            {/* {doesTaskIsAssigned ? task.assignedUser.username + ' ' : ''} */}
        </span>
    </OverlayTrigger>

}

export default AssignUser;
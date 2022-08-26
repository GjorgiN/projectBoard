import { useEffect, useRef } from 'react';
import { Alert, Button, ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';


const AssignUser = ({ doesTaskIsAssigned, setDoesTaskIsAssigned, userIsAssigned, userNotAssigned, task, project }) => {

    const { owners, members } = project;
    const allProjectUsers = owners.concat(members);

    const handleUserAssignment = (e, userId) => {
        console.log(e.target);
        const user = allProjectUsers.find(user => user.id === userId);
        if (user) {
            project.tasks[task.id].assignedUser = user;
            setDoesTaskIsAssigned(true);
        }
    }

    const popover = (
        doesTaskIsAssigned ?
            <Popover className='mb-0' id="assignUser">
                <Popover.Header className='p-1 m-0' as="h4">Task is assigned to</Popover.Header>
                <Popover.Body className='d-flex align-content-center m-0 p-0'>
                    <Alert style={{ borderRadius: '0 0 0 0.45rem', borderColor: 'transparent' }} className='d-flex m-0 p-1 ps-2' variant='primary'> {`${task.assignedUser.firstName} ${task.assignedUser.lastName} `}
                    </Alert>
                    <Button className='d-flex m-0 p-1' variant='danger' style={{ borderColor: 'transparent', borderRadius: '0 0 0.45rem 0'}} size='sm'>Remove</Button>

                </Popover.Body>
            </Popover>
            :
            <Popover style={{borderRadius: '0.48rem 0.48rem 0 0'}} id="assignUser">
                <Popover.Header className='m-0 py-1 ps-1 pe-2' as="h3">Assign task to:</Popover.Header>
                <Popover.Body style={{borderRadius: '0'}} className='m-0 p-0'>
                    <ListGroup className='m-0 p-0'>
                        {
                            allProjectUsers.map(user => {

                                return <ListGroup.Item style={{ border: 'none' }} className='m-0 p-0' onMouseOver={e => e.target.style.cursor = 'pointer'}
                                    onClick={e => handleUserAssignment(e, user.id)} key={user.id}>
                                    <Button className='m-0 p-0 py-1 w-100' style={{ border: 'none', borderRadius: '0' }} variant='success' size='sm'>{`${user.firstName} ${user.lastName}`}</Button>

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
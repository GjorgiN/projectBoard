import { useRef, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from 'axios';

const baseUrl = 'http://localhost:8080/api/project/myprojects'

const RenameTask = ({ showRenameTask, setShowRenameTask, task, project, setProject, sectionId }) => {
    const taskId = task.id;
    const [newTitle, setNewTitle] = useState(task.title);

    const handleClickElsewhereListeners = () => {
        document.addEventListener('click',)
    }

    const cancelTitleUpdate = (e) => {
        setNewTitle('');
        setShowRenameTask(!showRenameTask);
    }

    const checkKey = (e) => {
        e.preventDefault();
        console.log(e);
        if (e.key === 'Escape') {
            cancelTitleUpdate(e);
        }

        if (e.key === 'Enter') {
            updateTaskTitle(e);
        }

    }

    const updateTaskTitle = e => {
        e.preventDefault();

        const token = localStorage.getItem('user');

        const config = {
            url: baseUrl + `/${project.id}/${sectionId}/updatetask`,
            method: 'put',
            headers: {
                authorization: 'Bearer ' + token
            },
            data: {
                id: taskId,
                title: newTitle,
            }
        }


        axios(config)
            .then(res => {
                console.log(res);

                const newTasks = { ...project.tasks };
                newTasks[taskId].title = newTitle;

                const newProject = {
                    ...project,
                    tasks: newTasks,
                };

                setProject(newProject);
                setShowRenameTask(!showRenameTask);



            })
            .catch(error => {
                console.log(error);
            })


    }

    return (
        <Form className="mb-1" onSubmit={(e) => updateTaskTitle(e)}>
            <Form.Group controlId="taskTitle">
                <Form.Label className="d-none">Task Title</Form.Label>
                <Form.Control style={{ height: '1.8rem', }} required autoFocus onFocus={e => e.target.style.boxShadow = "none"} onKeyUp={e => { checkKey(e) }} onChange={(e) => { setNewTitle(e.target.value) }} value={newTitle} type="text" placeholder="Task Title" />
            </Form.Group>
            <div className="d-flex mt-1 justify-content-end">
                <Button className="px-1 me-1" size="sm" variant="outline-success" type="submit">Change</Button>
                <Button size="sm" onClick={e => cancelTitleUpdate(e)} variant="outline-danger" type="button">Cancel</Button>
            </div>
        </Form>

    );
}

export default RenameTask
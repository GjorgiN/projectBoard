import { Card, Container, Button, InputGroup } from "react-bootstrap"
import trashBin from "../../node_modules/bootstrap-icons/icons/trash3.svg"
import arrowsMove from "../../node_modules/bootstrap-icons/icons/arrows-move.svg"
import calendar from "../assets/calendarDueDateUnset.svg"
import taskCompleted from "../../node_modules/bootstrap-icons/icons/check2.svg"
import { useState } from "react"
import axios from "axios"


const Task = ({ task, section, project, setProject, baseUrl }) => {

    const [isCompleted, setIsCompleted] = useState(task.completed);

    const updateTaskStatus = () => {
        const url = `${baseUrl}/`
    }

    
    const deleteTask = (e) => {
        e.preventDefault();
        const taskId = task.id.toString();
        const sectionId = section.id.toString();
        const projectId = project.id.toString();
        const url = `${baseUrl}/${projectId}/${sectionId}/${taskId}`
        const token = localStorage.getItem('user');

        const config = {
            url,
            method: 'delete',
            headers: {
                authorization: 'Bearer ' + token
            }
        }

        axios(config)
            .then(res => {
                const newTasks = {};
                for (const tId in project.tasks) {
                    if (tId !== taskId) {
                        newTasks[tId] = project.tasks[tId]
                    }
                }


                const newSection = {
                    ...section,
                    tasksIds: section.tasksIds.filter(tId => tId !== taskId)
                };


                for (const tId in newTasks) {
                    newTasks[tId].orderId = newSection.tasksIds.indexOf(tId) + 1;
                }

                const newSections = { ...project.sections };
                newSections[sectionId] = newSection;

                const newProject = { ...project, sections: newSections, tasks: newTasks };

                console.log(newProject);

                setProject(newProject);

            })
            .catch(err => {
                console.log(err);
            })




    }

    return (
        <Card className="m-1 myTask d-flex">
            <Card.Body>
                <Card.Title className="mb-2">{task.title}

                </Card.Title>
                <Card.Text className="mb-1">{task.description || 'no description...'}</Card.Text>
                <Card.Text className="mb-1">
                    <img height={"22rem"} src={calendar} alt="calendar for unset due date with opacity"></img>
                </Card.Text>

                <span onClick={() => setIsCompleted(!isCompleted)} className={isCompleted ? "btn btn-sm btn-success p-0 my-0 me-1" : "btn btn-sm btn-outline-secondary p-0 my-0 me-1"}>
                    <img height="24rem" src={taskCompleted} />
                </span>




                <Container className="d-flex flex-row-reverse m-0 p-0">
                    <Button onClick={deleteTask} variant="outline-danger" className="mx-1 p-1"><img height="22rem" src={trashBin} /></Button>
                    <Button variant="outline-secondary" className="mx-1 p-1"><img height="22rem" src={arrowsMove} /></Button>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default Task
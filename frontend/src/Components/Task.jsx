import { Card, Container, Button, InputGroup } from "react-bootstrap"
import trashBin from "../../node_modules/bootstrap-icons/icons/trash3.svg"
import arrowsMove from "../../node_modules/bootstrap-icons/icons/arrows-move.svg"
import calendar from "../assets/calendarDueDateUnset.svg"
import dueDateSet from "../assets/calendarDueDateSet.svg"
import taskCompleted from "../../node_modules/bootstrap-icons/icons/check2.svg"
import { useRef, useState } from "react"
import axios from "axios"
import warningDueDatePassed from "../assets/warningDueDatePassed.svg"
import DueDatePicker from "./DueDatePicker"


const Task = ({ task, section, project, setProject, baseUrl }) => {
    const { dueDate } = task;

    // YYYY-MM-DD, 2022-09-01, return epoch/number/long
    const getNumberFromDateStrYYYYMMDD = date => {
        if (date === null) {
            return null;
        }

        const year = Number(date.slice(0, 4));
        const month = Number(date.slice(5, 7)) - 1;
        const day = Number(date.slice(8));
        const dateAsDateFormat = new Date(year, month, day);

        return dateAsDateFormat.getTime();
    }


    // change dueDate with state isOverdue and handle project.task.dueDate as prop in the task component
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [isOverdue, setIsOverdue] = useState(dueDate ? getNumberFromDateStrYYYYMMDD(dueDate) < new Date().getTime() : false);


    const getDueDateInStringDDMMYYYY = (date) => {
        if (date === null) return '';

        const dateAsDate = new Date(date);

        const dOfMonth = dateAsDate.getDate();
        const dayOfMonth = dOfMonth < 10 ? `0${dOfMonth}` : dOfMonth;

        const monthNum = dateAsDate.getMonth();
        const month = monthNum < 10 ? `0${monthNum + 1}` : monthNum;

        const dateAsString = `${dayOfMonth}-${month}-${dateAsDate.getFullYear()}`

        return dateAsString;
    }

    const updateTaskStatus = (e) => {
        e.preventDefault();

        const taskNewStatus = !task.completed;

        const taskId = task.id.toString();
        const sectionId = section.id.toString();
        const projectId = project.id.toString();
        const url = `${baseUrl}/${projectId}/${sectionId}/updatetask`
        const token = localStorage.getItem('user');

        const data = {
            "id": taskId,
            // "orderId": 0,
            // "title": "string",
            // "dueDate": 0,
            "completed": taskNewStatus,
            // "assignedUserId": 0,
            // "attachmentLocation": "string"
        }

        const config = {
            method: 'put',
            url,
            headers: {
                authorization: 'Bearer ' + token
            },
            data: data
        }

        axios(config)
            .then(res => {
                const newProject = { ...project };
                const newTask = { ...task };
                newTask.completed = taskNewStatus;
                newProject.tasks[taskId] = newTask;

                setProject(newProject);

                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

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

    const dueDateImgRef = useRef();

    return (
        <Card className="m-1 myTask d-flex">
            <Card.Body>
                <Card.Title className="mb-2">{task.title}</Card.Title>

                <Card.Text className="mb-1">{task.description || 'no description...'}</Card.Text>

                <Container className="d-flex mx-0 px-0 mb-1 align-items-top">
                    {
                        !task.completed && <span className="d-flex justify-content-evenly align-items-center">
                            <img ref={dueDateImgRef} className="me-1 d-flex" onMouseOver={(e) => e.target.style.cursor = 'pointer'} onClick={() => setShowDueDatePicker(true)} height={"25rem"} src={dueDate ? dueDateSet : calendar} alt="calendar for unset due date with opacity" />

                            {isOverdue && !showDueDatePicker
                                && <img className="d-flex me-1" height="22rem" src={warningDueDatePassed} />}

                            {!showDueDatePicker && <span className="d-flex">
                                {String(getDueDateInStringDDMMYYYY(dueDate))}
                            </span>}
                        </span>
                    }

                    {showDueDatePicker &&
                        <DueDatePicker task={task} project={project} setProject={setProject} baseUrl={baseUrl} dueDateImgRef={dueDateImgRef} showDueDatePicker={showDueDatePicker} setShowDueDatePicker={setShowDueDatePicker} setIsOverdue={setIsOverdue} />
                    }
                </Container>

                <span onClick={(e) => updateTaskStatus(e)} className={task.completed ? "btn btn-sm btn-success p-0 my-0 me-1" : "btn btn-sm btn-outline-success p-0 my-0 me-1"}>
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
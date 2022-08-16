import { Card, Container, Button, InputGroup } from "react-bootstrap"
import trashBin from "../../node_modules/bootstrap-icons/icons/trash3.svg"
import arrowsMove from "../../node_modules/bootstrap-icons/icons/arrows-move.svg"
import calendar from "../assets/calendarDueDateUnset.svg"
import dueDateSet from "../assets/calendarDueDateSet.svg"
import taskCompleted from "../../node_modules/bootstrap-icons/icons/check2.svg"
import { useRef, useState } from "react"
import axios from "axios"
import warningDueDatePassed from "../assets/warningDueDatePassed.svg"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./reactDatePickerWidthFix.css"
import uk from "date-fns/locale/en-GB"
import { registerLocale } from "react-datepicker"
import DueDatePicker from "./DueDatePicker"
registerLocale('uk', uk)


const Task = ({ task, section, project, setProject, baseUrl }) => {

    const [isCompleted, setIsCompleted] = useState(task.completed);
    const [dueDate, setDueDate] = useState(task.dueDate)
    const [showDueDatePicker, setShowDueDatePicker] = useState(task.dueDate);

    const getDueDateInStringDDMMYYYY = (dueDate) => {
        if (!dueDate) return '';

        const dateAsDate = new Date(dueDate);

        const dOfMonth = dateAsDate.getDate();
        const dayOfMonth = dOfMonth < 10 ? `0${dOfMonth}` : dOfMonth;

        const monthNum = dateAsDate.getMonth();
        const month = monthNum < 10 ? `0${monthNum}` : monthNum;

        const dateAsString = `${dayOfMonth}-${month}-${dateAsDate.getFullYear()}`

        return dateAsString;
    }

    const updateTaskStatus = (e) => {
        e.preventDefault();

        const taskNewStatus = !isCompleted;

        const taskId = task.id.toString();
        const sectionId = section.id.toString();
        const projectId = project.id.toString();
        const url = `${baseUrl} /${projectId}/${sectionId} /updatetask`
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
                setIsCompleted(taskNewStatus);
                project.tasks[taskId].completed = isCompleted;
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
                <Card.Title className="mb-2">{task.title}

                </Card.Title>
                <Card.Text className="mb-1">{task.description || 'no description...'}</Card.Text>

                <Container className=" d-flex mx-0 px-0 mb-1 justify-content-start align-items-center">

                    <img ref={dueDateImgRef} className="me-1 d-flex" onMouseOver={(e) => e.target.style.cursor = 'pointer'} onClick={() => setShowDueDatePicker(!showDueDatePicker)} height={"25rem"} src={dueDate ? dueDateSet : calendar} alt="calendar for unset due date with opacity" />

                    {dueDate !== null && !showDueDatePicker && dueDate < new Date().getTime() ? <img className="d-flex me-1" height="25rem" src={warningDueDatePassed} /> : null}

                    {!showDueDatePicker && <span className="d-flex">
                        {String(getDueDateInStringDDMMYYYY(dueDate))}
                    </span>}


                    {showDueDatePicker &&
                        <DueDatePicker dueDateImgRef={dueDateImgRef} showDueDatePicker={showDueDatePicker} setShowDueDatePicker={setShowDueDatePicker} dueDate={dueDate} setDueDate={setDueDate} />
                    }
                    {/* <div className="d-flex mb-1" style={dueDate ? { width: "70%" } : { width: "70%" }}> */}

                    {/* <DatePicker isClearable showMonthDropdown showYearDropdown dropdownMode="select" placeholderText="Due Date: dd-MM-yyyy" showWeekNumbers dateFormat='dd-MM-yyyy' locale='uk' selected={dueDate} onChange={date => { date ? setDueDate(date.getTime()) : setDueDate(null); setShowDueDatePicker(false); }} /> */}

                    {/* </div> */}


                </Container>


                <span onClick={(e) => updateTaskStatus(e)} className={isCompleted ? "btn btn-sm btn-success p-0 my-0 me-1" : "btn btn-sm btn-outline-secondary p-0 my-0 me-1"}>
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
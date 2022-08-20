import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./reactDatePickerWidthFix.css"
import uk from "date-fns/locale/en-GB"
import { registerLocale } from "react-datepicker"
import { useEffect, useRef, useState } from "react"
import confirmDueDate from "../assets/confirmDueDate.svg"
import cancelDueDate from "../assets/cancelDueDate.svg"
import { Form, Button } from 'react-bootstrap';
import axios from "axios"

registerLocale('uk', uk)

const DueDatePicker = ({ dueDate, setShowDueDatePicker, showDueDatePicker, setIsOverdue, dueDateImgRef, baseUrl, task, project, setProject }) => {

    const [tempDueDate, setTempDueDate] = useState(dueDate);

    const handleSubmitDueDate = e => {
        e.preventDefault();
        if (tempDueDate === dueDate) {
            setShowDueDatePicker(false);
            return;
        }

        const token = localStorage.getItem('user')

        const config = {
            headers: {
                authorization: 'Bearer ' + token
            },
            url: baseUrl + '/task',
            params: {
                taskId: task.id,
                dueDate: tempDueDate ? tempDueDate : '',
                projectId: project.id,
            },
            method: 'put',
        }


        // update project state and check backend changes are not persisted in DB
        axios(config)
            .then(res => {
                console.log(res);

                const newDueDate = new Date(tempDueDate);

                let newDay = newDueDate.getDate();
                newDay = newDay < 10 ? '0' + newDay : newDay;

                let newMonth = newDueDate.getMonth() + 1;
                newMonth = newMonth < 10 ? '0' + newMonth : newMonth;

                const newDueDateStr = `${newDueDate.getFullYear()}-${newMonth}-${newDay}`;

                const newTasks = { ...project.tasks }
                newTasks[task.id].dueDate = newDueDateStr;

                const newProject = { ...project, tasks: newTasks };

                setShowDueDatePicker(false)
                setProject(newProject);
                setIsOverdue(tempDueDate ? tempDueDate < new Date().getTime() : false)

            })
            .catch(err => {
                console.log(err);
            })


    }

    const handleKeyboardControl = e => {
        if (e.key === 'Enter')
            handleSubmitDueDate(e);

        if (e.key === 'Escape') {
            setShowDueDatePicker(false)
        }
    }

    const btnCancel = useRef();
    const btnSubmit = useRef();
    const datePickerRef = useRef();
    const formRef = useRef();

    const closeDatePickerIfClickedElsewhere = e => {
        for (const element of e.path) {
            if (element === formRef.current) {
                setShowDueDatePicker(true)
                return;
            }
        }

        if (e.target !== datePickerRef.current) {
            handleSubmitDueDate(e);
        }

        if (e.target === dueDateImgRef.current) {
            setShowDueDatePicker(true)
        }
    }


    useEffect(() => {
        document.addEventListener('keyup', handleKeyboardControl);
        document.addEventListener('click', closeDatePickerIfClickedElsewhere);

        return () => {
            document.removeEventListener('keyup', handleKeyboardControl)
            document.removeEventListener('click', closeDatePickerIfClickedElsewhere);
        }
    })

    return (
        <Form ref={formRef} onSubmit={e => handleSubmitDueDate(e)} className="d-flex mb-1 align-items-top" style={tempDueDate ? { width: "65%" } : { width: "95%" }}>

            <DatePicker ref={datePickerRef} autoFocus isClearable shouldCloseOnSelect={false} showMonthDropdown showYearDropdown dropdownMode="select" placeholderText="Due Date: dd-MM-yyyy" showWeekNumbers dateFormat='dd-MM-yyyy' locale='uk' selected={tempDueDate} onChange={date => date ? setTempDueDate(date.getTime()) : setTempDueDate(null)} />

            <Button onClick={e => handleSubmitDueDate(e)} onFocus={(e) => { e.target.style.boxShadow = 'none'; e.target.style.outline = 'none'; }} ref={btnSubmit} type="submit" style={{ border: 'none', padding: '0', margin: '0', backgroundColor: 'inherit' }} >
                <img className="ms-1" height='21rem' src={confirmDueDate} />
            </Button>

            <Button onFocus={(e) => { e.target.style.boxShadow = 'none'; e.target.style.outline = 'none'; }} onClick={() => setShowDueDatePicker(false)} ref={btnCancel} style={{ border: 'none', padding: '0', margin: '0', backgroundColor: 'inherit' }} >
                <img className="ms-1" height='21rem' src={cancelDueDate} />
            </Button>
        </Form>
    );
}

export default DueDatePicker
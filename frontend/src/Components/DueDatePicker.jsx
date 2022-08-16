import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./reactDatePickerWidthFix.css"
import uk from "date-fns/locale/en-GB"
import { registerLocale } from "react-datepicker"
import { useEffect, useRef } from "react"
import confirmDueDate from "../assets/confirmDueDate.svg"
import cancelDueDate from "../assets/cancelDueDate.svg"
import { Form, Button } from 'react-bootstrap';

registerLocale('uk', uk)



// to close the date picker on esc btn make separate component and useEffect with return function
// document.addEventListener('keyup', (e) => {
//     if (e.key === 'Escape') setShowDueDatePicker(false)
// })



const DueDatePicker = ({ dueDate, setDueDate, setShowDueDatePicker, dueDateImgRef }) => {
    const handleSubmitDueDate = e => {
        e.preventDefault();
        console.log('I PROMISE TO SUBMIT THE DUE DATE');
        setShowDueDatePicker(false)
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
    const dueDateForm = useRef();
    const datePickerRef = useRef();

    const closeDatePickerIfClickedElsewhere = e => {
        console.dir(e)
        if (e.target !== datePickerRef.current) {
            setShowDueDatePicker(false);
        }

        if(e.target === dueDateImgRef.current)
            setShowDueDatePicker(true)

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
        <Form onSubmit={e => handleSubmitDueDate(e)} className="d-flex mb-1 align-items-center" style={dueDate ? { width: "65%" } : { width: "82%" }}>

            <DatePicker ref={datePickerRef} autoFocus onKeyDown={e => { if (e.key === 'Enter') setShowDueDatePicker(false) }} isClearable showMonthDropdown showYearDropdown dropdownMode="select" placeholderText="Due Date: dd-MM-yyyy" showWeekNumbers dateFormat='dd-MM-yyyy' locale='uk' selected={dueDate} onChange={date => { date ? setDueDate(date.getTime()) : setDueDate(null) }} />
            {
                dueDate &&
                <Button ref={btnSubmit} type="submit" style={{ border: 'none', padding: '0', margin: '0', backgroundColor: 'inherit' }} >
                    <img className="ms-1" height='21rem' src={confirmDueDate} />
                </Button>
            }

            <Button ref={btnCancel} style={{ border: 'none', padding: '0', margin: '0', backgroundColor: 'inherit' }} >
                <img className="ms-1" height='21rem' src={cancelDueDate} />
            </Button>
        </Form>
    );
}

export default DueDatePicker
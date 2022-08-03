import { Button, Container } from "react-bootstrap"
import Task from "./Task"
import deleteSection from "../../node_modules/bootstrap-icons/icons/x-lg.svg"
import { useState } from "react"

const Section = ({ section, tasks }) => {
    const [showRename, setShowRename] = useState(false);
    
    const renameSection = e => {
        e.preventDefault();
        setShowRename(!showRename)
    }
    return (
        <Container style={{ margin: '0 0.3rem', padding: "0 0.3rem", backgroundColor: 'rgba(238,202,252,0.4)', borderRadius: '0.3rem' }}>
            <Container style={{ width: "18rem" }} className="d-flex m-1 justify-content-between align-items-center">
                {!showRename && <h5 onClick={(e) => renameSection(e)} className="d-flex" style={{ width: '18rem', margin: '0.3rem 0', color: 'blueviolet' }}>{section.title}</h5>}
                {showRename && <input onClick={(e) => renameSection(e)} type="text" placeholder="Section title" value='SECTION TITLE'/>}
                <Button variant="outline"><img height="22rem" className="d-flex" src={deleteSection} /></Button>
            </Container>
            <Container className="px-0">

                {section.tasksIds.map(task => <Task key={task} task={tasks[task]} />)}

            </Container>
        </Container>
    )
}

export default Section
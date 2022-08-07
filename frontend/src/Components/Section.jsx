import { Button, Container } from "react-bootstrap"
import Task from "./Task"
import deleteXSection from "../../node_modules/bootstrap-icons/icons/x-lg.svg"
import { useState } from "react"
import axios from 'axios'
import RenameSection from "./RenameSection"

const baseUrl = 'http://localhost:8080/api/project/myprojects'

const Section = ({ project, setProject, section, tasks, projectId }) => {
    const [showRename, setShowRename] = useState(false);

    const deleteSection = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('user');

        const config = {
            url: baseUrl + `/${projectId}/${section.id}`,
            method: 'delete',
            headers: {
                authorization: 'Bearer ' + token
            }
        }

        axios(config)
            .then(res => {
                console.log(res);

                const newSections = {};
                for (const key in project.sections) {
                    if (key !== section.id) {
                        newSections[key] = project.sections[key];
                    }
                }

                const newSectionsOrder = project.sectionsOrder.filter(s => s !== section.id);

                const newTasks = {};
                for (const key in project.tasks) {
                    if (!section.tasksIds.includes(key))
                        newTasks[key] = project.tasks[key];
                }

                const newProject = {
                    ...project,
                    sections: newSections,
                    sectionsOrder: newSectionsOrder,
                    tasks: newTasks
                };

                setProject(newProject);



            })
            .catch(error => {
                console.log(error);
            })
    }


    const renameSection = e => {
        e.preventDefault();
        setShowRename(!showRename)
    }



    return (
        <Container style={{ margin: '0 0.3rem', padding: "0 0.3rem", backgroundColor: 'rgba(238,202,252,0.4)', borderRadius: '0.3rem' }}>
            <Container style={{ width: "18rem" }} className="d-flex m-1 justify-content-between align-items-center">
                {!showRename && <h5 onClick={(e) => renameSection(e)} className="d-flex" style={{ width: '18rem', margin: '0.3rem 0', color: 'blueviolet' }}>{section.title}</h5>}
                {showRename && <input onClick={(e) => renameSection(e)} type="text" placeholder="Section title" value='SECTION TITLE' />}
                <Button onClick={(e) => deleteSection(e)} variant="outline"><img height="22rem" className="d-flex" src={deleteXSection} /></Button>
            </Container>
            <Container className="px-0">

                {section.tasksIds.map(task => <Task key={task} task={tasks[task]} />)}

            </Container>
            <RenameSection />

        </Container>
    )
}

export default Section
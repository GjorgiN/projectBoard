import { Button, Container } from "react-bootstrap"
import Task from "./Task"
import deleteXSection from "../../node_modules/bootstrap-icons/icons/x-lg.svg"
import { useState } from "react"
import axios from 'axios'
import RenameSection from "./RenameSection"
import AddNewTask from "./AddNewTask"

const baseUrl = 'http://localhost:8080/api/project/myprojects'

const Section = ({ project, setProject, section, tasks, projectId }) => {
    const [showRename, setShowRename] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);

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
        <Container style={{ margin: '0 0.3rem', padding: "0 0.3rem", backgroundColor: 'rgba(238,202,252,0.4)', borderRadius: '0.3rem', }}>
            <Container style={{ width: "18rem" }} className="d-flex m-1 px-0 justify-content-between align-items-center">
                {!showRename && <h5 onMouseOver={e => e.target.style.cursor = 'pointer'} onClick={(e) => renameSection(e)} className="d-flex" style={{ maxWidth: '15rem', minHeight: '1rem', margin: '0.3rem 0', color: 'blueviolet', backgroundColor: 'yellowgreen' }}>{section.title}</h5>}
                {showRename && <RenameSection section={section} project={project} setProject={setProject} showRename={showRename} setShowRename={setShowRename} />}
                {!showRename && <Button onClick={(e) => deleteSection(e)} variant="outline"><img height="22rem" src={deleteXSection} /></Button>}
            </Container>

            {!showAddTask &&
                <div className="d-grid mx-1">
                    <Button onClick={() => setShowAddTask(!showAddTask)} style={{ borderRadius: "2px", transition: 'all ease 0.4s' }} variant="outline-secondary">Add Task</Button>
                </div>}

            {showAddTask && <AddNewTask setProject={setProject} project={project} baseUrl={baseUrl} section={section} showAddTask={showAddTask} setShowAddTask={setShowAddTask} />}

            <Container className="px-0 d-flex flex-column">

                {section.tasksIds.map(task => <Task key={task} task={tasks[task]} />)}

            </Container>


        </Container>
    )
}

export default Section
import React, { useEffect, useRef, useState } from 'react'
import { Container, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Section from '../Components/Section';
import plusLg from '../../node_modules/bootstrap-icons/icons/plus-lg.svg'
import ThreeDotsLoading from '../Components/ThreeDotsLoading';
import AddNewSection from '../Components/AddNewSection';

const baseUrl = 'http://localhost:8080/api/project/myprojects'


const Project = ({ setIsLoggedIn, isLoggedIn }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [project, setProject] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);
    const { projectId } = useParams();


    const getProjectData = () => {
        const token = localStorage.getItem('user')
        const config = {
            headers: {
                authorization: 'Bearer ' + token
            },
            url: baseUrl + '/' + projectId,
        }


        axios(config)
            .then(res => {
                console.log(res);
                setProject(res.data);
                setIsLoaded(true);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        const token = localStorage.getItem('user');
        if (token) {
            setIsLoggedIn(true);
        }
        if (!project) {
            getProjectData();
        }

    }, [isLoaded])


    return (
        <>
            {!isLoaded && isLoggedIn ? <ThreeDotsLoading /> :
                (isLoggedIn && isLoaded ?
                    <Container style={{ border: '2px solid red', margin: "4em 0em 0.5em 0.5em", minWidth: 'fit-content' }}>
                        <h3>{project.title}</h3>
                        <div className='d-flex m-1'>
                            <div className='d-flex'>
                                {project.sectionsOrder.map(section => <Section setProject={setProject} project={project} projectId={project.id} tasks={project.tasks} section={project.sections[section]} key={section} />)}
                            </div>
                            {!showAddSection && <Button id='addSection' onClick={() => { setShowAddSection(!showAddSection); }} className='d-flex justify-content-center align-items-center' style={{ width: '12rem', height: 'max-content' }} variant='light'>
                                <img className='me-1' width='24rem' src={plusLg} />New Section</Button>}
                            {
                                showAddSection && <AddNewSection id='addNewSectionComponent' baseUrl={baseUrl} project={project} setProject={setProject} showAddSection={showAddSection} setShowAddSection={setShowAddSection} />
                            }

                        </div>
                    </Container> :
                    <div>
                        <Link to="/" className='h2 d-flex mt-5 justify-content-center'>You need to log in...</Link>
                    </div>)
            }
        </>
    )
}

export default Project
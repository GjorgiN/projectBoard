import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { Link, useParams, Redirect } from 'react-router-dom'
import axios from 'axios'

const baseUrl = 'http://localhost:8080/api/project/myprojects'

const Project = ({ setIsLoggedIn, isLoggedIn }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [project, setProject] = useState(null);
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
        getProjectData();

    }, [isLoaded])



    return (
        <>
            {isLoggedIn && isLoaded ?
                <Container>
                    <h3 className='d-flex justify-content-center h3 mt-5 pt-3'>HELLO PROJECT No. {projectId}</h3>
                    <div className='d-flex '>
                        {project.sectionsOrder.map(section => <div className='mx-1 btn btn-success' key={section}>{project.sections[section].title}</div>)}
                    </div>

                </Container> :
                <div>
                    <Link to="/" className='h2 d-flex mt-5 justify-content-center'>You need to log in...</Link>
                </div>


            }
        </>
    )
}

export default Project
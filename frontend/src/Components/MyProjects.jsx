import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import MyNavbar from './MyNavbar'
import axios from 'axios';
import ProjectCard from './ProjectCard';

const url = 'http://localhost:8080/api/project/myprojects'




const Projects = ({isLoggedIn, setIsLoggedIn}) => {

  const [ownedProjects, setOwnedProjects] = useState(null);
  const [memberProjects, setMemberProjects] = useState(null);

  // change to get only project title, description and id, separate API call to get all project data from project component
  const getMyProjects = async () => {
    let data = {};
    try {

      const token = localStorage.getItem('user')
      const config = {
        headers: {
          authorization: 'Bearer ' + token
        },
        url,
      }

      const res = await axios(config)
      data = res.data;


    } catch (error) {
      console.log("ERROR FROM MY PROJECTS:", error)
      localStorage.removeItem('user');
      setIsLoggedIn(!isLoggedIn);

    }

    return data;
  }


  useEffect(() => {
    getMyProjects()
      .then(data => {
        setMemberProjects(data.onlyMember);
        setOwnedProjects(data.ownedProjects);
      })
      .catch(err => console.log(err));

  }, [])

  console.log("member projects:", memberProjects)
  console.log("owned projects:", ownedProjects)

  return (
    <>
      <Container className='my-5 mx-2 pt-3'>
        <h3>My Projects</h3>

        <p style={{ textAlign: 'justify' }}>
          Commodo qui cillum consectetur aute laborum ea Lorem et consequat proident. Do adipisicing deserunt ex enim esse consectetur veniam id. Laboris ad cillum irure deserunt ipsum reprehenderit aliqua ut. Proident non non mollit quis ex sunt do velit. Eu commodo reprehenderit do ex tempor dolor cillum magna sint anim culpa Lorem fugiat pariatur. Enim occaecat veniam do amet incididunt esse duis incididunt labore dolor.</p>

        <h3>Project Owner:</h3>

        {ownedProjects &&
          ownedProjects.map(project => <ProjectCard key={project.id} projectId={project.id} title={project.title} description={project.description} />)
        }
        <h3 className='h3 mt-3'>Member of projects:</h3>
        {memberProjects && <ul>
          {memberProjects.map(project => <li key={project.id}>{project.title}</li>)}
        </ul>}

      </Container>
    </>
  )
}

export default Projects
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from 'axios';

const baseUrl = 'http://localhost:8080/api/project/myprojects'

const RenameSection = ({ showRename, setShowRename, section, project, setProject }) => {
    const [newTitle, setNewTitle] = useState(section.title);

    const cancelTitleUpdate = (e) => {
        setNewTitle('');
        setShowRename(!showRename);
    }

    const checkKey = (e) => {
        e.preventDefault();
        console.log(e);
        if (e.key === 'Escape') {
            cancelTitleUpdate(e);
        }

    }

    const updateSectionName = e => {
        e.preventDefault();

        const token = localStorage.getItem('user');

        const config = {
            url: baseUrl + `/${project.id}`,
            method: 'put',
            headers: {
                authorization: 'Bearer ' + token
            },
            data: {
                id: section.id,
                title: newTitle,
            }
        }


        axios(config)
            .then(res => {
                console.log(res);

                const newSections = { ...project.sections };
                newSections[section.id].title = newTitle;

                const newProject = {
                    ...project,
                    sections: newSections,
                };

                setProject(newProject);
                setShowRename(!showRename);



            })
            .catch(error => {
                console.log(error);
            })


    }



    return (
        <Form onSubmit={(e) => updateSectionName(e)} style={{ width: "18rem" }} className="mx-1 mb-2 align-items-center justify-content-center">
            <Form.Group className="my-1" controlId="sectionTitle">
                <Form.Label className="d-none">Section Title</Form.Label>
                <Form.Control required autoFocus onKeyUp={e => { checkKey(e) }} onChange={(e) => { setNewTitle(e.target.value) }} value={newTitle} type="text" placeholder="Section Title" />
            </Form.Group>
            <Container className="d-flex px-0 pt-1 justify-content-around">
                <Button variant="outline-success" type="submit">Change</Button>
                <Button onClick={e => cancelTitleUpdate(e)} variant="outline-danger" type="button">Cancel</Button>

            </Container>
        </Form>

    );
}

export default RenameSection
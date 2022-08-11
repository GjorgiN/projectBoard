import { Form, Button, Container } from 'react-bootstrap'
import axios from 'axios';
import { useState } from 'react';


const AddNewSection = ({ setShowAddSection, showAddSection, project, setProject, baseUrl }) => {

    const [title, setTitle] = useState('');



    const cancelNewSection = (e) => {
        setTitle('');
        setShowAddSection(!showAddSection);
    }

    const checkKey = (e) => {
        e.preventDefault();
        console.log(e);
        if (e.key === 'Escape') {
            cancelNewSection(e);
        }

    }

    const addNewSection = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('user')
        const newSection = {
            orderId: project.sectionsOrder.length + 1,
            title: title,

        }
        const config = {
            headers: {
                authorization: 'Bearer ' + token
            },
            url: baseUrl + '/' + project.id + '/addsection',
            data: newSection,
            method: 'post'
        }

        axios(config)
            .then(res => {
                console.log(res.data);
                const sectionRes = res.data;
                const sectionResId = sectionRes.id;
                const newSections = { ...project.sections }
                newSections[sectionResId] = sectionRes;
                const newSectionsOrder = Array.from(project.sectionsOrder);
                newSectionsOrder.push(sectionResId.toString());

                const newProject = {
                    ...project,
                    sections: newSections,
                    sectionsOrder: newSectionsOrder,
                }


                setProject(newProject);
                setShowAddSection(!showAddSection);
            })
            .catch(error => {
                console.log(error);
            })
    }


    return (
        <Form onSubmit={(e) => addNewSection(e)} style={{ width: "18rem" }} className="mx-1 mb-2 align-items-center justify-content-center">
            <Form.Group className="my-1" controlId="sectionTitle">
                <Form.Label className="d-none">Section Title</Form.Label>
                <Form.Control required autoFocus onKeyUp={e => { checkKey(e) }} onChange={(e) => { setTitle(e.target.value) }} value={title} type="text" placeholder="Section Title" />
            </Form.Group>
            <Container className="d-flex px-0 pt-1 justify-content-around">
                <Button variant="outline-success" type="submit">Add</Button>
                <Button onClick={e => cancelNewSection(e)} variant="outline-danger" type="button">Cancel</Button>

            </Container>
        </Form>

    );


}

export default AddNewSection
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

const RenameSection = () => {
    const [newTitle, setNewTitle] = useState('');

    const cancelTitleUpdate = (e) => {
        setNewTitle('');
    }

    const checkKey = (e) => {
        e.preventDefault();
        console.log(e);
        if (e.key === 'Escape') {
            cancelTitleUpdate(e);
        }

    }



    return (
        <Form style={{ width: "18rem" }} className="mx-1 mb-2 align-items-center justify-content-center">
            <Form.Group className="my-1" controlId="sectionTitle">
                <Form.Label className="d-none">Section Title</Form.Label>
                <Form.Control onKeyUp={e => { checkKey(e) }} onChange={(e) => { setNewTitle(e.target.value) }} value={newTitle} type="text" placeholder="Section Title" />
            </Form.Group>
            <Container className="d-flex px-0 justify-content-around">
                <Button variant="outline-success" type="submit">Change</Button>
                <Button onClick={e => cancelTitleUpdate(e)} variant="outline-danger" type="button">Cancel</Button>

            </Container>
        </Form>

    );
}

export default RenameSection
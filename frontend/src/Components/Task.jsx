import { Card } from "react-bootstrap"


const Task = ({ task }) => {
    return (
        <Card className="m-1 myTask d-flex">
            <Card.Body>
                <Card.Title className="mb-2">{task.title}</Card.Title>
                <Card.Text>{task.description || 'no description'}</Card.Text>
                <Card.Text>{task.dueDate || 'no due date set'}</Card.Text>
                <Card.Text>{task.completed.toString()}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Task
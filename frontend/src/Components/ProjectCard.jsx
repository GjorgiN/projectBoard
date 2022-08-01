import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const ProjectCard = ({ title, description, projectId }) => {
    const pathToProject = `/project/${projectId}`;
    return (
        <Link style={{textDecoration: 'none'}} to={pathToProject}>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title className="mb-2">{title}</Card.Title>
                    <Card.Text>{description}</Card.Text>

                </Card.Body>
            </Card>
        </Link>
    );
}

export default ProjectCard;
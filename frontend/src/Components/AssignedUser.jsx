import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function AssignedUser() {
    return (
        <>
            <OverlayTrigger
                placement={'bottom'}
                overlay={
                    <Tooltip id={`tooltip-bottom`}>
                        Tooltip on <strong>bottom</strong>.
                    </Tooltip>
                }
            >
                <Button variant="secondary">Tooltip on bottom</Button>
            </OverlayTrigger>

        </>
    );
}

export default AssignedUser;
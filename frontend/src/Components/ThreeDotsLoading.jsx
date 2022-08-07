import { Container, Spinner } from "react-bootstrap";

const ThreeDotsLoading = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center mt-5 pt-5">
      <Spinner className="d-flex mx-2" variant="dark" animation="grow" />
      <Spinner className="d-flex mx-2" variant="dark" animation="grow" />
      <Spinner className="d-flex mx-2" variant="dark" animation="grow" />
    </Container>
  );
}

export default ThreeDotsLoading
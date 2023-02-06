import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './NavBar.css';

export default function NavBar() {
  return (
    <>
       <Navbar variant="light" bg="light" >
      <Container fluid>
        
          <Nav>
            <Button className='button' variant="outline-primary">Import File</Button>{' '}
            <Button className='button' variant="outline-primary">Export File</Button>{' '}
          </Nav>

           <Nav>
            <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button className='button' variant="outline-success">Search</Button>
                </Form>
            <Button className='button' variant="outline-primary">Create Question</Button>{' '}
            <Button className='button' variant="outline-primary">Delete Question</Button>{' '}
          </Nav>
      </Container>
    </Navbar>
    </>
  )
}
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavDropdown } from "react-bootstrap";
import "../css/NavBar.css";
import SearchResults from "./SearchResults";

//Font Awesome

export default function NavBar() {
  const tags = [
    "question_single",
    "question_article_text",
    "question_persons",
    "question_multiple",
    "question_frequency",
    "question_accommodations",
    "question_single_accommodation",
    "question_single_person",
    "question_multiple_person",
    "answer_text",
    "answer_persons",
    "answer_none",
    "answer_accommodations",
  ];
  return (
    <>
      <Navbar variant="dark" bg="dark">
        <Nav>
          <Button className="button" variant="outline-primary">
            Import File
          </Button>{" "}
          <Button className="button" variant="outline-primary">
            Export File
          </Button>{" "}
        </Nav>

        <Nav>
          <Form className="d-flex">
            <NavDropdown title="Tags" id="basic-nav-dropdown">
              {tags.map((tag) => (
                <NavDropdown.Item>
                  <span className="fa-stack fa-lg">
                    <i
                      className="fa fa-circle-thin fa-stack-2x icon-background"
                      aria-hidden="true"
                    ></i>
                    <i
                      className="fa fa-chevron-down fa-stack-1x"
                      aria-hidden="true"
                    ></i>
                  </span>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Form.Control
              type="search"
              placeholder="Search"
              className="Search"
              aria-label="Search"
            />
            <Button className="button" variant="success">
              Search
            </Button>
          </Form>
          <Button className="button" variant="primary">
            Create Question
          </Button>{" "}
          <Button className="button" variant="primary">
            Delete Question
          </Button>{" "}
        </Nav>
      </Navbar>
    </>
  );
}

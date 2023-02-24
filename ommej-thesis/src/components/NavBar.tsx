import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../css/NavBar.css";

export default function NavBar() {
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

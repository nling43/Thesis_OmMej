import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "./NavBar.css";

export default function NavBar() {
	const [selectedFile, setSelectedFile] = useState();
	const onChangeHandler = (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		if (file.type == "application/json") {
			setSelectedFile(file);
		} else {
			alert("bad file");
		}
	};
	const handleUpload = async () => {
		console.log(selectedFile);
		const data = new FormData();
		data.append("file", selectedFile);
		try {
			await axios.post("http://localhost:8000/upload", data, {}).then((res) => {
				console.log(res.status);
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Navbar variant="dark" bg="dark">
				<Container fluid>
					<Nav>
						<input type="file" name="file" onChange={onChangeHandler} />
						<Button
							className="button"
							variant="outline-primary"
							onClick={handleUpload}
						>
							Upload File
						</Button>
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
				</Container>
			</Navbar>
		</>
	);
}

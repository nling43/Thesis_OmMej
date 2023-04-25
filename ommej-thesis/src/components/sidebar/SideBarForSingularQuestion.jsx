import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Panel } from "reactflow";
import "../../css/sidebar.css";
import { shallow } from "zustand/shallow";
import useStore from "../../Store/store";

const selector = (state) => ({
	selected: state.selectedNodes,
	onNodesChange: state.onNodesChange,
	nodes: state.nodes,
	instance: state.reactFlowInstance,
});
export default function SideBarForSingularQuestion() {
	const [textValue, setTextValue] = useState("");
	const [statementTextValue, setStatementTextValue] = useState("");
	const [newTag, setNewTag] = useState("");
	const [questionType, setQuestionType] = useState("");
	const [tags, setTags] = useState([]);
	const [questionRef, setQuestionRef] = useState("");
	const [questionHeader, setQuestionHeader] = useState("");
	const [questionIncludeIf, setQuestionIncludeIf] = useState({});
	const [questionVideo, setQuestionVideo] = useState("");
	const [questionImage, setQuestionImage] = useState("");

	const { selected, instance, onNodesChange, nodes } = useStore(
		selector,
		shallow
	);
	const questionTypes = [
		"article_text",
		"accommodations",
		"persons",
		"frequency",
		"multiple",
		"multiple_person",
		"single",
		"single_accommodation",
		"single_person",
	];
	useEffect(() => {
		if (selected.nodes !== undefined && selected.nodes.length === 1) {
			setQuestionType(selected.nodes[0].data.type);
			if (selected.nodes[0].data.text !== undefined) {
				setTextValue(selected.nodes[0].data.text.sv);
			} else {
				setTextValue("");
			}
			if (selected.nodes[0].data.statementText !== undefined) {
				setStatementTextValue(selected.nodes[0].data.statementText.sv);
			} else {
				setStatementTextValue("");
			}
			if (selected.nodes[0].data.tags !== undefined) {
				setTags(selected.nodes[0].data.tags);
			} else {
				setTags([]);
			}
			if (selected.nodes[0].data.ref !== undefined) {
				setQuestionRef(selected.nodes[0].data.ref);
			} else {
				setQuestionRef("");
			}
			if (selected.nodes[0].data.header !== undefined) {
				setQuestionHeader(selected.nodes[0].data.header.sv);
			} else {
				setQuestionHeader("");
			}
			if (selected.nodes[0].data.includeIf !== undefined) {
				setQuestionIncludeIf(selected.nodes[0].data.includeIf);
				console.log(selected.nodes[0].data.includeIf);
			} else {
				setQuestionIncludeIf({});
			}
			if (selected.nodes[0].data.video !== undefined) {
				setQuestionVideo(selected.nodes[0].data.video);
			} else {
				setQuestionVideo("");
			}
			if (selected.nodes[0].data.image !== undefined) {
				setQuestionImage(selected.nodes[0].data.image);
			} else {
				setQuestionImage("");
			}
		}
	}, [selected]);
	function handleDefualt(e) {
		e.preventDefault();
	}
	function deleteTag(index, currentTags) {
		const updatedTags = [
			...currentTags.slice(0, index),
			...currentTags.slice(index + 1),
		];
		return updatedTags;
	}

	function moveToNode(id) {
		const node = nodes.find((node) => node.id === id);

		instance.setCenter(node.position.x + 450, node.position.y, {
			zoom: 0.7,
		});
	}

	function unselect() {
		const index = nodes.findIndex((node) => node.id === selected.nodes[0].id);
		nodes[index].selected = false;

		onNodesChange(nodes);
	}

	function select(id) {
		let index = nodes.findIndex((node) => node.id === selected.nodes[0].id);
		nodes[index].selected = false;
		index = nodes.findIndex((node) => node.id === id);
		nodes[index].selected = true;

		onNodesChange(nodes);
	}
	function handleAnswerClick(id) {
		moveToNode(id);
		select(id);
	}

	function handleSave() {
		const index = nodes.findIndex((node) => node.id === selected.nodes[0].id);
		nodes[index].data.text.sv = textValue;
		nodes[index].data.tags = tags;
		nodes[index].data.type = questionType;
		nodes[index].type = "question_" + questionType;
		if (statementTextValue !== "") {
			nodes[index].data.statementText = { sv: statementTextValue };
		}
		if (questionHeader !== "") {
			nodes[index].data.header = { sv: questionHeader };
		}
		if (questionRef !== "") {
			nodes[index].data.ref = questionRef;
		}
		if (questionVideo !== "") {
			nodes[index].data.video = questionVideo;
		}
		if (questionImage !== "") {
			nodes[index].data.image = questionImage;
		}
		unselect();
	}
	return (
		<Panel className="sidebar" position="top-right">
			<h5>{selected.nodes[0].id}</h5>
			<div className="sidebar_header_buttons">
				<Button variant="danger" type="cancel" onClick={() => unselect()}>
					Cancel
				</Button>
				<Button
					variant="secondary"
					key={selected.nodes[0].id}
					id={selected.nodes[0].id}
					onClick={(event) => moveToNode(event.target.id)}
				>
					Move to Question
				</Button>
				<Button variant="primary" type="save" onClick={() => handleSave()}>
					Save
				</Button>
			</div>
			<Form onSubmit={(e) => handleDefualt(e)}>
				<Form.Group className="mb-3" controlId="type">
					<Form.Label>Question Type</Form.Label>

					<Form.Select
						value={questionType}
						onChange={(event) => {
							setQuestionType(event.target.value);
						}}
					>
						{questionTypes.map((type, index) => (
							<option key={index}>{type}</option>
						))}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Question Text</Form.Label>
					<Form.Control
						as="textarea"
						rows={
							Math.ceil(textValue.length / 63) +
							textValue.split(/\r\n|\r|\n/).length
						}
						type="text"
						value={textValue}
						onChange={(e) => setTextValue(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Ref</Form.Label>
					<Form.Control
						type="text"
						value={questionRef}
						onChange={(e) => setQuestionRef(e.target.value)}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Tags</Form.Label>
					<div className="tag">
						<Form.Control
							type="text"
							placeholder="New Tag"
							value={newTag}
							onChange={(event) => setNewTag(event.target.value)}
						/>
						<Button
							className=""
							variant="primary"
							type="button"
							onClick={(event) => {
								event.preventDefault();
								setTags([newTag, ...tags]);
							}}
						>
							Add Item
						</Button>
					</div>
					{tags !== undefined ? (
						<div className="singleSidebarTags">
							{tags.map((item, index) => (
								<div key={index} className="tag">
									<p key={index}>{item}</p>
									<Button
										onClick={() => setTags(deleteTag(index, tags))}
										variant="danger"
									>
										del
									</Button>
								</div>
							))}
						</div>
					) : (
						<></>
					)}
				</Form.Group>

				<Form.Group>
					<Form.Label>Answers</Form.Label>

					{selected.nodes[0].data.answers !== undefined ? (
						<div className="singleSidebarTags">
							{Object.entries(selected.nodes[0].data.answers).map(
								([index, data]) =>
									data.type === "text" ? (
										<div key={index} className="tag">
											<p key={index}>{data.text.sv}</p>
											<Button
												onClick={(event) => handleAnswerClick(event.target.id)}
												id={index}
												variant="secondary"
											>
												Move to answer
											</Button>
										</div>
									) : (
										<div key={index} className="tag">
											<p key={index}>{data.type}</p>
											<Button
												onClick={(event) => handleAnswerClick(event.target.id)}
												id={index}
												variant="secondary"
											>
												Move to answer
											</Button>
										</div>
									)
							)}
						</div>
					) : (
						<></>
					)}
				</Form.Group>

				<Form.Group>
					<Form.Label>includeIf</Form.Label>

					{Object.keys(questionIncludeIf).length !== 0 &&
					questionIncludeIf.answers !== undefined ? (
						<div className="singleSidebarIncludeIfs">
							{questionIncludeIf.answers.map((node) => (
								<div className="tag">
									<p key={node}>{node}</p>
									<Button
										onClick={(event) => moveToNode(event.target.id)}
										id={node}
										variant="secondary"
									>
										Move to answer
									</Button>
								</div>
							))}
							<Form.Label>else</Form.Label>
							<div className="tag">
								<p>{questionIncludeIf.else}</p>
								<Button
									onClick={(event) => moveToNode(event.target.id)}
									id={questionIncludeIf.else}
									variant="secondary"
								>
									Move to answer
								</Button>
							</div>
						</div>
					) : (
						<></>
					)}
				</Form.Group>

				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Web Text</Form.Label>
					<Form.Control
						type="text"
						value={statementTextValue}
						onChange={(e) => setStatementTextValue(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Question Header</Form.Label>
					<Form.Control
						type="text"
						value={questionHeader}
						onChange={(e) => setQuestionHeader(e.target.value)}
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Question Video</Form.Label>
					<Form.Control
						type="text"
						value={questionVideo}
						onChange={(e) => setQuestionVideo(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Question Image</Form.Label>
					<Form.Control
						type="text"
						value={questionImage}
						onChange={(e) => setQuestionImage(e.target.value)}
					/>
				</Form.Group>
			</Form>
		</Panel>
	);
}

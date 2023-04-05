import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Panel } from "reactflow";
import "../css/sidebar.css";
import { shallow } from "zustand/shallow";
import useStore from "../Store/store";

const selector = (state) => ({
	selected: state.selectedNodes,
	onNodesChange: state.onNodesChange,
	nodes: state.nodes,
	instance: state.reactFlowInstance,
	questionTypes: state.questionsTypes,
});
export default function SideBarForSingularQuestion() {
	const [textValue, setTextValue] = useState("");
	const [statementTextValue, setStatementTextValue] = useState("");
	const [newTag, setNewTag] = useState("");
	const [questionType, setQuestionType] = useState("");
	const [tags, setTags] = useState([]);

	const { selected, instance, onNodesChange, nodes, questionTypes } = useStore(
		selector,
		shallow
	);

	useEffect(() => {
		if (selected.nodes != undefined && selected.nodes.length === 1) {
			setQuestionType(selected.nodes[0].data.type);
			if (selected.nodes[0].data.text != undefined) {
				setTextValue(selected.nodes[0].data.text.sv);
			} else {
				setTextValue("");
			}
			if (selected.nodes[0].data.statementText != undefined) {
				setStatementTextValue(selected.nodes[0].data.statementText.sv);
			} else {
				setStatementTextValue("");
			}
			if (selected.nodes[0].data.tags != undefined) {
				setTags(selected.nodes[0].data.tags);
			} else {
				setTags([]);
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

	function moveToNode(id, instance, nodes) {
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

	function handleSave() {
		const index = nodes.findIndex((node) => node.id === selected.nodes[0].id);
		nodes[index].data.text.sv = textValue;
		nodes[index].data.tags = tags;
		nodes[index].data.type = questionType;
		nodes[index].type = "question_" + questionType;
		if (statementTextValue != "") {
			if (nodes[index].data.statementText != undefined)
				nodes[index].data.statementText.sv = statementTextValue;
			else {
				nodes[index].data.statementText = { sv: statementTextValue };
			}
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
					onClick={(event) =>
						moveToNode(event.target.id, instance, selected.nodes)
					}
				>
					Move to node
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

				<Form.Group>
					<Form.Label>Tags</Form.Label>
					<div className="tag">
						<Form.Control
							type="text"
							placeholder="Enter new item"
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
					{tags != undefined ? (
						<div className="singleSidebarTags">
							{tags.map((item, index) => (
								<div className="tag">
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

				<Form.Group className="mb-3" controlId="text">
					<Form.Label>Statement Text</Form.Label>
					<Form.Control
						as="textarea"
						rows={
							Math.ceil(statementTextValue.length / 63) +
							statementTextValue.split(/\r\n|\r|\n/).length
						}
						type="text"
						value={statementTextValue}
						onChange={(e) => setStatementTextValue(e.target.value)}
					/>
				</Form.Group>
			</Form>
		</Panel>
	);
}

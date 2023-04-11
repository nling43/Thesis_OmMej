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
	answerTypes: state.answersTypes,
});
export default function SideBarForSingularanswer() {
	const [textValue, setTextValue] = useState("");

	const [newTag, setNewTag] = useState("");
	const [answerType, setAnswerType] = useState("");
	const [tags, setTags] = useState([]);

	const [nextQuestion, setNextQuestion] = useState({});
	const [alarm, setAlarm] = useState(false);

	const { selected, instance, onNodesChange, nodes, answerTypes } = useStore(
		selector,
		shallow
	);

	useEffect(() => {
		if (selected.nodes !== undefined && selected.nodes.length === 1) {
			setAnswerType(selected.nodes[0].data.type);
			if (selected.nodes[0].data.text !== undefined) {
				setTextValue(selected.nodes[0].data.text.sv);
			} else {
				setTextValue("");
			}

			if (selected.nodes[0].data.tags !== undefined) {
				setTags(selected.nodes[0].data.tags);
			} else {
				setTags([]);
			}
			if (selected.nodes[0].data.next !== undefined) {
				setNextQuestion(selected.nodes[0].data.next);
			} else {
				setNextQuestion({});
			}
			if (selected.nodes[0].data.alarm !== undefined) {
				setAlarm(selected.nodes[0].data.alarm);
			} else {
				setAlarm(false);
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
		nodes[index].data.type = answerType;
		nodes[index].type = "answer_" + answerType;

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
					Move to node
				</Button>
				<Button variant="primary" type="save" onClick={() => handleSave()}>
					Save
				</Button>
			</div>
			<Form onSubmit={(e) => handleDefualt(e)}>
				<Form.Group className="mb-3" controlId="type">
					<Form.Label>answer Type</Form.Label>

					<Form.Select
						value={answerType}
						onChange={(event) => {
							setAnswerType(event.target.value);
						}}
					>
						{answerTypes.map((type, index) => (
							<option key={index}>{type}</option>
						))}
					</Form.Select>
				</Form.Group>

				<Form.Group className="mb-3" controlId="text">
					<Form.Label>answer Text</Form.Label>
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
			</Form>
		</Panel>
	);
}

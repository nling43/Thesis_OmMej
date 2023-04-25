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
	edges: state.edges,
	instance: state.reactFlowInstance,
});
export default function SideBarForSingularanswer() {
	const [textValue, setTextValue] = useState("");
	const [newTag, setNewTag] = useState("");
	const [answerType, setAnswerType] = useState("");
	const [tags, setTags] = useState([]);
	const [alarm, setAlarm] = useState(false);
	const [next, setNext] = useState("");
	const { selected, instance, onNodesChange, nodes, edges } = useStore(
		selector,
		shallow
	);

	const answerTypes = ["text", "persons", "accommodations", "none"];

	useEffect(() => {
		if (selected.nodes !== undefined && selected.nodes.length === 1) {
			setAnswerType(selected.nodes[0].data.type);
			if (
				selected.nodes[0].data.text !== undefined &&
				selected.nodes[0].data.type === "text"
			) {
				setTextValue(selected.nodes[0].data.text.sv);
			} else {
				setTextValue("");
			}
			if (selected.nodes[0].data.tags !== undefined) {
				setTags(selected.nodes[0].data.tags);
			} else {
				setTags([]);
			}

			if (selected.nodes[0].data.alarm !== undefined) {
				setAlarm(selected.nodes[0].data.alarm);
			} else {
				setAlarm(false);
			}

			if (selected.nodes[0].data.next !== null) {
				setNext(selected.nodes[0].data.next);
			} else {
				setNext(null);
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
	function handleQuestionClick(id) {
		moveToNode(id);
		select(id);
	}

	function handleSave() {
		const index = nodes.findIndex((node) => node.id === selected.nodes[0].id);
		if (textValue !== "") nodes[index].data.text = { sv: textValue };
		nodes[index].data.tags = tags;
		nodes[index].data.type = answerType;
		nodes[index].type = "answer_" + answerType;
		nodes[index].data.alarm = alarm;

		const answerEgde = edges.find(
			(egde) => egde.target === selected.nodes[0].id
		);

		if (answerEgde !== undefined) {
			const questionToAnswer = nodes.find(
				(node) => node.id === answerEgde.source
			);
			if (textValue !== "") nodes[index].data.text = { sv: textValue };
			questionToAnswer.data.answers[selected.nodes[0].id].tags = tags;
			questionToAnswer.data.answers[selected.nodes[0].id].type = answerType;
			questionToAnswer.data.answers[selected.nodes[0].id].alarm = alarm;
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
					Move to Answer
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

				<Form.Group className="mb-3" controlId="alarm">
					<Form.Label>Alarm</Form.Label>

					<Form.Select
						value={alarm.toString()}
						onChange={(event) => {
							setAlarm(event.target.value === "true");
						}}
					>
						<option>{true.toString()}</option>
						<option>{false.toString()}</option>
					</Form.Select>
				</Form.Group>
				{next !== null ? (
					<Form.Group className="mb-3" controlId="next">
						<Form.Label>Question</Form.Label>
						<div className="singleSidebarIncludeIfs">
							<div className="tag">
								<p>{next}</p>
								<Button
									onClick={(event) => handleQuestionClick(event.target.id)}
									id={next}
									variant="secondary"
								>
									Move to question
								</Button>
							</div>
						</div>
					</Form.Group>
				) : (
					<></>
				)}
			</Form>
		</Panel>
	);
}

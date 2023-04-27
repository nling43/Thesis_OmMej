import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import _ from "lodash";
export default function Delete() {
	const selector = (state) => ({
		nodes: state.nodes,
		selectedNodes: state.selectedNodes,
		instance: state.reactFlowInstance,
		undo: state.undo,
		setUndoClearRedo: state.setUndoClearRedo,
	});
	const { nodes, instance, selectedNodes, undo, setUndoClearRedo } = useStore(
		selector,
		shallow
	);
	const [showDelete, setShowDelete] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	useEffect(() => {
		if (selectedNodes.nodes !== undefined) {
			setQuestions(
				selectedNodes.nodes.filter((el) => el.type.includes("question"))
			);
			setAnswers(
				selectedNodes.nodes.filter((el) => el.type.includes("answer"))
			);
		}
	}, [selectedNodes]);

	function handleDeleteNodes() {
		const edges = selectedNodes.edges;
		const newUndo = [];
		newUndo.push({
			action: "delete",
			nodes: _.cloneDeep(selectedNodes.nodes),
			edges: _.cloneDeep(selectedNodes.edges),
		});

		if (answers.length === 0 && questions.length === 0 && edges.length === 1) {
			const source = nodes.find((node) => node.id === edges[0].source);
			const target = nodes.find((node) => node.id === edges[0].target);

			if (edges[0].type === "edges_else") {
				const oldState = _.cloneDeep(source);
				source.data.includeIf.else = "";
				const newState = _.cloneDeep(source);

				newUndo.push({
					action: "modify",
					oldState: oldState,
					newState: newState,
				});
			} else if (edges[0].type === "edges_if") {
				const oldState = _.cloneDeep(target);
				target.data.includeIf.answers = target.data.includeIf.answers.filter(
					(el) => el !== edges[0].source
				);
				const newState = _.cloneDeep(target);
				newUndo.push({
					action: "modify",
					oldState: oldState,
					newState: newState,
				});
			} else if (source.type.includes("question")) {
				const oldState = _.cloneDeep(source);
				delete source.data.answers[target.id];
				const newState = _.cloneDeep(source);
				newUndo.push({
					action: "modify",
					oldState: oldState,
					newState: newState,
				});
			} else {
				//for deleting edge from answers, need to modify prev question connected to it
				const question = nodes.find(
					(question) =>
						question.data.answers && source.id in question.data.answers
				);
				if (question !== undefined) {
					const oldState = _.cloneDeep(question);
					question.data.answers[source.id].next = null;
					const newState = _.cloneDeep(question);
					newUndo.push({
						action: "modify",
						oldState: oldState,
						newState: newState,
					});
				} else {
					const oldState = _.cloneDeep(source);
					source.data.next = null;
					const newState = _.cloneDeep(source);
					newUndo.push({
						action: "modify",
						oldState: oldState,
						newState: newState,
					});
				}
			}
		}

		answers.forEach((answer) => {
			const question = nodes.find(
				(question) =>
					question.data.answers && answer.id in question.data.answers
			);
			if (
				question &&
				!selectedNodes.nodes.find((node) => node.id === question.id)
			) {
				const oldState = _.cloneDeep(question);
				delete question.data.answers[answer.id];
				const newState = _.cloneDeep(question);

				const hasQuestionBeenModified = newUndo.find(
					(obj) => obj.oldState !== undefined && obj.oldState.id === question.id
				);

				if (!hasQuestionBeenModified) {
					newUndo.push({
						action: "modify",
						oldState: oldState,
						newState: newState,
					});
				} else {
					hasQuestionBeenModified.newState = newState;
				}
			}
		});
		questions.forEach((question) => {
			const answers = nodes.filter(
				(answer) => answer.data.next && question.id === answer.data.next
			);
			for (const answer of answers) {
				if (!selectedNodes.nodes.find((node) => node.id === answer.id)) {
					const oldState = _.cloneDeep(answer);
					answer.data.next = null;
					const newState = _.cloneDeep(answer);
					const hasAnswerBeenModified = newUndo.find(
						(obj) => obj.oldState !== undefined && obj.oldState.id === answer.id
					);

					if (!hasAnswerBeenModified) {
						newUndo.push({
							action: "modify",
							oldState: oldState,
							newState: newState,
						});
					} else {
						hasAnswerBeenModified.newState = newState;
					}
				}
			}
		});
		setUndoClearRedo([...undo, newUndo]);
		instance.deleteElements(selectedNodes);
		setShowDelete(false);
	}

	return (
		<div>
			<Button
				className="button"
				variant="danger"
				disabled={
					selectedNodes === undefined ||
					selectedNodes.nodes === undefined ||
					(selectedNodes.nodes.length === 0 && selectedNodes.edges.length === 0)
				}
				onClick={() => {
					setShowDelete(true);
				}}
			>
				<FontAwesomeIcon icon={faTrashCan} />
			</Button>
			<Modal show={showDelete} onHide={() => setShowDelete(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmation</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete the selected items?
				</Modal.Body>

				<Modal.Body>
					This will delete {questions.length} questions and {answers.length}{" "}
					answers
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDelete(false)}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							handleDeleteNodes();
						}}
					>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

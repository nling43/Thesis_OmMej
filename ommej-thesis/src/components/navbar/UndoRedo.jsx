import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import _ from "lodash";

import { useEffect, useState } from "react";
import {
	faArrowRotateLeft,
	faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const selector = (state) => ({
	undo: state.undo,
	setUndo: state.setUndo,
	redo: state.redo,
	setRedo: state.setRedo,
	instance: state.reactFlowInstance,
	nodes: state.nodes,
	onNodesChange: state.onNodesChange,
});

export default function UndoRedo() {
	const { undo, setUndo, redo, setRedo, instance, nodes, onNodesChange } =
		useStore(selector, shallow);
	const [disableUndo, setDisableUndo] = useState(false);
	const [disableRedo, setDisableRedo] = useState(false);

	useEffect(() => {
		setDisableUndo(undo.length === 0);
	}, [undo]);

	useEffect(() => {
		setDisableRedo(redo.length === 0);
	}, [redo]);

	function popUndo() {
		const undoAction = undo.pop();
		setUndo([...undo]);
		return undoAction;
	}

	function popRedo() {
		const redoAction = redo.pop();
		setRedo([...redo]);
		return redoAction;
	}

	function add(nodesToAdd, edgesToAdd) {
		instance.addNodes(nodesToAdd);
		instance.addEdges(edgesToAdd);
	}

	function remove(nodesToRemove, edgesToRemove) {
		console.log(nodesToRemove);
		instance.deleteElements({ nodes: nodesToRemove, edges: edgesToRemove });
	}

	function modify(state) {
		const index = nodes.findIndex((node) => node.id === state.id);
		nodes[index].data = state.data;
		nodes[index].type = state.type;
		nodes[index].selected = true;
		nodes[index].selected = false;
		onNodesChange(nodes);
	}

	function handleUndo() {
		const undoAction = popUndo();
		setRedo([...redo, undoAction]);

		undoAction.forEach((action) => {
			switch (action.action) {
				case "delete":
					add(action.nodes, action.edges);
					break;
				case "modify":
					modify(action.oldState);
					break;
				case "add":
					remove(action.nodes, action.edges);
					break;
			}
		});
	}
	function handleRedo() {
		const redoAction = popRedo();
		setUndo([...undo, redoAction]);
		redoAction.forEach((action) => {
			switch (action.action) {
				case "delete":
					remove(action.nodes, action.edges);
					break;
				case "modify":
					modify(action.newState);
					break;
				case "add":
					add(action.nodes, action.edges);
					break;
			}
		});
	}
	return (
		<Nav>
			<Button
				className="button"
				variant="primary"
				disabled={disableUndo}
				onClick={handleUndo}
			>
				<FontAwesomeIcon icon={faArrowRotateLeft} />
			</Button>

			<Button
				className="button"
				variant="primary"
				disabled={disableRedo}
				onClick={handleRedo}
			>
				<FontAwesomeIcon icon={faArrowRotateRight} />
			</Button>
		</Nav>
	);
}

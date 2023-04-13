import { Panel } from "reactflow";

export default function SideBarAddNodes() {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Panel className="sidebar" position="top-right">
			<div className="description">
				You can drag these nodes to the pane on the right.
			</div>
			<div
				className="dndnode input"
				onDragStart={(event) => onDragStart(event, "question_single")}
				draggable
			>
				Single
			</div>
			<div
				className="dndnode"
				onDragStart={(event) => onDragStart(event, "question_article_text")}
				draggable
			>
				Article
			</div>
			<div
				className="dndnode output"
				onDragStart={(event) => onDragStart(event, "answer_text")}
				draggable
			>
				answer_text
			</div>
		</Panel>
	);
}

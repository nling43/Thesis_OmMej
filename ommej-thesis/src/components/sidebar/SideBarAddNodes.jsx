import { Panel } from "reactflow";
import "../../css/sidebar.css";
import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";
const selector = (state) => ({
	questionsTypes: state.questionsTypes,
	answersTypes: state.answersTypes,
});
export default function SideBarAddNodes() {
	const { questionsTypes, answersTypes } = useStore(selector, shallow);
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Panel className="sidebar" position="top-right">
			<h3 className="title">Questions</h3>
			<div className="addNodeGrid">
				{questionsTypes.map((type, index) => (
					<div
						key={index}
						className="addNode"
						onDragStart={(event) => onDragStart(event, "question_" + type)}
						draggable
					>
						{(type.charAt(0).toUpperCase() + type.slice(1)).replace(/_/g, " ")}
					</div>
				))}
			</div>

			<h3 className="title">Answers</h3>
			<div className="addNodeGrid">
				{answersTypes.map((type, index) => (
					<div
						key={index}
						className="addNode"
						onDragStart={(event) => onDragStart(event, "answer_" + type)}
						draggable
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</div>
				))}
			</div>
		</Panel>
	);
}

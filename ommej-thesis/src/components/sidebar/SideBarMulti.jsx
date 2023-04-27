import Button from "react-bootstrap/Button";
import { Panel } from "reactflow";
import "../../css/sidebar.css";
import { shallow } from "zustand/shallow";
import useStore from "../../Store/store";
import styled, { ThemeProvider } from "styled-components";
const selector = (state) => ({
	selected: state.selectedNodes,
	instance: state.reactFlowInstance,
	nodes: state.nodes,
});

export default function SideBarMulti() {
	const { selected, instance, nodes } = useStore(selector, shallow);

	function moveToNode(id) {
		const node = nodes.find((element) => element.id === id);
		instance.setCenter(node.position.x + 450, node.position.y, {
			zoom: 0.7,
		});
	}

	function nodeButton(node) {
		if (node.data.type.includes("article")) {
			return node.data.header !== undefined ? (
				<div className="NodeButton">
					<p className="id">{node.id}</p>
					<p className="text">{node.data.header.sv} </p>
					<p className="type">{node.data.type}</p>
					{node.data.tags !== undefined ? (
						<div className="tags">
							{node.data.tags.map((type) => (
								<p key={type}>{type}</p>
							))}
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<div className="NodeButton">
					<p className="id">{node.id}</p>
					<p className="text">{node.data.text.sv.substring(0, 60)} </p>
					<p className="type">{node.data.type}</p>
					{node.data.tags !== undefined ? (
						<div className="tags">
							{node.data.tags.map((type) => (
								<p key={type}>{type}</p>
							))}
						</div>
					) : (
						<></>
					)}
				</div>
			);
		} else if (node.type.includes("question")) {
			return (
				<div className="NodeButton">
					<p className="id">{node.id}</p>
					<p className="text">{node.data.text.sv} </p>
					<p className="type">{node.data.type}</p>
					{node.data.tags !== undefined ? (
						<div className="tags">
							{node.data.tags.map((type) => (
								<p key={type}>{type}</p>
							))}
						</div>
					) : (
						<></>
					)}
				</div>
			);
		} else {
			return (
				<div className="NodeButton">
					<p className="id">{node.id}</p>
					{node.data.text !== undefined ? (
						<p className="text">{node.data.text.sv} </p>
					) : (
						<></>
					)}
					<p className="type">{node.data.type}</p>
					{node.data.tags !== undefined ? (
						<div className="tags">
							{node.data.tags.map((type) => (
								<p key={type}>{type}</p>
							))}
						</div>
					) : (
						<></>
					)}
				</div>
			);
		}
	}
	const MultiButton = styled(Button)`
		color: ${(props) => props.color};
		--bs-btn-border-color: ${(props) => props.color};
		--bs-btn-hover-bg: ${(props) => props.color};
		--bs-btn-hover-color: black;
		--bs-btn-hover-border-color: black;
	`;
	const MultiButtonWrapper = (color, node) => {
		return (
			<MultiButton
				color={color}
				key={node.id}
				id={node.id}
				className="nodeButton"
				onClick={() => moveToNode(node.id)}
				variant="outline-primary"
			>
				{nodeButton(node)}
			</MultiButton>
		);
	};

	return (
		<Panel className="sidebar multi" position="top-right">
			{selected.nodes.map((node) => {
				switch (node.type) {
					case "question_single":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextSingle,
							node
						);
					case "question_accommodations":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextAccommodation,
							node
						);

					case "question_article_text":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextArticle,
							node
						);
					case "question_frequency":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextFrequency,
							node
						);
					case "question_multiple":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextMultiple,
							node
						);

					case "question_multiple_person":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextMultiple,
							node
						);

					case "question_persons":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextPersons,
							node
						);
					case "question_single_accommodation":
						return MultiButtonWrapper(
							(props) => props.theme.questionTextSingleAccommodation,
							node
						);
					default:
						return MultiButtonWrapper((props) => props.theme.answerBg, node);
				}
			})}
		</Panel>
	);
}

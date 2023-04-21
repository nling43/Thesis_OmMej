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

export default function SideBarForSingularEdge() {
	const { selected, instance, nodes } = useStore(selector, shallow);
	function moveToNode(id) {
		const node = nodes.find((node) => node.id === id);
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
								<p>{type}</p>
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
								<p>{type}</p>
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
								<p>{type}</p>
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
								<p>{type}</p>
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

	const firstNode = nodes.find((node) => node.id === selected.edges[0].source);
	const secondNode = nodes.find((node) => node.id === selected.edges[0].target);

	return (
		<Panel className="sidebar edges" position="top-right">
			{[firstNode, secondNode]
				.map((node, index) => {
					let title = "";
					if (index == 0) title = "Source";
					else title = "Target";

					switch (node.type) {
						case "question_single":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextSingle,
									node
								),
								title,
							};
						case "question_accommodations":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextAccommodation,
									node
								),
								title,
							};

						case "question_article_text":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextArticle,
									node
								),
								title,
							};
						case "question_frequency":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextFrequency,
									node
								),
								title,
							};
						case "question_multiple":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextMultiple,
									node
								),
								title,
							};

						case "question_multiple_person":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextMultiple,
									node
								),
								title,
							};

						case "question_persons":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextPersons,
									node
								),
								title,
							};
						case "question_single_accommodation":
							return {
								node: MultiButtonWrapper(
									(props) => props.theme.questionTextSingleAccommodation,
									node
								),
								title,
							};
						default:
							return {
								node: MultiButtonWrapper((props) => props.theme.answerBg, node),
								title,
							};
					}
				})
				.map(({ node, title }) => (
					<div key={node.id}>
						<h2>{title}</h2>
						{node}
					</div>
				))}
		</Panel>
	);
}

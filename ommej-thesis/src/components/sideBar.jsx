import useStore from "../Store/store";
import ReactFlow, { Panel } from "reactflow";
import { shallow } from "zustand/shallow";
import styled, { ThemeProvider } from "styled-components";

const selector = (state) => ({
	selected: state.selectedNodes,
});

const PanelsStyled = styled(Panel)`
	background-color: ${(props) => props.theme.panelBg};
	color: ${(props) => props.theme.panelColor};
	border: 1px solid ${(props) => props.theme.panelBorder};
	width: 400px;
	height: 100%;
	margin: 0;
`;

export function SideBar() {
	const { selected } = useStore(selector, shallow);
	if (selected.nodes && selected.nodes.length === 1) {
		return (
			<PanelsStyled position="top-right">
				<p>Node Data</p>
				<p>Node ID: {selected.nodes[0].id}</p>
				<p>Node Type: {selected.nodes[0].type}</p>
				<p>Node Text: {selected.nodes[0].data.text.sv}</p>
				<p>Node Datatype:{selected.nodes[0].data.type}</p>
			</PanelsStyled>
		);
	} else if (selected.nodes && selected.nodes.length > 1) {
		return (
			<PanelsStyled position="top-right">
				{selected.nodes.map((node) =>
					typeof node.data.text.sv !== "undefined" ? (
						<button>{node.data.text.sv}</button>
					) : (
						<button>{node.data.id}</button>
					)
				)}
			</PanelsStyled>
		);
	} else {
		console.log(selected);
		return <></>;
	}
}

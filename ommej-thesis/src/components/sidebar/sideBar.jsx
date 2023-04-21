import useStore from "../../Store/store";
import { shallow } from "zustand/shallow";
import "../../css/sidebar.css";

import SideBarForSingularQuestion from "./SideBarForSingularQuestion.jsx";
import SideBarForSingularAnswer from "./SideBarForSingularAnswer.jsx";
import SideBarMulti from "./SideBarMulti.jsx";
import SideBarForSingularEdge from "./SideBarForSingularEdge.jsx";
import SideBarAddNodes from "./SideBarAddNodes.jsx";

const selector = (state) => ({
	selected: state.selectedNodes,
	showAddNode: state.showAddNode,
});

export function SideBar() {
	const { selected, showAddNode } = useStore(selector, shallow);

	if (showAddNode) {
		return <SideBarAddNodes />;
	} else if (
		selected.nodes &&
		selected.nodes.length === 1 &&
		selected.nodes[0].type.includes("question_")
	) {
		return <SideBarForSingularQuestion />;
	} else if (selected.nodes && selected.nodes.length > 1) {
		return <SideBarMulti />;
	} else if (
		selected.nodes &&
		selected.nodes.length === 1 &&
		selected.nodes[0].type.includes("answer")
	) {
		return <SideBarForSingularAnswer />;
	} else if (selected.edges && selected.edges.length === 1) {
		return <SideBarForSingularEdge />;
	} else {
		return <></>;
	}
}

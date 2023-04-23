import React from "react";
import Flow from "./components/Flow_Test";
import NavBar from "./components/navbar/NavBar";
import DropZone from "./components/DropZone";
import { shallow } from "zustand/shallow";
import useStore from "./Store/store";

export default function App() {
	const selector = (state: any) => ({
		nodes: state.nodes,
	});
	const { nodes } = useStore(selector, shallow);
	if (nodes.length === 0) {
		return (
			<>
				<NavBar />
				<DropZone />
			</>
		);
	} else
		return (
			<>
				<NavBar />
				<Flow />
			</>
		);
}

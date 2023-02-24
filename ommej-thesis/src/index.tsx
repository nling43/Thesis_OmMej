import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Flow from "./components/Flow_Test";
import NavBar from "./components/NavBar";
import DropZone from "./components/DropZone";
import "./css/index.css";
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<>
			<NavBar />
			<DropZone />
			<Flow />
		</>
	</React.StrictMode>
);

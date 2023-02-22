import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Flow from "./Flow_Test";
import NavBar from "./NavBar";
import DropZone from "./DropZone";
import "./index.css";
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<>
			<NavBar />
			<DropZone />
		</>
	</React.StrictMode>
);

import React from "react";
import { useState } from "react";
import ReactFlow, {
  SelectionMode,
  MiniMap,
  Controls,
  useOnViewportChange,
} from "reactflow";
import { shallow } from "zustand/shallow";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "../theme";
import "reactflow/dist/style.css";
import "../css/Flow.css";
import useStore from "../Store/store";
import { SideBar } from "./sideBar.jsx";
//Question nodes design and presentation
import Single_QuestionNode from "./nodes/Question/Single_QuestionNode";
import Persons_QuestionNode from "./nodes/Question/Persons_QuestionNode";
import Article_QuestionNode from "./nodes/Question/Article_QuestionNode";
import Multiple_QuestionNode from "./nodes/Question/Multiple_QuestionNode";
import Frequency_QuestionNode from "./nodes/Question/Frequency_QuestionNode";
import Accommodation_QuestionNode from "./nodes/Question/Accommodation_QuestionNode";
import SingleAccommodation_QuestionNode from "./nodes/Question/SingleAccommodation_QuestionNode";
import SinglePersons from "./nodes/Question/SinglePersons";
import MultiplePersons from "./nodes/Question/MultiplePersons_QuestionNode";

//Answer nodes design and presentation
import AnswerNodeText from "./nodes/Answers/AnswerNodeText.jsx";
import AnswerNodePeople from "./nodes/Answers/AnswerNodePeople.jsx";
import AnswerNodeSkip from "./nodes/Answers/AnswerNodeSkip.jsx";
import AnswerNodeAccommodations from "./nodes/Answers/AnswerNodeAccommodations";

const nodeTypes = {
  //Question Types
  question_single: Single_QuestionNode,
  question_article_text: Article_QuestionNode,
  question_persons: Persons_QuestionNode,
  question_multiple: Multiple_QuestionNode,
  question_frequency: Frequency_QuestionNode,
  question_accommodations: Accommodation_QuestionNode,
  question_single_accommodation: SingleAccommodation_QuestionNode,
  question_single_person: SinglePersons,
  question_multiple_person: MultiplePersons,

  //Answer Types
  answer_text: AnswerNodeText,
  answer_persons: AnswerNodePeople,
  answer_none: AnswerNodeSkip,
  answer_accommodations: AnswerNodeAccommodations,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  selected: state.selectedNodes,
  onSelectNodes: state.onSelectNodes,
  setReactFlowInstance: state.setReactFlowInstance,
  onViewPortChange: state.onViewPortChange,
});

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};
    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }
    path {
      fill: currentColor;
    }
  }
`;
const MiniMapStyled = styled(MiniMap)`
  .react-flow__minimap {
    border: 1px solid ${(props) => props.theme.minimapBorder};
  }
`;

function Flow() {
	const [MiniMapOpen, setMiniMapOpen] = useState(false);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectNodes,
    setReactFlowInstance,
  } = useStore(selector, shallow);
  const onFlowInit = (reactFlowInstance) => {
    setReactFlowInstance(reactFlowInstance);
  };

  return (
    <div className="flow_container">
      <ThemeProvider theme={darkTheme}>
        <ReactFlow
          onInit={onFlowInit}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onSelectionChange={onSelectNodes}
          panOnScroll
          minZoom={0.05}
          maxZoom={1}
          defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
          onlyRenderVisibleElements={true}
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          panOnDrag={[1, 2]}
        >
          <ControlsStyled />
          <MiniMapStyled
            position="top-left"
            nodeColor="rgb(255,0,0)"
            maskColor="rgb(0,0,0,.1)"
            style={{
              margin: 0,
              height: MiniMapOpen ? 700 : 100,
              width: MiniMapOpen ? 100 : 100,

            }}
			onClick={() => {setMiniMapOpen(current => !current)}}
          />
          <SideBar />
        </ReactFlow>
      </ThemeProvider>
    </div>
  );
}

export default Flow;

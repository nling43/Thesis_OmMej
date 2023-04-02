import React, { memo } from "react";
import { Handle,useStore } from "reactflow";
import styled from "styled-components";
import IconAccommodationAnswer from "../../Icon/IconAnswer/IconAccommodationAnswer";

const Node = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 15px;

  background: ${(props) => props.theme.answerBg};
  color: ${(props) => props.theme.questionTextSingleAccommodation};
  border: 1px solid
    ${(props) =>
      props.selected ? props.theme.primary : props.theme.nodeBorder};

  .react-flow__handle {
    background: ${(props) => props.theme.handleInputAnswerColor};
    width: 8px;
    height: 10px;
    border: 0px solid #000;
    border-radius: 3px;
  }
`;

const NodeZoomed = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100px;
  border-radius: 15px;

  background: ${(props) => props.theme.answerBg};
  color: ${(props) => props.theme.questionTextSingleAccommodation};
  border: 1px solid
    ${(props) =>
      props.selected ? props.theme.primary : props.theme.nodeBorder};

  .react-flow__handle {
    background: ${(props) => props.theme.handleInputAnswerColor};
    width: 8px;
    height: 10px;
    border: 0px solid #000;
    border-radius: 3px;
  }
`;

const zoomSelector = (s) => s.transform[2] >= 0.5;

export default memo(({ data, selected }) => {
  const showContent = useStore(zoomSelector);
  if (showContent) {
  return (
    <Node selected={selected}>
      <Handle type="target" position="top" />
      <div>
        <IconAccommodationAnswer />
      </div>
      <Handle type="source" position="bottom" id="1"></Handle>
    </Node>
  );
}
  else{
  return (
    <NodeZoomed selected={selected}>
      <Handle type="target" position="top" />
      <div>
        <IconAccommodationAnswer zoomIn/>
      </div>
      <Handle type="source" position="bottom" id="1"></Handle>
    </NodeZoomed>
  );
  }
});

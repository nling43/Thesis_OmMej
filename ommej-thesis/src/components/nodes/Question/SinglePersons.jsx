import React, { memo } from "react";
import { Handle } from "reactflow";
import styled from "styled-components";
import IconSingleQuestion from "../../Icon/IconQuestion/IconSingleQuestion";

const Node = styled.div`
  display: flex;
  column-gap: 20px;
  padding: 10px;
  
  background: ${(props) => props.theme.questionBg};
  color: ${(props) => props.theme.questionTextMultiplePersons};
  border: 2px solid
    ${(props) =>
      props.selected ? props.theme.handleInputColor : props.theme.nodeBorder};
  .react-flow__handle {
    background: ${(props) => props.theme.handleInputColor};
    width: 13px;
    height: 10px;
    border: 0px solid #000;
    border-radius: 3px;
  }
`;

export default memo(({ data, selected }) => {
  return (
    <Node selected={selected}>
      <Handle type="target" position="top" />
      <div>
        <strong>{data.text.sv}</strong>
      </div>
	  <IconSingleQuestion />

      <Handle type="source" position="bottom" id="1"></Handle>
    </Node>
  );
});

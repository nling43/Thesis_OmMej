import React, { memo } from "react";
import { Handle } from "reactflow";
import styled from "styled-components";
import IconPeopleAnswer from "../../Icon/IconAnswer/IconSkipAnswer";

const Node = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 15px;
  border-radius: 15px;
  background: ${(props) => props.theme.answerBg};
  color: ${(props) => props.theme.answerTextPeople};
  border: 1px solid
    ${(props) =>
      props.selected ? props.theme.primary : props.theme.nodeBorder};

  .react-flow__handle {
    background: ${(props) => props.theme.handleInputColor};
    width: 8px;
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
        <IconPeopleAnswer />
      </div>
      <Handle type="source" position="bottom" id="1"></Handle>
    </Node>
  );
});

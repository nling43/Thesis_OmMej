import React, { memo } from "react";
import { Handle } from "reactflow";
import styled from "styled-components";
import IconText from "../../Icon/IconAnswer/IconTextAnswer";

const Node = styled.div`
  display: flex;
  gap: 20px;
  height: auto;
  width: auto;
  max-width: 150px;
  border-radius: 15px;
  padding: 3px 6px;
  text-align: center;
  align-items: center;
  justify-content: center;

  background: ${(props) => props.theme.answerBg};
  color: ${(props) => props.theme.answerText};

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

export default memo(({ data, selected }) => {
  return (
    <Node selected={selected}>
      <Handle type="target" position="top" style={{ width: 13 }} />
      <div>
        <IconText />
      </div>
      <div>
        <strong>{data.text.sv}</strong>
      </div>
      <Handle type="source" position="bottom" id="1"></Handle>
    </Node>
  );
});

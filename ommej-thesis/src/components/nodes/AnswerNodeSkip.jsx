import React, { memo } from 'react';
import { Handle } from 'reactflow';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons'
const Node = styled.div`
  padding: 30px 30px;
  border-radius: 200px;
  background: ${(props) => props.theme.answerBg};
  color: ${(props) => props.theme.nodeColor};
  border: 1px solid ${(props) => (props.selected ? props.theme.primary : props.theme.nodeBorder)};

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
      <Handle type="target" position="top" style={{ width:13 }}/>
      <div>
        <FontAwesomeIcon icon={faArrowDownLong} style={{ fontSize:"2rem"}}/>
      </div>
      <Handle type="source" position="bottom" id = "1" ></Handle>

    </Node>
  );
});
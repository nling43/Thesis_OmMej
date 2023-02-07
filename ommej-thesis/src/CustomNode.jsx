import React, { memo } from 'react';
import { Handle } from 'reactflow';
import styled from 'styled-components';

const Node = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${(props) => props.theme.nodeBg};
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
        <strong>{data.label}</strong>
      </div>
      <Handle type="source" position="bottom" id = "1" style={{position: 'absolute', left: '20%', background: '#d0db0b' }}/>
      <Handle type="source" position="bottom" id = "2" style={{ position: 'absolute', left: '40%', background: '#160bdb' }} />
      <Handle type="source" position="bottom" id = "3" style={{ position: 'absolute', left: '60%', background: '#ff5733 ' }}/>
      <Handle type="source" position="bottom" id = "4" style={{ position: 'absolute', left: '80%', background: ' #ff33fc '}}/>

    </Node>
  );
});

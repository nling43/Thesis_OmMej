import ReactFlow, { 
 addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  Panel,
} from 'reactflow';
import styled, { ThemeProvider } from 'styled-components';
import { darkTheme } from './theme';

import 'reactflow/dist/style.css';
import { useState, useEffect, useCallback} from 'react';
import CustomNode from './CustomNode.jsx';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const nodeTypes = {
  custom: CustomNode,
};

const start_edges = [{ id: '1-2', source: '1', target: '2' }];

const initialEdges: any[] | (() => any[]) = [];

const start_nodes = [
  {
    id: '1',
    data: { label: 'Is this good' },
    type: 'custom',
    position: { x: 500, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Question 2' },
    position: { x: 500, y: 200 },

  },
  {
    id: '5',
    type: 'custom',
    data: { label: 'Question 5' },
    position: { x: 200, y: 300 },

  },
   {
    id: '3',
    type: 'custom',
    data: { label: 'Question 3' },
    position: { x: 600, y: 300 },

  },
   {
    id: '4',
    type: 'custom',
    data: { label: 'Question 4' },
    position: { x: 300, y: 700 },

  },
];
const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
`;


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




function Flow() {
  const { height, width } = useWindowDimensions();
  const [nodes, setNodes] = useState<Node[]>(start_nodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);


  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div style={{ height: height-50,  width: width }}>
      <ThemeProvider theme={darkTheme}>
      <ReactFlowStyled 
      nodes={nodes} 
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}

      >
        <Background/>
        <ControlsStyled />
      </ReactFlowStyled>
      </ThemeProvider>
    </div>
  );
}

export default Flow;

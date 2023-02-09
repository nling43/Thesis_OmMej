import ReactFlow, { 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
  Connection,
  Node,
  Edge,
  Panel,
  MiniMap,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useEffect, useCallback} from 'react';

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

const nodeColor = (node: Node) => {
  switch (node.type) {
    case 'question':
      return 'red';
    case 'answer':
      return 'green';
    default:
      return 'blue';
  }
}

const start_edges:Edge[]= [{ id: '1-2', source: '1', target: '2' }];

const initialEdges: Edge[] | (() => any[]) = [];

const start_nodes:Node[] = [
  {
    id: "1",
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'question',
    style: { background: 'red' ,color: 'white'},
  
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
    type: 'answer',
    style: { background: 'green', color: 'white'},
  },
];

function Flow() {
  const { height, width } = useWindowDimensions();
  const [nodes, setNodes] = useState<Node[]>(start_nodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div style={{ height: height-20,  width: width-20 }}>
      <ReactFlow 
      deleteKeyCode={null}
      nodes={nodes} 
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      
      >
        
        <Background />
        <Controls />
        <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable/>
      </ReactFlow>
    </div>
  );
}

export default Flow;

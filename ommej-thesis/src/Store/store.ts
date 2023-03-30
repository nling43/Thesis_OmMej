import { create } from'zustand'
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnEdgesChange,
    OnNodesChange,
    OnConnect,
    applyEdgeChanges,
    applyNodeChanges,
    OnViewportChange,
    Viewport
    
    
} from 'reactflow';



type RFState = {
    nodes: Node[];
    edges: Edge[];
    onClear: ()=>void;
    reactFlowInstance: null,
    setReactFlowInstance: (instance:any)=> void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    selectedNodes : any; 
    onSelectNodes : (newSelectedNodes: Node[]) => void;

}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodes:{},
    reactFlowInstance:null,
    
    setReactFlowInstance:(instance: any) => set(() => ({ reactFlowInstance: instance })),
    onSelectNodes: (selected: any) => set(() => ({ selectedNodes: selected })),

    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    onClear: () => {
      set({
        nodes: applyNodeChanges([],[]),
      });
      set({
        edges: applyEdgeChanges([],[]),
      });
    },
  }));
  
  export default useStore;
  
import dagre from 'dagre';

const generateFlow = (width, height, data) => {
  const flow = new dagre.graphlib.Graph();
  flow.setGraph({
    rankdir: 'LR',
  });
  flow.setDefaultEdgeLabel(() => ({}));
  // Set nodes
  data.forEach(
    (node, index) => {
      flow.setNode(node.id, {
        width,
        height,
        ...node,
      });
    }
  );

  // Set edges
  data.forEach(
    ({ id, previous }) => {
      previous.forEach(({ stepId: previousId }) => {
        flow.setEdge(previousId, id);
      });
    }
  );

  dagre.layout(flow);
  return flow.nodes().map((i) => flow.node(i));
};

export {
  generateFlow,
};
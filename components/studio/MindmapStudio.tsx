import React, { useCallback } from 'react';
import ReactFlow, { Background, MiniMap, Controls, addEdge, useEdgesState, useNodesState, Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Central Idea' } },
];
const initialEdges: Edge[] = [];

export const MindmapStudio: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Edge | Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  const addNode = () => {
    const id = (nodes.length + 1).toString();
    setNodes(n => n.concat({ id, position: { x: Math.random() * 400, y: Math.random() * 200 }, data: { label: `Node ${id}` } }));
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Mindmaps</h2>
      <div className="mb-2">
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={addNode}>Add Node</button>
      </div>
      <div style={{ width: '100%', height: 500 }} className="rounded-lg overflow-hidden border border-slate-700">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};


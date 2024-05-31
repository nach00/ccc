// App.tsx
import React, { useCallback, useRef, useState } from "react";

import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  ControlButton,
  Controls,
  Edge,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import data from "./data.json";
import Sidebar from "./Sidebar";
import { Export } from "./Icons.tsx";
import { Analytics } from "@vercel/analytics/react";

interface NodeData {
  id: string;
  type: string;
  nodeType: string;
  label: string | undefined;
  message: string | undefined;
  intent: string | undefined;
  nextStepID: string | string[] | null;
  className: string | undefined;
}

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [suggestedNodes, setSuggestedNodes] = useState<string[]>([
    "choose_toppings",
    "done",
  ]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { dropEffect: string };
    }) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const id = event.dataTransfer.getData("application/reactflow/id");
      const type = event.dataTransfer.getData("application/reactflow/type");
      const nodeType = event.dataTransfer.getData(
        "application/reactflow/nodeType",
      );
      const message = event.dataTransfer.getData(
        "application/reactflow/message",
      );
      const intent = event.dataTransfer.getData("application/reactflow/intent");
      const nextStepID = event.dataTransfer.getData(
        "application/reactflow/nextStepID",
      );
      event.preventDefault();

      const position = reactFlowInstance
        ? reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : { x: 0, y: 0 };

      // const label = message ? message : intent ? intent : "New Node";

      const parsedNextStepID = nextStepID.includes(",")
        ? nextStepID.split(",")
        : nextStepID;

      const newNode = {
        id: `${id}-${new Date().getTime()}`,
        type: nodeType,
        data: {
          id,
          type,
          nodeType,
          label: message || intent,
          message,
          intent,
          nextStepID: parsedNextStepID,
        },
        position,
        className: nodeType,
      };

      setNodes((nds) => nds.concat(newNode));

      if (Array.isArray(parsedNextStepID)) {
        setSuggestedNodes(parsedNextStepID);
      } else {
        setSuggestedNodes([parsedNextStepID]);
      }
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    node: Node<NodeData> | null,
  ) => {
    if (node) {
      setSelectedNode(node); // No error here
      const nextStepID = node.data.nextStepID;
      if (Array.isArray(nextStepID)) {
        setSuggestedNodes(nextStepID);
      } else if (typeof nextStepID === "string") {
        setSuggestedNodes([nextStepID]);
      } else {
        setSuggestedNodes([]);
      }
    } else {
      setSelectedNode(null); // No error here
      setSuggestedNodes([]);
    }
    console.log("Selected Node ID: ", selectedNode);
    console.log("Selected Node Event: ", event);
  };

  const exportJson = () => {
    const flowData = {
      initialStepID: nodes[0].id,
      steps: nodes
        .filter((node) => node.data.message)
        .map((node) => {
          return {
            id: node.id,
            type: node.data.type,
            message: node.data.message,
            events: edges
              .filter((edge) => edge.source === node.id)
              .map((edge) => {
                const targetNode = nodes.find((n) => n.id === edge.target);
                return {
                  id: targetNode?.id ?? "",
                  type: targetNode?.data.type ?? "",
                  intent: targetNode?.data.intent ?? "",
                  nextStepID: targetNode?.id ?? "",
                };
              }),
          };
        }),
    };

    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "flow.json";
    link.href = url;
    link.click();

    toast.success("Success! JSON exported.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "toast",
    });
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={() =>
              onNodeClick({} as React.MouseEvent<Element, MouseEvent>, null)
            }
            fitView
            snapToGrid={true}
            snapGrid={[100, 100]}
          >
            <Background
              color="#0d2847"
              variant={BackgroundVariant.Dots}
              gap={50}
              size={4}
            />
          </ReactFlow>
          <Analytics />
        </div>
        <Sidebar suggestedNodes={suggestedNodes} />
        <ToastContainer />
        <Controls className="controls">
          <ControlButton onClick={exportJson}>
            <Export />
          </ControlButton>
        </Controls>
      </ReactFlowProvider>
    </div>
  );
};

const initialEdges = [
  { id: "0-1", source: "0", target: "1" },
  { id: "0-2", source: "0", target: "2" },
];

const initialNodes = [
  {
    id: "0",
    type: data[0].nodeType,
    data: {
      id: data[0].id,
      type: data[0].type,
      nodeType: data[0].nodeType,
      label: data[0].message,
      message: data[0].message,
      intent: data[0].intent,
      nextStepID: Array.isArray(data[0].nextStepID)
        ? data[0].nextStepID.filter((id): id is string => id !== null)
        : data[0].nextStepID ?? null,
    },
    position: { x: 0, y: 0 },
    className: data[0].nodeType,
  },
  {
    id: "1",
    type: data[1].nodeType,
    data: {
      id: data[1].id,
      type: data[1].type,
      nodeType: data[1].nodeType,
      label: data[1].intent,
      message: data[1].message,
      intent: data[1].intent,
      nextStepID: Array.isArray(data[1].nextStepID)
        ? data[1].nextStepID.filter((id): id is string => id !== null)
        : data[1].nextStepID ?? null,
    },
    position: { x: -100, y: 100 },
    className: data[1].nodeType,
  },
  {
    id: "2",
    type: data[2].nodeType,
    data: {
      id: data[2].id,
      type: data[2].type,
      nodeType: data[2].nodeType,
      label: data[2].intent,
      message: data[2].message,
      intent: data[2].intent,
      nextStepID: Array.isArray(data[2].nextStepID)
        ? data[2].nextStepID.filter((id): id is string => id !== null)
        : data[2].nextStepID ?? null,
    },
    position: { x: 100, y: 100 },
    className: data[2].nodeType,
  },
];

export default DnDFlow;

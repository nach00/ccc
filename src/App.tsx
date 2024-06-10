// App.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";

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
} from "reactflow";
import "reactflow/dist/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import { Export } from "./assets/Icons.tsx";
import { Analytics } from "@vercel/analytics/react";
import { initialNodes, initialEdges } from "./initialElements";
import Node from "./components/Node/Node.tsx";

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
  const nodeTypes = useMemo(() => ({ customNode: Node }), []);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (
        sourceNode &&
        targetNode &&
        isValidConnection(
          sourceNode as Node<NodeData>,
          targetNode as Node<NodeData>,
        )
      ) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        toast.error(
          'Invalid connection. Nodes with "message" type can only connect to nodes with "reply" type, and vice versa.',
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "toast",
          },
        );
      }
    },
    [nodes, setEdges],
  );

  const isValidConnection = (
    source: Node<NodeData>,
    target: Node<NodeData>,
  ): boolean => {
    return (
      (source.data.type === "message" && target.data.type === "reply") ||
      (source.data.type === "reply" && target.data.type === "message")
    );
  };

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
        type: "customNode",
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
            nodeTypes={nodeTypes}
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

export default DnDFlow;

// Node.tsx
import React from "react";
import { Message, Reply } from "../../assets/Icons.tsx";
import "./CustomNode.css";
import { Handle, Position } from "reactflow";

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

interface NodeProps {
  data: NodeData;
}

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const { type, nodeType, message, intent } = data;

  return (
    <div className={`main-node_container`}>
      {nodeType !== "input" && <Handle type="target" position={Position.Top} />}
      {nodeType !== "output" && (
        <Handle type="source" position={Position.Bottom} />
      )}
      <div className="header main-node_header">
        <div className="icon main-node_icon">
          {type === "message" ? <Message /> : <Reply />}
        </div>
        <div className="type">{type}</div>
      </div>
      <div className="content main-node_content">{message || intent}</div>
    </div>
  );
};

export default CustomNode;

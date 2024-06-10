// CustomNodeModal.tsx

import React, { useState } from "react";
import { Entry } from "../../types.ts";
import { Message, Reply } from "../../assets/Icons.tsx";
import "./CustomNodeModal.css";
import "../../assets/colors.css";

interface CustomNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customNode: Entry) => void;
}

const CustomNodeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CustomNodeModalProps) => {
  const [type, setType] = useState("message");
  const [nodeType, setNodeType] = useState("default");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const customNode: Entry = {
      id: `custom-${Date.now()}`,
      type,
      nodeType,
      message: type === "message" ? text : undefined,
      intent: type === "reply" ? text : undefined,
      nextStepID: [],
    };
    onSubmit(customNode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Custom Node</h2>
        <div className="modal-section">
          <div className="modal-label">Communication Type:</div>
          <div className="tabs">
            <div className="tab-header">
              <label
                className={`tab ${type === "message" ? "active" : ""}`}
                onClick={() => setType("message")}
              >
                <input
                  type="radio"
                  value="message"
                  checked={type === "message"}
                  onChange={() => {}}
                />
                Message
              </label>
              <label
                className={`tab ${type === "reply" ? "active" : ""}`}
                onClick={() => setType("reply")}
              >
                <input
                  type="radio"
                  value="reply"
                  checked={type === "reply"}
                  onChange={() => {}}
                />
                Reply
              </label>
            </div>
          </div>
        </div>
        <div className="modal-section">
          <div className="modal-label">Node Type:</div>
          <div className="tabs">
            <div className="tab-header">
              <label
                className={`tab ${nodeType === "input" ? "active" : ""}`}
                onClick={() => setNodeType("input")}
              >
                <input
                  type="radio"
                  value="input"
                  checked={nodeType === "input"}
                  onChange={() => {}}
                />
                Input
              </label>
              <label
                className={`tab ${nodeType === "output" ? "active" : ""}`}
                onClick={() => setNodeType("output")}
              >
                <input
                  type="radio"
                  value="output"
                  checked={nodeType === "output"}
                  onChange={() => {}}
                />
                Output
              </label>
              <label
                className={`tab ${nodeType === "default" ? "active" : ""}`}
                onClick={() => setNodeType("default")}
              >
                <input
                  type="radio"
                  value="default"
                  checked={nodeType === "default"}
                  onChange={() => {}}
                />
                Default
              </label>
            </div>
          </div>
        </div>
        <div className="modal-section">
          <div className="modal-label">Text:</div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Input custom node text here"
          />
        </div>
        <div className="node-preview">
          <div className="preview-label">Node Preview:</div>
          <div className={`sidebar-node ${nodeType}`}>
            <div className="sidebar-node_icon">
              {type === "message" ? <Message /> : <Reply />}
              {type}
            </div>
            {text}
          </div>

          <div className={`main-node_container ${nodeType}`}>
            <div className="header main-node_header">
              <div className="icon main-node_icon">
                {type === "message" ? <Message /> : <Reply />}
              </div>

              <div className="type">{type}</div>
            </div>
            <div className="content main-node_content">{text}</div>
          </div>
        </div>

        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default CustomNodeModal;

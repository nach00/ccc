// Sidebar.tsx

import React, { useEffect, useState } from "react";
import { Pizza, Reply, Message, Plus, Delete } from "../../assets/Icons.tsx";
import data from "../../data.json";
import { Entry } from "../../types";
import CustomNodeModal from "../CustomNodeModal/CustomNodeModal";
import { toast } from "react-toastify";
import "./Sidebar.css";

const Sidebar = ({ suggestedNodes }: { suggestedNodes: string[] }) => {
  const [parsedEntries, setParsedEntries] = useState<Entry[]>([]);
  const [customNodes, setCustomNodes] = useState<Entry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedNode, setDeletedNode] = useState<Entry | null>(null);

  const isSuggestedNode = (nodeId: string) => {
    if (Array.isArray(suggestedNodes)) {
      return suggestedNodes.includes(nodeId);
    } else {
      return suggestedNodes === nodeId;
    }
  };

  useEffect(() => {
    const parseEntries = (): Entry[] => {
      return data.map((entry) => {
        const { nextStepID, ...rest } = entry; // Destructure nextStepID

        const validNextStepID =
          typeof nextStepID === "string"
            ? nextStepID
            : Array.isArray(nextStepID)
              ? nextStepID
              : [];

        return {
          ...rest,
          message: rest.message || undefined, // Convert null to undefined
          intent: rest.intent || undefined, // Convert null to undefined
          nextStepID: validNextStepID,
        };
      });
    };

    const parsedData = parseEntries();
    setParsedEntries(parsedData);
  }, []);

  const getIconComponent = (nodeType: string) => {
    switch (nodeType) {
      case "message":
        return <Message />;
      case "reply":
        return <Reply />;
      // Add more cases for additional node types
      default:
        return null;
    }
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string,
    type: string,
    nodeType: string,
    message: string | undefined,
    intent: string | undefined,
    nextStepID: string | string[],
  ) => {
    event.dataTransfer.setData("application/reactflow/id", id);
    event.dataTransfer.setData("application/reactflow/type", type);
    event.dataTransfer.setData("application/reactflow/nodeType", nodeType);
    event.dataTransfer.setData("application/reactflow/message", message || "");
    event.dataTransfer.setData("application/reactflow/intent", intent || "");
    event.dataTransfer.setData(
      "application/reactflow/nextStepID",
      Array.isArray(nextStepID) ? nextStepID.join(",") : nextStepID,
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCustomNodeSubmit = (customNode: Entry) => {
    setCustomNodes([...customNodes, customNode]);
  };

  const deleteCustomNode = (nodeId: string) => {
    const deletedNode = customNodes.find((node) => node.id === nodeId);
    setCustomNodes(customNodes.filter((node) => node.id !== nodeId));
    setDeletedNode(deletedNode || null);
    toast.info("Node deleted. Click here to Undo", {
      onClick: undoDeleteNode,
    });
  };

  const undoDeleteNode = () => {
    if (deletedNode) {
      setCustomNodes([...customNodes, deletedNode]);
      setDeletedNode(null);
    }
  };

  return (
    <aside>
      <div className="pizza-icon">
        <Pizza />
      </div>

      <div className="title">Pizza Order Flow Builder</div>
      {/*<div className="description">*/}
      {/*  Drag these nodes to the pane on the right to build your flow.*/}
      {/*</div>*/}

      {/*<div className="description">Notes:</div>*/}

      <div className="description">
        The custom nodes are not saved. If you refresh the page, they will
        disappear.
      </div>

      <div className="description">
        "Message" nodes cannot connect to other "Message" nodes, and "Reply"
        nodes cannot connect to other "Reply" nodes.
      </div>

      <div>
        {parsedEntries.map((entry, index) => (
          <div key={index}>
            {(entry.message || entry.intent) && (
              <div
                className={`sidebar-node ${entry.nodeType} ${isSuggestedNode(entry.id) ? "suggested" : ""}`}
                onDragStart={(event) =>
                  onDragStart(
                    event,
                    entry.id,
                    entry.type,
                    entry.nodeType,
                    entry.message,
                    entry.intent,
                    entry.nextStepID,
                  )
                }
                draggable
              >
                <div className="sidebar-node_icon">
                  {getIconComponent(entry.type)}
                  {entry.type}
                </div>

                {entry.message || entry.intent}
              </div>
            )}
          </div>
        ))}

        {customNodes.map((customNode, index) => (
          <div key={index}>
            <div
              className={`sidebar-node ${customNode.nodeType}`}
              onDragStart={(event) =>
                onDragStart(
                  event,
                  customNode.id,
                  customNode.type,
                  customNode.nodeType,
                  customNode.message,
                  customNode.intent,
                  customNode.nextStepID,
                )
              }
              draggable
            >
              <div className="sidebar-node_icon">
                {getIconComponent(customNode.type)}
                {customNode.type}
              </div>
              {customNode.message || customNode.intent}
            </div>
            <div
              className="delete-icon"
              onClick={() => deleteCustomNode(customNode.id)}
            >
              <Delete />
            </div>
          </div>
        ))}
      </div>

      <div className={`sidebar-node custom`} onClick={openModal}>
        <div className="sidebar-node_icon">
          <Plus />
          Add
        </div>
        New Custom Node
      </div>

      <CustomNodeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCustomNodeSubmit}
      />
    </aside>
  );
};

export default Sidebar;

// Sidebar.tsx

import React, { useEffect, useState } from "react";
import { Pizza } from "./Icons.tsx";
import data from "./data.json";
import { Entry } from "./types.ts";

const Sidebar = ({ suggestedNodes }: { suggestedNodes: string[] }) => {
  const [parsedEntries, setParsedEntries] = useState<Entry[]>([]);
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
        // Perform any parsing or processing needed for each entry here
        const { nextStepID, ...rest } = entry; // Destructure nextStepID

        // Type guard to ensure nextStepID is either a string or an array of strings
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

  return (
    <aside>
      <div className="pizza-icon">
        <Pizza />
      </div>

      <div className="title">Pizza Order Flow Builder</div>
      <div className="description">
        Drag these nodes to the pane on the right to build your flow.
      </div>

      <div>
        {parsedEntries.map((entry, index) => (
          <div key={index}>
            {(entry.message || entry.intent) && (
              <div
                className={`dndnode ${entry.nodeType} ${isSuggestedNode(entry.id) ? "suggested" : ""}`}
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
                {entry.message || entry.intent}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

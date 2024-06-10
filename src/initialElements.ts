import data from "./data.json";

export const initialEdges = [
  { id: "0-1", source: "0", target: "1" },
  { id: "0-2", source: "0", target: "2" },
];

export const initialNodes = [
  {
    id: "0",
    type: "customNode",
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
    type: "customNode",
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
    type: "customNode",
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

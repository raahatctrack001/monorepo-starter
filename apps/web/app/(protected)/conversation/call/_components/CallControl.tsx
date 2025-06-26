import React from "react";

type Props = {
  onStart: () => void;
  onEnd: () => void;
};

export const CallControls: React.FC<Props> = ({ onStart, onEnd }) => {
  return (
    <div className="flex gap-4">
      <button onClick={onStart} className="bg-green-500 p-2 rounded text-white">Start Call</button>
      <button onClick={onEnd} className="bg-red-500 p-2 rounded text-white">End Call</button>
    </div>
  );
};

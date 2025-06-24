export const safeSend = (ws: WebSocket | null, data: any) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket not open. Skipping message.");
  }
};
// make changes and do push it to the repo
import io from "socket.io-client";
let socket;

export const initiateSocket = (projectId) => {
  socket = io("http://localhost:5000");
  console.log(`Connecting socket...`);
  if (socket && projectId) socket.emit("join", projectId);
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const subscribeToReloadProject = (getProject) => {
  if (!socket) return true;
  socket.on("reload project", () => {
    console.log("Socket: Reload Project");
    getProject();
  });
};

export const NotifyProjectChange = () => {
  if (socket) socket.emit("project change");
};

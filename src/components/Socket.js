import io from "socket.io-client";
let socket;

export const initiateSocket = (projectId) => {
  socket = io("http://localhost:8008");
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

export const subscribeToLoadNewCmt = (loadNewCmt) => {
  if (!socket) return true;
  socket.on("load new comment", (newCmt) => {
    loadNewCmt(newCmt);
  });
};

export const NotifyProjectChange = (notificationInfo) => {
  if (socket) {
    if (notificationInfo && notificationInfo.type && notificationInfo.type === 'add') {
      socket.emit("project change", notificationInfo);
    } else {
      socket.emit("project change");
    }
  }
};

export const NotifyNewComment = (newCmt) => {
  if (socket) socket.emit("new comment", newCmt);
};

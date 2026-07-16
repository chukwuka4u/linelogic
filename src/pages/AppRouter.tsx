import React from "react";
import { Routes, Route } from "react-router";
import AppShell from "./AppShell";
import HomePage from "./pages/HomePage";
import ManageQueuesPage from "./pages/ManageQueuesPage";
import AttendQueuePage from "./pages/AttendQueuePage";
import CreateQueuePage from "./pages/CreateQueuePage";
import JoinedQueuesPage from "./pages/JoinedQueuesPage";

export default function AppRouter(): React.JSX.Element {
  return (
      <Routes>
        <Route element={<AppShell />}>
          <Route path="home" element={<HomePage />} />
          <Route path="manage" element={<ManageQueuesPage />} />
          <Route path="manage/:queueId" element={<AttendQueuePage />} />
          <Route path="create" element={<CreateQueuePage />} />
          <Route path="joined" element={<JoinedQueuesPage />} />
        </Route>
      </Routes>
  );
}
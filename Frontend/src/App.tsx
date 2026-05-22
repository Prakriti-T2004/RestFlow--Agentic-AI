import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/AgentFlow";
import Login from "./Pages/LandingPage/login";
import SignupPage from "./Pages/LandingPage/signup";
import Dashboard from "./Pages/Dashboard/Dashboard";
import NewSession from "./Pages/Dashboard/NewSession";
import SessionDetail from "./Pages/Dashboard/SessionDetail";
import TaskSessionPage from "./Pages/Dashboard/TaskSessionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/new-session" element={<NewSession />} />
      <Route path="/dashboard/session/:id" element={<SessionDetail />} />
      <Route path="/dashboard/tasks/:id" element={<TaskSessionPage />} />
    </Routes>
  );
}

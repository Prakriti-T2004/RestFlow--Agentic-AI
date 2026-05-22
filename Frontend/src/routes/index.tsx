import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../Pages/LandingPage/AgentFlow";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

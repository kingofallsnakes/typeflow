import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/practice")({
  component: () => <Outlet />,
});

export function usePracticeSeed(): number {
  const key = useRouterState({ select: (state) => state.location.pathname });
  return key.length;
}

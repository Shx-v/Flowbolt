import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { CommonLayout as Layout } from "@/Layout/CommonLayout";
import Loader from "@/Component/Loader";

const SecondPage = lazy(() => import("@/Page/DummyPages/Page2"));

const DashboardPage = lazy(() => import("@/Page/Dashboard/Dashboard"));

const ProjectPage = lazy(() => import("@/Page/Project/Project"));
const ProjectDetailsPage = lazy(() => import("@/Page/Project/ProjectDetails"));

const TicketPage = lazy(() => import("@/Page/Ticket/Ticket"));
const TicketDetailsPage = lazy(() => import("@/Page/Ticket/TicketDetails"));

export const commmonRoutes = [
  {
    element: (
      <Layout>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </Layout>
    ),
    path: "*",
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "project",
        children: [
          {
            index: true,
            element: <ProjectPage />,
          },
          {
            path: ":projectId",
            element: <ProjectDetailsPage />,
          },
        ],
      },
      {
        path: "ticket",
        children: [
          {
            index: true,
            element: <TicketPage />,
          },
          {
            path: ":ticketId",
            element: <TicketDetailsPage />,
          },
        ],
      },
      {
        path: "profile",
        element: <SecondPage />,
      },
      {
        path: "settings",
        element: <SecondPage />,
      },
      {
        path: "account",
        element: <SecondPage />,
      },
    ],
  },
];

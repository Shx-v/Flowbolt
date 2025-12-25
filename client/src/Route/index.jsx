import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "@/Component/Loader";
import NotFoundPage from "../Page/UtilPages/NotFoundPage";
import { authRoutes } from "./authRoutes";
import { commmonRoutes } from "./commonRoutes";

export const routes = [
  {
    element: (
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    ),
    path: "*",
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  ...authRoutes,
  ...commmonRoutes,
];

import { Navigate, useRoutes } from "react-router-dom";
import Device from "./birdbox/pages/Device";
import Login from "./birdbox/pages/Login";
import { useAuth } from "./customContextProvider/AuthProvider";
import ForgetPassword from "./birdbox/pages/ForgetPassword";
import ChangePassword from "./birdbox/pages/ChangePassword";
import Media from "./birdbox/pages/Media";
import Page404 from "./birdbox/pages/Page404";
import AuthLayout from "./birdbox/layout/AuthLayout";
import UnAuthLayout from "./birdbox/layout/UnAuthLayout";
import Dashboard from "./birdbox/pages/Dashboard";

export const useAuthCheck = () => {
  const { sessionUserData } = useAuth();
  return {
    isAuthenticated: !!sessionUserData,
    sessionUserData,
  };
};

// ----------------------------------------------------------------------

export default function Router() {
  const { isAuthenticated } = useAuthCheck();

  return useRoutes([
    {
      path: "/dashboard",
      element: isAuthenticated ? (
        <AuthLayout />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <Navigate to="/dashboard/birdbox" replace /> },

        { path: "birdbox", element: <Dashboard /> },
        { path: "device", element: <Device /> },
        { path: "media", element: <Media /> },
      ],
    },
    {
      path: "/",
      element: <UnAuthLayout />,
      children: [
        {
          path: "login",
          element: isAuthenticated ? (
            <Navigate to="/dashboard/birdbox" replace />
          ) : (
            <Login />
          ),
        },
        {
          path: "forgot_password",
          element: <ForgetPassword />,
        },
        {
          path: "404",
          element: <Page404 />,
        },
        {
          path: "/",
          element: isAuthenticated ? (
            <Navigate to="/dashboard/birdbox" replace />
          ) : (
            <Navigate to="/login" replace />
          ),
        },
        {
          path: "*",
          element: <Navigate to="/404" />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  // return useRoutes([
  //   isAuthenticated
  //     ? {
  //         path: "/dashboard",
  //         element: <AuthLayout />,
  //         children: [
  //           { index: true, element: <Navigate to="birdbox" replace /> }, // Redirect /dashboard to /dashboard/birdbox
  //           { path: "birdbox", element: <Dashboard /> }, // Birdbox dashboard
  //           { path: "device", element: <Device /> },
  //           { path: "media", element: <Media /> },
  //           { path: "404", element: <Page404 /> },
  //           { path: "*", element: <Navigate to="/dashboard/404" replace /> },
  //         ],
  //       }
  //     : {
  //         path: "/login",
  //         element: <UnAuthLayout />,
  //         children: [
  //           { index: true, element: <Navigate to="/login" replace /> },
  //           { path: "login", element: <Login /> },
  //           { path: "forgot_password", element: <ForgetPassword /> },
  //           { path: "change_password/:otp", element: <ChangePassword /> },
  //           { path: "404", element: <Page404 /> },
  //           { path: "*", element: <Navigate to="/404" replace /> },
  //         ],
  //       },
  // ]);
}

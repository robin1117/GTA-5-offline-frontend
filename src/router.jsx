import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import ErrorPage from "./components/ErrorPage";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);

export default function router() {
  return <RouterProvider router={routers} />;
}

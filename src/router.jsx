import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1>Error A geya</h1>,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);

export default function router() {
  return <RouterProvider router={routers} />;
}

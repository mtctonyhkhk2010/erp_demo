import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./index.css";

import Root from "./routes/root";
import ErrorPage from "./error-page";
import CustomerList from "./routes/CustomerList";
import CustomerForm from "./routes/CustomerForm.jsx";
import CompanyList from "./routes/CompanyList.jsx";
import CompanyForm from "./routes/CompanyForm.jsx";
import CustomerDetail from "./routes/CustomerDetail.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "customers",
                element: <CustomerList />,
            },
            {
                path: "customers/create",
                element: <CustomerForm />,
            },
            {
                path: "customers/:customerId",
                element: <CustomerDetail />,
            },
            {
                path: "customers/:customerId/edit",
                element: <CustomerForm />,
            },
            {
                path: "companies",
                element: <CompanyList />,
            },
            {
                path: "companies/create",
                element: <CompanyForm />,
            },
            {
                path: "companies/:companyId",
                element: <CompanyForm />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
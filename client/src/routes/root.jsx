import {Link, Outlet, useLocation} from "react-router-dom";
import Header from "../components/Header.jsx";
import {useState} from "react";

export default function Root() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const updateSidebarOpen = (newState) => {
        setSidebarOpen(newState);
    };

    const activeClassName = 'flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-700 bg-opacity-25';
    const inactiveClassName = 'flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100';

    return (
        <>
            <div className="flex h-screen bg-gray-200 font-roboto">
                <div onClick={() => setSidebarOpen(false)} className={(sidebarOpen ? 'block' : 'hidden') + " fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"}></div>

                <div className={(sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in') + " fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"}>
                <div className="flex items-center justify-center mt-8">
                    <div className="flex items-center">
                        <span className="mx-2 text-2xl font-semibold text-white">ERP DEMO</span>
                    </div>
                </div>
    
                <nav className="mt-10">
                    <Link className={useLocation().pathname.includes('companies') ? activeClassName : inactiveClassName} to={`/companies`}>Companies</Link>
                    <Link className={useLocation().pathname.includes('customers') ? activeClassName : inactiveClassName} to={`/customers`}>Customers</Link>
                </nav>
            </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header updateSidebarOpen={updateSidebarOpen}></Header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                        <div className="container mx-auto px-6 py-8">
                            <Outlet/>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
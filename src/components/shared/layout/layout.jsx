import React from "react";
import Header from "../header/header";
import './layout.scss';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
                <main className="layout_content">
                    {children}
                </main>
        </div>
    );
};

export default Layout;
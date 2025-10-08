import React from "react";
import { NavLink } from "react-router-dom";
import "./Menu.css";
const Menu = () => {
    return (
        <header className="app-header">
            <nav className="menu">
                <NavLink to="/" end>
                    Categorias
                </NavLink>
                <NavLink to="/products">
                    Produtos
                </NavLink>
            </nav>
        </header>
    );
};

export default Menu;


import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Layout() {
  return <><NavBar /><main className="flex-grow-1"><Outlet /></main><Footer /></>;
}

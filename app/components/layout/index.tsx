"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Provider } from "react-redux";
import { store } from "@/store/store";


interface LayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout( { children }: LayoutProps ) {
    return (
        <Provider store={store}>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </Provider>
    );
}
import Navbar from "./Navbar";
import Footer from "./Footer";


interface LayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout( { children }: LayoutProps ) {
    return (
        <>
            <Navbar />
                <main>
                    {children}
                </main>
            <Footer />
        </>
    );
}
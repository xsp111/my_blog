
import HomeLayout from "../_components/layout";




export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <HomeLayout>
                {children}
        </HomeLayout>
    );
}
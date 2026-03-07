import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <p className="text-lg mb-6">The page you are looking for does not exist.</p>
            <Link href="/">
                <Button>Go Back</Button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
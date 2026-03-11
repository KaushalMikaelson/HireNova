import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Quiz from "../component/quiz";


const MockInterviewPage = () => {
    return (
        <div className="conatiner mx-auto space-y-4 py-6">
            <div className="flex flex-col space-y-2 mx-2">
                <Link href="/interview">
                    <Button variant="link" className="gap-2 pl-0">
                        <ArrowLeft className="w-6 h-6" />
                        Back to Interview Preparation
                    </Button>
                </Link>

                <div>
                    <h1 className="text-6xl font-bold gradient-title">Mock Interview</h1>
                    <p className=" text-muted-foreground">Take a mock interview to test your skills and prepare for your next job interview. Take Your Mock Interview Now!</p>
                </div>
            </div>

            <Quiz />
        </div>
    );
};

export default MockInterviewPage;

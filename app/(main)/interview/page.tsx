import { getAssessments } from "@/actions/interview";

const InterviewPage = async () => {

    const assessments = await getAssessments();
    return (
        <div>
            <h1 className="text-6xl font-bold gradient-title mb-5">
                Interview Preparation
            </h1>

            <div>
                <StatsCards assessments={assessments} />
                <PerformanceChart assessments={assessments} />
                <QuizList assessments={assessments} />
            </div>
        </div>
    );
};

export default InterviewPage;
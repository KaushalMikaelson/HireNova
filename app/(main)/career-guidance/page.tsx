import { getUserCareerProfile } from "@/actions/career-guidance";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import CareerGuidanceView from "./_components/career-guidance-view";

const CareerGuidancePage = async () => {
    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
        redirect("/onboarding");
    }

    const user = await getUserCareerProfile();

    return (
        <div className="container mx-auto">
            <CareerGuidanceView user={user} />
        </div>
    );
};

export default CareerGuidancePage;

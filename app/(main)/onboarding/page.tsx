import OnboardingForm from "./_components/onboarding-form";
import { industries } from "@/data/industries";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const OnboardingPage = async ({ searchParams }: { searchParams: Promise<{ force?: string }> }) => {
    const { isOnboarded } = await getUserOnboardingStatus();
    const params = await searchParams;

    if (isOnboarded && params.force !== "true") {
        redirect("/dashboard");
    }

    return (
        <main>
            <OnboardingForm industries={industries} />
        </main>
    );
};

export default OnboardingPage;

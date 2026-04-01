import { getCoverLetter } from "@/actions/cover-letter";
import { notFound } from "next/navigation";
import CoverLetterEditor from "../_components/cover-letter-editor";

const CoverLetterPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    
    let initialData = null;
    if (id !== "new") {
        initialData = await getCoverLetter(id);
        if (!initialData) notFound();
    }

    return (
        <div className="container mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CoverLetterEditor initialData={initialData} />
        </div>
    );
};

export default CoverLetterPage;
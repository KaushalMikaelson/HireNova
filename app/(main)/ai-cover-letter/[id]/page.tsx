const CoverLetterPage = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    return (
        <div>
            CoverLetter: {id}
        </div>
    );
};

export default CoverLetterPage;
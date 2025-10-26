interface Props {
  params: Promise<{ executionId: string }>;
}

async function page({ params }: Props) {
  const { executionId } = await params;

  return (
    <div>
      <h1>Execution Id: {executionId}</h1>
    </div>
  );
}

export default page;

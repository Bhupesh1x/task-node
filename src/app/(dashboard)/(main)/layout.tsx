import { AppHeader } from "@/components/AppHeader";

interface Props {
  children: React.ReactNode;
}

function mainLayout({ children }: Props) {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}

export default mainLayout;

import { SidebarTrigger } from "./ui/sidebar";

export function AppHeader() {
  return (
    <header className="h-14 bg-background border-b px-4 flex items-center shrink-0 gap-2">
      <SidebarTrigger />
    </header>
  );
}

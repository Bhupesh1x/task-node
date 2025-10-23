import { Button } from "@/components/ui/button";
import { Client } from "./client";

function Home() {
  return (
    <div className="p-2">
      <h1 className="text-red-500">Home Page</h1>
      <Button>Click me!</Button>
      <Client />
    </div>
  );
}

export default Home;

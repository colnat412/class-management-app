import { Button, Input } from "@/components/ui";
import { ThemeToggle } from "@/components/ui/theme-toggle";


export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold">Shadcn UI with Tailwind & Dark Mode</h1>
          <ThemeToggle /> 
          <Button></Button>
          <Input></Input>
      </div>
    </div>
  );
}
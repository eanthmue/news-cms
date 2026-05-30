import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function TestComponentsPage() {
  return (
    <div className="container mx-auto space-y-8 p-8">
      <h1 className="text-3xl font-bold text-black dark:text-white">Component Test Page</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">Inputs</h2>
        <div className="max-w-sm space-y-4">
          <Input placeholder="Default Input" />
          <Input type="email" placeholder="Email Input" />
          <Input disabled placeholder="Disabled Input" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-black dark:text-white">Cards</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>This is a card description.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-zinc-400">This is the card content area.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Action</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}

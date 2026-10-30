
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200 text-base-content p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CSR Coach AI</h1>
        <ThemeToggle />
      </div>

      <div className="card bg-base-100 shadow-xl mt-10 max-w-lg">
        <div className="card-body">
          <h2 className="card-title">Theme Testing</h2>
          <p>
            If this card changes appearance when you toggle the theme,
            DaisyUI and Next Themes are connected successfully.
          </p>
          <button className="btn btn-primary">
            Test Button
          </button>
        </div>
      </div>
    </main>
  );
}

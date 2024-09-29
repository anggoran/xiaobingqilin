export default function Home() {
  return (
    <div className="h-screen content-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-xl underline font-bold">Home</p>
        <nav className="flex flex-col">
          <ol className="space-y-2">
            {[
              "/listening",
              "/reading",
              "/writing",
              "/hanzi",
              "/word",
            ].map((e) => (
              <li>
                <a
                  className="bg-black text-white py-1 px-2 rounded-md"
                  href={e}
                >
                  {e}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

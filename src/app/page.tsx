import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-light tracking-tight">
          InVhoice
        </Link>
        
        <nav className="hidden md:flex items-center gap-12">
          <Link href="#features" className="text-base hover:text-gray-600 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-base hover:text-gray-600 transition-colors">
            Pricing
          </Link>
          <Link href="#about" className="text-base hover:text-gray-600 transition-colors">
            About
          </Link>
        </nav>

        <Link 
          href="/signup"
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          Sign up
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-8 py-32 max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center mb-6">
            <span className="px-4 py-2 rounded-full text-xs font-medium backdrop-blur-xl bg-white/30 border border-white/40 text-gray-900 whitespace-nowrap mb-6 shadow-lg">
            On Development
            </span>
          <h1 className="text-6xl md:text-6xl font-normal tracking-tight">
            Professional Invoices Made Simple
          </h1>
        </div>
        
        <p className="text-2xl text-gray-600 mb-12 max-w-2xl">
          No templates to wrestle with. No complicated software.<br />
          Just clean, professional invoices in under a minute.
        </p>

        <Link 
          href="/create"
          className="bg-black text-white px-8 py-4 rounded-xl text-base hover:bg-gray-800 transition-colors"
        >
          Create Your Invoice Now
        </Link>
      </main>
    </div>
  );
}
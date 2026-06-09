import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-900">
          STNK Jasa
        </Link>
        <nav className="flex items-center gap-4">
          <a href="#about" className="text-sm text-slate-600 hover:text-slate-900">
            About
          </a>
          <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900">
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}

import { Link } from "react-router-dom";

import { IMAGES } from "../../constants";

// Page frame for the advertisers' pages: logo bar, optional sign-out, centred content.
const ClientShell = ({ email, onSignOut, children }) => (
  <div className="min-h-screen bg-[#F4FAF5]">
    <header className="border-b border-[#D6FADB] bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/advertisers" className="flex items-center gap-3">
          <img src={IMAGES.logo} alt="Lara's Kitchen" className="h-10 object-contain" />
          <span className="hidden text-sm font-semibold text-[#1F5226] sm:inline">Ads</span>
        </Link>
        {onSignOut && (
          <div className="flex min-w-0 items-center gap-3 text-sm">
            {email && <span className="hidden truncate text-gray-500 sm:inline">{email}</span>}
            <button
              type="button"
              onClick={onSignOut}
              className="font-semibold whitespace-nowrap text-[#157F3B] hover:underline"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
  </div>
);

export default ClientShell;

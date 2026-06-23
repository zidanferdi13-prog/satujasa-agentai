export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-gutter px-margin-desktop py-16 max-w-container-max mx-auto">
        {/* Brand */}
        <div className="col-span-2">
          <div className="text-headline-md font-headline-md font-bold text-primary mb-6">
            STNK SatuJasa
          </div>
          <p className="text-on-surface-variant text-sm max-w-xs mb-8">
            Pionir solusi digital manajemen biro jasa surat kendaraan bermotor di Indonesia.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary hover:scale-110 transition-transform cursor-pointer">
              public
            </span>
            <span className="material-symbols-outlined text-primary hover:scale-110 transition-transform cursor-pointer">
              smartphone
            </span>
            <span className="material-symbols-outlined text-primary hover:scale-110 transition-transform cursor-pointer">
              alternate_email
            </span>
          </div>
        </div>

        {/* Product */}
        <div>
          <h5 className="font-bold mb-6">Product</h5>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li>
              <a className="hover:text-primary transition-colors" href="#">Features</a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">Pricing</a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">Updates</a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="font-bold mb-6">Company</h5>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li>
              <a className="hover:text-primary transition-colors" href="#">About</a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">Contact</a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">Careers</a>
            </li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="col-span-2">
          <h5 className="font-bold mb-6">Subscribe</h5>
          <p className="text-sm text-on-surface-variant mb-4">
            Dapatkan tips manajemen bisnis langsung di email Anda.
          </p>
          <div className="flex gap-2">
            <input
              className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Email Anda"
              type="email"
            />
            <button className="bg-primary text-on-primary p-2 rounded-xl">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/10 py-8 text-center text-label-sm text-on-surface-variant">
        © 2024 STNK SatuJasa. All rights reserved.
      </div>
    </footer>
  );
}

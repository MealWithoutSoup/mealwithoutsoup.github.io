export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email', href: '#' },
  ]

  return (
    <footer className="w-full border-t border-border-light dark:border-border-dark mt-auto">
      <div className="w-full lg:w-[70%] max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          &copy; {currentYear} Jae Hong Kim. All rights reserved.
        </p>
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <span className="brand__name">TodoFlow</span>
          <span className="brand__tagline">Calm task management</span>
        </div>

        <button
          type="button"
          className="theme-toggle"
          aria-label="Theme toggle coming soon"
          title="Theme toggle coming soon"
          disabled
        >
          Theme
        </button>
      </div>
    </header>
  );
}

export default Header;

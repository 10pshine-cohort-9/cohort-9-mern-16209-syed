export default function SearchBar({
  search,
  setSearch,
  noteCount,
}) {
  return (
    <section className="search-section">

      <div className="search-area">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          className="search-input"
          placeholder="Search by title or content..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>

      <p className="notes-count">
        {noteCount}
      </p>

    </section>
  );
}
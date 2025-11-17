import { CharacterCard } from '../components/CharacterCard'
import { EmptyState } from '../components/EmptyState'
import { useCharactersListViewModel } from '../viewmodels/useCharactersListViewModel'

export const CharactersListPage = () => {
  const {
    search,
    handleSearchChange,
    characters,
    loading,
    error,
    pagination,
    goToNextPage,
    goToPreviousPage,
    isEmpty,
  } = useCharactersListViewModel()

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Discover</p>
          <h1>Characters List</h1>
          <p className="page__description">
            Temukan karakter favoritmu dan lihat detail lengkapnya.
          </p>
        </div>

        <label className="field">
          <span className="field__label">Cari karakter</span>
          <input
            type="search"
            placeholder="Cari berdasarkan nama..."
            value={search}
            onChange={handleSearchChange}
          />
        </label>
      </header>

      {error && (
        <EmptyState
          title="Gagal memuat karakter."
          description="Silakan coba ulang beberapa saat lagi."
        />
      )}

      <div className="character-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            id={character.id}
            name={character.name}
            status={character.status}
            species={character.species}
            locationName={character.location?.name}
            image={character.image}
            to={`/characters/${character.id}`}
          />
        ))}
      </div>

      {loading && (
        <p role="status" className="page__helper">
          Memuat karakter...
        </p>
      )}

      {isEmpty && !error && (
        <EmptyState
          title="Karakter tidak ditemukan."
          description="Coba kata kunci lainnya."
        />
      )}

      <footer className="pagination">
        <button
          type="button"
          disabled={!pagination.hasPrev || loading}
          onClick={goToPreviousPage}
        >
          Sebelumnya
        </button>
        <p>
          Halaman {pagination.page}
          {pagination.totalPages ? ` dari ${pagination.totalPages}` : ''}
        </p>
        <button
          type="button"
          disabled={!pagination.hasNext || loading}
          onClick={goToNextPage}
        >
          Berikutnya
        </button>
      </footer>
    </section>
  )
}


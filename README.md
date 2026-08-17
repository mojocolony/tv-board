# TV v2.4.0

TV is the redesigned successor to TV Board. It keeps the existing data/storage contracts while replacing the Kanban board with a scalable visual list library.

## Existing data is preserved

TV intentionally keeps the same browser storage keys and the same private Dropbox data path used by TV Board:

- Browser library: `tvBoard.state.v1`
- Dropbox settings: `tvBoard.dropbox.v1`
- TMDB settings: `tvBoard.settings.v1`
- Dropbox data file: `/tv-board.json`

Opening TV on a browser that already used TV Board will migrate the existing records in place. Existing columns become statuses. Watched and Abandoned remain archives. Existing posters, ratings, tags, notes, TVmaze IDs, TMDB IDs and streaming providers are retained.

## New in v2.1

- One visual master list instead of Kanban columns
- Sidebar status views
- Favourites across every status/archive
- Multi-filtering by status, genre, episode count, total viewing time, year, rating, favourite, network/service and tags
- Sorting by title, date, year, rating, episode count, total time, network/service and status
- Saved filter views
- Editable/reorderable statuses with status colours
- Compact 16:9 landscape artwork rows for large libraries
- “With P”–style legacy columns migrate to Watching + a “Watching with” filter
- Persistent Small / Standard / Large / Extra Large font-size selector
- Mobile off-canvas navigation and filter drawer
- Expanded show metadata: genre, network/service, country, runtime and series status
- TVmaze lookup remains available
- TMDB / JustWatch Canadian streaming lookup remains available
- JSON import/export remains available
- Dropbox OAuth 2 + PKCE sync remains available

## GitHub Pages

Upload every file in this folder to the same repository root currently used by TV Board. GitHub Pages can continue deploying from `main` / root.

Because the app keeps `/tv-board.json`, you do not need to create a new Dropbox app or new data file. If the GitHub Pages URL does not change, the existing Dropbox redirect URI remains the same.

## Before replacing the live app

Export a backup from the current TV Board app. The redesign is migration-compatible, but having a plain JSON backup is still prudent before a major interface release.


## v2.3.0

- Episode guide with TVmaze descriptions and per-show viewing progress.
- “Mark up to here as watched” progress control and next-episode indicator.
- Alphabetical title sorting ignores leading The, A and An.
- More generous sidebar section spacing.
- Export/Import backup controls now match visually at every font size.


## v2.4.0 additions
- Q opens Add Show when you are not typing in a field.
- TVmaze search results are directly clickable; the separate Use button is removed.
- New shows default to Unsorted, which is available as a Library view and filter.
- Duplicate detection warns by TVmaze ID or title/year before adding another copy.
- All Shows includes an A–Z jump index; Filter includes Title begins with for letter-only views.
- Font sizes now extend through XXL and XXXL.
- Main cast names and character names load from TVmaze.
- Import and Export backup controls use one matched layout.

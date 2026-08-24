# TV v3.1.4

TV is the redesigned successor to TV Board. It keeps the existing data/storage contracts while replacing the Kanban board with a scalable visual list library.

## New in v3.1.4

- Title is now the first actionable field on iPhone Add/Edit Show screens.
- Poster and Library Artwork follow the title lookup area on phones; iPad and desktop layout remain unchanged.


- Hero artwork now follows the source **16:9 TMDB backdrop ratio** instead of being flattened by the old 310 px / 220 px height caps. This substantially reduces top/bottom cropping on desktop, iPad, and iPhone.
- Repaired the Dropbox refresh-control CSS so the refresh glyph is genuinely borderless while retaining its 24 px hit target and keyboard focus treatment.
- Repaired a malformed CSS block inherited from v3.1.1 so the intended phone viewport lock, stacked viewing-history dates, and library-logo sizing rules are parsed normally.

## New in v3.1.2

- Added a compact **manual Dropbox refresh** control beside the main sync status.
- TV now checks Dropbox automatically when the tab/window regains focus, when the page becomes visible again, when the device comes back online, and periodically while the visible app remains open.
- Automatic background sync checks are quiet and throttled so they do not repeatedly interrupt an open editor.
- iPhone layouts are horizontally locked to the viewport; overflowing editor/form children are constrained instead of allowing Safari side-to-side page drift.
- On phones, Poster, Pick Poster, URL, and Library Artwork controls stack cleanly instead of competing for the old two-column editor grid.
- Viewing-history date fields stack vertically on phones so Date Started / Date Finished / Date Abandoned remain aligned and readable.
- Country lookup now prefers TMDB `origin_country` when available, falls back to TVmaze network/web-channel country, preserves an existing manual country, and never replaces a manual value with blank.

## New in v3.1.0

- Automatic hero and library backdrops now use TMDB **no-language** backdrops only, reducing embedded title/logo clashes.
- Automatic library logos are **English only**; when no English logo is available, TV renders the show title itself.
- Add/Edit Show now includes **Pick** controls for the hero, library backdrop, and poster so weak automatic choices can be overridden visually from TMDB.
- Library title/logo treatment is capped so it cannot cover most of a 16:9 image; fallback titles wrap to at most two lines.
- TMDB/TVmaze artwork requests use a dedicated **cache-first image cache** on each device after the first load. API and Dropbox data remain network-first.
- iPad/iPhone editor rendering is steadier: large backdrop blurs/animations are disabled on coarse-pointer devices, images are preloaded before refresh swaps, and library rows are not repainted behind an open editor.

## New in v3.0.2

- TMDB hero backdrops now prefer language-neutral images, fall back to English, and exclude backdrops tagged with other languages.
- Existing v3.0.x hero choices are revalidated the next time a show is opened; a non-English hero is replaced from the filtered pool.
- Hero Refresh uses the same language-filtered pool.
- The first library artwork now deliberately chooses a different approved backdrop from the hero whenever another suitable image exists.
- Existing v3.0.1 shows whose hero and library artwork are identical are migrated to a distinct library backdrop on open.
- Library artwork Refresh also avoids the current hero when alternatives are available.
- TMDB logos are limited to English or language-neutral assets.

## New in v3.0.1

- Library artwork is immediately bound back into the visible library row after generation.
- Library artwork generation avoids unusable title-card selections by using the approved TMDB pool and saved choices.
- Hero controls were simplified to a smaller **Refresh** button.
- Ratings render as visual stars, including half-star fills.


## New in v3.0.0

- Library rows can now use a **TMDB 16:9 backdrop + transparent show logo** instead of relying on a tiny portrait poster.
- The library artwork is chosen when a show is added or when an existing show is opened and TMDB artwork is available.
- Backdrops come from the same top-rated pool used by the hero system; the library choice is saved separately so refreshing the large detail hero does not unexpectedly change the library.
- A **Refresh** control in Add/Edit Show deliberately selects another library backdrop while keeping the show logo treatment.
- If TMDB has no usable logo, TV overlays the show title as a readable fallback. If there is no TMDB backdrop, the existing poster remains the fallback.
- Only TMDB image paths are stored in TV/Dropbox; the actual image files remain remotely hosted and are rendered together in the browser.

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




## New in v2.8.2

- Portrait posters now inherit the show-card surface beside the image, eliminating pale/grey side bars in dark mode.
- Clearing a viewing-history date now clears the underlying viewing run as well, including iOS Safari's native date-picker Reset action.
- Explicitly cleared start dates are not immediately recreated by automatic Watching-date logic.

## New in v2.8.1
- Phone-only artwork thumbnails are slightly larger; desktop and iPad sizing are unchanged.
- Dark mode uses a charcoal fill behind portrait posters instead of the pale/blurred side treatment.
- Historical episode marking no longer invents a start date or watched date. Dates are recorded automatically only during an active Watching run; older dates remain blank unless entered manually.

## New in v2.8.0

- Restores **poster-first TVmaze artwork**. TVmaze's canonical show poster is preferred; landscape backgrounds/stills are fallbacks only.
- Includes a one-time repair pass for existing TVmaze-hosted artwork affected by the earlier landscape-artwork preference, without changing the library's user-facing “recently updated” timestamps.
- Choosing **Watched** now surfaces an immediate episode-history choice beside the Status field: mark all available episodes, choose episodes yourself, or save without inventing episode history.
- Episode details now support both **Mark this season up to here** and **Mark series up to here**, in addition to marking one episode at a time.
- Wide season/episode codes such as **S50 E10** remain on one line in the desktop episode guide.
- Background library re-renders are deferred while Add/Edit Show is open, reducing the modal-background flicker caused by Dropbox sync or episode-history saves.

## New in v2.7.1

- Current-season progress now appears directly in library rows (for example, `Next: S12 E5 · 6 left in S12`) once TVmaze episode data is available.
- Legacy single progress markers no longer imply that every earlier season was watched.
- Sort is a compact two-column anchored popover on desktop, a touch-sized constrained popover on iPad, and a bottom sheet on iPhone.
- Removed the nested/double outline from the Sort control; keyboard focus still has a clear accessibility ring.

## New in v2.7.0

- Episode-level watch tracking: mark one episode watched/unwatched without affecting earlier seasons.
- “Mark this season up to here” only marks episodes in the selected season.
- Season progress now reports watched/left counts and the next episode for the active season.
- Separate viewing runs support rewatches while preserving prior completed viewing history.
- Adding a show as Watched can optionally mark all available episodes watched without inventing historical watch dates.
- Date filters and date sorting include dates stored in viewing history.
- iPad portrait now uses a hideable navigation drawer instead of squeezing the desktop sidebar beside the library.
- Tablet headings and controls use dedicated responsive sizing; genre metadata remains visible.
- Sort uses an app-controlled menu instead of the browser's native iPad select sheet.
- Watching With uses an app-controlled suggestion list, including existing names such as P.
- Tablet editor text scales more substantially with the font-size preference.
- Added Classic to the standard genre choices.

## New in v2.5.1

- Built-in Unsorted now appears in Manage Statuses and can be reordered with the other Library statuses.
- Unsorted remains protected from rename/delete because it represents shows with no assigned status.
- Accidental real statuses named Unsorted are folded back into the built-in view without losing assigned shows.
- The Unsorted order is preserved in local data, backups and Dropbox sync.

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

## New in v2.6.0

- Mobile navigation is independently scrollable so Settings and the version remain reachable on iPhone/Safari.
- Filter status controls use compact fixed-size checkboxes and collapse to one column on narrow screens.
- Theme setting: System, Light or Dark, with the theme applied before the main stylesheet paints.
- New Watching Now view prioritizes next-episode progress for shows currently being watched.
- Viewing history fields record Date started, Date finished and Date abandoned, plus per-episode watched dates going forward.
- Viewing-date filters and sorting by started, finished, abandoned and most-recent episode watched have been added.
- Unrated is shown only for Watched shows; active/unwatched shows leave that field blank.
- Library rows grow naturally when genres wrap; status and rating metadata use a consistent top alignment.
- Total runtime no longer shows a leading tilde.
- Portrait-only artwork fallbacks are contained inside the 16:9 frame with a soft background treatment rather than cropped.
- The built-in Unsorted status now matches the other status rows visually in Manage Statuses.
- Multi-column editor labels reserve consistent height so inputs align when labels wrap.
- Country is now a true select control, so it remains changeable after a value has been chosen.
- In Add Show, Return/Enter saves and closes from single-line fields once TVmaze suggestions are no longer open; when suggestions are open, Enter chooses the first suggestion instead.


## v2.6.1 mobile navigation fix
- Rebuilt phone library rows as a stacked layout so status, episode progress, ratings and genres cannot overlap.
- Added explicit Back controls to shows, Settings, Filters, Manage Statuses and Saved Views.
- Browser Back now closes the current secondary screen before leaving TV.
- Added extra mobile safe-area space above Safari’s floating toolbar.

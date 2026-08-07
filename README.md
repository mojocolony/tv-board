# TV Board

A small browser-based Kanban board made specifically for television viewing.

## What it does

- Active Kanban board with customizable columns
- One clear **+ Add Column** control in the main toolbar
- Default columns: Watching, Next, Someday, Waiting for New Season
- Drag column headers to reorder columns on desktop
- Drag-and-drop cards between columns on desktop
- Keep arrow controls for reordering columns on phones/tablets
- Tap/click any card to edit or move it on touch devices
- Separate Watched and Abandoned archives
- Compact landscape artwork header on each show card
- One-click TVmaze lookup for landscape artwork, genres, seasons, and episode count
- Optional Canadian subscription-streaming availability via TMDB + JustWatch
- Automatic likely Metacritic link when using Find details, with manual editing for exceptions
- Season and episode counts
- Custom tags
- Half-star ratings from 0.5 to 5 stars
- Notes
- Search across titles, tags, and notes
- Archive sorting by recent update, rating, or title
- Automatic browser storage
- Export/import JSON backups
- Optional private Dropbox synchronization
- Installable as a home-screen / desktop web app when hosted over HTTPS

## Try it locally

Open `index.html` in a browser. Everything except Dropbox sync will work immediately. TVmaze lookup also works in modern browsers with internet access.

## Put it on GitHub Pages

1. Create a new GitHub repository, for example `tv-board`.
2. Upload every file in this folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`, then save.
6. GitHub will give you the app's web address.

## Dropbox sync

This app uses the same Dropbox OAuth 2 + PKCE approach as Days Until. It stores its data in a separate `/tv-board.json` file.

### Easiest option: reuse your Days Until Dropbox app

You do **not** need to create another Dropbox app if you don't want to.

1. Host TV Board on GitHub Pages first.
2. Open TV Board → Settings.
3. Copy the Redirect URI shown there.
4. In the Dropbox App Console, open the Dropbox app you already made for Days Until.
5. Add the TV Board Redirect URI under **OAuth 2 → Redirect URIs**. Keep the Days Until URI there too.
6. Make sure `files.content.read` and `files.content.write` are still enabled.
7. Copy the same Dropbox **App key** into TV Board.
8. Choose **Connect Dropbox** and authorize it.

Days Until will continue using `/days-until.json`, while TV Board uses `/tv-board.json` in the same private Dropbox app folder.

## Notes

- Artwork images are stored as URLs, not copied into Dropbox. TVmaze permits direct linking to its image CDN; if a remote image is later unavailable, the card falls back to a simple title placeholder.
- TVmaze lookup uses its free public CORS-enabled API and the app links back to TVmaze for attribution. No API key is required.
- Dropbox authorization tokens remain in each browser. Do not connect Dropbox on a public/shared computer.
- When search is active, drag-and-drop is disabled so filtering cannot accidentally change card order.
- The app merges show changes by show ID and edit time. Column configuration uses the newest column edit time. Deleted-item markers are kept for 180 days to reduce the chance that an older device restores a deleted show.


## Canadian streaming availability

TV Board keeps TVmaze as the source for artwork and show metadata. TMDB is used only to identify subscription streaming providers in Canada; the availability data is powered by JustWatch. Rental, purchase, free, and ad-supported listings are ignored.

1. Create a free TMDB developer API credential.
2. In TV Board, open Settings.
3. Under Canadian Streaming, paste either your TMDB **API Read Access Token** or your v3 **API Key**.
4. Choose **Save & test**.
5. Choose **Refresh all shows** once to match existing shows and add Canadian subscription services.

After that, new shows found through TVmaze will also check Canadian streaming automatically. Linked shows are refreshed periodically while TV Board is open. Your TMDB credential is stored only in that browser and is not written to Dropbox or GitHub; the resulting provider names are part of the board data and can sync through Dropbox.

TMDB attribution and the required JustWatch source attribution are included in the Settings screen.

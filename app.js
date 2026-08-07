(() => {
  'use strict';

  const STORAGE_KEY = 'tvBoard.state.v1';
  const DROPBOX_KEY = 'tvBoard.dropbox.v1';
  const PKCE_KEY = 'tvBoard.pkce.v1';
  const PREFS_KEY = 'tvBoard.settings.v1';
  const DATA_PATH = '/tv-board.json';
  const ARCHIVE_WATCHED = 'watched';
  const ARCHIVE_ABANDONED = 'abandoned';

  const $ = (id) => document.getElementById(id);
  const els = {
    boardView: $('boardView'), archiveView: $('archiveView'), kanbanBoard: $('kanbanBoard'), archiveGrid: $('archiveGrid'),
    archiveEmpty: $('archiveEmpty'), archiveEmptyText: $('archiveEmptyText'), archiveTitle: $('archiveTitle'), archiveEyebrow: $('archiveEyebrow'),
    archiveSort: $('archiveSort'), searchInput: $('searchInput'), addButton: $('addButton'), quickAddColumnButton: $('quickAddColumnButton'),
    boardCount: $('boardCount'), watchedCount: $('watchedCount'), abandonedCount: $('abandonedCount'),
    showDialog: $('showDialog'), showForm: $('showForm'), showDialogTitle: $('showDialogTitle'), showId: $('showId'),
    showTitle: $('showTitle'), showLocation: $('showLocation'), showRating: $('showRating'), showPoster: $('showPoster'),
    lookupShowButton: $('lookupShowButton'), lookupStatus: $('lookupStatus'), lookupResults: $('lookupResults'),
    showMetacritic: $('showMetacritic'), showSeasons: $('showSeasons'), showEpisodes: $('showEpisodes'), showTags: $('showTags'),
    streamingPreview: $('streamingPreview'), streamingProvidersText: $('streamingProvidersText'), streamingProvidersNote: $('streamingProvidersNote'),
    showNotes: $('showNotes'), deleteShowButton: $('deleteShowButton'),
    columnsButton: $('columnsButton'), columnsDialog: $('columnsDialog'), closeColumnsButton: $('closeColumnsButton'),
    columnManager: $('columnManager'), addColumnForm: $('addColumnForm'), newColumnName: $('newColumnName'),
    settingsButton: $('settingsButton'), settingsDialog: $('settingsDialog'), closeSettingsButton: $('closeSettingsButton'),
    syncChip: $('syncChip'), statusDot: $('statusDot'), syncLabel: $('syncLabel'), footerMessage: $('footerMessage'),
    dropboxStatus: $('dropboxStatus'), dropboxSetup: $('dropboxSetup'), dropboxConnected: $('dropboxConnected'),
    dropboxAppKey: $('dropboxAppKey'), redirectUriText: $('redirectUriText'), copyRedirectButton: $('copyRedirectButton'),
    connectDropboxButton: $('connectDropboxButton'), syncNowButton: $('syncNowButton'), disconnectDropboxButton: $('disconnectDropboxButton'),
    tmdbStatus: $('tmdbStatus'), tmdbCredential: $('tmdbCredential'), saveTmdbButton: $('saveTmdbButton'), refreshProvidersButton: $('refreshProvidersButton'),
    exportButton: $('exportButton'), importInput: $('importInput'), toast: $('toast')
  };

  let state = loadState();
  let dbx = loadDropbox();
  let prefs = loadPrefs();
  let activeView = 'board';
  let syncTimer = null;
  let toastTimer = null;
  let draggedShowId = null;
  let draggedColumnId = null;
  let lookupController = null;
  let draftMeta = {};
  let providerRefreshRunning = false;

  function nowIso() { return new Date().toISOString(); }
  function uuid() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; }

  function defaultState() {
    const t = nowIso();
    return {
      version: 1,
      columnsUpdatedAt: t,
      columns: [
        { id: 'watching', name: 'Watching' },
        { id: 'next', name: 'Next' },
        { id: 'someday', name: 'Someday' },
        { id: 'waiting', name: 'Waiting for New Season' }
      ],
      shows: [],
      deleted: []
    };
  }

  function normalizeState(raw) {
    const fallback = defaultState();
    if (!raw || typeof raw !== 'object') return fallback;
    const columns = Array.isArray(raw.columns) && raw.columns.length
      ? raw.columns.filter(c => c && c.id && c.name).map(c => ({ id: String(c.id), name: String(c.name).slice(0, 50) }))
      : fallback.columns;
    const validIds = new Set(columns.map(c => c.id));
    const first = columns[0].id;
    const shows = Array.isArray(raw.shows) ? raw.shows.filter(s => s && s.id && s.title).map((s, index) => ({
      id: String(s.id),
      title: String(s.title).slice(0, 120),
      columnId: validIds.has(s.columnId) ? s.columnId : first,
      archive: s.archive === ARCHIVE_WATCHED || s.archive === ARCHIVE_ABANDONED ? s.archive : null,
      poster: safeUrl(s.poster || ''),
      metacritic: safeUrl(s.metacritic || ''),
      seasons: numberOrNull(s.seasons),
      episodes: numberOrNull(s.episodes),
      tags: Array.isArray(s.tags) ? cleanTags(s.tags) : cleanTags(String(s.tags || '').split(',')),
      rating: clampRating(s.rating),
      notes: String(s.notes || '').slice(0, 2000),
      tvmazeId: integerOrNull(s.tvmazeId),
      imdbId: String(s.imdbId || '').trim().slice(0, 30),
      tmdbId: integerOrNull(s.tmdbId),
      firstAirYear: integerOrNull(s.firstAirYear),
      providers: cleanProviders(s.providers),
      providersUpdatedAt: validDateString(s.providersUpdatedAt) ? s.providersUpdatedAt : null,
      providerLink: safeUrl(s.providerLink || ''),
      order: Number.isFinite(Number(s.order)) ? Number(s.order) : index,
      updatedAt: validDateString(s.updatedAt) ? s.updatedAt : nowIso()
    })) : [];
    return {
      version: 1,
      columnsUpdatedAt: validDateString(raw.columnsUpdatedAt) ? raw.columnsUpdatedAt : nowIso(),
      columns,
      shows,
      deleted: Array.isArray(raw.deleted) ? raw.deleted.filter(d => d && d.id && validDateString(d.deletedAt)) : []
    };
  }

  function loadState() {
    try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
    catch (_) { return defaultState(); }
  }

  function saveState({ sync = true, rerender = true } = {}) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (rerender) render();
    if (sync && dbx.connected) scheduleSync();
  }

  function loadDropbox() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DROPBOX_KEY));
      return parsed && typeof parsed === 'object' ? { connected: false, ...parsed } : { connected: false };
    } catch (_) { return { connected: false }; }
  }

  function saveDropbox() {
    localStorage.setItem(DROPBOX_KEY, JSON.stringify(dbx));
    updateDropboxUI();
  }

  function loadPrefs() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PREFS_KEY));
      return parsed && typeof parsed === 'object' ? { tmdbCredential: '', ...parsed } : { tmdbCredential: '' };
    } catch (_) { return { tmdbCredential: '' }; }
  }

  function savePrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    updateTmdbUI();
  }

  function safeUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    try {
      const url = new URL(text);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) { return ''; }
  }

  function validDateString(value) { return typeof value === 'string' && !Number.isNaN(Date.parse(value)); }
  function numberOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const n = Math.max(0, Math.round(Number(value)));
    return Number.isFinite(n) ? n : null;
  }
  function integerOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const n = Math.round(Number(value));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  function clampRating(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5, Math.round(n * 2) / 2));
  }
  function cleanTags(tags) {
    const seen = new Set();
    return tags.map(t => String(t).trim()).filter(Boolean).map(t => t.slice(0, 40)).filter(t => {
      const key = t.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(0, 20);
  }

  function cleanProviders(providers) {
    if (!Array.isArray(providers)) return [];
    const seen = new Set();
    return providers.map(p => String(p || '').trim()).filter(Boolean).map(p => p.slice(0, 80)).filter(p => {
      const key = p.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(0, 12);
  }

  function orderedShowsForColumn(columnId) {
    return state.shows.filter(s => !s.archive && s.columnId === columnId).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }

  function searchMatches(show) {
    const q = els.searchInput.value.trim().toLowerCase();
    if (!q) return true;
    return show.title.toLowerCase().includes(q) || show.tags.some(t => t.toLowerCase().includes(q)) || show.notes.toLowerCase().includes(q);
  }

  function render() {
    renderTabs();
    if (activeView === 'board') renderBoard();
    else renderArchive(activeView);
    updateDropboxUI();
  }

  function renderTabs() {
    document.querySelectorAll('.view-tab').forEach(b => b.classList.toggle('active', b.dataset.view === activeView));
    const board = state.shows.filter(s => !s.archive).length;
    const watched = state.shows.filter(s => s.archive === ARCHIVE_WATCHED).length;
    const abandoned = state.shows.filter(s => s.archive === ARCHIVE_ABANDONED).length;
    els.boardCount.textContent = board;
    els.watchedCount.textContent = watched;
    els.abandonedCount.textContent = abandoned;
    els.boardView.hidden = activeView !== 'board';
    els.archiveView.hidden = activeView === 'board';
    els.columnsButton.hidden = activeView !== 'board';
    els.quickAddColumnButton.hidden = activeView !== 'board';
  }

  function renderBoard() {
    els.kanbanBoard.replaceChildren();
    for (const column of state.columns) {
      const allShows = orderedShowsForColumn(column.id);
      const visible = allShows.filter(searchMatches);
      const section = document.createElement('section');
      section.className = 'kanban-column';
      section.dataset.columnId = column.id;

      const header = document.createElement('div');
      header.className = 'column-header';
      header.draggable = true;
      header.title = 'Drag to reorder this column';
      const title = document.createElement('span'); title.className = 'column-title'; title.textContent = column.name;
      const headerActions = document.createElement('span'); headerActions.className = 'column-header-actions';
      const handle = document.createElement('span'); handle.className = 'column-drag-handle'; handle.textContent = '⠿'; handle.setAttribute('aria-hidden', 'true');
      const count = document.createElement('span'); count.className = 'column-count'; count.textContent = allShows.length;
      headerActions.append(handle, count);
      header.append(title, headerActions);
      attachDragColumn(header, section, column.id);

      const body = document.createElement('div');
      body.className = 'column-body';
      body.dataset.columnId = column.id;
      attachDropZone(body, column.id);
      if (!visible.length) {
        const empty = document.createElement('div'); empty.className = 'column-empty';
        empty.textContent = allShows.length ? 'No matches in this column' : 'Drop a show here or add one';
        body.appendChild(empty);
      } else {
        for (const show of visible) body.appendChild(showCard(show, { draggable: true }));
      }
      section.append(header, body);
      els.kanbanBoard.appendChild(section);
    }
  }

  function renderArchive(kind) {
    const isWatched = kind === ARCHIVE_WATCHED;
    els.archiveEyebrow.textContent = 'ARCHIVE';
    els.archiveTitle.textContent = isWatched ? 'Watched' : 'Abandoned';
    els.archiveEmptyText.textContent = isWatched ? 'Shows you finish will collect here.' : 'Shows you decide not to continue will collect here.';
    let shows = state.shows.filter(s => s.archive === kind && searchMatches(s));
    const sort = els.archiveSort.value;
    if (sort === 'title') shows.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'rating') shows.sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title));
    else shows.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    els.archiveGrid.replaceChildren();
    els.archiveEmpty.hidden = shows.length > 0;
    for (const show of shows) els.archiveGrid.appendChild(showCard(show, { draggable: false }));
  }

  function showCard(show, { draggable }) {
    const card = document.createElement('article');
    card.className = 'show-card';
    card.dataset.showId = show.id;
    card.draggable = !!draggable && !els.searchInput.value.trim();
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Edit ${show.title}`);

    const posterWrap = document.createElement('div'); posterWrap.className = 'poster-wrap';
    const placeholder = document.createElement('div'); placeholder.className = 'poster-placeholder'; placeholder.textContent = initials(show.title);
    posterWrap.appendChild(placeholder);
    if (show.poster) {
      const img = document.createElement('img'); img.src = show.poster; img.alt = `${show.title} header artwork`; img.loading = 'lazy';
      img.addEventListener('error', () => img.remove(), { once: true });
      posterWrap.appendChild(img);
    }

    const body = document.createElement('div'); body.className = 'card-body';
    const titleRow = document.createElement('div'); titleRow.className = 'card-title-row';
    const h3 = document.createElement('h3'); h3.textContent = show.title;
    const titleActions = document.createElement('div'); titleActions.className = 'card-title-actions';
    if (show.rating > 0) {
      const rating = document.createElement('div'); rating.className = 'rating-line'; rating.textContent = ratingStars(show.rating); rating.title = `${show.rating} out of 5`; titleActions.appendChild(rating);
    }
    const handle = document.createElement('span'); handle.className = 'drag-handle'; handle.textContent = draggable ? '•••' : '';
    titleActions.appendChild(handle);
    titleRow.append(h3, titleActions);
    body.appendChild(titleRow);

    const metaText = showMeta(show);
    if (metaText) { const meta = document.createElement('p'); meta.className = 'card-meta'; meta.textContent = metaText; body.appendChild(meta); }

    if (show.tags.length) {
      const tags = document.createElement('div'); tags.className = 'tag-list';
      for (const text of show.tags.slice(0, 3)) { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = text; tags.appendChild(tag); }
      body.appendChild(tags);
    }

    if (show.providers.length) {
      const watch = document.createElement('div'); watch.className = 'watch-line';
      const label = document.createElement('strong'); label.textContent = 'Watch';
      const services = document.createElement('span'); services.textContent = show.providers.join(' · ');
      watch.append(label, services); body.appendChild(watch);
    }

    if (show.metacritic || show.notes) {
      const footer = document.createElement('div'); footer.className = 'card-footer';
      if (show.metacritic) {
        const link = document.createElement('a'); link.className = 'metacritic-link'; link.href = show.metacritic; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Metacritic ↗';
        link.addEventListener('click', e => e.stopPropagation()); footer.appendChild(link);
      } else footer.appendChild(document.createElement('span'));
      if (show.notes) { const notes = document.createElement('span'); notes.className = 'card-notes-indicator'; notes.textContent = 'Notes'; footer.appendChild(notes); }
      body.appendChild(footer);
    }

    card.append(posterWrap, body);
    card.addEventListener('click', () => openShowDialog(show));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openShowDialog(show); } });
    if (card.draggable) attachDragCard(card, show);
    return card;
  }

  function initials(title) {
    const parts = title.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map(x => x[0]?.toUpperCase() || '').join('') || 'TV';
  }

  function showMeta(show) {
    const parts = [];
    if (show.seasons !== null) parts.push(`${show.seasons} ${show.seasons === 1 ? 'season' : 'seasons'}`);
    if (show.episodes !== null) parts.push(`${show.episodes} ${show.episodes === 1 ? 'episode' : 'episodes'}`);
    return parts.join(' · ');
  }

  function ratingStars(rating) {
    const whole = Math.floor(rating);
    const half = rating % 1 >= .5;
    return '★'.repeat(whole) + (half ? '½' : '');
  }

  function attachDragColumn(header, section, columnId) {
    header.addEventListener('dragstart', e => {
      if (draggedShowId) { e.preventDefault(); return; }
      draggedColumnId = columnId;
      section.classList.add('column-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', `column:${columnId}`);
      try { e.dataTransfer.setDragImage(section, Math.min(e.offsetX, section.offsetWidth - 10), 24); } catch (_) {}
    });

    header.addEventListener('dragend', () => {
      draggedColumnId = null;
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('column-dragging', 'column-drop-before', 'column-drop-after'));
    });

    section.addEventListener('dragover', e => {
      if (!draggedColumnId || draggedColumnId === columnId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const rect = section.getBoundingClientRect();
      const after = e.clientX >= rect.left + rect.width / 2;
      section.classList.toggle('column-drop-before', !after);
      section.classList.toggle('column-drop-after', after);
    });

    section.addEventListener('dragleave', e => {
      if (!draggedColumnId) return;
      if (!section.contains(e.relatedTarget)) section.classList.remove('column-drop-before', 'column-drop-after');
    });

    section.addEventListener('drop', e => {
      if (!draggedColumnId || draggedColumnId === columnId) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = section.getBoundingClientRect();
      const after = e.clientX >= rect.left + rect.width / 2;
      reorderColumnByDrop(draggedColumnId, columnId, after);
    });
  }

  function reorderColumnByDrop(movingId, targetId, insertAfter) {
    if (!movingId || !targetId || movingId === targetId) return;
    const from = state.columns.findIndex(c => c.id === movingId);
    const targetBeforeRemoval = state.columns.findIndex(c => c.id === targetId);
    if (from < 0 || targetBeforeRemoval < 0) return;

    const [moving] = state.columns.splice(from, 1);
    const target = state.columns.findIndex(c => c.id === targetId);
    if (target < 0) { state.columns.splice(from, 0, moving); return; }
    const to = target + (insertAfter ? 1 : 0);
    state.columns.splice(to, 0, moving);
    draggedColumnId = null;
    touchColumns();
    saveState();
  }

  function attachDragCard(card, show) {
    card.addEventListener('dragstart', e => {
      draggedShowId = show.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', show.id);
    });
    card.addEventListener('dragend', () => {
      draggedShowId = null;
      card.classList.remove('dragging');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', e => {
      if (!draggedShowId || draggedShowId === show.id || els.searchInput.value.trim()) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    card.addEventListener('drop', e => {
      if (!draggedShowId || draggedShowId === show.id || els.searchInput.value.trim()) return;
      e.preventDefault(); e.stopPropagation();
      moveShowBefore(draggedShowId, show.id, show.columnId);
    });
  }

  function attachDropZone(body, columnId) {
    body.addEventListener('dragover', e => {
      if (!draggedShowId || els.searchInput.value.trim()) return;
      e.preventDefault(); e.dataTransfer.dropEffect = 'move';
      body.closest('.kanban-column')?.classList.add('drag-over');
    });
    body.addEventListener('dragleave', e => {
      if (!body.contains(e.relatedTarget)) body.closest('.kanban-column')?.classList.remove('drag-over');
    });
    body.addEventListener('drop', e => {
      if (!draggedShowId || els.searchInput.value.trim()) return;
      e.preventDefault();
      body.closest('.kanban-column')?.classList.remove('drag-over');
      moveShowToEnd(draggedShowId, columnId);
    });
  }

  function moveShowBefore(showId, targetId, columnId) {
    const moving = state.shows.find(s => s.id === showId);
    if (!moving) return;
    const oldColumn = moving.columnId;
    const wasArchived = !!moving.archive;
    moving.archive = null;
    moving.columnId = columnId;
    const ordered = orderedShowsForColumn(columnId).filter(s => s.id !== showId);
    const targetIndex = ordered.findIndex(s => s.id === targetId);
    ordered.splice(targetIndex < 0 ? ordered.length : targetIndex, 0, moving);
    rewriteOrder(columnId, ordered);
    if (!wasArchived && oldColumn && oldColumn !== columnId) normalizeColumnOrder(oldColumn);
    saveState();
  }

  function moveShowToEnd(showId, columnId) {
    const moving = state.shows.find(s => s.id === showId);
    if (!moving) return;
    const oldColumn = moving.columnId;
    moving.archive = null;
    moving.columnId = columnId;
    moving.updatedAt = nowIso();
    if (oldColumn !== columnId) normalizeColumnOrder(oldColumn);
    normalizeColumnOrder(columnId, showId);
    saveState();
  }

  function rewriteOrder(columnId, ordered) {
    const t = nowIso();
    ordered.forEach((s, i) => { s.columnId = columnId; s.archive = null; s.order = i; s.updatedAt = t; });
  }

  function normalizeColumnOrder(columnId, forceLastId = null) {
    if (!columnId) return;
    let ordered = orderedShowsForColumn(columnId);
    if (forceLastId) {
      const index = ordered.findIndex(s => s.id === forceLastId);
      if (index >= 0) ordered.push(ordered.splice(index, 1)[0]);
    }
    rewriteOrder(columnId, ordered);
  }

  function populateLocationSelect(selectedShow = null) {
    els.showLocation.replaceChildren();
    const activeGroup = document.createElement('optgroup'); activeGroup.label = 'Board';
    for (const column of state.columns) {
      const option = document.createElement('option'); option.value = `column:${column.id}`; option.textContent = column.name; activeGroup.appendChild(option);
    }
    const archiveGroup = document.createElement('optgroup'); archiveGroup.label = 'Archive';
    const watched = document.createElement('option'); watched.value = 'archive:watched'; watched.textContent = 'Watched';
    const abandoned = document.createElement('option'); abandoned.value = 'archive:abandoned'; abandoned.textContent = 'Abandoned';
    archiveGroup.append(watched, abandoned);
    els.showLocation.append(activeGroup, archiveGroup);

    if (selectedShow) els.showLocation.value = selectedShow.archive ? `archive:${selectedShow.archive}` : `column:${selectedShow.columnId}`;
    else els.showLocation.value = `column:${state.columns[0].id}`;
  }

  function clearLookupUI() {
    if (lookupController) { lookupController.abort(); lookupController = null; }
    els.lookupResults.replaceChildren();
    els.lookupResults.hidden = true;
    els.lookupStatus.hidden = true;
    els.lookupStatus.textContent = '';
    els.lookupShowButton.disabled = false;
    els.lookupShowButton.textContent = 'Find details';
  }

  function setLookupStatus(text) {
    els.lookupStatus.textContent = text;
    els.lookupStatus.hidden = !text;
  }

  function lookupSubtitle(show) {
    const year = show.premiered ? String(show.premiered).slice(0, 4) : '';
    const channel = show.network?.name || show.webChannel?.name || '';
    const country = show.network?.country?.name || show.webChannel?.country?.name || '';
    return [year, channel, country].filter(Boolean).join(' · ') || 'TV series';
  }

  function tmdbCredentialLooksLikeApiKey(value) {
    return /^[a-f0-9]{32}$/i.test(String(value || '').trim());
  }

  async function tmdbFetch(path, params = {}, credential = prefs.tmdbCredential) {
    const cred = String(credential || '').trim();
    if (!cred) throw new Error('TMDB is not configured');
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    for (const [key, value] of Object.entries(params)) if (value !== null && value !== undefined && value !== '') url.searchParams.set(key, String(value));
    const headers = { 'Accept': 'application/json' };
    if (tmdbCredentialLooksLikeApiKey(cred)) url.searchParams.set('api_key', cred);
    else headers.Authorization = `Bearer ${cred}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`TMDB returned ${response.status}`);
    return response.json();
  }

  function normalizedTitle(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  async function resolveTmdbId(meta) {
    if (integerOrNull(meta.tmdbId)) return integerOrNull(meta.tmdbId);
    const imdbId = String(meta.imdbId || '').trim();
    if (imdbId) {
      const found = await tmdbFetch(`/find/${encodeURIComponent(imdbId)}`, { external_source: 'imdb_id' });
      const tv = Array.isArray(found.tv_results) ? found.tv_results : [];
      if (tv.length === 1) return integerOrNull(tv[0].id);
      if (tv.length > 1) {
        const exact = tv.find(r => normalizedTitle(r.name) === normalizedTitle(meta.title));
        if (exact) return integerOrNull(exact.id);
      }
    }

    const search = await tmdbFetch('/search/tv', { query: meta.title, language: 'en-CA' });
    const results = Array.isArray(search.results) ? search.results : [];
    const exact = results.filter(r => normalizedTitle(r.name) === normalizedTitle(meta.title) || normalizedTitle(r.original_name) === normalizedTitle(meta.title));
    if (meta.firstAirYear) {
      const sameYear = exact.find(r => String(r.first_air_date || '').slice(0, 4) === String(meta.firstAirYear));
      if (sameYear) return integerOrNull(sameYear.id);
    }
    if (exact.length === 1) return integerOrNull(exact[0].id);
    return null;
  }

  async function fetchCanadianProviders(meta) {
    const tmdbId = await resolveTmdbId(meta);
    if (!tmdbId) return { resolved: false, tmdbId: null, providers: [], providerLink: '', providersUpdatedAt: null };
    const data = await tmdbFetch(`/tv/${tmdbId}/watch/providers`);
    const ca = data?.results?.CA || null;
    const providers = cleanProviders((ca?.flatrate || []).map(p => p?.provider_name));
    return {
      resolved: true,
      tmdbId,
      providers,
      providerLink: safeUrl(ca?.link || ''),
      providersUpdatedAt: nowIso()
    };
  }

  function updateStreamingPreview(meta = draftMeta) {
    const checked = validDateString(meta?.providersUpdatedAt);
    const providers = cleanProviders(meta?.providers);
    if (!checked && !providers.length) {
      els.streamingPreview.hidden = true;
      return;
    }
    els.streamingPreview.hidden = false;
    els.streamingProvidersText.textContent = providers.length ? providers.join(' · ') : 'No subscription service found';
    els.streamingProvidersNote.textContent = checked ? 'Canada only · subscription services only · availability via JustWatch/TMDB' : '';
  }

  async function lookupShows() {
    const query = els.showTitle.value.trim();
    if (!query) { setLookupStatus('Type a show title first.'); els.showTitle.focus(); return; }
    if (lookupController) lookupController.abort();
    lookupController = new AbortController();
    els.lookupResults.replaceChildren();
    els.lookupResults.hidden = true;
    els.lookupShowButton.disabled = true;
    els.lookupShowButton.textContent = 'Searching…';
    setLookupStatus('Searching TVmaze…');
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { signal: lookupController.signal });
      if (!response.ok) throw new Error(`TVmaze search returned ${response.status}`);
      const results = (await response.json()).slice(0, 7);
      if (!results.length) { setLookupStatus('No matches found. You can still enter the show manually.'); return; }
      setLookupStatus('Choose the correct show:');
      for (const result of results) {
        const show = result.show;
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'lookup-result';
        const thumb = document.createElement('span'); thumb.className = 'lookup-thumb'; thumb.textContent = initials(show.name || 'TV');
        if (show.image?.medium) {
          const img = document.createElement('img'); img.src = show.image.medium; img.alt = ''; img.loading = 'lazy';
          img.addEventListener('error', () => img.remove(), { once: true }); thumb.appendChild(img);
        }
        const copy = document.createElement('span'); copy.className = 'lookup-copy';
        const strong = document.createElement('strong'); strong.textContent = show.name;
        const meta = document.createElement('span'); meta.textContent = lookupSubtitle(show);
        copy.append(strong, meta);
        const use = document.createElement('span'); use.className = 'lookup-use'; use.textContent = 'Use';
        button.append(thumb, copy, use);
        button.addEventListener('click', () => applyTvmazeShow(show));
        els.lookupResults.appendChild(button);
      }
      els.lookupResults.hidden = false;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setLookupStatus('Could not reach TVmaze. You can still enter the show manually.');
      }
    } finally {
      els.lookupShowButton.disabled = false;
      els.lookupShowButton.textContent = 'Find details';
      lookupController = null;
    }
  }

  function imageArea(image) {
    const r = image?.resolutions?.original;
    return (Number(r?.width) || 0) * (Number(r?.height) || 0);
  }

  function chooseWideArtwork(images, fallbackShow) {
    const pick = (type) => images.filter(i => i?.type === type && i?.resolutions?.original?.url).sort((a, b) => imageArea(b) - imageArea(a))[0];
    const selected = pick('background') || pick('banner');
    return selected?.resolutions?.original?.url || fallbackShow.image?.original || fallbackShow.image?.medium || '';
  }

  async function applyTvmazeShow(show) {
    els.lookupResults.hidden = true;
    els.lookupShowButton.disabled = true;
    els.lookupShowButton.textContent = 'Loading…';
    setLookupStatus(`Loading details for ${show.name}…`);
    try {
      const [episodesResponse, imagesResponse] = await Promise.all([
        fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`),
        fetch(`https://api.tvmaze.com/shows/${show.id}/images`)
      ]);
      const episodes = episodesResponse.ok ? await episodesResponse.json() : [];
      const images = imagesResponse.ok ? await imagesResponse.json() : [];
      const seasons = new Set(episodes.map(e => Number(e.season)).filter(n => Number.isFinite(n) && n > 0));

      els.showTitle.value = show.name || els.showTitle.value;
      if (seasons.size) els.showSeasons.value = seasons.size;
      if (episodes.length) els.showEpisodes.value = episodes.length;
      const artwork = chooseWideArtwork(images, show);
      if (artwork) els.showPoster.value = artwork;
      if (Array.isArray(show.genres) && show.genres.length) {
        const existing = cleanTags(els.showTags.value.split(','));
        els.showTags.value = cleanTags([...existing, ...show.genres]).join(', ');
      }

      draftMeta = {
        ...draftMeta,
        tvmazeId: integerOrNull(show.id),
        imdbId: String(show.externals?.imdb || '').trim(),
        firstAirYear: integerOrNull(String(show.premiered || '').slice(0, 4))
      };

      let streamingMessage = '';
      if (prefs.tmdbCredential) {
        setLookupStatus(`Details added. Checking Canadian streaming for ${show.name}…`);
        try {
          const streaming = await fetchCanadianProviders({ title: show.name, ...draftMeta });
          if (streaming.resolved) {
            draftMeta = { ...draftMeta, ...streaming };
            updateStreamingPreview();
            streamingMessage = streaming.providers.length
              ? ` Streaming: ${streaming.providers.join(', ')}.`
              : ' No Canadian subscription service was found.';
          } else streamingMessage = ' Streaming could not be matched automatically.';
        } catch (err) {
          console.error(err);
          streamingMessage = ' Streaming availability could not be checked.';
        }
      }
      setLookupStatus(`Details added.${streamingMessage} Add the Metacritic link, your tags, rating, or notes if you want them.`);
    } catch (err) {
      console.error(err);
      setLookupStatus('Some show details could not be loaded. You can fill in anything missing manually.');
    } finally {
      els.lookupShowButton.disabled = false;
      els.lookupShowButton.textContent = 'Find details';
    }
  }

  function openShowDialog(show = null, columnId = null) {
    clearLookupUI();
    els.showForm.reset();
    draftMeta = show ? {
      tvmazeId: show.tvmazeId, imdbId: show.imdbId, tmdbId: show.tmdbId, firstAirYear: show.firstAirYear,
      providers: [...show.providers], providersUpdatedAt: show.providersUpdatedAt, providerLink: show.providerLink
    } : {};
    updateStreamingPreview();
    populateLocationSelect(show);
    if (show) {
      els.showDialogTitle.textContent = 'Edit Show';
      els.showId.value = show.id;
      els.showTitle.value = show.title;
      els.showRating.value = String(show.rating || 0);
      els.showPoster.value = show.poster || '';
      els.showMetacritic.value = show.metacritic || '';
      els.showSeasons.value = show.seasons ?? '';
      els.showEpisodes.value = show.episodes ?? '';
      els.showTags.value = show.tags.join(', ');
      els.showNotes.value = show.notes || '';
      els.deleteShowButton.hidden = false;
    } else {
      els.showDialogTitle.textContent = 'Add Show';
      els.showId.value = '';
      els.deleteShowButton.hidden = true;
      if (columnId && state.columns.some(c => c.id === columnId)) els.showLocation.value = `column:${columnId}`;
      else if (activeView === ARCHIVE_WATCHED || activeView === ARCHIVE_ABANDONED) els.showLocation.value = `archive:${activeView}`;
    }
    els.showDialog.showModal();
    setTimeout(() => els.showTitle.focus(), 50);
  }

  function readLocation(value) {
    if (value.startsWith('archive:')) return { archive: value.slice(8), columnId: state.columns[0].id };
    return { archive: null, columnId: value.slice(7) || state.columns[0].id };
  }

  function upsertShow() {
    const title = els.showTitle.value.trim();
    if (!title) return false;
    const id = els.showId.value;
    const location = readLocation(els.showLocation.value);
    const fields = {
      title,
      columnId: location.columnId,
      archive: location.archive,
      poster: safeUrl(els.showPoster.value),
      metacritic: safeUrl(els.showMetacritic.value),
      seasons: numberOrNull(els.showSeasons.value),
      episodes: numberOrNull(els.showEpisodes.value),
      tags: cleanTags(els.showTags.value.split(',')),
      rating: clampRating(els.showRating.value),
      notes: els.showNotes.value.trim().slice(0, 2000),
      tvmazeId: integerOrNull(draftMeta.tvmazeId),
      imdbId: String(draftMeta.imdbId || '').trim().slice(0, 30),
      tmdbId: integerOrNull(draftMeta.tmdbId),
      firstAirYear: integerOrNull(draftMeta.firstAirYear),
      providers: cleanProviders(draftMeta.providers),
      providersUpdatedAt: validDateString(draftMeta.providersUpdatedAt) ? draftMeta.providersUpdatedAt : null,
      providerLink: safeUrl(draftMeta.providerLink || ''),
      updatedAt: nowIso()
    };

    if (els.showPoster.value.trim() && !fields.poster) { showToast('Artwork URL must begin with http:// or https://'); return false; }
    if (els.showMetacritic.value.trim() && !fields.metacritic) { showToast('Metacritic URL must begin with http:// or https://'); return false; }

    if (id) {
      const show = state.shows.find(s => s.id === id);
      if (!show) return false;
      const oldColumn = show.columnId;
      const oldArchive = show.archive;
      const oldOrder = show.order;
      Object.assign(show, fields);
      const movedToDifferentActiveColumn = !show.archive && (oldArchive || oldColumn !== show.columnId);
      if (movedToDifferentActiveColumn) {
        const peers = orderedShowsForColumn(show.columnId).filter(s => s.id !== show.id);
        show.order = (peers.at(-1)?.order ?? -1) + 1;
      } else {
        show.order = oldOrder;
      }
      if (!oldArchive && oldColumn && oldColumn !== show.columnId) normalizeColumnOrder(oldColumn);
      showToast('Show updated');
    } else {
      const peers = state.shows.filter(s => !s.archive && s.columnId === fields.columnId);
      state.shows.push({ id: uuid(), ...fields, order: (Math.max(-1, ...peers.map(s => Number(s.order) || 0)) + 1) });
      showToast('Show added');
    }
    saveState();
    return true;
  }

  function deleteCurrentShow() {
    const id = els.showId.value;
    const show = state.shows.find(s => s.id === id);
    if (!show || !confirm(`Delete “${show.title}”?`)) return;
    state.shows = state.shows.filter(s => s.id !== id);
    state.deleted = state.deleted.filter(d => d.id !== id);
    state.deleted.push({ id, deletedAt: nowIso() });
    if (!show.archive) normalizeColumnOrder(show.columnId);
    saveState();
    els.showDialog.close();
    showToast('Show deleted');
  }

  function openColumnManagerForAdd() {
    renderColumnManager();
    els.columnsDialog.showModal();
    setTimeout(() => els.newColumnName.focus(), 0);
  }

  function renderColumnManager() {
    els.columnManager.replaceChildren();
    state.columns.forEach((column, index) => {
      const row = document.createElement('div'); row.className = 'column-manager-row';
      const order = document.createElement('span'); order.className = 'column-order'; order.textContent = String(index + 1);
      const input = document.createElement('input'); input.type = 'text'; input.maxLength = 50; input.value = column.name; input.setAttribute('aria-label', `Column ${index + 1} name`);
      input.addEventListener('change', () => renameColumn(column.id, input.value));
      const up = document.createElement('button'); up.type = 'button'; up.className = 'small-icon-button'; up.textContent = '↑'; up.title = 'Move column left'; up.disabled = index === 0; up.addEventListener('click', () => moveColumn(index, index - 1));
      const down = document.createElement('button'); down.type = 'button'; down.className = 'small-icon-button'; down.textContent = '↓'; down.title = 'Move column right'; down.disabled = index === state.columns.length - 1; down.addEventListener('click', () => moveColumn(index, index + 1));
      const del = document.createElement('button'); del.type = 'button'; del.className = 'small-icon-button delete'; del.textContent = 'Delete'; del.title = 'Delete column'; del.disabled = state.columns.length <= 1; del.addEventListener('click', () => deleteColumn(column.id));
      row.append(order, input, up, down, del);
      els.columnManager.appendChild(row);
    });
  }

  function touchColumns() { state.columnsUpdatedAt = nowIso(); }
  function renameColumn(id, name) {
    const cleaned = name.trim().slice(0, 50);
    const column = state.columns.find(c => c.id === id);
    if (!column) return;
    if (!cleaned) { renderColumnManager(); showToast('Column name cannot be blank'); return; }
    column.name = cleaned; touchColumns(); saveState(); renderColumnManager();
  }
  function moveColumn(from, to) {
    if (to < 0 || to >= state.columns.length) return;
    state.columns.splice(to, 0, state.columns.splice(from, 1)[0]);
    touchColumns(); saveState(); renderColumnManager();
  }
  function addColumn(name) {
    const cleaned = name.trim().slice(0, 50);
    if (!cleaned) return;
    state.columns.push({ id: uuid(), name: cleaned });
    touchColumns(); saveState(); renderColumnManager();
  }
  function deleteColumn(id) {
    if (state.columns.length <= 1) return;
    const column = state.columns.find(c => c.id === id);
    if (!column) return;
    const fallback = state.columns.find(c => c.id !== id);
    const affected = state.shows.filter(s => !s.archive && s.columnId === id);
    const message = affected.length
      ? `Delete “${column.name}”? Its ${affected.length} ${affected.length === 1 ? 'show' : 'shows'} will move to “${fallback.name}”.`
      : `Delete “${column.name}”?`;
    if (!confirm(message)) return;
    const t = nowIso();
    for (const show of affected) { show.columnId = fallback.id; show.updatedAt = t; }
    state.columns = state.columns.filter(c => c.id !== id);
    touchColumns(); normalizeColumnOrder(fallback.id); saveState(); renderColumnManager();
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('show');
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function setSyncStatus(kind, text) {
    els.statusDot.className = `status-dot${kind ? ` ${kind}` : ''}`;
    els.syncLabel.textContent = text;
  }
  function relativeTime(iso) {
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 60000) return 'just now';
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
    if (ms < 86400000) return `${Math.floor(ms / 3600000)}h ago`;
    return `${Math.floor(ms / 86400000)}d ago`;
  }
  function getRedirectUri() {
    if (!/^https?:$/.test(location.protocol)) return '';
    return location.origin + location.pathname;
  }

  function updateTmdbUI() {
    const configured = !!prefs.tmdbCredential;
    els.tmdbStatus.textContent = configured ? 'Configured' : 'Not configured';
    if (document.activeElement !== els.tmdbCredential) els.tmdbCredential.value = prefs.tmdbCredential || '';
    els.refreshProvidersButton.disabled = !configured || providerRefreshRunning;
  }

  async function saveAndTestTmdb() {
    const credential = els.tmdbCredential.value.trim();
    if (!credential) {
      prefs.tmdbCredential = ''; savePrefs(); showToast('TMDB credential removed'); return;
    }
    els.saveTmdbButton.disabled = true;
    els.saveTmdbButton.textContent = 'Testing…';
    try {
      await tmdbFetch('/authentication', {}, credential);
      prefs.tmdbCredential = credential;
      savePrefs();
      showToast('TMDB connected');
      refreshAllProviders({ interactive: false, includeUnlinked: false });
    } catch (err) {
      console.error(err);
      showToast('TMDB credential was not accepted');
    } finally {
      els.saveTmdbButton.disabled = false;
      els.saveTmdbButton.textContent = 'Save & test';
      updateTmdbUI();
    }
  }

  async function refreshAllProviders({ interactive = true, includeUnlinked = true } = {}) {
    if (!prefs.tmdbCredential || providerRefreshRunning) return;
    providerRefreshRunning = true;
    updateTmdbUI();
    const shows = state.shows.filter(show => includeUnlinked || show.tmdbId || show.imdbId);
    let refreshed = 0, unmatched = 0, failed = 0;
    try {
      for (const show of shows) {
        try {
          const streaming = await fetchCanadianProviders(show);
          if (!streaming.resolved) { unmatched++; continue; }
          const before = JSON.stringify([show.tmdbId, show.providers, show.providerLink]);
          show.tmdbId = streaming.tmdbId;
          show.providers = streaming.providers;
          show.providerLink = streaming.providerLink;
          show.providersUpdatedAt = streaming.providersUpdatedAt;
          if (JSON.stringify([show.tmdbId, show.providers, show.providerLink]) !== before) show.updatedAt = nowIso();
          refreshed++;
        } catch (err) { console.error(err); failed++; }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      render();
      if (dbx.connected && refreshed) scheduleSync();
      if (interactive) {
        const parts = [`${refreshed} ${refreshed === 1 ? 'show' : 'shows'} checked`];
        if (unmatched) parts.push(`${unmatched} not matched`);
        if (failed) parts.push(`${failed} failed`);
        showToast(parts.join(' · '));
      }
    } finally {
      providerRefreshRunning = false;
      updateTmdbUI();
    }
  }

  function maybeAutoRefreshProviders() {
    if (!prefs.tmdbCredential || providerRefreshRunning) return;
    const cutoff = Date.now() - 7 * 86400000;
    const stale = state.shows.some(show => (show.tmdbId || show.imdbId) && (!show.providersUpdatedAt || new Date(show.providersUpdatedAt).getTime() < cutoff));
    if (stale) refreshAllProviders({ interactive: false, includeUnlinked: false });
  }

  function updateDropboxUI() {
    const connected = !!dbx.connected;
    els.dropboxSetup.hidden = connected;
    els.dropboxConnected.hidden = !connected;
    els.dropboxStatus.textContent = connected ? 'Connected' : 'Not connected';
    els.dropboxAppKey.value = dbx.appKey || '';
    const redirect = getRedirectUri();
    els.redirectUriText.textContent = redirect || 'Available after the app is hosted on HTTPS';
    els.connectDropboxButton.disabled = !redirect;
    if (connected) {
      setSyncStatus('connected', dbx.lastSync ? `Dropbox · synced ${relativeTime(dbx.lastSync)}` : 'Dropbox connected');
      els.footerMessage.textContent = 'Your TV board is saved locally and synced with your private Dropbox app folder.';
    } else {
      setSyncStatus('', 'Saved on this device');
      els.footerMessage.textContent = 'Your TV board is stored only in this browser.';
    }
  }

  function base64Url(bytes) {
    let binary = '';
    new Uint8Array(bytes).forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function randomString(size = 64) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return base64Url(bytes); }
  async function sha256(text) { return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); }

  async function connectDropbox() {
    const appKey = els.dropboxAppKey.value.trim();
    if (!appKey) { showToast('Paste your Dropbox App Key first'); return; }
    const redirect = getRedirectUri();
    if (!redirect) { showToast('Host the app on HTTPS before connecting Dropbox'); return; }
    dbx.appKey = appKey; saveDropbox();
    const verifier = randomString(64);
    const challenge = base64Url(await sha256(verifier));
    const stateValue = randomString(24);
    localStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state: stateValue, appKey, startedAt: Date.now() }));
    const params = new URLSearchParams({
      client_id: appKey,
      response_type: 'code',
      redirect_uri: redirect,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      token_access_type: 'offline',
      state: stateValue
    });
    location.assign(`https://www.dropbox.com/oauth2/authorize?${params.toString()}`);
  }

  async function handleOAuthReturn() {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const returnedState = params.get('state');
    const error = params.get('error_description') || params.get('error');
    if (error) {
      history.replaceState({}, '', getRedirectUri() || location.pathname);
      showToast(`Dropbox: ${error}`); return;
    }
    if (!code) return;
    let pkce; try { pkce = JSON.parse(localStorage.getItem(PKCE_KEY)); } catch (_) {}
    if (!pkce || !pkce.verifier || !pkce.appKey || returnedState !== pkce.state) {
      history.replaceState({}, '', getRedirectUri() || location.pathname);
      showToast('Dropbox connection could not be verified'); return;
    }
    setSyncStatus('syncing', 'Connecting Dropbox…');
    try {
      const body = new URLSearchParams({ code, grant_type: 'authorization_code', redirect_uri: getRedirectUri(), client_id: pkce.appKey, code_verifier: pkce.verifier });
      const response = await fetch('https://api.dropboxapi.com/oauth2/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!response.ok) throw new Error(await response.text());
      const token = await response.json();
      dbx = { connected: true, appKey: pkce.appKey, accessToken: token.access_token, refreshToken: token.refresh_token || null,
        expiresAt: Date.now() + ((token.expires_in || 14400) * 1000) - 60000, accountId: token.account_id || null, lastSync: null };
      saveDropbox(); localStorage.removeItem(PKCE_KEY); history.replaceState({}, '', getRedirectUri());
      await syncWithDropbox({ announce: true });
    } catch (err) {
      console.error(err); history.replaceState({}, '', getRedirectUri() || location.pathname);
      setSyncStatus('error', 'Dropbox connection failed'); showToast('Could not connect Dropbox. Check the app key and redirect URI.');
    }
  }

  async function validAccessToken() {
    if (!dbx.connected || !dbx.accessToken) throw new Error('Dropbox is not connected');
    if (!dbx.expiresAt || Date.now() < dbx.expiresAt) return dbx.accessToken;
    if (!dbx.refreshToken) throw new Error('Dropbox authorization expired. Reconnect Dropbox.');
    const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: dbx.refreshToken, client_id: dbx.appKey });
    const response = await fetch('https://api.dropboxapi.com/oauth2/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    if (!response.ok) throw new Error(await response.text());
    const token = await response.json(); dbx.accessToken = token.access_token; dbx.expiresAt = Date.now() + ((token.expires_in || 14400) * 1000) - 60000; saveDropbox();
    return dbx.accessToken;
  }

  async function dropboxDownload() {
    const token = await validAccessToken();
    const response = await fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Dropbox-API-Arg': JSON.stringify({ path: DATA_PATH }) }
    });
    if (response.status === 409) return null;
    if (!response.ok) throw new Error(await response.text());
    return JSON.parse(await response.text());
  }

  async function dropboxUpload(data) {
    const token = await validAccessToken();
    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({ path: DATA_PATH, mode: 'overwrite', autorename: false, mute: true }) },
      body: JSON.stringify({ ...data, version: 1, syncedAt: nowIso() }, null, 2)
    });
    if (!response.ok) throw new Error(await response.text());
  }

  function mergeStates(localRaw, remoteRaw) {
    const local = normalizeState(localRaw);
    if (!remoteRaw || !Array.isArray(remoteRaw.shows)) return local;
    const remote = normalizeState(remoteRaw);
    const columnsSource = new Date(remote.columnsUpdatedAt) > new Date(local.columnsUpdatedAt) ? remote : local;
    const columns = columnsSource.columns;
    const columnsUpdatedAt = columnsSource.columnsUpdatedAt;
    const validIds = new Set(columns.map(c => c.id));
    const fallbackId = columns[0].id;
    const shows = new Map();
    const tombstones = new Map();

    for (const d of [...remote.deleted, ...local.deleted]) {
      const old = tombstones.get(d.id);
      if (!old || new Date(d.deletedAt) > new Date(old.deletedAt)) tombstones.set(d.id, d);
    }
    for (const s of [...remote.shows, ...local.shows]) {
      const normalized = { ...s, columnId: validIds.has(s.columnId) ? s.columnId : fallbackId };
      const old = shows.get(s.id);
      if (!old || new Date(normalized.updatedAt || 0) > new Date(old.updatedAt || 0)) shows.set(s.id, normalized);
    }
    for (const [id, deleted] of tombstones.entries()) {
      const s = shows.get(id);
      if (!s || new Date(deleted.deletedAt) >= new Date(s.updatedAt || 0)) shows.delete(id);
      else tombstones.delete(id);
    }
    const cutoff = Date.now() - 180 * 86400000;
    const deleted = [...tombstones.values()].filter(d => new Date(d.deletedAt).getTime() >= cutoff);
    return normalizeState({ version: 1, columns, columnsUpdatedAt, shows: [...shows.values()], deleted });
  }

  function scheduleSync() {
    clearTimeout(syncTimer); setSyncStatus('syncing', 'Dropbox · saving…');
    syncTimer = setTimeout(() => syncWithDropbox(), 500);
  }
  async function syncWithDropbox({ announce = false } = {}) {
    if (!dbx.connected) return;
    setSyncStatus('syncing', 'Dropbox · syncing…');
    try {
      const remote = await dropboxDownload();
      state = mergeStates(state, remote); localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      await dropboxUpload(state); dbx.lastSync = nowIso(); saveDropbox(); render();
      if (announce) showToast('Dropbox connected and synced');
    } catch (err) {
      console.error(err); setSyncStatus('error', 'Dropbox · sync problem'); showToast('Dropbox sync failed. Your board is still saved on this device.');
    }
  }
  function disconnectDropbox() {
    if (!confirm('Disconnect Dropbox on this device? Your local TV board will remain.')) return;
    const appKey = dbx.appKey || ''; dbx = { connected: false, appKey }; saveDropbox(); showToast('Dropbox disconnected');
  }

  function localDateStamp() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function exportBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `tv-board-backup-${localDateStamp()}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showToast('Backup exported');
  }
  async function importBackup(file) {
    try {
      const incoming = JSON.parse(await file.text());
      if (!incoming || !Array.isArray(incoming.shows) || !Array.isArray(incoming.columns)) throw new Error('Invalid backup');
      state = mergeStates(state, incoming); saveState(); showToast('Backup imported');
    } catch (_) { showToast('That file is not a valid TV Board backup'); }
    finally { els.importInput.value = ''; }
  }

  document.querySelectorAll('.view-tab').forEach(button => button.addEventListener('click', () => { activeView = button.dataset.view; render(); }));
  els.searchInput.addEventListener('input', render);
  els.archiveSort.addEventListener('change', render);
  els.addButton.addEventListener('click', () => openShowDialog());
  els.lookupShowButton.addEventListener('click', lookupShows);
  els.showTitle.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !els.lookupResults.hidden) { e.preventDefault(); }
  });
  els.showForm.addEventListener('submit', e => {
    if (e.submitter?.value === 'cancel') return;
    e.preventDefault(); if (upsertShow()) els.showDialog.close();
  });
  els.deleteShowButton.addEventListener('click', deleteCurrentShow);

  els.columnsButton.addEventListener('click', () => { renderColumnManager(); els.columnsDialog.showModal(); });
  els.quickAddColumnButton.addEventListener('click', openColumnManagerForAdd);
  els.closeColumnsButton.addEventListener('click', () => els.columnsDialog.close());
  els.addColumnForm.addEventListener('submit', e => { e.preventDefault(); addColumn(els.newColumnName.value); els.newColumnName.value = ''; els.newColumnName.focus(); });

  els.settingsButton.addEventListener('click', () => { updateDropboxUI(); updateTmdbUI(); els.settingsDialog.showModal(); });
  els.closeSettingsButton.addEventListener('click', () => els.settingsDialog.close());
  els.saveTmdbButton.addEventListener('click', saveAndTestTmdb);
  els.refreshProvidersButton.addEventListener('click', () => refreshAllProviders({ interactive: true, includeUnlinked: true }));
  els.copyRedirectButton.addEventListener('click', async () => {
    const redirect = getRedirectUri();
    if (!redirect) { showToast('Host the app on HTTPS first'); return; }
    try { await navigator.clipboard.writeText(redirect); showToast('Redirect URI copied'); }
    catch (_) { showToast('Could not copy automatically'); }
  });
  els.connectDropboxButton.addEventListener('click', connectDropbox);
  els.syncNowButton.addEventListener('click', () => syncWithDropbox({ announce: true }));
  els.disconnectDropboxButton.addEventListener('click', disconnectDropbox);
  els.exportButton.addEventListener('click', exportBackup);
  els.importInput.addEventListener('change', () => { if (els.importInput.files?.[0]) importBackup(els.importInput.files[0]); });

  window.addEventListener('focus', () => { if (dbx.connected) syncWithDropbox(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && dbx.connected) syncWithDropbox(); });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(() => {});

  render();
  updateTmdbUI();
  handleOAuthReturn().then(() => {
    if (dbx.connected && !new URLSearchParams(location.search).get('code')) syncWithDropbox();
    setTimeout(maybeAutoRefreshProviders, 700);
  });
})();

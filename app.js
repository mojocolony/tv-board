(() => {
  'use strict';

  const APP_VERSION = '2.3.0';
  const STORAGE_KEY = 'tvBoard.state.v1';
  const DROPBOX_KEY = 'tvBoard.dropbox.v1';
  const PKCE_KEY = 'tvBoard.pkce.v1';
  const PREFS_KEY = 'tvBoard.settings.v1';
  const UI_KEY = 'tvBoard.ui.v2';
  const DATA_PATH = '/tv-board.json';
  const ARCHIVE_WATCHED = 'watched';
  const ARCHIVE_ABANDONED = 'abandoned';
  const TOMBSTONE_DAYS = 180;

  const $ = id => document.getElementById(id);
  const els = {
    sidebar: $('sidebar'), sidebarScrim: $('sidebarScrim'), mobileMenuButton: $('mobileMenuButton'),
    statusNav: $('statusNav'), watchingWithSection: $('watchingWithSection'), watchingWithNav: $('watchingWithNav'), savedViewsNav: $('savedViewsNav'), allCount: $('allCount'), favouritesCount: $('favouritesCount'), watchedCount: $('watchedCount'), abandonedCount: $('abandonedCount'),
    manageSavedViewsButton: $('manageSavedViewsButton'), settingsButton: $('settingsButton'),
    viewTitle: $('viewTitle'), viewSubtitle: $('viewSubtitle'), syncChip: $('syncChip'), statusDot: $('statusDot'), syncLabel: $('syncLabel'),
    addShowButton: $('addShowButton'), emptyAddButton: $('emptyAddButton'), searchInput: $('searchInput'), filterButton: $('filterButton'), filterBadge: $('filterBadge'), sortSelect: $('sortSelect'),
    activeFilters: $('activeFilters'), showList: $('showList'), emptyState: $('emptyState'), emptyTitle: $('emptyTitle'), emptyText: $('emptyText'), footerMessage: $('footerMessage'),
    filterDrawer: $('filterDrawer'), drawerScrim: $('drawerScrim'), closeFilterButton: $('closeFilterButton'), filterStatuses: $('filterStatuses'), filterGenres: $('filterGenres'), filterEpisodes: $('filterEpisodes'),
    filterTime: $('filterTime'), filterWatchingWith: $('filterWatchingWith'), filterYearFrom: $('filterYearFrom'), filterYearTo: $('filterYearTo'), filterRating: $('filterRating'), filterFavourite: $('filterFavourite'), filterNetworks: $('filterNetworks'), filterTags: $('filterTags'),
    clearFiltersButton: $('clearFiltersButton'), saveViewButton: $('saveViewButton'), applyFiltersButton: $('applyFiltersButton'),
    showDialog: $('showDialog'), showForm: $('showForm'), showDialogTitle: $('showDialogTitle'), showId: $('showId'), showTitle: $('showTitle'), showLocation: $('showLocation'), showRating: $('showRating'), showFavourite: $('showFavourite'), showFavouriteText: $('showFavouriteText'),
    showPoster: $('showPoster'), posterPreview: $('posterPreview'), lookupShowButton: $('lookupShowButton'), lookupStatus: $('lookupStatus'), lookupResults: $('lookupResults'), showYear: $('showYear'), showSeasons: $('showSeasons'), showEpisodes: $('showEpisodes'),
    showRuntime: $('showRuntime'), showTotalMinutes: $('showTotalMinutes'), showSeriesStatus: $('showSeriesStatus'), showNetwork: $('showNetwork'), showCountry: $('showCountry'), showWatchingWith: $('showWatchingWith'), showGenres: $('showGenres'), showMetacritic: $('showMetacritic'),
    networkOptions: $('networkOptions'), countryOptions: $('countryOptions'), watchingWithOptions: $('watchingWithOptions'), genresPicker: $('genresPicker'), genresPickerSummary: $('genresPickerSummary'), genreChoices: $('genreChoices'), genreAddInput: $('genreAddInput'), genreAddButton: $('genreAddButton'), tagsPicker: $('tagsPicker'), tagsPickerSummary: $('tagsPickerSummary'), tagChoices: $('tagChoices'), tagAddInput: $('tagAddInput'), tagAddButton: $('tagAddButton'),
    streamingProvidersText: $('streamingProvidersText'), streamingProvidersNote: $('streamingProvidersNote'), refreshShowStreamingButton: $('refreshShowStreamingButton'), showTags: $('showTags'), showNotes: $('showNotes'),
    deleteShowButton: $('deleteShowButton'), closeShowButton: $('closeShowButton'), cancelShowButton: $('cancelShowButton'),
    statusesDialog: $('statusesDialog'), closeStatusesButton: $('closeStatusesButton'), statusManager: $('statusManager'), addStatusForm: $('addStatusForm'), newStatusName: $('newStatusName'),
    savedViewsDialog: $('savedViewsDialog'), closeSavedViewsButton: $('closeSavedViewsButton'), savedViewManager: $('savedViewManager'),
    settingsDialog: $('settingsDialog'), closeSettingsButton: $('closeSettingsButton'), openStatusesButton: $('openStatusesButton'), exportButton: $('exportButton'), importInput: $('importInput'),
    tmdbStatus: $('tmdbStatus'), tmdbCredential: $('tmdbCredential'), tmdbTestMessage: $('tmdbTestMessage'), saveTmdbButton: $('saveTmdbButton'), refreshProvidersButton: $('refreshProvidersButton'),
    dropboxStatus: $('dropboxStatus'), dropboxSetup: $('dropboxSetup'), dropboxConnected: $('dropboxConnected'), dropboxAppKey: $('dropboxAppKey'), redirectUriText: $('redirectUriText'), copyRedirectButton: $('copyRedirectButton'),
    connectDropboxButton: $('connectDropboxButton'), syncNowButton: $('syncNowButton'), disconnectDropboxButton: $('disconnectDropboxButton'), fontSizeSelector: $('fontSizeSelector'), episodeGuideCard: $('episodeGuideCard'), episodeGuideStatus: $('episodeGuideStatus'), episodeProgressSummary: $('episodeProgressSummary'), episodeGuide: $('episodeGuide'), refreshEpisodesButton: $('refreshEpisodesButton'), toast: $('toast')
  };

  const ICONS = {
    library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    archive: '<path d="M3 6h18"/><path d="M5 6v14h14V6"/><path d="M9 10h6"/><path d="M4 3h16v3H4z"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1A1.7 1.7 0 0 0 9 19.3a1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.3-1.9L4.3 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.7 1.7 1.7 0 0 0 10 3.1V3h4v.1A1.7 1.7 0 0 0 15 4.7a1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    filter: '<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>',
    sort: '<path d="M3 6h18"/><path d="M6 12h12"/><path d="M10 18h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    tv: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m8 2 4 3 4-3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    tag: '<path d="M20 13 13 20l-9-9V4h7l9 9Z"/><circle cx="8.5" cy="8.5" r="1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    play: '<path d="m7 4 13 8-13 8V4Z"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>'
  };

  function iconSvg(name) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.tv}</svg>`;
  }
  function renderIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(el => {
      if (!el.dataset.iconRendered) {
        el.innerHTML = iconSvg(el.dataset.icon);
        el.dataset.iconRendered = '1';
      }
    });
  }

  let state = loadState();
  let dbx = loadDropbox();
  let prefs = loadPrefs();
  let ui = loadUi();
  let activeView = ui.activeView || 'all';
  let filters = normalizeFilters(ui.filters);
  let filterDraft = clone(filters);
  let sortMode = ui.sort || 'recent';
  let draftMeta = {};
  let lookupController = null;
  let syncTimer = null;
  let toastTimer = null;
  let providerRefreshRunning = false;
  let lastShowTrigger = null;
  let lastShowOpenedByPointer = false;

  function nowIso() { return new Date().toISOString(); }
  function uuid() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function validDateString(value) { return typeof value === 'string' && !Number.isNaN(Date.parse(value)); }
  function integerOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const n = Math.round(Number(value));
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  function positiveIntegerOrNull(value) {
    const n = integerOrNull(value);
    return n !== null && n > 0 ? n : null;
  }
  function clampRating(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(5, Math.round(n * 2) / 2));
  }
  function safeUrl(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    try {
      const url = new URL(text);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) { return ''; }
  }
  function cleanList(items, max = 30, maxLength = 80) {
    const seen = new Set();
    return (Array.isArray(items) ? items : []).map(x => String(x || '').trim()).filter(Boolean).map(x => x.slice(0, maxLength)).filter(x => {
      const key = x.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, max);
  }
  function cleanTags(items) { return cleanList(items, 25, 40); }
  function cleanGenres(items) { return cleanList(items, 20, 50); }
  function cleanProviders(items) { return cleanList(items, 20, 80); }
  function splitComma(text) { return String(text || '').split(',').map(s => s.trim()).filter(Boolean); }
  function safeText(value, max = 200) { return String(value || '').trim().slice(0, max); }
  function slugify(value) {
    return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function defaultColour(index) {
    const palette = ['#476b86', '#6f7651', '#8b684f', '#76617d', '#496f6b', '#77654f', '#6b6f78'];
    return palette[index % palette.length];
  }
  function safeColour(value, index = 0) { return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value) : defaultColour(index); }
  function hexAlpha(hex, alpha = .12) {
    const h = String(hex || '').replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(h)) return `rgba(80,80,80,${alpha})`;
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function normalizeEpisodeProgress(value) {
    if (!value || typeof value !== 'object') return null;
    const season = positiveIntegerOrNull(value.season ?? value.throughSeason);
    const episode = positiveIntegerOrNull(value.episode ?? value.throughEpisode);
    if (!season || !episode) return null;
    return {
      season, episode,
      episodeId: positiveIntegerOrNull(value.episodeId ?? value.throughEpisodeId),
      title: safeText(value.title || value.throughTitle || '', 160),
      nextSeason: positiveIntegerOrNull(value.nextSeason),
      nextEpisode: positiveIntegerOrNull(value.nextEpisode),
      nextEpisodeId: positiveIntegerOrNull(value.nextEpisodeId),
      nextTitle: safeText(value.nextTitle || '', 160),
      watchedCount: positiveIntegerOrNull(value.watchedCount),
      totalCount: positiveIntegerOrNull(value.totalCount),
      updatedAt: validDateString(value.updatedAt) ? value.updatedAt : nowIso()
    };
  }

  function defaultState() {
    const t = nowIso();
    return {
      version: 2,
      columnsUpdatedAt: t,
      columns: [
        { id: 'watching', name: 'Watching', order: 0, color: defaultColour(0), updatedAt: t },
        { id: 'next', name: 'Next', order: 1, color: defaultColour(1), updatedAt: t },
        { id: 'someday', name: 'Someday', order: 2, color: defaultColour(2), updatedAt: t },
        { id: 'waiting', name: 'Waiting for New Season', order: 3, color: defaultColour(3), updatedAt: t }
      ],
      columnDeleted: [],
      shows: [],
      deleted: [],
      savedViews: [],
      savedViewsUpdatedAt: t
    };
  }

  function normalizeState(raw) {
    const fallback = defaultState();
    if (!raw || typeof raw !== 'object') return fallback;
    const legacyColumnsUpdatedAt = validDateString(raw.columnsUpdatedAt) ? raw.columnsUpdatedAt : nowIso();
    let columns = Array.isArray(raw.columns) && raw.columns.length
      ? raw.columns.filter(c => c && c.id && c.name).map((c, index) => ({
          id: safeText(c.id, 80),
          name: safeText(c.name, 50),
          order: Number.isFinite(Number(c.order)) ? Number(c.order) : index,
          color: safeColour(c.color, index),
          updatedAt: validDateString(c.updatedAt) ? c.updatedAt : legacyColumnsUpdatedAt
        }))
      : fallback.columns;

    const columnDeleted = latestTombstones(Array.isArray(raw.columnDeleted) ? raw.columnDeleted : []);
    const colTombs = new Map(columnDeleted.map(d => [d.id, d]));
    columns = columns.filter(c => {
      const tomb = colTombs.get(c.id);
      return !tomb || new Date(c.updatedAt) > new Date(tomb.deletedAt);
    }).sort((a,b) => a.order - b.order || a.name.localeCompare(b.name));
    if (!columns.length) columns = fallback.columns;
    columns.forEach((c,i) => { c.order = i; c.color = safeColour(c.color, i); });
    const legacyWithColumns = new Map(columns.filter(c => /^with\s+/i.test(c.name)).map(c => [c.id, c.name.replace(/^with\s+/i, '').trim()]));
    const watchingColumn = columns.find(c => c.id === 'watching' || c.name.toLowerCase() === 'watching');
    if (watchingColumn && legacyWithColumns.size) {
      columns = columns.filter(c => !legacyWithColumns.has(c.id));
      columns.forEach((c,i) => { c.order = i; });
    }
    const validIds = new Set(columns.map(c => c.id));
    const first = columns[0].id;

    const shows = Array.isArray(raw.shows) ? raw.shows.filter(s => s && s.id && s.title).map((s, index) => {
      const archive = s.archive === ARCHIVE_WATCHED || s.archive === ARCHIVE_ABANDONED ? s.archive : null;
      const updatedAt = validDateString(s.updatedAt) ? s.updatedAt : nowIso();
      const createdAt = validDateString(s.createdAt) ? s.createdAt : updatedAt;
      const genres = Array.isArray(s.genres) ? cleanGenres(s.genres) : cleanGenres(splitComma(s.genres));
      return {
        id: safeText(s.id, 100),
        title: safeText(s.title, 120),
        columnId: legacyWithColumns.has(String(s.columnId)) && watchingColumn ? watchingColumn.id : (validIds.has(String(s.columnId)) ? String(s.columnId) : first),
        archive,
        poster: safeUrl(s.poster || ''),
        metacritic: safeUrl(s.metacritic || ''),
        seasons: integerOrNull(s.seasons),
        episodes: integerOrNull(s.episodes),
        runtime: integerOrNull(s.runtime ?? s.averageRuntime),
        totalMinutes: integerOrNull(s.totalMinutes),
        genres,
        network: safeText(s.network || s.webChannel || '', 100),
        country: safeText(s.country || '', 80),
        seriesStatus: safeText(s.seriesStatus || s.status || '', 50),
        watchingWith: safeText(s.watchingWith || s.viewingWith || legacyWithColumns.get(String(s.columnId)) || '', 60),
        favourite: Boolean(s.favourite || s.favorite),
        tags: Array.isArray(s.tags) ? cleanTags(s.tags) : cleanTags(splitComma(s.tags)),
        rating: clampRating(s.rating),
        notes: String(s.notes || '').slice(0, 4000),
        tvmazeId: positiveIntegerOrNull(s.tvmazeId),
        imdbId: safeText(s.imdbId || '', 40),
        tmdbId: positiveIntegerOrNull(s.tmdbId),
        firstAirYear: positiveIntegerOrNull(s.firstAirYear ?? s.year),
        providers: cleanProviders(s.providers),
        providersUpdatedAt: validDateString(s.providersUpdatedAt) ? s.providersUpdatedAt : null,
        providerLink: safeUrl(s.providerLink || ''),
        episodeProgress: normalizeEpisodeProgress(s.episodeProgress || s.progress),
        order: Number.isFinite(Number(s.order)) ? Number(s.order) : index,
        createdAt,
        updatedAt
      };
    }) : [];

    const deleted = latestTombstones(Array.isArray(raw.deleted) ? raw.deleted : []);
    const showTombs = new Map(deleted.map(d => [d.id, d]));
    const survivingShows = shows.filter(s => {
      const tomb = showTombs.get(s.id);
      return !tomb || new Date(s.updatedAt) > new Date(tomb.deletedAt);
    });

    const savedViews = Array.isArray(raw.savedViews) ? raw.savedViews.filter(v => v && v.id && v.name).map(v => ({
      id: safeText(v.id, 100), name: safeText(v.name, 60), filters: normalizeFilters(v.filters), sort: validSort(v.sort) ? v.sort : 'recent', updatedAt: validDateString(v.updatedAt) ? v.updatedAt : nowIso()
    })) : [];

    return {
      version: 2,
      columnsUpdatedAt: legacyColumnsUpdatedAt,
      columns,
      columnDeleted,
      shows: survivingShows,
      deleted,
      savedViews,
      savedViewsUpdatedAt: validDateString(raw.savedViewsUpdatedAt) ? raw.savedViewsUpdatedAt : nowIso()
    };
  }

  function latestTombstones(items) {
    const cutoff = Date.now() - TOMBSTONE_DAYS * 86400000;
    const map = new Map();
    for (const d of items) {
      if (!d || !d.id || !validDateString(d.deletedAt) || Date.parse(d.deletedAt) < cutoff) continue;
      const item = { id: safeText(d.id, 100), deletedAt: d.deletedAt };
      const old = map.get(item.id);
      if (!old || Date.parse(item.deletedAt) > Date.parse(old.deletedAt)) map.set(item.id, item);
    }
    return [...map.values()];
  }

  function loadState() {
    try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
    catch (_) { return defaultState(); }
  }
  function loadDropbox() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DROPBOX_KEY));
      return parsed && typeof parsed === 'object' ? { connected: false, ...parsed } : { connected: false };
    } catch (_) { return { connected: false }; }
  }
  function loadPrefs() {
    try {
      const parsed = JSON.parse(localStorage.getItem(PREFS_KEY));
      return parsed && typeof parsed === 'object' ? { tmdbCredential: '', fontSize: 'standard', ...parsed } : { tmdbCredential: '', fontSize: 'standard' };
    } catch (_) { return { tmdbCredential: '', fontSize: 'standard' }; }
  }
  function loadUi() {
    try {
      const parsed = JSON.parse(localStorage.getItem(UI_KEY));
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) { return {}; }
  }
  function saveUi() {
    ui = { activeView, filters, sort: sortMode };
    localStorage.setItem(UI_KEY, JSON.stringify(ui));
  }
  function savePrefs() { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); updateTmdbUI(); applyFontSize(); }
  function saveDropbox() { localStorage.setItem(DROPBOX_KEY, JSON.stringify(dbx)); updateDropboxUI(); }
  function saveState({ sync = true, rerender = true } = {}) {
    state = normalizeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (rerender) render();
    if (sync && dbx.connected) scheduleSync();
  }

  function emptyFilters() {
    return { statuses: [], watchingWith: [], genres: [], episodes: '', time: '', yearFrom: '', yearTo: '', rating: '', favourite: '', networks: [], tags: [] };
  }
  function normalizeFilters(raw) {
    const f = { ...emptyFilters(), ...(raw || {}) };
    return {
      statuses: cleanList(f.statuses, 50, 100),
      watchingWith: cleanList(f.watchingWith, 50, 60),
      genres: cleanGenres(f.genres),
      episodes: ['','1-6','7-12','13-24','25-49','50+'].includes(f.episodes) ? f.episodes : '',
      time: ['','under5','under10','10-20','20-40','40+'].includes(f.time) ? f.time : '',
      yearFrom: /^\d{4}$/.test(String(f.yearFrom || '')) ? String(f.yearFrom) : '',
      yearTo: /^\d{4}$/.test(String(f.yearTo || '')) ? String(f.yearTo) : '',
      rating: ['','5','4.5','4','3','unrated'].includes(String(f.rating ?? '')) ? String(f.rating ?? '') : '',
      favourite: ['','yes','no'].includes(f.favourite) ? f.favourite : '',
      networks: cleanList(f.networks, 50, 100),
      tags: cleanTags(f.tags)
    };
  }
  function validSort(value) {
    return ['recent','added','title-asc','title-desc','year-desc','year-asc','rating-desc','rating-asc','episodes-asc','episodes-desc','time-asc','time-desc','network','status'].includes(value);
  }

  function statusFor(show) {
    if (show.archive === ARCHIVE_WATCHED) return { id: ARCHIVE_WATCHED, name: 'Watched', color: '#77766f', archive: true };
    if (show.archive === ARCHIVE_ABANDONED) return { id: ARCHIVE_ABANDONED, name: 'Abandoned', color: '#8a7c72', archive: true };
    return state.columns.find(c => c.id === show.columnId) || state.columns[0];
  }
  function effectiveTotalMinutes(show) {
    if (Number.isFinite(show.totalMinutes) && show.totalMinutes > 0) return show.totalMinutes;
    if (Number.isFinite(show.episodes) && show.episodes > 0 && Number.isFinite(show.runtime) && show.runtime > 0) return show.episodes * show.runtime;
    return null;
  }
  function formatDuration(minutes) {
    if (!Number.isFinite(minutes) || minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h < 1) return `${m}m`;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  function formatRating(rating) {
    if (!rating) return 'Unrated';
    const whole = Math.floor(rating);
    const half = rating % 1 ? '½' : '';
    return `${whole}${half} ★`;
  }
  function showNetworkLabel(show) {
    return show.network || (show.providers && show.providers[0]) || '';
  }
  function allNetworkValues(show) {
    return cleanList([show.network, ...(show.providers || [])].filter(Boolean), 30, 100);
  }

  function baseViewMatch(show) {
    if (activeView === 'all') return true;
    if (activeView === 'favourites') return show.favourite;
    if (activeView === ARCHIVE_WATCHED) return show.archive === ARCHIVE_WATCHED;
    if (activeView === ARCHIVE_ABANDONED) return show.archive === ARCHIVE_ABANDONED;
    if (activeView.startsWith('status:')) return !show.archive && show.columnId === activeView.slice(7);
    if (activeView.startsWith('with:')) {
      const who = decodeURIComponent(activeView.slice(5)).toLowerCase();
      const watching = state.columns.find(c => c.id === 'watching' || c.name.toLowerCase() === 'watching');
      return !show.archive && (!watching || show.columnId === watching.id) && show.watchingWith.toLowerCase() === who;
    }
    if (activeView.startsWith('saved:')) return true;
    return true;
  }

  function searchMatch(show) {
    const q = els.searchInput.value.trim().toLowerCase();
    if (!q) return true;
    const haystack = [show.title, show.network, show.country, show.seriesStatus, show.watchingWith, ...(show.genres || []), ...(show.providers || []), ...(show.tags || []), show.notes].join(' ').toLowerCase();
    return haystack.includes(q);
  }

  function filtersMatch(show, f = filters) {
    if (f.statuses.length && !f.statuses.includes(statusFor(show).id)) return false;
    if (f.watchingWith.length && !f.watchingWith.some(w => show.watchingWith.toLowerCase() === w.toLowerCase())) return false;
    if (f.genres.length && !f.genres.some(g => show.genres.some(sg => sg.toLowerCase() === g.toLowerCase()))) return false;
    if (f.networks.length) {
      const values = allNetworkValues(show).map(x => x.toLowerCase());
      if (!f.networks.some(n => values.includes(n.toLowerCase()))) return false;
    }
    if (f.tags.length && !f.tags.some(t => show.tags.some(st => st.toLowerCase() === t.toLowerCase()))) return false;
    if (f.episodes) {
      const n = show.episodes;
      if (!Number.isFinite(n)) return false;
      if (f.episodes === '1-6' && !(n >= 1 && n <= 6)) return false;
      if (f.episodes === '7-12' && !(n >= 7 && n <= 12)) return false;
      if (f.episodes === '13-24' && !(n >= 13 && n <= 24)) return false;
      if (f.episodes === '25-49' && !(n >= 25 && n <= 49)) return false;
      if (f.episodes === '50+' && !(n >= 50)) return false;
    }
    if (f.time) {
      const minutes = effectiveTotalMinutes(show);
      if (!Number.isFinite(minutes)) return false;
      if (f.time === 'under5' && !(minutes < 300)) return false;
      if (f.time === 'under10' && !(minutes < 600)) return false;
      if (f.time === '10-20' && !(minutes >= 600 && minutes <= 1200)) return false;
      if (f.time === '20-40' && !(minutes > 1200 && minutes <= 2400)) return false;
      if (f.time === '40+' && !(minutes > 2400)) return false;
    }
    if (f.yearFrom && (!show.firstAirYear || show.firstAirYear < Number(f.yearFrom))) return false;
    if (f.yearTo && (!show.firstAirYear || show.firstAirYear > Number(f.yearTo))) return false;
    if (f.rating === 'unrated' && show.rating !== 0) return false;
    if (f.rating && f.rating !== 'unrated' && show.rating < Number(f.rating)) return false;
    if (f.favourite === 'yes' && !show.favourite) return false;
    if (f.favourite === 'no' && show.favourite) return false;
    return true;
  }

  function titleSortKey(title) {
    return String(title || '').trim().replace(/^(?:the|an|a)\s+/i, '').trim() || String(title || '').trim();
  }
  function compareShowTitles(a, b) {
    const primary = titleSortKey(a.title).localeCompare(titleSortKey(b.title), undefined, { sensitivity: 'base' });
    return primary || a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
  }
  function sortShows(shows) {
    const sorted = [...shows];
    const nvl = (n, fallback) => Number.isFinite(n) ? n : fallback;
    sorted.sort((a,b) => {
      switch (sortMode) {
        case 'added': return Date.parse(b.createdAt) - Date.parse(a.createdAt) || compareShowTitles(a,b);
        case 'title-asc': return compareShowTitles(a,b);
        case 'title-desc': return compareShowTitles(b,a);
        case 'year-desc': return nvl(b.firstAirYear, -1) - nvl(a.firstAirYear, -1) || compareShowTitles(a,b);
        case 'year-asc': return nvl(a.firstAirYear, 9999) - nvl(b.firstAirYear, 9999) || compareShowTitles(a,b);
        case 'rating-desc': return b.rating - a.rating || compareShowTitles(a,b);
        case 'rating-asc': return a.rating - b.rating || compareShowTitles(a,b);
        case 'episodes-asc': return nvl(a.episodes, 999999) - nvl(b.episodes, 999999) || compareShowTitles(a,b);
        case 'episodes-desc': return nvl(b.episodes, -1) - nvl(a.episodes, -1) || compareShowTitles(a,b);
        case 'time-asc': return nvl(effectiveTotalMinutes(a), 9999999) - nvl(effectiveTotalMinutes(b), 9999999) || compareShowTitles(a,b);
        case 'time-desc': return nvl(effectiveTotalMinutes(b), -1) - nvl(effectiveTotalMinutes(a), -1) || compareShowTitles(a,b);
        case 'network': return showNetworkLabel(a).localeCompare(showNetworkLabel(b), undefined, { sensitivity: 'base' }) || compareShowTitles(a,b);
        case 'status': return statusFor(a).name.localeCompare(statusFor(b).name) || compareShowTitles(a,b);
        case 'recent':
        default: return Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || compareShowTitles(a,b);
      }
    });
    return sorted;
  }

  function currentShows() {
    return sortShows(state.shows.filter(show => baseViewMatch(show) && searchMatch(show) && filtersMatch(show)));
  }

  function currentViewInfo() {
    if (activeView === 'all') return ['All Shows', 'Every show in your TV library.'];
    if (activeView === 'favourites') return ['Favourites', 'Shows you have marked as favourites.'];
    if (activeView === ARCHIVE_WATCHED) return ['Watched', 'Shows you have finished.'];
    if (activeView === ARCHIVE_ABANDONED) return ['Abandoned', 'Shows you stopped watching.'];
    if (activeView.startsWith('with:')) {
      const who = decodeURIComponent(activeView.slice(5));
      return [`With ${who}`, `Shows you are currently watching with ${who}.`];
    }
    if (activeView.startsWith('status:')) {
      const c = state.columns.find(x => x.id === activeView.slice(7));
      return [c?.name || 'Status', `Shows currently marked ${c?.name || 'with this status'}.`];
    }
    if (activeView.startsWith('saved:')) {
      const v = state.savedViews.find(x => x.id === activeView.slice(6));
      return [v?.name || 'Saved View', 'A saved combination of filters and sorting.'];
    }
    return ['All Shows', 'Every show in your TV library.'];
  }

  function validFontSize(value){ return ['small','standard','large','extra-large'].includes(value) ? value : 'standard'; }
  function applyFontSize(){
    prefs.fontSize=validFontSize(prefs.fontSize); document.documentElement.dataset.fontSize=prefs.fontSize;
    if(els.fontSizeSelector) els.fontSizeSelector.querySelectorAll('[data-font-size]').forEach(btn=>btn.classList.toggle('active',btn.dataset.fontSize===prefs.fontSize));
  }

  function render() {
    applyFontSize();
    state = normalizeState(state);
    if (activeView.startsWith('status:') && !state.columns.some(c => c.id === activeView.slice(7))) activeView = 'all';
    if (activeView.startsWith('with:') && !decodeURIComponent(activeView.slice(5))) activeView = 'all';
    if (activeView.startsWith('saved:') && !state.savedViews.some(v => v.id === activeView.slice(6))) activeView = 'all';
    saveUi();
    renderNavigation();
    renderHeader();
    renderActiveFilters();
    renderShowList();
    updateDropboxUI();
    updateTmdbUI();
    renderIcons();
  }

  function renderNavigation() {
    const activeShows = state.shows.filter(s => !s.archive);
    els.allCount.textContent = state.shows.length;
    els.favouritesCount.textContent = state.shows.filter(s => s.favourite).length;
    els.watchedCount.textContent = state.shows.filter(s => s.archive === ARCHIVE_WATCHED).length;
    els.abandonedCount.textContent = state.shows.filter(s => s.archive === ARCHIVE_ABANDONED).length;

    els.statusNav.replaceChildren();
    state.columns.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'nav-item'; btn.dataset.view = `status:${c.id}`;
      btn.innerHTML = `<span class="nav-icon">${iconSvg('bookmark')}</span><span></span><span class="nav-count">${activeShows.filter(s => s.columnId === c.id).length}</span>`;
      btn.children[1].textContent = c.name;
      els.statusNav.appendChild(btn);
    });

    const watching = state.columns.find(c => c.id === 'watching' || c.name.toLowerCase() === 'watching');
    const withValues = cleanList(state.shows.filter(s => !s.archive && (!watching || s.columnId === watching.id)).map(s => s.watchingWith).filter(Boolean), 50, 60).sort((a,b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    els.watchingWithNav.replaceChildren();
    els.watchingWithSection.hidden = withValues.length === 0;
    withValues.forEach(who => {
      const btn=document.createElement('button'); btn.className='nav-item'; btn.dataset.view=`with:${encodeURIComponent(who)}`;
      btn.innerHTML=`<span class="nav-icon">${iconSvg('heart')}</span><span></span><span class="nav-count">${state.shows.filter(s => !s.archive && (!watching || s.columnId===watching.id) && s.watchingWith.toLowerCase()===who.toLowerCase()).length}</span>`;
      btn.children[1].textContent=`With ${who}`; els.watchingWithNav.appendChild(btn);
    });

    els.savedViewsNav.replaceChildren();
    if (!state.savedViews.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:3px 9px;color:#9a968d;font-size:10px;';
      empty.textContent = 'No saved views yet';
      els.savedViewsNav.appendChild(empty);
    } else {
      state.savedViews.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'nav-item saved-view'; btn.dataset.view = `saved:${v.id}`;
        btn.innerHTML = `<span class="nav-icon">${iconSvg('filter')}</span><span></span>`;
        btn.children[1].textContent = v.name;
        els.savedViewsNav.appendChild(btn);
      });
    }

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === activeView);
      btn.onclick = () => switchView(btn.dataset.view);
    });
  }

  function switchView(view) {
    activeView = view;
    if (view.startsWith('saved:')) {
      const saved = state.savedViews.find(v => v.id === view.slice(6));
      if (saved) {
        filters = normalizeFilters(saved.filters);
        sortMode = validSort(saved.sort) ? saved.sort : 'recent';
        els.sortSelect.value = sortMode;
      }
    } else {
      filters = emptyFilters();
      sortMode = ui.sort && validSort(ui.sort) ? ui.sort : sortMode;
    }
    closeMobileNav();
    render();
  }

  function renderHeader() {
    const [title] = currentViewInfo();
    const shows = currentShows();
    els.viewTitle.textContent = title;
    els.viewSubtitle.textContent = `${shows.length} ${shows.length === 1 ? 'show' : 'shows'}`;
    els.sortSelect.value = sortMode;
    const count = filterCount(filters);
    els.filterBadge.hidden = count === 0;
    els.filterBadge.textContent = count;
  }

  function renderShowList() {
    const shows = currentShows();
    els.showList.replaceChildren();
    els.showList.hidden = shows.length === 0;
    els.emptyState.hidden = shows.length !== 0;
    if (!shows.length) {
      const anyLibrary = state.shows.length > 0;
      els.emptyTitle.textContent = anyLibrary ? 'No shows match this view.' : 'No shows here yet.';
      els.emptyText.textContent = anyLibrary ? 'Try clearing a filter or searching for something else.' : 'Add a show to start building your TV library.';
      return;
    }
    for (const show of shows) els.showList.appendChild(buildShowRow(show));
  }

  function buildShowRow(show) {
    const row = document.createElement('button');
    row.type = 'button'; row.className = 'show-row'; row.dataset.showId = show.id;
    const status = statusFor(show);
    const poster = document.createElement('div'); poster.className = 'row-poster';
    if (show.poster) {
      const img = new Image(); img.src = show.poster; img.alt = ''; img.loading = 'lazy';
      img.onerror = () => { poster.replaceChildren(); poster.innerHTML = `<div class="poster-fallback">${iconSvg('tv')}</div>`; };
      poster.appendChild(img);
    } else poster.innerHTML = `<div class="poster-fallback">${iconSvg('tv')}</div>`;

    const main = document.createElement('div'); main.className = 'row-main';
    const titleLine = document.createElement('div'); titleLine.className = 'row-title-line';
    const title = document.createElement('div'); title.className = 'row-title'; title.textContent = show.title;
    titleLine.appendChild(title);
    if (show.favourite) { const heart = document.createElement('span'); heart.className = 'heart'; heart.innerHTML = iconSvg('heart'); titleLine.appendChild(heart); }
    main.appendChild(titleLine);
    const subParts = [showNetworkLabel(show), show.firstAirYear].filter(Boolean);
    const sub = document.createElement('div'); sub.className = 'row-sub'; sub.textContent = subParts.join(' · '); main.appendChild(sub);
    const meta = document.createElement('div'); meta.className = 'row-meta';
    if (show.seasons !== null) meta.appendChild(metaSpan('library', `${show.seasons} ${show.seasons === 1 ? 'season' : 'seasons'}`));
    if (!show.archive && show.episodeProgress) { const p = show.episodeProgress; const progressText = p.nextSeason && p.nextEpisode ? `Next: S${p.nextSeason} E${p.nextEpisode}` : 'All episodes watched'; meta.appendChild(metaSpan('play', progressText)); }
    if (show.episodes !== null) meta.appendChild(metaSpan('tv', `${show.episodes} ${show.episodes === 1 ? 'episode' : 'episodes'}`));
    const duration = formatDuration(effectiveTotalMinutes(show));
    if (duration) meta.appendChild(metaSpan('clock', `~${duration}`));
    if (show.country) meta.appendChild(metaSpan('calendar', show.country));
    main.appendChild(meta);

    const personal = document.createElement('div'); personal.className = 'row-personal';
    const rating = document.createElement('div'); rating.className = 'rating-text'; rating.textContent = formatRating(show.rating); personal.appendChild(rating);
    if (show.genres.length) {
      const genres = document.createElement('div'); genres.className = 'tags-mini';
      show.genres.slice(0,4).forEach(g => { const genre = document.createElement('span'); genre.className = 'tag-mini'; genre.textContent = g; genres.appendChild(genre); });
      personal.appendChild(genres);
    }

    const pill = document.createElement('span'); pill.className = `status-pill${status.archive ? ' archive' : ''}`; pill.textContent = status.name;
    if (!status.archive) { pill.style.background = hexAlpha(status.color, .12); pill.style.color = status.color; }
    row.append(poster, main, personal, pill);
    row.addEventListener('click', (event) => {
      lastShowTrigger = row;
      lastShowOpenedByPointer = event.detail > 0;
      openShowDialog(show);
    });
    return row;
  }
  function metaSpan(icon, text) { const span = document.createElement('span'); span.innerHTML = `${iconSvg(icon)}<b></b>`; span.querySelector('b').style.fontWeight = '500'; span.querySelector('b').textContent = text; return span; }

  function filterCount(f) {
    return f.statuses.length + f.watchingWith.length + f.genres.length + f.networks.length + f.tags.length + [f.episodes, f.time, f.yearFrom, f.yearTo, f.rating, f.favourite].filter(Boolean).length;
  }

  function renderActiveFilters() {
    els.activeFilters.replaceChildren();
    const chips = [];
    filters.statuses.forEach(id => chips.push([`status:${id}`, statusName(id)]));
    filters.watchingWith.forEach(w => chips.push([`with:${w}`, `With ${w}`]));
    filters.genres.forEach(v => chips.push([`genre:${v}`, v]));
    filters.networks.forEach(v => chips.push([`network:${v}`, v]));
    filters.tags.forEach(v => chips.push([`tag:${v}`, `#${v}`]));
    if (filters.episodes) chips.push(['episodes', episodeLabel(filters.episodes)]);
    if (filters.time) chips.push(['time', timeLabel(filters.time)]);
    if (filters.yearFrom) chips.push(['yearFrom', `From ${filters.yearFrom}`]);
    if (filters.yearTo) chips.push(['yearTo', `To ${filters.yearTo}`]);
    if (filters.rating) chips.push(['rating', ratingFilterLabel(filters.rating)]);
    if (filters.favourite) chips.push(['favourite', filters.favourite === 'yes' ? 'Favourites' : 'Not favourites']);
    chips.forEach(([key,label]) => {
      const chip = document.createElement('span'); chip.className = 'filter-chip';
      const text = document.createElement('span'); text.textContent = label;
      const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', `Remove ${label} filter`); x.onclick = () => removeFilter(key);
      chip.append(text,x); els.activeFilters.appendChild(chip);
    });
  }
  function removeFilter(key) {
    if (key.startsWith('status:')) filters.statuses = filters.statuses.filter(x => x !== key.slice(7));
    else if (key.startsWith('with:')) filters.watchingWith = filters.watchingWith.filter(x => x !== key.slice(5));
    else if (key.startsWith('genre:')) filters.genres = filters.genres.filter(x => x !== key.slice(6));
    else if (key.startsWith('network:')) filters.networks = filters.networks.filter(x => x !== key.slice(8));
    else if (key.startsWith('tag:')) filters.tags = filters.tags.filter(x => x !== key.slice(4));
    else filters[key] = '';
    render();
  }
  function statusName(id) {
    if (id === ARCHIVE_WATCHED) return 'Watched';
    if (id === ARCHIVE_ABANDONED) return 'Abandoned';
    return state.columns.find(c => c.id === id)?.name || id;
  }
  function episodeLabel(v) { return ({'1-6':'1–6 episodes','7-12':'7–12 episodes','13-24':'13–24 episodes','25-49':'25–49 episodes','50+':'50+ episodes'})[v] || v; }
  function timeLabel(v) { return ({under5:'Under 5h',under10:'Under 10h','10-20':'10–20h','20-40':'20–40h','40+':'40h+'})[v] || v; }
  function ratingFilterLabel(v) { if (v === 'unrated') return 'Unrated'; return `${v}★+`; }

  function openFilterDrawer() {
    filterDraft = clone(filters);
    renderFilterControls();
    els.filterDrawer.classList.add('open'); els.drawerScrim.classList.add('open'); els.filterDrawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeFilterDrawer() {
    els.filterDrawer.classList.remove('open'); els.drawerScrim.classList.remove('open'); els.filterDrawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  function renderFilterControls() {
    filterDraft = normalizeFilters(filterDraft);
    els.filterStatuses.replaceChildren();
    [...state.columns.map(c => ({ id:c.id, name:c.name })), {id:ARCHIVE_WATCHED,name:'Watched'}, {id:ARCHIVE_ABANDONED,name:'Abandoned'}].forEach(item => {
      const label = document.createElement('label'); label.className = 'check-option';
      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = filterDraft.statuses.includes(item.id);
      cb.onchange = () => toggleDraftArray('statuses', item.id, cb.checked);
      const span = document.createElement('span'); span.textContent = item.name; label.append(cb,span); els.filterStatuses.appendChild(label);
    });
    const watchingWith = uniqueSorted(state.shows.map(s => s.watchingWith).filter(Boolean));
    renderChoicePills(els.filterWatchingWith, watchingWith, filterDraft.watchingWith, 'watchingWith');
    const genres = uniqueSorted(state.shows.flatMap(s => s.genres || []));
    renderChoicePills(els.filterGenres, genres, filterDraft.genres, 'genres');
    const networks = uniqueSorted(state.shows.flatMap(s => allNetworkValues(s)));
    renderChoicePills(els.filterNetworks, networks, filterDraft.networks, 'networks');
    const tags = uniqueSorted(state.shows.flatMap(s => s.tags || []));
    renderChoicePills(els.filterTags, tags, filterDraft.tags, 'tags');
    els.filterEpisodes.value = filterDraft.episodes;
    els.filterTime.value = filterDraft.time;
    els.filterYearFrom.value = filterDraft.yearFrom;
    els.filterYearTo.value = filterDraft.yearTo;
    els.filterRating.value = filterDraft.rating;
    els.filterFavourite.value = filterDraft.favourite;
    els.saveViewButton.textContent = activeView.startsWith('saved:') ? 'Update View' : 'Save View';
  }
  function renderChoicePills(container, values, selected, key) {
    container.replaceChildren();
    if (!values.length) { const span = document.createElement('span'); span.className='helper'; span.textContent='No values yet'; container.appendChild(span); return; }
    values.forEach(value => {
      const btn = document.createElement('button'); btn.type='button'; btn.className = `choice-pill${selected.some(x => x.toLowerCase() === value.toLowerCase()) ? ' selected' : ''}`; btn.textContent = value;
      btn.onclick = () => { const has = filterDraft[key].some(x => x.toLowerCase() === value.toLowerCase()); toggleDraftArray(key, value, !has); renderFilterControls(); };
      container.appendChild(btn);
    });
  }
  function uniqueSorted(values) {
    const map = new Map();
    values.filter(Boolean).forEach(v => { const s=String(v).trim(); const k=s.toLowerCase(); if (s && !map.has(k)) map.set(k,s); });
    return [...map.values()].sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}));
  }
  function toggleDraftArray(key, value, checked) {
    const current = filterDraft[key] || [];
    if (checked && !current.some(x => x.toLowerCase() === value.toLowerCase())) filterDraft[key] = [...current,value];
    if (!checked) filterDraft[key] = current.filter(x => x.toLowerCase() !== value.toLowerCase());
  }
  function readDraftScalarFilters() {
    filterDraft.episodes = els.filterEpisodes.value;
    filterDraft.time = els.filterTime.value;
    filterDraft.yearFrom = els.filterYearFrom.value.trim();
    filterDraft.yearTo = els.filterYearTo.value.trim();
    filterDraft.rating = els.filterRating.value;
    filterDraft.favourite = els.filterFavourite.value;
    filterDraft = normalizeFilters(filterDraft);
  }
  function applyFilters() { readDraftScalarFilters(); filters = clone(filterDraft); closeFilterDrawer(); render(); }
  function clearFilterDraft() { filterDraft = emptyFilters(); renderFilterControls(); }

  function saveCurrentView() {
    readDraftScalarFilters();
    const t = nowIso();
    if (activeView.startsWith('saved:')) {
      const id = activeView.slice(6); const v = state.savedViews.find(x => x.id === id);
      if (!v) return;
      v.filters = clone(filterDraft); v.sort = sortMode; v.updatedAt = t; state.savedViewsUpdatedAt = t;
      filters = clone(filterDraft); saveState(); closeFilterDrawer(); showToast(`Updated “${v.name}”`); return;
    }
    const name = prompt('Name this saved view:');
    if (!name || !name.trim()) return;
    const view = { id: uuid(), name: name.trim().slice(0,60), filters: clone(filterDraft), sort: sortMode, updatedAt: t };
    state.savedViews.push(view); state.savedViewsUpdatedAt = t; filters = clone(filterDraft); activeView = `saved:${view.id}`; saveState(); closeFilterDrawer(); showToast('Saved view created');
  }

  function renderSavedViewManager() {
    els.savedViewManager.replaceChildren();
    if (!state.savedViews.length) { const p=document.createElement('p');p.className='modal-intro';p.style.margin='4px 0';p.textContent='No saved views yet.';els.savedViewManager.appendChild(p);return; }
    state.savedViews.forEach(v => {
      const row=document.createElement('div');row.className='manager-row';
      const name=document.createElement('input');name.value=v.name;name.maxLength=60;name.onchange=()=>{ const val=name.value.trim(); if(!val){name.value=v.name;return;} v.name=val;v.updatedAt=nowIso();state.savedViewsUpdatedAt=v.updatedAt;saveState();renderSavedViewManager(); };
      const actions=document.createElement('div');actions.className='manager-actions';
      const del=document.createElement('button');del.type='button';del.title='Delete view';del.textContent='×';del.onclick=()=>{ if(!confirm(`Delete saved view “${v.name}”?`))return; state.savedViews=state.savedViews.filter(x=>x.id!==v.id);state.savedViewsUpdatedAt=nowIso();if(activeView===`saved:${v.id}`){activeView='all';filters=emptyFilters();}saveState();renderSavedViewManager(); };
      actions.append(del);row.append(name,actions);els.savedViewManager.appendChild(row);
    });
  }

  function renderStatusManager() {
    els.statusManager.replaceChildren();
    state.columns.forEach((c,index) => {
      const row=document.createElement('div'); row.className='manager-row';
      const left=document.createElement('div');left.style.cssText='display:grid;grid-template-columns:36px minmax(0,1fr);gap:7px;align-items:center;';
      const color=document.createElement('input');color.type='color';color.value=safeColour(c.color,index);color.title='Status colour';color.style.cssText='width:34px;height:30px;padding:2px;border:1px solid var(--line);border-radius:7px;background:#fff;';
      color.onchange=()=>{c.color=color.value;c.updatedAt=nowIso();state.columnsUpdatedAt=c.updatedAt;saveState();};
      const name=document.createElement('input');name.value=c.name;name.maxLength=50;name.onchange=()=>{const val=name.value.trim();if(!val){name.value=c.name;return;}c.name=val;c.updatedAt=nowIso();state.columnsUpdatedAt=c.updatedAt;saveState();renderStatusManager();};
      left.append(color,name);
      const actions=document.createElement('div');actions.className='manager-actions';
      const up=document.createElement('button');up.type='button';up.textContent='↑';up.disabled=index===0;up.onclick=()=>moveStatus(index,-1);
      const down=document.createElement('button');down.type='button';down.textContent='↓';down.disabled=index===state.columns.length-1;down.onclick=()=>moveStatus(index,1);
      const del=document.createElement('button');del.type='button';del.textContent='×';del.title='Delete status';del.disabled=state.columns.length===1;del.onclick=()=>deleteStatus(c.id);
      actions.append(up,down,del);row.append(left,actions);els.statusManager.appendChild(row);
    });
  }
  function moveStatus(index,delta) {
    const target=index+delta;if(target<0||target>=state.columns.length)return;
    [state.columns[index],state.columns[target]]=[state.columns[target],state.columns[index]];
    const t=nowIso();state.columns.forEach((c,i)=>{c.order=i;c.updatedAt=t;});state.columnsUpdatedAt=t;saveState();renderStatusManager();
  }
  function deleteStatus(id) {
    const c=state.columns.find(x=>x.id===id);if(!c||state.columns.length===1)return;
    const count=state.shows.filter(s=>!s.archive&&s.columnId===id).length;
    const replacement=state.columns.find(x=>x.id!==id);
    const msg=count?`Delete “${c.name}”? Its ${count} ${count===1?'show':'shows'} will move to “${replacement.name}”.`:`Delete status “${c.name}”?`;
    if(!confirm(msg))return;
    const t=nowIso();state.shows.forEach(s=>{if(!s.archive&&s.columnId===id){s.columnId=replacement.id;s.updatedAt=t;}});
    state.columns=state.columns.filter(x=>x.id!==id);state.columns.forEach((x,i)=>x.order=i);state.columnDeleted.push({id,deletedAt:t});state.columnsUpdatedAt=t;
    if(activeView===`status:${id}`)activeView='all';saveState();renderStatusManager();
  }
  function addStatus(name) {
    const text=name.trim();if(!text)return;
    if(state.columns.some(c=>c.name.toLowerCase()===text.toLowerCase())){showToast('That status already exists');return;}
    const t=nowIso();const base=slugify(text)||'status';let id=base;let i=2;while(state.columns.some(c=>c.id===id))id=`${base}-${i++}`;
    state.columns.push({id,name:text.slice(0,50),order:state.columns.length,color:defaultColour(state.columns.length),updatedAt:t});state.columnsUpdatedAt=t;saveState();renderStatusManager();
  }

  const STANDARD_GENRES = ['Action','Adventure','Animation','Comedy','Crime','Documentary','Drama','Family','Fantasy','History','Horror','Music','Mystery','Romance','Science Fiction','Sport','Thriller','War','Western'];
  const COMMON_NETWORKS = ['Apple TV+','BBC','CBC','Crave','Disney+','HBO','HBO Max','ITV','Netflix','Paramount+','PBS','Prime Video','StackTV'];
  const COMMON_COUNTRIES = ['Australia','Canada','France','Germany','Ireland','Italy','Japan','New Zealand','South Korea','Spain','Sweden','United Kingdom','United States'];

  function populateDatalist(el, values) {
    if (!el) return;
    el.replaceChildren();
    uniqueSorted(values).forEach(value => { const option=document.createElement('option'); option.value=value; el.appendChild(option); });
  }
  function refreshEditorChoices() {
    populateDatalist(els.networkOptions, [...COMMON_NETWORKS, ...state.shows.flatMap(s=>allNetworkValues(s))]);
    populateDatalist(els.countryOptions, [...COMMON_COUNTRIES, ...state.shows.map(s=>s.country).filter(Boolean)]);
    populateDatalist(els.watchingWithOptions, state.shows.map(s=>s.watchingWith).filter(Boolean));
    renderEditorPicker('genres');
    renderEditorPicker('tags');
  }
  function editorPickerConfig(kind) {
    if (kind === 'genres') return { hidden:els.showGenres, choices:els.genreChoices, summary:els.genresPickerSummary, addInput:els.genreAddInput, source:uniqueSorted([...STANDARD_GENRES, ...state.shows.flatMap(s=>s.genres||[])]) };
    return { hidden:els.showTags, choices:els.tagChoices, summary:els.tagsPickerSummary, addInput:els.tagAddInput, source:uniqueSorted(state.shows.flatMap(s=>s.tags||[])) };
  }
  function pickerValues(kind) { const cfg=editorPickerConfig(kind); return cleanTags(splitComma(cfg.hidden.value)); }
  function updatePickerSummary(kind) {
    const cfg=editorPickerConfig(kind); if (!cfg.summary) return;
    const selected=pickerValues(kind); cfg.summary.replaceChildren();
    if (!selected.length) cfg.summary.textContent = kind === 'genres' ? 'Choose genres' : 'Choose tags';
    else selected.forEach(value => { const chip=document.createElement('span'); chip.className='picker-summary-chip'; chip.textContent=value; cfg.summary.appendChild(chip); });
  }
  function setPickerValues(kind, values, rerender=true) {
    const cfg=editorPickerConfig(kind); cfg.hidden.value=cleanTags(values).join(', ');
    if (rerender) renderEditorPicker(kind); else updatePickerSummary(kind);
  }
  function renderEditorPicker(kind) {
    const cfg=editorPickerConfig(kind); if (!cfg.hidden || !cfg.choices || !cfg.summary) return;
    const selected=pickerValues(kind); updatePickerSummary(kind); cfg.choices.replaceChildren();
    const source=uniqueSorted([...cfg.source, ...selected]);
    if (!source.length) { const empty=document.createElement('span'); empty.className='helper'; empty.textContent='No saved values yet'; cfg.choices.appendChild(empty); return; }
    source.forEach(value => {
      const button=document.createElement('button'); button.type='button'; button.className=`choice-pill${selected.some(v=>v.toLowerCase()===value.toLowerCase())?' selected':''}`; button.textContent=value;
      button.onclick=(event)=>{ event.preventDefault(); event.stopPropagation(); const current=pickerValues(kind); const has=current.some(v=>v.toLowerCase()===value.toLowerCase()); const next=has ? current.filter(v=>v.toLowerCase()!==value.toLowerCase()) : [...current,value]; setPickerValues(kind,next,false); button.classList.toggle('selected',!has); };
      cfg.choices.appendChild(button);
    });
  }
  function addPickerValue(kind) {
    const cfg=editorPickerConfig(kind); const value=String(cfg.addInput.value||'').trim(); if(!value)return;
    setPickerValues(kind,[...pickerValues(kind),value]); cfg.addInput.value=''; cfg.addInput.focus();
  }

  function fillLocationOptions(selected) {
    els.showLocation.replaceChildren();
    state.columns.forEach(c=>{const o=document.createElement('option');o.value=`status:${c.id}`;o.textContent=c.name;els.showLocation.appendChild(o);});
    const w=document.createElement('option');w.value=ARCHIVE_WATCHED;w.textContent='Watched';els.showLocation.appendChild(w);
    const a=document.createElement('option');a.value=ARCHIVE_ABANDONED;a.textContent='Abandoned';els.showLocation.appendChild(a);
    els.showLocation.value=selected&&[...els.showLocation.options].some(o=>o.value===selected)?selected:`status:${state.columns[0].id}`;
  }

  function openShowDialog(show=null) {
    draftMeta = show ? clone(show) : { providers: [], providerLink:'', providersUpdatedAt:null, tvmazeId:null, imdbId:'', tmdbId:null };
    els.showDialogTitle.textContent = show ? 'Edit Show' : 'Add Show';
    els.showId.value=show?.id||'';els.showTitle.value=show?.title||'';els.showRating.value=String(show?.rating||0);els.showPoster.value=show?.poster||'';
    const location=show?.archive||`status:${show?.columnId||state.columns[0].id}`;fillLocationOptions(location);
    setFavourite(Boolean(show?.favourite));
    els.showYear.value=show?.firstAirYear||'';els.showSeasons.value=show?.seasons??'';els.showEpisodes.value=show?.episodes??'';els.showRuntime.value=show?.runtime??'';els.showTotalMinutes.value=show?.totalMinutes??'';
    const seriesStatus=show?.seriesStatus||''; if(seriesStatus && ![...els.showSeriesStatus.options].some(o=>o.value===seriesStatus)){const option=document.createElement('option');option.value=seriesStatus;option.textContent=seriesStatus;els.showSeriesStatus.appendChild(option);} els.showSeriesStatus.value=seriesStatus;els.showNetwork.value=show?.network||'';els.showCountry.value=show?.country||'';els.showWatchingWith.value=show?.watchingWith||'';els.showGenres.value=(show?.genres||[]).join(', ');els.showMetacritic.value=show?.metacritic||'';
    els.showTags.value=(show?.tags||[]).join(', ');els.showNotes.value=show?.notes||'';refreshEditorChoices();els.lookupStatus.textContent='Find details uses TVmaze to fill landscape artwork, genres, year, network, seasons, episodes and runtime.';els.lookupResults.hidden=true;els.lookupResults.replaceChildren();
    els.deleteShowButton.style.visibility=show?'visible':'hidden';updatePosterPreview();renderStreamingPreview();
    prepareEpisodeGuide(show);
    if(!els.showDialog.open)els.showDialog.showModal();
    setTimeout(()=>els.showTitle.focus(),30);
  }
  function closeShowDialog(){if(els.showDialog.open)els.showDialog.close(); if(lookupController){lookupController.abort();lookupController=null;}}
  function setFavourite(value){draftMeta.favourite=Boolean(value);els.showFavourite.classList.toggle('active',draftMeta.favourite);els.showFavourite.setAttribute('aria-pressed',String(draftMeta.favourite));els.showFavouriteText.textContent=draftMeta.favourite?'Favourite':'Not favourite';}
  function updatePosterPreview(){const url=safeUrl(els.showPoster.value);els.posterPreview.replaceChildren();if(url){const img=new Image();img.src=url;img.alt='';img.onerror=()=>{els.posterPreview.innerHTML=`<div class="poster-fallback">${iconSvg('tv')}</div>`;};els.posterPreview.appendChild(img);}else els.posterPreview.innerHTML=`<div class="poster-fallback">${iconSvg('tv')}</div>`;}
  function renderStreamingPreview(){els.streamingProvidersText.replaceChildren();const providers=cleanProviders(draftMeta.providers);if(providers.length){providers.forEach(p=>{const s=document.createElement('span');s.className='provider-pill';s.textContent=p;els.streamingProvidersText.appendChild(s);});els.streamingProvidersNote.textContent=draftMeta.providersUpdatedAt?`Updated ${new Date(draftMeta.providersUpdatedAt).toLocaleDateString()}`:'Subscription services in Canada';}else{els.streamingProvidersNote.textContent=prefs.tmdbCredential?'No subscription services found in Canada.':'Requires a TMDB credential in Settings.';}}

  function normalizeTvmazeEpisodes(items) {
    if (!Array.isArray(items)) return [];
    return items.filter(e => e && Number(e.season) > 0 && Number(e.number) > 0).map(e => ({
      id: positiveIntegerOrNull(e.id),
      season: Number(e.season),
      number: Number(e.number),
      name: safeText(e.name || `Episode ${e.number}`, 180),
      runtime: positiveIntegerOrNull(e.runtime),
      summary: episodeSummaryText(e.summary),
      airdate: safeText(e.airdate || '', 20)
    })).sort((a,b) => a.season - b.season || a.number - b.number);
  }
  function episodeSummaryText(html) {
    if (!html) return 'No description is available for this episode.';
    const node = document.createElement('div'); node.innerHTML = String(html);
    return safeText((node.textContent || node.innerText || '').replace(/\s+/g, ' ').trim(), 1200) || 'No description is available for this episode.';
  }
  function episodeProgressIndex(progress, episodes) {
    if (!progress || !episodes.length) return -1;
    let i = progress.episodeId ? episodes.findIndex(e => e.id === progress.episodeId) : -1;
    if (i < 0) i = episodes.findIndex(e => e.season === progress.season && e.number === progress.episode);
    return i;
  }
  function progressFromEpisode(ep, episodes) {
    const idx = episodes.findIndex(e => (ep.id && e.id === ep.id) || (e.season === ep.season && e.number === ep.number));
    const next = idx >= 0 ? episodes[idx + 1] : null;
    return { season: ep.season, episode: ep.number, episodeId: ep.id || null, title: ep.name || '', nextSeason: next?.season || null, nextEpisode: next?.number || null, nextEpisodeId: next?.id || null, nextTitle: next?.name || '', watchedCount: idx >= 0 ? idx + 1 : null, totalCount: episodes.length || null, updatedAt: nowIso() };
  }
  function currentEpisodeShow() {
    const id = els.showId.value;
    return id ? state.shows.find(s => s.id === id) || null : null;
  }
  async function prepareEpisodeGuide(show) {
    els.episodeGuide.replaceChildren();
    els.episodeProgressSummary.replaceChildren();
    if (!show?.tvmazeId) {
      els.episodeGuideStatus.textContent = 'Use Find details to connect this show to TVmaze and load its episodes.';
      const p=document.createElement('p');p.className='episode-empty';p.textContent='Episode descriptions will appear here once TVmaze details are linked.';els.episodeGuide.appendChild(p);
      els.refreshEpisodesButton.disabled = true;
      return;
    }
    els.refreshEpisodesButton.disabled = false;
    await loadEpisodeGuide(show, false);
  }
  async function loadEpisodeGuide(show=currentEpisodeShow() || draftMeta, force=false) {
    const tvmazeId = positiveIntegerOrNull(show?.tvmazeId || draftMeta.tvmazeId);
    if (!tvmazeId) return;
    els.episodeGuideStatus.textContent = 'Loading episode descriptions…';
    try {
      let episodes = !force ? episodeCache.get(tvmazeId) : null;
      if (!episodes) {
        const res = await fetch(`https://api.tvmaze.com/shows/${tvmazeId}/episodes`);
        if (!res.ok) throw new Error('TVmaze episode lookup failed');
        episodes = normalizeTvmazeEpisodes(await res.json());
        episodeCache.set(tvmazeId, episodes);
      }
      renderEpisodeGuide(episodes, show?.episodeProgress || draftMeta.episodeProgress || null);
      els.episodeGuideStatus.textContent = episodes.length ? `${episodes.length} episodes · click an episode for its description.` : 'No numbered episodes are available from TVmaze.';
    } catch (err) {
      console.error(err); els.episodeGuideStatus.textContent = 'Episode descriptions could not be loaded just now.';
      const p=document.createElement('p');p.className='episode-empty';p.textContent='Try Refresh again later.';els.episodeGuide.replaceChildren(p);
    }
  }
  function renderEpisodeGuide(episodes, progress) {
    els.episodeGuide.replaceChildren();
    els.episodeProgressSummary.replaceChildren();
    if (!episodes.length) return;
    const progressIndex = episodeProgressIndex(progress, episodes);
    const next = episodes[progressIndex + 1] || (progressIndex < 0 ? episodes[0] : null);
    if (progressIndex >= 0) {
      const summary=document.createElement('div');summary.className='progress-callout';
      const strong=document.createElement('strong'); strong.textContent = next ? `Next: S${next.season} E${next.number} — ${next.name}` : 'All available episodes watched';
      const small=document.createElement('span'); small.textContent = `${progressIndex + 1} of ${episodes.length} episodes watched`; summary.append(strong,small); els.episodeProgressSummary.appendChild(summary);
    } else {
      const summary=document.createElement('div');summary.className='progress-callout quiet';summary.textContent=`No viewing progress recorded · ${episodes.length} episodes available`;els.episodeProgressSummary.appendChild(summary);
    }
    const seasons = new Map();
    episodes.forEach((ep, idx) => { if(!seasons.has(ep.season)) seasons.set(ep.season, []); seasons.get(ep.season).push([ep,idx]); });
    const nextIndex = progressIndex + 1;
    seasons.forEach((entries, season) => {
      const block=document.createElement('details');block.className='season-block';
      if (entries.some(([,idx]) => idx === nextIndex) || (!progress && season === episodes[0].season)) block.open=true;
      const head=document.createElement('summary');
      const label=document.createElement('strong');label.textContent=`Season ${season}`;
      const watched=entries.filter(([,idx]) => idx <= progressIndex).length;
      const count=document.createElement('span');count.textContent=`${watched}/${entries.length} watched`;head.append(label,count);block.appendChild(head);
      const list=document.createElement('div');list.className='episode-list';
      entries.forEach(([ep,idx]) => {
        const item=document.createElement('details');item.className='episode-item';
        if(idx <= progressIndex)item.classList.add('watched');if(idx===nextIndex)item.classList.add('next');
        const row=document.createElement('summary');
        const check=document.createElement('span');check.className='episode-check';check.textContent=idx<=progressIndex?'✓':'○';
        const code=document.createElement('span');code.className='episode-code';code.textContent=`S${ep.season} E${ep.number}`;
        const name=document.createElement('span');name.className='episode-name';name.textContent=ep.name;
        const runtime=document.createElement('span');runtime.className='episode-runtime';runtime.textContent=ep.runtime?`${ep.runtime}m`:'';
        row.append(check,code,name);if(idx===nextIndex){const badge=document.createElement('span');badge.className='episode-next-badge';badge.textContent='Next';row.appendChild(badge);}row.appendChild(runtime);item.appendChild(row);
        const body=document.createElement('div');body.className='episode-body';
        const desc=document.createElement('p');desc.textContent=ep.summary;body.appendChild(desc);
        if(idx !== progressIndex) { const mark=document.createElement('button');mark.type='button';mark.className='secondary-button episode-progress-button';mark.textContent='Mark up to here as watched';mark.onclick=()=>markUpToEpisode(ep,episodes);body.appendChild(mark); }
        item.appendChild(body);list.appendChild(item);
      });
      block.appendChild(list);els.episodeGuide.appendChild(block);
    });
  }
  function markUpToEpisode(ep, episodes) {
    const progress = progressFromEpisode(ep, episodes);
    draftMeta.episodeProgress = progress;
    const id = els.showId.value;
    if (id) {
      const show=state.shows.find(s=>s.id===id);
      if(show){show.episodeProgress=progress;show.updatedAt=nowIso();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));render();if(dbx.connected)scheduleSync();}
    }
    renderEpisodeGuide(episodes, progress);
    showToast(`Progress saved through S${ep.season} E${ep.number}`);
  }

  async function lookupShows() {
    const q=els.showTitle.value.trim();if(!q){els.lookupStatus.textContent='Enter a title first.';return;}
    if(lookupController)lookupController.abort();lookupController=new AbortController();
    els.lookupShowButton.disabled=true;els.lookupStatus.textContent='Searching TVmaze…';els.lookupResults.hidden=true;els.lookupResults.replaceChildren();
    try{
      const res=await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`,{signal:lookupController.signal});if(!res.ok)throw new Error('TVmaze search failed');const results=await res.json();
      if(!results.length){els.lookupStatus.textContent='No TVmaze matches found. You can enter the details manually.';return;}
      els.lookupStatus.textContent='Choose the correct show:';els.lookupResults.hidden=false;
      results.slice(0,8).forEach(result=>{
        const show=result.show;const btn=document.createElement('div');btn.className='lookup-result';
        const img=document.createElement('img');img.alt='';img.src=show.image?.medium||show.image?.original||'';
        const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=show.name;const meta=document.createElement('span');const yr=show.premiered?show.premiered.slice(0,4):'';const network=show.network?.name||show.webChannel?.name||'';meta.textContent=[yr,network,show.genres?.slice(0,2).join(', ')].filter(Boolean).join(' · ');info.append(strong,meta);
        const choose=document.createElement('button');choose.type='button';choose.className='secondary-button';choose.textContent='Use';choose.onclick=()=>applyTvmazeShow(show);
        btn.append(img,info,choose);els.lookupResults.appendChild(btn);
      });
    }catch(err){if(err.name!=='AbortError'){console.error(err);els.lookupStatus.textContent='TVmaze search failed. You can still enter details manually.';}}
    finally{els.lookupShowButton.disabled=false;}
  }

  async function applyTvmazeShow(show) {
    els.lookupStatus.textContent='Loading episodes and seasons…';els.lookupResults.hidden=true;
    try{
      const [seasonsRes,episodesRes,imagesRes]=await Promise.all([fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`),fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`),fetch(`https://api.tvmaze.com/shows/${show.id}/images`)]);
      const seasons=seasonsRes.ok?await seasonsRes.json():[];const episodes=episodesRes.ok?await episodesRes.json():[];const images=imagesRes.ok?await imagesRes.json():[];
      const normalizedEpisodes=normalizeTvmazeEpisodes(episodes);episodeCache.set(show.id, normalizedEpisodes);
      const backgrounds=images.filter(img=>img?.type==='background'&&img?.resolutions?.original?.url);
      const banners=images.filter(img=>img?.type==='banner'&&img?.resolutions?.original?.url);
      const artwork=(backgrounds.find(img=>img.main)||backgrounds[0]||banners.find(img=>img.main)||banners[0])?.resolutions?.original?.url || show.image?.original || show.image?.medium || els.showPoster.value;
      els.showTitle.value=show.name||els.showTitle.value;els.showPoster.value=artwork;
      els.showYear.value=show.premiered?show.premiered.slice(0,4):'';els.showGenres.value=(show.genres||[]).join(', ');
      els.showNetwork.value=show.network?.name||show.webChannel?.name||'';els.showCountry.value=show.network?.country?.name||show.webChannel?.country?.name||'';const tvStatus=show.status||'';if(tvStatus && ![...els.showSeriesStatus.options].some(o=>o.value===tvStatus)){const option=document.createElement('option');option.value=tvStatus;option.textContent=tvStatus;els.showSeriesStatus.appendChild(option);}els.showSeriesStatus.value=tvStatus;renderEditorPicker('genres');
      els.showSeasons.value=seasons.length||'';els.showEpisodes.value=episodes.length||'';const runtime=show.averageRuntime||show.runtime||medianRuntime(episodes);els.showRuntime.value=runtime||'';
      const total=episodes.reduce((sum,e)=>sum+(Number(e.runtime)||0),0);els.showTotalMinutes.value=total||((runtime&&episodes.length)?runtime*episodes.length:'');
      if(!els.showMetacritic.value)els.showMetacritic.value=`https://www.metacritic.com/tv/${slugify(show.name)}/`;
      if(draftMeta.tvmazeId && draftMeta.tvmazeId!==show.id)draftMeta.episodeProgress=null;draftMeta.tvmazeId=show.id;draftMeta.imdbId=show.externals?.imdb||'';draftMeta.tmdbId=null;updatePosterPreview();renderEpisodeGuide(normalizedEpisodes,draftMeta.episodeProgress||null);els.episodeGuideStatus.textContent=normalizedEpisodes.length?`${normalizedEpisodes.length} episodes · click an episode for its description.`:'No numbered episodes are available from TVmaze.';els.refreshEpisodesButton.disabled=false;
      els.lookupStatus.textContent='Details and landscape artwork added from TVmaze. You can edit anything before saving.';
      if(prefs.tmdbCredential)await refreshDraftProviders();
    }catch(err){console.error(err);els.lookupStatus.textContent='Basic TVmaze details were found, but episode details could not be loaded.';}
  }
  function medianRuntime(episodes){const vals=episodes.map(e=>Number(e.runtime)).filter(n=>Number.isFinite(n)&&n>0).sort((a,b)=>a-b);if(!vals.length)return null;return vals[Math.floor(vals.length/2)];}

  function formShowObject(existing) {
    const t=nowIso();const location=els.showLocation.value;const archive=[ARCHIVE_WATCHED,ARCHIVE_ABANDONED].includes(location)?location:null;const selectedColumn=location.startsWith('status:')?location.slice(7):(existing?.columnId||state.columns[0].id);
    const order=existing?.order??Math.max(-1,...state.shows.filter(s=>!s.archive&&s.columnId===selectedColumn).map(s=>Number(s.order)||0))+1;
    return {
      ...(existing||{}),...draftMeta,
      id:existing?.id||uuid(),title:els.showTitle.value.trim().slice(0,120),columnId:state.columns.some(c=>c.id===selectedColumn)?selectedColumn:state.columns[0].id,archive,
      poster:safeUrl(els.showPoster.value),metacritic:safeUrl(els.showMetacritic.value),seasons:integerOrNull(els.showSeasons.value),episodes:integerOrNull(els.showEpisodes.value),runtime:integerOrNull(els.showRuntime.value),totalMinutes:integerOrNull(els.showTotalMinutes.value),
      genres:cleanGenres(splitComma(els.showGenres.value)),network:safeText(els.showNetwork.value,100),country:safeText(els.showCountry.value,80),seriesStatus:safeText(els.showSeriesStatus.value,50),watchingWith:safeText(els.showWatchingWith.value,60),favourite:Boolean(draftMeta.favourite),
      rating:clampRating(els.showRating.value),tags:cleanTags(splitComma(els.showTags.value)),notes:String(els.showNotes.value||'').slice(0,4000),firstAirYear:positiveIntegerOrNull(els.showYear.value),providers:cleanProviders(draftMeta.providers),providerLink:safeUrl(draftMeta.providerLink||''),providersUpdatedAt:validDateString(draftMeta.providersUpdatedAt)?draftMeta.providersUpdatedAt:null,episodeProgress:normalizeEpisodeProgress(draftMeta.episodeProgress),
      tvmazeId:positiveIntegerOrNull(draftMeta.tvmazeId),imdbId:safeText(draftMeta.imdbId,40),tmdbId:positiveIntegerOrNull(draftMeta.tmdbId),order,createdAt:existing?.createdAt||t,updatedAt:t
    };
  }
  function saveShowFromForm(event){event.preventDefault();const title=els.showTitle.value.trim();if(!title){els.showTitle.focus();return;}const id=els.showId.value;const index=state.shows.findIndex(s=>s.id===id);const existing=index>=0?state.shows[index]:null;const obj=formShowObject(existing);if(index>=0)state.shows[index]=obj;else state.shows.push(obj);saveState();closeShowDialog();showToast(existing?'Show updated':'Show added');}
  function deleteCurrentShow(){const id=els.showId.value;if(!id)return;const show=state.shows.find(s=>s.id===id);if(!show||!confirm(`Delete “${show.title}”?`))return;const t=nowIso();state.shows=state.shows.filter(s=>s.id!==id);state.deleted.push({id,deletedAt:t});saveState();closeShowDialog();showToast('Show deleted');}

  function tmdbAuthOptions(url) {
    const credential=String(prefs.tmdbCredential||'').trim();if(!credential)throw new Error('TMDB is not configured');
    if(/^[a-f0-9]{32}$/i.test(credential)){url.searchParams.set('api_key',credential);return {headers:{Accept:'application/json'}};}
    return {headers:{Accept:'application/json',Authorization:`Bearer ${credential}`}};
  }
  async function tmdbRequest(path, params={}) {
    const url=new URL(`https://api.themoviedb.org/3${path}`);Object.entries(params).forEach(([k,v])=>{if(v!==null&&v!==undefined&&v!=='')url.searchParams.set(k,String(v));});const opts=tmdbAuthOptions(url);const res=await fetch(url,opts);if(!res.ok)throw new Error(`TMDB ${res.status}`);return res.json();
  }
  async function resolveTmdbId(meta) {
    if(meta.tmdbId)return meta.tmdbId;
    if(meta.imdbId){try{const found=await tmdbRequest(`/find/${encodeURIComponent(meta.imdbId)}`,{external_source:'imdb_id'});if(found.tv_results?.[0]?.id)return found.tv_results[0].id;}catch(_){} }
    const title=els.showDialog.open?els.showTitle.value.trim():meta.title; if(!title)return null;
    const data=await tmdbRequest('/search/tv',{query:title,language:'en-US',page:1});if(!data.results?.length)return null;
    const year=Number(els.showDialog.open?els.showYear.value:meta.firstAirYear)||null;const best=(year&&data.results.find(r=>r.first_air_date?.startsWith(String(year))))||data.results[0];return best?.id||null;
  }
  async function fetchProvidersFor(meta) {
    const tmdbId=await resolveTmdbId(meta);if(!tmdbId)return {tmdbId:null,providers:[],providerLink:'',providersUpdatedAt:nowIso()};
    const data=await tmdbRequest(`/tv/${tmdbId}/watch/providers`);const ca=data.results?.CA||{};const providers=cleanProviders((ca.flatrate||[]).map(p=>p.provider_name));return {tmdbId,providers,providerLink:safeUrl(ca.link||''),providersUpdatedAt:nowIso()};
  }
  async function refreshDraftProviders(){if(!prefs.tmdbCredential){showToast('Add a TMDB credential in Settings first');return;}els.streamingProvidersNote.textContent='Checking subscription services…';els.refreshShowStreamingButton.disabled=true;try{const result=await fetchProvidersFor({...draftMeta,title:els.showTitle.value,firstAirYear:positiveIntegerOrNull(els.showYear.value)});Object.assign(draftMeta,result);renderStreamingPreview();}catch(err){console.error(err);els.streamingProvidersNote.textContent='Could not refresh streaming availability.';}finally{els.refreshShowStreamingButton.disabled=false;}}
  async function testTmdb(){const credential=els.tmdbCredential.value.trim();prefs.tmdbCredential=credential;if(!credential){savePrefs();els.tmdbTestMessage.textContent='TMDB credential removed.';return;}els.saveTmdbButton.disabled=true;els.tmdbTestMessage.textContent='Testing…';try{await tmdbRequest('/configuration');savePrefs();els.tmdbTestMessage.textContent='TMDB connected.';showToast('TMDB connected');}catch(err){console.error(err);els.tmdbTestMessage.textContent='That TMDB credential did not work.';}finally{els.saveTmdbButton.disabled=false;}}
  async function refreshAllProviders(){if(providerRefreshRunning)return;if(!prefs.tmdbCredential){showToast('Add a TMDB credential first');return;}providerRefreshRunning=true;els.refreshProvidersButton.textContent='Refreshing…';let changed=0;try{for(let i=0;i<state.shows.length;i++){const show=state.shows[i];try{const result=await fetchProvidersFor(show);Object.assign(show,result,{updatedAt:nowIso()});changed++;els.refreshProvidersButton.textContent=`Refreshing ${i+1}/${state.shows.length}…`;}catch(err){console.warn('Provider refresh failed',show.title,err);}}saveState();showToast(`Streaming refreshed for ${changed} ${changed===1?'show':'shows'}`);}finally{providerRefreshRunning=false;els.refreshProvidersButton.textContent='Refresh all shows';}}
  function updateTmdbUI(){if(!els.tmdbCredential)return;els.tmdbCredential.value=prefs.tmdbCredential||'';els.tmdbStatus.textContent=prefs.tmdbCredential?'Configured':'Not configured';}

  function getRedirectUri(){return `${location.origin}${location.pathname}`;}
  function base64Url(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function randomVerifier(){const bytes=new Uint8Array(48);crypto.getRandomValues(bytes);return base64Url(bytes);}
  async function sha256(text){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));}
  async function connectDropbox(){const appKey=els.dropboxAppKey.value.trim();if(!appKey){showToast('Enter your Dropbox App Key');return;}const verifier=randomVerifier();const challenge=base64Url(await sha256(verifier));const oauthState=uuid();localStorage.setItem(PKCE_KEY,JSON.stringify({verifier,appKey,state:oauthState,createdAt:Date.now()}));dbx.appKey=appKey;saveDropbox();const url=new URL('https://www.dropbox.com/oauth2/authorize');url.searchParams.set('client_id',appKey);url.searchParams.set('response_type','code');url.searchParams.set('redirect_uri',getRedirectUri());url.searchParams.set('code_challenge',challenge);url.searchParams.set('code_challenge_method','S256');url.searchParams.set('token_access_type','offline');url.searchParams.set('state',oauthState);location.assign(url.toString());}
  async function handleDropboxCallback(){const params=new URLSearchParams(location.search);const code=params.get('code');const error=params.get('error');if(error){history.replaceState({},'',getRedirectUri());showToast('Dropbox connection was cancelled');return;}if(!code)return;try{const pkce=JSON.parse(localStorage.getItem(PKCE_KEY)||'null');if(!pkce?.verifier||!pkce?.appKey)throw new Error('Missing Dropbox authorization state');if(pkce.state&&params.get('state')!==pkce.state)throw new Error('Dropbox authorization state mismatch');const body=new URLSearchParams({code,grant_type:'authorization_code',client_id:pkce.appKey,redirect_uri:getRedirectUri(),code_verifier:pkce.verifier});const res=await fetch('https://api.dropboxapi.com/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!res.ok)throw new Error(await res.text());const token=await res.json();dbx={...dbx,connected:true,appKey:pkce.appKey,accessToken:token.access_token,refreshToken:token.refresh_token||dbx.refreshToken||'',expiresAt:Date.now()+((token.expires_in||14400)*1000)-60000,lastSync:null};localStorage.removeItem(PKCE_KEY);saveDropbox();history.replaceState({},'',getRedirectUri());await syncWithDropbox({announce:true});}catch(err){console.error(err);history.replaceState({},'',getRedirectUri());setSyncStatus('error','Dropbox connection failed');showToast('Could not connect Dropbox. Check the app key and redirect URI.');}}
  async function validAccessToken(){if(!dbx.connected||!dbx.accessToken)throw new Error('Dropbox is not connected');if(!dbx.expiresAt||Date.now()<dbx.expiresAt)return dbx.accessToken;if(!dbx.refreshToken)throw new Error('Dropbox authorization expired. Reconnect Dropbox.');const body=new URLSearchParams({grant_type:'refresh_token',refresh_token:dbx.refreshToken,client_id:dbx.appKey});const res=await fetch('https://api.dropboxapi.com/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!res.ok)throw new Error(await res.text());const token=await res.json();dbx.accessToken=token.access_token;dbx.expiresAt=Date.now()+((token.expires_in||14400)*1000)-60000;saveDropbox();return dbx.accessToken;}
  async function dropboxDownload(){const token=await validAccessToken();const res=await fetch('https://content.dropboxapi.com/2/files/download',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Dropbox-API-Arg':JSON.stringify({path:DATA_PATH})}});if(res.status===409)return null;if(!res.ok)throw new Error(await res.text());return JSON.parse(await res.text());}
  async function dropboxUpload(data){const token=await validAccessToken();const res=await fetch('https://content.dropboxapi.com/2/files/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/octet-stream','Dropbox-API-Arg':JSON.stringify({path:DATA_PATH,mode:'overwrite',autorename:false,mute:true})},body:JSON.stringify({...data,version:2,syncedAt:nowIso()},null,2)});if(!res.ok)throw new Error(await res.text());}

  function mergeStates(localRaw,remoteRaw){
    const local=normalizeState(localRaw);if(!remoteRaw||!Array.isArray(remoteRaw.shows))return local;const remote=normalizeState(remoteRaw);
    const columnTombs=latestTombstones([...local.columnDeleted,...remote.columnDeleted]);const colTombMap=new Map(columnTombs.map(d=>[d.id,d]));
    const columnMap=new Map();for(const c of [...local.columns,...remote.columns]){const old=columnMap.get(c.id);if(!old||Date.parse(c.updatedAt)>Date.parse(old.updatedAt))columnMap.set(c.id,clone(c));}
    let columns=[...columnMap.values()].filter(c=>{const tomb=colTombMap.get(c.id);return !tomb||Date.parse(c.updatedAt)>Date.parse(tomb.deletedAt);}).sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name));
    if(!columns.length)columns=defaultState().columns;columns.forEach((c,i)=>{c.order=i;c.color=safeColour(c.color,i);});

    const tombs=latestTombstones([...local.deleted,...remote.deleted]);const tombMap=new Map(tombs.map(d=>[d.id,d]));const showMap=new Map();
    for(const s of [...local.shows,...remote.shows]){const old=showMap.get(s.id);if(!old||Date.parse(s.updatedAt)>Date.parse(old.updatedAt))showMap.set(s.id,clone(s));}
    const validCols=new Set(columns.map(c=>c.id));const first=columns[0].id;const shows=[...showMap.values()].filter(s=>{const tomb=tombMap.get(s.id);return !tomb||Date.parse(s.updatedAt)>Date.parse(tomb.deletedAt);}).map(s=>({...s,columnId:validCols.has(s.columnId)?s.columnId:first}));

    const localViewsTime=Date.parse(local.savedViewsUpdatedAt||0)||0;const remoteViewsTime=Date.parse(remote.savedViewsUpdatedAt||0)||0;const savedViews=clone(remoteViewsTime>localViewsTime?remote.savedViews:local.savedViews);const savedViewsUpdatedAt=remoteViewsTime>localViewsTime?remote.savedViewsUpdatedAt:local.savedViewsUpdatedAt;
    return normalizeState({version:2,columnsUpdatedAt:new Date(Math.max(Date.parse(local.columnsUpdatedAt)||0,Date.parse(remote.columnsUpdatedAt)||0)).toISOString(),columns,columnDeleted:columnTombs,shows,deleted:tombs,savedViews,savedViewsUpdatedAt});
  }

  function scheduleSync(){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncWithDropbox(),900);}
  async function syncWithDropbox({announce=false}={}){if(!dbx.connected)return;setSyncStatus('syncing','Dropbox · syncing…');try{const remote=await dropboxDownload();state=mergeStates(state,remote);localStorage.setItem(STORAGE_KEY,JSON.stringify(state));await dropboxUpload(state);dbx.lastSync=nowIso();saveDropbox();render();setSyncStatus('connected','Dropbox · synced');if(announce)showToast('Dropbox connected and synced');}catch(err){console.error(err);setSyncStatus('error','Dropbox · sync problem');showToast('Dropbox sync failed. Your TV library is still saved on this device.');}}
  function disconnectDropbox(){if(!confirm('Disconnect Dropbox on this device? Your local TV library will remain here.'))return;dbx={connected:false,appKey:dbx.appKey||''};saveDropbox();setSyncStatus('local','Saved on this device');showToast('Dropbox disconnected');}
  function setSyncStatus(kind,label){els.statusDot.className='status-dot';if(kind==='connected')els.statusDot.classList.add('connected');if(kind==='syncing')els.statusDot.classList.add('syncing');if(kind==='error')els.statusDot.classList.add('error');els.syncLabel.textContent=label;}
  function updateDropboxUI(){if(!els.dropboxAppKey)return;els.redirectUriText.value=getRedirectUri();els.dropboxAppKey.value=dbx.appKey||'';els.dropboxSetup.hidden=!!dbx.connected;els.dropboxConnected.hidden=!dbx.connected;els.dropboxStatus.textContent=dbx.connected?'Connected':'Not connected';if(dbx.connected)setSyncStatus('connected',dbx.lastSync?'Dropbox · synced':'Dropbox · connected');else setSyncStatus('local','Saved on this device');}

  function exportBackup(){const blob=new Blob([JSON.stringify({...state,version:2,exportedAt:nowIso()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`tv-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);showToast('Backup exported');}
  async function importBackup(file){try{const incoming=JSON.parse(await file.text());if(!incoming||!Array.isArray(incoming.shows)||!Array.isArray(incoming.columns))throw new Error('Invalid backup');state=mergeStates(state,incoming);saveState();showToast('Backup imported');}catch(err){console.error(err);showToast('That file is not a valid TV backup');}finally{els.importInput.value='';}}

  function openSettings(){updateDropboxUI();updateTmdbUI();els.settingsDialog.showModal();}
  function showToast(message){clearTimeout(toastTimer);els.toast.textContent=message;els.toast.classList.add('show');toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2600);}
  function openMobileNav(){els.sidebar.classList.add('open');els.sidebarScrim.classList.add('open');document.body.style.overflow='hidden';}
  function closeMobileNav(){els.sidebar.classList.remove('open');els.sidebarScrim.classList.remove('open');if(!els.filterDrawer.classList.contains('open'))document.body.style.overflow='';}

  function bindEvents(){
    els.mobileMenuButton.onclick=openMobileNav;els.sidebarScrim.onclick=closeMobileNav;
    els.addShowButton.onclick=()=>openShowDialog();els.emptyAddButton.onclick=()=>openShowDialog();
    els.searchInput.oninput=render;els.sortSelect.onchange=()=>{sortMode=els.sortSelect.value;render();};
    els.filterButton.onclick=openFilterDrawer;els.closeFilterButton.onclick=closeFilterDrawer;els.drawerScrim.onclick=closeFilterDrawer;els.applyFiltersButton.onclick=applyFilters;els.clearFiltersButton.onclick=clearFilterDraft;els.saveViewButton.onclick=saveCurrentView;
    [els.filterEpisodes,els.filterTime,els.filterYearFrom,els.filterYearTo,els.filterRating,els.filterFavourite].forEach(el=>{el.addEventListener('change',readDraftScalarFilters);});
    els.showForm.onsubmit=saveShowFromForm;els.closeShowButton.onclick=closeShowDialog;els.cancelShowButton.onclick=closeShowDialog;els.deleteShowButton.onclick=deleteCurrentShow;els.lookupShowButton.onclick=lookupShows;els.showPoster.oninput=updatePosterPreview;els.showFavourite.onclick=()=>setFavourite(!draftMeta.favourite);els.refreshShowStreamingButton.onclick=refreshDraftProviders;els.refreshEpisodesButton.onclick=()=>loadEpisodeGuide(currentEpisodeShow()||draftMeta,true);
    els.genreAddButton.onclick=()=>addPickerValue('genres');els.tagAddButton.onclick=()=>addPickerValue('tags');els.genreAddInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addPickerValue('genres');}};els.tagAddInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addPickerValue('tags');}};
    els.showDialog.addEventListener('close', () => {
      const trigger = lastShowTrigger;
      const openedByPointer = lastShowOpenedByPointer;
      lastShowTrigger = null;
      lastShowOpenedByPointer = false;
      if (openedByPointer && trigger?.isConnected) requestAnimationFrame(() => trigger.blur());
    });
    els.settingsButton.onclick=openSettings;els.closeSettingsButton.onclick=()=>els.settingsDialog.close();els.openStatusesButton.onclick=()=>{renderStatusManager();els.statusesDialog.showModal();};els.closeStatusesButton.onclick=()=>els.statusesDialog.close();
    els.addStatusForm.onsubmit=e=>{e.preventDefault();addStatus(els.newStatusName.value);els.newStatusName.value='';};
    els.manageSavedViewsButton.onclick=()=>{renderSavedViewManager();els.savedViewsDialog.showModal();};els.closeSavedViewsButton.onclick=()=>els.savedViewsDialog.close();
    els.exportButton.onclick=exportBackup;els.importInput.onchange=()=>{const file=els.importInput.files?.[0];if(file)importBackup(file);};
    els.saveTmdbButton.onclick=testTmdb;els.refreshProvidersButton.onclick=refreshAllProviders;
    els.connectDropboxButton.onclick=connectDropbox;els.syncNowButton.onclick=()=>syncWithDropbox({announce:true});els.disconnectDropboxButton.onclick=disconnectDropbox;els.copyRedirectButton.onclick=async()=>{try{await navigator.clipboard.writeText(getRedirectUri());showToast('Redirect URI copied');}catch(_){els.redirectUriText.select();document.execCommand('copy');showToast('Redirect URI copied');}};
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(els.filterDrawer.classList.contains('open'))closeFilterDrawer();closeMobileNav();}});
  }

  async function init(){
    renderIcons();bindEvents();els.sortSelect.value=sortMode;
    await handleDropboxCallback();
    if(activeView.startsWith('saved:')){const v=state.savedViews.find(x=>x.id===activeView.slice(6));if(v){filters=normalizeFilters(v.filters);sortMode=v.sort;}else activeView='all';}
    if(els.fontSizeSelector) els.fontSizeSelector.addEventListener('click', event=>{ const btn=event.target.closest('[data-font-size]'); if(!btn)return; prefs.fontSize=validFontSize(btn.dataset.fontSize); savePrefs(); showToast(`Font size: ${btn.textContent}`); });
  applyFontSize();
  render();
    if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
    if(dbx.connected)syncWithDropbox().catch(()=>{});
  }

  init();
})();

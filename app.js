(() => {
  'use strict';

  const APP_VERSION = '3.0.0';
  const STORAGE_KEY = 'tvBoard.state.v1';
  const DROPBOX_KEY = 'tvBoard.dropbox.v1';
  const PKCE_KEY = 'tvBoard.pkce.v1';
  const PREFS_KEY = 'tvBoard.settings.v1';
  const UI_KEY = 'tvBoard.ui.v2';
  const DATA_PATH = '/tv-board.json';
  const ARCHIVE_WATCHED = 'watched';
  const ARCHIVE_ABANDONED = 'abandoned';
  const UNSORTED = 'unsorted';
  const TOMBSTONE_DAYS = 180;
  const POSTER_REPAIR_KEY = 'tv.poster-repair.v2.8.0';
  const HERO_POOL_LIMIT = 20;
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
  const TMDB_LIBRARY_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const $ = id => document.getElementById(id);
  const els = {
    sidebar: $('sidebar'), sidebarScrim: $('sidebarScrim'), mobileMenuButton: $('mobileMenuButton'),
    statusNav: $('statusNav'), watchingWithSection: $('watchingWithSection'), watchingWithNav: $('watchingWithNav'), savedViewsNav: $('savedViewsNav'), allCount: $('allCount'), watchingNowCount: $('watchingNowCount'), favouritesCount: $('favouritesCount'), watchedCount: $('watchedCount'), abandonedCount: $('abandonedCount'),
    alphabetJump: $('alphabetJump'),
    manageSavedViewsButton: $('manageSavedViewsButton'), settingsButton: $('settingsButton'), backFilterButton: $('backFilterButton'), backShowButton: $('backShowButton'), backStatusesButton: $('backStatusesButton'),
    viewTitle: $('viewTitle'), viewSubtitle: $('viewSubtitle'), syncChip: $('syncChip'), statusDot: $('statusDot'), syncLabel: $('syncLabel'),
    addShowButton: $('addShowButton'), emptyAddButton: $('emptyAddButton'), searchInput: $('searchInput'), filterButton: $('filterButton'), filterBadge: $('filterBadge'), sortSelect: $('sortSelect'), sortControl: $('sortControl'), sortButton: $('sortButton'), sortButtonLabel: $('sortButtonLabel'), sortMenu: $('sortMenu'), sortScrim: $('sortScrim'),
    activeFilters: $('activeFilters'), showList: $('showList'), emptyState: $('emptyState'), emptyTitle: $('emptyTitle'), emptyText: $('emptyText'), footerMessage: $('footerMessage'),
    filterDrawer: $('filterDrawer'), drawerScrim: $('drawerScrim'), closeFilterButton: $('closeFilterButton'), filterStatuses: $('filterStatuses'), filterGenres: $('filterGenres'), filterEpisodes: $('filterEpisodes'),
    filterTime: $('filterTime'), filterWatchingWith: $('filterWatchingWith'), filterLetters: $('filterLetters'), filterYearFrom: $('filterYearFrom'), filterYearTo: $('filterYearTo'), filterRating: $('filterRating'), filterFavourite: $('filterFavourite'), filterDateType: $('filterDateType'), filterDateFrom: $('filterDateFrom'), filterDateTo: $('filterDateTo'), filterNetworks: $('filterNetworks'), filterTags: $('filterTags'),
    clearFiltersButton: $('clearFiltersButton'), saveViewButton: $('saveViewButton'), applyFiltersButton: $('applyFiltersButton'),
    showDialog: $('showDialog'), showForm: $('showForm'), showDialogTitle: $('showDialogTitle'), showId: $('showId'), showTitle: $('showTitle'), showLocation: $('showLocation'), showRating: $('showRating'), showFavourite: $('showFavourite'), showFavouriteText: $('showFavouriteText'),
    showHero: $('showHero'), showHeroImage: $('showHeroImage'), showHeroTitle: $('showHeroTitle'), showHeroStatus: $('showHeroStatus'), refreshBackdropButton: $('refreshBackdropButton'),
    showPoster: $('showPoster'), posterPreview: $('posterPreview'), libraryArtworkPreview: $('libraryArtworkPreview'), refreshLibraryArtworkButton: $('refreshLibraryArtworkButton'), libraryArtworkStatus: $('libraryArtworkStatus'), lookupShowButton: $('lookupShowButton'), lookupStatus: $('lookupStatus'), lookupResults: $('lookupResults'), showYear: $('showYear'), showSeasons: $('showSeasons'), showEpisodes: $('showEpisodes'),
    showRuntime: $('showRuntime'), showTotalMinutes: $('showTotalMinutes'), showSeriesStatus: $('showSeriesStatus'), showNetwork: $('showNetwork'), showCountry: $('showCountry'), showWatchingWith: $('showWatchingWith'), watchingWithSuggestions: $('watchingWithSuggestions'), showStartedDate: $('showStartedDate'), showFinishedDate: $('showFinishedDate'), showAbandonedDate: $('showAbandonedDate'), viewingRunsList: $('viewingRunsList'), startRewatchButton: $('startRewatchButton'), watchedEpisodeChoice: $('watchedEpisodeChoice'), markAllEpisodesWatched: $('markAllEpisodesWatched'), markAllEpisodesButton: $('markAllEpisodesButton'), chooseEpisodesButton: $('chooseEpisodesButton'), skipEpisodesButton: $('skipEpisodesButton'), watchedEpisodeChoiceNote: $('watchedEpisodeChoiceNote'), showGenres: $('showGenres'), showMetacritic: $('showMetacritic'),
    networkOptions: $('networkOptions'), watchingWithOptions: $('watchingWithOptions'), genresPicker: $('genresPicker'), genresPickerSummary: $('genresPickerSummary'), genreChoices: $('genreChoices'), genreAddInput: $('genreAddInput'), genreAddButton: $('genreAddButton'), tagsPicker: $('tagsPicker'), tagsPickerSummary: $('tagsPickerSummary'), tagChoices: $('tagChoices'), tagAddInput: $('tagAddInput'), tagAddButton: $('tagAddButton'),
    streamingProvidersText: $('streamingProvidersText'), streamingProvidersNote: $('streamingProvidersNote'), refreshShowStreamingButton: $('refreshShowStreamingButton'), showTags: $('showTags'), showNotes: $('showNotes'),
    deleteShowButton: $('deleteShowButton'), closeShowButton: $('closeShowButton'), cancelShowButton: $('cancelShowButton'),
    statusesDialog: $('statusesDialog'), closeStatusesButton: $('closeStatusesButton'), statusManager: $('statusManager'), addStatusForm: $('addStatusForm'), newStatusName: $('newStatusName'),
    savedViewsDialog: $('savedViewsDialog'), closeSavedViewsButton: $('closeSavedViewsButton'), backSavedViewsButton: $('backSavedViewsButton'), savedViewManager: $('savedViewManager'),
    settingsDialog: $('settingsDialog'), closeSettingsButton: $('closeSettingsButton'), backSettingsButton: $('backSettingsButton'), openStatusesButton: $('openStatusesButton'), exportButton: $('exportButton'), importInput: $('importInput'),
    tmdbStatus: $('tmdbStatus'), tmdbCredential: $('tmdbCredential'), tmdbTestMessage: $('tmdbTestMessage'), saveTmdbButton: $('saveTmdbButton'), refreshProvidersButton: $('refreshProvidersButton'),
    dropboxStatus: $('dropboxStatus'), dropboxSetup: $('dropboxSetup'), dropboxConnected: $('dropboxConnected'), dropboxAppKey: $('dropboxAppKey'), redirectUriText: $('redirectUriText'), copyRedirectButton: $('copyRedirectButton'),
    connectDropboxButton: $('connectDropboxButton'), syncNowButton: $('syncNowButton'), disconnectDropboxButton: $('disconnectDropboxButton'), fontSizeSelector: $('fontSizeSelector'), themeSelector: $('themeSelector'), episodeGuideCard: $('episodeGuideCard'), episodeGuideStatus: $('episodeGuideStatus'), episodeProgressSummary: $('episodeProgressSummary'), episodeGuide: $('episodeGuide'), refreshEpisodesButton: $('refreshEpisodesButton'), castCard: $('castCard'), castStatus: $('castStatus'), castList: $('castList'), toast: $('toast')
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
    refresh: '<path d="M20 11a8 8 0 0 0-14.9-4M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14.9 4M20 20v-5h-5"/>',
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
  let viewingDateCleared = { started:false, finished:false, abandoned:false };
  let lookupController = null;
  let autocompleteTimer = null;
  let syncTimer = null;
  let toastTimer = null;
  let providerRefreshRunning = false;
  let lastShowTrigger = null;
  let lastShowOpenedByPointer = false;
  let libraryRenderPending = false;
  const episodeCache = new Map();
  const seasonProgressCache = new Map();
  const seasonProgressRequests = new Map();
  const castCache = new Map();
  const backdropPoolCache = new Map();
  const tmdbImagesCache = new Map();

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
  function normalizeBackdropPath(value) {
    const text=String(value||'').trim();
    if(!/^\/[A-Za-z0-9._-]{3,180}$/.test(text))return '';
    return text;
  }
  function normalizeBackdropPool(raw) {
    if(!Array.isArray(raw))return [];
    const out=[];const seen=new Set();
    raw.forEach(value=>{const path=normalizeBackdropPath(value);if(path&&!seen.has(path)&&out.length<HERO_POOL_LIMIT){seen.add(path);out.push(path);}});
    return out;
  }
  function tmdbBackdropUrl(path) { const clean=normalizeBackdropPath(path); return clean?`${TMDB_IMAGE_BASE}${clean}`:''; }
  function tmdbLibraryImageUrl(path) { const clean=normalizeBackdropPath(path); return clean?`${TMDB_LIBRARY_IMAGE_BASE}${clean}`:''; }

  function validIsoDate(value) { const text=String(value||'').trim(); return /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(Date.parse(`${text}T12:00:00`)) ? text : ''; }
  function todayIsoDate() { return new Date().toLocaleDateString('en-CA'); }
  function normalizeEpisodeWatchDates(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const out={}; Object.entries(raw).forEach(([key,value])=>{const d=validIsoDate(value); if(d) out[String(key).slice(0,80)]=d;}); return out;
  }
  function normalizeWatchedEpisodes(raw, dates={}) {
    const fromRaw=Array.isArray(raw)?raw:[];
    return cleanList([...fromRaw, ...Object.keys(normalizeEpisodeWatchDates(dates))], 5000, 80);
  }
  function normalizeViewingRuns(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.filter(Boolean).map((run,index)=>{
      const episodeWatchDates=normalizeEpisodeWatchDates(run.episodeWatchDates);
      const watchedEpisodes=normalizeWatchedEpisodes(run.watchedEpisodes, episodeWatchDates);
      const status=['in-progress','completed','abandoned'].includes(run.status)?run.status:'in-progress';
      return {
        id:safeText(run.id||`run-${index+1}`,100),
        status,
        startedDate:validIsoDate(run.startedDate||run.dateStarted),
        finishedDate:validIsoDate(run.finishedDate||run.dateFinished),
        abandonedDate:validIsoDate(run.abandonedDate||run.dateAbandoned),
        watchingWith:safeText(run.watchingWith||'',60),
        watchedEpisodes,
        episodeWatchDates,
        activeSeason:positiveIntegerOrNull(run.activeSeason),
        createdAt:validDateString(run.createdAt)?run.createdAt:nowIso(),
        updatedAt:validDateString(run.updatedAt)?run.updatedAt:nowIso()
      };
    }).slice(0,100);
  }
  function viewingRunDates(show,type) {
    const runs=Array.isArray(show?.viewingRuns)?show.viewingRuns:[];
    const field=type==='started'?'startedDate':type==='finished'?'finishedDate':'abandonedDate';
    return cleanList([show?.[field], ...runs.map(r=>r?.[field])].filter(Boolean), 200, 20).sort();
  }
  function activeViewingRun(show) {
    const runs=Array.isArray(show?.viewingRuns)?show.viewingRuns:[];
    const wanted=safeText(show?.currentViewingRunId||'',100);
    return runs.find(r=>r.id===wanted) || [...runs].reverse().find(r=>r.status==='in-progress') || null;
  }
  function episodeTracking(show) {
    const run=activeViewingRun(show);
    if (run) return { run, watchedEpisodes:normalizeWatchedEpisodes(run.watchedEpisodes,run.episodeWatchDates), episodeWatchDates:normalizeEpisodeWatchDates(run.episodeWatchDates), activeSeason:positiveIntegerOrNull(run.activeSeason) };
    const dates=normalizeEpisodeWatchDates(show?.episodeWatchDates);
    return { run:null, watchedEpisodes:normalizeWatchedEpisodes(show?.watchedEpisodes,dates), episodeWatchDates:dates, activeSeason:positiveIntegerOrNull(show?.activeSeason||show?.episodeProgress?.season) };
  }
  function ensureViewingRun(show,{startedDate='',watchingWith=''}={}) {
    if (!show) return null;
    show.viewingRuns=normalizeViewingRuns(show.viewingRuns);
    let run=activeViewingRun(show);
    if (run) return run;
    const legacyDates=normalizeEpisodeWatchDates(show.episodeWatchDates);
    const legacyWatched=normalizeWatchedEpisodes(show.watchedEpisodes,legacyDates);
    const hasLegacy=legacyWatched.length||show.startedDate||show.finishedDate||show.abandonedDate;
    if (hasLegacy) {
      const legacyStatus=show.archive===ARCHIVE_WATCHED?'completed':show.archive===ARCHIVE_ABANDONED?'abandoned':'in-progress';
      run={id:uuid(),status:legacyStatus,startedDate:validIsoDate(show.startedDate),finishedDate:validIsoDate(show.finishedDate),abandonedDate:validIsoDate(show.abandonedDate),watchingWith:safeText(show.watchingWith||watchingWith,60),watchedEpisodes:legacyWatched,episodeWatchDates:legacyDates,activeSeason:positiveIntegerOrNull(show.activeSeason||show.episodeProgress?.season),createdAt:show.createdAt||nowIso(),updatedAt:show.updatedAt||nowIso()};
      show.viewingRuns.push(run);
      if (legacyStatus==='in-progress') show.currentViewingRunId=run.id;
      return legacyStatus==='in-progress'?run:null;
    }
    run={id:uuid(),status:'in-progress',startedDate:validIsoDate(startedDate),finishedDate:'',abandonedDate:'',watchingWith:safeText(watchingWith||show.watchingWith,60),watchedEpisodes:[],episodeWatchDates:{},activeSeason:null,createdAt:nowIso(),updatedAt:nowIso()};
    show.viewingRuns.push(run);show.currentViewingRunId=run.id;return run;
  }
  function syncLegacyTrackingFromRun(show,run) {
    if (!show||!run) return;
    show.currentViewingRunId=run.status==='in-progress'?run.id:'';
    show.watchedEpisodes=normalizeWatchedEpisodes(run.watchedEpisodes,run.episodeWatchDates);
    show.episodeWatchDates=normalizeEpisodeWatchDates(run.episodeWatchDates);
    show.activeSeason=positiveIntegerOrNull(run.activeSeason);
    show.startedDate=validIsoDate(run.startedDate);
    show.finishedDate=validIsoDate(run.finishedDate);
    show.abandonedDate=validIsoDate(run.abandonedDate);
    if(run.watchingWith)show.watchingWith=safeText(run.watchingWith,60);
  }
  function episodeDateKey(ep) { return ep?.id ? `id:${ep.id}` : `s${Number(ep?.season)||0}e${Number(ep?.number)||0}`; }
  function latestEpisodeWatchedDate(show) {
    const values=[...Object.values(show?.episodeWatchDates||{}), ...(show?.viewingRuns||[]).flatMap(run=>Object.values(run?.episodeWatchDates||{}))].filter(Boolean).sort(); return values.at(-1)||'';
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
  function normalizeCast(items) {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    return items.map(item => ({
      person: safeText(item?.person?.name || item?.person || item?.personName || '', 120),
      character: safeText(item?.character?.name || item?.character || item?.characterName || '', 140)
    })).filter(item => item.person).filter(item => {
      const key = `${item.person.toLowerCase()}|${item.character.toLowerCase()}`;
      if (seen.has(key)) return false; seen.add(key); return true;
    }).slice(0, 40);
  }
  function splitComma(text) { return String(text || '').split(',').map(s => s.trim()).filter(Boolean); }
  function safeText(value, max = 200) { return String(value || '').trim().slice(0, max); }
  function slugify(value) {
    return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function defaultColour(index) {
    const palette = ['#476b86', '#6f7651', '#8b684f', '#76617d', '#496f6b', '#77654f', '#6b6f78'];
    return palette[index % palette.length];
  }
  function statusNavColour(column, index = 0) {
    const named = { watching: '#778DA9', next: '#a17e55', someday: '#7f9270', waiting: '#5f8883' };
    return named[String(column?.id || '').toLowerCase()] || safeColour(column?.color, index);
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
      seasonWatchedCount: integerOrNull(value.seasonWatchedCount),
      seasonTotalCount: positiveIntegerOrNull(value.seasonTotalCount),
      seasonRemaining: integerOrNull(value.seasonRemaining),
      updatedAt: validDateString(value.updatedAt) ? value.updatedAt : nowIso()
    };
  }

  function defaultState() {
    const t = nowIso();
    return {
      version: 2,
      columnsUpdatedAt: t,
      unsortedOrder: 0,
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

    // “Unsorted” is a built-in virtual status (blank columnId), not a real column.
    // Older builds allowed a real status with the same name to be created; fold it
    // back into the built-in status and use its position as the initial order hint.
    const accidentalUnsortedIndex = columns.findIndex(c => c.id.toLowerCase() === UNSORTED || c.name.trim().toLowerCase() === 'unsorted');
    const accidentalUnsortedIds = new Set(columns.filter(c => c.id.toLowerCase() === UNSORTED || c.name.trim().toLowerCase() === 'unsorted').map(c => c.id));
    columns = columns.filter(c => !accidentalUnsortedIds.has(c.id));
    if (!columns.length) columns = fallback.columns;
    columns.forEach((c,i) => { c.order = i; c.color = safeColour(c.color, i); });
    const rawUnsortedOrder = Number(raw.unsortedOrder);
    const unsortedOrder = Math.max(0, Math.min(columns.length, Number.isFinite(rawUnsortedOrder) ? Math.round(rawUnsortedOrder) : (accidentalUnsortedIndex >= 0 ? accidentalUnsortedIndex : 0)));
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
        columnId: String(s.columnId || '') === '' || accidentalUnsortedIds.has(String(s.columnId)) ? '' : (legacyWithColumns.has(String(s.columnId)) && watchingColumn ? watchingColumn.id : (validIds.has(String(s.columnId)) ? String(s.columnId) : first)),
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
        heroBackdropPath: normalizeBackdropPath(s.heroBackdropPath || s.backdropPath),
        heroBackdropPool: normalizeBackdropPool(s.heroBackdropPool || s.backdropPool),
        heroBackdropUpdatedAt: validDateString(s.heroBackdropUpdatedAt) ? s.heroBackdropUpdatedAt : null,
        libraryBackdropPath: normalizeBackdropPath(s.libraryBackdropPath),
        libraryBackdropPool: normalizeBackdropPool(s.libraryBackdropPool),
        libraryLogoPath: normalizeBackdropPath(s.libraryLogoPath),
        libraryArtworkUpdatedAt: validDateString(s.libraryArtworkUpdatedAt) ? s.libraryArtworkUpdatedAt : null,
        firstAirYear: positiveIntegerOrNull(s.firstAirYear ?? s.year),
        providers: cleanProviders(s.providers),
        cast: normalizeCast(s.cast),
        providersUpdatedAt: validDateString(s.providersUpdatedAt) ? s.providersUpdatedAt : null,
        providerLink: safeUrl(s.providerLink || ''),
        episodeProgress: normalizeEpisodeProgress(s.episodeProgress || s.progress),
        startedDate: validIsoDate(s.startedDate || s.dateStarted),
        finishedDate: validIsoDate(s.finishedDate || s.dateFinished),
        abandonedDate: validIsoDate(s.abandonedDate || s.dateAbandoned),
        episodeWatchDates: normalizeEpisodeWatchDates(s.episodeWatchDates),
        watchedEpisodes: normalizeWatchedEpisodes(s.watchedEpisodes, s.episodeWatchDates),
        activeSeason: positiveIntegerOrNull(s.activeSeason || s.episodeProgress?.season),
        viewingRuns: normalizeViewingRuns(s.viewingRuns),
        currentViewingRunId: safeText(s.currentViewingRunId || '', 100),
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
      unsortedOrder,
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
      return parsed && typeof parsed === 'object' ? { tmdbCredential: '', fontSize: 'standard', theme: 'system', ...parsed } : { tmdbCredential: '', fontSize: 'standard', theme: 'system' };
    } catch (_) { return { tmdbCredential: '', fontSize: 'standard', theme: 'system' }; }
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
  function savePrefs() { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); updateTmdbUI(); applyFontSize(); applyTheme(); }
  function saveDropbox() { localStorage.setItem(DROPBOX_KEY, JSON.stringify(dbx)); updateDropboxUI(); }
  function requestLibraryRender() {
    if (els.showDialog?.open) { libraryRenderPending = true; return; }
    render();
  }
  function flushPendingLibraryRender() {
    if (!libraryRenderPending) return;
    libraryRenderPending = false;
    requestAnimationFrame(() => render());
  }
  function saveState({ sync = true, rerender = true } = {}) {
    state = normalizeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (rerender) requestLibraryRender();
    if (sync && dbx.connected) scheduleSync();
  }

  function emptyFilters() {
    return { statuses: [], watchingWith: [], genres: [], letter: '', episodes: '', time: '', yearFrom: '', yearTo: '', rating: '', favourite: '', dateType: '', dateFrom: '', dateTo: '', networks: [], tags: [] };
  }
  function normalizeFilters(raw) {
    const f = { ...emptyFilters(), ...(raw || {}) };
    return {
      statuses: cleanList(f.statuses, 50, 100),
      watchingWith: cleanList(f.watchingWith, 50, 60),
      genres: cleanGenres(f.genres),
      letter: /^[A-Z#]$/.test(String(f.letter || '').toUpperCase()) ? String(f.letter).toUpperCase() : '',
      episodes: ['','1-6','7-12','13-24','25-49','50+'].includes(f.episodes) ? f.episodes : '',
      time: ['','under5','under10','10-20','20-40','40+'].includes(f.time) ? f.time : '',
      yearFrom: /^\d{4}$/.test(String(f.yearFrom || '')) ? String(f.yearFrom) : '',
      yearTo: /^\d{4}$/.test(String(f.yearTo || '')) ? String(f.yearTo) : '',
      rating: ['','5','4.5','4','3','unrated'].includes(String(f.rating ?? '')) ? String(f.rating ?? '') : '',
      favourite: ['','yes','no'].includes(f.favourite) ? f.favourite : '',
      dateType: ['','started','episode','finished','abandoned'].includes(f.dateType) ? f.dateType : '',
      dateFrom: /^\d{4}-\d{2}-\d{2}$/.test(String(f.dateFrom || '')) ? String(f.dateFrom) : '',
      dateTo: /^\d{4}-\d{2}-\d{2}$/.test(String(f.dateTo || '')) ? String(f.dateTo) : '',
      networks: cleanList(f.networks, 50, 100),
      tags: cleanTags(f.tags)
    };
  }
  function validSort(value) {
    return ['recent','added','title-asc','title-desc','year-desc','year-asc','rating-desc','rating-asc','episodes-asc','episodes-desc','time-asc','time-desc','network','status','started-desc','started-asc','finished-desc','finished-asc','abandoned-desc','abandoned-asc','episode-watched-desc'].includes(value);
  }

  function statusFor(show) {
    if (show.archive === ARCHIVE_WATCHED) return { id: ARCHIVE_WATCHED, name: 'Watched', color: '#77766f', archive: true };
    if (show.archive === ARCHIVE_ABANDONED) return { id: ARCHIVE_ABANDONED, name: 'Abandoned', color: '#8a7c72', archive: true };
    if (!show.columnId) return { id: UNSORTED, name: 'Unsorted', color: '#77766f', archive: false, virtual: true };
    return state.columns.find(c => c.id === show.columnId) || { id: UNSORTED, name: 'Unsorted', color: '#77766f', archive: false, virtual: true };
  }
  function statusOrderItems() {
    const columns = [...state.columns].sort((a,b) => a.order - b.order || a.name.localeCompare(b.name));
    const position = Math.max(0, Math.min(columns.length, Number.isFinite(Number(state.unsortedOrder)) ? Math.round(Number(state.unsortedOrder)) : 0));
    const items = columns.map((column, index) => ({ id: column.id, name: column.name, color: statusNavColour(column, index), column, virtual: false }));
    items.splice(position, 0, { id: UNSORTED, name: 'Unsorted', color: '#9a968d', column: null, virtual: true });
    return items;
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
    if (!rating) return '';
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
    if (activeView === 'watching-now') { const watching=state.columns.find(c=>c.id==='watching'||c.name.toLowerCase()==='watching'); return Boolean(watching) && !show.archive && show.columnId===watching.id; }
    if (activeView === 'favourites') return show.favourite;
    if (activeView === UNSORTED) return !show.archive && !show.columnId;
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
    const castTerms = (show.cast || []).flatMap(c => [c.person, c.character]);
    const haystack = [show.title, show.network, show.country, show.seriesStatus, show.watchingWith, ...(show.genres || []), ...(show.providers || []), ...(show.tags || []), ...castTerms, show.notes].join(' ').toLowerCase();
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
    if (f.letter && titleInitial(show.title) !== f.letter) return false;
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
    if (f.rating === 'unrated' && !(show.archive===ARCHIVE_WATCHED && show.rating===0)) return false;
    if (f.rating && f.rating !== 'unrated' && show.rating < Number(f.rating)) return false;
    if (f.favourite === 'yes' && !show.favourite) return false;
    if (f.favourite === 'no' && show.favourite) return false;
    if (f.dateType || f.dateFrom || f.dateTo) {
      const runEpisodeDates=(show.viewingRuns||[]).flatMap(run=>Object.values(run.episodeWatchDates||{}));
      const dates = f.dateType==='started' ? viewingRunDates(show,'started') : f.dateType==='finished' ? viewingRunDates(show,'finished') : f.dateType==='abandoned' ? viewingRunDates(show,'abandoned') : f.dateType==='episode' ? [...Object.values(show.episodeWatchDates||{}),...runEpisodeDates] : [...viewingRunDates(show,'started'),...viewingRunDates(show,'finished'),...viewingRunDates(show,'abandoned'),...Object.values(show.episodeWatchDates||{}),...runEpisodeDates];
      const valid=dates.filter(Boolean); if(!valid.length)return false;
      if(f.dateFrom && !valid.some(d=>d>=f.dateFrom && (!f.dateTo||d<=f.dateTo)))return false;
      if(f.dateTo && !valid.some(d=>d<=f.dateTo && (!f.dateFrom||d>=f.dateFrom)))return false;
    }
    return true;
  }

  function titleSortKey(title) {
    return String(title || '').trim().replace(/^(?:the|an|a)\s+/i, '').trim() || String(title || '').trim();
  }
  function titleInitial(title) {
    const key = titleSortKey(title);
    const first = key.charAt(0).toUpperCase();
    return /^[A-Z]$/.test(first) ? first : '#';
  }
  const TITLE_LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];
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
        case 'started-desc': return (viewingRunDates(b,'started').at(-1)||'').localeCompare(viewingRunDates(a,'started').at(-1)||'') || compareShowTitles(a,b);
        case 'started-asc': return (viewingRunDates(a,'started')[0]||'9999-99-99').localeCompare(viewingRunDates(b,'started')[0]||'9999-99-99') || compareShowTitles(a,b);
        case 'finished-desc': return (viewingRunDates(b,'finished').at(-1)||'').localeCompare(viewingRunDates(a,'finished').at(-1)||'') || compareShowTitles(a,b);
        case 'finished-asc': return (viewingRunDates(a,'finished')[0]||'9999-99-99').localeCompare(viewingRunDates(b,'finished')[0]||'9999-99-99') || compareShowTitles(a,b);
        case 'abandoned-desc': return (viewingRunDates(b,'abandoned').at(-1)||'').localeCompare(viewingRunDates(a,'abandoned').at(-1)||'') || compareShowTitles(a,b);
        case 'abandoned-asc': return (viewingRunDates(a,'abandoned')[0]||'9999-99-99').localeCompare(viewingRunDates(b,'abandoned')[0]||'9999-99-99') || compareShowTitles(a,b);
        case 'episode-watched-desc': return latestEpisodeWatchedDate(b).localeCompare(latestEpisodeWatchedDate(a)) || compareShowTitles(a,b);
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
    if (activeView === 'watching-now') return ['Watching Now', 'What you are watching and where you left off.'];
    if (activeView === 'favourites') return ['Favourites', 'Shows you have marked as favourites.'];
    if (activeView === UNSORTED) return ['Unsorted', 'Shows you have added but have not assigned a status yet.'];
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

  function validFontSize(value){ return ['small','standard','large','extra-large','xx-large','xxx-large'].includes(value) ? value : 'standard'; }
  function applyFontSize(){
    prefs.fontSize=validFontSize(prefs.fontSize); document.documentElement.dataset.fontSize=prefs.fontSize;
    if(els.fontSizeSelector) els.fontSizeSelector.querySelectorAll('[data-font-size]').forEach(btn=>btn.classList.toggle('active',btn.dataset.fontSize===prefs.fontSize));
  }
  function validTheme(value){ return ['system','light','dark'].includes(value) ? value : 'system'; }
  function resolvedTheme(){ const choice=validTheme(prefs.theme); return choice==='system' ? (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light') : choice; }
  function applyTheme(){
    prefs.theme=validTheme(prefs.theme); const theme=resolvedTheme(); document.documentElement.dataset.theme=theme; document.documentElement.dataset.themeChoice=prefs.theme; const themeMeta=document.querySelector('meta[name="theme-color"]'); if(themeMeta)themeMeta.content=theme==='dark'?'#171918':'#f4f1ea';
    document.documentElement.style.colorScheme=theme; const meta=document.querySelector('meta[name="theme-color"]'); if(meta)meta.content=theme==='dark'?'#171918':'#f4f1ea';
    if(els.themeSelector) els.themeSelector.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeChoice===prefs.theme));
  }

  function render() {
    applyFontSize();
    applyTheme();
    state = normalizeState(state);
    if (activeView.startsWith('status:') && !state.columns.some(c => c.id === activeView.slice(7))) activeView = 'all';
    if (activeView.startsWith('with:') && !decodeURIComponent(activeView.slice(5))) activeView = 'all';
    if (activeView.startsWith('saved:') && !state.savedViews.some(v => v.id === activeView.slice(6))) activeView = 'all';
    saveUi();
    renderNavigation();
    renderHeader();
    renderActiveFilters();
    renderAlphabetJump();
    renderShowList();
    updateDropboxUI();
    updateTmdbUI();
    renderIcons();
  }

  function renderNavigation() {
    const activeShows = state.shows.filter(s => !s.archive);
    els.allCount.textContent = state.shows.length;
    const watchingColumnNav=state.columns.find(c=>c.id==='watching'||c.name.toLowerCase()==='watching');
    if(els.watchingNowCount) els.watchingNowCount.textContent=watchingColumnNav?activeShows.filter(s=>s.columnId===watchingColumnNav.id).length:0;
    els.favouritesCount.textContent = state.shows.filter(s => s.favourite).length;
    els.watchedCount.textContent = state.shows.filter(s => s.archive === ARCHIVE_WATCHED).length;
    els.abandonedCount.textContent = state.shows.filter(s => s.archive === ARCHIVE_ABANDONED).length;

    els.statusNav.replaceChildren();
    statusOrderItems().forEach(item => {
      const btn = document.createElement('button');
      btn.className = `nav-item status-nav${item.virtual ? ' unsorted-status' : ''}${item.name.length > 18 ? ' long-status' : ''}`;
      btn.dataset.view = item.virtual ? UNSORTED : `status:${item.id}`;
      btn.style.setProperty('--status-nav-color', item.color);
      const count = item.virtual ? activeShows.filter(s => !s.columnId).length : activeShows.filter(s => s.columnId === item.id).length;
      btn.innerHTML = `<span class="nav-icon">${iconSvg('bookmark')}</span><span class="nav-item-label"></span><span class="nav-count">${count}</span>`;
      btn.children[1].textContent = item.name;
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

  function renderSortControl() {
    if(!els.sortSelect||!els.sortMenu||!els.sortButtonLabel)return;
    els.sortSelect.value=sortMode;const selected=els.sortSelect.selectedOptions?.[0];els.sortButtonLabel.textContent=selected?.textContent||'Sort';
    els.sortMenu.replaceChildren();[...els.sortSelect.options].forEach(option=>{const button=document.createElement('button');button.type='button';button.className=`sort-menu-item${option.value===sortMode?' active':''}`;button.setAttribute('role','menuitemradio');button.setAttribute('aria-checked',String(option.value===sortMode));button.textContent=option.textContent;button.onclick=()=>{sortMode=option.value;els.sortSelect.value=sortMode;closeSortMenu();render();};els.sortMenu.appendChild(button);});
  }
  function closeSortMenu({restoreFocus=false}={}) {
    if(!els.sortMenu)return;
    els.sortMenu.hidden=true;els.sortButton?.setAttribute('aria-expanded','false');if(els.sortScrim)els.sortScrim.hidden=true;document.body.classList.remove('sort-menu-open');
    if(!els.sidebar.classList.contains('open')&&!els.filterDrawer.classList.contains('open'))document.body.style.overflow='';
    if(restoreFocus)els.sortButton?.focus();
  }
  function toggleSortMenu() {
    if(!els.sortMenu)return;
    const opening=els.sortMenu.hidden;if(!opening){closeSortMenu();return;}
    renderSortControl();els.sortMenu.hidden=false;els.sortButton?.setAttribute('aria-expanded','true');
    const phone=window.matchMedia('(max-width: 720px)').matches;
    if(phone){if(els.sortScrim)els.sortScrim.hidden=false;document.body.classList.add('sort-menu-open');document.body.style.overflow='hidden';}
    requestAnimationFrame(()=>els.sortMenu.querySelector('.sort-menu-item.active')?.scrollIntoView({block:'nearest'}));
  }
  function renderHeader() {
    const [title] = currentViewInfo();
    const shows = currentShows();
    els.viewTitle.textContent = title;
    els.viewSubtitle.textContent = `${shows.length} ${shows.length === 1 ? 'show' : 'shows'}`;
    els.sortSelect.value = sortMode;renderSortControl();
    const count = filterCount(filters);
    els.filterBadge.hidden = count === 0;
    els.filterBadge.textContent = count;
  }

  function renderAlphabetJump() {
    if (!els.alphabetJump) return;
    els.alphabetJump.replaceChildren();
    els.alphabetJump.hidden = activeView !== 'all';
    if (activeView !== 'all') return;
    const baseFilters = { ...filters, letter: '' };
    const pool = state.shows.filter(show => baseViewMatch(show) && searchMatch(show) && filtersMatch(show, baseFilters));
    const available = new Set(pool.map(show => titleInitial(show.title)));
    const makeButton = (label, letter='') => {
      const btn=document.createElement('button'); btn.type='button'; btn.textContent=label;
      if (letter) {
        btn.dataset.letter=letter; btn.disabled=!available.has(letter); btn.classList.toggle('available',available.has(letter));
        btn.classList.toggle('active',filters.letter===letter);
        btn.onclick=()=>jumpToLetter(letter);
      } else {
        btn.classList.add('available'); btn.onclick=()=>jumpToLetter('');
      }
      return btn;
    };
    els.alphabetJump.appendChild(makeButton('All'));
    TITLE_LETTERS.forEach(letter=>els.alphabetJump.appendChild(makeButton(letter,letter)));
  }
  function jumpToLetter(letter) {
    if (activeView !== 'all') return;
    if (filters.letter) filters = { ...filters, letter: '' };
    sortMode='title-asc';
    render();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if (!letter) { els.showList.scrollIntoView({behavior:'smooth',block:'start'}); return; }
      const target=[...els.showList.querySelectorAll('.show-row')].find(row=>row.dataset.letter===letter);
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    }));
  }

  function seasonProgressInfo(show) {
    const p=show?.episodeProgress;
    if(!p)return null;
    const season=positiveIntegerOrNull(p.nextSeason || show.activeSeason || p.season);
    if(!season)return null;
    const cached=seasonProgressCache.get(show.id);
    if(cached&&cached.season===season)return cached;
    if(p.seasonTotalCount&&p.seasonRemaining!==null&&p.seasonRemaining!==undefined){
      return {season,total:p.seasonTotalCount,watched:p.seasonWatchedCount||Math.max(0,p.seasonTotalCount-p.seasonRemaining),remaining:Math.max(0,p.seasonRemaining)};
    }
    return null;
  }

  async function hydrateSeasonProgress(show) {
    if(!show?.id||show.archive||!show.tvmazeId||!show.episodeProgress)return;
    const targetSeason=positiveIntegerOrNull(show.episodeProgress.nextSeason || show.activeSeason || show.episodeProgress.season);
    const cached=seasonProgressCache.get(show.id);
    if((cached&&cached.season===targetSeason)||seasonProgressRequests.has(show.id))return;
    if(cached)seasonProgressCache.delete(show.id);
    const request=(async()=>{
      try{
        let episodes=episodeCache.get(show.tvmazeId);
        if(!episodes){
          const res=await fetch(`https://api.tvmaze.com/shows/${show.tvmazeId}/episodes`);
          if(!res.ok)return;
          episodes=normalizeTvmazeEpisodes(await res.json());
          episodeCache.set(show.tvmazeId,episodes);
        }
        const p=show.episodeProgress;
        const season=positiveIntegerOrNull(p.nextSeason || show.activeSeason || p.season);
        const entries=episodes.filter(ep=>ep.season===season);
        if(!season||!entries.length)return;
        const tracking=episodeTracking(show);
        const watchedSet=new Set(tracking.watchedEpisodes);
        let watched=entries.filter(ep=>watchedSet.has(episodeDateKey(ep))).length;
        let remaining=entries.length-watched;
        // Pre-v2.7 progress markers may not yet have episode-level states. Their
        // next episode is still enough to derive progress inside this season.
        if(!watchedSet.size&&p.nextSeason===season&&p.nextEpisode){
          remaining=entries.filter(ep=>ep.number>=p.nextEpisode).length;
          watched=Math.max(0,entries.length-remaining);
        }else if(!watchedSet.size&&!p.nextSeason&&p.season===season){
          remaining=0;watched=entries.length;
        }
        seasonProgressCache.set(show.id,{season,total:entries.length,watched,remaining});
        if(document.querySelector(`.show-row[data-show-id="${CSS.escape(show.id)}"]`)){
          renderShowList();renderIcons(els.showList);
        }
      }catch(err){console.warn('Could not calculate current-season progress',err);}
      finally{seasonProgressRequests.delete(show.id);}
    })();
    seasonProgressRequests.set(show.id,request);
  }

  function queueSeasonProgressHydration(shows) {
    shows.filter(show=>!show.archive&&show.tvmazeId&&show.episodeProgress).forEach(hydrateSeasonProgress);
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
    for (const show of shows) els.showList.appendChild(activeView==='watching-now'?buildWatchingNowRow(show):buildShowRow(show));
    queueSeasonProgressHydration(shows);
  }

  function setArtwork(container, url) {
    container.replaceChildren(); container.classList.remove('portrait-source','library-artwork'); container.style.removeProperty('--artwork-url'); container.style.removeProperty('background');
    const safe=safeUrl(url); if(!safe){container.innerHTML=`<div class="poster-fallback">${iconSvg('tv')}</div>`;return;}
    const img=new Image();img.src=safe;img.alt='';img.loading='lazy';img.className='artwork-main';
    img.onload=()=>{
      if(img.naturalHeight>img.naturalWidth*1.12){
        container.classList.add('portrait-source');
        container.style.setProperty('--artwork-url',`url("${safe.replace(/"/g,'%22')}")`);
        // Let the surrounding card show through beside a portrait poster. This is
        // more reliable than a fixed fill in Safari dark mode and avoids grey bars.
        container.style.setProperty('background','transparent','important');
      }
    };
    img.onerror=()=>{container.classList.remove('portrait-source');container.style.removeProperty('--artwork-url');container.style.removeProperty('background');container.innerHTML=`<div class="poster-fallback">${iconSvg('tv')}</div>`;};container.appendChild(img);
  }


  function setLibraryArtwork(container, show) {
    const backdropPath=normalizeBackdropPath(show?.libraryBackdropPath || show?.heroBackdropPath);
    const logoPath=normalizeBackdropPath(show?.libraryLogoPath);
    if(!backdropPath){setArtwork(container,show?.poster);return;}
    container.replaceChildren();container.classList.remove('portrait-source');container.classList.add('library-artwork');container.style.removeProperty('--artwork-url');container.style.removeProperty('background');
    const backdrop=new Image();backdrop.src=tmdbLibraryImageUrl(backdropPath);backdrop.alt='';backdrop.loading='lazy';backdrop.decoding='async';backdrop.className='library-backdrop';
    backdrop.onerror=()=>{container.classList.remove('library-artwork');setArtwork(container,show?.poster);};
    container.appendChild(backdrop);
    if(logoPath){
      const logo=new Image();logo.src=tmdbLibraryImageUrl(logoPath);logo.alt='';logo.loading='lazy';logo.decoding='async';logo.className='library-logo';
      logo.onerror=()=>logo.remove();container.appendChild(logo);
    }else{
      const fallback=document.createElement('span');fallback.className='library-title-fallback';fallback.textContent=safeText(show?.title,120);container.appendChild(fallback);
    }
  }

  function buildShowRow(show) {
    const row = document.createElement('button');
    row.type = 'button'; row.className = 'show-row'; row.dataset.showId = show.id; row.dataset.letter = titleInitial(show.title);
    const status = statusFor(show);
    const poster = document.createElement('div'); poster.className = 'row-poster'; setLibraryArtwork(poster,show);

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
    if (!show.archive && show.episodeProgress) { const p = show.episodeProgress; const progressText = p.nextSeason && p.nextEpisode ? `Next: S${p.nextSeason} E${p.nextEpisode}` : `Season ${p.season} complete`; meta.appendChild(metaSpan('play', progressText)); }
    const seasonInfo=!show.archive?seasonProgressInfo(show):null;
    if(seasonInfo&&seasonInfo.remaining>0) meta.appendChild(metaSpan('tv', `${seasonInfo.remaining} left in S${seasonInfo.season}`));
    else if(!show.episodeProgress&&show.episodes !== null) meta.appendChild(metaSpan('tv', `${show.episodes} ${show.episodes === 1 ? 'episode' : 'episodes'}`));
    const duration = formatDuration(effectiveTotalMinutes(show));
    if (duration) meta.appendChild(metaSpan('clock', duration));
    if (show.country) meta.appendChild(metaSpan('calendar', show.country));
    main.appendChild(meta);

    const personal = document.createElement('div'); personal.className = 'row-personal';
    const rating = document.createElement('div'); rating.className = 'rating-text'; rating.textContent = show.rating ? formatRating(show.rating) : (show.archive===ARCHIVE_WATCHED ? 'Unrated' : ''); personal.appendChild(rating);
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
  function buildWatchingNowRow(show) {
    const row=buildShowRow(show); row.classList.add('watching-now-row');
    const personal=row.querySelector('.row-personal'); if(personal)personal.remove();
    const pill=row.querySelector('.status-pill'); if(pill)pill.remove();
    const main=row.querySelector('.row-main');
    const progress=document.createElement('div');progress.className='watching-now-progress';
    const p=show.episodeProgress;
    const primary=document.createElement('strong');
    if(p?.nextSeason&&p?.nextEpisode) primary.textContent=`Next: S${p.nextSeason} E${p.nextEpisode}${p.nextTitle?` — ${p.nextTitle}`:''}`;
    else if(p && !p.nextSeason) primary.textContent=`Season ${p.season} complete`; else primary.textContent='Not started';
    const secondary=document.createElement('span');
    if(p?.seasonTotalCount) secondary.textContent=`Season ${p.season}: ${p.seasonWatchedCount||0} of ${p.seasonTotalCount} watched · ${p.seasonRemaining||0} left`;
    else if(p?.watchedCount&&p?.totalCount) secondary.textContent=`${p.watchedCount} of ${p.totalCount} episodes watched`;
    else if(show.watchingWith) secondary.textContent=`Watching with ${show.watchingWith}`; else secondary.textContent='Open the show to set your episode progress.';
    progress.append(primary,secondary); main.appendChild(progress);
    return row;
  }

  function metaSpan(icon, text) { const span = document.createElement('span'); span.innerHTML = `${iconSvg(icon)}<b></b>`; span.querySelector('b').style.fontWeight = '500'; span.querySelector('b').textContent = text; return span; }

  function filterCount(f) {
    return f.statuses.length + f.watchingWith.length + f.genres.length + f.networks.length + f.tags.length + [f.letter, f.episodes, f.time, f.yearFrom, f.yearTo, f.rating, f.favourite, f.dateType, f.dateFrom, f.dateTo].filter(Boolean).length;
  }

  function renderActiveFilters() {
    els.activeFilters.replaceChildren();
    const chips = [];
    filters.statuses.forEach(id => chips.push([`status:${id}`, statusName(id)]));
    filters.watchingWith.forEach(w => chips.push([`with:${w}`, `With ${w}`]));
    filters.genres.forEach(v => chips.push([`genre:${v}`, v]));
    filters.networks.forEach(v => chips.push([`network:${v}`, v]));
    filters.tags.forEach(v => chips.push([`tag:${v}`, `#${v}`]));
    if (filters.letter) chips.push(['letter', `${filters.letter} titles`]);
    if (filters.episodes) chips.push(['episodes', episodeLabel(filters.episodes)]);
    if (filters.time) chips.push(['time', timeLabel(filters.time)]);
    if (filters.yearFrom) chips.push(['yearFrom', `From ${filters.yearFrom}`]);
    if (filters.yearTo) chips.push(['yearTo', `To ${filters.yearTo}`]);
    if (filters.rating) chips.push(['rating', ratingFilterLabel(filters.rating)]);
    if (filters.favourite) chips.push(['favourite', filters.favourite === 'yes' ? 'Favourites' : 'Not favourites']);
    if(filters.dateType)chips.push(['dateType',({started:'Started',episode:'Episode watched',finished:'Finished',abandoned:'Abandoned'})[filters.dateType]||filters.dateType]);
    if(filters.dateFrom)chips.push(['dateFrom',`Date from ${filters.dateFrom}`]);
    if(filters.dateTo)chips.push(['dateTo',`Date to ${filters.dateTo}`]);
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
    if (id === UNSORTED) return 'Unsorted';
    return state.columns.find(c => c.id === id)?.name || id;
  }
  function episodeLabel(v) { return ({'1-6':'1–6 episodes','7-12':'7–12 episodes','13-24':'13–24 episodes','25-49':'25–49 episodes','50+':'50+ episodes'})[v] || v; }
  function timeLabel(v) { return ({under5:'Under 5h',under10:'Under 10h','10-20':'10–20h','20-40':'20–40h','40+':'40h+'})[v] || v; }
  function ratingFilterLabel(v) { if (v === 'unrated') return 'Unrated'; return `${v}★+`; }

  let suppressOverlayPop = false;
  function pushOverlayState(name) {
    if (history.state?.tvOverlay === name) return;
    history.pushState({ ...(history.state || {}), tvOverlay: name }, '', location.href);
  }
  function removeOverlayState(name) {
    if (history.state?.tvOverlay !== name) return;
    suppressOverlayPop = true;
    history.back();
  }
  function closeTopOverlayDirect() {
    if (els.statusesDialog.open) { els.statusesDialog.close(); return true; }
    if (els.savedViewsDialog.open) { els.savedViewsDialog.close(); return true; }
    if (els.showDialog.open) { closeShowDialog(true); return true; }
    if (els.settingsDialog.open) { els.settingsDialog.close(); return true; }
    if (els.filterDrawer.classList.contains('open')) { closeFilterDrawer(true); return true; }
    if (els.sidebar.classList.contains('open')) { closeMobileNav(); return true; }
    return false;
  }
  function closeDialogWithHistory(dialog, name) {
    if (dialog.open) dialog.close();
    removeOverlayState(name);
  }

  function openFilterDrawer() {
    if (!els.filterDrawer.classList.contains('open')) pushOverlayState('filters');
    filterDraft = clone(filters);
    renderFilterControls();
    els.filterDrawer.classList.add('open'); els.drawerScrim.classList.add('open'); els.filterDrawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeFilterDrawer(skipHistory=false) {
    els.filterDrawer.classList.remove('open'); els.drawerScrim.classList.remove('open'); els.filterDrawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if(!skipHistory) removeOverlayState('filters');
  }
  function renderFilterControls() {
    filterDraft = normalizeFilters(filterDraft);
    els.filterStatuses.replaceChildren();
    [...statusOrderItems().map(item => ({ id:item.id, name:item.name })), {id:ARCHIVE_WATCHED,name:'Watched'}, {id:ARCHIVE_ABANDONED,name:'Abandoned'}].forEach(item => {
      const label = document.createElement('label'); label.className = 'check-option';
      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = filterDraft.statuses.includes(item.id);
      cb.onchange = () => toggleDraftArray('statuses', item.id, cb.checked);
      const span = document.createElement('span'); span.textContent = item.name; label.append(cb,span); els.filterStatuses.appendChild(label);
    });
    renderLetterFilterChoices();
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
    els.filterDateType.value = filterDraft.dateType; els.filterDateFrom.value=filterDraft.dateFrom; els.filterDateTo.value=filterDraft.dateTo;
    els.saveViewButton.textContent = activeView.startsWith('saved:') ? 'Update View' : 'Save View';
  }
  function renderLetterFilterChoices() {
    if (!els.filterLetters) return;
    els.filterLetters.replaceChildren();
    TITLE_LETTERS.forEach(letter=>{
      const btn=document.createElement('button'); btn.type='button'; btn.className=`choice-pill${filterDraft.letter===letter?' selected':''}`; btn.textContent=letter;
      btn.onclick=()=>{ filterDraft.letter=filterDraft.letter===letter?'':letter; renderFilterControls(); };
      els.filterLetters.appendChild(btn);
    });
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
    filterDraft.dateType = els.filterDateType.value; filterDraft.dateFrom=els.filterDateFrom.value; filterDraft.dateTo=els.filterDateTo.value;
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
    const items = statusOrderItems();
    items.forEach((item,index) => {
      const row=document.createElement('div'); row.className='manager-row';
      const left=document.createElement('div');left.style.cssText='display:grid;grid-template-columns:36px minmax(0,1fr);gap:7px;align-items:center;';
      if (item.virtual) {
        const swatch=document.createElement('span');swatch.className='manager-status-swatch';swatch.style.background=item.color;swatch.setAttribute('aria-hidden','true');
        const name=document.createElement('div');name.className='manager-fixed-status';name.innerHTML='<strong>Unsorted</strong>';row.title='Unsorted is the built-in blank status and cannot be deleted.';
        left.append(swatch,name);
      } else {
        const c=item.column;
        const color=document.createElement('input');color.type='color';color.value=safeColour(c.color,c.order);color.title='Status colour';color.style.cssText='width:34px;height:30px;padding:2px;border:1px solid var(--line);border-radius:7px;background:#fff;';
        color.onchange=()=>{c.color=color.value;c.updatedAt=nowIso();state.columnsUpdatedAt=c.updatedAt;saveState();};
        const name=document.createElement('input');name.value=c.name;name.maxLength=50;name.onchange=()=>{const val=name.value.trim();if(!val){name.value=c.name;return;}if(val.toLowerCase()==='unsorted'){showToast('Unsorted is built in');name.value=c.name;return;}c.name=val;c.updatedAt=nowIso();state.columnsUpdatedAt=c.updatedAt;saveState();renderStatusManager();};
        left.append(color,name);
      }
      const actions=document.createElement('div');actions.className='manager-actions';
      const up=document.createElement('button');up.type='button';up.textContent='↑';up.title='Move up';up.disabled=index===0;up.onclick=()=>moveStatus(index,-1);
      const down=document.createElement('button');down.type='button';down.textContent='↓';down.title='Move down';down.disabled=index===items.length-1;down.onclick=()=>moveStatus(index,1);
      actions.append(up,down);
      if (item.virtual) {
        const locked=document.createElement('button');locked.type='button';locked.textContent='×';locked.disabled=true;locked.title='Unsorted is built in and cannot be deleted';locked.setAttribute('aria-label','Unsorted cannot be deleted');actions.appendChild(locked);
      } else {
        const del=document.createElement('button');del.type='button';del.textContent='×';del.title='Delete status';del.disabled=state.columns.length===1;del.onclick=()=>deleteStatus(item.id);actions.appendChild(del);
      }
      row.append(left,actions);els.statusManager.appendChild(row);
    });
  }
  function moveStatus(index,delta) {
    const items=statusOrderItems();const target=index+delta;if(target<0||target>=items.length)return;
    [items[index],items[target]]=[items[target],items[index]];
    const t=nowIso();state.unsortedOrder=items.findIndex(item=>item.virtual);
    state.columns=items.filter(item=>!item.virtual).map(item=>item.column);
    state.columns.forEach((c,i)=>{c.order=i;c.updatedAt=t;});state.columnsUpdatedAt=t;saveState();renderStatusManager();
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
    if(text.toLowerCase()==='unsorted'){showToast('Unsorted is built in. Reorder it above.');return;}
    if(state.columns.some(c=>c.name.toLowerCase()===text.toLowerCase())){showToast('That status already exists');return;}
    const t=nowIso();const base=slugify(text)||'status';let id=base;let i=2;while(state.columns.some(c=>c.id===id))id=`${base}-${i++}`;
    state.columns.push({id,name:text.slice(0,50),order:state.columns.length,color:defaultColour(state.columns.length),updatedAt:t});state.columnsUpdatedAt=t;saveState();renderStatusManager();
  }

  const STANDARD_GENRES = ['Action','Adventure','Animation','Classic','Comedy','Crime','Documentary','Drama','Family','Fantasy','History','Horror','Music','Mystery','Romance','Science Fiction','Sport','Thriller','War','Western'];
  const COMMON_NETWORKS = ['Apple TV+','BBC','CBC','Crave','Disney+','HBO','HBO Max','ITV','Netflix','Paramount+','PBS','Prime Video','StackTV'];
  const COMMON_COUNTRIES = ['Argentina','Australia','Austria','Belgium','Brazil','Canada','Chile','China','Colombia','Czech Republic','Denmark','Finland','France','Germany','Greece','Hong Kong','Hungary','Iceland','India','Ireland','Israel','Italy','Japan','Mexico','Netherlands','New Zealand','Norway','Poland','Portugal','Singapore','South Africa','South Korea','Spain','Sweden','Switzerland','Taiwan','Turkey','United Kingdom','United States'];

  function populateDatalist(el, values) {
    if (!el) return;
    el.replaceChildren();
    uniqueSorted(values).forEach(value => { const option=document.createElement('option'); option.value=value; el.appendChild(option); });
  }
  function populateSelect(el, values, selected = '', blankLabel = 'Not specified') {
    if (!el) return;
    const wanted = String(selected || '').trim();
    el.replaceChildren();
    const blank = document.createElement('option'); blank.value=''; blank.textContent=blankLabel; el.appendChild(blank);
    const choices = uniqueSorted([...values, ...(wanted ? [wanted] : [])]);
    choices.forEach(value => { const option=document.createElement('option'); option.value=value; option.textContent=value; el.appendChild(option); });
    el.value = wanted;
  }
  function setSelectValue(el, value) {
    if (!el) return;
    const wanted=String(value||'').trim();
    if (wanted && ![...el.options].some(o=>o.value===wanted)) { const option=document.createElement('option'); option.value=wanted; option.textContent=wanted; el.appendChild(option); }
    el.value=wanted;
  }
  function watchingWithValues() {
    return uniqueSorted(state.shows.flatMap(show=>[show.watchingWith, ...(show.viewingRuns||[]).map(run=>run.watchingWith)]).filter(Boolean));
  }
  function hideWatchingWithSuggestions() {
    if(!els.watchingWithSuggestions)return;els.watchingWithSuggestions.hidden=true;els.showWatchingWith?.setAttribute('aria-expanded','false');
  }
  function renderWatchingWithSuggestions() {
    if(!els.watchingWithSuggestions||!els.showWatchingWith)return;
    const query=els.showWatchingWith.value.trim().toLowerCase();
    const values=watchingWithValues().filter(value=>!query||value.toLowerCase().includes(query)).slice(0,12);
    els.watchingWithSuggestions.replaceChildren();
    if(!values.length){hideWatchingWithSuggestions();return;}
    values.forEach(value=>{const button=document.createElement('button');button.type='button';button.className='watching-with-option';button.setAttribute('role','option');button.textContent=value;button.onclick=()=>{els.showWatchingWith.value=value;hideWatchingWithSuggestions();els.showWatchingWith.focus();};els.watchingWithSuggestions.appendChild(button);});
    els.watchingWithSuggestions.hidden=false;els.showWatchingWith.setAttribute('aria-expanded','true');
  }
  function refreshEditorChoices() {
    populateDatalist(els.networkOptions, [...COMMON_NETWORKS, ...state.shows.flatMap(s=>allNetworkValues(s))]);
    populateSelect(els.showCountry, [...COMMON_COUNTRIES, ...state.shows.map(s=>s.country).filter(Boolean)], els.showCountry?.value || '', 'Not specified');
    populateDatalist(els.watchingWithOptions, watchingWithValues());
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
    statusOrderItems().forEach(item=>{const o=document.createElement('option');o.value=item.virtual?UNSORTED:`status:${item.id}`;o.textContent=item.name;els.showLocation.appendChild(o);});
    const w=document.createElement('option');w.value=ARCHIVE_WATCHED;w.textContent='Watched';els.showLocation.appendChild(w);
    const a=document.createElement('option');a.value=ARCHIVE_ABANDONED;a.textContent='Abandoned';els.showLocation.appendChild(a);
    els.showLocation.value=selected&&[...els.showLocation.options].some(o=>o.value===selected)?selected:UNSORTED;
  }

  function openShowDialog(show=null) {
    draftMeta = show ? clone(show) : { providers: [], providerLink:'', providersUpdatedAt:null, tvmazeId:null, imdbId:'', tmdbId:null, cast: [], heroBackdropPath:'', heroBackdropPool:[], heroBackdropUpdatedAt:null, libraryBackdropPath:'', libraryBackdropPool:[], libraryLogoPath:'', libraryArtworkUpdatedAt:null };
    viewingDateCleared = { started:false, finished:false, abandoned:false };
    els.showDialogTitle.textContent = show ? 'Edit Show' : 'Add Show';
    els.showId.value=show?.id||'';els.showTitle.value=show?.title||'';els.showRating.value=String(show?.rating||0);els.showPoster.value=show?.poster||'';
    const location=show ? (show.archive || (show.columnId ? `status:${show.columnId}` : UNSORTED)) : UNSORTED; fillLocationOptions(location);
    setFavourite(Boolean(show?.favourite));
    els.showYear.value=show?.firstAirYear||'';els.showSeasons.value=show?.seasons??'';els.showEpisodes.value=show?.episodes??'';els.showRuntime.value=show?.runtime??'';els.showTotalMinutes.value=show?.totalMinutes??'';
    const seriesStatus=show?.seriesStatus||''; if(seriesStatus && ![...els.showSeriesStatus.options].some(o=>o.value===seriesStatus)){const option=document.createElement('option');option.value=seriesStatus;option.textContent=seriesStatus;els.showSeriesStatus.appendChild(option);} els.showSeriesStatus.value=seriesStatus;els.showNetwork.value=show?.network||'';els.showWatchingWith.value=show?.watchingWith||'';els.showStartedDate.value=show?.startedDate||'';els.showFinishedDate.value=show?.finishedDate||'';els.showAbandonedDate.value=show?.abandonedDate||'';els.showGenres.value=(show?.genres||[]).join(', ');els.showMetacritic.value=show?.metacritic||'';
    els.showTags.value=(show?.tags||[]).join(', ');els.showNotes.value=show?.notes||'';refreshEditorChoices();setSelectValue(els.showCountry,show?.country||'');clearTimeout(autocompleteTimer);autocompleteTimer=null;els.lookupStatus.textContent=show?'Find details uses TVmaze to refresh poster artwork and show metadata.':'Start typing a title for TVmaze suggestions, or use Find details.';els.lookupResults.hidden=true;els.lookupResults.replaceChildren();els.showTitle.setAttribute('aria-expanded','false');
    const editableRun=activeViewingRun(draftMeta)||normalizeViewingRuns(draftMeta.viewingRuns).at(-1);if(editableRun){els.showStartedDate.value=editableRun.startedDate||els.showStartedDate.value;els.showFinishedDate.value=editableRun.finishedDate||els.showFinishedDate.value;els.showAbandonedDate.value=editableRun.abandonedDate||els.showAbandonedDate.value;if(editableRun.watchingWith&&!els.showWatchingWith.value)els.showWatchingWith.value=editableRun.watchingWith;}
    if(els.markAllEpisodesWatched)els.markAllEpisodesWatched.checked=false;if(els.watchedEpisodeChoice)els.watchedEpisodeChoice.dataset.choice='';updateWatchedEpisodeChoice();renderViewingHistory();hideWatchingWithSuggestions();
    els.deleteShowButton.style.visibility=show?'visible':'hidden';updatePosterPreview();renderLibraryArtworkPreview(draftMeta);renderStreamingPreview();renderHeroBackdrop(draftMeta);
    prepareEpisodeGuide(show);
    prepareCast(show);
    if(!els.showDialog.open){pushOverlayState('show');els.showDialog.showModal();}
    prepareHeroBackdrop(show || draftMeta);
    prepareLibraryArtwork(show || draftMeta);
    setTimeout(()=>els.showTitle.focus(),30);
  }
  function closeShowDialog(skipHistory=false){clearTimeout(autocompleteTimer);autocompleteTimer=null;if(els.showDialog.open)els.showDialog.close(); if(lookupController){lookupController.abort();lookupController=null;}els.showTitle.setAttribute('aria-expanded','false');if(!skipHistory)removeOverlayState('show');flushPendingLibraryRender();}
  function setFavourite(value){draftMeta.favourite=Boolean(value);els.showFavourite.classList.toggle('active',draftMeta.favourite);els.showFavourite.setAttribute('aria-pressed',String(draftMeta.favourite));els.showFavouriteText.textContent=draftMeta.favourite?'Favourite':'Not favourite';}
  function viewingStatusLabel(run){return run.status==='completed'?'Completed':run.status==='abandoned'?'Abandoned':'In progress';}
  function syncViewingDateField(kind) {
    const map={started:{el:els.showStartedDate,field:'startedDate'},finished:{el:els.showFinishedDate,field:'finishedDate'},abandoned:{el:els.showAbandonedDate,field:'abandonedDate'}};
    const cfg=map[kind];if(!cfg)return;
    const value=validIsoDate(cfg.el.value);
    viewingDateCleared[kind]=!value;
    draftMeta[cfg.field]=value;
    draftMeta.viewingRuns=normalizeViewingRuns(draftMeta.viewingRuns);
    const run=activeViewingRun(draftMeta)||draftMeta.viewingRuns.at(-1)||null;
    if(run){run[cfg.field]=value;run.updatedAt=nowIso();}
    renderViewingHistory();
  }
  function renderViewingHistory() {
    if(!els.viewingRunsList)return;
    draftMeta.viewingRuns=normalizeViewingRuns(draftMeta.viewingRuns);
    els.viewingRunsList.replaceChildren();
    const runs=draftMeta.viewingRuns;
    if(!runs.length){const empty=document.createElement('div');empty.className='viewing-run-empty';empty.textContent=els.showId.value?'No separate viewing history has been recorded yet.':'Viewing history will begin when you start watching.';els.viewingRunsList.appendChild(empty);}
    runs.forEach((run,index)=>{
      const row=document.createElement('div');row.className=`viewing-run${run.id===draftMeta.currentViewingRunId?' current':''}`;
      const title=document.createElement('strong');title.textContent=index===0?'First viewing':`Rewatch ${index}`;
      const meta=document.createElement('span');const dates=[run.startedDate?`started ${run.startedDate}`:'',run.finishedDate?`finished ${run.finishedDate}`:'',run.abandonedDate?`abandoned ${run.abandonedDate}`:''].filter(Boolean);const watchedCount=normalizeWatchedEpisodes(run.watchedEpisodes,run.episodeWatchDates).length;meta.textContent=[viewingStatusLabel(run),dates.join(' · '),watchedCount?`${watchedCount} episode${watchedCount===1?'':'s'}`:'',run.watchingWith?`with ${run.watchingWith}`:''].filter(Boolean).join(' · ');
      row.append(title,meta);els.viewingRunsList.appendChild(row);
    });
    const active=activeViewingRun(draftMeta);const watching=state.columns.find(c=>c.id==='watching'||c.name.toLowerCase()==='watching');const currentlyWatching=Boolean(watching&&els.showLocation.value===`status:${watching.id}`);
    if(els.startRewatchButton){els.startRewatchButton.hidden=!els.showId.value||Boolean(active)||currentlyWatching;els.startRewatchButton.disabled=Boolean(active)||currentlyWatching;}
  }
  function createHistoricalRunFromCurrent(show) {
    show.viewingRuns=normalizeViewingRuns(show.viewingRuns);
    if(show.viewingRuns.length)return;
    const tracking=episodeTracking(show);
    if(show.archive===ARCHIVE_WATCHED || show.finishedDate || tracking.watchedEpisodes.length){
      show.viewingRuns.push({id:uuid(),status:'completed',startedDate:validIsoDate(show.startedDate),finishedDate:validIsoDate(show.finishedDate),abandonedDate:'',watchingWith:safeText(show.watchingWith,60),watchedEpisodes:tracking.watchedEpisodes,episodeWatchDates:tracking.episodeWatchDates,activeSeason:tracking.activeSeason,createdAt:show.createdAt||nowIso(),updatedAt:show.updatedAt||nowIso()});
    } else if(show.archive===ARCHIVE_ABANDONED || show.abandonedDate){
      show.viewingRuns.push({id:uuid(),status:'abandoned',startedDate:validIsoDate(show.startedDate),finishedDate:'',abandonedDate:validIsoDate(show.abandonedDate),watchingWith:safeText(show.watchingWith,60),watchedEpisodes:tracking.watchedEpisodes,episodeWatchDates:tracking.episodeWatchDates,activeSeason:tracking.activeSeason,createdAt:show.createdAt||nowIso(),updatedAt:show.updatedAt||nowIso()});
    }
  }
  function startRewatch() {
    if(!els.showId.value)return;
    createHistoricalRunFromCurrent(draftMeta);
    const run={id:uuid(),status:'in-progress',startedDate:todayIsoDate(),finishedDate:'',abandonedDate:'',watchingWith:safeText(els.showWatchingWith.value,60),watchedEpisodes:[],episodeWatchDates:{},activeSeason:null,createdAt:nowIso(),updatedAt:nowIso()};
    draftMeta.viewingRuns=normalizeViewingRuns([...(draftMeta.viewingRuns||[]),run]);draftMeta.currentViewingRunId=run.id;draftMeta.watchedEpisodes=[];draftMeta.episodeWatchDates={};draftMeta.activeSeason=null;draftMeta.episodeProgress=null;
    els.showStartedDate.value=run.startedDate;els.showFinishedDate.value='';els.showAbandonedDate.value='';
    const watching=state.columns.find(c=>c.id==='watching'||c.name.toLowerCase()==='watching');if(watching)els.showLocation.value=`status:${watching.id}`;
    renderViewingHistory();loadEpisodeGuide(draftMeta,false);showToast('New rewatch started');
  }
  function updateWatchedEpisodeChoice({reset=false}={}){
    if(!els.watchedEpisodeChoice)return;
    const isWatched=els.showLocation.value===ARCHIVE_WATCHED;
    els.watchedEpisodeChoice.hidden=!isWatched;
    if(!isWatched){
      if(els.markAllEpisodesWatched)els.markAllEpisodesWatched.checked=false;
      els.watchedEpisodeChoice.dataset.choice='';
      return;
    }
    if(reset)els.watchedEpisodeChoice.dataset.choice='';
    const choice=els.watchedEpisodeChoice.dataset.choice||'';
    if(els.markAllEpisodesWatched)els.markAllEpisodesWatched.checked=choice==='all';
    [els.markAllEpisodesButton,els.chooseEpisodesButton,els.skipEpisodesButton].forEach(btn=>btn?.classList.remove('active'));
    if(choice==='all')els.markAllEpisodesButton?.classList.add('active');
    if(choice==='choose')els.chooseEpisodesButton?.classList.add('active');
    if(choice==='none')els.skipEpisodesButton?.classList.add('active');
    if(els.watchedEpisodeChoiceNote){
      els.watchedEpisodeChoiceNote.textContent=choice==='all'?'All available episodes will be marked watched when you save. Historical episode dates will stay unknown.':choice==='choose'?'Choose the seasons or individual episodes you actually watched in the Episode Guide below.':choice==='none'?'The show will be saved as Watched without inventing episode history.':'Choose how TV should record the episode history for this watched show.';
    }
  }
  async function chooseWatchedEpisodeHistory(choice){
    if(!els.watchedEpisodeChoice||els.showLocation.value!==ARCHIVE_WATCHED)return;
    els.watchedEpisodeChoice.dataset.choice=choice;
    updateWatchedEpisodeChoice();
    if(choice==='choose'){
      const show=currentEpisodeShow()||draftMeta;
      if(show?.tvmazeId)await loadEpisodeGuide(show,false);
      requestAnimationFrame(()=>els.episodeGuideCard?.scrollIntoView({behavior:'smooth',block:'start'}));
    }
  }
  function rankBackdropPool(items) {
    const valid=(Array.isArray(items)?items:[]).filter(item=>normalizeBackdropPath(item?.file_path) && Number(item?.aspect_ratio||0)>=1.45);
    valid.sort((a,b)=>Number(b?.vote_average||0)-Number(a?.vote_average||0) || Number(b?.vote_count||0)-Number(a?.vote_count||0) || Number(b?.width||0)-Number(a?.width||0));
    const paths=[];const seen=new Set();
    valid.forEach(item=>{const path=normalizeBackdropPath(item.file_path);if(path&&!seen.has(path)&&paths.length<HERO_POOL_LIMIT){seen.add(path);paths.push(path);}});
    return paths;
  }
  function rankLogoPath(items) {
    const valid=(Array.isArray(items)?items:[]).filter(item=>normalizeBackdropPath(item?.file_path));
    const languageScore=item=>item?.iso_639_1==='en'?3:(item?.iso_639_1===null||item?.iso_639_1===undefined||item?.iso_639_1==='')?2:1;
    valid.sort((a,b)=>languageScore(b)-languageScore(a) || Number(b?.vote_average||0)-Number(a?.vote_average||0) || Number(b?.vote_count||0)-Number(a?.vote_count||0) || Number(b?.width||0)-Number(a?.width||0));
    return normalizeBackdropPath(valid[0]?.file_path);
  }
  async function fetchTmdbImages(meta,{force=false}={}) {
    if(!prefs.tmdbCredential)throw new Error('TMDB is not configured');
    let tmdbId=positiveIntegerOrNull(meta?.tmdbId || draftMeta.tmdbId);
    if(!tmdbId)tmdbId=await resolveTmdbId(meta||draftMeta);
    if(!tmdbId)return {tmdbId:null,data:null};
    if(!force&&tmdbImagesCache.has(tmdbId))return {tmdbId,data:tmdbImagesCache.get(tmdbId)};
    const data=await tmdbRequest(`/tv/${tmdbId}/images`);tmdbImagesCache.set(tmdbId,data);return {tmdbId,data};
  }
  function libraryArtworkLabel(meta=draftMeta) {
    const hasLogo=Boolean(normalizeBackdropPath(meta?.libraryLogoPath));
    const count=normalizeBackdropPool(meta?.libraryBackdropPool).length;
    if(!normalizeBackdropPath(meta?.libraryBackdropPath))return 'No TMDB library artwork yet';
    return `${hasLogo?'TMDB backdrop + logo':'TMDB backdrop'}${count?` · top ${Math.min(count,HERO_POOL_LIMIT)}`:''}`;
  }
  function renderLibraryArtworkPreview(meta=draftMeta,{loading=false}={}) {
    if(!els.libraryArtworkPreview)return;
    const previewMeta={...meta,title:els.showTitle?.value||meta?.title||'',poster:els.showPoster?.value||meta?.poster||''};
    if(loading){els.libraryArtworkPreview.replaceChildren();els.libraryArtworkPreview.className='library-artwork-preview loading';const span=document.createElement('span');span.textContent='Building library artwork…';els.libraryArtworkPreview.appendChild(span);}
    else{els.libraryArtworkPreview.className='library-artwork-preview';setLibraryArtwork(els.libraryArtworkPreview,previewMeta);}
    if(els.libraryArtworkStatus)els.libraryArtworkStatus.textContent=loading?'Loading TMDB backdrop and logo…':libraryArtworkLabel(meta);
    if(els.refreshLibraryArtworkButton){const pool=normalizeBackdropPool(meta?.libraryBackdropPool);els.refreshLibraryArtworkButton.disabled=loading||(!prefs.tmdbCredential&&!pool.length);}
  }
  function persistLibraryArtwork() {
    const id=els.showId?.value;if(!id)return;
    const show=state.shows.find(item=>item.id===id);if(!show)return;
    show.tmdbId=positiveIntegerOrNull(draftMeta.tmdbId || show.tmdbId);
    show.libraryBackdropPath=normalizeBackdropPath(draftMeta.libraryBackdropPath);
    show.libraryBackdropPool=normalizeBackdropPool(draftMeta.libraryBackdropPool);
    show.libraryLogoPath=normalizeBackdropPath(draftMeta.libraryLogoPath);
    show.libraryArtworkUpdatedAt=validDateString(draftMeta.libraryArtworkUpdatedAt)?draftMeta.libraryArtworkUpdatedAt:nowIso();
    show.updatedAt=nowIso();saveState({rerender:true});
  }
  async function prepareLibraryArtwork(meta=draftMeta,{force=false,quiet=false}={}) {
    const currentBackdrop=normalizeBackdropPath(draftMeta.libraryBackdropPath || meta?.libraryBackdropPath);
    const currentLogo=normalizeBackdropPath(draftMeta.libraryLogoPath || meta?.libraryLogoPath);
    const attempted=validDateString(draftMeta.libraryArtworkUpdatedAt || meta?.libraryArtworkUpdatedAt);
    if(!force&&currentBackdrop&&(currentLogo||attempted)){
      draftMeta.libraryBackdropPath=currentBackdrop;draftMeta.libraryLogoPath=currentLogo;draftMeta.libraryBackdropPool=normalizeBackdropPool(draftMeta.libraryBackdropPool||meta?.libraryBackdropPool);renderLibraryArtworkPreview(draftMeta);return;
    }
    const hasIdentity=Boolean(positiveIntegerOrNull(draftMeta.tmdbId||meta?.tmdbId)||safeText(draftMeta.imdbId||meta?.imdbId,40)||safeText(els.showTitle?.value||meta?.title,120));
    if(!prefs.tmdbCredential||!hasIdentity){renderLibraryArtworkPreview(draftMeta);return;}
    if(!quiet)renderLibraryArtworkPreview(draftMeta,{loading:true});
    try{
      const result=await fetchTmdbImages(meta,{force});
      if(!result.tmdbId||!result.data){renderLibraryArtworkPreview(draftMeta);return;}
      draftMeta.tmdbId=result.tmdbId;
      const pool=rankBackdropPool(result.data.backdrops);draftMeta.libraryBackdropPool=normalizeBackdropPool(pool);
      if(force||!currentBackdrop)draftMeta.libraryBackdropPath=randomBackdropPath(draftMeta.libraryBackdropPool,normalizeBackdropPath(draftMeta.heroBackdropPath));else draftMeta.libraryBackdropPath=currentBackdrop;
      draftMeta.libraryLogoPath=rankLogoPath(result.data.logos);
      draftMeta.libraryArtworkUpdatedAt=nowIso();persistLibraryArtwork();renderLibraryArtworkPreview(draftMeta);
    }catch(err){console.warn('TMDB library artwork lookup failed',err);renderLibraryArtworkPreview(draftMeta);if(!quiet)showToast('Library artwork could not be loaded');}
  }
  async function refreshLibraryArtwork() {
    if(!els.refreshLibraryArtworkButton)return;els.refreshLibraryArtworkButton.disabled=true;if(els.libraryArtworkStatus)els.libraryArtworkStatus.textContent='Finding another library backdrop…';
    try{
      let pool=normalizeBackdropPool(draftMeta.libraryBackdropPool);let logo=normalizeBackdropPath(draftMeta.libraryLogoPath);
      if(pool.length<2||!logo){const result=await fetchTmdbImages(draftMeta,{force:true});draftMeta.tmdbId=result.tmdbId;pool=rankBackdropPool(result.data?.backdrops);logo=rankLogoPath(result.data?.logos);draftMeta.libraryBackdropPool=normalizeBackdropPool(pool);draftMeta.libraryLogoPath=logo;}
      if(!pool.length){showToast('No TMDB backdrops are available for this show');renderLibraryArtworkPreview(draftMeta);return;}
      const current=normalizeBackdropPath(draftMeta.libraryBackdropPath);const next=randomBackdropPath(pool,current);
      if(!next||next===current){showToast('No other library backdrop is available');renderLibraryArtworkPreview(draftMeta);return;}
      draftMeta.libraryBackdropPath=next;draftMeta.libraryArtworkUpdatedAt=nowIso();persistLibraryArtwork();renderLibraryArtworkPreview(draftMeta);showToast('Library artwork changed');
    }catch(err){console.error(err);showToast('Library artwork could not be refreshed');renderLibraryArtworkPreview(draftMeta);}
  }
  function randomBackdropPath(pool,current='') {
    const clean=normalizeBackdropPool(pool);if(!clean.length)return '';
    const options=clean.length>1?clean.filter(path=>path!==current):clean;
    if(!options.length)return clean[0];
    let index=0;
    if(globalThis.crypto?.getRandomValues){const values=new Uint32Array(1);crypto.getRandomValues(values);index=values[0]%options.length;}else index=Math.floor(Math.random()*options.length);
    return options[index];
  }
  function heroPoolLabel(meta=draftMeta) {
    const count=normalizeBackdropPool(meta?.heroBackdropPool).length;
    if(count>=HERO_POOL_LIMIT)return `TMDB · top ${HERO_POOL_LIMIT} backdrops`;
    if(count>1)return `TMDB · ${count} backdrops`;
    return 'TMDB backdrop';
  }
  function renderHeroBackdrop(meta=draftMeta,{loading=false}={}) {
    if(!els.showHero)return;
    const path=normalizeBackdropPath(meta?.heroBackdropPath);
    const title=safeText(els.showTitle?.value || meta?.title || '',120);
    if(els.showHeroTitle)els.showHeroTitle.textContent=title;
    if(path){
      els.showHero.hidden=false;els.showHero.classList.remove('loading');
      const url=tmdbBackdropUrl(path);if(els.showHeroImage.getAttribute('src')!==url)els.showHeroImage.src=url;
      els.showHeroImage.alt=title?`${title} backdrop`: 'TV show backdrop';
      els.showHeroStatus.textContent=heroPoolLabel(meta);
    }else if(loading){
      els.showHero.hidden=false;els.showHero.classList.add('loading');els.showHeroImage.removeAttribute('src');els.showHeroImage.alt='';els.showHeroStatus.textContent='Loading TMDB backdrop…';
    }else{
      els.showHero.hidden=true;els.showHero.classList.remove('loading');els.showHeroImage.removeAttribute('src');els.showHeroImage.alt='';
    }
    const pool=normalizeBackdropPool(meta?.heroBackdropPool);
    const canRefresh=pool.length>1 || Boolean(prefs.tmdbCredential);
    els.refreshBackdropButton.disabled=!canRefresh || loading;
    els.refreshBackdropButton.title=canRefresh?'Choose another backdrop from this show’s top-rated TMDB images':'Add a TMDB credential in Settings to load backdrops';
  }
  async function fetchHeroBackdropPool(meta,{force=false}={}) {
    if(!prefs.tmdbCredential)throw new Error('TMDB is not configured');
    let tmdbId=positiveIntegerOrNull(meta?.tmdbId || draftMeta.tmdbId);
    if(!tmdbId)tmdbId=await resolveTmdbId(meta||draftMeta);
    if(!tmdbId)return {tmdbId:null,pool:[]};
    if(!force){
      const stored=normalizeBackdropPool(meta?.heroBackdropPool || draftMeta.heroBackdropPool);if(stored.length)return {tmdbId,pool:stored};
      const cached=backdropPoolCache.get(tmdbId);if(cached?.length)return {tmdbId,pool:cached};
    }
    const images=await fetchTmdbImages({...meta,tmdbId},{force});const data=images.data;
    const pool=rankBackdropPool(data?.backdrops);backdropPoolCache.set(tmdbId,pool);
    return {tmdbId,pool};
  }
  function persistHeroBackdrop() {
    const id=els.showId?.value;if(!id)return;
    const show=state.shows.find(item=>item.id===id);if(!show)return;
    show.tmdbId=positiveIntegerOrNull(draftMeta.tmdbId || show.tmdbId);
    show.heroBackdropPath=normalizeBackdropPath(draftMeta.heroBackdropPath);
    show.heroBackdropPool=normalizeBackdropPool(draftMeta.heroBackdropPool);
    show.heroBackdropUpdatedAt=validDateString(draftMeta.heroBackdropUpdatedAt)?draftMeta.heroBackdropUpdatedAt:nowIso();
    show.updatedAt=nowIso();
    saveState({rerender:false});
  }
  async function prepareHeroBackdrop(meta=draftMeta) {
    const current=normalizeBackdropPath(draftMeta.heroBackdropPath || meta?.heroBackdropPath);
    if(current){draftMeta.heroBackdropPath=current;draftMeta.heroBackdropPool=normalizeBackdropPool(draftMeta.heroBackdropPool || meta?.heroBackdropPool);renderHeroBackdrop(draftMeta);return;}
    const hasIdentity=Boolean(positiveIntegerOrNull(draftMeta.tmdbId || meta?.tmdbId) || safeText(draftMeta.imdbId || meta?.imdbId,40) || safeText(els.showTitle?.value || meta?.title,120));
    if(!prefs.tmdbCredential || !hasIdentity){renderHeroBackdrop(draftMeta);return;}
    renderHeroBackdrop(draftMeta,{loading:true});
    try{
      const result=await fetchHeroBackdropPool(meta);if(!els.showDialog.open)return;
      draftMeta.tmdbId=result.tmdbId;draftMeta.heroBackdropPool=normalizeBackdropPool(result.pool);
      draftMeta.heroBackdropPath=randomBackdropPath(draftMeta.heroBackdropPool);
      draftMeta.heroBackdropUpdatedAt=nowIso();
      if(!draftMeta.heroBackdropPath){renderHeroBackdrop(draftMeta);return;}
      persistHeroBackdrop();renderHeroBackdrop(draftMeta);
    }catch(err){console.warn('TMDB backdrop lookup failed',err);if(els.showDialog.open)renderHeroBackdrop(draftMeta);}
  }
  async function refreshHeroBackdrop() {
    if(!els.refreshBackdropButton)return;
    els.refreshBackdropButton.disabled=true;els.showHeroStatus.textContent='Finding another backdrop…';
    try{
      let pool=normalizeBackdropPool(draftMeta.heroBackdropPool);
      if(pool.length<2 && prefs.tmdbCredential){const result=await fetchHeroBackdropPool(draftMeta,{force:true});draftMeta.tmdbId=result.tmdbId;pool=normalizeBackdropPool(result.pool);draftMeta.heroBackdropPool=pool;}
      if(!pool.length){showToast('No TMDB backdrops are available for this show');renderHeroBackdrop(draftMeta);return;}
      const current=normalizeBackdropPath(draftMeta.heroBackdropPath);const next=randomBackdropPath(pool,current);
      if(!next || next===current){showToast('No other backdrop is available');renderHeroBackdrop(draftMeta);return;}
      draftMeta.heroBackdropPath=next;draftMeta.heroBackdropUpdatedAt=nowIso();persistHeroBackdrop();renderHeroBackdrop(draftMeta);showToast('Backdrop changed');
    }catch(err){console.error(err);showToast('Backdrop could not be refreshed');renderHeroBackdrop(draftMeta);}
  }
  function updatePosterPreview(){setArtwork(els.posterPreview,els.showPoster.value);}
  function renderStreamingPreview(){els.streamingProvidersText.replaceChildren();const providers=cleanProviders(draftMeta.providers);if(providers.length){providers.forEach(p=>{const s=document.createElement('span');s.className='provider-pill';s.textContent=p;els.streamingProvidersText.appendChild(s);});els.streamingProvidersNote.textContent=draftMeta.providersUpdatedAt?`Updated ${new Date(draftMeta.providersUpdatedAt).toLocaleDateString()}`:'Subscription services in Canada';}else{els.streamingProvidersNote.textContent=prefs.tmdbCredential?'No subscription services found in Canada.':'Requires a TMDB credential in Settings.';}}

  function renderCast(items) {
    if (!els.castList) return;
    const cast=normalizeCast(items);
    els.castList.replaceChildren();
    if (!cast.length) { const empty=document.createElement('div'); empty.className='cast-empty'; empty.textContent='No cast information loaded yet.'; els.castList.appendChild(empty); return; }
    const addRows=(list,container)=>list.forEach(item=>{
      const row=document.createElement('div');row.className='cast-row';
      const person=document.createElement('div');person.className='cast-person';person.textContent=item.person;
      const character=document.createElement('div');character.className='cast-character';character.textContent=item.character?`as ${item.character}`:'';
      row.append(person,character);container.appendChild(row);
    });
    addRows(cast.slice(0,8),els.castList);
    if(cast.length>8){const more=document.createElement('details');more.className='cast-more';const summary=document.createElement('summary');summary.textContent=`Show all ${cast.length} cast members`;const rest=document.createElement('div');addRows(cast.slice(8),rest);more.append(summary,rest);els.castList.appendChild(more);}
  }
  async function prepareCast(show) {
    const existing=normalizeCast(show?.cast || draftMeta.cast);
    if(existing.length){draftMeta.cast=existing;renderCast(existing);els.castStatus.textContent=`${existing.length} principal cast member${existing.length===1?'':'s'} from TVmaze.`;return;}
    renderCast([]);
    const tvmazeId=positiveIntegerOrNull(show?.tvmazeId || draftMeta.tvmazeId);
    if(!tvmazeId){els.castStatus.textContent='Use Find details to load the main cast.';return;}
    els.castStatus.textContent='Loading main cast…';
    try{
      let cast=castCache.get(tvmazeId);
      if(!cast){const res=await fetch(`https://api.tvmaze.com/shows/${tvmazeId}/cast`);if(!res.ok)throw new Error('TVmaze cast lookup failed');cast=normalizeCast(await res.json());castCache.set(tvmazeId,cast);}
      if (positiveIntegerOrNull(draftMeta.tvmazeId) !== tvmazeId) return;
      draftMeta.cast=cast;renderCast(cast);els.castStatus.textContent=cast.length?`${cast.length} principal cast member${cast.length===1?'':'s'} from TVmaze.`:'No main cast is listed by TVmaze.';
      const persisted=show?.id ? state.shows.find(s=>s.id===show.id) : null;
      if(persisted){persisted.cast=cast;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));if(dbx.connected)scheduleSync();}
    }catch(err){console.error(err);els.castStatus.textContent='Cast information could not be loaded just now.';}
  }

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
  function trackingForDraft(episodes=[]) {
    draftMeta.viewingRuns=normalizeViewingRuns(draftMeta.viewingRuns);
    const runs=normalizeViewingRuns(draftMeta.viewingRuns);
    const run=activeViewingRun(draftMeta) || ([ARCHIVE_WATCHED,ARCHIVE_ABANDONED].includes(draftMeta.archive)?runs.at(-1):null);
    let dates=normalizeEpisodeWatchDates(run?.episodeWatchDates || draftMeta.episodeWatchDates);
    let watched=normalizeWatchedEpisodes(run?.watchedEpisodes || draftMeta.watchedEpisodes,dates);
    let activeSeason=positiveIntegerOrNull(run?.activeSeason || draftMeta.activeSeason || draftMeta.episodeProgress?.season);
    // Older TV versions stored a single linear progress marker. Preserve that known
    // progress once, but all new tracking is episode-by-episode and season-aware.
    if(!watched.length && draftMeta.episodeProgress && episodes.length){
      const legacy=draftMeta.episodeProgress;
      const legacySeason=positiveIntegerOrNull(legacy.season);
      const legacyEpisode=positiveIntegerOrNull(legacy.episode);
      if(legacySeason&&legacyEpisode){
        // Older TV builds stored one linear “through here” marker. Do not infer
        // that every earlier season was watched; preserve only known progress
        // inside the season the user was actually in.
        watched=episodes.filter(ep=>ep.season===legacySeason&&ep.number<=legacyEpisode).map(episodeDateKey);
        activeSeason=positiveIntegerOrNull(legacy.nextSeason)||legacySeason;
      }
    }
    return {run,dates,watched,activeSeason};
  }
  function progressFromTracking(episodes, watchedEpisodes, activeSeason) {
    const watchedSet=new Set(normalizeWatchedEpisodes(watchedEpisodes));
    const season=positiveIntegerOrNull(activeSeason);
    if(!season)return null;
    const entries=episodes.filter(ep=>ep.season===season);
    if(!entries.length)return null;
    const watchedEntries=entries.filter(ep=>watchedSet.has(episodeDateKey(ep)));
    if(!watchedEntries.length)return null;
    const last=watchedEntries.sort((a,b)=>a.number-b.number).at(-1);
    const next=entries.find(ep=>!watchedSet.has(episodeDateKey(ep)))||null;
    return {season:last.season,episode:last.number,episodeId:last.id||null,title:last.name||'',nextSeason:next?.season||null,nextEpisode:next?.number||null,nextEpisodeId:next?.id||null,nextTitle:next?.name||'',watchedCount:watchedSet.size,totalCount:episodes.length||null,seasonWatchedCount:watchedEntries.length,seasonTotalCount:entries.length,seasonRemaining:Math.max(0,entries.length-watchedEntries.length),updatedAt:nowIso()};
  }
  function draftIsCurrentlyWatching() {
    const watching=state.columns.find(c=>c.id==='watching'||String(c.name||'').toLowerCase()==='watching');
    return Boolean(watching && els.showLocation.value===`status:${watching.id}`);
  }
  function watchedDateForInteraction() { return draftIsCurrentlyWatching() ? todayIsoDate() : ''; }
  function applyTrackingToDraft(episodes,{watched,dates,activeSeason,run}) {
    const cleanWatched=normalizeWatchedEpisodes(watched,dates);const cleanDates=normalizeEpisodeWatchDates(dates);const season=positiveIntegerOrNull(activeSeason);
    draftMeta.watchedEpisodes=cleanWatched;draftMeta.episodeWatchDates=cleanDates;draftMeta.activeSeason=season;draftMeta.episodeProgress=progressFromTracking(episodes,cleanWatched,season);
    const currentViewing=draftIsCurrentlyWatching();
    if(run){
      run.watchedEpisodes=cleanWatched;run.episodeWatchDates=cleanDates;run.activeSeason=season;run.updatedAt=nowIso();
      if(currentViewing&&!run.startedDate&&!viewingDateCleared.started)run.startedDate=validIsoDate(els.showStartedDate.value)||todayIsoDate();
      run.watchingWith=safeText(els.showWatchingWith.value||run.watchingWith,60);draftMeta.currentViewingRunId=run.status==='in-progress'?run.id:draftMeta.currentViewingRunId;
    }
    if(currentViewing&&!draftMeta.startedDate&&cleanWatched.length&&!viewingDateCleared.started)draftMeta.startedDate=validIsoDate(els.showStartedDate.value)||run?.startedDate||todayIsoDate();
    if(!viewingDateCleared.started)els.showStartedDate.value=draftMeta.startedDate||run?.startedDate||els.showStartedDate.value;
  }
  function persistDraftTrackingIfNeeded() {
    const id=els.showId.value;if(!id)return;const show=state.shows.find(s=>s.id===id);if(!show)return;seasonProgressCache.delete(id);
    ['viewingRuns','currentViewingRunId','watchedEpisodes','episodeWatchDates','activeSeason','episodeProgress','startedDate','finishedDate','abandonedDate'].forEach(key=>{show[key]=clone(draftMeta[key]??show[key]);});
    if(els.showWatchingWith.value)show.watchingWith=safeText(els.showWatchingWith.value,60);
    show.updatedAt=nowIso();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));requestLibraryRender();if(dbx.connected)scheduleSync();
  }
  function renderEpisodeGuide(episodes, progress) {
    els.episodeGuide.replaceChildren();els.episodeProgressSummary.replaceChildren();if(!episodes.length)return;
    const tracking=trackingForDraft(episodes);const watchedSet=new Set(tracking.watched);let activeSeason=tracking.activeSeason;
    if(!activeSeason&&tracking.watched.length){const watchedEps=episodes.filter(ep=>watchedSet.has(episodeDateKey(ep)));activeSeason=watchedEps.at(-1)?.season||null;}
    const seasonEntries=activeSeason?episodes.filter(ep=>ep.season===activeSeason):[];const nextInSeason=seasonEntries.find(ep=>!watchedSet.has(episodeDateKey(ep)))||null;const watchedInSeason=seasonEntries.filter(ep=>watchedSet.has(episodeDateKey(ep))).length;const left=Math.max(0,seasonEntries.length-watchedInSeason);
    if(activeSeason&&seasonEntries.length){
      const summary=document.createElement('div');summary.className='progress-callout';const strong=document.createElement('strong');strong.textContent=nextInSeason?`Season ${activeSeason} · Next: E${nextInSeason.number} — ${nextInSeason.name}`:`Season ${activeSeason} · All available episodes watched`;const small=document.createElement('span');const available=String(els.showSeriesStatus.value||draftMeta.seriesStatus||'').toLowerCase()==='running'?' available':'';small.textContent=`${watchedInSeason} of ${seasonEntries.length} watched · ${left} episode${left===1?'':'s'}${available} left`;summary.append(strong,small);els.episodeProgressSummary.appendChild(summary);
    } else {
      const summary=document.createElement('div');summary.className='progress-callout quiet';summary.textContent=`No viewing progress recorded · ${episodes.length} episodes available`;els.episodeProgressSummary.appendChild(summary);
    }
    const seasons=new Map();episodes.forEach(ep=>{if(!seasons.has(ep.season))seasons.set(ep.season,[]);seasons.get(ep.season).push(ep);});
    seasons.forEach((entries,season)=>{
      const block=document.createElement('details');block.className='season-block';if(season===activeSeason||(!activeSeason&&season===episodes[0].season))block.open=true;
      const head=document.createElement('summary');const label=document.createElement('strong');label.textContent=`Season ${season}`;const watched=entries.filter(ep=>watchedSet.has(episodeDateKey(ep))).length;const count=document.createElement('span');count.textContent=`${watched}/${entries.length} watched · ${entries.length-watched} left`;head.append(label,count);block.appendChild(head);
      const list=document.createElement('div');list.className='episode-list';const seasonNext=season===activeSeason?entries.find(ep=>!watchedSet.has(episodeDateKey(ep))):null;
      entries.forEach(ep=>{
        const key=episodeDateKey(ep);const isWatched=watchedSet.has(key);const isNext=seasonNext&&episodeDateKey(seasonNext)===key;const item=document.createElement('details');item.className='episode-item';if(isWatched)item.classList.add('watched');if(isNext)item.classList.add('next');
        const row=document.createElement('summary');const check=document.createElement('span');check.className='episode-check';check.textContent=isWatched?'✓':'○';const code=document.createElement('span');code.className='episode-code';code.textContent=`S${ep.season} E${ep.number}`;const name=document.createElement('span');name.className='episode-name';name.textContent=ep.name;const runtime=document.createElement('span');runtime.className='episode-runtime';runtime.textContent=ep.runtime?`${ep.runtime}m`:'';row.append(check,code,name);if(isNext){const badge=document.createElement('span');badge.className='episode-next-badge';badge.textContent='Next';row.appendChild(badge);}row.appendChild(runtime);item.appendChild(row);
        const body=document.createElement('div');body.className='episode-body';const desc=document.createElement('p');desc.textContent=ep.summary;body.appendChild(desc);const watchedDate=tracking.dates[key];if(isWatched){const dateWrap=document.createElement('label');dateWrap.className='episode-date-editor';const dateLabel=document.createElement('span');dateLabel.textContent='Watched date';const dateInput=document.createElement('input');dateInput.type='date';dateInput.value=watchedDate||'';dateInput.setAttribute('aria-label',`Watched date for S${ep.season} E${ep.number}`);dateInput.onchange=()=>updateEpisodeWatchedDate(ep,episodes,dateInput.value);dateWrap.append(dateLabel,dateInput);body.appendChild(dateWrap);}
        const actions=document.createElement('div');actions.className='episode-actions';const toggle=document.createElement('button');toggle.type='button';toggle.className='secondary-button episode-progress-button';toggle.textContent=isWatched?'Mark unwatched':'Mark watched';toggle.onclick=()=>toggleEpisodeWatched(ep,episodes);actions.appendChild(toggle);if(!isWatched){const through=document.createElement('button');through.type='button';through.className='text-button episode-through-button';through.textContent='Mark this season up to here';through.onclick=()=>markSeasonUpToEpisode(ep,episodes);const seriesThrough=document.createElement('button');seriesThrough.type='button';seriesThrough.className='text-button episode-through-button';seriesThrough.textContent='Mark series up to here';seriesThrough.onclick=()=>markSeriesUpToEpisode(ep,episodes);actions.append(through,seriesThrough);}body.appendChild(actions);item.appendChild(body);list.appendChild(item);
      });block.appendChild(list);els.episodeGuide.appendChild(block);
    });
  }
  function toggleEpisodeWatched(ep,episodes) {
    let tracking=trackingForDraft(episodes);let run=tracking.run;if(!run&&tracking.watched.length){draftMeta.watchedEpisodes=tracking.watched;draftMeta.activeSeason=tracking.activeSeason;}if(!run&&draftIsCurrentlyWatching()){run=ensureViewingRun(draftMeta,{startedDate:els.showStartedDate.value||todayIsoDate(),watchingWith:els.showWatchingWith.value});tracking=trackingForDraft(episodes);}
    const watched=new Set(tracking.watched);const dates={...tracking.dates};const key=episodeDateKey(ep);if(watched.has(key)){watched.delete(key);delete dates[key];}else{watched.add(key);const watchedDate=watchedDateForInteraction();if(watchedDate&&!dates[key])dates[key]=watchedDate;}
    applyTrackingToDraft(episodes,{watched:[...watched],dates,activeSeason:ep.season,run});persistDraftTrackingIfNeeded();renderViewingHistory();renderEpisodeGuide(episodes,draftMeta.episodeProgress);showToast(watched.has(key)?`S${ep.season} E${ep.number} marked watched`:`S${ep.season} E${ep.number} marked unwatched`);
  }
  function updateEpisodeWatchedDate(ep,episodes,value) {
    const tracking=trackingForDraft(episodes);const run=tracking.run;const dates={...tracking.dates};const key=episodeDateKey(ep);const date=validIsoDate(value);if(date)dates[key]=date;else delete dates[key];applyTrackingToDraft(episodes,{watched:tracking.watched,dates,activeSeason:tracking.activeSeason||ep.season,run});persistDraftTrackingIfNeeded();renderViewingHistory();renderEpisodeGuide(episodes,draftMeta.episodeProgress);showToast(date?'Watched date updated':'Watched date cleared');
  }
  function markSeasonUpToEpisode(ep,episodes) {
    let tracking=trackingForDraft(episodes);let run=tracking.run;if(!run&&tracking.watched.length){draftMeta.watchedEpisodes=tracking.watched;draftMeta.activeSeason=tracking.activeSeason;}if(!run&&draftIsCurrentlyWatching()){run=ensureViewingRun(draftMeta,{startedDate:els.showStartedDate.value||todayIsoDate(),watchingWith:els.showWatchingWith.value});tracking=trackingForDraft(episodes);}
    const watched=new Set(tracking.watched);const dates={...tracking.dates};const watchedDate=watchedDateForInteraction();episodes.filter(item=>item.season===ep.season&&item.number<=ep.number).forEach(item=>{const key=episodeDateKey(item);watched.add(key);if(watchedDate&&!dates[key])dates[key]=watchedDate;});applyTrackingToDraft(episodes,{watched:[...watched],dates,activeSeason:ep.season,run});persistDraftTrackingIfNeeded();renderViewingHistory();renderEpisodeGuide(episodes,draftMeta.episodeProgress);showToast(`Season ${ep.season} saved through E${ep.number}`);
  }
  function markSeriesUpToEpisode(ep,episodes) {
    let tracking=trackingForDraft(episodes);let run=tracking.run;if(!run&&tracking.watched.length){draftMeta.watchedEpisodes=tracking.watched;draftMeta.activeSeason=tracking.activeSeason;}if(!run&&draftIsCurrentlyWatching()){run=ensureViewingRun(draftMeta,{startedDate:els.showStartedDate.value||todayIsoDate(),watchingWith:els.showWatchingWith.value});tracking=trackingForDraft(episodes);}
    const watched=new Set(tracking.watched);const dates={...tracking.dates};const watchedDate=watchedDateForInteraction();episodes.filter(item=>item.season<ep.season||(item.season===ep.season&&item.number<=ep.number)).forEach(item=>{const key=episodeDateKey(item);watched.add(key);if(watchedDate&&!dates[key])dates[key]=watchedDate;});applyTrackingToDraft(episodes,{watched:[...watched],dates,activeSeason:ep.season,run});persistDraftTrackingIfNeeded();renderViewingHistory();renderEpisodeGuide(episodes,draftMeta.episodeProgress);showToast(`Series saved through S${ep.season} E${ep.number}`);
  }

  function hideLookupSuggestions() {
    els.lookupResults.hidden = true;
    els.lookupResults.replaceChildren();
    els.showTitle.setAttribute('aria-expanded', 'false');
  }

  function lookupResultButtons() { return [...els.lookupResults.querySelectorAll('.lookup-result')]; }
  function moveLookupFocus(current, delta) {
    const buttons = lookupResultButtons(); if (!buttons.length) return;
    const index = buttons.indexOf(current); const next = Math.max(0, Math.min(buttons.length - 1, index + delta));
    buttons[next].focus();
  }

  function scheduleTitleAutocomplete() {
    clearTimeout(autocompleteTimer); autocompleteTimer = null;
    if (lookupController) { lookupController.abort(); lookupController = null; }
    if (els.showId.value) return;
    const q = els.showTitle.value.trim();
    if (q.length < 2) {
      hideLookupSuggestions();
      els.lookupStatus.textContent = 'Start typing a title for TVmaze suggestions, or use Find details.';
      return;
    }
    autocompleteTimer = setTimeout(() => lookupShows({ auto: true }), 260);
  }

  async function lookupShows(options = {}) {
    const auto = Boolean(options && options.auto);
    const q=els.showTitle.value.trim();
    if(!q || (auto && q.length < 2)){if(!auto)els.lookupStatus.textContent='Enter a title first.';return;}
    if(lookupController)lookupController.abort();lookupController=new AbortController();
    if(!auto){els.lookupShowButton.disabled=true;els.lookupStatus.textContent='Searching TVmaze…';}
    hideLookupSuggestions();
    try{
      const res=await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`,{signal:lookupController.signal});if(!res.ok)throw new Error('TVmaze search failed');const results=await res.json();
      if(!results.length){if(!auto)els.lookupStatus.textContent='No TVmaze matches found. You can enter the details manually.';return;}
      els.lookupStatus.textContent=auto?'Suggestions from TVmaze:':'Choose the correct show:';els.lookupResults.hidden=false;els.showTitle.setAttribute('aria-expanded','true');
      results.slice(0,8).forEach(result=>{
        const show=result.show;const btn=document.createElement('button');btn.type='button';btn.className='lookup-result';btn.setAttribute('role','option');btn.setAttribute('aria-label',`Use ${show.name}`);
        const img=document.createElement('img');img.alt='';img.src=show.image?.medium||show.image?.original||'';
        const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=show.name;const meta=document.createElement('span');const yr=show.premiered?show.premiered.slice(0,4):'';const network=show.network?.name||show.webChannel?.name||'';meta.textContent=[yr,network,show.genres?.slice(0,2).join(', ')].filter(Boolean).join(' · ');info.append(strong,meta);
        const duplicate=findDuplicateCandidate(show);if(duplicate){const warning=document.createElement('span');warning.className='lookup-duplicate';warning.textContent=`Already in TV · ${statusFor(duplicate).name}`;info.appendChild(warning);}
        const arrow=document.createElement('span');arrow.className='lookup-chevron';arrow.textContent='›';
        btn.onclick=()=>{if(duplicate&&!els.showId.value){const ok=confirm(`“${show.name}” is already in TV (${statusFor(duplicate).name}).\n\nLoad these details anyway?`);if(!ok)return;draftMeta.allowDuplicate=true;}applyTvmazeShow(show);};
        btn.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();moveLookupFocus(btn,1);}else if(e.key==='ArrowUp'){e.preventDefault();if(lookupResultButtons()[0]===btn)els.showTitle.focus();else moveLookupFocus(btn,-1);}else if(e.key==='Escape'){e.preventDefault();hideLookupSuggestions();els.showTitle.focus();}};
        btn.append(img,info,arrow);els.lookupResults.appendChild(btn);
      });
    }catch(err){if(err.name!=='AbortError'){console.error(err);els.lookupStatus.textContent=auto?'Suggestions could not be loaded. Use Find details to search manually.':'TVmaze search failed. You can still enter details manually.';}}
    finally{if(!auto)els.lookupShowButton.disabled=false;}
  }

  async function applyTvmazeShow(show) {
    els.lookupStatus.textContent='Loading episodes and seasons…';els.lookupResults.hidden=true;
    try{
      const [seasonsRes,episodesRes,imagesRes,castRes]=await Promise.all([fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`),fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`),fetch(`https://api.tvmaze.com/shows/${show.id}/images`),fetch(`https://api.tvmaze.com/shows/${show.id}/cast`)]);
      const seasons=seasonsRes.ok?await seasonsRes.json():[];const episodes=episodesRes.ok?await episodesRes.json():[];const images=imagesRes.ok?await imagesRes.json():[];const cast=castRes.ok?normalizeCast(await castRes.json()):[];castCache.set(show.id,cast);
      const normalizedEpisodes=normalizeTvmazeEpisodes(episodes);episodeCache.set(show.id, normalizedEpisodes);
      const posters=images.filter(img=>img?.type==='poster'&&(img?.resolutions?.original?.url||img?.resolutions?.medium?.url));
      const backgrounds=images.filter(img=>img?.type==='background'&&img?.resolutions?.original?.url);
      const banners=images.filter(img=>img?.type==='banner'&&img?.resolutions?.original?.url);
      const posterImage=(posters.find(img=>img.main)||posters[0]);
      const artwork=show.image?.original || show.image?.medium || posterImage?.resolutions?.original?.url || posterImage?.resolutions?.medium?.url || (backgrounds.find(img=>img.main)||backgrounds[0]||banners.find(img=>img.main)||banners[0])?.resolutions?.original?.url || episodes.find(e=>e?.image?.original)?.image?.original || episodes.find(e=>e?.image?.medium)?.image?.medium || els.showPoster.value;
      els.showTitle.value=show.name||els.showTitle.value;els.showPoster.value=artwork;
      els.showYear.value=show.premiered?show.premiered.slice(0,4):'';els.showGenres.value=(show.genres||[]).join(', ');
      els.showNetwork.value=show.network?.name||show.webChannel?.name||'';setSelectValue(els.showCountry,show.network?.country?.name||show.webChannel?.country?.name||'');const tvStatus=show.status||'';if(tvStatus && ![...els.showSeriesStatus.options].some(o=>o.value===tvStatus)){const option=document.createElement('option');option.value=tvStatus;option.textContent=tvStatus;els.showSeriesStatus.appendChild(option);}els.showSeriesStatus.value=tvStatus;renderEditorPicker('genres');
      els.showSeasons.value=seasons.length||'';els.showEpisodes.value=episodes.length||'';const runtime=show.averageRuntime||show.runtime||medianRuntime(episodes);els.showRuntime.value=runtime||'';
      const total=episodes.reduce((sum,e)=>sum+(Number(e.runtime)||0),0);els.showTotalMinutes.value=total||((runtime&&episodes.length)?runtime*episodes.length:'');
      if(!els.showMetacritic.value)els.showMetacritic.value=`https://www.metacritic.com/tv/${slugify(show.name)}/`;
      if(draftMeta.tvmazeId && draftMeta.tvmazeId!==show.id){draftMeta.episodeProgress=null;draftMeta.episodeWatchDates={};draftMeta.watchedEpisodes=[];draftMeta.activeSeason=null;draftMeta.viewingRuns=[];draftMeta.currentViewingRunId='';draftMeta.heroBackdropPath='';draftMeta.heroBackdropPool=[];draftMeta.heroBackdropUpdatedAt=null;draftMeta.libraryBackdropPath='';draftMeta.libraryBackdropPool=[];draftMeta.libraryLogoPath='';draftMeta.libraryArtworkUpdatedAt=null;}draftMeta.tvmazeId=show.id;draftMeta.imdbId=show.externals?.imdb||'';draftMeta.tmdbId=null;draftMeta.cast=cast;updatePosterPreview();renderEpisodeGuide(normalizedEpisodes,draftMeta.episodeProgress||null);els.episodeGuideStatus.textContent=normalizedEpisodes.length?`${normalizedEpisodes.length} episodes · click an episode for its description.`:'No numbered episodes are available from TVmaze.';els.refreshEpisodesButton.disabled=false;renderCast(cast);els.castStatus.textContent=cast.length?`${cast.length} principal cast member${cast.length===1?'':'s'} from TVmaze.`:'No main cast is listed by TVmaze.';
      els.lookupStatus.textContent='Details and poster artwork added from TVmaze. You can edit anything before saving.';
      if(prefs.tmdbCredential){await refreshDraftProviders();await prepareHeroBackdrop(draftMeta);await prepareLibraryArtwork(draftMeta);}
    }catch(err){console.error(err);els.lookupStatus.textContent='Basic TVmaze details were found, but episode details could not be loaded.';}
  }
  function medianRuntime(episodes){const vals=episodes.map(e=>Number(e.runtime)).filter(n=>Number.isFinite(n)&&n>0).sort((a,b)=>a-b);if(!vals.length)return null;return vals[Math.floor(vals.length/2)];}

  function formShowObject(existing) {
    const t=nowIso();const location=els.showLocation.value;const archive=[ARCHIVE_WATCHED,ARCHIVE_ABANDONED].includes(location)?location:null;const selectedColumn=location===UNSORTED?'':(location.startsWith('status:')?location.slice(7):(existing?.columnId||''));
    const order=existing?.order??Math.max(-1,...state.shows.filter(s=>!s.archive&&s.columnId===selectedColumn).map(s=>Number(s.order)||0))+1;
    return {
      ...(existing||{}),...draftMeta,
      id:existing?.id||uuid(),title:els.showTitle.value.trim().slice(0,120),columnId:selectedColumn===''?'':(state.columns.some(c=>c.id===selectedColumn)?selectedColumn:state.columns[0].id),archive,
      poster:safeUrl(els.showPoster.value),metacritic:safeUrl(els.showMetacritic.value),seasons:integerOrNull(els.showSeasons.value),episodes:integerOrNull(els.showEpisodes.value),runtime:integerOrNull(els.showRuntime.value),totalMinutes:integerOrNull(els.showTotalMinutes.value),
      genres:cleanGenres(splitComma(els.showGenres.value)),network:safeText(els.showNetwork.value,100),country:safeText(els.showCountry.value,80),seriesStatus:safeText(els.showSeriesStatus.value,50),watchingWith:safeText(els.showWatchingWith.value,60),favourite:Boolean(draftMeta.favourite),
      rating:clampRating(els.showRating.value),startedDate:validIsoDate(els.showStartedDate.value),finishedDate:validIsoDate(els.showFinishedDate.value),abandonedDate:validIsoDate(els.showAbandonedDate.value),episodeWatchDates:normalizeEpisodeWatchDates(draftMeta.episodeWatchDates || existing?.episodeWatchDates),watchedEpisodes:normalizeWatchedEpisodes(draftMeta.watchedEpisodes || existing?.watchedEpisodes,draftMeta.episodeWatchDates || existing?.episodeWatchDates),activeSeason:positiveIntegerOrNull(draftMeta.activeSeason || existing?.activeSeason),viewingRuns:normalizeViewingRuns(draftMeta.viewingRuns || existing?.viewingRuns),currentViewingRunId:safeText(draftMeta.currentViewingRunId || existing?.currentViewingRunId || '',100),tags:cleanTags(splitComma(els.showTags.value)),notes:String(els.showNotes.value||'').slice(0,4000),firstAirYear:positiveIntegerOrNull(els.showYear.value),providers:cleanProviders(draftMeta.providers),providerLink:safeUrl(draftMeta.providerLink||''),providersUpdatedAt:validDateString(draftMeta.providersUpdatedAt)?draftMeta.providersUpdatedAt:null,episodeProgress:normalizeEpisodeProgress(draftMeta.episodeProgress),
      tvmazeId:positiveIntegerOrNull(draftMeta.tvmazeId),imdbId:safeText(draftMeta.imdbId,40),tmdbId:positiveIntegerOrNull(draftMeta.tmdbId),heroBackdropPath:normalizeBackdropPath(draftMeta.heroBackdropPath),heroBackdropPool:normalizeBackdropPool(draftMeta.heroBackdropPool),heroBackdropUpdatedAt:validDateString(draftMeta.heroBackdropUpdatedAt)?draftMeta.heroBackdropUpdatedAt:null,libraryBackdropPath:normalizeBackdropPath(draftMeta.libraryBackdropPath),libraryBackdropPool:normalizeBackdropPool(draftMeta.libraryBackdropPool),libraryLogoPath:normalizeBackdropPath(draftMeta.libraryLogoPath),libraryArtworkUpdatedAt:validDateString(draftMeta.libraryArtworkUpdatedAt)?draftMeta.libraryArtworkUpdatedAt:null,cast:normalizeCast(draftMeta.cast),order,createdAt:existing?.createdAt||t,updatedAt:t
    };
  }
  function normalizedTitleForDuplicate(value){return titleSortKey(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
  function findDuplicateCandidate(candidate, excludeId='') {
    const tvmazeId=positiveIntegerOrNull(candidate?.tvmazeId || candidate?.id);
    const title=normalizedTitleForDuplicate(candidate?.title || candidate?.name || '');
    const year=positiveIntegerOrNull(candidate?.firstAirYear || (candidate?.premiered ? String(candidate.premiered).slice(0,4) : null));
    return state.shows.find(show=>show.id!==excludeId && ((tvmazeId && show.tvmazeId===tvmazeId) || (title && normalizedTitleForDuplicate(show.title)===title && (!year || !show.firstAirYear || show.firstAirYear===year)))) || null;
  }
  async function saveShowFromForm(event){
    event.preventDefault();const title=els.showTitle.value.trim();if(!title){els.showTitle.focus();return;}
    const id=els.showId.value;const index=state.shows.findIndex(s=>s.id===id);const existing=index>=0?state.shows[index]:null;const beforeStatus=existing?statusFor(existing).id:'';
    if(prefs.tmdbCredential&&!normalizeBackdropPath(draftMeta.libraryBackdropPath)){await prepareLibraryArtwork(draftMeta,{quiet:true});}
    if(existing && !normalizeViewingRuns(draftMeta.viewingRuns).length && [ARCHIVE_WATCHED,ARCHIVE_ABANDONED].includes(beforeStatus))createHistoricalRunFromCurrent(draftMeta);
    const obj=formShowObject(existing);const afterStatus=statusFor(obj).id;const today=todayIsoDate();obj.viewingRuns=normalizeViewingRuns(obj.viewingRuns);

    let run=activeViewingRun(obj) || obj.viewingRuns.at(-1) || null;
    if(run){run.startedDate=validIsoDate(els.showStartedDate.value);run.finishedDate=validIsoDate(els.showFinishedDate.value);run.abandonedDate=validIsoDate(els.showAbandonedDate.value);run.watchingWith=safeText(els.showWatchingWith.value||run.watchingWith,60);run.updatedAt=nowIso();}

    if(afterStatus==='watching'){
      run=activeViewingRun(obj);
      if(!run){run={id:uuid(),status:'in-progress',startedDate:validIsoDate(els.showStartedDate.value)||(viewingDateCleared.started?'':(beforeStatus==='watching'?validIsoDate(existing?.startedDate):today)),finishedDate:'',abandonedDate:'',watchingWith:safeText(els.showWatchingWith.value,60),watchedEpisodes:normalizeWatchedEpisodes(obj.watchedEpisodes,obj.episodeWatchDates),episodeWatchDates:normalizeEpisodeWatchDates(obj.episodeWatchDates),activeSeason:positiveIntegerOrNull(obj.activeSeason),createdAt:nowIso(),updatedAt:nowIso()};obj.viewingRuns.push(run);obj.currentViewingRunId=run.id;}
      run.status='in-progress';run.finishedDate='';run.abandonedDate='';if(!run.startedDate&&!viewingDateCleared.started)run.startedDate=today;run.watchingWith=safeText(els.showWatchingWith.value||run.watchingWith,60);syncLegacyTrackingFromRun(obj,run);
    } else if(afterStatus===ARCHIVE_WATCHED){
      run=activeViewingRun(obj)||run;
      if(!run){run={id:uuid(),status:'completed',startedDate:validIsoDate(els.showStartedDate.value),finishedDate:validIsoDate(els.showFinishedDate.value),abandonedDate:'',watchingWith:safeText(els.showWatchingWith.value,60),watchedEpisodes:normalizeWatchedEpisodes(obj.watchedEpisodes,obj.episodeWatchDates),episodeWatchDates:normalizeEpisodeWatchDates(obj.episodeWatchDates),activeSeason:positiveIntegerOrNull(obj.activeSeason),createdAt:nowIso(),updatedAt:nowIso()};obj.viewingRuns.push(run);}
      run.status='completed';run.abandonedDate='';if(existing && beforeStatus==='watching' && !run.finishedDate)run.finishedDate=today;run.watchingWith=safeText(els.showWatchingWith.value||run.watchingWith,60);
      if(els.markAllEpisodesWatched?.checked && obj.tvmazeId){
        let episodes=episodeCache.get(obj.tvmazeId);if(!episodes){try{const res=await fetch(`https://api.tvmaze.com/shows/${obj.tvmazeId}/episodes`);if(res.ok){episodes=normalizeTvmazeEpisodes(await res.json());episodeCache.set(obj.tvmazeId,episodes);}}catch(_){}}
        if(episodes?.length){run.watchedEpisodes=episodes.map(episodeDateKey);run.activeSeason=episodes.at(-1)?.season||run.activeSeason;run.episodeWatchDates=normalizeEpisodeWatchDates(run.episodeWatchDates);obj.episodeProgress=progressFromTracking(episodes,run.watchedEpisodes,run.activeSeason);}
      }
      syncLegacyTrackingFromRun(obj,run);obj.currentViewingRunId='';
    } else if(afterStatus===ARCHIVE_ABANDONED){
      run=activeViewingRun(obj)||run;
      if(!run){run={id:uuid(),status:'abandoned',startedDate:validIsoDate(els.showStartedDate.value),finishedDate:'',abandonedDate:validIsoDate(els.showAbandonedDate.value),watchingWith:safeText(els.showWatchingWith.value,60),watchedEpisodes:normalizeWatchedEpisodes(obj.watchedEpisodes,obj.episodeWatchDates),episodeWatchDates:normalizeEpisodeWatchDates(obj.episodeWatchDates),activeSeason:positiveIntegerOrNull(obj.activeSeason),createdAt:nowIso(),updatedAt:nowIso()};obj.viewingRuns.push(run);}
      run.status='abandoned';run.finishedDate='';if(existing && beforeStatus==='watching' && !run.abandonedDate)run.abandonedDate=today;run.watchingWith=safeText(els.showWatchingWith.value||run.watchingWith,60);syncLegacyTrackingFromRun(obj,run);obj.currentViewingRunId='';
    } else if(activeViewingRun(obj)){
      run=activeViewingRun(obj);run.watchingWith=safeText(els.showWatchingWith.value||run.watchingWith,60);run.startedDate=validIsoDate(els.showStartedDate.value);syncLegacyTrackingFromRun(obj,run);
    }

    obj.startedDate=validIsoDate(els.showStartedDate.value);obj.finishedDate=validIsoDate(els.showFinishedDate.value);obj.abandonedDate=validIsoDate(els.showAbandonedDate.value);
    if(!existing&&!draftMeta.allowDuplicate){const duplicate=findDuplicateCandidate(obj);if(duplicate){const ok=confirm(`“${obj.title}” is already in TV (${statusFor(duplicate).name}).\n\nAdd another copy anyway?`);if(!ok){showToast('Duplicate not added');return;}}}
    if(index>=0)state.shows[index]=obj;else state.shows.push(obj);saveState();closeShowDialog();showToast(existing?'Show updated':'Show added');
  }
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
  async function refreshAllProviders(){if(providerRefreshRunning)return;if(!prefs.tmdbCredential){showToast('Add a TMDB credential first');return;}providerRefreshRunning=true;els.refreshProvidersButton.textContent='Refreshing…';let changed=0;try{for(let i=0;i<state.shows.length;i++){const show=state.shows[i];try{const result=await fetchProvidersFor(show);Object.assign(show,result,{updatedAt:nowIso()});changed++;els.refreshProvidersButton.textContent=`Refreshing ${i+1}/${state.shows.length}…`;}catch(err){console.warn('Provider refresh failed',show.title,err);}}saveState();showToast(`Streaming refreshed for ${changed} ${changed===1?'show':'shows'}`);}finally{providerRefreshRunning=false;els.refreshProvidersButton.textContent='Refresh JustWatch data for all shows';}}
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
    const validCols=new Set(columns.map(c=>c.id));const first=columns[0].id;const shows=[...showMap.values()].filter(s=>{const tomb=tombMap.get(s.id);return !tomb||Date.parse(s.updatedAt)>Date.parse(tomb.deletedAt);}).map(s=>({...s,columnId:s.columnId===''?'':(validCols.has(s.columnId)?s.columnId:first)}));

    const localViewsTime=Date.parse(local.savedViewsUpdatedAt||0)||0;const remoteViewsTime=Date.parse(remote.savedViewsUpdatedAt||0)||0;const savedViews=clone(remoteViewsTime>localViewsTime?remote.savedViews:local.savedViews);const savedViewsUpdatedAt=remoteViewsTime>localViewsTime?remote.savedViewsUpdatedAt:local.savedViewsUpdatedAt;
    const localColumnsTime=Date.parse(local.columnsUpdatedAt||0)||0;const remoteColumnsTime=Date.parse(remote.columnsUpdatedAt||0)||0;const unsortedOrder=remoteColumnsTime>localColumnsTime?remote.unsortedOrder:local.unsortedOrder;
    return normalizeState({version:2,columnsUpdatedAt:new Date(Math.max(localColumnsTime,remoteColumnsTime)).toISOString(),unsortedOrder,columns,columnDeleted:columnTombs,shows,deleted:tombs,savedViews,savedViewsUpdatedAt});
  }

  function isTvmazeHostedArtwork(url){return /^https?:\/\/static\.tvmaze\.com\/uploads\/images\//i.test(String(url||''));}
  async function repairTvmazePostersOnce(){
    if(localStorage.getItem(POSTER_REPAIR_KEY)==='done')return;
    const candidates=state.shows.filter(show=>show.tvmazeId&&(!show.poster||isTvmazeHostedArtwork(show.poster)));
    if(!candidates.length){localStorage.setItem(POSTER_REPAIR_KEY,'done');return;}
    let changed=0;
    for(let i=0;i<candidates.length;i+=6){
      const chunk=candidates.slice(i,i+6);
      await Promise.allSettled(chunk.map(async show=>{
        try{const res=await fetch(`https://api.tvmaze.com/shows/${show.tvmazeId}`);if(!res.ok)return;const data=await res.json();const poster=safeUrl(data?.image?.original||data?.image?.medium||'');if(poster&&poster!==show.poster){show.poster=poster;changed++;}}catch(_){}
      }));
    }
    localStorage.setItem(POSTER_REPAIR_KEY,'done');
    if(changed){state=normalizeState(state);localStorage.setItem(STORAGE_KEY,JSON.stringify(state));requestLibraryRender();if(dbx.connected)scheduleSync();showToast(`Poster artwork repaired for ${changed} ${changed===1?'show':'shows'}`);}
  }

  function scheduleSync(){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncWithDropbox(),900);}
  async function syncWithDropbox({announce=false}={}){if(!dbx.connected)return;setSyncStatus('syncing','Dropbox · syncing…');try{const remote=await dropboxDownload();state=mergeStates(state,remote);localStorage.setItem(STORAGE_KEY,JSON.stringify(state));await dropboxUpload(state);dbx.lastSync=nowIso();saveDropbox();requestLibraryRender();setSyncStatus('connected','Dropbox · synced');if(announce)showToast('Dropbox connected and synced');}catch(err){console.error(err);setSyncStatus('error','Dropbox · sync problem');showToast('Dropbox sync failed. Your TV library is still saved on this device.');}}
  function disconnectDropbox(){if(!confirm('Disconnect Dropbox on this device? Your local TV library will remain here.'))return;dbx={connected:false,appKey:dbx.appKey||''};saveDropbox();setSyncStatus('local','Saved on this device');showToast('Dropbox disconnected');}
  function setSyncStatus(kind,label){els.statusDot.className='status-dot';if(kind==='connected')els.statusDot.classList.add('connected');if(kind==='syncing')els.statusDot.classList.add('syncing');if(kind==='error')els.statusDot.classList.add('error');els.syncLabel.textContent=label;}
  function updateDropboxUI(){if(!els.dropboxAppKey)return;els.redirectUriText.value=getRedirectUri();els.dropboxAppKey.value=dbx.appKey||'';els.dropboxSetup.hidden=!!dbx.connected;els.dropboxConnected.hidden=!dbx.connected;els.dropboxStatus.textContent=dbx.connected?'Connected':'Not connected';if(dbx.connected)setSyncStatus('connected',dbx.lastSync?'Dropbox · synced':'Dropbox · connected');else setSyncStatus('local','Saved on this device');}

  function exportBackup(){const blob=new Blob([JSON.stringify({...state,version:2,exportedAt:nowIso()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`tv-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);showToast('Backup exported');}
  async function importBackup(file){try{const incoming=JSON.parse(await file.text());if(!incoming||!Array.isArray(incoming.shows)||!Array.isArray(incoming.columns))throw new Error('Invalid backup');state=mergeStates(state,incoming);saveState();showToast('Backup imported');}catch(err){console.error(err);showToast('That file is not a valid TV backup');}finally{els.importInput.value='';}}

  function openSettings(){closeMobileNav();updateDropboxUI();updateTmdbUI();applyTheme();if(!els.settingsDialog.open){pushOverlayState('settings');els.settingsDialog.showModal();}}
  function showToast(message){clearTimeout(toastTimer);els.toast.textContent=message;els.toast.classList.add('show');toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2600);}
  function openMobileNav(){els.sidebar.classList.add('open');els.sidebarScrim.classList.add('open');document.body.style.overflow='hidden';}
  function closeMobileNav(){els.sidebar.classList.remove('open');els.sidebarScrim.classList.remove('open');if(!els.filterDrawer.classList.contains('open'))document.body.style.overflow='';}

  function bindEvents(){
    els.mobileMenuButton.onclick=openMobileNav;els.sidebarScrim.onclick=closeMobileNav;
    els.addShowButton.onclick=()=>openShowDialog();els.emptyAddButton.onclick=()=>openShowDialog();
    els.searchInput.oninput=render;els.sortSelect.onchange=()=>{sortMode=els.sortSelect.value;render();};if(els.sortButton)els.sortButton.onclick=toggleSortMenu;if(els.sortScrim)els.sortScrim.onclick=()=>closeSortMenu();
    els.filterButton.onclick=openFilterDrawer;els.closeFilterButton.onclick=()=>closeFilterDrawer();els.backFilterButton.onclick=()=>closeFilterDrawer();els.drawerScrim.onclick=()=>closeFilterDrawer();els.applyFiltersButton.onclick=applyFilters;els.clearFiltersButton.onclick=clearFilterDraft;els.saveViewButton.onclick=saveCurrentView;
    [els.filterEpisodes,els.filterTime,els.filterYearFrom,els.filterYearTo,els.filterRating,els.filterFavourite,els.filterDateType,els.filterDateFrom,els.filterDateTo].forEach(el=>{el.addEventListener('change',readDraftScalarFilters);});
    els.showForm.onsubmit=saveShowFromForm;els.closeShowButton.onclick=()=>closeShowDialog();els.backShowButton.onclick=()=>closeShowDialog();els.cancelShowButton.onclick=()=>closeShowDialog();els.deleteShowButton.onclick=deleteCurrentShow;els.lookupShowButton.onclick=lookupShows;['input','change'].forEach(type=>{els.showStartedDate.addEventListener(type,()=>syncViewingDateField('started'));els.showFinishedDate.addEventListener(type,()=>syncViewingDateField('finished'));els.showAbandonedDate.addEventListener(type,()=>syncViewingDateField('abandoned'));});els.showTitle.addEventListener('input',scheduleTitleAutocomplete);els.showTitle.addEventListener('keydown',e=>{if(e.key==='ArrowDown'&&!els.lookupResults.hidden){const first=lookupResultButtons()[0];if(first){e.preventDefault();first.focus();}}else if(e.key==='Enter'&&!els.lookupResults.hidden){const first=lookupResultButtons()[0];if(first){e.preventDefault();first.click();}}});els.showPoster.oninput=updatePosterPreview;els.showTitle.addEventListener('input',()=>{if(els.showHeroTitle)els.showHeroTitle.textContent=els.showTitle.value.trim();});els.refreshBackdropButton.addEventListener('click',refreshHeroBackdrop);if(els.refreshLibraryArtworkButton)els.refreshLibraryArtworkButton.addEventListener('click',refreshLibraryArtwork);els.showFavourite.onclick=()=>setFavourite(!draftMeta.favourite);els.showLocation.onchange=()=>{updateWatchedEpisodeChoice({reset:true});renderViewingHistory();};if(els.markAllEpisodesButton)els.markAllEpisodesButton.onclick=()=>chooseWatchedEpisodeHistory('all');if(els.chooseEpisodesButton)els.chooseEpisodesButton.onclick=()=>chooseWatchedEpisodeHistory('choose');if(els.skipEpisodesButton)els.skipEpisodesButton.onclick=()=>chooseWatchedEpisodeHistory('none');if(els.startRewatchButton)els.startRewatchButton.onclick=startRewatch;els.refreshShowStreamingButton.onclick=refreshDraftProviders;els.refreshEpisodesButton.onclick=()=>loadEpisodeGuide(currentEpisodeShow()||draftMeta,true);
    els.genreAddButton.onclick=()=>addPickerValue('genres');els.tagAddButton.onclick=()=>addPickerValue('tags');els.genreAddInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addPickerValue('genres');}};els.tagAddInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addPickerValue('tags');}};
    if(els.showWatchingWith){els.showWatchingWith.addEventListener('focus',renderWatchingWithSuggestions);els.showWatchingWith.addEventListener('input',renderWatchingWithSuggestions);els.showWatchingWith.addEventListener('keydown',e=>{if(e.key==='ArrowDown'&&!els.watchingWithSuggestions?.hidden){const first=els.watchingWithSuggestions.querySelector('button');if(first){e.preventDefault();first.focus();}}else if(e.key==='Escape')hideWatchingWithSuggestions();});}
    els.showDialog.addEventListener('keydown',e=>{
      if(e.key!=='Enter'||e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey)return;
      const target=e.target;
      if(!(target instanceof HTMLElement))return;
      if(target.closest('textarea,button,summary,details,[contenteditable="true"]'))return;
      if(target===els.genreAddInput||target===els.tagAddInput)return;
      if(target instanceof HTMLSelectElement)return;
      if(target===els.showTitle&&!els.lookupResults.hidden)return;
      if(!els.showDialog.open)return;
      e.preventDefault();els.showForm.requestSubmit();
    });
    els.showDialog.addEventListener('close', () => {
      const trigger = lastShowTrigger;
      const openedByPointer = lastShowOpenedByPointer;
      lastShowTrigger = null;
      lastShowOpenedByPointer = false;
      if (openedByPointer && trigger?.isConnected) requestAnimationFrame(() => trigger.blur());
    });
    els.settingsButton.onclick=openSettings;els.closeSettingsButton.onclick=()=>closeDialogWithHistory(els.settingsDialog,'settings');els.backSettingsButton.onclick=()=>closeDialogWithHistory(els.settingsDialog,'settings');els.openStatusesButton.onclick=()=>{renderStatusManager();if(!els.statusesDialog.open){pushOverlayState('statuses');els.statusesDialog.showModal();}};els.closeStatusesButton.onclick=()=>closeDialogWithHistory(els.statusesDialog,'statuses');els.backStatusesButton.onclick=()=>closeDialogWithHistory(els.statusesDialog,'statuses');
    els.addStatusForm.onsubmit=e=>{e.preventDefault();addStatus(els.newStatusName.value);els.newStatusName.value='';};
    els.manageSavedViewsButton.onclick=()=>{renderSavedViewManager();if(!els.savedViewsDialog.open){pushOverlayState('saved-views');els.savedViewsDialog.showModal();}};els.closeSavedViewsButton.onclick=()=>closeDialogWithHistory(els.savedViewsDialog,'saved-views');els.backSavedViewsButton.onclick=()=>closeDialogWithHistory(els.savedViewsDialog,'saved-views');
    els.exportButton.onclick=exportBackup;els.importInput.onchange=()=>{const file=els.importInput.files?.[0];if(file)importBackup(file);};
    els.saveTmdbButton.onclick=testTmdb;els.refreshProvidersButton.onclick=refreshAllProviders;
    els.connectDropboxButton.onclick=connectDropbox;els.syncNowButton.onclick=()=>syncWithDropbox({announce:true});els.disconnectDropboxButton.onclick=disconnectDropbox;els.copyRedirectButton.onclick=async()=>{try{await navigator.clipboard.writeText(getRedirectUri());showToast('Redirect URI copied');}catch(_){els.redirectUriText.select();document.execCommand('copy');showToast('Redirect URI copied');}};
    [
      [els.showDialog,'show'],[els.settingsDialog,'settings'],[els.statusesDialog,'statuses'],[els.savedViewsDialog,'saved-views']
    ].forEach(([dialog,name])=>dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialogWithHistory(dialog,name);}));
    window.addEventListener('popstate',()=>{
      if(suppressOverlayPop){suppressOverlayPop=false;return;}
      closeTopOverlayDirect();
    });
    document.addEventListener('pointerdown',e=>{if(els.sortControl&&!els.sortControl.contains(e.target))closeSortMenu();if(els.watchingWithSuggestions&&!els.watchingWithSuggestions.hidden&&!e.target.closest('.watching-with-field'))hideWatchingWithSuggestions();});
    window.addEventListener('resize',()=>{if(els.sortMenu&&!els.sortMenu.hidden)closeSortMenu();},{passive:true});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){if(els.sortMenu&&!els.sortMenu.hidden){closeSortMenu({restoreFocus:true});return;}if(els.watchingWithSuggestions&&!els.watchingWithSuggestions.hidden){hideWatchingWithSuggestions();return;}if(history.state?.tvOverlay){history.back();return;}if(closeTopOverlayDirect())return;}
      const target=e.target;const element=target instanceof HTMLElement ? target : null;
      if(e.key==='Enter'&&els.showDialog.open&&!e.defaultPrevented&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
        if(element?.closest('textarea,button,summary,details,[contenteditable="true"]'))return;
        if(element instanceof HTMLSelectElement)return;
        if(element===els.genreAddInput||element===els.tagAddInput)return;
        if(element===els.showTitle&&!els.lookupResults.hidden)return;
        e.preventDefault();els.showForm.requestSubmit();return;
      }
      const typing=Boolean(element?.closest('input,textarea,select,[contenteditable="true"]'));
      const modalOpen=Boolean(document.querySelector('dialog[open]'));
      if((e.key==='q'||e.key==='Q')&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.shiftKey&&!typing&&!modalOpen&&!els.filterDrawer.classList.contains('open')){e.preventDefault();openShowDialog();}
    });
  }

  async function init(){
    renderIcons();bindEvents();els.sortSelect.value=sortMode;
    await handleDropboxCallback();
    if(activeView.startsWith('saved:')){const v=state.savedViews.find(x=>x.id===activeView.slice(6));if(v){filters=normalizeFilters(v.filters);sortMode=v.sort;}else activeView='all';}
    if(els.fontSizeSelector) els.fontSizeSelector.addEventListener('click', event=>{ const btn=event.target.closest('[data-font-size]'); if(!btn)return; prefs.fontSize=validFontSize(btn.dataset.fontSize); savePrefs(); showToast(`Font size: ${btn.textContent}`); });
    if(els.themeSelector) els.themeSelector.addEventListener('click', event=>{const btn=event.target.closest('[data-theme-choice]');if(!btn)return;prefs.theme=validTheme(btn.dataset.themeChoice);savePrefs();showToast(`Theme: ${btn.textContent}`);});
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(validTheme(prefs.theme)==='system')applyTheme();});
  applyFontSize(); applyTheme();
  render();
    repairTvmazePostersOnce().catch(()=>{});
    if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
    if(dbx.connected)syncWithDropbox().catch(()=>{});
  }

  init();
})();

import { Movie } from '../types/movie';

// Curated generated asset paths
export const ASSET_IMAGES = {
  noirHero: '/src/assets/images/hero_cinematic_noir_1794171600269.jpg',
  sciFiVoyage: '/src/assets/images/movie_sci_fi_voyage_1794171600308.jpg',
  silentExpressionism: '/src/assets/images/movie_silent_expressionism_1794171600923.jpg',
  historicalExpedition: '/src/assets/images/movie_historical_expedition_1794171600741.jpg',
};

// Safe demo playable video streams from open public domain sources
export const DEMO_VIDEO_STREAM = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
export const DEMO_SHORT_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'the-stranger-1946',
    title: 'The Stranger',
    year: 1946,
    runtime: '1h 35m',
    category: 'Film Noir',
    synopsis: 'An investigator from the War Crimes Commission travels to a quiet Connecticut town to track down an elusive fugitive living under an alias.',
    description: 'Directed by and starring Orson Welles, The Stranger is a masterclass in post-war suspense, marked by Welles’s signature deep-focus cinematography and clock-tower tension. Entered the United States public domain after failing to renew copyright in 1973.',
    creator: 'Orson Welles',
    provider: 'Internet Archive',
    providerId: 'ia_the_stranger_1946_hd',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'U.S. Public Domain (Copyright lapsed 1973). Archived by Prelinger/Internet Archive.',
    backdropUrl: ASSET_IMAGES.noirHero,
    posterUrl: ASSET_IMAGES.noirHero,
    featured: true,
    trendingScore: 98,
    releaseDecade: '1940s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-stranger-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1850000000,
        fileSizeFormatted: '1.85 GB',
        bitrate: '3.4 Mbps',
        verifiedChecksum: 'sha256:7f49a8c01b22e'
      },
      {
        id: 'fmt-stranger-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 980000000,
        fileSizeFormatted: '980 MB',
        bitrate: '1.8 Mbps',
        verifiedChecksum: 'sha256:99c2b4e88102a'
      },
      {
        id: 'fmt-stranger-480',
        resolution: '480p',
        format: 'MP4',
        fileSizeBytes: 440000000,
        fileSizeFormatted: '440 MB',
        bitrate: '900 Kbps',
        verifiedChecksum: 'sha256:3a1b4d00199cf'
      }
    ]
  },
  {
    id: 'metropolis-1927',
    title: 'Metropolis: Archival Cut',
    year: 1927,
    runtime: '2h 33m',
    category: 'Silent Expressionism',
    synopsis: 'In a futuristic dystopia divided between wealthy industrialists and underground workers, a young visionary attempts to bridge the vast divide.',
    description: 'Fritz Lang’s monumental silent sci-fi epic stands as one of the most influential motion pictures ever created. Preserved in national film registries and released under public domain restorations for international cinema archives.',
    creator: 'Fritz Lang',
    provider: 'Library of Congress',
    providerId: 'loc_mbrs_metropolis_1927_restored',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'National Film Registry & Public Domain Worldwide. Restored by Murnau Foundation & Library of Congress.',
    backdropUrl: ASSET_IMAGES.silentExpressionism,
    posterUrl: ASSET_IMAGES.silentExpressionism,
    featured: true,
    trendingScore: 96,
    releaseDecade: '1920s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_SHORT_VIDEO,
    formats: [
      {
        id: 'fmt-metro-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 2400000000,
        fileSizeFormatted: '2.40 GB',
        bitrate: '3.8 Mbps',
        verifiedChecksum: 'sha256:2ef48c903a89e'
      },
      {
        id: 'fmt-metro-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 1200000000,
        fileSizeFormatted: '1.20 GB',
        bitrate: '2.1 Mbps',
        verifiedChecksum: 'sha256:4ca810f92b77d'
      },
      {
        id: 'fmt-metro-480',
        resolution: '480p',
        format: 'MP4',
        fileSizeBytes: 620000000,
        fileSizeFormatted: '620 MB',
        bitrate: '1.1 Mbps',
        verifiedChecksum: 'sha256:88fb04d1c92a1'
      }
    ]
  },
  {
    id: 'voyage-to-the-prehistoric-planet-1965',
    title: 'Voyage to the Prehistoric Planet',
    year: 1965,
    runtime: '1h 21m',
    category: 'Sci-Fi Classic',
    synopsis: 'Cosmonauts embark on an exploratory voyage to Venus, where they confront hostile primeval flora and treacherous prehistoric organisms.',
    description: 'Starring Basil Rathbone and Faith Domergue, this retro-futuristic Cold War era space exploration film entered the public domain in the United States and remains a favorite among vintage science fiction restoration projects.',
    creator: 'Curtis Harrington',
    provider: 'Internet Archive',
    providerId: 'ia_voyage_prehistoric_1965',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'U.S. Public Domain Archive. Digitized from original 35mm prints.',
    backdropUrl: ASSET_IMAGES.sciFiVoyage,
    posterUrl: ASSET_IMAGES.sciFiVoyage,
    trendingScore: 91,
    releaseDecade: '1960s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-voyage-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1620000000,
        fileSizeFormatted: '1.62 GB',
        bitrate: '3.1 Mbps',
        verifiedChecksum: 'sha256:56a7bc3309e1'
      },
      {
        id: 'fmt-voyage-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 850000000,
        fileSizeFormatted: '850 MB',
        bitrate: '1.6 Mbps',
        verifiedChecksum: 'sha256:39a11ef09c'
      }
    ]
  },
  {
    id: 'the-great-train-robbery-1903',
    title: 'The Great Train Robbery & Archival Chronicles',
    year: 1903,
    runtime: '45m',
    category: 'Historical Drama',
    synopsis: 'A band of outlaws holds up a western train, triggering a dramatic cross-country posse pursuit that revolutionized cinematic editing techniques.',
    description: 'Edwin S. Porter’s seminal 1903 silent narrative film is widely credited with introducing composite editing, camera movement, and location shooting to narrative motion pictures. Preserved at the Library of Congress.',
    creator: 'Edwin S. Porter',
    provider: 'Library of Congress',
    providerId: 'loc_mbrs_train_robbery_1903',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Library of Congress Motion Picture, Broadcasting, and Recorded Sound Division.',
    backdropUrl: ASSET_IMAGES.historicalExpedition,
    posterUrl: ASSET_IMAGES.historicalExpedition,
    trendingScore: 89,
    releaseDecade: '1900s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_SHORT_VIDEO,
    formats: [
      {
        id: 'fmt-train-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 680000000,
        fileSizeFormatted: '680 MB',
        bitrate: '2.6 Mbps',
        verifiedChecksum: 'sha256:1a84c90ef2b'
      },
      {
        id: 'fmt-train-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 390000000,
        fileSizeFormatted: '390 MB',
        bitrate: '1.4 Mbps',
        verifiedChecksum: 'sha256:62c809adfe'
      }
    ]
  },
  {
    id: 'doa-1949',
    title: 'D.O.A.',
    year: 1949,
    runtime: '1h 23m',
    category: 'Film Noir',
    synopsis: 'A doomed accountant who has been poisoned with a slow-acting toxin spends his final 24 hours desperately unraveling the conspiracy behind his murder.',
    description: 'Rudolph Maté’s high-velocity noir is famous for its iconic opening tracking shot in a San Francisco police station. The film entered the public domain due to a defective copyright notice on early prints.',
    creator: 'Rudolph Maté',
    provider: 'Prelinger Archives',
    providerId: 'prelinger_doa_1949_scan',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Prelinger Archives / Rick Prelinger Collection. Free for open study and download.',
    backdropUrl: ASSET_IMAGES.noirHero,
    posterUrl: ASSET_IMAGES.noirHero,
    trendingScore: 94,
    releaseDecade: '1940s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-doa-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1450000000,
        fileSizeFormatted: '1.45 GB',
        bitrate: '2.9 Mbps',
        verifiedChecksum: 'sha256:c09d84efaa'
      },
      {
        id: 'fmt-doa-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 780000000,
        fileSizeFormatted: '780 MB',
        bitrate: '1.5 Mbps',
        verifiedChecksum: 'sha256:91ef234ab'
      }
    ]
  },
  {
    id: 'carnival-of-souls-1962',
    title: 'Carnival of Souls',
    year: 1962,
    runtime: '1h 18m',
    category: 'Film Noir',
    synopsis: 'After a traumatic car plunge into a muddy river, a solitary church organist is drawn toward an eerie abandoned pavilion by shadowy apparitions.',
    description: 'A benchmark in psychological horror and low-budget American independent cinema by Herk Harvey, praised by David Lynch and George A. Romero for its surreal acoustic atmosphere.',
    creator: 'Herk Harvey',
    provider: 'Internet Archive',
    providerId: 'ia_carnival_souls_1962',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Public domain due to failure to register original release copyright.',
    backdropUrl: ASSET_IMAGES.silentExpressionism,
    posterUrl: ASSET_IMAGES.silentExpressionism,
    trendingScore: 92,
    releaseDecade: '1960s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-souls-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1390000000,
        fileSizeFormatted: '1.39 GB',
        bitrate: '2.8 Mbps',
        verifiedChecksum: 'sha256:87be19ca88'
      },
      {
        id: 'fmt-souls-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 720000000,
        fileSizeFormatted: '720 MB',
        bitrate: '1.4 Mbps',
        verifiedChecksum: 'sha256:4a08bc79e'
      }
    ]
  },
  {
    id: 'nosferatu-1922',
    title: 'Nosferatu: A Symphony of Horror',
    year: 1922,
    runtime: '1h 34m',
    category: 'Silent Expressionism',
    synopsis: 'Vampire Count Orlok expresses interest in a new residence in Germany and in the wife of his real estate agent.',
    description: 'F.W. Murnau’s unauthorized adaptation of Bram Stoker’s Dracula remains one of cinema’s most unforgettable triumphs of light, shadow, and gothic dread. Now entirely in the worldwide public domain.',
    creator: 'F.W. Murnau',
    provider: 'Wikimedia Commons',
    providerId: 'commons_murnau_nosferatu_1922',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Wikimedia Commons / Public Domain Worldwide (Life of author + 70 years elapsed).',
    backdropUrl: ASSET_IMAGES.silentExpressionism,
    posterUrl: ASSET_IMAGES.silentExpressionism,
    trendingScore: 97,
    releaseDecade: '1920s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_SHORT_VIDEO,
    formats: [
      {
        id: 'fmt-nosf-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1750000000,
        fileSizeFormatted: '1.75 GB',
        bitrate: '3.0 Mbps',
        verifiedChecksum: 'sha256:5688d01fec'
      },
      {
        id: 'fmt-nosf-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 890000000,
        fileSizeFormatted: '890 MB',
        bitrate: '1.6 Mbps',
        verifiedChecksum: 'sha256:479901acde'
      }
    ]
  },
  {
    id: 'african-cinema-archival-harvest-1972',
    title: 'Sahel Horizons: West African Archival Study',
    year: 1972,
    runtime: '58m',
    category: 'African Cinema',
    synopsis: 'An educational and ethnographic exploration of cultural traditions, communal architecture, and oral storytelling in the Sahel basin.',
    description: 'Curated from international educational archives and diplomatic cultural exchanges. Restored for educational research and open public access under Creative Commons Attribution licenses.',
    creator: 'Ousmane M’Baye (Archival Preservation)',
    provider: 'Wikimedia Commons',
    providerId: 'commons_sahel_horizons_1972',
    rightsStatus: 'Creative Commons',
    rightsAttribution: 'Creative Commons BY-SA 4.0. Digitized by Open Heritage Archives.',
    backdropUrl: ASSET_IMAGES.historicalExpedition,
    posterUrl: ASSET_IMAGES.historicalExpedition,
    trendingScore: 88,
    releaseDecade: '1970s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-sahel-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1100000000,
        fileSizeFormatted: '1.10 GB',
        bitrate: '2.5 Mbps',
        verifiedChecksum: 'sha256:aa9931bdf7'
      },
      {
        id: 'fmt-sahel-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 580000000,
        fileSizeFormatted: '580 MB',
        bitrate: '1.3 Mbps',
        verifiedChecksum: 'sha256:88cd091ae'
      }
    ]
  },
  {
    id: 'nanook-of-the-north-1922',
    title: 'Nanook of the North',
    year: 1922,
    runtime: '1h 19m',
    category: 'Archival Documentary',
    synopsis: 'Chronicles the daily survival challenges and hunting techniques of an Inuk family in the subarctic Ungava Peninsula of Quebec.',
    description: 'Robert J. Flaherty’s pioneering ethnographic documentary holds historical distinction as one of the earliest full-length documentary films preserved in the U.S. National Film Registry.',
    creator: 'Robert J. Flaherty',
    provider: 'Library of Congress',
    providerId: 'loc_mbrs_nanook_1922_preservation',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Library of Congress National Film Registry. Public Domain worldwide.',
    backdropUrl: ASSET_IMAGES.historicalExpedition,
    posterUrl: ASSET_IMAGES.historicalExpedition,
    trendingScore: 87,
    releaseDecade: '1920s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_SHORT_VIDEO,
    formats: [
      {
        id: 'fmt-nanook-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1420000000,
        fileSizeFormatted: '1.42 GB',
        bitrate: '2.7 Mbps',
        verifiedChecksum: 'sha256:77bc09de41'
      },
      {
        id: 'fmt-nanook-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 730000000,
        fileSizeFormatted: '730 MB',
        bitrate: '1.4 Mbps',
        verifiedChecksum: 'sha256:19ef34bc88'
      }
    ]
  },
  {
    id: 'charade-1963',
    title: 'Charade',
    year: 1963,
    runtime: '1h 53m',
    category: 'Comedy Classic',
    synopsis: 'A recently widowed woman in Paris finds herself pursued by several men who want a fortune her murdered husband had stolen.',
    description: 'Directed by Stanley Donen and starring Cary Grant and Audrey Hepburn, Charade is often called "the best Hitchcock film Hitchcock never made." Because the film was released without the required copyright notice, it fell into public domain upon release in 1963.',
    creator: 'Stanley Donen',
    provider: 'Internet Archive',
    providerId: 'ia_charade_1963_restored',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Public domain worldwide due to missing statutory copyright notice at release.',
    backdropUrl: ASSET_IMAGES.noirHero,
    posterUrl: ASSET_IMAGES.noirHero,
    trendingScore: 99,
    releaseDecade: '1960s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-charade-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 2150000000,
        fileSizeFormatted: '2.15 GB',
        bitrate: '3.5 Mbps',
        verifiedChecksum: 'sha256:49c011e8f2'
      },
      {
        id: 'fmt-charade-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 1150000000,
        fileSizeFormatted: '1.15 GB',
        bitrate: '1.9 Mbps',
        verifiedChecksum: 'sha256:90cd18f4aa'
      }
    ]
  },
  {
    id: 'plan-9-from-outer-space-1959',
    title: 'Plan 9 from Outer Space',
    year: 1959,
    runtime: '1h 19m',
    category: 'Sci-Fi Classic',
    synopsis: 'Extraterrestrials implement Plan 9, resurrecting the dead of Earth to stop humanity from creating a devastating doomsday weapon.',
    description: 'Ed Wood’s infamous sci-fi spectacle featuring Béla Lugosi’s final archival footage. Passed into the public domain following failures in copyright renewal registration.',
    creator: 'Edward D. Wood Jr.',
    provider: 'Prelinger Archives',
    providerId: 'prelinger_plan9_1959',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Public domain due to failure to file renewal copyright in the 28th year.',
    backdropUrl: ASSET_IMAGES.sciFiVoyage,
    posterUrl: ASSET_IMAGES.sciFiVoyage,
    trendingScore: 85,
    releaseDecade: '1950s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_VIDEO_STREAM,
    formats: [
      {
        id: 'fmt-plan9-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 1350000000,
        fileSizeFormatted: '1.35 GB',
        bitrate: '2.6 Mbps',
        verifiedChecksum: 'sha256:fe98012da'
      },
      {
        id: 'fmt-plan9-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 710000000,
        fileSizeFormatted: '710 MB',
        bitrate: '1.3 Mbps',
        verifiedChecksum: 'sha256:56ba0911fe'
      }
    ]
  },
  {
    id: 'a-trip-to-the-moon-1902',
    title: 'A Trip to the Moon (Le Voyage dans la Lune)',
    year: 1902,
    runtime: '14m',
    category: 'Educational Cinema',
    synopsis: 'A consortium of astronomers embarks on a celestial expedition inside a bullet-shaped capsule propelled from a giant cannon toward the moon.',
    description: 'Georges Méliès’s legendary 1902 French adventure is widely acknowledged as the foundational work of cinematic science fiction and special effects illusionism.',
    creator: 'Georges Méliès',
    provider: 'Wikimedia Commons',
    providerId: 'commons_melies_moon_1902',
    rightsStatus: 'Public Domain',
    rightsAttribution: 'Worldwide Public Domain. Digitized by Open Cinema Heritage Foundation.',
    backdropUrl: ASSET_IMAGES.sciFiVoyage,
    posterUrl: ASSET_IMAGES.sciFiVoyage,
    trendingScore: 93,
    releaseDecade: '1900s',
    hasPlayableStream: true,
    demoVideoUrl: DEMO_SHORT_VIDEO,
    formats: [
      {
        id: 'fmt-moon-1080',
        resolution: '1080p',
        format: 'MP4',
        fileSizeBytes: 320000000,
        fileSizeFormatted: '320 MB',
        bitrate: '3.1 Mbps',
        verifiedChecksum: 'sha256:33491baee7'
      },
      {
        id: 'fmt-moon-720',
        resolution: '720p',
        format: 'MP4',
        fileSizeBytes: 180000000,
        fileSizeFormatted: '180 MB',
        bitrate: '1.8 Mbps',
        verifiedChecksum: 'sha256:77aa010f3c'
      }
    ]
  }
];

// Initial seeded Library items (downloaded to device storage)
export const INITIAL_LIBRARY_ITEMS: any[] = [
  {
    id: 'lib-the-stranger',
    movieId: 'the-stranger-1946',
    title: 'The Stranger',
    year: 1946,
    category: 'Film Noir',
    runtime: '1h 35m',
    posterUrl: ASSET_IMAGES.noirHero,
    backdropUrl: ASSET_IMAGES.noirHero,
    provider: 'Internet Archive',
    rightsStatus: 'Public Domain',
    fileSizeFormatted: '1.85 GB',
    fileSizeBytes: 1850000000,
    resolution: '1080p',
    format: 'MP4',
    addedToLibraryDate: 'Yesterday, 18:42',
    localFilePath: '/storage/emulated/0/Movies/JTEC/The_Stranger_1946_1080p.mp4'
  },
  {
    id: 'lib-great-train',
    movieId: 'the-great-train-robbery-1903',
    title: 'The Great Train Robbery & Archival Chronicles',
    year: 1903,
    category: 'Historical Drama',
    runtime: '45m',
    posterUrl: ASSET_IMAGES.historicalExpedition,
    backdropUrl: ASSET_IMAGES.historicalExpedition,
    provider: 'Library of Congress',
    rightsStatus: 'Public Domain',
    fileSizeFormatted: '680 MB',
    fileSizeBytes: 680000000,
    resolution: '1080p',
    format: 'MP4',
    addedToLibraryDate: '3 days ago',
    localFilePath: '/storage/emulated/0/Movies/JTEC/Great_Train_Robbery_1903.mp4'
  }
];

export const INITIAL_DOWNLOADS: any[] = [
  {
    id: 'dl-metropolis-active',
    movieId: 'metropolis-1927',
    movieTitle: 'Metropolis: Archival Cut',
    posterUrl: ASSET_IMAGES.silentExpressionism,
    backdropUrl: ASSET_IMAGES.silentExpressionism,
    provider: 'Library of Congress',
    resolution: '1080p',
    format: 'MP4',
    totalBytes: 2400000000,
    downloadedBytes: 1560000000,
    progress: 65,
    status: 'active',
    speed: '4.8 MB/s',
    eta: '2m 55s',
    addedAt: Date.now() - 120000,
    localPath: '/storage/emulated/0/Movies/JTEC/Metropolis_1927_1080p.mp4'
  },
  {
    id: 'dl-voyage-queued',
    movieId: 'voyage-to-the-prehistoric-planet-1965',
    movieTitle: 'Voyage to the Prehistoric Planet',
    posterUrl: ASSET_IMAGES.sciFiVoyage,
    backdropUrl: ASSET_IMAGES.sciFiVoyage,
    provider: 'Internet Archive',
    resolution: '720p',
    format: 'MP4',
    totalBytes: 850000000,
    downloadedBytes: 0,
    progress: 0,
    status: 'queued',
    speed: 'Waiting',
    eta: 'Queued',
    addedAt: Date.now() - 60000,
    localPath: '/storage/emulated/0/Movies/JTEC/Voyage_Prehistoric_1965.mp4'
  }
];

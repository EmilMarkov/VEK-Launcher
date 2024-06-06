export enum TorrentUpdateEnum {
    'APPLAUNCHING',
    'EVERYHOUR',
    'EVERYDAY',
    'EVERYWEEK'
}

export interface Torrent {
    id: string;
    name: string;
    repacker: string;
    updated: string;
    torrent: string;
    magnet?: string;
}

export interface TorrentInfo {
    name: string;
    repacker: string;
    updated: string;
    magnet: string;
}

export interface Game {
    id: number;
    slug: string;
    name: string;
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: Ratings[];
    ratings_count: number;
    reviews_text_bount: string;
    added: number;
    added_by_status: Record<string, any>;
    metacritic: number;
    playtime: number;
    suggestions_count: number;
    updated: string;
    esrb_rating?: EsrbRating;
    platforms: Platform[];
}

export interface EsrbRating {
    id: number;
    slug: string;
    name: string;
}

export interface Platform {
    platform: PlatformDetails;
    released_at: string;
    requirements: {
        minimum: string;
        recommended: string;
    };
}

export interface PlatformDetails {
    id: number;
    slug: string;
    name: string;
}

export interface Ratings {
    id: number;
    title: string;
    count: number;
    percent: number;
}

export interface GameSearchResults {
    count: number;
    next?: string;
    previous?: string;
    results: Game[];
}
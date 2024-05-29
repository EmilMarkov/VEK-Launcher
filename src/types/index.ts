export interface IGame {
    id: string;
    name: string;
    torrents?: string[];
}

export interface GameInfo {
    id: number;
    slug: string;
    name: string;
    name_original: string;
    description: string;
    metacritic: number;
    metacritic_platforms: MetacriticPlatform[];
    released: string;
    tba: boolean;
    updated: string;
    background_image: string;
    background_image_additional: string;
    website: string;
    rating: number;
    rating_top: number;
    ratings: Rating[];
    reactions: { [key: string]: number };
    added: number;
    added_by_status: AddedByStatus;
    playtime: number;
    screenshots_count: number;
    movies_count: number;
    creators_count: number;
    achievements_count: number;
    parent_achievements_count: number;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    reddit_logo: string;
    reddit_count: number;
    twitch_count: number;
    youtube_count: number;
    reviews_text_count: number;
    ratings_count: number;
    suggestions_count: number;
    alternative_names: string[];
    metacritic_url: string;
    parents_count: number;
    additions_count: number;
    game_series_count: number;
    iframe_url?: string;
    image: string;
    desktop_auth_delay?: any;
    mobile_auth_delay?: any;
    play_on_desktop?: any;
    play_on_mobile?: any;
    plays?: number;
    seamless_auth?: any;
    alternative_fullscreen?: any;
    description_short?: string;
    exit_button_position?: any;
    user_game?: any;
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    parent_platforms: ParentPlatform[];
    platforms: Platform[];
    stores: Store[];
    developers: Developer[];
    genres: Genre[];
    tags: Tag[];
    publishers: Publisher[];
    esrb_rating: EsrbRating;
    clip: Clip;
    description_raw: string;
}

interface MetacriticPlatform {
    metascore: number;
    url: string;
    platform: PlatformInfo;
}

interface Rating {
    id: number;
    title: string;
    count: number;
    percent: number;
}

interface AddedByStatus {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
}

interface ParentPlatform {
    platform: PlatformInfo;
}

interface Platform {
    platform: PlatformInfo;
    released_at: string;
    requirements: any;
}

interface Store {
    id: number;
    url: string;
    store: StoreInfo;
}

interface Developer {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

interface Genre {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

interface Publisher {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

interface EsrbRating {
    id: number;
    name: string;
    slug: string;
}

interface Clip {
    clip: string;
    clips: {
        [resolution: string]: string;
    };
    video: string;
    preview: string;
}

interface PlatformInfo {
    id: number;
    name: string;
    slug: string;
    image?: string;
    year_end?: number;
    year_start?: number;
    games_count: number;
    image_background: string;
}

interface StoreInfo {
    id: number;
    name: string;
    slug: string;
    domain: string;
    games_count: number;
    image_background: string;
}

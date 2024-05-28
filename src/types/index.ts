export interface IGame {
    id: string;
    title: string;
    description?: string;
    screenshots?: string[];
    torrents?: string[];
}

export interface IGameInput {
    title: string;
    description?: string;
    screenshots?: string[];
    torrents?: string[];
}
export interface ITorrent {
    id: string;
    name: string;
    repacker: string;
    updated: string;
    torrent: string;
}

export enum TorrentUpdateEnum {
    'APPLAUNCHING',
    'EVERYHOUR',
    'EVERYDAY',
    'EVERYWEEK'
}

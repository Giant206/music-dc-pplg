import { KazagumoPlugin as Plugin, Kazagumo, KazagumoTrack } from 'kazagumo';
export declare class KazagumoPlugin extends Plugin {
    private _search;
    private kazagumo;
    private readonly methods;
    constructor();
    load(kazagumo: Kazagumo): void;
    private search;
    private buildSearch;
    private searchTrack;
    private getTrack;
    private getAlbum;
    private getPlaylist;
    private filterNullOrUndefined;
    private buildKazagumoTrack;
}
export interface Result {
    tracks: KazagumoTrack[];
    name?: string;
}
export interface Album {
    title: string;
    tracks: AlbumTracks;
}
export interface AlbumTracks {
    data: DeezerTrack[];
    next: string | null;
}
export interface Artist {
    name: string;
}
export interface Playlist {
    tracks: PlaylistTracks;
    title: string;
}
export interface PlaylistTracks {
    data: DeezerTrack[];
    next: string | null;
}
export interface DeezerTrack {
    data: KazagumoTrack[];
}
export interface SearchResult {
    exception?: {
        severity: string;
        message: string;
    };
    loadType: string;
    playlist?: {
        duration_ms: number;
        name: string;
    };
    data: KazagumoTrack[];
}
//# sourceMappingURL=plugin.d.ts.map
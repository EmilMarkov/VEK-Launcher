/* String formatting */

export const removeReleaseYearFromName = (name: string) =>
    name.replace(/\([0-9]{4}\)/g, "");

export const removeSymbolsFromName = (name: string) =>
    name.replace(/[^A-Za-z 0-9]/g, "");

export const removeSpecialEditionFromName = (name: string) =>
    name.replace(
        /(The |Digital )?(GOTY|Deluxe|Standard|Ultimate|Definitive|Enhanced|Collector's|Premium|Digital|Limited|GameEntity of the Year|Reloaded|[0-9]{4}) Edition/g,
        ""
    );

export const removeDuplicateSpaces = (name: string) =>
    name.replace(/\s{2,}/g, " ");

export const removeTrash = (title: string) =>
    title.replace(/\(.*\)|\[.*]/g, "").replace(/:/g, "");

/* Formatters per repacker */

export const fitGirlFormatter = (title: string) =>
    title.replace(/\(.*\)/g, "").trim();

export const kaosKrewFormatter = (title: string) =>
    title
        .replace(/(v\.?[0-9])+([0-9]|\.)+/, "")
        .replace(
            /(\.Build\.[0-9]*)?(\.MULTi[0-9]{1,2})?(\.REPACK-KaOs|\.UPDATE-KaOs)?/g,
            ""
        )
        .replace(/\./g, " ")
        .trim();

export const empressFormatter = (title: string) =>
    title
        .replace(/-EMPRESS/, "")
        .replace(/\./g, " ")
        .trim();

export const dodiFormatter = (title: string) =>
    title.replace(/\(.*?\)/g, "").trim();

export const xatabFormatter = (title: string) =>
    title
        .replace(/RePack от xatab|RePack от Decepticon|R.G. GOGFAN/, "")
        .replace(/[\u0400-\u04FF]/g, "")
        .replace(/(v\.?([0-9]| )+)+([0-9]|\.|-|_|\/|[a-zA-Z]| )+/, "");

export const tinyRepacksFormatter = (title: string) => title;
export const onlinefixFormatter = (title: string) =>
    title.replace("по сети", "").trim();

export const gogFormatter = (title: string) =>
    title.replace(/(v\.[0-9]+|v[0-9]+\.|v[0-9]{4})+.+/, "");
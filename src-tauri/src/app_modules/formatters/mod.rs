use regex::Regex;
use lazy_static::lazy_static;

lazy_static! {
    static ref YEAR_REGEX: Regex = Regex::new(r"\([0-9]{4}\)").unwrap();
    static ref SYMBOLS_REGEX: Regex = Regex::new(r"[^A-Za-z 0-9]").unwrap();
    static ref SPECIAL_EDITION_REGEX: Regex = Regex::new(r"(The |Digital )?(GOTY|Deluxe|Standard|Ultimate|Definitive|Enhanced|Collector's|Premium|Digital|Limited|GameEntity of the Year|Reloaded|[0-9]{4}) Edition").unwrap();
    static ref DUPLICATE_SPACES_REGEX: Regex = Regex::new(r"\s{2,}").unwrap();
    static ref TRASH_REGEX: Regex = Regex::new(r"\(.*\)|\[.*]").unwrap();
}

pub fn remove_release_year_from_name(name: String) -> String {
    YEAR_REGEX.replace_all(&name, "").to_string()
}

pub fn remove_symbols_from_name(name: String) -> String {
    SYMBOLS_REGEX.replace_all(&name, "").to_string()
}

pub fn remove_special_edition_from_name(name: String) -> String {
    SPECIAL_EDITION_REGEX.replace_all(&name, "").to_string()
}

pub fn remove_duplicate_spaces(name: String) -> String {
    DUPLICATE_SPACES_REGEX.replace_all(&name, " ").to_string()
}

pub fn remove_trash(title: String) -> String {
    TRASH_REGEX.replace_all(&title, "").replace(":", "").to_string()
}

pub fn fitgirl_formatter(title: String) -> String {
    Regex::new(r"\(.*\)").unwrap().replace_all(&title, "").trim().to_string()
}

pub fn kaoskrew_formatter(title: String) -> String {
    let formatted = Regex::new(r"(v\.?[0-9])+([0-9]|\.)+").unwrap().replace_all(&title, "");
    let formatted = Regex::new(r"(\.Build\.[0-9]*)?(\.MULTi[0-9]{1,2})?(\.REPACK-KaOs|\.UPDATE-KaOs)?")
        .unwrap()
        .replace_all(&formatted, "");
    formatted.replace(".", " ").trim().to_string()
}

pub fn empress_formatter(title: String) -> String {
    title.replace("-EMPRESS", "").replace(".", " ").trim().to_string()
}

pub fn dodi_formatter(title: String) -> String {
    Regex::new(r"\(.*?\)").unwrap().replace_all(&title, "").trim().to_string()
}

pub fn xatab_formatter(title: String) -> String {
    let formatted = title
        .replace("RePack от xatab", "")
        .replace("RePack от Decepticon", "")
        .replace("R.G. GOGFAN", "");
    let formatted = Regex::new(r"[\u0400-\u04FF]").unwrap().replace_all(&formatted, "");
    Regex::new(r"(v\.?([0-9]| )+)+([0-9]|\.|-|_|/|[a-zA-Z]| )+").unwrap().replace_all(&formatted, "").to_string()
}

pub fn tinyrepacks_formatter(title: String) -> String {
    title
}

pub fn onlinefix_formatter(title: String) -> String {
    title.replace("по сети", "").trim().to_string()
}

pub fn gog_formatter(title: String) -> String {
    Regex::new(r"(v\.[0-9]+|v[0-9]+\.|v[0-9]{4})+.+").unwrap().replace_all(&title, "").to_string()
}

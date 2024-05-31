use crate::app_modules::formatters::{
    remove_release_year_from_name, remove_symbols_from_name, remove_special_edition_from_name,
    remove_duplicate_spaces, remove_trash,
};

pub fn pipe<T, F>(input: T, functions: Vec<F>) -> T
    where
        F: Fn(T) -> T,
{
    functions.into_iter().fold(input, |acc, func| func(acc))
}

pub fn format_name(name: String) -> String {
    let functions: Vec<fn(String) -> String> = vec![
        remove_trash,
        remove_release_year_from_name,
        remove_symbols_from_name,
        remove_special_edition_from_name,
        remove_duplicate_spaces,
    ];
    pipe(name, functions).trim().to_string()
}

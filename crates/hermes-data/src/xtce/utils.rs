/// Utility functions for XTCE name handling and path manipulation

/// Constructs a fully qualified name by joining a path and name.
///
/// Handles the special case where path is empty or root ("/").
pub(crate) fn make_qualified_name(path: &str, name: &str) -> String {
    if path.is_empty() || path == "/" {
        format!("/{}", name)
    } else {
        format!("{}/{}", path, name)
    }
}

/// Moves up one level in a hierarchical path.
///
/// Returns an empty string if already at or above root.
pub(crate) fn move_up_path(path: &str) -> String {
    if path.is_empty() || path == "/" {
        String::new()
    } else if let Some(idx) = path.rfind('/') {
        if idx == 0 {
            "/".to_string()
        } else {
            path[..idx].to_string()
        }
    } else {
        String::new()
    }
}

/// Resolves an XTCE name reference to a fully qualified name.
///
/// XTCE supports three forms of name references:
/// - Absolute: `/System/SubSystem/Item` - starts with `/`, used as-is
/// - Relative: `../Other/Item` or `./Item` - resolved relative to current_path
/// - Unqualified: `Item` - appended to current_path
///
/// # Arguments
/// * `current_path` - The fully qualified path of the current SpaceSystem (e.g., "/RootSystem/SubSystem")
/// * `name_ref` - The name reference string from XTCE XML
///
/// # Returns
/// A fully qualified name starting with `/`
pub(crate) fn resolve_name_reference(current_path: &str, name_ref: &str) -> String {
    if name_ref.starts_with('/') {
        // Absolute path - use as-is
        name_ref.to_string()
    } else if name_ref.contains("../") || name_ref.starts_with("./") || name_ref.contains("/") {
        // Relative path - resolve like filesystem paths
        let mut parts: Vec<&str> = current_path.split('/').filter(|s| !s.is_empty()).collect();

        for segment in name_ref.split('/') {
            match segment {
                "." | "" => continue,
                ".." => {
                    parts.pop();
                }
                s => parts.push(s),
            }
        }

        format!("/{}", parts.join("/"))
    } else {
        // Unqualified name - append to current path
        make_qualified_name(current_path, name_ref)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_resolve_name_reference_absolute() {
        assert_eq!(
            resolve_name_reference("/Current/Path", "/Absolute/Path/Item"),
            "/Absolute/Path/Item"
        );
    }

    #[test]
    fn test_resolve_name_reference_unqualified() {
        assert_eq!(
            resolve_name_reference("/Root/System", "Item"),
            "/Root/System/Item"
        );
        assert_eq!(resolve_name_reference("/", "Item"), "/Item");
    }

    #[test]
    fn test_resolve_name_reference_relative_current() {
        assert_eq!(
            resolve_name_reference("/Root/System", "./Item"),
            "/Root/System/Item"
        );
    }

    #[test]
    fn test_resolve_name_reference_relative_parent() {
        assert_eq!(
            resolve_name_reference("/Root/System/Sub", "../Other/Item"),
            "/Root/System/Other/Item"
        );
        assert_eq!(
            resolve_name_reference("/Root/System/Sub", "../../Item"),
            "/Root/Item"
        );
    }

    #[test]
    fn test_resolve_name_reference_mixed() {
        assert_eq!(
            resolve_name_reference("/Root/System", "Sub/Item"),
            "/Root/System/Sub/Item"
        );
        assert_eq!(
            resolve_name_reference("/Root/System", "../Other/Sub/Item"),
            "/Root/Other/Sub/Item"
        );
    }
}

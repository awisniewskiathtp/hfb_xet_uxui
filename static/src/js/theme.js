import { cookie } from "@web/core/browser/cookie";
import { rpc } from "@web/core/network/rpc";
import { user } from "@web/core/user";
import { session } from "@web/session";

/**
 * Theme state for XET Base UX/UI.
 *
 * Light / dark / system mode is decided by Odoo (Enterprise user theme
 * setting), which loads either the normal or the dark asset bundle. XET only
 * picks the palette that matches the loaded bundle:
 *   - light mode -> "light" palette,
 *   - dark mode  -> the user's dark palette (Dark Blue or Graphite).
 *
 * The <head> script in views/webclient_templates.xml sets the mode and theme
 * before the first paint; this module keeps them in sync afterwards.
 */

export const XET_DARK_THEMES = ["dark_blue", "graphite"];
export const XET_DEFAULT_THEME = "dark_blue";

/** True for internal users only (the key is absent for portal/public). */
export const xetThemeEnabled = "xet_theme" in session;

function readMode() {
    const fromHead = document.documentElement.dataset.xetMode;
    if (fromHead === "dark" || fromHead === "light") {
        return fromHead;
    }
    return cookie.get("color_scheme") === "dark" ? "dark" : "light";
}

/** Mode of the asset bundle loaded for this page; changes only on reload. */
export const xetMode = readMode();

let preference = XET_DARK_THEMES.includes(session.xet_theme)
    ? session.xet_theme
    : XET_DEFAULT_THEME;

export function resolveTheme(pref) {
    if (xetMode !== "dark") {
        return "light";
    }
    return XET_DARK_THEMES.includes(pref) ? pref : XET_DEFAULT_THEME;
}

function applyTheme() {
    const root = document.documentElement;
    root.dataset.xetMode = xetMode;
    root.dataset.xetThemePref = preference;
    root.dataset.xetTheme = resolveTheme(preference);
}

export function getThemePreference() {
    return preference;
}

/**
 * Apply the new dark palette immediately and persist it on the current user.
 * On server error the previous preference is restored and the error rethrown.
 */
export async function setThemePreference(pref) {
    if (!XET_DARK_THEMES.includes(pref)) {
        throw new Error(`Unsupported XET theme: ${pref}`);
    }
    if (pref === preference) {
        return preference;
    }
    const previous = preference;
    preference = pref;
    applyTheme();
    try {
        await rpc("/web/dataset/call_kw/res.users/set_xet_theme", {
            model: "res.users",
            method: "set_xet_theme",
            args: [pref],
            kwargs: { context: user.context },
        });
    } catch (error) {
        preference = previous;
        applyTheme();
        throw error;
    }
    return preference;
}

if (xetThemeEnabled) {
    applyTheme();
}

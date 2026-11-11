import { rpc } from "@web/core/network/rpc";
import { user } from "@web/core/user";
import { session } from "@web/session";

/**
 * Theme state for XET Base UX/UI.
 *
 * The saved preference comes from session_info (set server-side in ir.http),
 * so no RPC is needed at start-up. The <head> script in
 * views/webclient_templates.xml applies it before the first paint; this
 * module keeps it in sync afterwards.
 */

export const XET_THEMES = ["dark_blue", "light", "graphite"];
export const XET_PREFERENCES = [...XET_THEMES, "system"];
export const XET_DEFAULT_THEME = "dark_blue";

/** True for internal users only (the key is absent for portal/public). */
export const xetThemeEnabled = "xet_theme" in session;

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

let preference = XET_PREFERENCES.includes(session.xet_theme)
    ? session.xet_theme
    : XET_DEFAULT_THEME;

export function resolveTheme(pref) {
    if (pref === "system") {
        return darkQuery.matches ? "dark_blue" : "light";
    }
    return XET_THEMES.includes(pref) ? pref : XET_DEFAULT_THEME;
}

function applyTheme() {
    const root = document.documentElement;
    root.dataset.xetThemePref = preference;
    root.dataset.xetTheme = resolveTheme(preference);
}

export function getThemePreference() {
    return preference;
}

/**
 * Apply the new preference immediately and persist it on the current user.
 * On server error the previous preference is restored and the error rethrown.
 */
export async function setThemePreference(pref) {
    if (!XET_PREFERENCES.includes(pref)) {
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
    darkQuery.addEventListener("change", () => {
        if (preference === "system") {
            applyTheme();
        }
    });
}

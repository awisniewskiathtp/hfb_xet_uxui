/** @odoo-module **/

import { registry } from "@web/core/registry";

const THEMES = new Set(["dark_blue", "light", "graphite"]);
const DEFAULT_THEME = "dark_blue";

function applyTheme(theme) {
    const selected = THEMES.has(theme) ? theme : DEFAULT_THEME;
    document.documentElement.dataset.xetTheme = selected;
    return selected;
}

export const xetThemeService = {
    dependencies: ["orm"],
    async: ["setTheme"],
    async start(env, { orm }) {
        let currentTheme = DEFAULT_THEME;

        try {
            currentTheme = await orm.call(
                "res.users",
                "get_xet_theme",
                [],
                {}
            );
        } catch (error) {
            // Keep the UI usable if the preference endpoint is temporarily unavailable.
            console.warn("XET UX/UI: could not load saved theme.", error);
        }

        currentTheme = applyTheme(currentTheme);

        return {
            getTheme() {
                return currentTheme;
            },
            async setTheme(theme) {
                if (!THEMES.has(theme)) {
                    throw new Error(`Unsupported XET theme: ${theme}`);
                }
                const previousTheme = currentTheme;
                currentTheme = applyTheme(theme);
                try {
                    await orm.call(
                        "res.users",
                        "set_xet_theme",
                        [theme],
                        {}
                    );
                } catch (error) {
                    currentTheme = applyTheme(previousTheme);
                    throw error;
                }
                return currentTheme;
            },
        };
    },
};

registry.category("services").add("xet_theme", xetThemeService);

import { markup } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import {
    getThemePreference,
    setThemePreference,
    xetMode,
    xetThemeEnabled,
    XET_DARK_THEMES,
} from "./theme";

/**
 * Dark palette choice in the user (avatar) menu: one entry per palette, the
 * active one marked with a check. Shown only in Odoo's dark mode - in light
 * mode the Light palette is fixed. Placed between "My Preferences" (50) and
 * "Install App" (65) / "Log out" (70).
 */

const LABELS = {
    dark_blue: _t("Dark Blue"),
    graphite: _t("Graphite"),
};

const showThemeItems = xetThemeEnabled && xetMode === "dark";

const userMenuRegistry = registry.category("user_menuitems");

userMenuRegistry.add("xet_theme_separator", () => ({
    type: "separator",
    hide: !showThemeItems,
    sequence: 55,
}));

XET_DARK_THEMES.forEach((pref, index) => {
    userMenuRegistry.add(`xet_theme_${pref}`, () => {
        const notification = useService("notification");
        const isActive = getThemePreference() === pref;
        const prefix = _t("Theme");
        const label = LABELS[pref];
        return {
            type: "item",
            id: `xet_theme_${pref}`,
            hide: !showThemeItems,
            description: isActive
                ? markup`<span class="fw-bold">${prefix}: ${label}</span><span aria-label="active">✓</span>`
                : markup`<span>${prefix}: ${label}</span>`,
            callback: async () => {
                try {
                    await setThemePreference(pref);
                } catch (error) {
                    console.error("XET UX/UI: theme change failed.", error);
                    notification.add(_t("The theme could not be saved."), {
                        type: "danger",
                    });
                }
            },
            sequence: 56 + index,
        };
    });
});

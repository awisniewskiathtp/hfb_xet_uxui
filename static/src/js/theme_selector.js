/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class XetThemeSelector extends Component {
    static template = "hfb_xet_uxui.ThemeSelector";

    setup() {
        this.themeService = useService("xet_theme");
        this.state = useState({
            theme: this.themeService.getTheme(),
            saving: false,
        });
    }

    async onThemeChange(ev) {
        const theme = ev.target.value;
        this.state.saving = true;
        try {
            await this.themeService.setTheme(theme);
            this.state.theme = theme;
        } catch (error) {
            console.error("XET UX/UI: theme change failed.", error);
            ev.target.value = this.state.theme;
        } finally {
            this.state.saving = false;
        }
    }
}

export const xetThemeSelector = {
    Component: XetThemeSelector,
};

registry.category("systray").add(
    "hfb_xet_uxui.theme_selector",
    xetThemeSelector,
    { sequence: 5 }
);

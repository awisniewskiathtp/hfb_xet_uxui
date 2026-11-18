from odoo import api, fields, models
from odoo.exceptions import ValidationError

# Palettes for Odoo's dark mode. Light/dark/system is decided by the Odoo
# (Enterprise) user theme setting; in light mode the Light palette is used.
XET_THEME_SELECTION = [
    ("dark_blue", "Dark Blue"),
    ("graphite", "Graphite"),
]
XET_DEFAULT_THEME = "dark_blue"


class ResUsers(models.Model):
    _inherit = "res.users"

    xet_theme = fields.Selection(
        selection=XET_THEME_SELECTION,
        string="XET UI Theme",
        default=XET_DEFAULT_THEME,
        required=True,
        user_writeable=True,
        help="Palette used when the Odoo theme is dark. Light, dark or "
             "system mode is chosen in the Odoo theme setting; in light "
             "mode the Light palette is always used.",
    )

    @api.model
    def set_xet_theme(self, theme):
        """Store the theme preference of the current user only."""
        if theme not in dict(XET_THEME_SELECTION):
            raise ValidationError(self.env._("Unsupported XET UI theme: %s", theme))
        self.env.user.write({"xet_theme": theme})
        return theme

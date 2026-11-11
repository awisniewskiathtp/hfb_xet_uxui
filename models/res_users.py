from odoo import fields, models


class ResUsers(models.Model):
    _inherit = "res.users"

    xet_theme = fields.Selection(
        selection=[
            ("dark_blue", "Dark Blue"),
            ("light", "Light"),
            ("graphite", "Graphite"),
        ],
        string="XET UI Theme",
        default="dark_blue",
        required=True,
    )

    def get_xet_theme(self):
        """Return the current user's theme without exposing other users' data."""
        return self.env.user.xet_theme or "dark_blue"

    def set_xet_theme(self, theme):
        """Update only the current user's theme preference."""
        allowed = {"dark_blue", "light", "graphite"}
        if theme not in allowed:
            return {"success": False, "error": "invalid_theme"}
        self.env.user.write({"xet_theme": theme})
        return {"success": True, "theme": theme}

from odoo import models

from .res_users import XET_DEFAULT_THEME


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    def session_info(self):
        info = super().session_info()
        if info.get("is_internal_user"):
            info["xet_theme"] = self.env.user.xet_theme or XET_DEFAULT_THEME
        return info

def migrate(cr, version):
    """'light' and 'system' are no longer XET choices: light/dark/system mode
    now comes from the Odoo user theme setting. Keep a valid dark palette."""
    cr.execute(
        "UPDATE res_users SET xet_theme = 'dark_blue' "
        "WHERE xet_theme IS NULL OR xet_theme NOT IN ('dark_blue', 'graphite')"
    )

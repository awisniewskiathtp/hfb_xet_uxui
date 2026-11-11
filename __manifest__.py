{
    "name": "XET Base UX/UI",
    "summary": "Experimental backend theme switcher (user menu) for Odoo 20.0",
    "version": "20.0.1.1.0",
    "category": "Productivity",
    "license": "LGPL-3",
    "author": "XET Base",
    "depends": [
        "web",
    ],
    "data": [
        "views/res_users_views.xml",
        "views/webclient_templates.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "hfb_xet_uxui/static/src/scss/themes.scss",
            "hfb_xet_uxui/static/src/js/theme.js",
            "hfb_xet_uxui/static/src/js/user_menu_items.js",
        ],
    },
    "installable": True,
    "application": False,
}

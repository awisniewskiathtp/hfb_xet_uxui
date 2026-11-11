{
    "name": "XET Base UX/UI",
    "summary": "Experimental global backend theme switcher for Odoo 20.0",
    "version": "20.0.1.0.0",
    "category": "Productivity",
    "license": "LGPL-3",
    "author": "XET Base",
    "depends": [
        "web",
        "hfb_xet_base",
    ],
    "data": [],
    "assets": {
        "web.assets_backend": [
            "hfb_xet_uxui/static/src/scss/themes.scss",
            "hfb_xet_uxui/static/src/js/theme_service.js",
            "hfb_xet_uxui/static/src/js/theme_selector.js",
            "hfb_xet_uxui/static/src/xml/theme_selector.xml",
        ],
    },
    "installable": True,
    "application": False,
}

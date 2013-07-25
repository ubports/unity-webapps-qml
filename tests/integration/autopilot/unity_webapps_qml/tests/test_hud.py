#!/usr/bin/env python
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

import os
import time

from testtools.matchers import Equals, GreaterThan, NotEquals
from autopilot.matchers import Eventually

from unity.emulators.icons import HudLauncherIcon
from unity.emulators import ensure_unity_is_running

from unity_webapps_qml.tests import UnityWebappsTestCaseBase

class UnityWebappsHudTestCase(UnityWebappsTestCaseBase):
    LOCAL_HTML_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../html/test_webapps_hud.html')
    INSTALLED_HTML_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/html/test_webapps_hud.html'

    def get_html_test_file(self):
        if os.path.exists(self.LOCAL_HTML_TEST_FILE):
            return os.path.abspath(self.LOCAL_HTML_TEST_FILE)
        return self.INSTALLED_HTML_TEST_FILE

    def setUp(self):
        super(UnityWebappsHudTestCase, self).setUp()

        try:
            ensure_unity_is_running()
        except RuntimeError:
            log.error("Unity doesn't appear to be running, exiting.")
            sys.exit(1)

        self.launch_with_html_filepath(self.get_html_test_file())

    def test_addAction(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('actionadded')))

        self.unity.hud.ensure_visible()
        self.addCleanup(self.unity.hud.ensure_hidden)

        self.keyboard.type("This is an action")
        self.keyboard.press_and_release("Enter")

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('content').style.display;"), Eventually(Equals('none')))

    def test_removeAction(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('actionadded')))
        expr = """
           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'removeAction', 'args': ['This is an action']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.unity.hud.ensure_visible()
        self.addCleanup(self.unity.hud.ensure_hidden)

        self.keyboard.type("This is an action")
        self.keyboard.press_and_release("Enter")

        self.assertThat(self.eval_expression_in_page_unsafe("return document.getElementById('content').style.display;"), NotEquals('none'))

    def test_removeActions(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('actionadded')))
        expr = """
           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'removeActions', 'args': []})});
           document.dispatchEvent (e);
           return true;
        """

        self.eval_expression_in_page_unsafe(expr)

        actions = ['This is an action', 'This is another action']
        for action in actions:
            self.unity.hud.ensure_visible()
            self.addCleanup(self.unity.hud.ensure_hidden)
            self.keyboard.type(action)
            self.keyboard.press_and_release("Enter")

            self.assertThat(self.eval_expression_in_page_unsafe("return document.getElementById('content').style.display;"), NotEquals('none'))

#!/usr/bin/env python
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

import os
import time

from gi.repository import Unity, GObject

from testtools.matchers import Equals, GreaterThan, NotEquals
from autopilot.matchers import Eventually

from unity.emulators.icons import HudLauncherIcon
from unity.emulators import ensure_unity_is_running

from unity_webapps_qml.tests import UnityWebappsTestCaseBase

class UnityWebappsLauncherTestCase(UnityWebappsTestCaseBase):
    LOCAL_HTML_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../html/test_webapps_launcher.html')
    INSTALLED_HTML_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/html/test_webapps_launcher.html'

    def get_html_test_file(self):
        if os.path.exists(self.LOCAL_HTML_TEST_FILE):
            return os.path.abspath(self.LOCAL_HTML_TEST_FILE)
        return self.INSTALLED_HTML_TEST_FILE

    def setUp(self):
        super(UnityWebappsLauncherTestCase, self).setUp()
        ensure_unity_is_running()
        self.launch_with_html_filepath(self.get_html_test_file())

    def test_checkCounts(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('launcher-updated')))

        launcher_icon = self.unity.launcher.model.get_icon(desktop_id='unity-webapps-qml-launcher.desktop')
        self.assertThat(launcher_icon, NotEquals(None))

        expr = """
           document.addEventListener('unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'Launcher.__get', 'with_callback': true, 'args': ['count']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('42')))

        # self.assertThat(launcher.get_property('progress'), Equals(0.09375))

    def test_checkProgress(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('launcher-updated')))

        launcher_icon = self.unity.launcher.model.get_icon(desktop_id='unity-webapps-qml-launcher.desktop')
        self.assertThat(launcher_icon, NotEquals(None))

        expr = """
           document.addEventListener('unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'Launcher.__get', 'with_callback': true, 'args': ['progress']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('0.09375')))


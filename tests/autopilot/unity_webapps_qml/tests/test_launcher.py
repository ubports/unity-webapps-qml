#!/usr/bin/env python
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

import os

from testtools.matchers import Equals, NotEquals
from testtools import skipUnless

from autopilot import platform
from autopilot.matchers import Eventually

from unity_webapps_qml.tests import UnityWebappsTestCaseBase

LOCAL_HTML_TEST_FILE = "{}/{}".format(
    os.path.dirname(os.path.realpath(__file__)),
    '../../html/test_webapps_launcher.html')

INSTALLED_HTML_TEST_FILE = \
    '/usr/share/unity-webapps-qml/' \
    'autopilot-tests/html/test_webapps_launcher.html'


class UnityWebappsLauncherTestCase(UnityWebappsTestCaseBase):
    def get_html_test_file(self):
        if os.path.exists(LOCAL_HTML_TEST_FILE):
            return os.path.abspath(LOCAL_HTML_TEST_FILE)
        return INSTALLED_HTML_TEST_FILE

    def setUp(self):
        super(UnityWebappsLauncherTestCase, self).setUp()
        self.launch_with_html_filepath(self.get_html_test_file())

    @skipUnless(platform.model() == 'Desktop', "Only runs on the Desktop")
    def test_checkCounts(self):
        from gi.repository import Unity
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('launcher-updated')))

        launcher_icon = Unity.LauncherEntry.get_for_desktop_id(
            'unitywebappsqmllauncher.desktop')
        self.assertThat(launcher_icon, NotEquals(None))

        expr = """
           document.addEventListener('unity-webapps-do-call-response',
            function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent (
                "unity-webapps-do-call",
                {"detail": JSON.stringify(
                    {"name": 'Launcher.__get',
                    'with_callback': true,
                    'args': ['count']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('42')))

#        self.assertThat(
#            lambda: launcher_icon.get_property("count"),
#            Eventually(Equals(42)))

    @skipUnless(platform.model() == 'Desktop', "Only runs on the Desktop")
    def test_checkProgress(self):
        from gi.repository import Unity
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('launcher-updated')))

        launcher_icon = Unity.LauncherEntry.get_for_desktop_id(
            'unitywebappsqmllauncher.desktop')
        self.assertThat(launcher_icon, NotEquals(None))

        expr = """
           document.addEventListener(
            'unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent (
                "unity-webapps-do-call",
                {"detail": JSON.stringify(
                    {"name": 'Launcher.__get',
                    'with_callback': true,
                    'args': ['progress']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('0.09375')))

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

from unity.emulators import ensure_unity_is_running

from unity_webapps_qml.tests import UnityWebappsTestCaseBase


class UnityWebappsMediaplayerTestCase(UnityWebappsTestCaseBase):
    LOCAL_HTML_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../html/test_webapps_mediaplayer.html')
    INSTALLED_HTML_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/html/test_webapps_mediaplayer.html'

    def get_html_test_file(self):
        if os.path.exists(self.LOCAL_HTML_TEST_FILE):
            return os.path.abspath(self.LOCAL_HTML_TEST_FILE)
        return self.INSTALLED_HTML_TEST_FILE

    def setUp(self):
        super(UnityWebappsMediaplayerTestCase, self).setUp()
        ensure_unity_is_running()
        self.launch_with_html_filepath(self.get_html_test_file())

    def test_checkInitialSetTrack(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener('unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'MediaPlayer.__get', 'with_callback': true, 'args': ['track']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('TXlBcnRpc3Q=;TXlUaXRsZQ==;TXlBbGJ1bQ==')))

    def test_checkInitialSetCanGoNext(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener('unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'MediaPlayer.__get', 'with_callback': true, 'args': ['can-go-next']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('true')))

    def test_checkInitialSetCanGoPrevious(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener('unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'MediaPlayer.__get', 'with_callback': true, 'args': ['can-go-previous']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('true')))

    def test_checkInitialSetCanPlay(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener('unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent ("unity-webapps-do-call", {"detail": JSON.stringify({"name": 'MediaPlayer.__get', 'with_callback': true, 'args': ['can-play']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(lambda: self.eval_expression_in_page_unsafe("return document.getElementById('status').innerHTML;"), Eventually(Equals('true')))


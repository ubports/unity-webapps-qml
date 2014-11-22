#!/usr/bin/env python
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

import os

from gi.repository import Unity

from testtools.matchers import Equals
from testtools import skipUnless

from autopilot import platform
from autopilot.matchers import Eventually

from unity_webapps_qml.tests import UnityWebappsTestCaseBase

LOCAL_HTML_TEST_FILE = "{}/{}".format(
    os.path.dirname(os.path.realpath(__file__)),
    '../../html/test_webapps_mediaplayer.html')

INSTALLED_HTML_TEST_FILE = \
    '/usr/share/unity-webapps-qml/' \
    'autopilot-tests/html/test_webapps_mediaplayer.html'


class UnityWebappsMediaplayerTestCase(UnityWebappsTestCaseBase):
    def get_html_test_file(self):
        if os.path.exists(LOCAL_HTML_TEST_FILE):
            return os.path.abspath(LOCAL_HTML_TEST_FILE)
        return INSTALLED_HTML_TEST_FILE

    def setUp(self):
        super(UnityWebappsMediaplayerTestCase, self).setUp()
        self.launch_with_html_filepath(self.get_html_test_file())

    @skipUnless(platform.model() == 'Desktop', "Only runs on the Desktop")
    def test_checkInitialSetTrack(self):
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener(
            'unity-webapps-do-call-response',
            function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent (
            "unity-webapps-do-call",
            {"detail": JSON.stringify(
                {"name": 'MediaPlayer.__get',
                'with_callback': true,
                'args': ['track']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('TXlBcnRpc3Q=;TXlUaXRsZQ==;TXlBbGJ1bQ==')))

    @skipUnless(platform.model() == 'Desktop', "Only runs on the Desktop")
    def test_checkInitialSetCanGoNext(self):
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener(
            'unity-webapps-do-call-response', function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent (
            "unity-webapps-do-call",
            {"detail": JSON.stringify(
                {"name": 'MediaPlayer.__get',
                'with_callback': true,
                'args': ['can-go-next']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('true')))

    @skipUnless(platform.model() == 'Desktop', "Only runs on the Desktop")
    def test_checkInitialSetCanGoPrevious(self):
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener('unity-webapps-do-call-response',
            function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent (
            "unity-webapps-do-call",
            {"detail": JSON.stringify(
                {"name": 'MediaPlayer.__get',
                'with_callback': true,
                'args': ['can-go-previous']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('true')))

    @skipUnless(platform.model() == 'Desktop', "Only runs on the Desktop")
    def test_checkInitialSetCanPlay(self):
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('mediaplayer-updated')))

        expr = """
           document.addEventListener('unity-webapps-do-call-response',
            function(e) {
                var response = e.detail;
                document.getElementById('status').innerHTML = '' + e.detail;
           });

           var e = new CustomEvent (
            "unity-webapps-do-call",
            {"detail": JSON.stringify(
                {"name": 'MediaPlayer.__get',
                'with_callback': true,
                'args': ['can-play']})});
           document.dispatchEvent (e);
           return true;
        """
        self.eval_expression_in_page_unsafe(expr)

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                "return document.getElementById('status').innerHTML;"),
            Eventually(Equals('true')))

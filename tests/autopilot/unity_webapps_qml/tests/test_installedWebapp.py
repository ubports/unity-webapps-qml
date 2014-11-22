# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

from __future__ import absolute_import

import os

from testtools.matchers import Equals
from autopilot.matchers import Eventually

from unity_webapps_qml.tests import WebappsTestCaseBaseWithLocalHttpContentBase

LOCAL_HTML_TEST_FILE = "{}/{}".format(
    os.path.dirname(os.path.realpath(__file__)),
    '../../data')

INSTALLED_HTML_TEST_FILE = \
    '/usr/share/unity-webapps-qml/autopilot-tests/data'


class InstalledWebappsTestCaseBase(
        WebappsTestCaseBaseWithLocalHttpContentBase):
    def setUp(self):
        super(InstalledWebappsTestCaseBase, self).setUp()

    def get_webapp_install_folder(self):
        if os.path.exists(LOCAL_HTML_TEST_FILE):
            return os.path.abspath(LOCAL_HTML_TEST_FILE)
        return INSTALLED_HTML_TEST_FILE

    def test_normalWebappFound(self):
        self.launch_with_webapp('Normal', self.get_webapp_install_folder())

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return window.external.getUnityObject("1.0") != null;'),
            Eventually(Equals(True)))

        expression = """
            var contentElement = document.getElementById('content');
            return contentElement.innerHTML;
        """
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(expression),
            Eventually(Equals("WebApp Script Injected")))

    def test_webappWithUAOverrideFound(self):
        self.launch_with_webapp(
            'AlteredUAWebapp',
            self.get_webapp_install_folder(), True)
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return navigator.userAgent;'),
            Eventually(Equals("My Override")))

    def test_webappFoundWithSpecialWebappPropertiesFile(self):
        self.launch_with_webapp(
            'ExtendedWebappProperties',
            self.get_webapp_install_folder() + '/all-in-same-folder')

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return window.external.getUnityObject("1.0") != null;'),
            Eventually(Equals(True)))

        expression = """
            var contentElement = document.getElementById('content');
            return contentElement.innerHTML;
        """
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(expression),
            Eventually(Equals("WebApp Script Injected")))

    def test_webappPropertiesFileWithUA(self):
        self.launch_with_webapp(
            'ExtendedWebappProperties',
            self.get_webapp_install_folder() + '/all-in-same-folder', True)
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return navigator.userAgent;'),
            Eventually(Equals("My Override")))

    def test_webappPropertiesNameUpdated(self):
        self.launch_with_webapp(
            '',
            self.get_webapp_install_folder() + '/all-in-same-folder')
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return window.external.getUnityObject("1.0") != null;'),
            Eventually(Equals(True)))

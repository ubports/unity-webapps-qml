# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

"""unity-webapps-qml autopilot tests."""

import os
import os.path
import shutil
import tempfile
import json

from testtools.matchers import Contains, Equals, GreaterThan
from autopilot.matchers import Eventually
from autopilot.input import Mouse, Touch, Pointer

from unity.emulators.unity import Unity

from unity.tests import UnityTestCase

class UnityWebappsTestCaseBase(UnityTestCase):
    LOCAL_QML_LAUNCHER_APP_PATH = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../../../../tools/qml-launcher/unity-webapps-qml-launcher')
    INSTALLED_QML_LAUNCHER_APP_PATH = 'unity-webapps-qml-launcher'

    # TODO create __init__.py.in
    LOCAL_BROWSER_CONTAINER_PATH = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../qml/FullWebViewApp.qml')
    INSTALLED_BROWSER_CONTAINER_PATH = '/usr/share/unity-webapps-qml/autopilot-tests/qml/FullWebViewApp.qml'

    BASE_URL = ''

    @property
    def unity(self):
        return Unity.get_root_instance()

    def create_file_url(self, path):
        return 'file://' + path

    def get_qml_browser_container_path(self):
        if os.path.exists(self.LOCAL_BROWSER_CONTAINER_PATH):
            return self.LOCAL_BROWSER_CONTAINER_PATH
        return self.INSTALLED_BROWSER_CONTAINER_PATH

    def get_qml_launcher_path(self):
        if os.path.exists(self.LOCAL_QML_LAUNCHER_APP_PATH):
            return self.LOCAL_QML_LAUNCHER_APP_PATH
        return self.INSTALLED_QML_LAUNCHER_APP_PATH

    def get_launch_params(self, url):
        base_params = ['--qml=' + self.get_qml_browser_container_path(), '--url=' + url, '--app-id=unity-webapps-qml-launcher', '--webappName=AutopilotTest']
        if os.path.exists(self.LOCAL_QML_LAUNCHER_APP_PATH):
            # we are local
            base_params.append('--import=' + os.path.join (os.path.dirname(os.path.realpath(__file__)), '../../../../../src'))
        return base_params

    def launch_with_html_filepath(self, html_filepath):
        self.assertThat(os.path.exists(html_filepath), Equals(True))

        url = self.create_file_url(html_filepath)
        params = self.get_launch_params(url)

        print 'Launching test with params:', params
        self.app = self.launch_test_application(self.get_qml_launcher_path(),
            *params,
            app_type='qt')

        self.assert_url_eventually_loaded(url)
        self.webviewContainer = self.get_webviewContainer()
        self.watcher = self.webviewContainer.watch_signal('resultUpdated(QString)')

    def setUp(self):
        self.pointer = Pointer(Mouse.create())
        super(UnityWebappsTestCaseBase, self).setUp()

    def tearDown(self):
        super(UnityWebappsTestCaseBase, self).tearDown()

    def pick_app_launcher(self, app_path):
        # force Qt app introspection:
        from autopilot.introspection.qt import QtApplicationLauncher
        return QtApplicationLauncher()

    def get_webviewContainer(self):
        return self.app.select_single(objectName="webviewContainer")

    def get_webview(self):
        return self.app.select_single(objectName="webview")

    def get_title(self):
        return self.get_webview().title

    def assert_url_eventually_loaded(self, url):
        webview = self.get_webview()
        self.assertThat(webview.loadProgress, Eventually(Equals(100)))
        self.assertThat(webview.loading, Eventually(Equals(False)))
        self.assertThat(webview.url, Eventually(Equals(url)))

    def eval_expression_in_page_unsafe(self, expr):
        webview = self.get_webviewContainer()
        prev_emissions = self.watcher.num_emissions
        webview.slots.evalInPageUnsafe(expr)
        self.assertThat(lambda: self.watcher.num_emissions, Eventually(GreaterThan(prev_emissions)))
        return json.loads(webview.get_signal_emissions('resultUpdated(QString)')[-1][0])['result']


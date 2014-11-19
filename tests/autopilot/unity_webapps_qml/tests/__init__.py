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
from unity_webapps_qml.tests import fake_servers

from unity.emulators.unity import Unity

from unity.tests import UnityTestCase

LOCAL_QML_LAUNCHER_APP_PATH = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../../../tools/qml-launcher/unity-webapps-qml-launcher')
INSTALLED_QML_LAUNCHER_APP_PATH = 'unity-webapps-qml-launcher'

# TODO create __init__.py.in
LOCAL_BROWSER_CONTAINER_PATH = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../qml/FullWebViewApp.qml')
INSTALLED_BROWSER_CONTAINER_PATH = '/usr/share/unity-webapps-qml/autopilot-tests/qml/FullWebViewApp.qml'

BASE_URL = ''

class UnityWebappsTestCaseBase(UnityTestCase):

    def setUp(self):
        super(UnityWebappsTestCaseBase, self).setUp()
        self.use_oxide = False

    def tearDown(self):
        super(UnityWebappsTestCaseBase, self).tearDown()

    def create_file_url(self, path):
        return 'file://' + path

    def get_qml_browser_container_path(self):
        if os.path.exists(LOCAL_BROWSER_CONTAINER_PATH):
            return LOCAL_BROWSER_CONTAINER_PATH
        return INSTALLED_BROWSER_CONTAINER_PATH

    def get_qml_launcher_path(self):
        if os.path.exists(LOCAL_QML_LAUNCHER_APP_PATH):
            return LOCAL_QML_LAUNCHER_APP_PATH
        return INSTALLED_QML_LAUNCHER_APP_PATH

    def get_launch_params(self,
                          url,
                          webapp_name='unitywebappsqmllauncher',
                          webapp_search_path="",
                          webapp_homepage="",
                          use_oxide=False,
                          extra_params=[]):
        base_params = ['--qml=' + self.get_qml_browser_container_path(),
            '--app-id=' + webapp_name,
            '--webappName=' + webapp_name,
            '--webappSearchPath=' + webapp_search_path]

        if len(webapp_homepage) != 0:
            base_params.append('--webappHomepage=' + webapp_homepage)

        if len(url) != 0:
            base_params.append('--url=' + url)

        if use_oxide:
            base_params.append('--useOxide')

        if os.path.exists(LOCAL_QML_LAUNCHER_APP_PATH):
            # we are local
            base_params.append('--import=' + os.path.join (os.path.dirname(os.path.realpath(__file__)),
                               '../../../../src'))

        base_params += extra_params

        return base_params

    def launch_with_html_filepath(self, html_filepath, extra_params=[]):
        self.assertThat(os.path.exists(html_filepath), Equals(True))
        url = self.create_file_url(html_filepath)

        self.launch_application(self.get_launch_params(url, 'unitywebappsqmllauncher', '', '', False, extra_params))
        self.assert_url_eventually_loaded(url)

    def launch_application(self, args):
        print('Launching test with params:', args, "with", self.get_qml_launcher_path())

        self.app = self.launch_test_application(self.get_qml_launcher_path(),
            *args,
            app_type='qt')

        self.webviewContainer = self.get_webviewContainer()
        self.watcher = self.webviewContainer.watch_signal('resultUpdated(QString)')

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
        return webview.slots.evalInPageUnsafe(expr)

class WebappsTestCaseBaseWithLocalHttpContentBase(UnityWebappsTestCaseBase):
    def setUp(self):
        super(WebappsTestCaseBaseWithLocalHttpContentBase, self).setUp()
        self.http_server = fake_servers.WebappsQmlContentHttpServer()
        self.addCleanup(self.http_server.shutdown)
        self.base_url = "http://localhost:{}/".format(self.http_server.port)

    def launch_with_webapp(self, name, webapp_search_path, use_oxide=False):
        self.use_oxide = use_oxide
        self.launch_application(self.get_launch_params("", name, webapp_search_path, self.base_url, use_oxide))
        self.assert_url_eventually_loaded(self.base_url)

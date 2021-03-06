# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

"""unity-webapps-qml autopilot tests."""

import os
import json
import os.path

from testtools.matchers import Equals, GreaterThan
from autopilot.matchers import Eventually
from unity_webapps_qml.tests import fake_servers

from autopilot.testcase import AutopilotTestCase

LOCAL_QML_LAUNCHER_APP_PATH = "{}/{}".format(
    os.path.dirname(os.path.realpath(__file__)),
    '../../../../tools/qml-launcher/unity-webapps-qml-launcher')

INSTALLED_QML_LAUNCHER_APP_PATH = 'unity-webapps-qml-launcher'

# TODO create __init__.py.in
LOCAL_BROWSER_CONTAINER_PATH = "{}/{}".format(
    os.path.dirname(os.path.realpath(__file__)),
    '../../qml/FullWebViewApp.qml')

INSTALLED_BROWSER_CONTAINER_PATH = \
    '/usr/share/unity-webapps-qml/autopilot-tests/qml/FullWebViewApp.qml'

BASE_URL = ''


class UnityWebappsTestCaseBase(AutopilotTestCase):
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

    def get_launch_params(
            self,
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
            base_params.append(
                '--import={}'.format(
                    os.path.join(
                        os.path.dirname(os.path.realpath(__file__)),
                        '../../../../src')))
        base_params += extra_params

        return base_params

    def launch_with_html_filepath(self, html_filepath, extra_params=[]):
        self.assertThat(os.path.exists(html_filepath), Equals(True))
        url = self.create_file_url(html_filepath)

        self.launch_application(
            self.get_launch_params(
                url,
                'unitywebappsqmllauncher',
                '',
                '',
                False,
                extra_params))
        self.assert_url_eventually_loaded(url)

    def launch_application(self, args, envvars={}):
        if envvars:
            for envvar_key in envvars:
                self.patch_environment(envvar_key, envvars[envvar_key])

        self.app = self.launch_test_application(
            self.get_qml_launcher_path(),
            *args,
            app_type='qt')

        self.webviewContainer = self.get_webviewContainer()
        self.watcher = self.webviewContainer.watch_signal(
            'resultUpdated(QString)')

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
        p = self.watcher.num_emissions
        webview.slots.evalInPageUnsafe(expr)
        self.assertThat(
            lambda: self.watcher.num_emissions,
            Eventually(GreaterThan(p)))
        results = json.loads(
            webview.get_signal_emissions(
                'resultUpdated(QString)')[-1][0])
        return 'result' in results and results['result'] or None


class WebappsTestCaseBaseWithLocalHttpContentBase(UnityWebappsTestCaseBase):
    BASE_URL_SCHEME = 'http://'

    def setUp(self):
        super(WebappsTestCaseBaseWithLocalHttpContentBase, self).setUp()
        self.http_server = fake_servers.WebappsQmlContentHttpServer()
        self.addCleanup(self.http_server.shutdown)
        self.base_url = "{}localhost:{}".format(
            self.BASE_URL_SCHEME, self.http_server.port)

    def get_base_url_hostname(self):
        return self.base_url[len(self.BASE_URL_SCHEME):]

    def launch_with_webapp(
            self,
            name,
            webapp_search_path,
            envvars={},
            use_oxide=False,
            expected_homepage=''):
        self.use_oxide = use_oxide
        self.launch_application(
            self.get_launch_params(
                "",
                name,
                webapp_search_path,
                self.base_url,
                use_oxide),
            envvars)

        url = self.base_url
        if expected_homepage:
            url = expected_homepage
        self.assert_url_eventually_loaded(url)

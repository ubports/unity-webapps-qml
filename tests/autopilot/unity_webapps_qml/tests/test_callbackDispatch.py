# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2014 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.

from __future__ import absolute_import

import time
import os

from testtools.matchers import Equals, GreaterThan, NotEquals
from autopilot.matchers import Eventually

from unity_webapps_qml.tests import UnityWebappsTestCaseBase

LOCAL_HTML_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../html/test_webapps_callback_dispatch.html')
INSTALLED_HTML_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/html/test_webapps_callback_dispatch.html'

LOCAL_JS_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../html/test_webapps_callback_dispatch_api.js')
INSTALLED_JS_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/html/test_webapps_callback_dispatch_api.js'

LOCAL_QML_BACKEND_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../qml/test_webapps_callback_dispatch_api.qml')
INSTALLED_QML_BACKEND_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/qml/test_webapps_callback_dispatch_api.qml'

class WebappsCallbackDispatchTestCaseBase(UnityWebappsTestCaseBase):
    def setUp(self):
        super(WebappsCallbackDispatchTestCaseBase, self).setUp()
        self.launch_with_html_filepath(
            self.get_html_test_file(),
            ['--clientApiFileUrl=file://' + self.get_js_test_file(),
             '--apiBackendQmlFileUrl=file://' + self.get_qml_test_file()])

    def get_html_test_file(self):
        if os.path.exists(LOCAL_HTML_TEST_FILE):
            return os.path.abspath(LOCAL_HTML_TEST_FILE)
        return INSTALLED_HTML_TEST_FILE

    def get_js_test_file(self):
        if os.path.exists(LOCAL_JS_TEST_FILE):
            return os.path.abspath(LOCAL_JS_TEST_FILE)
        return INSTALLED_JS_TEST_FILE

    def get_qml_test_file(self):
        print LOCAL_QML_BACKEND_TEST_FILE
        if os.path.exists(LOCAL_QML_BACKEND_TEST_FILE):
            return os.path.abspath(LOCAL_QML_BACKEND_TEST_FILE)
        return INSTALLED_QML_BACKEND_TEST_FILE

    def test_bidirectionalCallback(self):
        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe(
                'return window.external.getUnityObject("1.0") != null;'),
            Eventually(Equals(True)))

        self.assertThat(
            lambda: self.eval_expression_in_page_unsafe("return document.getElementById('content').innerHTML;"),
            Eventually(Equals('callback-loop-count-reached')))


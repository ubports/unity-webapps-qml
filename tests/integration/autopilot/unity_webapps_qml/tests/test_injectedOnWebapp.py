# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
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

class UnityWebappsApiInjectedTestCaseBase(UnityWebappsTestCaseBase):
    LOCAL_HTML_TEST_FILE = "%s/%s" % (os.path.dirname(os.path.realpath(__file__)), '../../html/test_webapps_api_injected.html')

    INSTALLED_HTML_TEST_FILE = '/usr/share/unity-webapps-qml/autopilot-tests/html/test_webapps_api_injected.html'

    def get_html_test_file(self):
        if os.path.exists(self.LOCAL_HTML_TEST_FILE):
            return os.path.abspath(self.LOCAL_HTML_TEST_FILE)
        return self.INSTALLED_HTML_TEST_FILE

    def setUp(self):
        super(UnityWebappsApiInjectedTestCaseBase, self).setUp()
        self.launch_with_html_filepath(self.get_html_test_file())

    def test_getUnityObjectFound(self):
        self.assertThat(lambda: self.eval_expression_in_page_unsafe('return window.external.getUnityObject(1.0) != null;'), Eventually(NotEquals(None)))

    def test_actionsApiFound(self):
        expression = """
            var unity = window.external.getUnityObject(1.0);
            return unity.addAction != null && unity.removeAction && unity.removeActions != null;
        """
        self.assertThat(lambda: self.eval_expression_in_page_unsafe(expression), Eventually(NotEquals(None)))

    def test_notificationApiFound(self):
        expression = """
            var unity = window.external.getUnityObject(1.0);
            return unity.Notification != null && unity.Notification.showNotification != null;
        """
        self.assertThat(lambda: self.eval_expression_in_page_unsafe(expression), Eventually(NotEquals(None)))

    def test_messagingIndicatorApiFound(self):
        expression = """
            var unity = window.external.getUnityObject(1.0);
            return unity.MessagingIndicator != null &&
                unity.MessagingIndicator.addAction != null &&
                unity.MessagingIndicator.clearIndicator != null &&
                unity.MessagingIndicator.clearIndicators != null &&
                unity.MessagingIndicator.showIndicator != null;
        """
        self.assertThat(lambda: self.eval_expression_in_page_unsafe(expression), Eventually(NotEquals(None)))

    def test_ubuntuReadyEventSent(self):
        expression = """
            var api_ready_count = window.localStorage['ubuntu-webapps-api-ready-key'];
            return api_ready_count != null && api_ready_count > 0;
        """
        self.assertThat(lambda: self.eval_expression_in_page_unsafe(expression), Eventually(NotEquals(None)))



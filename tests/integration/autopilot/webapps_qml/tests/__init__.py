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

from testtools.matchers import Contains, Equals
from autopilot.testcase import AutopilotTestCase

import http_server

from webapps_qml.emulators.main_window import MainWindow

HTTP_SERVER_PORT = 8383

class UnityWebappsTestCaseBase(AutopilotTestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass


class UnityWebappsTestCaseBaseWithHTTPServer(UnityWebappsTestCaseBase):
    def setUp(self):
        super(UnityWebappsTestCaseBaseWithHTTPServer, self).setUp()

        self.server = http_server.HTTPServerInAThread(HTTP_SERVER_PORT)
        self.server.start()

    def tearDown(self):
        self.server.shutdown()

        super(UnityWebappsTestCaseBaseWithHTTPServer, self).tearDown()


class UnityWebappsLocalPageServedTestCaseBase(UnityWebappsTestCaseBaseWithHTTPServer):
    def setUp(self):
        super(UnityWebappsLocalPageServedTestCaseBase, self).setUp()

        self.url = "http://localhost:%d" % HTTP_SERVER_PORT


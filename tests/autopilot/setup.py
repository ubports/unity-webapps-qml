#!/usr/bin/python
# -*- Mode: Python; coding: utf-8; indent-tabs-mode: nil; tab-width: 4 -*-
# Copyright 2013 Canonical
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3, as published
# by the Free Software Foundation.


from distutils.core import setup
from setuptools import find_packages

setup(
   name='unity-webapps-qml',
   version='0.1',
   description='Unity WebApps QML component autopilot tests.',
   url='https://launchpad.net/unity-webapps-qml',
   license='GPLv3',
   packages=find_packages(),
)

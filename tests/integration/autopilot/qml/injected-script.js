/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * webbrowser-app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
    var UBUNTU_WEBAPPS_API_READY_KEY = 'ubuntu-webapps-api-ready-key';
    window.onload = function () {
        document.addEventListener('ubuntu-webapps-api-ready', function () {
            if ( ! window.localStorage[UBUNTU_WEBAPPS_API_READY_KEY]) {
                window.localStorage[UBUNTU_WEBAPPS_API_READY_KEY] = 0;
            }
            window.localStorage[UBUNTU_WEBAPPS_API_READY_KEY] ++;
        });
    };
}) ();



/*
 * Copyright 2015 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * unity-webapps-qml is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef UNITY_WEBAPPS_TOOLSAPI_H
#define UNITY_WEBAPPS_TOOLSAPI_H

#include <QObject>


class ToolsApi : public QObject
{
    Q_OBJECT
    Q_ENUMS(CryptographicAlgorithm)

public:
    explicit ToolsApi(QObject *parent = 0);

    enum CryptographicAlgorithm
    {
        MD5,
        SHA1,
        SHA256,
        SHA512
    };

    Q_INVOKABLE QString getHmacHash(
            const QString &hmac,
            CryptographicAlgorithm algorithm,
            const QString& key) const;

    Q_INVOKABLE bool areCompatibleCorsUrl(
            const QUrl& url1,
            const QUrl& url2) const;
};

#endif // UNITY_WEBAPPS_TOOLSAPI_H

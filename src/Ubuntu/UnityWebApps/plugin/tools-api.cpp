/*
 * Copyright 2014 Canonical Ltd.
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

#include "tools-api.h"

#include <QCryptographicHash>
#include <QDebug>
#include <QMessageAuthenticationCode>
#include <QString>


namespace {

bool enumToQtCryptoAlgorithm(
        ToolsApi::CryptographicAlgorithm algorithm,
        QCryptographicHash::Algorithm & out)
{
    switch(algorithm)
    {
    case ToolsApi::MD5:
        out = QCryptographicHash::Md5;
        return true;
        break;
    case ToolsApi::SHA1:
        out = QCryptographicHash::Sha1;
        return true;
        break;
    case ToolsApi::SHA256:
        out = QCryptographicHash::Sha256;
        return true;
        break;
    case ToolsApi::SHA512:
        out = QCryptographicHash::Sha512;
        return true;
        break;
    }
    return false;
}

}


/**
 * @brief ToolsApi::ToolsApi
 * @param parent
 */
ToolsApi::ToolsApi(QObject *parent) :
    QObject(parent)
{}

/**
 * Compute a HMAC for a given message given a cryptographic key
 * and specific crypto algorithm.
 *
 * @brief ToolsApi::getHmacHash
 * @param message
 * @param algorithm
 * @param key
 * @return HMAC of the message
 */
QString ToolsApi::getHmacHash(
        const QString &message,
        ToolsApi::CryptographicAlgorithm algorithm,
        const QString& key) const
{
    QCryptographicHash::Algorithm
            method = QCryptographicHash::Md5;
    if ( ! enumToQtCryptoAlgorithm(algorithm, method))
    {
        qCritical() << "Invalid HMAC method algorithm";
        return QString();
    }
    QMessageAuthenticationCode
            code(method, key.toUtf8());
    code.addData(message.toUtf8());
    return QString::fromUtf8(code.result().toBase64());
}

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
#include <QUrl>
#include <QString>
#include <QFileInfo>
#include <QFile>


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

QString getSecondLevelDomain(const QUrl& url)
{
    QString tld = url.topLevelDomain();
    QString host = url.host().replace(tld, "");
    QStringList s = host.split(".", QString::SkipEmptyParts);
    return s.size() > 0 ? (s[s.size() - 1] + tld) : tld;
}

}


class ToolsApiPrivate
{
public:
    ToolsApiPrivate()
    {}
};


/**
 * @brief ToolsApi::ToolsApi
 * @param parent
 */
ToolsApi::ToolsApi(QObject *parent) :
    QObject(parent),
    d_ptr(new ToolsApiPrivate())
{}

ToolsApi::~ToolsApi()
{
    delete d_ptr;
    d_ptr = NULL;
}

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


/**
 * @brief ToolsApi::isCompatibleCorsRequest
 * @param requestUrl
 * @param locationUrl
 * @return
 */
bool ToolsApi::areCompatibleCorsUrl(
        const QUrl& url1,
        const QUrl& url2) const
{
    return url1.scheme() == url2.scheme()
        && url1.topLevelDomain() == url2.topLevelDomain()
        && getSecondLevelDomain(url1) == getSecondLevelDomain(url2);
}

QByteArray ToolsApi::fileContent(const QUrl& fileUri) const
{
    QFileInfo fi(fileUri.toLocalFile());
    if (!fi.exists())
    {
        qDebug() << "Unknown file:" << fileUri;
        return QByteArray();
    }

    QFile f(fileUri.toLocalFile());
    if (f.open(QIODevice::ReadOnly))
    {
        return f.readAll();
    }

    return QByteArray();
}

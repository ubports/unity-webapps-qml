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
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
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

QString getSecondLevelDomain(const QUrl& url)
{
    QString tld = url.topLevelDomain();
    QString host = url.host().replace(tld, "");
    QStringList s = host.split(".", QString::SkipEmptyParts);
    return s.size() > 0 ? (s[s.size() - 1] + tld) : tld;
}

bool isCompatibleCorsRequest(
        const QUrl& requestUrl,
        const QUrl& locationUrl)
{
    return requestUrl.scheme() == locationUrl.scheme()
        && requestUrl.topLevelDomain() == locationUrl.topLevelDomain()
        && getSecondLevelDomain(requestUrl) == getSecondLevelDomain(locationUrl);
}

}


class ToolsApiPrivate
{
public:
    ToolsApiPrivate()
        : _currentHttpReply(NULL)
    {}

    bool hasOnGoingHttpRequest() const
    {
        return _currentHttpReply != NULL;
    }

    QNetworkReply* _currentHttpReply;
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

QString ToolsApi::sendHttpRequest(
        const QUrl& url,
        const QUrl& location,
        const QVariant &params,
        const QString& payload)
{
    Q_D(ToolsApi);

    if (! isCompatibleCorsRequest(url, location))
    {
        return QString("Invalid request (cross origin)");
    }
    if (d->hasOnGoingHttpRequest())
    {
        return QString("Cannot send multiple simultaneous requests");
    }
    if (!params.canConvert(QVariant::Map)
            || !params.toMap().contains("verb"))
    {
        return QString("Invalid request content, missing 'verb'");
    }

    QVariantMap m(params.toMap());

    QNetworkRequest request(url.toString());

    if (m.contains("headers")
            && m.value("headers").canConvert(QVariant::Map))
    {
        QVariantMap headers = m.value("headers").toMap();
        Q_FOREACH(const QVariant& name, headers.values())
        {
            request.setRawHeader(
                name.toString().toUtf8(),
                headers.value(name.toString()).toString().toUtf8());
        }
    }

    QNetworkAccessManager manager;

    QString verb = m.value("verb").toString().toLower();
    if (verb == "post")
    {
        d->_currentHttpReply =
                manager.post(request, payload.toUtf8());
    }
    else if (verb == "get")
    {
        d->_currentHttpReply =
                manager.get(request);
    }
    else
    {
        return QString("Invalid request verb");
    }

    QObject::connect(
        d->_currentHttpReply, SIGNAL(finished()),
        this, SLOT(requestFinished()));
    QObject::connect(
        d->_currentHttpReply, SIGNAL(uploadProgress(qint64,qint64)),
        this, SLOT(requestUploadProgress(qint64,qint64)));

    return QString();
}

void ToolsApi::onRequestFinished()
{
    Q_D(ToolsApi);
    if (Q_UNLIKELY(!d->_currentHttpReply))
    {
        Q_EMIT requestFinished(false, "Internal error");
        return;
    }

    QVariant statusCode =
        d->_currentHttpReply->attribute(
            QNetworkRequest::HttpStatusCodeAttribute);
    if (!statusCode.isValid())
    {
        Q_EMIT requestFinished(false, "Invalid reply status code");
        return;
    }
    int status = statusCode.toInt();
    Q_EMIT requestFinished(
        status == 200,
        d->_currentHttpReply->attribute(
            QNetworkRequest::HttpReasonPhraseAttribute).toString());

    QObject::disconnect(
        d->_currentHttpReply, SIGNAL(finished()),
        this, SLOT(requestFinished()));
    QObject::disconnect(
        d->_currentHttpReply, SIGNAL(uploadProgress(qint64,qint64)),
        this, SLOT(requestUploadProgress(qint64,qint64)));

    d->_currentHttpReply->deleteLater();
    d->_currentHttpReply = NULL;
}

void ToolsApi::onRequestUploadProgress(
        qint64 bytesSent, qint64 bytesTotal)
{
    Q_D(ToolsApi);
    if (Q_UNLIKELY(!d->_currentHttpReply))
    {
        return;
    }

    Q_EMIT requestUpdate(((float)bytesSent)/bytesTotal);
}

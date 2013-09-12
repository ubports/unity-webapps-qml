/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of UnityWebappsQML.
 *
 * UnityWebappsQML is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * UnityWebappsQML is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#ifndef __UNITY_WEBAPPS_MEDIA_PLAYER_H__
#define __UNITY_WEBAPPS_MEDIA_PLAYER_H__

#include <QObject>
#include <QQmlParserStatus>

#include "unity-webapps-app-model.h"
#include "unity-webapps-app-infos.h"
#include "callback.h"


class UnityWebappsMediaPlayerPrivate;

class UnityWebappsMediaPlayer: public QObject, public QQmlParserStatus
{
    Q_OBJECT
    Q_INTERFACES(QQmlParserStatus)
    Q_ENUMS(PlaybackState)


public:

    enum PlaybackState {
        PLAYING,
        PAUSED
    };


public:

    UnityWebappsMediaPlayer(QObject * parent = 0);
    virtual ~UnityWebappsMediaPlayer();

    // API functions
    Q_INVOKABLE void onPlayPause (UnityWebappsCallback * callback);
    Q_INVOKABLE void onPrevious (UnityWebappsCallback * callback);
    Q_INVOKABLE void onNext (UnityWebappsCallback * callback);

    Q_INVOKABLE void setTrack (const QString & artist,
                               const QString & album,
                               const QString & title,
                               const QString & artLocation);

    Q_INVOKABLE void setCanGoNext (bool state);
    Q_INVOKABLE void setCanGoPrevious (bool state);
    Q_INVOKABLE void setCanPlay (bool state);
    Q_INVOKABLE void setCanPause (bool state);

    Q_INVOKABLE QString getTrack ();

    Q_INVOKABLE bool getCanGoNext ();
    Q_INVOKABLE bool getCanGoPrevious ();
    Q_INVOKABLE bool getCanPlay ();
    Q_INVOKABLE bool getCanPause ();

    Q_INVOKABLE void setPlaybackState(PlaybackState state);
    Q_INVOKABLE PlaybackState getPlaybackState ();


    // class specific funcs
    void classBegin();
    void componentComplete();


public Q_SLOTS:

    void onAppInfosChanged(UnityWebappsAppInfos *appInfos);


Q_SIGNALS:

    void raised();


private:

    UnityWebappsMediaPlayerPrivate *d_ptr;
    Q_DECLARE_PRIVATE(UnityWebappsMediaPlayer)
};

#endif // __UNITY_WEBAPPS_MEDIA_PLAYER_H__


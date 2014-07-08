TEMPLATE=aux

OTHER_FILES += \
    $$system(ls ./qml/*) \
    $$system(ls ./html/*) \
    $$system(ls ./unity_webapps_qml/emulators/*.py) \
    $$system(ls ./unity_webapps_qml/tests/*.py) \
    $$system(ls ./unity_webapps_qml/*.py) \
    $$system(ls ./data/*/*) \
    unity_webapps_qml/tests/test_installedWebapp.py \
    unity_webapps_qml/tests/fake_servers.py \
    qml/WebviewBackendWebkit.qml \
    qml/WebviewBackendOxide.qml \
    qml/message-server.js

TEMPLATE=subdirs

OTHER_FILES += \
    $$system(ls */*.qml)

EXTRA_EXAMPLE_FILES = launch_basic_webview_api_test \
    launch_webapps_example_bbcnews \
    launch_webapps_model_example \
    unity-webapps-qml-example-app.png

EXAMPLE_DATA_FILES = $$system(find ./data -type f | xargs)
for(file, EXAMPLE_DATA_FILES) {
  OTHER_FILES += $$file
}

DESKTOP_EXAMPLE_FILES = \
    unity-webapps-qml-basic-example.desktop \
    unity-webapps-qml-bbcnews-example.desktop \
    unity-webapps-qml-model-example.desktop

OTHER_FILES += $$EXTRA_EXAMPLE_FILES $$DESKTOP_EXAMPLE_FILES

desktop_files.path = /usr/share/applications
desktop_files.files = $$DESKTOP_EXAMPLE_FILES

other_example_files.path = /usr/share/unity-webapps-qml/examples
other_example_files.files = $$EXTRA_EXAMPLE_FILES

common_data_files.path = /usr/share/unity-webapps-qml/examples/data/userscripts/common
common_data_files.files = $$system(ls data/userscripts/common/*)

bbcnews_userscript_data_files.path = /usr/share/unity-webapps-qml/examples/data/userscripts/unity-webapps-bbcnews
bbcnews_userscript_data_files.files = $$system(ls data/userscripts/unity-webapps-bbcnews/*)

html_data_files.path = /usr/share/unity-webapps-qml/examples/data/html
html_data_files.files = $$system(ls data/html/*)

bbcnews_example_install.path = /usr/share/unity-webapps-qml/examples/unity-webapps-example-bbcnews
bbcnews_example_install.files = $$system(ls unity-webapps-example-bbcnews/*)

basic_webview_install.path = /usr/share/unity-webapps-qml/examples/basic-webview
basic_webview_install.files = $$system(ls basic-webview/*)

webapps_apps_model_install.path = /usr/share/unity-webapps-qml/examples/webapps-apps-model
webapps_apps_model_install.files = $$system(ls webapps-app-model/*)

INSTALLS += other_example_files \
    desktop_files \
    webapps_apps_model_install \
    basic_webview_install \
    bbcnews_example_install \
    common_data_files \
    bbcnews_userscript_data_files \
    html_data_files




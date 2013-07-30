TEMPLATE=subdirs

OTHER_FILES += \
    $$system(ls */*.qml)

EXAMPLE_DATA_FILES = $$system(find ./data -type f | xargs)
for(file, EXAMPLE_DATA_FILES) {
  OTHER_FILES += $$file
}

DESKTOP_EXAMPLE_FILES = \
    unity-webapps-qml-basic-example.desktop \
    unity-webapps-qml-bbcnews-example.desktop \
    unity-webapps-qml-facebookmessenger-example.desktop \
    unity-webapps-qml-model-example.desktop

OTHER_FILES += $$DESKTOP_EXAMPLE_FILES

desktop_files.path = /usr/share/applications
desktop_files.files = $$DESKTOP_EXAMPLE_FILES

common_data_files.path = /usr/share/unity-webapps-qml/examples/data/userscripts/common
common_data_files.files = $$system(ls data/userscripts/common/*)

bbcnews_userscript_data_files.path = /usr/share/unity-webapps-qml/examples/data/userscripts/unity-webapps-bbcnews
bbcnews_userscript_data_files.files = $$system(ls data/userscripts/unity-webapps-bbcnews/*)

html_data_files.path = /usr/share/unity-webapps-qml/examples/data/html
html_data_files.files = $$system(ls data/html/*)

bbcnews_example_install.path = /usr/share/unity-webapps-qml/examples/unity-webapps-example-bbcnews
bbcnews_example_install.files = $$system(ls unity-webapps-example-bbcnews/*)

facebookmessenger_example_install.path = /usr/share/unity-webapps-qml/examples/unity-webapps-example-facebookmessenger
facebookmessenger_example_install.files = $$system(ls unity-webapps-example-facebookmessenger/*)

basic_webview_install.path = /usr/share/unity-webapps-qml/examples/basic-webview
basic_webview_install.files = $$system(ls basic-webview/*)

webapps_apps_model_install.path = /usr/share/unity-webapps-qml/examples/webapps-apps-model
webapps_apps_model_install.files = $$system(ls webapps-app-model/*)

INSTALLS += desktop_files \
    webapps_apps_model_install \
    basic_webview_install \
    bbcnews_example_install \
    common_data_files \
    bbcnews_userscript_data_files \
    facebookmessenger_example_install \
    html_data_files



#-----------------------------------------------------------------------------
# Common configuration for all projects.
#-----------------------------------------------------------------------------

# we don't like warnings...
QMAKE_CXXFLAGS += -Werror -Wno-write-strings

# Disable RTTI
QMAKE_CXXFLAGS += -fno-rtti

TOP_SRC_DIR     = $$PWD
TOP_BUILD_DIR   = $${TOP_SRC_DIR}/$${BUILD_DIR}

# appropriately select pkgconfig for cross compiling
PKG_CONFIG_ARCH = $$section(QMAKE_CC, -, 0, -2)
!isEmpty (PKG_CONFIG_ARCH) {
    PKG_CONFIG = $$PKG_CONFIG_ARCH-pkg-config
}

include(coverage.pri)


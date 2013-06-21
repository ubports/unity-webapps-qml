#!/usr/bin/env python

import SocketServer
import SimpleHTTPServer
import urllib

PORT = 8181

class Proxy(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/unity-integration.html'
        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

httpd = SocketServer.TCPServer(('0.0.0.0', PORT), Proxy)
print "serving at port", PORT
httpd.serve_forever()


import http.server, os

os.chdir('/Users/alejandroarab/Documents/alejandro-arab')
handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('', 8080), handler)
httpd.serve_forever()

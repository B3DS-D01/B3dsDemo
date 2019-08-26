"""App entry point."""
from application import create_app
import os
import sys
import socket
import traceback

app = create_app()
  
if __name__ == "__main__":
  try:
    if len(sys.argv) < 2:
      raise InvalidNoOfArguments
  except InvalidNoOfArguments:
    print ("Error: you didn't specify port no. Check your config file or documentation")
    sys.exit("Chat-Bot server cannot started due to invalid/missing port")
  app.run(host='0.0.0.0',port=sys.argv[1], debug=False, threaded=True)
  

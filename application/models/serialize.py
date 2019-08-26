"""Database models."""
from datetime import datetime
import json
				
''' user response to survey. It stores what options of survey the users have choosen'''
class Serialize(mongodb.Document):

    def encode_model(self, obj, recursive=False):
      if obj is None:
        return obj
      if isinstance(obj, (mongodb.Document, mongodb.DocumentField)):
        out = dict(obj.wrap())
        for k,v in out.items():
          if isinstance(v, mongodb.ObjectId):
            if k is None:
              out['_id'] = str(v)
              del(out[k])
            else:
              # Unlikely that we'll hit this since ObjectId is always NULL key
              out[k] = str(v)
          else:
            out[k] = self.encode_model(v)
      elif isinstance(obj, (list)):
        out = [self.encode_model(item) for item in obj]
      elif isinstance(obj, (dict)):
        out = dict([(k,self.encode_model(v)) for (k,v) in obj.items()])
      elif isinstance(obj, datetime):
        out = str(obj)
      elif isinstance(obj, mongodb.ObjectId):
        out = {'ObjectId':str(obj)}
      elif isinstance(obj, (str, mongodb.StringField)):
        out = obj
      elif isinstance(obj, mongodb.FloatField):
        out = str(obj)
      elif isinstance(obj, int):
        out = str(obj)
      else:
        raise TypeError("Could not JSON-encode type '%s': %s" % (type(obj), str(obj)))
      return out
	

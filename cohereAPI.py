import cohere

co = cohere.Client('8FvFO3RxnSyE9282oQtSXPuz8wIueWk0CLm60xif') # This is your trial API key

def classifyData(data):
  response = co.classify(
  model='846ec1d9-de2d-498d-95d2-ffd1b8710a79-ft',
  inputs = data)

  return response

def summarizeData(data):
  response = co.summarize(text = data, stream = True)
  return response

def generateData(data):
  response = co.generate(prompt = data, stream= True)
  return response
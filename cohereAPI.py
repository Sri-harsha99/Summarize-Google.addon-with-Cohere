import cohere

co = cohere.Client('8FvFO3RxnSyE9282oQtSXPuz8wIueWk0CLm60xif') # This is your trial API key
response = co.classify(
  model='846ec1d9-de2d-498d-95d2-ffd1b8710a79-ft',
  inputs=["Hi Harsha, 404 people looked you up in the last 90 days. See who they are with an exclusive offer for Premium. Come back and get 50% off Premium for 2 months. Don't miss out on your chance to meet your next employer, customer, or business partner."])

print('The confidence levels of the labels are: {}'.format(response.classifications))
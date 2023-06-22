from datetime import datetime, timedelta
from getMailBody import getMailBody
def get_today_emails(service):
    # Get today's date in RFC 3339 format
    yesterday = datetime.now() - timedelta(days=1)
    yesterday= yesterday.strftime('%Y-%m-%dT00:00:00Z')
    print(yesterday)
    # Construct the query parameter for filtering emails by received date
    query = "after:2023/6/20 before:2023/6/23"
    print(query)
    # Make the API request to retrieve emails
    results = service.users().messages().list(userId='me', q=query).execute()
    print(results)
    emails = results.get('messages', [])

    if not emails:
        print('No emails found.')
    else:
        print('Today\'s Emails:')
        for email in emails:
            email_data = service.users().messages().get(userId='me', id=email['id']).execute()
            payload = email_data['payload']
            body = getMailBody(payload)
            print(body)


from datetime import datetime, timedelta
from getMailBody import getMailBody
import mailparser
import base64
import email as emailParser
import html2text

html = html2text.HTML2Text()
# Ignore converting links from HTML
html.ignore_links = True

def get_today_emails(service):
    # Get today's date in RFC 3339 format
    yesterday = datetime.now() - timedelta(days=1)
    yesterday= yesterday.strftime('%Y-%m-%dT00:00:00Z')
    print(yesterday)
    # Construct the query parameter for filtering emails by received date
    query = "after:2023/6/21 before:2023/6/24"
    print(query)
    # Make the API request to retrieve emails
    results = service.users().messages().list(userId='me', q=query).execute()
    emails = results.get('messages', [])

    emailData = []
    
    if not emails:
        print('No emails found.')
    else:
        print('Today\'s Emails:')
        for email in emails:
            email_data = service.users().messages().get(userId='me', id=email['id']).execute()
            body = email_data['snippet']
            # mime_msg = emailParser.message_from_bytes(base64.urlsafe_b64decode(email_data['raw']))
            # message_main_type = mime_msg.get_content_maintype()

            # if message_main_type == 'multipart':
            #     for part in mime_msg.get_payload():
            #         if part.get_content_maintype() == 'text':
            #             body = part.get_payload()
            #             body = html.handle(body)
            #             print(body)
            # elif message_main_type == 'text':
            #     body = mime_msg.get_payload()
            #     body = html.handle(body)
            print(body)
            
            emailData.append(body)
    return emailData


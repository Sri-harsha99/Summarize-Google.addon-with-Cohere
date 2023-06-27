import base64

def getMailBody(payload):
    # Get the body of the email
    if 'parts' in payload:
        # Iterate over parts to find the plain text body
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain':
                body_content = part['body'].get('data')
                if body_content:
                    decoded_body = base64.urlsafe_b64decode(body_content).decode('utf-8')
                    return decoded_body

    # If no plain text body is found, return None or handle accordingly
    return None

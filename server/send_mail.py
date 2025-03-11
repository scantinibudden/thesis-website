import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_SEND_INTERVAL = 5 * 60
EMAIL_FILE = "emails.txt"
SENDER_EMAIL = 'experimentos.neuroling@gmail.com'
SENDER_PASSWORD = 'prcm ibfo mlyw qlod'
SUBJECT = 'Continúa completando historias en "Jugá a ser ChatGPT"'
BODY = """
<html>
  <body>
    <p>Hola,</p>
    <p>Queríamos agradecerte por haber participado en nuestro experimento "Jugá a ser ChatGPT". Notamos que ya completaste algunas historias, ¡pero aún te faltan algunas para terminar!</p>
    <p>Tu participación es clave para ayudarnos a entender mejor cómo se compara nuestra cognición con los modelos computacionales del lenguaje. Solo te tomará unos minutos más, y cada historia adicional que completes hace una gran diferencia.</p>
    <p>Podés continuar desde donde lo dejaste haciendo click <a href="https://thesis-experiment.vercel.app/">acá</a>.</p>
    <p>¡Gracias por tu ayuda!</p>
    <p>Saludos,<br>Laboratorio de Inteligencia Artificial Aplicada</p>
  </body>
</html>
"""

def send_email(receiver_email):
    # Set up the MIME
    message = MIMEMultipart()
    message['From'] = SENDER_EMAIL
    message['To'] = receiver_email
    message['Subject'] = SUBJECT
    message.attach(MIMEText(BODY, 'html'))

    try:
        # Log in to the SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Upgrade the connection to secure
        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        # Send the email
        server.sendmail(SENDER_EMAIL, receiver_email, message.as_string())

        # Close the connection
        server.quit()

        print("Email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")

with open(EMAIL_FILE, 'r') as file:
    count = 1
    for email in file:
        email = email.strip()  # Prints the list of parts
        print(f"Sending email {count}: {email}") # TODO add timestamp
        send_email(email)
        time.sleep(EMAIL_SEND_INTERVAL)
        count += 1

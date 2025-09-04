# test_env.py
from core.config import settings

print("SECRET_KEY:", settings.SECRET_KEY)
print("MAIL_PORT:", settings.MAIL_PORT)
print("MAIL_STARTTLS:", settings.MAIL_STARTTLS)

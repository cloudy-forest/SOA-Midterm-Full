import redis.asyncio  as redis

from core.config import settings

print("REDIS_URL:", settings.REDIS_URL)  #  Dòng kiểm tra

redis_client = redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True
)


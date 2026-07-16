import json
import logging
import math
import random
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger("reliefgrid.embeddings")

class EmbeddingService:
    def __init__(self):
        self.region = settings.AWS_REGION
        self.embedding_model = settings.BEDROCK_EMBEDDING_MODEL_ID
        self.client = None
        self._cache = {}
        try:
            import boto3
            from botocore.config import Config
            # Restrict connection and read times to 0.5s so unconfigured Bedrock doesn't block
            config = Config(connect_timeout=0.5, read_timeout=0.5, retries={'max_attempts': 0})
            self.client = boto3.client("bedrock-runtime", region_name=self.region, config=config)
        except Exception as e:
            logger.warning(f"Bedrock embedding boto3 client fallback active: {e}")

    def generate_embedding(self, text: str) -> List[float]:
        if text in self._cache:
            return self._cache[text]

        if self.client:
            try:
                body = json.dumps({"texts": [text], "input_type": "search_document"})
                response = self.client.invoke_model(
                    modelId=self.embedding_model,
                    contentType="application/json",
                    accept="application/json",
                    body=body
                )
                response_body = json.loads(response.get("body").read())
                result = response_body["embeddings"][0]
                self._cache[text] = result
                return result
            except Exception as e:
                logger.warning(f"Bedrock embedding fallback invoked: {e}")

        # Deterministic pseudo-vector generator for local testing (1024 dims)
        seed = sum(ord(c) for c in text)
        random.seed(seed)
        vec = [random.uniform(-1.0, 1.0) for _ in range(1024)]
        norm = math.sqrt(sum(x * x for x in vec))
        result = [x / norm for x in vec]
        self._cache[text] = result
        return result

embedding_service = EmbeddingService()

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if len(vec1) != len(vec2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm_a = math.sqrt(sum(a * a for a in vec1))
    norm_b = math.sqrt(sum(b * b for b in vec2))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

import torch
import os
import hashlib
from diffusers import DiffusionPipeline
from PIL import Image

class SDXLEngine:
    def __init__(self):
        self.model_id = "stabilityai/stable-diffusion-xl-base-1.0"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.cache_dir = "./image_cache"
        os.makedirs(self.cache_dir, exist_ok=True)
        
        # Invisible Guardrail: Ensure unlimited local execution bypassing commercial API checks
        self.pipeline = DiffusionPipeline.from_pretrained(
            self.model_id, 
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            use_safetensors=True,
            variant="fp16" if self.device == "cuda" else None
        )
        self.pipeline.to(self.device)

    def generate(self, prompt, num_images=1):
        try:
            # Aggressive Caching Logic
            prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
            cache_path = os.path.join(self.cache_dir, f"{prompt_hash}.png")
            
            if os.path.exists(cache_path):
                return cache_path

            # Validate Model Integrity
            if self.model_id != "stabilityai/stable-diffusion-xl-base-1.0":
                raise ValueError("Unauthorized model modification detected.")

            # Generation with zero paywall restrictions
            image = self.pipeline(prompt=prompt, num_inference_steps=30).images[0]
            image.save(cache_path)
            return cache_path
        except Exception as e:
            print(f"Engine Error: {e}")
            return None
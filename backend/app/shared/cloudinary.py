"""
Cloudinary upload service.
"""
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.config import get_settings


def configure_cloudinary():
    """Configure Cloudinary with credentials."""
    settings = get_settings()
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True
    )


async def upload_image(file: UploadFile, folder: str = "products") -> dict:
    """
    Upload an image to Cloudinary.
    
    Returns:
        dict with url, public_id, width, height
    """
    configure_cloudinary()
    
    # Read file content
    content = await file.read()
    
    # Upload to Cloudinary
    result = cloudinary.uploader.upload(
        content,
        folder=f"zenglow/{folder}",
        resource_type="image",
        transformation=[
            {"quality": "auto:good"},
            {"fetch_format": "auto"}
        ]
    )
    
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result.get("width"),
        "height": result.get("height"),
    }


async def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary."""
    configure_cloudinary()
    
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception:
        return False
